# 小松鼠举栗子

一个基于 `Nuxt 4 + Vue 3 + TypeScript + Pinia + Element Plus` 的中文前端知识案例库，通过独立真实案例展示 Vue3、TypeScript、工程化、Nuxt 等前端知识点。

主题是“小松鼠举栗子”：秋日枫叶森林里，一只可爱小松鼠抱着栗子。每个知识点都是一个栗子，适合按顺序逐个学习。

## 启动

```bash
pnpm install
pnpm dev
```

默认 Vue3 学习入口：

```text
/vue
```

具体章节路由示例：

```text
/vue/k-1/app-entry
/vue/k-12/routing/lee
```

## 验证

```bash
pnpm type-check
pnpm test
pnpm build
```

`pnpm build` 使用 `nuxt generate` 静态生成全部课程路由，产物位于：

```text
.output/public
```

该目录可直接部署到 GitHub Pages。仓库内的 GitHub Actions 会在 `main` 分支更新后发布到 `gh-pages` 分支。

## 学习顺序

顶部导航包含 7 个可学习分类，共 118 个独立案例：`Vue3`、`Element Plus`、`TypeScript`、`React`、`工程化`、`LangChain` 与 `Nuxt`。

每个章节都是可独立访问和静态生成的页面，右侧包含案例演示、关键代码、原理、处理流程、注意事项和解决的问题。

## 约定

- 页面展示使用中文，变量名和文件名使用英文。
- 路由需要保留知识类别层级，例如 Vue3 分类使用 `/vue/...`。
- 视觉风格参考秋日森林、红橙枫叶、暖光、小松鼠和栗子。
- 每个知识点只解决一个核心问题，避免重复讲解。
- 新增案例展示时使用 `🌰序号`，左侧导航标题使用短标题，正文标题可以更完整。
- 提交前至少运行 `pnpm type-check`、`pnpm test` 和 `pnpm build`。
