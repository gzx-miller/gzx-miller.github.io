<script setup lang="ts">
const cppCode = `#include <iostream>
#include <cstring>

class String {
private:
    char* data;
    size_t length;

public:
    // 构造函数
    String(const char* str) {
        length = std::strlen(str);
        data = new char[length + 1];
        std::strcpy(data, str);
        std::cout << "构造：" << data << std::endl;
    }

    // 拷贝构造函数（深拷贝）
    String(const String& other) {
        length = other.length;
        data = new char[length + 1];
        std::strcpy(data, other.data);
        std::cout << "拷贝构造：" << data << std::endl;
    }

    // 拷贝赋值运算符
    String& operator=(const String& other) {
        if (this != &other) {  // 自赋值检查
            delete[] data;  // 释放旧资源
            length = other.length;
            data = new char[length + 1];
            std::strcpy(data, other.data);
        }
        std::cout << "拷贝赋值：" << data << std::endl;
        return *this;
    }

    // 析构函数
    ~String() {
        std::cout << "析构：" << (data ? data : "null") << std::endl;
        delete[] data;
    }
};

int main() {
    String s1("Hello");
    String s2 = s1;  // 拷贝构造
    String s3("World");
    s3 = s1;          // 拷贝赋值
    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 拷贝控制：拷贝构造、拷贝赋值与 Rule of Three/Five</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>Rule of Three：</strong></p>
      <ul>
        <li>如果类需要自定义<strong>析构函数</strong>、<strong>拷贝构造函数</strong>或<strong>拷贝赋值运算符</strong>中的任何一个</li>
        <li>那么通常也需要自定义所有三个</li>
      </ul>
      <p><strong>Rule of Five（C++11）：</strong></p>
      <ul>
        <li>加上<strong>移动构造函数</strong>和<strong>移动赋值运算符</strong></li>
      </ul>
      <p><strong>Rule of Zero：</strong></p>
      <ul>
        <li>如果所有成员都是 RAII 类型，不需要自定义任何特殊成员函数</li>
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
