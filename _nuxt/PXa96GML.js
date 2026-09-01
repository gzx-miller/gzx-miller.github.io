const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'return' | 'promise' | 'array' | 'params'>('return')

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T
type MyParameters<T> = T extends (...args: infer P) => any ? P : never
type ArrayElement<T> = T extends (infer E)[] ? E : never

function fetchUser(id: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: '李四', email: 'lisi@example.com', role: 'editor' })
    }, 500)
  })
}

function createProduct(name: string, price: number, tags: string[]) {
  return { id: Date.now(), name, price, tags }
}

const userList = [
  { id: 1, name: '张三', role: 'admin' },
  { id: 2, name: '李四', role: 'editor' },
  { id: 3, name: '王五', role: 'viewer' },
]

const inputFunc = ref('function add(a: number, b: number): number { return a + b }')

const inferredReturnType = computed(() => {
  return 'number'
})

const inferredParams = computed(() => {
  return '[a: number, b: number]'
})

const returnTypeExamples = [
  { func: '() => string', result: 'string', desc: '无参数函数的返回值' },
  { func: '(x: number) => number[]', result: 'number[]', desc: '带参数函数的返回值' },
  { func: '() => { name: string; age: number }', result: '{ name: string; age: number }', desc: '对象返回类型' },
  { func: '() => Promise<User>', result: 'Promise<User>', desc: 'Promise 返回类型' },
]

const promiseExamples = [
  { input: 'Promise<string>', output: 'string', desc: '单层 Promise 解包' },
  { input: 'Promise<Promise<number>>', output: 'number', desc: '嵌套 Promise 递归解包' },
  { input: 'string', output: 'string', desc: '非 Promise 类型直接返回' },
  { input: 'Promise<User[]>', output: 'User[]', desc: 'Promise 中的数组类型' },
]

const arrayExamples = [
  { input: 'string[]', output: 'string', desc: '字符串数组提取元素' },
  { input: 'number[]', output: 'number', desc: '数字数组提取元素' },
  { input: 'User[]', output: 'User', desc: '对象数组提取元素' },
  { input: '(string | number)[]', output: 'string | number', desc: '联合类型数组提取元素' },
]

const paramsExamples = [
  { func: '(a: string) => void', params: '[a: string]', desc: '单个参数' },
  { func: '(a: number, b: string) => void', params: '[a: number, b: string]', desc: '多个参数' },
  { func: '() => void', params: '[]', desc: '无参数' },
  { func: '(...args: string[]) => void', params: 'args: string[]', desc: '剩余参数' },
]

