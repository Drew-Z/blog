# BIAU Playlab

一个用 Astro 搭建的个人作品站，整合了：

- Godot 游戏项目案例
- 开发日志
- 系统设计文章
- 从 Quartz 迁入的有效旧博客内容

## 本地开发

Git Bash:

```bash
cd /d/workspace4Cursor/game/blog
npm install
npm run dev
```

## 构建

Git Bash:

```bash
cd /d/workspace4Cursor/game/blog
npm run build
```

构建前会自动清理旧的 `dist/`，构建产物输出到新的 `dist/`。

## 校验

Git Bash:

```bash
cd /d/workspace4Cursor/game/blog
npm run content:audit
npm run dist:audit
npm run verify
```

`content:audit` 会统计公开内容、文章工作区、游戏项目和开发日志，检查站内引用的 `public/` 静态资源是否存在，并校验游戏、开发日志和公开文章标签之间的基础引用关系。`dist:audit` 会检查构建产物里的站内链接、资源路径和关键 JSON-LD 结构化数据。`verify` 会先执行内容审计，再执行生产构建和构建产物审计。

## Cloudflare Pages

推荐设置：

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_URL=https://games.playlab.eu.cc`

如果你绑定自定义域名，通常不需要额外设置 `BASE_PATH`。

更完整的 Cloudflare 配置说明见：

- `docs/cloudflare-pages.md`

## 国内服务器

构建后把 `dist/` 上传到 Nginx 静态站目录即可。

常见做法：

1. 本地执行 `npm run build`
2. 上传 `dist/*` 到服务器站点目录
3. 在 Nginx 中把站点根目录指向该目录
4. 开启 gzip / brotli 与缓存头
