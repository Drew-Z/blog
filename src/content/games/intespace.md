---
title: intespace
description: 一个竖屏自动射击 Roguelite 项目，围绕武器树构筑、局内推进、局外成长和手机优先体验做统一试玩前的流程收口。
summary: 一个基于 Godot 4.6.1 的竖屏自动射击 Roguelite，当前武器系统 v1 已冻结结构，局外成长和玩家主菜单已经落地，正在推进完整 session 的试玩准备。
pubDate: 2026-04-21
updatedDate: 2026-04-21
status: ongoing
featured: false
tags:
  - Godot 4
  - Auto Shooter
  - Roguelite
  - Weapon Tree
  - Web Demo
engine: Godot 4.6.1
platforms:
  - Web 试玩
  - 手机优先
  - Windows 预留
thumbnail: /images/projects/inteapsce-cover.svg
screenshots:
  - src: /images/projects/inteapsce-shot-flow.svg
    title: 当前主线围绕完整 session 收口
    note: 首页、战斗、升级、结算、成长和下一局需要在同一套试玩口径下闭环。
  - src: /images/projects/inteapsce-shot-weapon.svg
    title: 武器树 v1 已进入结构冻结阶段
    note: 现在优先验证路线构筑是否清晰，而不是继续无限增加武器分支。
  - src: /images/projects/inteapsce-shot-meta.svg
    title: 局外成长和玩家主菜单已经落地
    note: 项目开始从战斗工作台转向“玩家能按正常流程进入下一局”的产品形态。
playableWeb: true
embedUrl: https://play.playlab.eu.cc/intespace/index.html
repoUrl: https://github.com/Drew-Z/intespace
downloadLinks:
  - label: Web 试玩版（新标签打开）
    url: https://play.playlab.eu.cc/intespace/index.html
  - label: 源码 ZIP（GitHub）
    url: https://github.com/Drew-Z/intespace/archive/refs/heads/main.zip
  - label: 查看代码仓库
    url: https://github.com/Drew-Z/intespace
role: Roguelite 系统方向 / 武器树结构冻结 / 完整流程收口 / 试玩准备整理
teamSize: 单人
workspacePath: D:\workspace4Codex\intespace
syncRepoPath: D:\workspace4Codex\intespace
currentBranch: main
currentPhase: 武器系统 v1 冻结后 / 统一试玩前完整流程收口
syncNote: 开发目录与同步仓库一致，仓库已初始化并完成首个 main 分支远端同步。
progressSummary:
  - 武器系统 v1 已完成结构冻结，后续优先看路线可读性和平衡验证。
  - 局外成长系统和玩家主菜单已经落地，项目开始围绕完整 session 而不是单个系统运转。
  - 当前主线是把首页、战斗、升级、结算、成长和下一局收成统一试玩入口。
keyDocs:
  - label: 项目说明
    path: README.md
  - label: 系统方向路线图
    path: docs/11_system_direction_roadmap.md
  - label: 当前阶段导航
    path: docs/15_current_stage_navigation.md
  - label: 项目索引
    path: PROJECT_INDEX.md
directoryMap:
  - label: docs/
    summary: 产品定义、阶段计划、冻结审核、当前阶段导航和统一试玩准备文档。
  - label: scenes/
    summary: 主菜单、战斗、HUD、升级面板和实体场景。
  - label: scripts/
    summary: 自动射击战斗、武器树、成长流程和 UI 逻辑。
challenge: 在手机优先的竖屏框架里，把自动射击、局内升级、武器路线和局外成长组织成一个能被统一试玩验证的完整 session。
mechanic: 竖屏自动射击 + 武器树路线构筑 + 局内升级 + 结算反馈 + 局外成长 + 下一局循环
milestones:
  - date: 2026-04-05
    title: 系统方向路线图收敛
    summary: 明确武器树、局内推进和局外成长之间的关系，避免项目继续发散成纯功能堆叠。
  - date: 2026-04-15
    title: 武器系统 v1 结构冻结
    summary: 确认第一版武器路线已经可以进入验证阶段，后续优先看可读性和平衡，而不是继续加分支。
  - date: 2026-04-21
    title: Web 试玩迁移到独立试玩域名
    summary: 当前版本继续通过作品站展示文档和阶段判断，同时把试玩导出迁移到独立域名，避免静态站部署被大文件阻塞。
devlogSlugs: []
contribution:
  - 梳理竖屏自动射击 Roguelite 的产品定位和阶段路线
  - 冻结武器系统 v1 结构，明确后续验证重点
  - 接入局外成长、玩家主菜单和统一试玩前的文档导航
  - 为手机优先、Web 试玩和 Windows 完整版保留发布路径
outcome: 当前项目已经具备从系统工作台走向统一试玩的基础，最有价值的展示点是“如何在进入人工试玩前把完整 session 收成一个可理解的版本”。
nextStep:
  - 完成完整流程与表现层的最后一轮统一
  - 为正式统一试玩补齐下载包和发布说明
  - 继续验证武器路线可读性、局外成长节奏和移动端触屏体验
---

## 项目概览

`intespace` 是一个竖屏自动射击 Roguelite 项目。

当前产品定位很清楚：

- 武器树参考《Geometry Tower》的几何路线构筑感
- 游戏模式参考《弓箭传说 2》的局内推进与局外成长节奏
- 战斗基础延续既有自动射击项目的成熟思路
- 首发优先级为手机，其次为 Web 试玩版和 Windows 完整版

## 当前真实阶段

项目现在不是继续横向加系统，而是在统一试玩前做完整流程收口。

当前已经完成：

- 武器系统 `v1` 结构冻结
- 局外成长系统落地
- 玩家主菜单落地
- 当前阶段导航、系统路线图和试玩准备文档完成整理

接下来最重要的流程是：

`首页 -> 战斗 -> 升级 -> 结算 -> 成长 -> 下一局`

## 为什么适合放进作品站

这个项目适合展示“从系统原型走向完整试玩版本”的过程。

它还不是最终成品，但已经进入一个很关键的节点：功能不再只是散落在开发工作台里，而是开始围绕真实玩家的完整 session 做收口。对于 Roguelite 项目来说，这一步特别重要，因为玩家真正感受到的不是某个单独系统，而是一次进入、战斗、成长、再开下一局的整体节奏。

## 试玩说明

在线试玩已经迁移到独立试玩域名，并继续在作品页里提供入口。

因为这是统一试玩前的当前版本，体验重点不是最终平衡，而是先确认：

- 入口是否清楚
- 战斗与升级是否能形成一局内节奏
- 结算和成长是否能承接下一局
- 武器树路线是否足够可读

## 当前阶段判断

`intespace` 当前最适合作为“统一试玩前的 Roguelite 系统收口案例”展示。

它的下一步不是急着变大，而是先让完整流程变顺，让玩家第一次打开时知道自己为什么进入战斗、怎样成长、打完以后下一步该做什么。
