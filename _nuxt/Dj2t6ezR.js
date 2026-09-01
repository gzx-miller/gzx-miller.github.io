const n=`<script setup lang="ts">
const cppCode = \`#include <iostream>
#include <fstream>
#include <mutex>

// RAII 类示例：文件句柄
class FileHandle {
private:
    std::fstream file;

public:
    FileHandle(const char* filename) {
        file.open(filename, std::ios::out);
        if (!file.is_open()) {
            throw std::runtime_error("无法打开文件");
        }
        std::cout << "文件已打开" << std::endl;
    }

    ~FileHandle() {
        if (file.is_open()) {
            file.close();
            std::cout << "文件已关闭" << std::endl;
        }
    }

    void write(const std::string& content) {
        file << content;
    }
};

// 使用 RAII 的锁守卫
std::mutex mtx;

void safeFunction() {
    std::lock_guard<std::mutex> lock(mtx);  // 构造时加锁
    // 临界区
    std::cout << "线程安全操作" << std::endl;
}  // 析构时解锁（即使抛异常也会解锁）

int main() {
    try {
        FileHandle file("test.txt");
        file.write("Hello, RAII!");
        // 函数结束时自动析构，文件被关闭
    } catch (const std::exception& e) {
        std::cout << "错误: " << e.what() << std::endl;
    }

    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 RAII 原则：资源获取即初始化</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>RAII 核心思想：</strong></p>
      <ul>
        <li>构造函数中获取资源</li>
        <li>析构函数中释放资源</li>
        <li>利用栈展开（stack unwinding）自动清理</li>
      </ul>
      <p><strong>RAII 的好处：</strong></p>
      <ul>
        <li>异常安全（即使抛异常，局部对象也会析构）</li>
        <li>自动资源管理（不会忘记释放）</li>
        <li>代码简洁（不需要手动 close/release）</li>
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
