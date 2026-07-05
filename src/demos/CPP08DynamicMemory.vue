<script setup lang="ts">
const cppCode = `#include <iostream>

int main() {
    // 动态分配单个 int
    int* p = new int(42);  // 分配并初始化
    std::cout << *p << std::endl;  // 42
    delete p;  // 释放内存
    p = nullptr;  // 避免悬垂指针

    // 动态分配数组
    int* arr = new int[5]{1, 2, 3, 4, 5};
    for (int i = 0; i < 5; i++) {
        std::cout << arr[i] << " ";
    }
    delete[] arr;  // 注意：delete[] 而非 delete

    // 常见错误
    // int* p2 = new int(10);
    // delete p2;
    // std::cout << *p2 << std::endl;  // 悬垂指针，未定义行为！
    // delete p2;  // 双重释放，未定义行为！

    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 动态内存管理：new/delete 与常见陷阱</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>常见陷阱：</strong></p>
      <ul>
        <li><strong>内存泄漏</strong>：分配后忘记释放</li>
        <li><strong>悬垂指针</strong>：释放后继续使用</li>
        <li><strong>双重释放</strong>：同一指针释放两次</li>
        <li><strong>不匹配</strong>：new/delete[] 混用</li>
      </ul>
      <p><strong>现代 C++ 建议：</strong></p>
      <ul>
        <li>优先使用 <code>std::unique_ptr</code> 或 <code>std::shared_ptr</code></li>
        <li>优先使用 <code>std::vector</code> 而非动态数组</li>
        <li>几乎不要使用裸 <code>new/delete</code></li>
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
