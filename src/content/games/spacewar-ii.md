---
title: Spacewar II
description: 面向 Web 展示的纵向移动射击续作原型，把移动端短局射击、拾取升级、炸弹、紧凑 HUD 和结算反馈整理成可试玩项目。
summary: 一个基于 Godot 4.6.1 的纵向移动射击原型，围绕菜单、战斗、升级拾取、Boss/敌群压力和结果页形成公开展示路径。
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
thumbnail: /images/projects/spacewar-ii-cover.svg
screenshots:
  - src: /images/projects/spacewar-ii-cover.svg
    title: 第六个项目作为移动射击续作原型进入作品线
    note: 这个页面把原本只在本地目录里的 Spacewar II 纳入游戏站、试玩域名和主站外链体系。
  - src: /images/projects/spacewar-ii-battle.svg
    title: 纵向战斗画面聚焦自动射击、拾取升级和紧凑 HUD
    note: 展示重点不是扩成复杂弹幕，而是让移动端短局核心循环足够清楚。
  - src: /images/projects/spacewar-ii-result.svg
    title: 结果页收束分数、存活时间、击破数和重开路径
    note: 结果反馈让试玩结束后仍然能判断本局表现，并自然回到下一局。
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
currentPhase: 第六个游戏接入 / Web 试玩导出准备 / 展示资料补齐
syncNote: 本地项目目录已经存在菜单、战斗、HUD、升级、结果和 smoke test 结构；当前计划把它纳入统一试玩域名与游戏站内容模型。
progressSummary:
  - 项目从本地 Godot 原型补齐为游戏站第六个公开案例。
  - Web 试玩 URL 已按统一规则预留到 play.playlab.eu.cc/spacewar-ii/。
  - 站点内容先用结构化说明和视觉资产承接，后续导出验证通过后可替换为真实运行截图或试玩视频。
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
mechanic: 纵向移动 + 自动射击 + 两类敌人 + 拾取升级 + 炸弹 + HP/生命 + 结果结算
milestones:
  - date: 2026-06-28
    title: 第六个游戏进入统一内容模型
    summary: Spacewar II 从独立本地目录补进 Astro 游戏站、导出脚本、主站外链和试玩域名规则。
devlogSlugs:
  - spacewar-ii-web-playable-intake
contribution:
  - 梳理项目已有菜单、战斗、HUD、结果和 smoke test 结构
  - 将第六个游戏纳入统一游戏站信息架构
  - 为 Web 导出和试玩域名预留标准 slug
  - 先补齐展示内容，再用导出验证决定后续游戏侧修复
outcome: 这个项目现在补上了作品站身份，后续最关键的是把 Web 导出跑通并用真实截图或试玩视频替换当前站内视觉资产。
nextStep:
  - 运行 Godot Web export，确认浏览器启动、战斗、结果和返回路径
  - 用 Playwright 截图检查 canvas 非空、横竖屏缩放和 HUD 可读性
  - 通过后补真实运行截图或短视频，替换当前站内视觉资产
---

## 项目概览

`Spacewar II` 是第六个 Godot 游戏项目，定位为更偏移动端纵向射击的续作原型。

它和 `Space War` 的横向复刻方向不同：这里更强调竖向推进、短局清屏、拾取升级、炸弹释放和结果复盘。它适合放进游戏站，用来展示同一类移动射击题材在不同视角和节奏下的实现取舍。

## 当前接入重点

这次不是大规模重写玩法，而是把它补进统一公开展示链路：

- 有独立游戏内容页
- 有标准 Web 试玩 slug
- 有导出脚本条目
- 有主站项目外链目标
- 有和其他五个项目一致的验收方式

## 当前完成度判断

项目目录里已经有菜单、战斗、HUD、结果、升级和 smoke test 结构，因此它具备成为公开案例的基础。

但真正完成公开接入之前，还需要一次 Web 导出和浏览器验证。导出通过后，站点里的示意图应替换为真实运行截图或试玩视频，这样第六个游戏才和其他五个项目保持同一证据标准。

## 试玩说明

试玩入口统一预留为 `https://play.playlab.eu.cc/spacewar-ii/index.html`。首次加载会下载 Godot Web 运行时和项目资源，加载较慢属于正常现象。

基础操作：

- 移动：`WASD` / 方向键
- 射击：`Space`
- 炸弹：`X`

## 下一步

下一轮应优先跑 Web export 和浏览器截图验证。如果发现菜单、HUD、结果页或窗口缩放有问题，只修复影响展示和试玩的最小必要部分。
