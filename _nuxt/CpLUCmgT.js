const n=`<script setup lang="ts">
const cppCode = \`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // 基本 lambda
    auto print = []() {
        std::cout << "Hello from lambda!" << std::endl;
    };
    print();

    // 带参数的 lambda
    auto add = [](int a, int b) {
        return a + b;
    };
    std::cout << "3 + 5 = " << add(3, 5) << std::endl;

    // 值捕获
    int factor = 2;
    auto multiply = [factor](int x) {
        return x * factor;
    };
    std::cout << "5 * 2 = " << multiply(5) << std::endl;

    // 引用捕获
    int total = 0;
    std::for_each(nums.begin(), nums.end(), [&total](int x) {
        total += x;
    });
    std::cout << "总和：" << total << std::endl;

    // 泛型 lambda（C++14）
    auto generic = [](auto a, auto b) {
        return a + b;
    };
    std::cout << generic(1, 2) << std::endl;
    std::cout << generic(1.5, 2.5) << std::endl;

    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 Lambda 表达式：匿名函数与捕获</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>捕获列表：</strong></p>
      <ul>
        <li><code>[]</code>：不捕获任何变量</li>
        <li><code>[x]</code>：值捕获 x</li>
        <li><code>[&x]</code>：引用捕获 x</li>
        <li><code>[=]</code>：值捕获所有变量</li>
        <li><code>[&]</code>：引用捕获所有变量</li>
        <li><code>[this]</code>：捕获 this 指针</li>
      </ul>
      <p><strong>注意：</strong></p>
      <ul>
        <li>值捕获的变量默认是 const 的，需要修改时用 <code>mutable</code></li>
        <li>引用捕获要确保被捕获的变量生命周期长于 lambda</li>
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
