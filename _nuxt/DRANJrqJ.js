const n=`<script setup lang="ts">
const cppCode = \`#include <iostream>
#include <string>
#include <vector>

int main() {
    // 移动语义：资源转移而非拷贝
    std::string str1 = "Hello, World!";
    std::string str2 = std::move(str1);  // 移动构造

    std::cout << "str2: " << str2 << std::endl;  // Hello, World!
    std::cout << "str1: " << str1 << std::endl;  // 空（被移动后）

    // 移动赋值
    std::vector<int> vec1 = {1, 2, 3, 4, 5};
    std::vector<int> vec2;
    vec2 = std::move(vec1);  // 移动赋值

    std::cout << "vec2 大小: " << vec2.size() << std::endl;  // 5
    std::cout << "vec1 大小: " << vec1.size() << std::endl;  // 0

    // 返回值优化（RVO）
    auto getVector = []() {
        std::vector<int> v = {1, 2, 3};
        return v;  // 移动或复制省略
    };

    std::vector<int> result = getVector();  // 通常无拷贝

    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 移动语义与右值引用</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>移动语义要点：</strong></p>
      <ul>
        <li><code>std::move(x)</code> 将左值转换为右值引用</li>
        <li>移动后对象处于有效但不确定的状态</li>
        <li>移动通常比拷贝快得多（只拷贝指针，不拷贝数据）</li>
      </ul>
      <p><strong>右值引用：</strong></p>
      <ul>
        <li><code>T&&</code> 是右值引用，可以绑定到临时对象</li>
        <li>用于实现移动构造和移动赋值</li>
        <li>用于完美转发（<code>std::forward</code>）</li>
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
