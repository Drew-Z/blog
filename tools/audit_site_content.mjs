import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const contentDirs = {
  publishedArticles: 'src/published-articles',
  articleWorkbench: 'src/content/articles',
  games: 'src/content/games',
  devlogs: 'src/content/devlogs'
};

function walkFiles(dir, predicate = () => true) {
  const absoluteDir = path.join(rootDir, dir);
  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(absoluteDir, entry.name);
    const relativePath = path.relative(rootDir, absolutePath);

    if (entry.isDirectory()) {
      files.push(...walkFiles(relativePath, predicate));
      continue;
    }

    if (predicate(relativePath)) {
      files.push(relativePath);
    }
  }

  return files;
}

function parseFrontmatter(file) {
  const source = fs.readFileSync(path.join(rootDir, file), 'utf8');
  if (!source.startsWith('---')) {
    return {};
  }

  const end = source.indexOf('\n---', 3);
  if (end === -1) {
    return {};
  }

  const frontmatter = source.slice(3, end).split(/\r?\n/);
  const data = {};
  let currentListKey;

  for (const rawLine of frontmatter) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const listMatch = line.match(/^-\s+(.+)$/);
    if (listMatch && currentListKey) {
      data[currentListKey].push(unquote(listMatch[1]));
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!keyMatch) {
      currentListKey = undefined;
      continue;
    }

    const [, key, value] = keyMatch;
    if (value === '') {
      data[key] = [];
      currentListKey = key;
      continue;
    }

    data[key] = parseScalar(value);
    currentListKey = undefined;
  }

  return data;
}

function parseScalar(value) {
  const normalized = value.trim();
  if (normalized === 'true') {
    return true;
  }
  if (normalized === 'false') {
    return false;
  }
  if (normalized === '[]') {
    return [];
  }
  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    return normalized
      .slice(1, -1)
      .split(',')
      .map((item) => unquote(item.trim()))
      .filter(Boolean);
  }
  return unquote(normalized);
}

