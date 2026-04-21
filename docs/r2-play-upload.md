# R2 试玩目录说明

本地统一整理目录：

- `deploy/r2-play/raiden/`
- `deploy/r2-play/space-war/`
- `deploy/r2-play/intespace/`

使用规则：

- 这个目录专门存放准备上传到 Cloudflare R2 的 Godot Web 导出文件。
- 目录内文件不会提交到 Git 仓库。
- `public/play/` 不再作为正式部署目录使用，也已经加入 Git 忽略，避免再次把大体积 Web 导出带进 Cloudflare Pages 构建。
- `intespace/` 使用规范命名；原站内旧别名 `inteapsce` 仅作为历史兼容，不再作为新的上传目录名。
- 后续新增试玩时，直接把导出的整套 Web 文件复制到 `deploy/r2-play/<project-slug>/` 即可。
