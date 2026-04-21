---
title: Space War
description: 复刻 Nokia 3310《Space Impact》初代体验，把横向自动卷轴、短局高压射击、关底 Boss 和低彩 LCD 气质收成一个完整可玩版本。
summary: 一个基于 Godot 4.6.1 的横向卷轴射击项目，已经形成主菜单、阶段继续、五个常规 Sector、最终 Boss、结算、高分记录、双语设置和完整发布流程。
pubDate: 2026-04-21
updatedDate: 2026-04-21
status: playable
featured: true
tags:
  - Godot 4
  - Space Shooter
  - Nokia 3310
  - Space Impact
  - Web Demo
engine: Godot 4.6.1
platforms:
  - Web 试玩
  - Windows
thumbnail: /images/projects/space-war-gameplay.png
screenshots:
  - src: /images/projects/space-war-menu.png
    title: 主菜单承接继续游戏、设置、语言切换和版本定位
    note: 这让项目不只是能运行的关卡，而是具备完整入口的可发布版本。
  - src: /images/projects/space-war-gameplay.png
    title: 横向自动卷轴保留 Nokia 时代的短局高压节奏
    note: 低彩几何画面、敌群编排和拾取强化共同支撑一局内的推进感。
  - src: /images/projects/space-war-result.png
    title: 结算页给出分数、阶段、最高分和下一步操作
    note: 完整结果反馈让试玩结束后仍然能清楚理解本局状态。
playableWeb: true
embedUrl: /play/space-war/index.html
downloadLinks:
  - label: Windows v1.1.1 下载页（GitHub Release）
    url: https://github.com/Drew-Z/space-impact/releases/tag/v1.1.1
  - label: Web 试玩版（新标签打开）
    url: /play/space-war/index.html
externalPage: https://github.com/Drew-Z/space-impact
repoUrl: https://github.com/Drew-Z/space-impact
role: 复刻方向定义 / Godot 实现 / 关卡与 Boss 收口 / 发布与展示整理
teamSize: 单人
workspacePath: D:\workspace4Codex\space war
syncRepoPath: D:\workspace4Codex\space war
currentBranch: main
currentPhase: 完整可玩 / 可展示 / 发布后维护
syncNote: 开发目录与同步仓库一致，当前主分支已连接 origin/main，并通过 GitHub Release 对外分发。
progressSummary:
  - 经典 Nokia 3310《Space Impact》初代体验已经完成可玩闭环，并收成正式发布版本。
  - Windows 发布页、GitHub Release 和 Web 试玩入口都已经接通，适合直接对外展示。
  - 当前重点转向维护、试玩反馈和展示资料补齐，而不是继续大规模扩系统。
keyDocs:
  - label: 项目说明
    path: README.md
  - label: 最终总结
    path: docs/16_final_summary.md
  - label: v1.1.1 发布说明
    path: docs/17_release_notes_v1.1.1.md
  - label: 项目索引
    path: PROJECT_INDEX.md
directoryMap:
  - label: docs/
    summary: 设计、技术、测试、发布说明和 postmortem。
  - label: scenes/
    summary: 主菜单、战斗、HUD、结果页和实体场景。
  - label: scripts/
    summary: 战斗逻辑、数据定义、自动加载与 UI 脚本。
  - label: release/
    summary: 正式分发包与版本目录。
challenge: 在不把项目扩成现代原创横版射击的前提下，尽量保留《Space Impact》初代最有辨识度的手机游戏体验，并把它做成完整可展示版本。
mechanic: 横向自动卷轴 + 5 个 Sector + 最终 Boss + 13 级武器成长 + 拾取强化 + 暂停 / 结算 / 高分回路
milestones:
  - date: 2026-03-28
    title: 经典手机射击体验拆解完成
    summary: 明确项目不是现代化重制，而是围绕横向卷轴、短局压迫、简洁敌群和低彩屏幕气质做复刻。
  - date: 2026-04-08
    title: 主菜单、阶段继续和结算流程收口
    summary: 外层体验补齐后，项目从单关原型推进为别人第一次打开也能理解的可玩版本。
  - date: 2026-04-21
    title: Web 试玩导出接入作品站
    summary: 通过 Godot Web 导出把项目嵌入作品展示页，同时保留 GitHub Release 下载入口。
devlogSlugs: []
contribution:
  - 拆解 Nokia 3310《Space Impact》初代的核心节奏和视觉约束
  - 完成五个常规 Sector、最终 Boss、敌群扩展、武器成长和结算回路
  - 整理 Windows 发布包、GitHub Release 和 Web 试玩导出入口
  - 用真实截图替换概念图，让作品页更接近可验证项目档案
outcome: 当前项目已经具备完整可玩、可展示、可维护的状态，适合放在作品站里作为“文档先行、阶段推进、发布收口”的代表案例。
nextStep:
  - 继续补充人工试玩反馈，确认后期 Sector 的节奏和难度曲线
  - 视需要补更轻量的 Web 包，减少首次加载体积
  - 后续维护以修复、兼容和展示材料补齐为主，不默认继续横向扩系统
---

## 项目概览

`Space War` 是一个围绕 Nokia 3310《Space Impact》初代体验展开的复刻项目。

它最重要的约束不是“做得更现代”，而是尽量守住原作最直接的辨识度：

- 横向自动卷轴
- 短局高压射击
- 简洁直接的敌人编排
- 局内即时生效的强化拾取
- 关底 Boss 压轴
- 单色 / 低彩 LCD 气质的视觉和 UI

## 当前完成度

项目已经进入完整可玩、可展示、可维护的阶段。

当前版本包含主菜单、阶段继续、设置、中英文切换、五个常规 Sector、最终 Boss、13 级武器成长、暂停、结算、最高分记录和发布文档。也就是说，它已经不只是一个战斗原型，而是可以被外部玩家按正常流程打开、试玩、结束和再次开始的版本。

## 为什么适合放在作品站

这个项目适合展示“从参考拆解到正式收口”的完整链路。

很多小游戏原型会停在核心战斗成立的状态，但 `Space War` 额外完成了几件对作品展示很关键的事：

- 有明确的参考范围，不随意扩题
- 有完整文档与阶段记录
- 有可发布 Windows 包
- 有可嵌入作品站的 Web 试玩版
- 有真实截图和可复查的 Release 页面

## 试玩说明

在线试玩已经嵌入本页。首次加载会下载 Godot Web 运行时和项目资源，加载时间取决于网络环境。

基础操作：

- 移动：`WASD` / 方向键
- 射击 / 确认：`Space` / `Z`
- 返回 / 取消：`Esc` / `X`
- 暂停：`Esc` / `P`

## 当前阶段判断

它现在更像一个正式完成的复刻展示项目，而不是还在寻找方向的原型。

后续最值得继续做的不是继续加新系统，而是补齐更多外部试玩反馈、压缩 Web 首次加载体积，并把发布资料整理得更适合长期展示。
