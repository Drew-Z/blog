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
- Environment variable: `SITE_URL=https://games.playlab.eu.cc`

手动部署备用命令：

```bash
npx wrangler login
npm run deploy:pages -- --project <Cloudflare Pages 项目名>
```

也可以用环境变量传项目名：

```bash
set CLOUDFLARE_PAGES_PROJECT=<Cloudflare Pages 项目名>
npm run deploy:pages
```

脚本会先执行 `npm run verify`，再把 `dist/` 发布到 Cloudflare Pages。若使用 API token 而不是网页登录，需要先按 Cloudflare Wrangler 要求设置 token 环境变量。

## Godot Web 试玩包

试玩包不进入 Pages 构建产物，统一发布到 `play.playlab.eu.cc` 背后的 R2 bucket。

本地导出与检查：

```bash
npm run play:export
npm run play:check
```

上传到 R2：

```bash
npx wrangler login
npm run deploy:play -- --bucket <R2 bucket 名>
```

也可以用环境变量传 bucket：

```bash
set R2_PLAY_BUCKET=<R2 bucket 名>
npm run deploy:play
```

如果 bucket 内需要额外目录前缀，可追加 `-- --bucket <R2 bucket 名> --prefix <前缀>`，或设置 `R2_PLAY_PREFIX`。

发布后统一验收：

```bash
npm run deploy:check
```

它会检查 `https://games.playlab.eu.cc`、六个 `https://play.playlab.eu.cc/{slug}/index.html`、以及主站入口是否返回成功状态。

## 国内服务器

如果你要兼顾国内访问体验，这通常是最稳的方案。

基本步骤：

1. 本地 `npm run build`
2. 上传 `dist/` 到服务器，例如 `/var/www/biau-playlab`
3. 用 Nginx 配置静态站点
4. 如果有 CDN，再把静态资源前置到 CDN
