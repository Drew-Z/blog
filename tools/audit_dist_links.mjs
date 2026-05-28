import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
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

function extractJsonLd(source) {
  const scripts = [];
  const scriptPattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  for (const match of source.matchAll(scriptPattern)) {
    scripts.push(match[1].trim());
  }

  return scripts;
}

function toSchemaNodes(value) {
  if (!value || typeof value !== 'object') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(toSchemaNodes);
  }

  const graph = value['@graph'];
  return [value, ...(Array.isArray(graph) ? graph.flatMap(toSchemaNodes) : [])];
}

function hasSchemaType(nodes, type) {
  return nodes.some((node) => {
    const nodeType = node['@type'];
    return Array.isArray(nodeType) ? nodeType.includes(type) : nodeType === type;
  });
}

function requiredSchemaTypes(relativeFile) {
  const normalized = relativeFile.replace(/\\/g, '/');
  const publicSource = normalized.startsWith('dist/')
    ? path.join(publicDir, normalized.slice('dist/'.length))
    : undefined;

  if (publicSource && fs.existsSync(publicSource)) {
    return [];
  }

  if (normalized === 'dist/index.html') {
    return ['WebSite'];
  }

  if (normalized === 'dist/about/index.html') {
    return ['ProfilePage'];
  }

  if (['dist/articles/index.html', 'dist/articles/tags/index.html', 'dist/games/index.html', 'dist/logs/index.html'].includes(normalized)) {
    return ['CollectionPage'];
  }

  if (/^dist\/articles\/tags\/[^/]+\/index\.html$/.test(normalized)) {
    return ['CollectionPage'];
  }

  if (/^dist\/articles\/(?!tags\/)[^/]+\/index\.html$/.test(normalized)) {
    return ['BlogPosting'];
  }

  if (/^dist\/logs\/[^/]+\/index\.html$/.test(normalized)) {
    return ['BlogPosting'];
  }

  if (/^dist\/games\/(?!index\.html$)(?!inteapsce\/)[^/]+\/index\.html$/.test(normalized)) {
    return ['VideoGame'];
  }

  return [];
}

const distFiles = walkFiles(distDir, (file) => /\.(?:html|xml|txt|css|js)$/.test(file));
const missing = [];
const schemaErrors = [];
let schemaScriptCount = 0;

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

  if (!file.endsWith('.html')) {
    continue;
  }

  const schemaNodes = [];
  for (const script of extractJsonLd(source)) {
    schemaScriptCount += 1;
    try {
      schemaNodes.push(...toSchemaNodes(JSON.parse(script)));
    } catch (error) {
      schemaErrors.push({
        message: `JSON-LD 解析失败: ${error.message}`,
        file: relativeFile
      });
    }
  }

  for (const type of requiredSchemaTypes(relativeFile)) {
    if (!hasSchemaType(schemaNodes, type)) {
      schemaErrors.push({
        message: `缺少 ${type} 结构化数据`,
        file: relativeFile
      });
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

if (schemaErrors.length > 0) {
  console.error('构建产物结构化数据检查失败');
  for (const item of schemaErrors) {
    console.error(`- ${item.message}`);
    console.error(`  来源: ${item.file}`);
  }
  process.exit(1);
}

console.log(`构建产物链接检查通过：扫描 ${distFiles.length} 个文件`);
console.log(`构建产物结构化数据检查通过：解析 ${schemaScriptCount} 段 JSON-LD`);
