<script setup lang="ts">
const cppCode = `#include <iostream>
#include <fstream>
#include <sstream>
#include <string>

int main() {
    // 写入文件
    std::ofstream outFile("example.txt");
    if (outFile.is_open()) {
        outFile << "Hello, C++!" << std::endl;
        outFile << "第二行内容" << std::endl;
        outFile.close();
    }

    // 读取文件（逐行）
    std::ifstream inFile("example.txt");
    if (inFile.is_open()) {
        std::string line;
        while (std::getline(inFile, line)) {
            std::cout << "读取: " << line << std::endl;
        }
        inFile.close();
    }

    // 字符串流（内存中的 I/O）
    std::string data = "42 3.14 Hello";
    std::istringstream iss(data);
    int num;
    double pi;
    std::string word;
    iss >> num >> pi >> word;
    std::cout << num << ", " << pi << ", " << word << std::endl;

    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 文件 I/O：ifstream、ofstream 与字符串流</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>文件流模式：</strong></p>
      <ul>
        <li><code>std::ios::in</code>：读取模式</li>
        <li><code>std::ios::out</code>：写入模式（默认截断）</li>
        <li><code>std::ios::app</code>：追加模式</li>
        <li><code>std::ios::binary</code>：二进制模式</li>
      </ul>
      <p><strong>字符串流用途：</strong></p>
      <ul>
        <li><code>std::istringstream</code>：解析字符串（替代 sscanf）</li>
        <li><code>std::ostringstream</code>：格式化输出到字符串（替代 sprintf）</li>
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
