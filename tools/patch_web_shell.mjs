import fs from 'node:fs';
import path from 'node:path';

const targets = process.argv.slice(2);

if (targets.length === 0) {
  console.error('Usage: node patch_web_shell.mjs <dir> [dir...]');
  process.exit(1);
}

const cssPatch = `

/* codex-web-shell */
html, body {
\twidth: 100%;
\theight: 100%;
}

body {
\tdisplay: flex;
\tjustify-content: center;
\talign-items: center;
\tpadding: 24px;
\tbox-sizing: border-box;
\tbackground:
\t\tradial-gradient(circle at top, rgba(90, 120, 255, 0.18), transparent 42%),
\t\tlinear-gradient(180deg, #0f1014 0%, #06070a 100%);
}

#canvas {
\tmargin: auto;
\tbox-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
\tborder-radius: 18px;
\tbackground: #000;
}
`;

const scriptPatch = `
\t\t<script id="codex-web-shell-patch">
\t\t(function () {
\t\t\tconst canvas = document.getElementById('canvas');
\t\t\tif (!canvas) {
\t\t\t\treturn;
\t\t\t}

\t\t\tfunction fitCanvas() {
\t\t\t\tconst width = canvas.width || canvas.clientWidth;
\t\t\t\tconst height = canvas.height || canvas.clientHeight;
\t\t\t\tif (!width || !height) {
\t\t\t\t\treturn;
\t\t\t\t}

\t\t\t\tconst safeWidth = Math.max(window.innerWidth - 48, 320);
\t\t\t\tconst safeHeight = Math.max(window.innerHeight - 48, 320);
\t\t\t\tconst scale = Math.min(safeWidth / width, safeHeight / height);

\t\t\t\tcanvas.style.width = Math.max(1, Math.floor(width * scale)) + 'px';
\t\t\t\tcanvas.style.height = Math.max(1, Math.floor(height * scale)) + 'px';
\t\t\t}

\t\t\twindow.addEventListener('resize', fitCanvas);
\t\t\tif (typeof ResizeObserver !== 'undefined') {
\t\t\t\tnew ResizeObserver(fitCanvas).observe(canvas);
\t\t\t}

\t\t\tlet attempts = 0;
\t\t\tconst interval = setInterval(() => {
\t\t\t\tfitCanvas();
\t\t\t\tattempts += 1;
\t\t\t\tif (attempts > 180) {
\t\t\t\t\tclearInterval(interval);
\t\t\t\t}
\t\t\t}, 250);

\t\t\tfitCanvas();
\t\t}());
\t\t</script>
`;

for (const target of targets) {
  const filePath = path.join(target, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip missing file: ${filePath}`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('codex-web-shell')) {
    html = html.replace('</style>', `${cssPatch}\n\t\t</style>`);
  }

  if (!html.includes('codex-web-shell-patch')) {
    html = html.replace('</body>', `${scriptPatch}\n\t</body>`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Patched ${filePath}`);
}
