# Godot Web 导出排障与预防

这份说明专门记录为什么批量导出 Godot Web 试玩时容易出现“导出后崩溃、残留进程杀不掉、目录里留下 `.tmp` 文件”。

## 这次反复出现的根因

根因不是单一一条，而是三件事叠在一起：

1. 使用的是 Godot 编辑器构建的 `console` 可执行文件  
   它不仅负责导出，还会顺手写编辑器设置、用户目录和缓存。

2. 前一次导出崩溃后，Windows 会留下残留的 `Godot_v4.6.1-stable_win64.exe`  
   这些进程有时会锁住导出目录里的临时文件，随后连 `taskkill` 都会被系统拒绝。

3. 如果在“已有残留进程”的状态下继续导出  
   新一轮导出会继续撞锁文件、继续写 `.tmp`、继续弹错误窗，于是问题会越来越像“永远清不干净”。

## 这次日志里已经确认过的信号

- `Safe save failed`
- `Cannot save file ... editor_settings-4.6.tres`
- `Access is denied`
- 导出目录里出现 `index.*.tmp`
- `taskkill` / 任务管理器结束进程时也提示“拒绝访问”

这些组合在一起时，最稳的处理方式通常不是继续强杀，而是：

1. 停止继续导出
2. 重启一次 Windows
3. 重启后先确认没有 Godot 进程
4. 再开始下一轮导出

## 以后怎么尽量杜绝

推荐固定遵守下面这套流程：

1. 导出前先确认没有任何 Godot 进程  
   如果之前刚崩过，优先直接重启，不要硬杀半天。

2. 不要把导出直接覆盖到最终上传目录  
   先导出到 `deploy/r2-play-refresh/`，成功后再同步到 `deploy/r2-play/`。

3. 五个项目一定串行导出，不要并行  
   这样最容易定位是哪一个项目、哪一次导出出了问题。

4. 导出失败后，不要立刻重试  
   先检查是否有 Godot 残留进程；如果有，先清掉或直接重启。

5. 导出动作尽量在你本机正常终端里执行  
   不要把“批量导出 + 崩溃恢复 + 强杀进程”全压在受限代理环境里做。

## 推荐使用的脚本

已经准备好的脚本：

- [export_r2_play_manual.cmd](/D:/workspace4Codex/blog/tools/export_r2_play_manual.cmd)

它会做这些事：

1. 先检查当前是否还有 Godot 进程
2. 检查本机默认 `AppData` 下的导出模板是否存在
3. 清空并重建 `deploy/r2-play-refresh/`
4. 串行导出五个项目
5. 成功后再把产物同步到 `deploy/r2-play/`

## 最推荐的执行方式

用管理员 `cmd` 在本机手动执行：

```cmd
D:\workspace4Codex\blog\tools\export_r2_play_manual.cmd
```

如果脚本一开始就提示“Found running Godot processes”，先不要继续导出，先清进程；如果 Windows 继续拒绝访问，直接重启。

## 什么时候应该直接重启

满足下面任意一条时，直接重启通常最省时间：

- `taskkill` 提示 `Access is denied`
- 任务管理器结束进程也提示“拒绝访问”
- 导出目录里开始反复生成 `.tmp`
- 同一轮里已经出现过 Godot 崩溃弹窗

## 当前共享字体位置

后续所有 Godot 项目都统一复用这里的字体资源：

- `D:\workspace4Codex\resources\font\NotoSansSC-VF.ttf`

如果后面还要给新项目补中文 UI 字体，优先从这个目录复制，而不是每次重新下载。
