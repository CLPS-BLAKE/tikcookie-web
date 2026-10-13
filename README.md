# TikCookie Web

TikCookie 的前端仓库，面向 Java 教学成果展示项目，负责浏览器端页面、交互以及与后端 API 的集成。

> 2026-10-13 抢购说明：当前工作区抢购路径已实现，请先阅读 [抢购用户使用指南](docs/FLASH_SALE_USER_GUIDE.md)。下方旧日期状态保留为历史，不表示当前实现仍未完成，也不证明新版本已发布。

## 项目定位

- 前后端分离架构
- 实际前端技术栈：Vue 3、Vite、Vant、Vue Router、Axios
- 由 Nginx 提供前端静态资源，并将 `/api` 请求转发到后端
- 对应后端仓库：[tikcookie-api](https://github.com/CLPS-BLAKE/tikcookie-api)

> 2026-10-08 更新：远端 main 已有工程、10 个页面路由及登录请求，但多数业务仍为模拟。ECS 为 2 核 4 GB，四种中间件同驻 node1；后端已部署阿里云，Nginx/前端待部署，后端具体实例及是否同驻 node1 待记录。详见 [实现进度](docs/PROGRESS.md)。
> 同日部署补充：负责人确认 Logstash 已通过 Compose 部署并同步 MySQL → ES，店铺 5/5、商品 30/30，两个索引 mapping 符合配置。Java 搜索 API 和 RabbitMQ 消费同步仍待完成；见 [Logstash 部署记录](docs/LOGSTASH_SYNC.md)。

## 文档入口

- [抢购用户使用指南（操作流程、限购与异常处理）](docs/FLASH_SALE_USER_GUIDE.md)
- [贡献指南](CONTRIBUTING.md)
- [项目与架构说明](docs/PROJECT_GUIDE.md)
- [实现进度与优先待办（同步自后端）](docs/PROGRESS.md)
- [开发、评审与合并流程](docs/WORKFLOW.md)
- [前后端接口协作约定](docs/API_CONTRACT.md)
- [接口文档（同步自后端仓库）](docs/接口文档.md)
- [需求文档（同步自后端仓库）](docs/需求文档.md)
- [中间件配置（同步自后端仓库）](docs/中间件配置.md)
- [测试与验收规范](docs/TESTING.md)
- [团队职责登记](docs/TEAM.md)
- [安全说明](SECURITY.md)

> `docs/接口文档.md`、`docs/需求文档.md`、`docs/中间件配置.md`、`docs/PROGRESS.md` 同步自后端仓库 [tikcookie-api](https://github.com/CLPS-BLAKE/tikcookie-api)，保持内容一致，不在前端单独修改；后端更新后重新同步并回填对应文档提交号。
>
> 同步记录：
> - 2026-10-13：新增共享抢购用户指南，与后端同名文档保持一致；技术设计以 tikcookie-api 的 docs/FLASH_SALE.md 为准。本次是本地文档补充，提交号在提交/合并后回填，不表示线上已发布。
> - `833f759`（2026-09-28）：首次同步，三份文档与后端一致。
> - 待回填提交号：数据库由 MongoDB 8.0 换成 MySQL 8.0 + MyBatis-Plus，对应后端文档的 v3 版（2026-09-29）。本次 `需求文档.md` 和 `中间件配置.md` 内容有更新，`接口文档.md` 未变。
> - 2026-10-08：同步本地后端修订的四份共享文档，更新实现状态、用户“去使用”、node1 同机部署和待办；代码核对基线为后端 `af739da` / 前端 `dfe3b54`。本次文档尚未提交，合并后回填文档 SHA，不把代码基线当作新文档提交号。

## 本地开发与构建

以下命令在包含前端源码的 main 或任务分支中执行；若当前检出较早的文档同步分支且没有 package.json，需先按协作流程合入/切换源码版本，保留已有本地修改，不要误认为远端尚无工程。

- 包管理器：npm，依赖锁文件为 package-lock.json；安装使用 `npm ci`。
- Node.js：package.json 的 engines 为 `^22.18.0 || >=24.12.0`。
- `npm run dev`：开发服务，默认 5173；Vite 将 `/api` 代理到 `http://127.0.0.1:8080`，它指向本地后端，不是 node1 中间件。
- `npm run build`：生成 dist；`npm run preview`：预览构建物。
- 当前 package.json 没有 test/lint 脚本；本地已有 tests 目录，可运行 node --test tests/*.test.js 验证购买、身份、额度及支付等流程，npm run build 检查构建。实际执行结果应另行记录，不能据文档声明测试通过。

已有页面：登录、首页、搜索、商品详情、店铺、支付、交易成功、券详情、个人中心/订单、评价。前端只调用后端 API，不直连 node1 的中间件；图片展示可直接使用后端返回的 OSS URL。

## 基本协作规则

1. 禁止直接向 `main` 推送业务代码。
2. 从最新 `main` 创建短期任务分支。
3. 所有变更通过 Pull Request 合并。
4. 每个 PR 至少需要 1 名合格评审者批准。
5. 合并前必须通过必需检查并解决全部评审讨论。
6. 统一使用 Squash merge，合并后删除任务分支。
7. 密码、Token、云密钥及真实环境配置不得进入仓库。

## 当前状态

2026-10-13 当前工作区已实现首页真实抢购列表、商品个人额度、购买进度及本人结果查询、原请求重试/主动再买、真实订单模拟支付与取消；使用方式见 [用户指南](docs/FLASH_SALE_USER_GUIDE.md)。这些本地变更不代表已合并或已部署。券页核销/退款仍有模拟成功兜底等相邻能力边界，不能仅凭页面提示验收。下方 2026-10-08 main 状态保留为历史基线，不用于否定当前已实现的抢购路径。

以 2026-10-08 核对的远端 main `dfe3b54` 为基线：页面和路由原型已有，Axios 支持 `/api/v1`、Bearer token 和错误提示；登录已尝试真实接口，但失败后会写假 token 并仍提示成功，必须修正，不能算登录验收通过。

首页/店铺/商品主要硬编码，跳转不带真实 ID；搜索、交易、订单列表、资料/头像和收藏待真实接入。先完成购买闭环，再补搜索/收藏与测试。后端已在阿里云部署，但 Nginx/前端部署和全链路验收仍待完成；评价、配送、购物车等原型不在本期范围。

