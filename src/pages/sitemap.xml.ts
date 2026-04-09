import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { getPublishedArticles, getPublishedArticleTagCounts } from '../utils/content';
import { slugifyTag } from '../utils/site-meta';

type SitemapItem = {
  path: string;
  lastmod?: Date;
};

function toAbsoluteUrl(path: string, site: URL | undefined) {
  return new URL(path, site ?? 'https://blog.playlab.eu.cc').toString();
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const [games, logs, articles, tags] = await Promise.all([
    getCollection('games'),
    getCollection('devlogs'),
    getPublishedArticles(),
    getPublishedArticleTagCounts()
  ]);

  const items: SitemapItem[] = [
    { path: '/' },
    { path: '/about' },
    { path: '/games' },
    { path: '/logs' },
    { path: '/articles' },
    { path: '/articles/tags' },
    ...games.map((game) => ({
      path: `/games/${game.slug}`,
      lastmod: game.data.updatedDate ?? game.data.pubDate
    })),
    ...logs.map((log) => ({
      path: `/logs/${log.slug}`,
      lastmod: log.data.updatedDate ?? log.data.pubDate
    })),
    ...articles.map((article) => ({
      path: `/articles/${article.id}`,
      lastmod: article.data.updatedDate ?? article.data.pubDate
    })),
    ...tags.map(({ tag }) => ({
      path: `/articles/tags/${slugifyTag(tag)}`
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items
    .map((item) => {
      const parts = [`  <url>`, `    <loc>${xmlEscape(toAbsoluteUrl(item.path, site))}</loc>`];
      if (item.lastmod) {
        parts.push(`    <lastmod>${item.lastmod.toISOString()}</lastmod>`);
      }
      parts.push(`  </url>`);
      return parts.join('\n');
    })
    .join('\n')}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
