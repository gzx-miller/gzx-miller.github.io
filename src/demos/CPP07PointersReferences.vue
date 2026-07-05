<script setup lang="ts">
const cppCode = `#include <iostream>

int main() {
    int x = 42;

    // 指针
    int* p = &x;  // p 指向 x
    std::cout << *p << std::endl;  // 42（解引用）
    *p = 100;  // 通过指针修改 x
    std::cout << x << std::endl;  // 100

    // 指针算术
    int arr[] = {10, 20, 30};
    int* q = arr;  // 等价于 &arr[0]
    std::cout << *q << std::endl;  // 10
    std::cout << *(q + 1) << std::endl;  // 20（指针算术）

    // 引用
    int y = 5;
    int& r = y;  // r 是 y 的别名
    r = 10;  // 修改 y
    std::cout << y << std::endl;  // 10

    // nullptr（C++11）
    int* np = nullptr;  // 空指针
    if (np != nullptr) {
        std::cout << *np << std::endl;
    }

    // 引用 vs 指针
    // 引用：必须初始化，不能重新绑定，没有空引用
    // 指针：可以为 nullptr，可以重新指向其他对象

    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 指针与引用：地址、解引用与别名</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>指针 vs 引用：</strong></p>
      <table>
        <tr><th>特性</th><th>指针</th><th>引用</th></tr>
        <tr><td>初始化</td><td>可以不初始化</td><td>必须初始化</td></tr>
        <tr><td>空值</td><td>可以为 nullptr</td><td>不能有空引用</td></tr>
        <tr><td>重新绑定</td><td>可以指向其他对象</td><td>不能重新绑定</td></tr>
        <tr><td>使用</td><td>需要解引用 *p</td><td>直接使用（像变量）</td></tr>
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
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 10px;
}
th, td {
  padding: 6px 8px;
  border: 1px solid #ddd;
  text-align: left;
}
th {
  background: #fff3e0;
}
</style>
