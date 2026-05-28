import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(rootDir, 'dist');
const expectedPrefix = `${rootDir}${path.sep}`;

if (!distDir.startsWith(expectedPrefix) || path.basename(distDir) !== 'dist') {
  throw new Error(`拒绝清理异常构建目录: ${distDir}`);
}

fs.rmSync(distDir, { recursive: true, force: true });
console.log(`已清理构建目录：${path.relative(rootDir, distDir)}`);
