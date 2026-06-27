import { createServer } from 'node:http';
import { stat, readFile, mkdir } from 'node:fs/promises';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', 'deploy', 'r2-play');
const screenshotDir = resolve(__dirname, '..', 'output', 'playwright', 'r2-play-check');

const slugs = [
  'first-tetris',
  'next-spacewar',
  'intespace',
  'raiden',
  'space-war',
  'spacewar-ii',
];

const viewports = [
  { name: 'desktop', width: 1365, height: 768, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.pck', 'application/octet-stream'],
  ['.png', 'image/png'],
  ['.ico', 'image/x-icon'],
]);

function contentType(filePath) {
  return mimeTypes.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream';
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, 'http://127.0.0.1');
  const rawPath = decodeURIComponent(url.pathname);
  const withIndex = rawPath.endsWith('/') ? `${rawPath}index.html` : rawPath;
  const filePath = normalize(join(root, withIndex));
  const rel = relative(root, filePath);

  if (rel.startsWith('..') || normalize(rel).startsWith(`..\\`) || normalize(rel).startsWith('../')) {
    return null;
  }

  return filePath;
}

async function startStaticServer() {
  const server = createServer(async (req, res) => {
    const filePath = resolveRequestPath(req.url ?? '/');
    if (!filePath) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    try {
      const info = await stat(filePath);
      const resolvedFile = info.isDirectory() ? join(filePath, 'index.html') : filePath;
      const body = await readFile(resolvedFile);
      res.writeHead(200, {
        'Content-Type': contentType(resolvedFile),
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'same-origin',
      });
      res.end(body);
    } catch (error) {
      res.writeHead(404);
      res.end(`Not found: ${req.url}`);
    }
  });

  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  const address = server.address();
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

async function sampleCanvas(page) {
  return page.evaluate(async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      return { ok: false, reason: 'missing-canvas' };
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let last = null;

    for (let attempt = 0; attempt < 24; attempt += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await sleep(250);

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.min(128, Math.floor(rect.width || canvas.width || 1)));
      const height = Math.max(1, Math.min(96, Math.floor(rect.height || canvas.height || 1)));
      const probe = document.createElement('canvas');
      probe.width = width;
      probe.height = height;

      try {
        const ctx = probe.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(canvas, 0, 0, width, height);
        const data = ctx.getImageData(0, 0, width, height).data;
        let opaque = 0;
        let lit = 0;
        let minLuma = 255;
        let maxLuma = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a > 0) {
            opaque += 1;
          }

          const luma = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
          minLuma = Math.min(minLuma, luma);
          maxLuma = Math.max(maxLuma, luma);

          if (a > 0 && (r + g + b) > 18) {
            lit += 1;
          }
        }

        const total = width * height;
        last = {
          attempt,
          width,
          height,
          opaque,
          lit,
          lumaRange: maxLuma - minLuma,
        };

        if (opaque > total * 0.8 && (lit > total * 0.004 || maxLuma - minLuma > 8)) {
          return { ok: true, ...last };
        }
      } catch (error) {
        return { ok: false, reason: `pixel-read-failed: ${error.message}` };
      }
    }

    return { ok: false, reason: 'canvas-still-blank', ...last };
  });
}

async function inspectLayout(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const rect = canvas?.getBoundingClientRect();
    const status = document.querySelector('#status');
    const notice = document.querySelector('#status-notice');
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    return {
      viewport,
      canvas: rect ? {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        backingWidth: canvas.width,
        backingHeight: canvas.height,
      } : null,
      scroll: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      status: status ? {
        visible: getComputedStyle(status).visibility !== 'hidden' && getComputedStyle(status).display !== 'none',
        text: notice?.textContent?.trim() ?? '',
      } : null,
    };
  });
}

