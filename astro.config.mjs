import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://portfolio.example.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  ...(base !== '/' ? { base } : {})
});
