<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'structure' | 'compile' | 'example'>('structure')

const cppCode = `#include <iostream>

// 第一个 C++ 程序
int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
`

const compileSteps = [
  { step: '预处理', cmd: 'g++ -E main.cpp -o main.i', desc: '展开宏、处理 #include，生成预处理文件' },
  { step: '编译', cmd: 'g++ -S main.i -o main.s', desc: '生成汇编代码，进行语法检查和类型检查' },
  { step: '汇编', cmd: 'g++ -c main.s -o main.o', desc: '生成机器码，生成目标文件' },
  { step: '链接', cmd: 'g++ main.o -o main', desc: '合并目标文件和库文件，生成可执行文件' },
  { step: '一步编译', cmd: 'g++ main.cpp -o main', desc: '直接完成所有步骤' },
]

const programStructure = [
  { part: '#include', desc: '预处理指令，引入头文件（如 iostream、vector）' },
  { part: 'main()', desc: '程序入口函数，操作系统从这里开始执行' },
  { part: 'std::cout', desc: '标准输出流对象，用于向控制台输出' },
  { part: '<<', desc: '输出运算符，将数据发送到流' },
  { part: 'return 0', desc: '返回退出码，0 表示程序正常结束' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 C++ 程序结构与编译流程</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'structure' }" @click="activeTab = 'structure'">程序结构</button>
      <button class="tab-btn" :class="{ active: activeTab === 'compile' }" @click="activeTab = 'compile'">编译流程</button>
      <button class="tab-btn" :class="{ active: activeTab === 'example' }" @click="activeTab = 'example'">代码示例</button>
    </div>

    <div v-if="activeTab === 'structure'">
      <pre class="code-block"><code>{{ cppCode }}</code></pre>
      <table>
        <thead><tr><th>组成部分</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="item in programStructure" :key="item.part">
            <td><code>{{ item.part }}</code></td>
            <td>{{ item.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'compile'">
      <table>
        <thead><tr><th>阶段</th><th>命令</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="item in compileSteps" :key="item.step">
            <td><strong>{{ item.step }}</strong></td>
            <td><code>{{ item.cmd }}</code></td>
            <td>{{ item.desc }}</td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>常见编译错误：</strong></p>
        <ul>
          <li><strong>编译错误</strong>：语法错误、类型错误（在编译阶段发现）</li>
          <li><strong>链接错误</strong>：未定义引用、重复定义（在链接阶段发现）</li>
          <li>使用 <code>g++ -Wall</code> 开启所有常用警告，<code>-Wextra</code> 开启额外警告</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'example'">
      <pre class="code-block"><code>{{ cppCode }}</code></pre>
      <div class="tips-box">
        <p><strong>关键点：</strong></p>
        <ul>
          <li>每个 C++ 程序必须有 <code>main()</code> 函数</li>
          <li><code>#include &lt;iostream&gt;</code> 引入输入输出库</li>
          <li><code>std::cout</code> 需要 <code>std::</code> 前缀，或使用 <code>using namespace std;</code></li>
          <li>分号 <code>;</code> 是语句结束符，不能省略</li>
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