const codeExample = \`<span style="color:#7c7c99">// 1. 提取函数返回类型</span>
type MyReturnType&lt;T&gt; = T extends (...args: any[]) =&gt; infer R ? R : never

type Func = (a: number, b: number) =&gt; number
type Result = MyReturnType&lt;Func&gt;  <span style="color:#8a8a3a">// number</span>

<span style="color:#7c7c99">// 2. 提取 Promise 内部类型（递归）</span>
type MyAwaited&lt;T&gt; = T extends Promise&lt;infer U&gt; ? MyAwaited&lt;U&gt; : T

type Deep = Promise&lt;Promise&lt;string&gt;&gt;
type Value = MyAwaited&lt;Deep&gt;  <span style="color:#8a8a3a">// string</span>

<span style="color:#7c7c99">// 3. 提取数组元素类型</span>
type ArrayElement&lt;T&gt; = T extends (infer E)[] ? E : never

type Nums = number[]
type Num = ArrayElement&lt;Nums&gt;  <span style="color:#8a8a3a">// number</span>

<span style="color:#7c7c99">// 4. 提取函数参数类型</span>
type MyParameters&lt;T&gt; = T extends (...args: infer P) =&gt; any ? P : never

type Greet = (name: string, age: number) =&gt; void
type Params = MyParameters&lt;Greet&gt;  <span style="color:#8a8a3a">// [name: string, age: number]</span>\`

const selectedUserId = ref(1)
const selectedUser = computed(() => userList.find(u => u.id === selectedUserId.value))

type UserType = ArrayElement<typeof userList>
<\/script>

<template>
  <div class="demo-card">
    <h3>infer 关键字与类型推断</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'return' }" @click="activeTab = 'return'">返回类型</button>
      <button class="tab-btn" :class="{ active: activeTab === 'promise' }" @click="activeTab = 'promise'">Promise 解包</button>
      <button class="tab-btn" :class="{ active: activeTab === 'array' }" @click="activeTab = 'array'">数组元素</button>
      <button class="tab-btn" :class="{ active: activeTab === 'params' }" @click="activeTab = 'params'">参数类型</button>
    </div>

    <div v-if="activeTab === 'return'">
      <h4>ReturnType：提取函数返回类型</h4>
      <div class="result-box">
        <p><strong>原理：</strong>使用 <code>infer R</code> 在条件类型中"捕获"返回值类型，然后将其作为结果返回。</p>
        <p><strong>语法：</strong><code>T extends (...args: any[]) =&gt; infer R ? R : never</code></p>
      </div>

      <h4 style="margin-top:12px;">示例</h4>
      <table>
        <thead><tr><th>函数类型</th><th>提取结果</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="e in returnTypeExamples" :key="e.func">
            <td><code>{{ e.func }}</code></td>
            <td><code class="type">{{ e.result }}</code></td>
            <td><small>{{ e.desc }}</small></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">
        <p><strong>内置工具类型：</strong>TypeScript 已经内置了 <code>ReturnType&lt;T&gt;</code>，可以直接使用。了解其原理有助于你自定义更多类型工具。</p>
      </div>
    </div>

    <div v-if="activeTab === 'promise'">
      <h4>Awaited：递归解包 Promise</h4>
      <div class="result-box">
        <p><strong>问题：</strong>如果有嵌套的 Promise（如 <code>Promise&lt;Promise&lt;string&gt;&gt;</code>），如何获取最内层的类型？</p>
        <p><strong>答案：</strong>使用递归 + infer，直到不是 Promise 为止。</p>
      </div>

      <h4 style="margin-top:12px;">示例</h4>
      <table>
        <thead><tr><th>输入类型</th><th>解包结果</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="e in promiseExamples" :key="e.input">
            <td><code>{{ e.input }}</code></td>
            <td><code class="type">{{ e.output }}</code></td>
            <td><small>{{ e.desc }}</small></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">
        <p><strong>TS 4.5+：</strong>内置了 <code>Awaited&lt;T&gt;</code> 工具类型，专门用于解包 Promise。在处理 async/await 时非常有用。</p>
      </div>
    </div>

    <div v-if="activeTab === 'array'">
      <h4>ArrayElement：提取数组元素类型</h4>
      <div class="result-box">
        <p><strong>场景：</strong>从数组类型中提取元素类型，或者从已有数组值推导元素类型。</p>
      </div>

      <h4 style="margin-top:12px;">示例</h4>
      <table>
        <thead><tr><th>数组类型</th><th>元素类型</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="e in arrayExamples" :key="e.input">
            <td><code>{{ e.input }}</code></td>
            <td><code class="type">{{ e.output }}</code></td>
            <td><small>{{ e.desc }}</small></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:12px;">实战演示</h4>
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;">
        <label>选择用户：
          <select v-model.number="selectedUserId">
            <option v-for="u in userList" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </label>
      </div>
      <div class="result-box">
        <p>当前用户：<strong>{{ selectedUser?.name }}</strong>，角色：{{ selectedUser?.role }}</p>
        <p><small>用户类型从 <code>userList</code> 数组中自动推导：<code class="type">ArrayElement&lt;typeof userList&gt;</code></small></p>
      </div>
    </div>

    <div v-if="activeTab === 'params'">
      <h4>Parameters：提取函数参数类型</h4>
      <div class="result-box">
        <p><strong>用途：</strong>获取函数的所有参数类型，以元组形式返回。常用于包装函数、高阶函数的类型定义。</p>
      </div>

      <h4 style="margin-top:12px;">示例</h4>
      <table>
        <thead><tr><th>函数类型</th><th>参数类型</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="e in paramsExamples" :key="e.func">
            <td><code>{{ e.func }}</code></td>
            <td><code class="type">{{ e.params }}</code></td>
            <td><small>{{ e.desc }}</small></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">
        <p><strong>更多工具：</strong>还有 <code>Parameters</code>、<code>ConstructorParameters</code>、<code>InstanceType</code> 等，都是基于 infer 实现的。掌握 infer 就能理解它们的本质。</p>
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
label { display: flex; flex-direction: column; font-size: 12px; gap: 2px; }
select { padding: 4px 8px; border: 1px solid #e0a06a; border-radius: 4px; }
</style>
`;export{e as default};
