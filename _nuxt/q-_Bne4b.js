const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'mapped' | 'conditional' | 'template' | 'tricks'>('mapped')

interface User {
  id: number
  name: string
  email: string
  age?: number
  role: 'admin' | 'editor' | 'viewer'
}

type ReadonlyUser = Readonly<User>
type PartialUser = Partial<User>
type RequiredUser = Required<User>
type PickUser = Pick<User, 'id' | 'name'>
type OmitUser = Omit<User, 'password' | 'token'>
type UserKeys = keyof User

const user: User = {
  id: 1,
  name: '赵六',
  email: 'zhaoliu@example.com',
  age: 28,
  role: 'editor',
}

const mappedTypes = [
  { name: 'Readonly<T>', desc: '所有属性变为只读', syntax: 'readonly [K in keyof T]: T[K]' },
  { name: 'Partial<T>', desc: '所有属性变为可选', syntax: '[K in keyof T]?: T[K]' },
  { name: 'Required<T>', desc: '所有属性变为必选', syntax: '[K in keyof T]-?: T[K]' },
  { name: 'Pick<T, K>', desc: '选取部分属性', syntax: '[K in Keys]: T[K]' },
  { name: 'Omit<T, K>', desc: '排除部分属性', syntax: 'Pick<T, Exclude<keyof T, K>>' },
  { name: 'Record<K, T>', desc: '构造键值对类型', syntax: '[K in Keys]: T' },
]

const conditionalTypes = [
  { name: 'Exclude<T, U>', desc: '从 T 中排除可分配给 U 的类型', example: 'Exclude<"a" | "b" | "c", "a"> → "b" | "c"' },
  { name: 'Extract<T, U>', desc: '从 T 中提取可分配给 U 的类型', example: 'Extract<"a" | "b" | "c", "a" | "b"> → "a" | "b"' },
  { name: 'NonNullable<T>', desc: '排除 null 和 undefined', example: 'NonNullable<string | null> → string' },
  { name: 'ReturnType<T>', desc: '获取函数返回类型', example: 'ReturnType<() => number> → number' },
  { name: 'Parameters<T>', desc: '获取函数参数类型元组', example: 'Parameters<(a: string) => void> → [a: string]' },
  { name: 'Awaited<T>', desc: '递归解包 Promise', example: 'Awaited<Promise<Promise<string>>> → string' },
]

const templateLiterals = [
  { name: 'Capitalize<S>', desc: '首字母大写', before: 'hello', after: 'Hello' },
  { name: 'Uppercase<S>', desc: '全大写', before: 'hello', after: 'HELLO' },
  { name: 'Lowercase<S>', desc: '全小写', before: 'HELLO', after: 'hello' },
  { name: 'Uncapitalize<S>', desc: '首字母小写', before: 'Hello', after: 'hello' },
  { name: '字符串拼接', desc: '使用模板字面量拼接类型', before: '"on" + "Click"', after: '"onClick"' },
  { name: '事件名生成', desc: '批量生成事件处理器类型', before: '"click" | "change"', after: '"onClick" | "onChange"' },
]

const tricks = [
  { title: '获取对象值的联合类型', code: "type ValueOf<T> = T[keyof T]\\ntype UserVals = ValueOf<User>\\n// → number | string | undefined | 'admin'|'editor'|'viewer'", desc: '用 keyof 拿到键，再用索引访问拿到值' },
  { title: '交集属性', code: "type Intersection<T, U> = Pick<T, Extract<keyof T, keyof U>>", desc: '取两个类型共有的属性' },
  { title: '函数名过滤', code: "type FunctionKeys<T> = {\\n  [K in keyof T]: T[K] extends Function ? K : never\\n}[keyof T]", desc: '找出类型中所有值为函数的键' },
  { title: '元组转联合', code: "type Tuple = [string, number, boolean]\\ntype Union = Tuple[number]\\n// → string | number | boolean", desc: '元组通过数字索引访问转联合' },
]

const selectedMappedType = ref('Readonly')

