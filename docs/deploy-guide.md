# 部署指南

## 当前推荐顺序

1. Cloudflare Pages
2. 国内服务器静态托管

## Cloudflare Pages

适合原因：

- Astro 静态站原生适配良好
- 配置少
- CDN 与缓存能力更成熟

建议配置：

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `SITE_URL=https://blog.playlab.eu.cc`

## 国内服务器

如果你要兼顾国内访问体验，这通常是最稳的方案。

基本步骤：

1. 本地 `npm run build`
2. 上传 `dist/` 到服务器，例如 `/var/www/biau-playlab`
3. 用 Nginx 配置静态站点
4. 如果有 CDN，再把静态资源前置到 CDN