# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 [Wails3](https://v3.wails.io/)（Go + 嵌入式 React 前端）的桌面任务管理应用。前端通过 Wails 自动生成的 bindings 调用 Go 方法。

## 开发命令

```bash
wails3 dev -config ./build/config.yml -port 9245   # 开发模式（前后端热重载），也可用 task dev
wails3 build                                        # 构建到 bin/，也可用 task build
cd frontend && npm run build                         # tsc 类型检查 + 生产构建
cd frontend && npx tsc --noEmit                      # 提交前类型校验（本项目无 lint 与测试框架）
```

## 编辑限制（重要）

1. **只允许修改 `frontend/` 目录下的代码**。不要编辑 `main.go`、`services/`、`constants/`、`utils/`、`configs/`、`build/`、`scripts/` 等后端或构建相关文件。
2. **单文件超过 500 行时必须拆分**。
3. **组件目录约定**：组件以 `xxx/index.tsx` 为标准组织，允许嵌套。样式文件按位置区分——`frontend/src/components/` 下使用 `index.less`（全局样式），其余位置（`pages/` 及其子组件等）使用 `index.module.less`（CSS Modules）。
4. **需要 Go 代码改动时，只列出所需改动，不要修改**：用文字描述要改哪个 Go 文件、哪段逻辑、改成什么样，交由用户处理。

## 架构关键点

- **前后端绑定**：Wails 据 Go 服务自动生成 `frontend/bindings/`（标注 DO NOT EDIT，前端不可手动编辑）。改 Go 方法签名/数据结构后需重新 `wails3 dev`/`wails3 build` 触发重新生成。入口为 `bindings/api/services/taskextend.ts` 与 `bindings/api/constants/models.ts`。
- **数据模型**：`TaskGroup { id, name, tasks[] }`、`Task { id, title, detail, isCompleted }`、`UpdateTask`（指针字段的部分更新结构）。任务数据按日期目录存为 `tasks.json`（日期格式 `yyyymmdd`）。
- **前端**：antd `ConfigProvider` 注入中文与自定义主题；路由 `/` → `TaskExtend`、`/task-manage` → `TaskManage`；路径别名 `@` → `frontend/src`。
- **数据刷新**：子组件多用 `onRefresh` 回调由父级重新拉取数据；绑定返回值常以 `any` 接收，新代码应逐步用 `bindings/api/constants/models.ts` 类型替代。
