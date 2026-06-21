<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'infer' | 'annotate' | 'narrow'>('infer')

const inferenceExamples = [
  { code: "const name = 'Vue 3 实战'", inferred: 'string', note: '字符串字面量 → string' },
  { code: 'const price = 99', inferred: 'number', note: '数字字面量 → number' },
  { code: 'const tags = ["前端", "Vue"]', inferred: 'string[]', note: '数组元素类型 → string[]' },
  { code: 'const config = { host: "localhost", port: 3000 }', inferred: '{ host: string; port: number }', note: '对象结构自动推导' },
  { code: 'const fn = (x: number) => x * 2', inferred: '(x: number) => number', note: '函数返回值推导' },
  { code: 'const seats = ref<number | null>(20)', inferred: 'Ref<number | null>', note: '泛型显式标注联合类型' },
]

const annotateExamples = [
  { scenario: '联合状态', bad: 'let status = "idle"', good: 'let status: "idle" | "loading" | "done" = "idle"', note: '限制为字面量联合，防止赋值任意字符串' },
  { scenario: '可为空', bad: 'let user = null', good: 'let user: User | null = null', note: '初始为 null，后续赋值为对象' },
  { scenario: '函数签名', bad: 'function fetch(id) { }', good: 'function fetch(id: string): Promise<Data> { }', note: '公共 API 需明确参数和返回值' },
  { scenario: '复杂对象', bad: 'const cfg = {}', good: 'const cfg: Config = { ... }', note: '用 interface 定义结构契约' },
  { scenario: '数组泛型', bad: 'const list = []', good: 'const list: Course[] = []', note: '空数组默认 any[]，需显式元素类型' },
]

const narrowExamples = [
  { technique: 'typeof', code: "if (typeof x === 'string') {\n  x.toUpperCase()  // 推导为 string\n}", note: 'typeof 收窄基本类型' },
  { technique: 'instanceof', code: 'if (e instanceof Error) {\n  e.message  // 推导为 Error\n}', note: 'instanceof 收窄类实例' },
  { technique: 'in 操作符', code: "if ('price' in item) {\n  item.price  // 推导为有 price 属性\n}", note: 'in 收窄联合类型成员' },
  { technique: '判别联合', code: "if (res.status === 'ok') {\n  res.data  // 推导为成功分支\n}", note: '字面量字段区分联合分支' },
  { technique: 'Array.isArray', code: 'if (Array.isArray(x)) {\n  x.map(...)  // 推导为数组\n}', note: '收窄到数组类型' },
  { technique: '可选链', code: 'user?.profile?.name  // string | undefined', note: '可选链自动处理 undefined' },
]

const courseName = ref('Vue 3 实战')
const price = ref(99)
const seats = ref<number | null>(20)
const summary = computed(() => `${courseName.value} · ¥${price.value} · ${seats.value ?? '不限'}席`)

const codeExample = `<span style="color:#7c7c99">// 1. 自动推导（无需标注）</span>
const name = 'Vue 3 实战'        <span style="color:#8a8a3a">// string</span>
const price = 99                 <span style="color:#8a8a3a">// number</span>
const list = ['前端', 'Vue']      <span style="color:#8a8a3a">// string[]</span>

<span style="color:#7c7c99">// 2. 需要显式标注的场景</span>
let status: 'idle' | 'loading' | 'done' = 'idle'
let user: User | null = null
function fetch(id: string): Promise&lt;Data&gt; { ... }

<span style="color:#7c7c99">// 3. 类型收窄</span>
function process(x: string | number) {
  if (typeof x === 'string') {
    x.toUpperCase()   <span style="color:#8a8a3a">// 此处 x: string</span>
  } else {
    x.toFixed(2)      <span style="color:#8a8a3a">// 此处 x: number</span>
  }
}`
</script>

<template>
  <div class="demo-card">
    <h3>类型推导与显式标注</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeTab === 'infer' }" @click="activeTab = 'infer'">自动推导</button>
      <button :class="{ active: activeTab === 'annotate' }" @click="activeTab = 'annotate'">何时标注</button>
      <button :class="{ active: activeTab === 'narrow' }" @click="activeTab = 'narrow'">类型收窄</button>
    </div>

    <div v-if="activeTab === 'infer'">
      <h4>实时推导演示</h4>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
        <label>课程名称<input v-model="courseName" /></label>
        <label>价格<input v-model.number="price" type="number" min="0" /></label>
        <label>席位<input v-model.number="seats" type="number" min="0" /></label>
      </div>
      <div class="result-box">
        <p><strong>推导结果：</strong>{{ summary }}</p>
        <p><small>courseName: <code>Ref&lt;string&gt;</code> · price: <code>Ref&lt;number&gt;</code> · seats: <code>Ref&lt;number | null&gt;</code></small></p>
      </div>

      <h4 style="margin-top:12px;">推导规则速查</h4>
      <table>
        <thead><tr><th>代码</th><th>推导类型</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="e in inferenceExamples" :key="e.code">
            <td><code>{{ e.code }}</code></td>
            <td><code class="type">{{ e.inferred }}</code></td>
            <td><small>{{ e.note }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'annotate'">
      <h4>需要显式标注的场景</h4>
      <table>
        <thead><tr><th>场景</th><th>不推荐</th><th>推荐</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="a in annotateExamples" :key="a.scenario">
            <td><strong>{{ a.scenario }}</strong></td>
            <td><code class="bad">{{ a.bad }}</code></td>
            <td><code class="good">{{ a.good }}</code></td>
            <td><small>{{ a.note }}</small></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>原则：</strong>让编译器推导显而易见的类型；在联合状态、空值、公共 API 和复杂数据结构处补充标注。</p>
        <p><strong>反模式：</strong>不要用 <code>any</code> 绕过类型问题，用 <code>unknown</code> + 类型守卫代替。</p>
      </div>
    </div>

    <div v-if="activeTab === 'narrow'">
      <h4>类型收窄技巧</h4>
      <table>
        <thead><tr><th>技巧</th><th>代码</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="n in narrowExamples" :key="n.technique">
            <td><strong>{{ n.technique }}</strong></td>
            <td><pre class="mini-code small">{{ n.code }}</pre></td>
            <td><small>{{ n.note }}</small></td>
          </tr>
        </tbody>
      </table>
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
button { padding: 5px 14px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
button.active { background: #e85d04; color: #fff; border-color: #e85d04; }
input { padding: 4px 8px; border: 1px solid #e0a06a; border-radius: 4px; width: 140px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
code.type { color: #0891b2; font-weight: bold; }
code.bad { color: #dc2626; }
code.good { color: #65a30d; }
small { color: #8a6d42; }
label { display: flex; flex-direction: column; font-size: 12px; gap: 2px; }
</style>
