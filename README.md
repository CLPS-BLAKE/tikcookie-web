# TikCookie Web

TikCookie 的前端仓库，面向 Java 教学成果展示项目，负责浏览器端页面、交互以及与后端 API 的集成。

## 项目定位

- 前后端分离架构
- 前端技术方向：Vue 3、Element Plus
- 由 Nginx 提供前端静态资源，并将 `/api` 请求转发到后端
- 对应后端仓库：[tikcookie-api](https://github.com/CLPS-BLAKE/tikcookie-api)

> 当前仓库处于协作规范初始化阶段。Node.js、包管理器和依赖版本将在前端项目骨架合并时固定。

## 文档入口

- [贡献指南](CONTRIBUTING.md)
- [项目与架构说明](docs/PROJECT_GUIDE.md)
- [开发、评审与合并流程](docs/WORKFLOW.md)
- [前后端接口协作约定](docs/API_CONTRACT.md)
- [测试与验收规范](docs/TESTING.md)
- [团队职责登记](docs/TEAM.md)
- [安全说明](SECURITY.md)

## 基本协作规则

1. 禁止直接向 `main` 推送业务代码。
2. 从最新 `main` 创建短期任务分支。
3. 所有变更通过 Pull Request 合并。
4. 每个 PR 至少需要 1 名合格评审者批准。
5. 合并前必须通过必需检查并解决全部评审讨论。
6. 统一使用 Squash merge，合并后删除任务分支。
7. 密码、Token、云密钥及真实环境配置不得进入仓库。

## 当前状态

当前提交只建立仓库文档和协作基础，不代表页面、测试、CI/CD 或云端部署已经完成。

