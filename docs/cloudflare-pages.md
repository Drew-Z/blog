# Cloudflare Pages 上线说明

这份站点当前是标准 Astro 静态站，不需要 Cloudflare 适配器，也不需要 Pages Functions。

根据 Cloudflare 官方的 Astro on Pages 指南，当前项目直接按静态站配置即可：

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

参考：

- [Cloudflare Pages Astro 官方指南](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Cloudflare Pages 自定义域名文档](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## 推荐部署方式

### 方案 A：先用 `*.pages.dev`

适合先把站点跑起来，再决定正式域名。

环境变量建议：

- `SITE_URL=https://<你的项目名>.pages.dev`

这时通常不需要设置 `BASE_PATH`。

### 方案 B：直接绑定正式域名

当前正式域名已经是：

- `https://blog.playlab.eu.cc`

环境变量建议直接设置为：

- `SITE_URL=https://blog.playlab.eu.cc`

同样不需要设置 `BASE_PATH`。

## Cloudflare 后台具体怎么填

1. 进入 `Workers & Pages`
2. 选择 `Create application`
3. 选择 `Pages`
4. 选择 `Import an existing Git repository`
5. 连接 GitHub，并选择 `ciallo-bill/blog`
6. 在构建设置里填写：

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

7. 在环境变量里添加：

- `SITE_URL=https://blog.playlab.eu.cc`

如果你以后切换域名，再把这里替换成新的正式域名即可。

如果 Cloudflare 后台里暂时看不到 `ciallo-bill/blog`，优先检查这两件事：

- GitHub 上这个仓库是否已经真实创建
- Cloudflare 连接的 GitHub 账号是否已经授权访问这个仓库

## 自定义域名建议

Cloudflare 官方文档当前的要点是：

- 如果你要绑定顶级域名，例如 `example.com`，这个域名需要接入 Cloudflare zone
- 如果你要绑定子域名，例如 `blog.example.com`，可以通过 CNAME 指向 `<project>.pages.dev`
- 但即使你手动加了 DNS，也仍然应该先在 Pages 项目后台里执行“Add custom domain”，不要只改 DNS

## 当前仓库里已经为 Cloudflare 准备好的内容

- `README.md`：本地运行与部署概览
- `docs/deploy-guide.md`：多平台部署说明
- `public/_headers`：静态资源缓存与基础安全响应头
- 已移除 GitHub Pages 的自动部署 workflow，避免仓库 push 后再触发无用的 Actions 失败
- 当前 Git 远程地址已切换为 `git@github.com:ciallo-bill/blog.git`
- 当前生产域名：`https://blog.playlab.eu.cc`
- 当前 `pages.dev` 主地址建议统一跳转到正式域名，不再作为对外入口

## 我对你当前项目的推荐

最实用的顺序是：

1. 先直接连 Cloudflare Pages，把 `main` 跑起来
2. 先用 `pages.dev` 看线上视觉效果
3. 视觉没问题后再绑正式域名
4. 如果以后你又想恢复 GitHub Pages，再单独补一条 workflow 即可