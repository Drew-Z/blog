---
title: Raiden Prototype
description: 以纵版街机射击为核心，验证双关章节、敌群编排、火力成长、炸弹资源、Boss 收束和 Demo 试玩包装是否能形成稳定展示候选版。
summary: 一个基于 Godot 4.6.1 的纵版射击展示原型，当前已推进到 RC-0.4，推荐入口为 Chapter Run，具备双关流程、章节继承、结尾演出、公开 Demo 包和 Web 试玩入口。
pubDate: 2026-04-10
updatedDate: 2026-04-21
status: playable
featured: true
tags:
  - Godot 4
  - Vertical Shooter
  - Raiden-like
  - Arcade Prototype
  - Web Demo
engine: Godot 4.6.1
platforms:
  - Web 试玩
  - Windows
  - 竖屏布局
thumbnail: /images/projects/raiden-cover.svg
screenshots:
  - src: /images/projects/raiden-shot-stage.svg
    title: 双关章节把 Stage 01 与 Stage 02 串成完整 Demo 路线
    note: 项目重点不再只是单关爽感，而是验证章节继承、过场和结尾是否能撑起展示版体验。
  - src: /images/projects/raiden-shot-boss.svg
    title: Boss 与风暴机关共同压缩安全区域
    note: 第二关 Storm Front 已接入风暴十字封线、overdrive 和最后安全窗口预警。
  - src: /images/projects/raiden-shot-result.svg
    title: 结果页、章节总评和 Outro 承接短局反馈
    note: 短局街机项目需要在结束后解释发生了什么，并给出下一步试玩动机。
playableWeb: true
embedUrl: https://play.playlab.eu.cc/raiden/index.html
repoUrl: https://github.com/Drew-Z/raiden-prototype
downloadLinks:
  - label: Windows RC-0.4 预发布下载
    url: https://github.com/Drew-Z/raiden-prototype/releases/tag/v0.4.0-rc.4
  - label: Web 试玩版（新标签打开）
    url: https://play.playlab.eu.cc/raiden/index.html
role: 街机节奏原型 / 双关章节流程 / Boss 与资源反馈 / Demo 发布包装
teamSize: 单人
workspacePath: D:\workspace4Codex\raiden-prototype
syncRepoPath: D:\workspace4Codex\raiden-prototype\.publish-final
currentBranch: main
currentPhase: RC-0.4 稳定展示候选 / 公开 Demo 准备
syncNote: 根目录主要作为开发工作目录使用，实际对外同步和发布记录以 .publish-final/main -> origin/main 为准。
progressSummary:
  - 双关垂直切片已经完成展示候选收口，推荐从 Chapter Run 进入完整流程。
  - Stage 02 的风暴机关、Boss overdrive、最后安全窗口和 ChapterEnding / Outro 已经串成完整高潮。
  - 当前重点是外部试玩、公开 Demo 包、素材授权和首屏表现，而不是继续默认扩系统。
  - 根目录继续承担开发工作目录角色，实际 GitHub 同步仓库为 `.publish-final`。
keyDocs:
  - label: 项目说明
    path: README.md
  - label: 当前进度
    path: docs/progress.md
  - label: Demo 路线
    path: docs/public-demo-roadmap.md
  - label: 项目索引
    path: PROJECT_INDEX.md
directoryMap:
  - label: docs/
    summary: 阶段设计、进度记录、QA、公开 Demo、试玩反馈和交付文档。
  - label: scenes/
    summary: 主菜单、战斗、章节过场、结果页等 Godot 场景。
  - label: scripts/
    summary: 玩家、敌人、Boss、章节流程、HUD、结果页和环境机关逻辑。
  - label: dist/
    summary: 当前展示包、试玩包和公开 Demo 候选产物。
  - label: .publish-final/
    summary: 实际同步到 GitHub 的发布仓库，当前 `main` 已连接 `origin/main`。
