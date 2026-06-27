import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const playRoot = resolve(__dirname, '..', 'deploy', 'r2-play');
const requiredSlugs = [
  'first-tetris',
  'next-spacewar',
  'intespace',
  'raiden',
  'space-war',
  'spacewar-ii',
];

function readArg(name) {
  const prefix = `--${name}=`;
  const exact = `--${name}`;
  const index = process.argv.findIndex((arg) => arg === exact);
  if (index >= 0) {
    return process.argv[index + 1];
  }
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  return inline ? inline.slice(prefix.length) : undefined;
}

function walkFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

function contentType(filePath) {
  switch (extname(filePath).toLowerCase()) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.wasm':
      return 'application/wasm';
    case '.pck':
      return 'application/octet-stream';
    case '.png':
      return 'image/png';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

function cacheControl(filePath) {
  return extname(filePath).toLowerCase() === '.html'
    ? 'public, max-age=60'
    : 'public, max-age=31536000, immutable';
}

const bucket = readArg('bucket') ?? process.env.R2_PLAY_BUCKET ?? process.env.CLOUDFLARE_R2_BUCKET;
const prefix = (readArg('prefix') ?? process.env.R2_PLAY_PREFIX ?? '').replace(/^\/+|\/+$/g, '');
const dryRun = process.argv.includes('--dry-run');

if (!bucket) {
  console.error('Missing R2 bucket name.');
  console.error('Pass --bucket <name> or set R2_PLAY_BUCKET.');
  process.exit(1);
}

if (!existsSync(playRoot)) {
  console.error(`Missing play export directory: ${playRoot}`);
  console.error('Run npm run play:export before uploading.');
  process.exit(1);
}

for (const slug of requiredSlugs) {
  const slugDir = join(playRoot, slug);
  const requiredFiles = ['index.html', 'index.js', 'index.wasm', 'index.pck'];
  for (const fileName of requiredFiles) {
    const filePath = join(slugDir, fileName);
    if (!existsSync(filePath)) {
      console.error(`Missing required export file: ${filePath}`);
      process.exit(1);
    }
  }
}

const files = walkFiles(playRoot);
if (files.length === 0) {
  console.error(`No files found under ${playRoot}`);
  process.exit(1);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
console.log(`Uploading ${files.length} files from ${playRoot} to R2 bucket ${bucket}`);

for (const filePath of files) {
  const rel = relative(playRoot, filePath).split(sep).join('/');
  const objectKey = prefix ? `${prefix}/${rel}` : rel;
  const objectPath = `${bucket}/${objectKey}`;
  const args = [
    'wrangler',
    'r2',
    'object',
    'put',
    objectPath,
    '--remote',
    '--force',
    '--file',
    filePath,
    '--content-type',
    contentType(filePath),
    '--cache-control',
    cacheControl(filePath),
  ];

  const size = statSync(filePath).size;
  console.log(`${objectKey} (${size} bytes)`);

  if (dryRun) {
    console.log(`  ${[npx, ...args].join(' ')}`);
    continue;
  }

  const result = spawnSync(npx, args, { stdio: 'inherit', shell: false });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('R2 play upload complete.');
