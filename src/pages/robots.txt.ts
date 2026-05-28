import type { APIRoute } from 'astro';
import { toSiteUrl } from '../utils/site';

export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${toSiteUrl('/sitemap.xml', site)}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
