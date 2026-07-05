<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'types' | 'init' | 'convert'>('types')

const cppCode = `// 基本类型示例
#include <iostream>
#include <limits>

int main() {
    // 整数类型
    short s = 10;           // 通常 2 字节
    int n = 100;             // 通常 4 字节
    long l = 100000L;        // 至少 4 字节
    long long ll = 1e18;     // 至少 8 字节

    // 无符号类型
    unsigned int u = 4000000000u;

    // 浮点类型
    float f = 3.14f;        // 通常 4 字节
    double d = 3.1415926;   // 通常 8 字节

    // 字符和布尔
    char c = 'A';
    bool b = true;

    // 统一初始化（C++11）
    int x{5};                // 防止窄化转换
    // int bad{3.14};       // 编译错误！

    // 类型转换
    double pi = 3.14159;
    int intPi = static_cast<int>(pi);  // 显式转换，结果为 3

    return 0;
}`

const types = [
  { type: 'short', size: '2 字节', range: '-32768 ~ 32767', usage: '小范围整数' },
  { type: 'int', size: '4 字节', range: '-2^31 ~ 2^31-1', usage: '默认整数类型' },
  { type: 'long long', size: '8 字节', range: '-2^63 ~ 2^63-1', usage: '大整数' },
  { type: 'float', size: '4 字节', range: '±3.4e±38', usage: '单精度浮点' },
  { type: 'double', size: '8 字节', range: '±1.7e±308', usage: '双精度浮点' },
  { type: 'char', size: '1 字节', range: '-128 ~ 127 或 0 ~ 255', usage: '单个字符' },
  { type: 'bool', size: '1 字节', range: 'true 或 false', usage: '布尔值' },
]

const initMethods = [
  { method: '直接初始化', syntax: 'int x = 5;', note: '传统方式' },
  { method: '统一初始化', syntax: 'int x{5};', note: 'C++11，防止窄化转换' },
  { method: '自动类型推导', syntax: 'auto x = 5;', note: 'C++11，编译器推导类型' },
]

const conversions = [
  { from: 'int → double', code: 'double d = 42;', result: '42.0', type: '隐式，安全' },
  { from: 'double → int', code: 'int x = 3.14;', result: '3', type: '隐式，精度丢失' },
  { from: '有符号 → 无符号', code: 'unsigned u = -1;', result: '4294967295', type: '隐式，危险！' },
  { from: '显式转换', code: 'int x = static_cast<int>(3.14);', result: '3', type: 'C++ 风格，推荐' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 变量、基本类型与类型转换</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'types' }" @click="activeTab = 'types'">基本类型</button>
      <button class="tab-btn" :class="{ active: activeTab === 'init' }" @click="activeTab = 'init'">初始化方式</button>
      <button class="tab-btn" :class="{ active: activeTab === 'convert' }" @click="activeTab = 'convert'">类型转换</button>
    </div>

    <div v-if="activeTab === 'types'">
      <pre class="code-block"><code>{{ cppCode }}</code></pre>
      <table>
        <thead><tr><th>类型</th><th>大小</th><th>范围</th><th>用途</th></tr></thead>
        <tbody>
          <tr v-for="t in types" :key="t.type">
            <td><code>{{ t.type }}</code></td>
            <td>{{ t.size }}</td>
            <td><small>{{ t.range }}</small></td>
            <td>{{ t.usage }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'init'">
      <table>
        <thead><tr><th>方式</th><th>语法</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="m in initMethods" :key="m.method">
            <td>{{ m.method }}</td>
            <td><code>{{ m.syntax }}</code></td>
            <td>{{ m.note }}</td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>统一初始化的优势：</strong></p>
        <ul>
          <li>防止窄化转换（<code>int x{3.14}</code> 编译错误）</li>
          <li>可以初始化任何类型（数组、结构体、容器等）</li>
          <li>语法统一，减少记忆负担</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'convert'">
      <table>
        <thead><tr><th>转换</th><th>代码</th><th>结果</th><th>类型</th></tr></thead>
        <tbody>
          <tr v-for="c in conversions" :key="c.from">
            <td>{{ c.from }}</td>
            <td><code>{{ c.code }}</code></td>
            <td>{{ c.result }}</td>
            <td><small>{{ c.type }}</small></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box warning">
        <p><strong>注意：</strong></p>
        <ul>
          <li>避免有符号和无符号混用（<code>-1 < 0u</code> 为 <code>false</code>）</li>
          <li>优先使用 C++ 风格的类型转换（<code>static_cast</code> 等）</li>
          <li><code>auto</code> 可以简化复杂类型声明</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  background: #1e1e2e;
  color: #e0e0e0;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  overflow-x: auto;
  line-height: 1.6;
  margin-bottom: 12px;
}
.tips-box {
  background: #f0f7ff;
  padding: 10px;
  border-radius: 6px;
  border-left: 3px solid #0891b2;
  margin-top: 10px;
}
.tips-box.warning {
  border-left-color: #e85d04;
  background: #fff8f0;
}
.tab-btn {
  padding: 5px 14px;
  border: 1px solid #e0a06a;
  border-radius: 4px;
  background: #fff;
  color: var(--text);
  cursor: pointer;
  font-size: 13px;
}
.tab-btn.active {
  background: #e85d04;
  color: #fff;
  border-color: #e85d04;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
th, td {
  padding: 6px 8px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: top;
}
th {
  background: #fff3e0;
}
code {
  background: #f5f0eb;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 12px;
}
ul {
  padding-left: 18px;
  font-size: 13px;
}
</style>
