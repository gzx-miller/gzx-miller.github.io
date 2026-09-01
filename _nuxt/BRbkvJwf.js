const n=`<script setup lang="ts">
const cppCode = \`// C++20 模块（示例，需要支持模块的编译器）
// 模块接口文件（.cppm 或 .ixx）

// === math.cppm ===
export module math;  // 声明模块

export int add(int a, int b) {
    return a + b;
}

export int multiply(int a, int b) {
    return a * b;
}

export namespace math_ops {
    double divide(double a, double b) {
        return a / b;
    }
}

// === main.cpp ===
import math;  // 导入模块
import std.io;  // 导入标准库模块（C++23）

int main() {
    int sum = add(10, 20);
    int product = multiply(5, 4);
    double quotient = math_ops::divide(10.0, 3.0);

    std::cout << "sum = " << sum << std::endl;
    std::cout << "product = " << product << std::endl;
    std::cout << "quotient = " << quotient << std::endl;

    return 0;
}

// 与传统头文件的对比：
// - 更快的编译速度（模块只解析一次）
// - 更好的封装（宏不会泄漏）
// - 明确的导出声明\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 C++20 模块</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>模块的优势：</strong></p>
      <ul>
        <li>更快的编译速度（避免重复解析）</li>
        <li>更好的封装（宏不会泄漏到模块使用者）</li>
        <li>明确的导出声明（<code>export</code>）</li>
        <li>隔离的实现细节（未导出的声明不可见）</li>
      </ul>
      <p><strong>当前状态：</strong></p>
      <ul>
        <li>MSVC 支持较好</li>
        <li>GCC 和 Clang 正在实现中</li>
        <li>标准库模块（<code>import std;</code>）在 C++23</li>
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
