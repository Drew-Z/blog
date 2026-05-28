import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const siteOrigin = 'https://blog.playlab.eu.cc';

function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath, predicate));
      continue;
    }

    if (predicate(absolutePath)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function isExternalUrl(value) {
  return /^(?:[a-z]+:)?\/\//i.test(value) && !value.startsWith(siteOrigin);
}

function isIgnoredUrl(value) {
  return (
    !value ||
    value.startsWith('#') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('data:') ||
    value.startsWith('javascript:') ||
    isExternalUrl(value)
  );
}

function toLocalPath(value) {
  if (isIgnoredUrl(value)) {
    return undefined;
  }

  let urlPath = value.startsWith(siteOrigin) ? value.slice(siteOrigin.length) : value;
  if (!urlPath.startsWith('/')) {
    return undefined;
  }

  urlPath = urlPath.split('#')[0].split('?')[0];
  if (!urlPath) {
    urlPath = '/';
  }

  try {
    return decodeURIComponent(urlPath);
  } catch {
    return urlPath;
  }
}

function localPathExists(urlPath) {
  const normalizedPath = urlPath.replace(/^\/+/, '');

  if (urlPath === '/') {
    return fs.existsSync(path.join(distDir, 'index.html'));
  }

  const exactFile = path.join(distDir, normalizedPath);
  if (fs.existsSync(exactFile) && fs.statSync(exactFile).isFile()) {
    return true;
  }

  if (urlPath.endsWith('/')) {
    return fs.existsSync(path.join(distDir, normalizedPath, 'index.html'));
  }

  return (
    fs.existsSync(path.join(distDir, normalizedPath, 'index.html')) ||
    fs.existsSync(path.join(distDir, `${normalizedPath}.html`))
  );
}

function extractRefs(source) {
  const refs = new Set();
  const attributePattern = /\b(?:href|src|content|url)=["']([^"']+)["']/gi;
  const xmlUrlPattern = /https:\/\/blog\.playlab\.eu\.cc\/[^\s<"]*/g;

  for (const match of source.matchAll(attributePattern)) {
    refs.add(match[1]);
  }

  for (const match of source.matchAll(xmlUrlPattern)) {
    refs.add(match[0]);
  }

  return [...refs];
}

const distFiles = walkFiles(distDir, (file) => /\.(?:html|xml|txt|css|js)$/.test(file));
const missing = [];

for (const file of distFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const relativeFile = path.relative(rootDir, file);

  for (const ref of extractRefs(source)) {
    const localPath = toLocalPath(ref);
    if (!localPath) {
      continue;
    }

    if (!localPathExists(localPath)) {
      missing.push({ ref, localPath, file: relativeFile });
    }
  }
}

if (missing.length > 0) {
  console.error('构建产物链接检查失败');
  for (const item of missing) {
    console.error(`- ${item.ref}`);
    console.error(`  解析路径: ${item.localPath}`);
    console.error(`  来源: ${item.file}`);
  }
  process.exit(1);
}

console.log(`构建产物链接检查通过：扫描 ${distFiles.length} 个文件`);
