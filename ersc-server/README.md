# ERSC Server

基于NestJS实现的ERSC服务端应用。

## 环境要求

- Node.js (>= 16.x)
- npm 或 pnpm

## 安装依赖

```bash
# 使用npm
npm install

# 或使用pnpm
pnpm install
```

## 开发运行

```bash
# 开发模式
npm run start:dev

# 或使用pnpm
pnpm start:dev
```

## API文档

启动应用后，可以通过以下地址访问Swagger API文档：

```
http://localhost:3000/api/docs
```

API文档提供了所有接口的详细说明和在线测试功能。

## 构建和生产运行

```bash
# 构建项目
npm run build

# 生产模式运行
npm run start:prod

# 或使用pnpm
pnpm build
pnpm start:prod
```

## 项目结构

```
src/
├── main.ts                  # 应用程序入口
├── app.module.ts            # 应用程序主模块
├── projects/                # 项目模块
│   ├── dto/                 # 数据传输对象
│   ├── entities/            # 实体定义
│   ├── projects.controller.ts
│   ├── projects.module.ts
│   └── projects.service.ts
├── files/                   # 文件模块
│   ├── files.controller.ts
│   ├── files.module.ts
│   └── files.service.ts
└── shared/                  # 共享模块
    ├── constants.ts         # 常量定义
    └── utils/               # 工具函数
```