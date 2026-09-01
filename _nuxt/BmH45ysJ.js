const n=`<script setup lang="ts">
const cppCode = \`// C++11/14/17 核心特性
#include <iostream>
#include <vector>
#include <map>

int main() {
    // auto 类型推导
    auto x = 42;                           // int
    auto name = "栗子";                   // const char*
    auto iter = vec.begin();                // std::vector<int>::iterator

    // 范围 for
    std::vector<int> vec = {1, 2, 3, 4, 5};
    for (auto& elem : vec) {
        elem *= 2;
    }

    // 统一初始化
    std::vector<int> nums{1, 2, 3, 4, 5};
    std::map<std::string, int> ages{{"Alice", 25}, {"Bob", 30}};

    // nullptr
    int* ptr = nullptr;  // 替代 NULL

    // 类型别名（using）
    using IntVec = std::vector<int>;
    IntVec numbers = {1, 2, 3};

    // C++17 结构化绑定
    std::map<std::string, int> scores{{"Alice", 95}, {"Bob", 87}};
    for (const auto& [name, score] : scores) {
        std::cout << name << ": " << score << std::endl;
    }

    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 现代 C++ 核心特性</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>现代 C++ 特性：</strong></p>
      <ul>
        <li><code>auto</code> 简化类型声明，编译器自动推导</li>
        <li><code>范围 for</code> 安全简洁地遍历容器</li>
        <li><code>统一初始化 {}</code> 防止窄化转换</li>
        <li><code>nullptr</code> 类型安全的空指针</li>
        <li><code>结构化绑定</code>（C++17）解构元组、pair</li>
      </ul>
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
ul {
  padding-left: 18px;
  font-size: 13px;
}
</style>
`;export{n as default};
