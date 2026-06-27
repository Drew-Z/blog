# R2 试玩目录说明

本地统一整理目录：

- `deploy/r2-play/first-tetris/`
- `deploy/r2-play/next-spacewar/`
- `deploy/r2-play/raiden/`
- `deploy/r2-play/space-war/`
- `deploy/r2-play/intespace/`
- `deploy/r2-play/spacewar-ii/`

使用规则：

- 这个目录专门存放准备上传到 Cloudflare R2 的 Godot Web 导出文件。
- 目录内文件不会提交到 Git 仓库。
- `public/play/` 不再作为正式部署目录使用，也已经加入 Git 忽略，避免再次把大体积 Web 导出带进 Cloudflare Pages 构建。
- `intespace/` 使用规范命名；原站内旧别名 `inteapsce` 仅作为历史兼容，不再作为新的上传目录名。
- `spacewar-ii/` 是第六个游戏的标准试玩目录，线上对应 `https://play.playlab.eu.cc/spacewar-ii/index.html`。
- 后续新增试玩时，直接把导出的整套 Web 文件复制到 `deploy/r2-play/<project-slug>/` 即可。

## 一键导出、检查、上传

```bash
npm run play:export
npm run play:check
npm run deploy:play -- --bucket <R2 bucket 名>
```

`deploy:play` 会重新导出六个游戏、运行浏览器 canvas 检查，再通过 Wrangler 上传 `deploy/r2-play/` 下所有文件。

需要先完成 Cloudflare 授权：

```bash
npx wrangler login
```

也可以通过环境变量传 bucket，避免每次输入：

```bash
set R2_PLAY_BUCKET=<R2 bucket 名>
npm run deploy:play
```

上传脚本会为 `index.html` 使用短缓存，为 `.js`、`.wasm`、`.pck`、图片等静态资源使用长缓存。发布完成后运行：

```bash
npm run deploy:check
```

重点确认：

- `https://play.playlab.eu.cc/first-tetris/index.html`
- `https://play.playlab.eu.cc/next-spacewar/index.html`
- `https://play.playlab.eu.cc/intespace/index.html`
- `https://play.playlab.eu.cc/raiden/index.html`
- `https://play.playlab.eu.cc/space-war/index.html`
- `https://play.playlab.eu.cc/spacewar-ii/index.html`
