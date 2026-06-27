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
\tposition: fixed;
\tinset: 0;
\tmin-height: 100%;
\tpadding: clamp(12px, 3vw, 28px);
\tbox-sizing: border-box;
\tbackground:
\t\tradial-gradient(ellipse 46% 58% at 18% 18%, rgba(255, 211, 110, 0.16), transparent 68%),
\t\tradial-gradient(ellipse 52% 62% at 76% 24%, rgba(111, 124, 255, 0.22), transparent 70%),
\t\tlinear-gradient(180deg, #0f1529 0%, #05070d 100%);
\toverflow: hidden;
}

#canvas {
\tposition: fixed !important;
\tleft: 50% !important;
\ttop: 50% !important;
\ttransform: translate(-50%, -50%);
\tmargin: 0 !important;
\tbox-sizing: border-box;
\tbox-shadow: 0 22px 72px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(210, 225, 255, 0.18);
\tborder-radius: 8px;
\tbackground: #000;
\tmax-width: calc(100vw - 24px);
\tmax-height: calc(100vh - 24px);
}

@media (max-width: 720px) {
\tbody {
\t\tpadding: 10px;
\t}
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

\t\t\t\tconst margin = window.innerWidth < 720 ? 20 : 56;
\t\t\t\tconst safeWidth = Math.max(window.innerWidth - margin, 280);
\t\t\t\tconst safeHeight = Math.max(window.innerHeight - margin, 280);
\t\t\t\tconst scale = Math.min(safeWidth / width, safeHeight / height);

\t\t\t\tcanvas.style.width = Math.max(1, Math.floor(width * scale)) + 'px';
\t\t\t\tcanvas.style.height = Math.max(1, Math.floor(height * scale)) + 'px';
\t\t\t\tcanvas.style.position = 'fixed';
\t\t\t\tcanvas.style.left = '50%';
\t\t\t\tcanvas.style.top = '50%';
\t\t\t\tcanvas.style.transform = 'translate(-50%, -50%)';
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
  html = html.replace(/\n\n\/\* codex-web-shell \*\/[\s\S]*?(?=\n\s*<\/style>)/, '');
  html = html.replace('</style>', `${cssPatch}\n\t\t</style>`);

  html = html.replace(/\n\s*<script id="codex-web-shell-patch">[\s\S]*?<\/script>\s*/g, '\n');
  html = html.replace('</body>', `${scriptPatch}\n\t</body>`);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Patched ${filePath}`);
}
