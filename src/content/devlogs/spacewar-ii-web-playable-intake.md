---
title: Spacewar II 进入第六个 Web 试玩接入位
description: 原本只在本地目录里的 Spacewar II 被补进游戏站内容模型、试玩域名规则和导出流水线。
pubDate: 2026-06-28
project: spacewar-ii
relatedGame: spacewar-ii
status: web-playable-intake
tags:
  - Godot 4
  - Web 导出
  - 游戏站整合
featured: true
highlights:
  - 第六个游戏使用 spacewar-ii 作为统一 slug
  - 试玩入口预留到 play.playlab.eu.cc/spacewar-ii/index.html
  - 后续验证重点是 Web 导出、浏览器 canvas 和 HUD 可读性
---

## 为什么先补接入位

游戏站原本已经收录五个 Godot 项目，但工作区里实际存在六个游戏目录。`Spacewar II` 如果不补进内容模型，主站、游戏站和导出脚本会长期保持不一致。

这次先做的是接入位：

- 内容页
- 开发日志
- Web 试玩 URL
- 导出脚本目标
- 主站外链目标

## 后续验证重点

下一步要用 Godot Web export 和浏览器检查证明它真的能公开试玩。重点不是扩玩法，而是确认：

- 菜单能启动战斗
- 战斗画面非空
- HUD 不遮挡
- 结果或返回路径可用
- 导出壳在桌面和移动尺寸都能正确缩放

通过以后，再用真实运行截图或短视频替换当前站内视觉资产。
