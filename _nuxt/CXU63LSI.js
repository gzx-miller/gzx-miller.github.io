const n=`// ═══════════════════════════════════════════
// D12 - 包管理与 SemVer 示例
// ═══════════════════════════════════════════

// ───────── SemVer (语义化版本) ─────────
// 格式：MAJOR.MINOR.PATCH
// 主版本.次版本.修订版本

// MAJOR (主版本): 不兼容的 API 变更
// MINOR (次版本): 向下兼容的功能新增
// PATCH (修订版本): 向下兼容的问题修复

// 示例：2.4.1
// 主版本 2，次版本 4，修订版本 1

// ───────── 版本范围符号 ─────────

// 精确版本
// "2.4.1"       必须完全等于 2.4.1

// 范围符号
// ^2.4.1        兼容 2.x.x，>=2.4.1 <3.0.0  (主版本不变)
// ~2.4.1        兼容 2.4.x，>=2.4.1 <2.5.0  (次版本不变)
// >=2.4.1       大于等于 2.4.1
// <=2.4.1       小于等于 2.4.1
// >2.4.1        大于 2.4.1
// <2.4.1        小于 2.4.1
// 2.4.1 - 3.0.0  范围，包含两端

// 预发布版本
// 1.0.0-alpha    Alpha 测试版
// 1.0.0-beta     Beta 测试版
// 1.0.0-rc.1     发布候选版

// ───────── package.json 常用字段 ─────────

const examplePackageJson = {
  name: 'my-awesome-package',
  version: '1.2.3',
  description: '一个示例包',
  main: 'dist/index.cjs',        // CommonJS 入口
  module: 'dist/index.mjs',      // ESM 入口
  types: 'dist/index.d.ts',      // TypeScript 类型声明
  type: 'module',                // ESM 模式 (.js 默认 ESM)

  // 入口点（现代推荐）
  exports: {
    '.': {
      import: './dist/index.mjs',
      require: './dist/index.cjs',
      types: './dist/index.d.ts'
    },
    './utils': {
      import: './dist/utils.mjs',
      require: './dist/utils.cjs'
    }
  },

  // 运行时依赖
  dependencies: {
    'express': '^4.18.0',
    'lodash': '~4.17.21'
  },

  // 开发依赖
  devDependencies: {
    'typescript': '^5.0.0',
    'vite': '^4.0.0',
    'vitest': '^0.34.0'
  },

  // 对等依赖（需要使用者安装）
  peerDependencies: {
    'react': '>=17.0.0'
  },

  // 可选依赖
  optionalDependencies: {
    'fsevents': '^2.3.0'
  },

  // 脚本
  scripts: {
    dev: 'vite',
    build: 'vite build',
    test: 'vitest',
    lint: 'eslint src/',
    preview: 'vite preview'
  },

  // 引擎版本要求
  engines: {
    node: '>=18.0.0',
    npm: '>=9.0.0'
  },

  // 仓库信息
  repository: {
    type: 'git',
    url: 'https://github.com/user/repo.git'
  },

  // 许可证
  license: 'MIT',

  // 作者
  author: 'Your Name <email@example.com>',

  // 关键字
  keywords: ['nodejs', 'example', 'demo'],

  // 私密包（不会发布到 npm）
  private: true,

  // 工作区（monorepo）
  workspaces: [
    'packages/*'
  ]
}

// ───────── npm / pnpm / yarn 常用命令 ─────────

// 安装依赖
// npm install / npm i
// pnpm install
// yarn

// 安装指定包
// npm install express
// npm install -D typescript        开发依赖
// npm install -g nodemon           全局安装
// npm install express@4.18.0       指定版本
// npm install express@latest       最新版本

// 卸载包
// npm uninstall express

// 更新包
// npm update
// npm outdated                    检查过时的包
// npm upgrade                     升级包

// 运行脚本
// npm run dev
// npm test
// npm start

// 查看包信息
// npm view express
// npm list                        列出已安装的包
// npm list --depth=0              只看顶层

// 清理缓存
// npm cache clean --force

// ───────── package-lock.json / pnpm-lock.yaml / yarn.lock ─────────
// 锁定文件的作用：
// 1. 确保团队成员安装完全相同的依赖版本
// 2. 记录依赖树的完整信息
// 3. 加快安装速度（缓存）
// 提交到版本控制！

// ───────── 版本更新策略 ─────────

// 1. 使用 ^ 前缀（推荐）
// "express": "^4.18.0"
// 自动升级次版本和修订版本，主版本不变
// 最常用，兼顾安全和新功能

// 2. 使用 ~ 前缀（更保守）
// "express": "~4.18.0"
// 只升级修订版本，次版本不变
// 更稳定，但可能错过新功能

// 3. 精确版本（最保守）
// "express": "4.18.0"
// 完全固定，不会自动升级
// 最稳定，但需要手动更新

// 4. latest 标签
// "express": "latest"
// 始终安装最新版本
// 不推荐，可能引入不兼容变更

// ───────── 安全相关 ─────────

// 检查安全漏洞
// npm audit
// npm audit fix
// pnpm audit

// 常用安全工具
// - npm audit: 内置漏洞扫描
// - snyk: 专业安全扫描
// - dependabot: GitHub 自动更新依赖

// ───────── 依赖管理最佳实践 ─────────

// 1. 区分 dependencies 和 devDependencies
//    运行时需要的 → dependencies
//    构建/测试/开发工具 → devDependencies

// 2. 定期更新依赖
//    - 修复安全漏洞
//    - 获取新功能
//    - 但更新前要测试！

// 3. 使用 lock 文件
//    package-lock.json / pnpm-lock.yaml
//    必须提交到版本控制

// 4. 不要全局安装太多包
//    用 npx 运行一次性工具
//    npx create-vite@latest

// 5. 避免依赖地狱
//    - 减少不必要的依赖
//    - 优先选择维护活跃的包
//    - 检查包的下载量、最近更新时间

// ───────── Monorepo 与工作区 ─────────

// pnpm workspaces 示例（pnpm-workspace.yaml）
// packages:
//   - 'apps/*'
//   - 'packages/*'

// 好处：
// - 共享代码方便
// - 依赖统一管理
// - 原子化提交
// - 统一构建流程

// 工具：
// - pnpm workspaces
// - npm workspaces
// - yarn workspaces
// - Turborepo / Nx（构建工具）

// ───────── 发布包到 npm ─────────
// 1. npm adduser          登录
// 2. npm publish          发布
// 3. npm version patch    升级版本号
// 4. npm unpublish       撤销发布（谨慎使用）

// ───────── npx 使用场景 ─────────
// npx create-vite@latest        创建新项目
// npx eslint --init             初始化 eslint
// npx serve .                   启动静态文件服务
// npx --no-install cowsay hi    强制不使用本地安装的版本
`;export{n as default};
