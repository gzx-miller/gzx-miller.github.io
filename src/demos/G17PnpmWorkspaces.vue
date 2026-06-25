<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'config' | 'deps' | 'commands'>('config')

interface Pkg {
  name: string
  path: string
  version: string
  deps: { name: string; version: string; isWorkspace: boolean }[]
  devDeps: { name: string; version: string; isWorkspace: boolean }[]
}

const packages = ref<Pkg[]>([
  {
    name: '@acme/core',
    path: 'packages/core',
    version: '1.2.0',
    deps: [],
    devDeps: [
      { name: 'typescript', version: '^5.3.0', isWorkspace: false },
    ],
  },
  {
    name: '@acme/ui',
    path: 'packages/ui',
    version: '0.8.0',
    deps: [
      { name: '@acme/core', version: 'workspace:*', isWorkspace: true },
    ],
    devDeps: [
      { name: 'vue', version: '^3.4.0', isWorkspace: false },
      { name: 'typescript', version: '^5.3.0', isWorkspace: false },
    ],
  },
  {
    name: '@acme/web',
    path: 'apps/web',
    version: '2.0.0',
    deps: [
      { name: '@acme/core', version: 'workspace:*', isWorkspace: true },
      { name: '@acme/ui', version: 'workspace:*', isWorkspace: true },
    ],
    devDeps: [
      { name: 'vite', version: '^5.0.0', isWorkspace: false },
      { name: 'vue', version: '^3.4.0', isWorkspace: false },
    ],
  },
  {
    name: '@acme/docs',
    path: 'apps/docs',
    version: '1.0.0',
    deps: [
      { name: '@acme/ui', version: 'workspace:*', isWorkspace: true },
    ],
    devDeps: [
      { name: 'vitepress', version: '^1.0.0', isWorkspace: false },
    ],
  },
])

const selectedPkg = ref<string>('@acme/web')

const selectedPackage = computed(() =>
  packages.value.find((p) => p.name === selectedPkg.value)
)

const workspaceConfigCode = `<span style="color:#8a8a3a"># pnpm-workspace.yaml</span>
packages:
  - <span style="color:#a3b380">'apps/*'</span>
  - <span style="color:#a3b380">'packages/*'</span>

<span style="color:#7c7c99"># 排除特定目录</span>
  - <span style="color:#cc997a">'!**/test'</span>`

const packageJsonCode = `<span style="color:#8a8a3a">// packages/ui/package.json</span>
{
  <span style="color:#cc997a">"name"</span>: <span style="color:#a3b380">"@acme/ui"</span>,
  <span style="color:#cc997a">"version"</span>: <span style="color:#a3b380">"0.8.0"</span>,
  <span style="color:#cc997a">"dependencies"</span>: {
    <span style="color:#cc997a">"@acme/core"</span>: <span style="color:#a3b380">"workspace:*"</span>
  },
  <span style="color:#cc997a">"devDependencies"</span>: {
    <span style="color:#cc997a">"vue"</span>: <span style="color:#a3b380">"^3.4.0"</span>,
    <span style="color:#cc997a">"typescript"</span>: <span style="color:#a3b380">"^5.3.0"</span>
  }
}`

const commandsCode = `<span style="color:#7c7c99"># 安装所有依赖</span>
pnpm install

<span style="color:#7c7c99"># 在指定包中运行命令</span>
pnpm <span style="color:#cc997a">--filter</span> @acme/web dev
pnpm <span style="color:#cc997a">--filter</span> @acme/ui build

<span style="color:#7c7c99"># 给指定包添加依赖</span>
pnpm <span style="color:#cc997a">--filter</span> @acme/ui add lodash

<span style="color:#7c7c99"># 给所有包添加开发依赖</span>
pnpm <span style="color:#cc997a">-w</span> add -D typescript

<span style="color:#7c7c99"># 查看依赖图</span>
pnpm list --filter @acme/web --depth 2`

const commonCommands = [
  { cmd: 'pnpm install', desc: '安装所有工作区依赖' },
  { cmd: 'pnpm --filter <pkg> <cmd>', desc: '在指定包运行命令' },
  { cmd: 'pnpm --filter <pkg> add <dep>', desc: '给指定包添加依赖' },
  { cmd: 'pnpm -w add -D <dep>', desc: '在根目录添加开发依赖' },
  { cmd: 'pnpm -r build', desc: '递归运行所有包的 build' },
  { cmd: 'pnpm list --depth 0', desc: '查看一级依赖' },
]

const ghostDepDemo = ref({
  npm: { has: true, desc: 'npm/yarn 容易产生幽灵依赖' },
  pnpm: { has: false, desc: 'pnpm 严格隔离，无幽灵依赖' }
})

function toggleGhost() {
  ghostDepDemo.value.npm.has = !ghostDepDemo.value.npm.has
  ghostDepDemo.value.pnpm.has = !ghostDepDemo.value.pnpm.has
}
</script>