function layoutFailures(layout) {
  const failures = [];
  if (!layout.canvas) {
    return ['missing canvas layout'];
  }

  const { canvas, viewport, scroll } = layout;
  const tolerance = 2;
  if (canvas.width < 120 || canvas.height < 120) {
    failures.push(`canvas too small (${Math.round(canvas.width)}x${Math.round(canvas.height)})`);
  }
  if (canvas.left < -tolerance || canvas.top < -tolerance || canvas.right > viewport.width + tolerance || canvas.bottom > viewport.height + tolerance) {
    failures.push('canvas exceeds viewport');
  }
  if (scroll.width > viewport.width + tolerance || scroll.height > viewport.height + tolerance) {
    failures.push(`page scrolls (${scroll.width}x${scroll.height} over ${viewport.width}x${viewport.height})`);
  }
  if (Math.abs((canvas.left + canvas.width / 2) - viewport.width / 2) > 6) {
    failures.push('canvas is not horizontally centered');
  }
  if (Math.abs((canvas.top + canvas.height / 2) - viewport.height / 2) > 6) {
    failures.push('canvas is not vertically centered');
  }
  if (layout.status?.text) {
    failures.push(`status notice visible: ${layout.status.text}`);
  }

  return failures;
}

async function runCheck(browser, baseUrl, slug, viewport) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    hasTouch: viewport.isMobile,
    deviceScaleFactor: viewport.isMobile ? 2 : 1,
  });
  const networkFailures = [];
  const consoleErrors = [];

  page.on('response', (response) => {
    if (response.status() >= 400) {
      networkFailures.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });

  const url = `${baseUrl}/${slug}/index.html`;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForSelector('canvas', { state: 'visible', timeout: 60_000 });
    await page.waitForFunction(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        return false;
      }
      const rect = canvas.getBoundingClientRect();
      return canvas.width >= 120 && canvas.height >= 120 && rect.width >= 120 && rect.height >= 120;
    }, null, { timeout: 90_000 });

    await page.mouse.click(Math.floor(viewport.width / 2), Math.floor(viewport.height / 2));
    const canvas = await sampleCanvas(page);
    const layout = await inspectLayout(page);
    const failures = [...networkFailures, ...layoutFailures(layout)];

    if (!canvas.ok) {
      failures.push(`canvas not visibly rendered (${canvas.reason ?? 'unknown'})`);
    }

    if (failures.length > 0) {
      await mkdir(screenshotDir, { recursive: true });
      const screenshotPath = join(screenshotDir, `${slug}-${viewport.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      return { ok: false, slug, viewport: viewport.name, failures, canvas, layout, consoleErrors, screenshotPath };
    }

    return { ok: true, slug, viewport: viewport.name, canvas, layout, consoleErrors };
  } catch (error) {
    await mkdir(screenshotDir, { recursive: true });
    const screenshotPath = join(screenshotDir, `${slug}-${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false }).catch(() => {});
    return {
      ok: false,
      slug,
      viewport: viewport.name,
      failures: [error.message],
      consoleErrors,
      screenshotPath,
    };
  } finally {
    await page.close().catch(() => {});
  }
}

const { server, baseUrl } = await startStaticServer();
console.log(`Serving ${root}`);
console.log(`Base URL ${baseUrl}`);

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const slug of slugs) {
    for (const viewport of viewports) {
      const result = await runCheck(browser, baseUrl, slug, viewport);
      results.push(result);
      const marker = result.ok ? 'PASS' : 'FAIL';
      const canvasInfo = result.canvas ? `canvas ${result.canvas.width ?? '?'}x${result.canvas.height ?? '?'} lit=${result.canvas.lit ?? '?'}` : 'canvas ?';
      console.log(`${marker} ${slug} ${viewport.name} ${canvasInfo}`);
      if (!result.ok) {
        for (const failure of result.failures) {
          console.log(`  - ${failure}`);
        }
        if (result.screenshotPath) {
          console.log(`  screenshot: ${result.screenshotPath}`);
        }
      }
    }
  }
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolveClose) => server.close(resolveClose));
}

const failed = results.filter((result) => !result.ok);
if (failed.length > 0) {
  console.error(`R2 play export check failed: ${failed.length}/${results.length}`);
  process.exit(1);
}

console.log(`R2 play export check passed: ${results.length}/${results.length}`);
