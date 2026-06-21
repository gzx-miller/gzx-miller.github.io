<script setup lang="ts">
import { computed, ref } from 'vue'

const leftVal = ref("'0'")
const rightVal = ref('0')

const pairs = [
  { left: "'0'", right: '0', loose: true, strict: false, note: '字符串与数字：== 转换后相等，=== 不等' },
  { left: 'null', right: 'undefined', loose: true, strict: false, note: 'null == undefined 为 true（特例）' },
  { left: '[]', right: "''", loose: true, strict: false, note: '空数组 toString() 为空字符串' },
  { left: '0', right: 'false', loose: true, strict: false, note: '0 和 false 都是 falsy' },
  { left: "'1'", right: '1', loose: true, strict: false, note: '数字字符串转数字后比较' },
  { left: '{}', right: '{}', loose: false, strict: false, note: '对象按引用比较，不同引用必不等' },
  { left: 'NaN', right: 'NaN', loose: false, strict: false, note: 'NaN 与任何值都不等（含自身）' },
  { left: 'true', right: '1', loose: true, strict: false, note: 'true 转为 1 后比较' },
]

const selectedPair = ref(0)
const current = computed(() => pairs[selectedPair.value])

const typeChecks = [
  { value: "'hello'", typeof: 'string', note: '字符串字面量' },
  { value: '42', typeof: 'number', note: '数字字面量' },
  { value: 'true', typeof: 'boolean', note: '布尔值' },
  { value: 'undefined', typeof: 'undefined', note: '未定义' },
  { value: 'null', typeof: 'object', note: '⚠️ 历史遗留 bug，null 的 typeof 是 object' },
  { value: '[]', typeof: 'object', note: '数组也是 object，需用 Array.isArray()' },
  { value: '{}', typeof: 'object', note: '普通对象' },
  { value: '() => {}', typeof: 'function', note: '函数（一等公民）' },
  { value: 'Symbol()', typeof: 'symbol', note: '唯一标识符' },
]

const codeExample = `<span style="color:#7c7c99">// 1. 严格相等 ===（推荐）</span>
console.log('0' === 0)   <span style="color:#8a8a3a">// false，类型不同直接不等</span>
console.log(null === undefined)  <span style="color:#8a8a3a">// false</span>

<span style="color:#7c7c99">// 2. 宽松相等 ==（不推荐，易出错）</span>
console.log('0' == 0)    <span style="color:#8a8a3a">// true，字符串转数字后比较</span>
console.log(null == undefined)   <span style="color:#8a8a3a">// true，特例</span>
console.log([] == '')   <span style="color:#8a8a3a">// true，数组 toString() 为空串</span>

<span style="color:#7c7c99">// 3. typeof 判断基本类型</span>
typeof 'hello'  <span style="color:#8a8a3a">// 'string'</span>
typeof 42       <span style="color:#8a8a3a">// 'number'</span>
typeof null     <span style="color:#e85d04">// 'object'（历史 bug！）</span>

<span style="color:#7c7c99">// 4. 精确判断 null</span>
const x = null
x === null      <span style="color:#8a8a3a">// true，这是判断 null 的正确方式</span>

<span style="color:#7c7c99">// 5. 判断数组</span>
Array.isArray([])  <span style="color:#8a8a3a">// true</span>
typeof []          <span style="color:#e85d04">// 'object'，无法区分</span>

<span style="color:#7c7c99">// 6. Object.is 处理边界情况</span>
Object.is(NaN, NaN)     <span style="color:#8a8a3a">// true（=== 是 false）</span>
Object.is(-0, +0)       <span style="color:#8a8a3a">// false（=== 是 true）</span>`
</script>

<template>
  <div class="demo-card">
    <h3>类型与相等：==、===、typeof 详解</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>相等性对比（点击切换）</h4>
        <div class="pair-list">
          <button
            class="pair-btn"
            v-for="(p, i) in pairs"
            :key="i"
            :class="{ active: selectedPair === i }"
            @click="selectedPair = i"
          >{{ p.left }} vs {{ p.right }}</button>
        </div>

        <div class="result-box">
          <p><code>{{ current.left }}</code> <strong>==</strong> <code>{{ current.right }}</code></p>
          <p class="result" :class="{ true: current.loose, false: !current.loose }">{{ current.loose }}</p>
          <p><code>{{ current.left }}</code> <strong>===</strong> <code>{{ current.right }}</code></p>
          <p class="result" :class="{ true: current.strict, false: !current.strict }">{{ current.strict }}</p>
          <p class="note">{{ current.note }}</p>
        </div>
      </div>

      <div style="flex:1;">
        <h4>typeof 类型检查表</h4>
        <table>
          <thead><tr><th>值</th><th>typeof</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="t in typeChecks" :key="t.value">
              <td><code>{{ t.value }}</code></td>
              <td><code :class="{ warn: t.note.includes('⚠️') }">{{ t.typeof }}</code></td>
              <td><small>{{ t.note }}</small></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <h4>代码示例</h4>
    <pre class="mini-code" v-html="codeExample"></pre>

    <div class="tips-box">
      <p><strong>最佳实践：</strong></p>
      <ul>
        <li>始终用 <code>===</code>，避免 <code>==</code> 的隐式转换陷阱</li>
        <li>判断 <code>null</code> 用 <code>x === null</code>，不用 <code>typeof</code></li>
        <li>判断数组用 <code>Array.isArray()</code>，不用 <code>typeof</code></li>
        <li>NaN 判断用 <code>Number.isNaN()</code> 或 <code>Object.is(x, NaN)</code></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.pair-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.pair-list .pair-btn { padding: 4px 10px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 12px; font-family: monospace; }
.pair-list .pair-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.result-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.result { font-size: 18px; font-weight: bold; }
.result.true { color: #65a30d; }
.result.false { color: #dc2626; }
.note { color: #8a6d42; font-size: 12px; margin-top: 6px; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 8px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
code.warn { color: #e85d04; font-weight: bold; }
small { color: #8a6d42; }
ul { padding-left: 18px; font-size: 12px; }
</style>
