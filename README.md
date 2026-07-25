# TaskManager

基于 [Wails3](https://v3.wails.io/) + React + TypeScript 构建的桌面端任务管理应用。以日期为单位组织任务，支持按日期创建任务、继承未完成任务、分组管理及 Markdown 任务详情编辑。

## 技术栈

- **后端**: Go 1.25 + Wails3 v3
- **前端**: React 18 + TypeScript + Vite
- **UI 框架**: Ant Design 6（含中文语言与自定义主题）
- **其他**: dayjs（日期处理）、Vditor（Markdown 编辑器）、react-router 7

## 功能特性

- 以日期为维度组织任务列表，左侧导航展示历史日期
- 新建日期任务时，可指定从某日期继承未完成任务
- 任务分组管理，支持新增分组与组内任务
- 任务标题行内可编辑（回车确认 / ESC 取消）
- 任务详情使用 Markdown 编辑，支持粘贴图片（带类型校验）
- antd 自定义主题配色（主题色、圆角、阴影等）

## 目录结构

```text
.
├── main.go                 # 应用入口，配置窗口与资源
├── services/               # Go 后端服务
│   ├── taskExtend.go       # 任务/日期相关业务逻辑
│   └── imageServer.go      # 图片资源服务
├── constants/              # 数据结构定义（TaskGroup 等）
├── utils/                  # 后端工具方法
├── configs/                # 配置文件
├── build/                  # 构建相关（各平台 Taskfile）
├── frontend/               # 前端工程
│   ├── src/
│   │   ├── main.tsx        # 应用入口（ConfigProvider 主题/语言）
│   │   ├── constants/      # 前端常量与主题
│   │   ├── components/     # 通用组件（EditableText 等）
│   │   └── pages/          # 页面
│   │       ├── TaskExtend/ # 日期任务主界面
│   │       └── TaskManage/
│   ├── public/             # 全局样式
│   └── dist/               # 构建产物（嵌入到二进制）
├── Taskfile.yml            # 任务脚本入口
└── go.mod
```

## 快速开始

### 环境要求

- Go 1.25+
- Node.js + npm/yarn
- [Wails3 CLI](https://v3.wails.io/) (`wails3`)

### 安装依赖

```bash
# 前端依赖
cd frontend && npm install && cd ..

# Go 依赖
go mod tidy
```

### 开发模式

```bash
wails3 dev
```

该命令会同时启动后端与前端，支持前后端热重载。

### 构建产物

```bash
wails3 build
```

生成的可执行文件位于 `bin/` 目录。

也可使用 Taskfile 提供的快捷命令：

```bash
task dev       # 开发模式
task build     # 构建
task run       # 运行已构建产物
task build:server   # 以服务端模式（无 GUI）构建
task run:server     # 运行服务端模式
```

## 数据存储

任务数据以 `tasks.json` 文件形式按日期目录存储在用户本地目录中（具体路径见 `utils/` 中的实现）。每个日期对应一个目录，包含该日期的任务分组与任务详情。

## 相关链接

- [Wails3 文档](https://v3.wails.io/)
- [Ant Design 文档](https://ant.design/)
- [Vditor 文档](https://github.com/Vanessa219/vditor)
