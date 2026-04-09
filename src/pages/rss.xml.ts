import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../utils/content';
import { siteMeta } from '../utils/site-meta';

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toAbsoluteUrl(path: string, site: URL | undefined) {
  return new URL(path, site ?? 'https://blog.playlab.eu.cc').toString();
}

export const GET: APIRoute = async ({ site }) => {
  const articles = (await getPublishedArticles()).slice(0, 20);
  const siteUrl = site ?? new URL('https://blog.playlab.eu.cc');
  const feedUrl = toAbsoluteUrl('/rss.xml', site);
  const lastBuildDate = articles[0]?.data.updatedDate ?? articles[0]?.data.pubDate ?? new Date();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${xmlEscape(siteMeta.name)}</title>\n    <link>${xmlEscape(siteUrl.toString())}</link>\n    <description>${xmlEscape(siteMeta.description)}</description>\n    <language>zh-CN</language>\n    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>\n    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />\n${articles
    .map((article) => {
      const link = toAbsoluteUrl(`/articles/${article.id}`, site);
      return `    <item>\n      <title>${xmlEscape(article.data.title)}</title>\n      <link>${xmlEscape(link)}</link>\n      <guid>${xmlEscape(link)}</guid>\n      <description>${xmlEscape(article.data.description)}</description>\n      <pubDate>${article.data.pubDate.toUTCString()}</pubDate>\n    </item>`;
    })
    .join('\n')}\n  </channel>\n</rss>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
};
