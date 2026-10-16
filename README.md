# TikCookie Web

TikCookie 是一个团购券教学项目。本仓库负责浏览器页面、交互和后端 API 接入。支付、退款和用券都是教学模拟，不涉及真实资金或商家履约。

技术栈为 Vue 3、Vite、Vant、Vue Router 和 Axios。以下说明以 main 的 `bd1d945` 代码为基线。已有请求代码不等于已通过联调、验收或上线。

## 页面与路由

使用 Hash history。例如首页地址为 `http://localhost:5173/#/home`。根路径 `/` 重定向到 `/login`。共有 12 个页面路由。

| 路由 | 页面 | 主要参数 |
| --- | --- | --- |
| `/login` | 手机号验证码登录 | 无 |
| `/home` | 分类、商品流、抢购入口 | 无 |
| `/search` | 商品搜索、历史和推荐 | `keyword` |
| `/detail` | 商品详情、收藏和购买 | `id`，可带 `type=FLASH` |
| `/shop` | 店铺详情、店内商品 | `shopId` |
| `/pay` | 真实订单查询、模拟支付、取消 | `orderId` |
| `/flash-queue` | 抢购请求进度、建单结果 | `productId`、`requestKey` |
| `/success` | 支付结果展示 | 从支付流程进入 |
| `/voucher` | 券码、去使用、退款入口 | `orderId` |
| `/user` | 个人资料、订单和收藏入口 | 可带 `tab` |
| `/comment` | 评价和配图 | 从订单入口进入 |
| `/favorites` | 商品和店铺收藏 | 无 |

请从真实商品和订单入口进入详情页。不要把直接访问页面时的默认价格、券码或占位内容当作业务数据。

## 当前接入范围

- 登录页调用验证码和登录接口。失败时不会使用模拟账号下单。
- 首页调用分类、商品流和抢购列表。商品详情和店铺页调用详情及商品接口。
- 搜索页调用商品搜索。推荐词池是静态内容，不是实时推荐；有店铺搜索封装不代表页面已接入店铺搜索。
- 普通购买调用下单接口。抢购会保存请求键，再提交、查询建单结果。
- 支付页查询真实订单，调用模拟支付和取消接口。结果不明时需要刷新订单状态。
- 个人中心、收藏、券页和评价页已有 API 调用，但仍有本地缓存、默认内容或失败兜底。

后端接口是否可用，需要实际联调。HTTP 501、页面可跳转或“操作成功”提示都不能单独作为验收证据。当前没有独立 mock 服务或无后端的完整购买模式。具体边界见[开发说明](docs/DEVELOPMENT.md)和[测试说明](docs/TESTING.md)。

## 本地启动与构建

Node.js 要求：`^22.18.0 || >=24.12.0`。使用 npm 和仓库内的 `package-lock.json`。

本地业务联调前，必须先启动后端依赖的中间件，再启动后端应用。前端只调用后端，不直连 MySQL、Redis、RabbitMQ 或 Elasticsearch。

在本仓库目录执行：

```bash
npm ci
npm run dev
```

开发服务配置端口为 `5173`，以终端实际输出为准。`/api` 由 Vite 代理到 `http://127.0.0.1:8080`，路径不改写。请求前缀为 `/api/v1`。

```bash
npm run build
npm run preview
```

构建输出为 `dist/`。preview 用于本地查看构建结果，不是生产部署或完整业务验收。当前 `package.json` 只有 `dev`、`build`、`preview`，没有 `test` 或 `lint` 脚本。

## 部署与图片边界

部署采用 Linux：Compose 管理 MySQL、Redis、RabbitMQ、Elasticsearch、Logstash 五个服务；后端以 JAR 运行；Nginx 托管前端 `dist/` 并转发 `/api`。Vite 开发代理不替代生产 Nginx 配置。部署操作和配置只在后端文档维护。

OSS 由后端处理。前端将图片上传到后端，使用返回的 `fileId` 关联业务，使用返回 URL 展示图片。浏览器可按 URL 读取图片，但不直接向 OSS 上传，也不保存 AccessKey、SecretKey 或其他存储凭据。

## 文档入口

前端主线：

- [开发说明](docs/DEVELOPMENT.md)：代码结构、接口约定、抢购恢复和模拟限制。
- [测试说明](docs/TESTING.md)：实际命令、人工回归和未验证项记录。

共享文档只在[后端仓库](https://github.com/CLPS-BLAKE/tikcookie-api)维护，不在前端保存同步副本：

- [项目与架构](https://github.com/CLPS-BLAKE/tikcookie-api/blob/main/docs/PROJECT_GUIDE.md)
- [需求文档](https://github.com/CLPS-BLAKE/tikcookie-api/blob/main/docs/需求文档.md)
- [部署说明](https://github.com/CLPS-BLAKE/tikcookie-api/blob/main/docs/DEPLOYMENT.md)
- [配置说明](https://github.com/CLPS-BLAKE/tikcookie-api/blob/main/docs/CONFIGURATION.md)
- [接口文档](https://github.com/CLPS-BLAKE/tikcookie-api/blob/main/docs/接口文档.md)
- [后端测试说明](https://github.com/CLPS-BLAKE/tikcookie-api/blob/main/docs/TESTING.md)

协作入口：[贡献指南](CONTRIBUTING.md)、[协作流程](docs/WORKFLOW.md)、[团队职责](docs/TEAM.md)、[安全说明](SECURITY.md)。Issue 和 PR 请使用仓库模板。