const mappedTypeResult = computed(() => {
  switch (selectedMappedType.value) {
    case 'Readonly':
      return \`Readonly<User> = {
  readonly id: number
  readonly name: string
  readonly email: string
  readonly age?: number
  readonly role: 'admin' | 'editor' | 'viewer'
}\`
    case 'Partial':
      return \`Partial<User> = {
  id?: number
  name?: string
  email?: string
  age?: number
  role?: 'admin' | 'editor' | 'viewer'
}\`
    case 'Required':
      return \`Required<User> = {
  id: number
  name: string
  email: string
  age: number  // 不再可选
  role: 'admin' | 'editor' | 'viewer'
}\`
    case 'Pick':
      return \`Pick<User, 'id' | 'name'> = {
  id: number
  name: string
}\`
    case 'Omit':
      return \`Omit<User, 'age' | 'role'> = {
  id: number
  name: string
  email: string
}\`
    default:
      return ''
  }
})

const codeExample = \`<span style="color:#7c7c99">// 1. 映射类型：遍历键并转换</span>
type MyReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K]
}

<span style="color:#7c7c99">// 2. 条件类型：类型层面的 if-else</span>
type IsString&lt;T&gt; = T extends string ? true : false
type A = IsString&lt;'hello'&gt;  <span style="color:#8a8a3a">// true</span>
type B = IsString&lt;123&gt;      <span style="color:#8a8a3a">// false</span>

<span style="color:#7c7c99">// 3. 模板字面量类型</span>
type EventName&lt;T extends string&gt; = \\\`on\\\${Capitalize&lt;T&gt;}\\\`
type ClickEvent = EventName&lt;'click'&gt;  <span style="color:#8a8a3a">// 'onClick'</span>

<span style="color:#7c7c99">// 4. 类型体操：提取函数键</span>
type FunctionKeys&lt;T&gt; = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

<span style="color:#7c7c99">// 5. 递归类型 + 条件类型</span>
type DeepReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly&lt;T[K]&gt;
    : T[K]
}\`

const selectedTrick = ref(0)
<\/script>

<template>
  <div class="demo-card">
    <h3>类型级编程与类型体操</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'mapped' }" @click="activeTab = 'mapped'">映射类型</button>
      <button class="tab-btn" :class="{ active: activeTab === 'conditional' }" @click="activeTab = 'conditional'">条件类型</button>
      <button class="tab-btn" :class="{ active: activeTab === 'template' }" @click="activeTab = 'template'">模板字面量</button>
      <button class="tab-btn" :class="{ active: activeTab === 'tricks' }" @click="activeTab = 'tricks'">进阶技巧</button>
    </div>

    <div v-if="activeTab === 'mapped'">
      <h4>内置映射类型</h4>
      <p style="font-size:13px;color:#5a4a32;">映射类型允许你基于已有类型创建新类型，遍历并转换每个属性。</p>

      <table>
        <thead><tr><th>工具类型</th><th>说明</th><th>核心语法</th></tr></thead>
        <tbody>
          <tr v-for="m in mappedTypes" :key="m.name">
            <td><code class="type">{{ m.name }}</code></td>
            <td>{{ m.desc }}</td>
            <td><code>{{ m.syntax }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:12px;">交互式演示</h4>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        <button
          v-for="m in ['Readonly', 'Partial', 'Required', 'Pick', 'Omit']"
          :key="m"
          class="mini-btn"
          :class="{ active: selectedMappedType === m }"
          @click="selectedMappedType = m"
        >
          {{ m }}
        </button>
      </div>

      <div class="result-box">
        <p><strong>原始类型 User：</strong></p>
        <pre class="mini-code small">interface User {
  id: number
  name: string
  email: string
  age?: number
  role: 'admin' | 'editor' | 'viewer'
}</pre>
        <p style="margin-top:8px;"><strong>应用 {{ selectedMappedType }} 后：</strong></p>
        <pre class="mini-code small">{{ mappedTypeResult }}</pre>
      </div>
    </div>

    <div v-if="activeTab === 'conditional'">
      <h4>条件类型工具</h4>
      <p style="font-size:13px;color:#5a4a32;">条件类型就像类型层面的三元表达式：<code>T extends U ? X : Y</code></p>

      <table>
        <thead><tr><th>工具类型</th><th>说明</th><th>示例</th></tr></thead>
        <tbody>
          <tr v-for="c in conditionalTypes" :key="c.name">
            <td><code class="type">{{ c.name }}</code></td>
            <td>{{ c.desc }}</td>
            <td><code>{{ c.example }}</code></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">
        <p><strong>核心思想：</strong>条件类型 + infer + 递归 = 类型级编程的三大支柱。几乎所有复杂的类型工具都是它们的组合。</p>
      </div>
    </div>

    <div v-if="activeTab === 'template'">
      <h4>模板字面量类型</h4>
      <p style="font-size:13px;color:#5a4a32;">TS 4.1+ 支持在类型层面进行字符串操作，能玩出很多花样。</p>

      <table>
        <thead><tr><th>工具/模式</th><th>说明</th><th>输入</th><th>输出</th></tr></thead>
        <tbody>
          <tr v-for="t in templateLiterals" :key="t.name">
            <td><strong>{{ t.name }}</strong></td>
            <td>{{ t.desc }}</td>
            <td><code>{{ t.before }}</code></td>
            <td><code class="type">{{ t.after }}</code></td>
          </tr>
        </tbody>
      </table>

      <div class="result-box" style="margin-top:12px;">
        <p><strong>典型应用：</strong>自动生成事件名、CSS 属性名、路由路径等批量字符串类型。</p>
        <pre class="mini-code small"><span style="color:#7c7c99">// 批量生成事件处理器类型</span>
type Events = 'click' | 'change' | 'submit'
type HandlerNames = \`on\${Capitalize&lt;Events&gt;}\`
<span style="color:#8a8a3a">// → 'onClick' | 'onChange' | 'onSubmit'</span></pre>
      </div>
    </div>

    <div v-if="activeTab === 'tricks'">
      <h4>类型体操进阶技巧</h4>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
        <button
          v-for="(t, i) in tricks"
          :key="i"
          class="mini-btn"
          :class="{ active: selectedTrick === i }"
          @click="selectedTrick = i"
        >
          {{ t.title }}
        </button>
      </div>

      <div class="result-box">
        <h5 style="margin:0 0 8px 0;color:#e85d04;">{{ tricks[selectedTrick].title }}</h5>
        <pre class="mini-code small">{{ tricks[selectedTrick].code }}</pre>
        <p style="margin-top:8px;"><small>{{ tricks[selectedTrick].desc }}</small></p>
      </div>
    </div>

    <h4>综合代码示例</h4>
    <pre class="mini-code" v-html="codeExample"></pre>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.mini-code.small { font-size: 11px; padding: 6px; margin: 0; }
.result-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.mini-btn { padding: 4px 12px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; }
.mini-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
code.type { color: #0891b2; font-weight: bold; }
small { color: #8a6d42; }
</style>
`;export{e as default};
