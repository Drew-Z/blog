import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { getPublishedArticles, getPublishedArticleTagCounts } from '../utils/content';
import { toSiteUrl } from '../utils/site';
import { slugifyTag } from '../utils/site-meta';

type SitemapItem = {
  path: string;
  lastmod?: Date;
};

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const [games, articles, tags] = await Promise.all([
    getCollection('games'),
    getPublishedArticles(),
    getPublishedArticleTagCounts()
  ]);
  const devlogs = await getCollection('devlogs');

  const items: SitemapItem[] = [
    { path: '/' },
    { path: '/about' },
    { path: '/games' },
    { path: '/articles' },
    { path: '/articles/tags' },
    { path: '/logs' },
    ...games.map((game) => ({
      path: `/games/${game.id}`,
      lastmod: game.data.updatedDate ?? game.data.pubDate
    })),
    ...articles.map((article) => ({
      path: `/articles/${article.id}`,
      lastmod: article.data.updatedDate ?? article.data.pubDate
    })),
    ...devlogs.map((log) => ({
      path: `/logs/${log.id}`,
      lastmod: log.data.updatedDate ?? log.data.pubDate
    })),
    ...tags.map(({ tag }) => ({
      path: `/articles/tags/${slugifyTag(tag)}`
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items
    .map((item) => {
      const parts = [`  <url>`, `    <loc>${xmlEscape(toSiteUrl(item.path, site))}</loc>`];
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
