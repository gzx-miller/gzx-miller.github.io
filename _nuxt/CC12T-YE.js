const n=`<script setup lang="ts">
const cppCode = \`#include <iostream>
#include <stdexcept>
#include <fstream>

// 自定义异常类
class MyException : public std::runtime_error {
public:
    MyException(const std::string& msg) : std::runtime_error(msg) {}
};

void processFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw MyException("无法打开文件: " + filename);
    }
    // 处理文件...
}

int main() {
    try {
        processFile("nonexistent.txt");
    } catch (const MyException& e) {
        std::cout << "捕获自定义异常: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cout << "捕获标准异常: " << e.what() << std::endl;
    } catch (...) {
        std::cout << "捕获未知异常" << std::endl;
    }

    // noexcept 函数
    auto safeDivide = [](int a, int b) noexcept {
        if (b == 0) return 0;
        return a / b;
    };

    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 异常处理：try/catch/throw</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>异常安全保证：</strong></p>
      <ul>
        <li><strong>基本承诺</strong>：异常抛出后程序处于有效状态</li>
        <li><strong>强承诺</strong>：操作要么完全成功，要么完全失败（事务性）</li>
        <li><strong>不抛异常承诺</strong>：函数永远不会抛异常（用 noexcept）</li>
      </ul>
      <p><strong>最佳实践：</strong></p>
      <ul>
        <li>析构函数不应该抛出异常</li>
        <li>使用 RAII 确保异常安全</li>
        <li>catch 块按派生类到基类顺序排序</li>
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
