<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'branching' | 'loops' | 'rangefor'>('branching')

const cppCode = `// 控制流示例
#include <iostream>
#include <vector>

int main() {
    // if-else
    int score = 85;
    if (score >= 90) {
        std::cout << "优秀";
    } else if (score >= 60) {
        std::cout << "及格";
    } else {
        std::cout << "不及格";
    }

    // switch
    int day = 3;
    switch (day) {
        case 1: std::cout << "周一"; break;
        case 2: std::cout << "周二"; break;
        case 3: std::cout << "周三"; break;
        default: std::cout << "其他"; break;
    }

    // while 循环
    int i = 0;
    while (i < 5) {
        std::cout << i << " ";
        i++;
    }

    // for 循环
    for (int j = 0; j < 5; j++) {
        std::cout << j << " ";
    }

    // 范围 for（C++11）
    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (int num : nums) {
        std::cout << num << " ";
    }

    // 修改元素需要用引用
    for (int& num : nums) {
        num *= 2;
    }

    return 0;
}`

const tips = [
  'switch 的 case 必须是整型常量表达式',
  '范围 for 遍历时不能安全增删容器元素',
  'C++17 允许在 if 中初始化变量：if (int x = foo(); x > 0) {...}',
  'break 跳出循环或 switch；continue 跳过本次迭代',
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 控制流：if/switch/while/for/范围 for</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'branching' }" @click="activeTab = 'branching'">分支</button>
      <button class="tab-btn" :class="{ active: activeTab === 'loops' }" @click="activeTab = 'loops'">循环</button>
      <button class="tab-btn" :class="{ active: activeTab === 'rangefor' }" @click="activeTab = 'rangefor'">范围 for</button>
    </div>

    <div v-if="activeTab === 'branching'">
      <pre class="code-block"><code>{{ cppCode }}</code></pre>
    </div>

    <div v-if="activeTab === 'loops'">
      <pre class="code-block"><code>{{ cppCode }}</code></pre>
      <div class="tips-box">
        <p><strong>循环选择：</strong></p>
        <ul>
          <li><code>for</code>：已知迭代次数</li>
          <li><code>while</code>：条件驱动，可能一次都不执行</li>
          <li><code>do-while</code>：至少执行一次</li>
          <li><code>范围 for</code>：遍历容器（C++11）</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'rangefor'">
      <pre class="code-block"><code>{{ cppCode }}</code></pre>
      <div class="tips-box">
        <p><strong>范围 for 要点：</strong></p>
        <ul>
          <li><code>for (auto x : container)</code>：复制元素</li>
          <li><code>for (const auto& x : container)</code>：只读引用（推荐）</li>
          <li><code>for (auto& x : container)</code>：可修改元素的引用</li>
          <li>遍历过程中不要增删容器元素！</li>
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
ul {
  padding-left: 18px;
  font-size: 13px;
}
</style>
