const n=`<script setup lang="ts">
const cppCode = \`#include <iostream>
#include <string>
#include <cstring>

int main() {
    // 内置数组
    int arr[5] = {1, 2, 3};  // 未初始化的元素为 0
    std::cout << arr[0] << std::endl;  // 1
    // arr[10] = 5;  // 越界访问，未定义行为！

    // 数组退化：传递给函数时丢失大小信息
    // void foo(int a[]) 等价于 void foo(int* a)

    // C 风格字符串
    char greeting[] = "Hello";
    std::cout << greeting << std::endl;  // Hello
    std::cout << strlen(greeting) << std::endl;  // 5

    // std::string（推荐）
    std::string s1 = "Hello";
    std::string s2 = "World";
    std::string s3 = s1 + ", " + s2 + "!";  // 拼接
    std::cout << s3 << std::endl;  // Hello, World!

    // string 常用操作
    std::cout << s3.size() << std::endl;  // 13
    std::cout << s3.substr(0, 5) << std::endl;  // Hello
    std::cout << s3.find("World") << std::endl;  // 7

    // c_str() 获取 C 风格字符串
    const char* cstr = s3.c_str();

    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 数组、C 风格字符串与 std::string</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>建议：</strong></p>
      <ul>
        <li>优先使用 <code>std::string</code> 而非 C 风格字符串</li>
        <li>优先使用 <code>std::array</code> 或 <code>std::vector</code> 而非内置数组</li>
        <li><code>std::string</code> 的 <code>operator[]</code> 不检查越界</li>
        <li><code>std::string::at()</code> 会检查越界并抛异常</li>
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
