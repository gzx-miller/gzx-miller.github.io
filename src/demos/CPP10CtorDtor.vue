<script setup lang="ts">
const cppCode = `#include <iostream>
#include <string>

class Student {
private:
    std::string* name;  // 动态分配的资源

public:
    // 构造函数
    Student(const std::string& n) {
        name = new std::string(n);
        std::cout << "构造函数：" << *name << std::endl;
    }

    // 拷贝构造函数（深拷贝）
    Student(const Student& other) {
        name = new std::string(*other.name);
        std::cout << "拷贝构造函数：" << *name << std::endl;
    }

    // 拷贝赋值运算符（深拷贝）
    Student& operator=(const Student& other) {
        if (this != &other) {  // 检查自赋值
            delete name;  // 释放旧资源
            name = new std::string(*other.name);  // 分配新资源
        }
        std::cout << "拷贝赋值运算符：" << *name << std::endl;
        return *this;
    }

    // 析构函数
    ~Student() {
        std::cout << "析构函数：" << *name << std::endl;
        delete name;
    }
};

int main() {
    Student s1("小明");  // 构造
    Student s2 = s1;      // 拷贝构造
    Student s3("小红");
    s3 = s1;              // 拷贝赋值
    return 0;
}  // s3、s2、s1 依次析构`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 构造函数、析构函数与对象生命周期</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>对象生命周期：</strong></p>
      <ul>
        <li><strong>构造</strong>：对象创建时调用构造函数</li>
        <li><strong>析构</strong>：对象销毁时调用析构函数</li>
        <li><strong>构造顺序</strong>：基类 → 成员 → 自身</li>
        <li><strong>析构顺序</strong>：自身 → 成员 → 基类（相反）</li>
      </ul>
      <p><strong>特殊成员函数：</strong></p>
      <ul>
        <li>默认构造、析构、拷贝构造、拷贝赋值</li>
        <li>C++11 增加：移动构造、移动赋值</li>
        <li>如果自定义了其中一个，考虑是否需要自定义所有（Rule of Five）</li>
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
