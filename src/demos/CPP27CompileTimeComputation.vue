<script setup lang="ts">
const cppCode = `// 编译期计算：constexpr、consteval、constinit
#include <iostream>

// constexpr 函数：编译期或运行期求值
constexpr int square(int x) {
    return x * x;
}

// C++14：constexpr 函数可以包含循环和条件
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; ++i) {
        result *= i;
    }
    return result;
}

// consteval 函数（C++20）：必须在编译期求值
consteval int compileTimeOnly(int x) {
    return x * 2;
}

// 编译期计算的查找表
constexpr int lookupTable(int index) {
    constexpr int table[] = {1, 4, 9, 16, 25};
    return table[index];
}

int main() {
    // 编译期计算
    constexpr int val = square(5);        // 编译期
    int arr[lookupTable(2)];             // 编译期确定数组大小
    static int x = factorial(10);         // 编译期计算

    // constinit（C++20）：必须在编译期初始化
    constinit static int y = 42;

    std::cout << "square(5) = " << val << std::endl;
    std::cout << "factorial(10) = " << factorial(10) << std::endl;
    std::cout << "compileTimeOnly(21) = " << compileTimeOnly(21) << std::endl;

    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 编译期计算</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>编译期计算特性：</strong></p>
      <ul>
        <li><code>constexpr</code>（C++11）：可以在编译期求值</li>
        <li><code>consteval</code>（C++20）：必须在编译期求值</li>
        <li><code>constinit</code>（C++20）：必须在编译期初始化</li>
        <li>编译期计算提升运行时性能</li>
        <li><code>constexpr</code> 函数可用于编译期上下文</li>
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
