import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

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

const projectName =
  readArg('project') ??
  readArg('project-name') ??
  process.env.CLOUDFLARE_PAGES_PROJECT ??
  process.env.CF_PAGES_PROJECT;

const branch = readArg('branch') ?? process.env.CLOUDFLARE_PAGES_BRANCH ?? 'main';
const distDir = resolve(readArg('dir') ?? 'dist');
const dryRun = process.argv.includes('--dry-run');

if (!projectName) {
  console.error('Missing Cloudflare Pages project name.');
  console.error('Pass --project <name> or set CLOUDFLARE_PAGES_PROJECT.');
  process.exit(1);
}

if (!existsSync(distDir)) {
  console.error(`Missing build output directory: ${distDir}`);
  console.error('Run npm run build or npm run verify before deploying.');
  process.exit(1);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = [
  'wrangler',
  'pages',
  'deploy',
  distDir,
  '--project-name',
  projectName,
  '--branch',
  branch,
  '--commit-dirty',
  'true',
];

console.log(`Deploying ${distDir} to Cloudflare Pages project ${projectName} (${branch})`);
if (dryRun) {
  console.log([npx, ...args].join(' '));
  process.exit(0);
}

const result = spawnSync(npx, args, { stdio: 'inherit', shell: false });
process.exit(result.status ?? 1);
