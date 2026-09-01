const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

interface TreeNode {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: TreeNode[]
  size?: number
  fileType?: string
}

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

const fileTree: TreeNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '1-1',
        name: 'components',
        type: 'folder',
        children: [
          { id: '1-1-1', name: 'Button.vue', type: 'file', size: 2048, fileType: 'vue' },
          { id: '1-1-2', name: 'Input.vue', type: 'file', size: 3072, fileType: 'vue' },
          {
            id: '1-1-3',
            name: 'layout',
            type: 'folder',
            children: [
              { id: '1-1-3-1', name: 'Header.vue', type: 'file', size: 4096, fileType: 'vue' },
              { id: '1-1-3-2', name: 'Sidebar.vue', type: 'file', size: 5120, fileType: 'vue' },
            ],
          },
        ],
      },
      {
        id: '1-2',
        name: 'views',
        type: 'folder',
        children: [
          { id: '1-2-1', name: 'Home.vue', type: 'file', size: 6144, fileType: 'vue' },
          { id: '1-2-2', name: 'About.vue', type: 'file', size: 2048, fileType: 'vue' },
        ],
      },
      { id: '1-3', name: 'App.vue', type: 'file', size: 1024, fileType: 'vue' },
      { id: '1-4', name: 'main.ts', type: 'file', size: 512, fileType: 'ts' },
    ],
  },
  {
    id: '2',
    name: 'public',
    type: 'folder',
    children: [
      { id: '2-1', name: 'index.html', type: 'file', size: 1024, fileType: 'html' },
      { id: '2-2', name: 'favicon.ico', type: 'file', size: 256, fileType: 'ico' },
    ],
  },
  { id: '3', name: 'package.json', type: 'file', size: 2048, fileType: 'json' },
  { id: '4', name: 'README.md', type: 'file', size: 4096, fileType: 'md' },
]

const expandedNodes = ref<Set<string>>(new Set(['1', '1-1', '2']))

function toggleNode(id: string) {
  if (expandedNodes.value.has(id)) {
    expandedNodes.value.delete(id)
  } else {
    expandedNodes.value.add(id)
  }
}

function getFileIcon(fileType?: string): string {
  const icons: Record<string, string> = {
    vue: '📄',
    ts: '📘',
    html: '🌐',
    json: '📋',
    md: '📝',
    ico: '🖼️',
  }
  return icons[fileType || ''] || '📄'
}

