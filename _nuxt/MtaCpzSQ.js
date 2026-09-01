const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'precedence' | 'examples' | 'pitfalls'>('precedence')

const cppCode = \`// 运算符示例
#include <iostream>

int main() {
    // 算术运算符
    int a = 10, b = 3;
    std::cout << a + b << std::endl;   // 13
    std::cout << a / b << std::endl;   // 3（整数除法）
    std::cout << a % b << std::endl;   // 1（取余）

    // 关系运算符
    std::cout << (a > b) << std::endl;  // 1（true）

    // 逻辑运算符（短路求值）
    int x = 0;
    if (a > b && ++x) { }  // x 会增加
    std::cout << x << std::endl;  // 1

    // 位运算符
    int bits = 5;  // 二进制 0101
    std::cout << (bits << 1) << std::endl;  // 10（1010）
    std::cout << (bits & 3) << std::endl;   // 1（0101 & 0011 = 0001）

    // 三元运算符
    int max = (a > b) ? a : b;

    // 逗号运算符
    int c = (a++, b++, a + b);  // a=11, b=4, c=15

    return 0;
}\`

const precedence = [
  { level: '最高', operators: '::' },
  { level: '↓', operators: '() [] -> . ++ --（后缀）' },
  { level: '↓', operators: '++ --（前缀）! ~ + - * & sizeof' },
  { level: '↓', operators: '* / %' },
  { level: '↓', operators: '+ -' },
  { level: '↓', operators: '<< >>' },
  { level: '↓', operators: '< <= > >=' },
  { level: '↓', operators: '== !=' },
  { level: '↓', operators: '&' },
  { level: '↓', operators: '^' },
  { level: '↓', operators: '|' },
  { level: '↓', operators: '&&' },
  { level: '↓', operators: '||' },
  { level: '↓', operators: '?:' },
  { level: '↓', operators: '= += -= 等赋值' },
  { level: '最低', operators: ',' },
]

const pitfalls = [
  { problem: '运算符优先级', code: 'if (a & mask == 0)' , fix: 'if ((a & mask) == 0)', desc: '== 优先级高于 &' },
  { problem: '整数提升', code: 'char c1=100, c2=200; char sum=c1+c2;', fix: 'int sum = c1 + c2;', desc: 'char 相加会提升为 int' },
  { problem: '未定义行为', code: 'int i = 0; i = i++;', fix: 'i++; 或 ++i;', desc: '同一表达式中多次修改变量' },
  { problem: '有符号溢出', code: 'int x = INT_MAX + 1;', fix: '使用 long long', desc: '有符号溢出是未定义行为' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 运算符、表达式与类型提升</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'precedence' }" @click="activeTab = 'precedence'">优先级</button>
      <button class="tab-btn" :class="{ active: activeTab === 'examples' }" @click="activeTab = 'examples'">代码示例</button>
      <button class="tab-btn" :class="{ active: activeTab === 'pitfalls' }" @click="activeTab = 'pitfalls'">常见陷阱</button>
    </div>

    <div v-if="activeTab === 'precedence'">
      <table>
        <thead><tr><th>优先级</th><th>运算符</th></tr></thead>
        <tbody>
          <tr v-for="p in precedence" :key="p.level">
            <td>{{ p.level }}</td>
            <td><code>{{ p.operators }}</code></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>建议：</strong>对复杂表达式使用括号明确意图，不要依赖优先级记忆！</p>
      </div>
    </div>

    <div v-if="activeTab === 'examples'">
      <pre class="code-block"><code>{{ cppCode }}</code></pre>
    </div>

    <div v-if="activeTab === 'pitfalls'">
      <table>
        <thead><tr><th>问题</th><th>错误代码</th><th>修正</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="p in pitfalls" :key="p.problem">
            <td>{{ p.problem }}</td>
            <td><code>{{ p.code }}</code></td>
            <td><code>{{ p.fix }}</code></td>
            <td><small>{{ p.desc }}</small></td>
          </tr>
        </tbody>
      </table>
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
`;export{n as default};