<template>
  <div class="demo-card">
    <h3>pnpm Workspace Monorepo 工作区</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置文件</button>
      <button class="tab-btn" :class="{ active: activeTab === 'deps' }" @click="activeTab = 'deps'">依赖管理</button>
      <button class="tab-btn" :class="{ active: activeTab === 'commands' }" @click="activeTab = 'commands'">常用命令</button>
    </div>

    <div v-if="activeTab === 'config'">
      <p class="demo-hint">pnpm workspace 通过 pnpm-workspace.yaml 定义多包项目结构，支持 workspace 协议引用内部包。</p>
      <pre class="mini-code" v-html="workspaceConfigCode"></pre>
      <pre class="mini-code" v-html="packageJsonCode" style="margin-top:8px;"></pre>
      <div class="tips-box">
        <p><strong>workspace 协议：</strong><code>workspace:*</code> 表示引用工作区内的最新版本，发布时自动替换为实际版本号。</p>
        <p><strong>目录约定：</strong><code>apps/*</code> 放应用，<code>packages/*</code> 放可复用的库包。</p>
      </div>
    </div>

    <div v-if="activeTab === 'deps'">
      <p class="demo-hint">点击包查看其依赖关系，内部包使用 workspace 协议引用。</p>

      <div class="pkg-selector">
        <button
          v-for="pkg in packages"
          :key="pkg.name"
          class="pkg-btn"
          :class="{ active: selectedPkg === pkg.name }"
          @click="selectedPkg = pkg.name"
        >
          {{ pkg.name }}
          <span class="pkg-ver">v{{ pkg.version }}</span>
        </button>
      </div>

      <div v-if="selectedPackage" class="pkg-detail-box">
        <p><strong>路径：</strong><code>{{ selectedPackage.path }}</code></p>
        <p><strong>运行时依赖：</strong></p>
        <ul v-if="selectedPackage.deps.length" class="dep-list">
          <li v-for="dep in selectedPackage.deps" :key="dep.name">
            <span class="dep-name">{{ dep.name }}</span>
            <span class="dep-ver" :class="{ workspace: dep.isWorkspace }">{{ dep.version }}</span>
            <span v-if="dep.isWorkspace" class="ws-badge">工作区</span>
          </li>
        </ul>
        <p v-else><small>无运行时依赖</small></p>

        <p style="margin-top:8px;"><strong>开发依赖：</strong></p>
        <ul v-if="selectedPackage.devDeps.length" class="dep-list">
          <li v-for="dep in selectedPackage.devDeps" :key="dep.name">
            <span class="dep-name">{{ dep.name }}</span>
            <span class="dep-ver">{{ dep.version }}</span>
          </li>
        </ul>
        <p v-else><small>无开发依赖</small></p>
      </div>

      <div class="ghost-demo">
        <h4>幽灵依赖对比</h4>
        <div class="ghost-row">
          <div class="ghost-col" :class="{ 'has-ghost': ghostDepDemo.npm.has }">
            <strong>npm / yarn</strong>
            <p>{{ ghostDepDemo.npm.desc }}</p>
            <span class="ghost-status">{{ ghostDepDemo.npm.has ? '⚠️ 有幽灵依赖' : '✓ 无幽灵依赖' }}</span>
          </div>
          <div class="ghost-col" :class="{ 'has-ghost': ghostDepDemo.pnpm.has }">
            <strong>pnpm</strong>
            <p>{{ ghostDepDemo.pnpm.desc }}</p>
            <span class="ghost-status">{{ ghostDepDemo.pnpm.has ? '⚠️ 有幽灵依赖' : '✓ 严格隔离' }}</span>
          </div>
        </div>
        <button @click="toggleGhost">切换对比模式</button>
      </div>
    </div>

    <div v-if="activeTab === 'commands'">
      <p class="demo-hint">pnpm 提供了丰富的命令来管理多包项目。</p>
      <pre class="mini-code" v-html="commandsCode"></pre>
      <table style="margin-top:12px;">
        <thead><tr><th>命令</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="c in commonCommands" :key="c.cmd">
            <td><code>{{ c.cmd }}</code></td>
            <td><small>{{ c.desc }}</small></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>--filter 语法：</strong>支持 <code>@acme/web</code>、<code>@acme/*</code>、<code>./apps/*</code> 等多种匹配方式。</p>
        <p><strong>-w / --workspace-root：</strong>在工作区根目录执行操作。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
.demo-hint { font-size: 13px; color: #8a6d42; margin-bottom: 10px; }
.pkg-selector { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.pkg-btn { padding: 6px 12px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; display: flex; flex-direction: column; align-items: center; }
.pkg-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.pkg-ver { font-size: 11px; opacity: 0.7; }
.pkg-detail-box { background: #fff8f0; padding: 12px; border-radius: 6px; margin-bottom: 12px; }
.pkg-detail-box p { margin: 4px 0; }
.dep-list { list-style: none; padding: 0; margin: 4px 0; }
.dep-list li { display: flex; align-items: center; gap: 8px; padding: 3px 0; font-size: 13px; }
.dep-name { font-family: monospace; }
.dep-ver { color: #8a6d42; font-size: 12px; }
.dep-ver.workspace { color: #e85d04; font-weight: bold; }
.ws-badge { background: #e85d04; color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 3px; }
.ghost-demo { margin-top: 16px; }
.ghost-demo h4 { margin: 0 0 8px 0; color: #e85d04; }
.ghost-row { display: flex; gap: 12px; margin-bottom: 10px; }
.ghost-col { flex: 1; padding: 12px; border: 2px solid #ddd; border-radius: 6px; text-align: center; transition: all 0.3s; }
.ghost-col.has-ghost { border-color: #dc2626; background: #fef2f2; }
.ghost-col:not(.has-ghost) { border-color: #65a30d; background: #f7fee7; }
.ghost-col strong { display: block; margin-bottom: 4px; }
.ghost-col p { font-size: 12px; margin: 4px 0; }
.ghost-status { font-size: 12px; font-weight: bold; }
</style>