challenge: 把雷电式纵版射击做得既有短局街机爽感，又能让外部玩家第一次打开时理解入口、目标、章节推进和当前版本定位。
mechanic: 纵版卷轴推进 + 自动持续射击 + 火力成长 + 炸弹清屏 + 双关章节继承 + Storm Front 环境压迫 + Boss 终盘收束
milestones:
  - date: 2026-03-22
    title: 纵版卷轴和基础敌群框架建立
    summary: 先把玩家移动、自动射击、受伤死亡、掉落升级和基础敌群节奏跑通。
  - date: 2026-04-10
    title: 双关垂直切片形成展示候选
    summary: Stage 01、Stage 02、ChapterBriefing、ChapterEnding 和 ChapterOutro 串成完整章节体验。
  - date: 2026-04-21
    title: RC-0.4 发布包与独立试玩域名接通
    summary: 将 Windows 预发布包挂到 GitHub Release，并把 Godot Web 导出迁移到独立试玩域名，避免作品站构建被大文件阻塞。
devlogSlugs: []
contribution:
  - 完成 Stage 01 // Scramble 与 Stage 02 // Storm Front 的双关展示路线
  - 组织火力成长、炸弹资源、敌群编排、Boss 相位和风暴机关的反馈层
  - 补齐 ChapterBriefing、ChapterEnding、ChapterOutro、结果页和重开流程
  - 准备公开 Demo 包、试玩说明、已知问题和素材授权检查清单
outcome: 当前项目已经从“纵版射击原型”推进到稳定展示候选版，能展示短局街机射击的战场阅读、资源决策、章节包装和发布收口能力。
nextStep:
  - 做一轮外部人工试玩，确认双关节奏和首屏理解成本
  - 精简 Web 包资源，避免公开试玩首次加载过重
  - 继续替换正式资源，并维护素材授权清单
---

## 项目概览

`Raiden Prototype` 是一个纵版射击展示原型，目标是验证短局街机射击能不能在较小范围内形成完整 Demo。

它现在的推荐入口是 `Chapter Run`，完整路线为：

1. 从主菜单进入 `Stage 01` 或 `Chapter Run`
2. 在短局战斗中通过击破敌人获取火力升级
3. 在高压波次和 Boss 段落中使用炸弹维持节奏
4. 通关 `Stage 01` 后进入结果页和 `ChapterBriefing`
5. 继承生命、炸弹、火力进入 `Stage 02`
6. 通关双关后进入 `ChapterEnding -> ChapterOutro`

## 当前可玩内容

项目当前版本标识为 `RC-0.4`，定位是稳定展示候选版。

已经完成的关键内容包括：

- 主菜单，可选择 `Stage 01`、`Stage 02` 和 `Chapter Run`
- 玩家移动、自动持续射击、受伤、死亡
- 敌群编排、掉落升级、火力成长、炸弹清屏
- 两个可打通关卡：`Stage 01 // Scramble` 与 `Stage 02 // Storm Front`
- 第一关到第二关的章节继承
- `ChapterBriefing`、`ChapterEnding`、`ChapterOutro`
- 第二关风暴十字封线、Boss overdrive、最后安全窗口和终盘破口
- HUD、结果页、章节总评和重开流程

## 试玩说明

在线试玩已经迁移到独立试玩域名，并继续在作品页里提供内嵌入口。因为 Web 版本包含 Godot 运行时、音频资源和较大的战斗数据，首次加载会稍慢一点。

基础操作：

- 移动：`WASD` / 方向键
- 炸弹：`Space` / `Shift` / `X`
- 射击：自动持续开火
- 继续 / 确认：`Enter`
- 重开：`R`
- 返回：`Esc`

## 为什么适合放进作品站

这个项目和横向 `Space War` 形成互补。

`Space War` 更强调经典手机游戏复刻和完整发布收口；`Raiden Prototype` 更强调街机短局爽感、纵向战场阅读、资源决策和章节包装。两者放在一起，可以更清楚展示射击项目在不同方向上的设计取舍。

## 当前阶段判断

它已经具备稳定展示候选版的形态，但还没有到商业成品。

下一步最重要的不是继续横向堆新系统，而是外部试玩、首屏体验、资源授权和发布包装这几件事。换句话说，它现在最适合被当作“公开 Demo 准备阶段”的案例来看。
