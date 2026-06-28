---
title: Spacewar II
description: 面向 Web 展示的纵向移动射击续作原型，把移动端短局射击、差异化敌群、拾取升级、炸弹、Boss 相位、连击奖励、紧凑 HUD 和结算反馈整理成可试玩项目。
summary: 一个基于 Godot 4.6.1 的纵向移动射击原型，围绕菜单、scout/diver/sweeper/tank 敌群、Boss 阶段升级、多向弹幕、清敌弹、升级拾取、短窗口连击、清关资源结算、HUD 和结果页形成公开展示路径。
pubDate: 2026-06-28
updatedDate: 2026-06-28
status: playable
featured: true
tags:
  - Godot 4
  - Vertical Shooter
  - Mobile Shooter
  - Web Demo
  - Prototype
engine: Godot 4.6.1
platforms:
  - Web 试玩
  - Windows
thumbnail: /images/projects/spacewar-ii-menu.png
screenshots:
  - src: /images/projects/spacewar-ii-menu.png
    title: 真实运行主菜单已经承接玩法目标、操作说明和开始入口
    note: 这张截图来自本地 Godot 运行采集，说明第六个项目不再只是站点占位，而是具备可打开的展示入口。
  - src: /images/projects/spacewar-ii-battle.png
    title: Boss 阶段、紧凑 HUD 和多向弹幕形成纵向射击的终盘压力
    note: 展示重点是移动端短局里的路线推进、武器等级、炸弹库存、Boss 压力和画面可读性。
  - src: /images/projects/spacewar-ii-result.png
    title: 结果页收束分数、路线、击破数、升级数、最高连击和重开路径
    note: 结果反馈已经包含清关资源奖励和短窗口连击奖励，让试玩结束后仍然能判断本局表现，并自然回到下一局。
playableWeb: true
embedUrl: https://play.playlab.eu.cc/spacewar-ii/index.html
downloadLinks:
  - label: Web 试玩版（新标签打开）
    url: https://play.playlab.eu.cc/spacewar-ii/index.html
role: 续作方向整理 / Godot 原型收口 / Web 试玩接线 / 展示内容补齐
teamSize: 单人
workspacePath: 'D:\workspace4Cursor\game\spacewar II'
syncRepoPath: 'D:\workspace4Cursor\game\spacewar II'
currentBranch: main
currentPhase: 第六个游戏接入 / Web 试玩导出已打通 / 真实截图已补齐 / 浏览器检查通过
syncNote: 本地项目目录已经存在菜单、战斗、HUD、升级、结果和 smoke test 结构；当前已纳入统一试玩域名、导出脚本与游戏站内容模型。
progressSummary:
  - 项目从本地 Godot 原型补齐为游戏站第六个公开案例。
  - Web 试玩 URL 已按统一规则接到 play.playlab.eu.cc/spacewar-ii/，并通过本地导出与浏览器检查。
  - 菜单、Boss 战斗和结果页的真实运行截图已经补入项目页。
  - 敌群已经扩展到 scout、diver、sweeper、tank，Boss 具备阶段升级、多向弹幕、清敌弹收束、连击奖励和清关资源结算。
keyDocs:
  - label: 项目说明
    path: README.md
  - label: 设计文档
    path: docs/GDD.md
  - label: 阶段记录
    path: docs/stage-2-spacewar-notes.md
directoryMap:
  - label: scenes/
    summary: 菜单、战斗、玩家、敌人、拾取物、结果等 Godot 场景。
  - label: scripts/
    summary: BattleController、WaveDirector、GameState、Nokia 系列实体与 UI 脚本。
  - label: ui/
    summary: HUD 与移动射击界面的 UI 场景。
  - label: docs/
    summary: 设计方向、阶段记录和玩法说明。
challenge: 在已有 Space War 横版复刻之外，补出一个更偏移动端纵向射击的续作原型，并让它达到和其他五个项目相同的公开展示标准。
mechanic: 纵向移动 + 自动射击 + scout/diver/sweeper/tank 敌群 + 拾取升级 + 炸弹清场 + 短窗口连击 + Boss 阶段升级 + 清关资源结算 + HP/生命 + 结果结算
milestones:
  - date: 2026-06-28
    title: 第六个游戏进入统一内容模型
    summary: Spacewar II 从独立本地目录补进 Astro 游戏站、导出脚本、主站外链和试玩域名规则。
devlogSlugs:
  - spacewar-ii-web-playable-intake
contribution:
  - 梳理并补强项目已有菜单、战斗、HUD、结果和 smoke test 结构
  - 补齐差异化敌群、Boss 阶段、多向弹幕、短窗口连击、清敌弹、清关资源结算和结果反馈
  - 将第六个游戏纳入统一游戏站信息架构
  - 为 Web 导出和试玩域名接入标准 slug
  - 采集真实运行截图，替换站点里的 SVG 示意图
  - 通过导出与浏览器检查确认它可以作为第六个 Web 试玩项目展示
outcome: 这个项目现在补上了作品站身份，并完成 Web 试玩接线、真实截图、基础浏览器检查和正式展品级战斗流程补强。
nextStep:
  - 后续可补一段真实试玩短视频，继续增强证据链
  - 继续观察移动端横竖屏缩放和 HUD 可读性
  - 后续只修复影响公开展示和试玩可信度的问题
---

## 项目概览

`Spacewar II` 是第六个 Godot 游戏项目，定位为更偏移动端纵向射击的续作原型。

它和 `Space War` 的横向复刻方向不同：这里更强调竖向推进、短局清屏、拾取升级、炸弹释放和结果复盘。它适合放进游戏站，用来展示同一类移动射击题材在不同视角和节奏下的实现取舍。

## 当前接入重点

这次不是大规模重写玩法，而是把它补进统一公开展示链路，并补到能被当作正式展品打开的状态：

- 有独立游戏内容页
- 有标准 Web 试玩 slug
- 有导出脚本条目
- 有主站项目外链目标
- 有和其他五个项目一致的验收方式
- 有差异化敌群、Boss 阶段、多向弹幕、清敌弹、HUD 和结果页

## 当前完成度判断

项目目录里已经有菜单、战斗、HUD、结果、升级和 smoke test 结构，并已经通过本地 Web 导出和浏览器检查，因此它不再只是“预留第六个位置”。

当前最关键的展示点是：`scout`、`diver`、`sweeper`、`tank` 让敌群有基础差异；Boss 阶段升级和多向弹幕让终盘有明确高潮；清敌弹、升级拾取和结果页让一局结束后能自然进入下一次试玩。站点里已经补入菜单、战斗和结果页的真实运行截图，证据标准已经和其他五个项目更接近。

## 试玩说明

试玩入口统一为 `https://play.playlab.eu.cc/spacewar-ii/index.html`。首次加载会下载 Godot Web 运行时和项目资源，加载较慢属于正常现象。

基础操作：

- 移动：`WASD` / 方向键
- 射击：`Space`
- 炸弹：`X`

## 下一步

下一轮优先补真实试玩短视频，并继续观察移动端横竖屏缩放。如果发现菜单、HUD、结果页或窗口缩放有问题，只修复影响展示和试玩的最小必要部分。
