---
title: Game First Tetris
description: 验证经典俄罗斯方块主循环、Rogue 实验层和移动端触控方案能否在同一个 Godot 项目里长期共存并继续迭代。
summary: 一个基于 Godot 4 的俄罗斯方块原型项目，已经形成经典模式、Rogue 实验线、多端适配与触屏输入准备这几条并行脉络。
pubDate: 2026-04-09
updatedDate: 2026-04-21
status: ongoing
featured: true
tags:
  - Godot 4
  - Tetris
  - Rogue 原型
  - 移动端触控
  - 响应式 UI
engine: Godot 4.6.1
platforms:
  - Windows
  - Web 窗口
  - 安卓竖屏适配回归
thumbnail: /images/projects/tetris-cover.svg
screenshots:
  - src: /images/projects/tetris-main-menu.png
    title: 主菜单在窄宽度和桌面窗口下都已经达到可用线
    note: 这个画面说明项目不只是核心玩法能跑，而是已经开始按真实玩家入口去打磨可访问性。
  - src: /images/projects/tetris-rogue-game.png
    title: Rogue 模式的 HUD、棋盘和摘要信息已经形成一套可阅读结构
    note: 不是简单给经典模式加一层 buff，而是在尽量低侵入的前提下做一条实验支线。
  - src: /images/projects/tetris-help-panel.png
    title: Help 面板已经被纳入多端适配回归，不再是边角功能
    note: 这一点对展示型项目很重要，因为它意味着项目开始考虑“第一次打开的人能不能看懂”。
playableWeb: false
role: 系统设计 / 原型实现 / 输入结构整理 / 多端 UI 收口
teamSize: 单人
workspacePath: D:\workspace4Codex\game-first-tetris
currentBranch: feature/mobile-touch-controls-next
currentPhase: 移动端触控深化 / 多端可读性继续收口
progressSummary:
  - 经典模式已经稳定，可作为长期主线继续承接实验。
  - Rogue 模式保留在低侵入范围内，用三轮固定选择和最小局间带入验证中程目标感。
  - 触屏输入桥接层与第一版正式触屏控件原型已经打通，当前重点是超窄尺寸下的真实可玩性。
keyDocs:
  - label: 当前路线图
    path: docs/roadmap.md
  - label: 当前任务板
    path: docs/task-board.md
  - label: 测试清单
    path: docs/test-checklist.md
  - label: 项目索引
    path: PROJECT_INDEX.md
directoryMap:
  - label: docs/
    summary: 路线图、任务板、规则、架构说明和测试清单。
  - label: scenes/
    summary: 主菜单、游戏主场景、Help、触屏控件等场景资源。
  - label: scripts/
    summary: 经典模式、Rogue 逻辑、输入桥接层和 UI 脚本。
  - label: artifacts/
    summary: 本地截图回归、运行日志和临时验证产物，不进入版本库。
challenge: 在不破坏经典玩法稳定性的前提下，把 Rogue 原型、多端布局和移动端触控承接进同一条产品线。
mechanic: 经典消行闭环 + Rogue 三轮固定选择 + 局间带入 + 响应式 HUD + 触屏桥接层
milestones:
  - date: 2026-03-30
    title: 经典模式与 Rogue 试验线并行落地
    summary: 先把经典消行闭环稳定下来，再把 Rogue 三轮选择和局间带入控制在低侵入范围内，确认项目值得继续扩成长期原型。
  - date: 2026-04-05
    title: 固定尺寸回归成为常规动作
    summary: 把 360 x 640、平板比例和桌面窗口一起纳入截图回归，让项目不再只是玩法能跑，而是开始具备可展示的阅读体验。
  - date: 2026-04-09
    title: 触屏输入桥接层进入可演示阶段
    summary: 输入结构从键盘逻辑里抽离出来，正式为移动端按钮和后续手势方案留出承接空间。
devlogSlugs:
  - tetris-touch-controls
  - tetris-responsive-baseline
contribution:
  - 完成经典模式和 Rogue 模式的可玩闭环
  - 组织多端最小适配断点，并沉淀固定尺寸截图回归结果
  - 把输入层拆成动作映射、瞬时动作、持续状态和触屏桥接层
  - 收敛第一版正式触屏控件原型，为后续移动端方案打基础
outcome: 当前项目已经不只是“能玩”，而是形成了可展示的经典主线、可保留的 Rogue 原型节点，以及可继续深化的移动端输入路径。
nextStep:
  - 继续打磨移动端触控的真实可玩性，尤其是 360 x 640 的超窄场景
  - 整理分支 / PR / 合并策略，把当前里程碑节点更清楚地沉淀下来
  - 视需要补充 Web 导出或更完整的录屏展示
---

## 项目概览

`Game First Tetris` 现在最有价值的地方，不是它做了一个俄罗斯方块，而是它已经开始显露出一条长期项目线的雏形。

它同时保留了三种不同层次的目标：

- 经典模式作为稳定主线
- Rogue 模式作为低侵入实验层
- 移动端和多端适配作为“展示版能不能真正拿出去给人看”的现实约束

## 为什么这个项目值得放到站点首页

因为它很适合展示“项目是怎么变成产品雏形的”。

很多原型只证明核心玩法成立，但这个项目已经把以下几件事连起来了：

- 玩法闭环
- 阶段性路线图
- 固定尺寸回归
- Help 与 HUD 的阅读性
- 触屏输入的结构承接

也就是说，它开始从“单次实验”进入“可持续迭代”。

## 当前最关键的进展

### 1. 经典模式已经能作为稳定主线存在

这让后续所有实验都不需要建立在一条摇晃的基础上。

### 2. Rogue 原型被控制在低侵入范围内

它不是大改规则，而是通过三轮固定选择、最小强化和局间带入去验证：在不把项目拖成另一款游戏的前提下，能不能多出一层中程目标感。

### 3. 多端适配从“最后再看”提前成了持续回归内容

这一点直接提升了项目的展示价值，因为截图回归、Help 首屏可见性和窄宽度约定，本质上都在回答一个问题：别人第一次打开时能不能正常理解和进入。

### 4. 输入结构已经从键盘逻辑里抽了出来

这是我最看重的一步。它意味着后面不管是继续做移动端按钮、手势方案还是别的输入层，都不需要再把逻辑重新堆回 `_unhandled_input()`。

## 当前阶段判断

这个项目现在最适合作为“持续迭代中的重点案例”展示，而不是假装它已经做完。

原因很简单：

- 经典模式和 Rogue 模式都已经到了能讲清楚的阶段
- 移动端触控也已经到了能展示“结构思路”的阶段
- 但它还没有到完全收口、完全固定的版本

因此站点里更适合把它写成一个开放中的项目，而不是一个已经封箱的成品。