function unquote(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function isPublishableArticle(file) {
  const data = parseFrontmatter(file);
  return Boolean(data.title && data.description && data.pubDate && data.draft === false);
}

function toContentId(file, baseDir) {
  return path.relative(path.join(rootDir, baseDir), path.join(rootDir, file)).replace(/\\/g, '/').replace(/\.md$/, '');
}

function toContentEntries(files, baseDir) {
  return files.map((file) => ({
    file,
    id: toContentId(file, baseDir),
    data: parseFrontmatter(file)
  }));
}

function findDuplicateIds(entries) {
  const seen = new Map();
  const duplicates = [];

  for (const entry of entries) {
    const files = seen.get(entry.id) ?? [];
    files.push(entry.file);
    seen.set(entry.id, files);
  }

  for (const [id, files] of seen) {
    if (files.length > 1) {
      duplicates.push({ id, files });
    }
  }

  return duplicates;
}

function slugifyTag(tag) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function findTagSlugCollisions(entries) {
  const bySlug = new Map();

  for (const entry of entries) {
    for (const tag of entry.data.tags ?? []) {
      const slug = slugifyTag(tag);
      const tags = bySlug.get(slug) ?? new Set();
      tags.add(tag);
      bySlug.set(slug, tags);
    }
  }

  return [...bySlug.entries()]
    .filter(([, tags]) => tags.size > 1)
    .map(([slug, tags]) => ({ slug, tags: [...tags] }));
}

function assertContentRelations({ games, devlogs, publicArticles }) {
  const errors = [];
  const gameIds = new Set(games.map((entry) => entry.id));
  const devlogIds = new Set(devlogs.map((entry) => entry.id));

  for (const game of games) {
    for (const slug of game.data.devlogSlugs ?? []) {
      if (!devlogIds.has(slug)) {
        errors.push({
          message: `游戏 ${game.id} 引用了不存在的开发日志 ${slug}`,
          file: game.file
        });
      }
    }
  }

  for (const log of devlogs) {
    if (log.data.relatedGame && !gameIds.has(log.data.relatedGame)) {
      errors.push({
        message: `开发日志 ${log.id} 关联了不存在的游戏 ${log.data.relatedGame}`,
        file: log.file
      });
    }
  }

  for (const group of [
    { label: '游戏项目', duplicates: findDuplicateIds(games) },
    { label: '开发日志', duplicates: findDuplicateIds(devlogs) },
    { label: '公开文章', duplicates: findDuplicateIds(publicArticles) }
  ]) {
    for (const duplicate of group.duplicates) {
      errors.push({
        message: `${group.label} 存在重复 id: ${duplicate.id}`,
        file: duplicate.files.join(', ')
      });
    }
  }

  for (const collision of findTagSlugCollisions(publicArticles)) {
    errors.push({
      message: `公开文章标签 slug 冲突: ${collision.slug} <= ${collision.tags.join(', ')}`,
      file: 'src/published-articles, src/content/articles'
    });
  }

  return errors;
}

function findPublicAssetRefs() {
  const files = [
    ...walkFiles('src', (file) => /\.(astro|ts|js|md)$/.test(file)),
    ...walkFiles('public', (file) => /\.(html|css|js)$/.test(file))
  ];
  const refs = new Map();
  const assetRefPattern = /\/(?:images\/[^\s'"`<>)]+|favicon\.svg)/g;

  for (const file of files) {
    const source = fs.readFileSync(path.join(rootDir, file), 'utf8');
    for (const match of source.matchAll(assetRefPattern)) {
      const ref = match[0].replace(/[.,;:]+$/, '');
      const list = refs.get(ref) ?? [];
      list.push(file);
      refs.set(ref, list);
    }
  }

  return refs;
}

function assertPublicAssetsExist() {
  const refs = findPublicAssetRefs();
  const missing = [];

  for (const [ref, files] of refs) {
    const publicPath = path.join(rootDir, 'public', ref.replace(/^\//, ''));
    if (!fs.existsSync(publicPath)) {
      missing.push({ ref, files: [...new Set(files)] });
    }
  }

  return missing;
}

const publishedArticles = walkFiles(contentDirs.publishedArticles, (file) => file.endsWith('.md'));
const articleWorkbench = walkFiles(contentDirs.articleWorkbench, (file) => file.endsWith('.md'));
const games = walkFiles(contentDirs.games, (file) => file.endsWith('.md'));
const devlogs = walkFiles(contentDirs.devlogs, (file) => file.endsWith('.md'));
const publishableWorkbench = articleWorkbench.filter(isPublishableArticle);
const missingAssets = assertPublicAssetsExist();
const contentRelationErrors = assertContentRelations({
  games: toContentEntries(games, contentDirs.games),
  devlogs: toContentEntries(devlogs, contentDirs.devlogs),
  publicArticles: [
    ...toContentEntries(publishedArticles, contentDirs.publishedArticles),
    ...toContentEntries(publishableWorkbench, contentDirs.articleWorkbench)
  ]
});

console.log('内容概览');
console.log(`- 已发布文章: ${publishedArticles.length}`);
console.log(`- 文章工作区: ${articleWorkbench.length} (${publishableWorkbench.length} 篇满足公开条件)`);
console.log(`- 游戏项目: ${games.length}`);
console.log(`- 开发日志: ${devlogs.length}`);

if (missingAssets.length > 0) {
  console.error('\n缺失静态资源');
  for (const item of missingAssets) {
    console.error(`- ${item.ref}`);
    console.error(`  引用位置: ${item.files.join(', ')}`);
  }
  process.exit(1);
}

console.log('\n静态资源引用检查通过');

if (contentRelationErrors.length > 0) {
  console.error('\n内容关系检查失败');
  for (const item of contentRelationErrors) {
    console.error(`- ${item.message}`);
    console.error(`  位置: ${item.file}`);
  }
  process.exit(1);
}

console.log('内容关系检查通过');
