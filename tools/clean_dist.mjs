import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(rootDir, 'dist');
const astroCacheDir = path.resolve(rootDir, '.astro');
const expectedPrefix = `${rootDir}${path.sep}`;

if (!distDir.startsWith(expectedPrefix) || path.basename(distDir) !== 'dist') {
  throw new Error(`拒绝清理异常构建目录: ${distDir}`);
}

if (!astroCacheDir.startsWith(expectedPrefix) || path.basename(astroCacheDir) !== '.astro') {
  throw new Error(`拒绝清理异常 Astro 缓存目录: ${astroCacheDir}`);
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.rmSync(astroCacheDir, { recursive: true, force: true });
console.log(`已清理构建目录：${path.relative(rootDir, distDir)}`);
console.log(`已清理 Astro 内容缓存：${path.relative(rootDir, astroCacheDir)}`);