function formatSize(bytes?: number): string {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const activeTab = ref<'tree' | 'deep' | 'scenarios'>('tree')

const deepExamples = [
  {
    name: 'DeepReadonly',
    desc: '递归地将对象的所有属性变为只读',
    before: '{ user: { name: string; posts: [{ title: string }] } }',
    after: '所有层级的属性都变为 readonly',
  },
  {
    name: 'DeepPartial',
    desc: '递归地将对象的所有属性变为可选',
    before: '{ a: { b: string; c: number } }',
    after: '所有层级的属性都变为可选 ?',
  },
  {
    name: 'DeepRequired',
    desc: '递归地将对象的所有属性变为必选',
    before: '{ a?: { b?: string } }',
    after: '所有层级的 ? 被移除，变为必选',
  },
]

const scenarios = [
  { title: '树形结构', example: '文件目录、组织架构、评论嵌套', desc: '最常见的递归类型应用场景' },
  { title: 'JSON 数据', example: '任意深度的嵌套对象', desc: 'type JSONValue = string | number | boolean | { [k: string]: JSONValue } | JSONValue[]' },
  { title: '深拷贝类型', example: 'DeepReadonly / DeepPartial', desc: '递归处理对象的每一层' },
  { title: '路径类型', example: 'type Path = "a" | "a.b" | "a.b.c"', desc: '表示对象的属性访问路径' },
]

const codeExample = \`<span style="color:#7c7c99">// 1. 树形节点递归定义</span>
interface TreeNode {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: TreeNode[]  <span style="color:#8a8a3a">// 递归引用自身</span>
}

<span style="color:#7c7c99">// 2. 任意深度的 JSON 值</span>
type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[]

<span style="color:#7c7c99">// 3. 深度只读（递归映射类型）</span>
type DeepReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly&lt;T[K]&gt;
    : T[K]
}

<span style="color:#7c7c99">// 4. 深度可选</span>
type DeepPartial&lt;T&gt; = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial&lt;T[K]&gt;
    : T[K]
}

<span style="color:#7c7c99">// 使用示例</span>
const data: DeepReadonly&lt;User&gt; = { ... }
data.user.name = 'new'  <span style="color:#dc2626">// 错误：只读属性</span>\`

function flattenTree(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = []
  for (const node of nodes) {
    result.push(node)
    if (node.children) {
      result.push(...flattenTree(node.children))
    }
  }
  return result
}

const totalFiles = computed(() => {
  const all = flattenTree(fileTree)
  return all.filter(n => n.type === 'file').length
})

const totalFolders = computed(() => {
  const all = flattenTree(fileTree)
  return all.filter(n => n.type === 'folder').length
})

const totalSize = computed(() => {
  const all = flattenTree(fileTree)
  return all.filter(n => n.type === 'file').reduce((sum, n) => sum + (n.size || 0), 0)
})
<\/script>

<template>
  <div class="demo-card">
    <h3>递归类型与深嵌套对象</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'tree' }" @click="activeTab = 'tree'">文件树演示</button>
      <button class="tab-btn" :class="{ active: activeTab === 'deep' }" @click="activeTab = 'deep'">深度映射类型</button>
      <button class="tab-btn" :class="{ active: activeTab === 'scenarios' }" @click="activeTab = 'scenarios'">应用场景</button>
    </div>

    <div v-if="activeTab === 'tree'">
      <h4>项目文件目录</h4>
      <div class="tree-stats">
        <span>📁 {{ totalFolders }} 个文件夹</span>
        <span>📄 {{ totalFiles }} 个文件</span>
        <span>📦 {{ formatSize(totalSize) }}</span>
      </div>

      <div class="tree-container">
        <template v-for="node in fileTree" :key="node.id">
          <div class="tree-node" :style="{ paddingLeft: '0' }">
            <span v-if="node.type === 'folder'" class="toggle" @click="toggleNode(node.id)">
              {{ expandedNodes.has(node.id) ? '▼' : '▶' }}
            </span>
            <span v-else class="toggle-placeholder"></span>
            <span class="icon">{{ node.type === 'folder' ? '📁' : getFileIcon(node.fileType) }}</span>
            <span class="name">{{ node.name }}</span>
            <span v-if="node.type === 'file'" class="size">{{ formatSize(node.size) }}</span>
          </div>
          <template v-if="node.type === 'folder' && expandedNodes.has(node.id) && node.children">
            <template v-for="child in node.children" :key="child.id">
              <div class="tree-node" :style="{ paddingLeft: '24px' }">
                <span v-if="child.type === 'folder'" class="toggle" @click="toggleNode(child.id)">
                  {{ expandedNodes.has(child.id) ? '▼' : '▶' }}
                </span>
                <span v-else class="toggle-placeholder"></span>
                <span class="icon">{{ child.type === 'folder' ? '📁' : getFileIcon(child.fileType) }}</span>
                <span class="name">{{ child.name }}</span>
                <span v-if="child.type === 'file'" class="size">{{ formatSize(child.size) }}</span>
              </div>
              <template v-if="child.type === 'folder' && expandedNodes.has(child.id) && child.children">
                <template v-for="grandchild in child.children" :key="grandchild.id">
                  <div class="tree-node" :style="{ paddingLeft: '48px' }">
                    <span v-if="grandchild.type === 'folder'" class="toggle" @click="toggleNode(grandchild.id)">
                      {{ expandedNodes.has(grandchild.id) ? '▼' : '▶' }}
                    </span>
                    <span v-else class="toggle-placeholder"></span>
                    <span class="icon">{{ grandchild.type === 'folder' ? '📁' : getFileIcon(grandchild.fileType) }}</span>
                    <span class="name">{{ grandchild.name }}</span>
                    <span v-if="grandchild.type === 'file'" class="size">{{ formatSize(grandchild.size) }}</span>
                  </div>
                  <template v-if="grandchild.type === 'folder' && expandedNodes.has(grandchild.id) && grandchild.children">
                    <template v-for="greatGrandchild in grandchild.children" :key="greatGrandchild.id">
                      <div class="tree-node" :style="{ paddingLeft: '72px' }">
                        <span class="toggle-placeholder"></span>
                        <span class="icon">{{ greatGrandchild.type === 'folder' ? '📁' : getFileIcon(greatGrandchild.fileType) }}</span>
                        <span class="name">{{ greatGrandchild.name }}</span>
                        <span v-if="greatGrandchild.type === 'file'" class="size">{{ formatSize(greatGrandchild.size) }}</span>
                      </div>
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </template>
        </template>
      </div>

      <div class="tips-box">
        <p><strong>💡 类型定义：</strong><code>TreeNode</code> 接口中 <code>children?: TreeNode[]</code> 就是递归引用——子节点的类型和自身完全一样。这是树形结构最自然的建模方式。</p>
      </div>
    </div>

    <div v-if="activeTab === 'deep'">
      <h4>深度映射类型</h4>
      <p style="font-size:13px;color:#5a4a32;">结合条件类型和映射类型，可以递归地对对象的每一层进行转换。</p>

      <table>
        <thead><tr><th>工具类型</th><th>说明</th><th>效果</th></tr></thead>
        <tbody>
          <tr v-for="e in deepExamples" :key="e.name">
            <td><code class="type">{{ e.name }}</code></td>
            <td>{{ e.desc }}</td>
            <td><small>{{ e.after }}</small></td>
          </tr>
        </tbody>
      </table>

      <div class="result-box" style="margin-top:12px;">
        <p><strong>实现要点：</strong></p>
        <ol>
          <li>使用映射类型 <code>[K in keyof T]</code> 遍历对象属性</li>
          <li>使用条件类型 <code>T[K] extends object</code> 判断是否为对象</li>
          <li>如果是对象，递归调用自身 <code>DeepReadonly&lt;T[K]&gt;</code></li>
          <li>如果不是对象，直接返回原类型</li>
        </ol>
      </div>
    </div>

    <div v-if="activeTab === 'scenarios'">
      <h4>递归类型的常见应用场景</h4>
      <div class="scenario-grid">
        <div v-for="s in scenarios" :key="s.title" class="scenario-card">
          <h5>{{ s.title }}</h5>
          <p><code>{{ s.example }}</code></p>
          <p><small>{{ s.desc }}</small></p>
        </div>
      </div>
    </div>

    <h4>综合代码示例</h4>
    <pre class="mini-code" v-html="codeExample"></pre>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.result-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
code.type { color: #0891b2; font-weight: bold; }
small { color: #8a6d42; }
.tree-stats { display: flex; gap: 16px; margin-bottom: 10px; font-size: 13px; color: #8a6d42; }
.tree-container { background: #fffaf5; border: 1px solid #f0c8a0; border-radius: 6px; padding: 8px; }
.tree-node { display: flex; align-items: center; gap: 4px; padding: 3px 6px; border-radius: 4px; cursor: pointer; font-size: 13px; }
.tree-node:hover { background: #fff3e0; }
.toggle { width: 16px; color: #e85d04; cursor: pointer; user-select: none; }
.toggle-placeholder { width: 16px; }
.icon { font-size: 14px; }
.name { flex: 1; }
.size { color: #8a6d42; font-size: 11px; }
.scenario-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; }
.scenario-card { background: #fff8f0; padding: 10px; border-radius: 6px; border: 1px solid #f0c8a0; }
.scenario-card h5 { margin: 0 0 4px 0; color: #e85d04; }
.scenario-card p { margin: 4px 0; }
ol { font-size: 13px; color: #5a4a32; padding-left: 20px; }
ol li { margin-bottom: 4px; }
</style>
`;export{e as default};
