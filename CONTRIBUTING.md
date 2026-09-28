# TikCookie Web 贡献指南

感谢参与 TikCookie 前端开发。本项目采用 `main + 短期任务分支 + Pull Request` 的协作模式。

## 开始任务前

1. 确认任务目标、验收标准和负责人。
2. 确认是否涉及后端接口、环境变量或发布顺序。
3. 同步最新主分支：

   ```bash
   git switch main
   git pull --ff-only origin main
   ```

4. 创建任务分支：

   ```bash
   git switch -c feat/<short-description>
   ```

## 分支命名

| 类型 | 用途 | 示例 |
| --- | --- | --- |
| `feat/` | 新功能 | `feat/product-search` |
| `fix/` | 缺陷修复 | `fix/login-redirect` |
| `refactor/` | 不改变行为的重构 | `refactor/request-client` |
| `test/` | 测试相关 | `test/order-page` |
| `docs/` | 文档变更 | `docs/api-contract` |
| `chore/` | 工程与依赖维护 | `chore/update-eslint` |

分支名使用小写英文和连字符，不使用个人姓名或长期存在的个人分支。

## 提交规范

提交信息采用 Conventional Commits 风格：

```text
<type>(<scope>): <summary>
```

示例：

```text
feat(product): add keyword search form
fix(auth): preserve redirect after login
docs(workflow): clarify review requirements
```

常用 `type`：`feat`、`fix`、`refactor`、`test`、`docs`、`chore`、`build`、`ci`。

## 本地检查

前端项目骨架建立后，提交前至少执行仓库声明的：

- 依赖锁定安装
- 代码格式检查
- 静态检查或类型检查
- 自动化测试
- 生产构建

不得通过删除测试、跳过检查或提交生成目录来规避失败。

## Pull Request 要求

PR 必须：

- 使用清晰标题，说明修改目的。
- 关联任务或 Issue。
- 描述主要修改、验证结果和影响范围。
- 对页面变化附截图或录屏。
- 说明接口、环境变量或发布顺序的变化。
- 保持范围单一，避免混入无关格式化或重构。

评审意见处理完毕、CI 通过且获得批准后，由代码管理员 Squash 合并。

## 禁止事项

- 直接推送或强制推送 `main`。
- 提交 `.env`、密码、Token、云密钥或生产地址中的敏感参数。
- 未经说明破坏现有接口兼容性。
- 在一个 PR 中混合多个不相关需求。

