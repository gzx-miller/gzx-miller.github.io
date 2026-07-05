<script setup lang="ts">
const cppCode = `#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    // 构造函数
    Person(const std::string& n, int a) : name(n), age(a) {}

    // const 成员函数（不修改对象状态）
    void introduce() const {
        std::cout << "我叫 " << name << "，今年 " << age << " 岁。" << std::endl;
    }

    // getter
    std::string getName() const { return name; }
    int getAge() const { return age; }

    // setter
    void setAge(int a) {
        if (a >= 0 && a <= 150) {
            age = a;
        }
    }
};

int main() {
    Person p("栗子", 3);
    p.introduce();

    p.setAge(4);
    std::cout << p.getName() << " 现在 " << p.getAge() << " 岁了。" << std::endl;
    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 类与对象：封装、访问控制与 this 指针</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>封装要点：</strong></p>
      <ul>
        <li>数据成员设为 <code>private</code>，通过 <code>public</code> 成员函数访问</li>
        <li><code>const</code> 成员函数承诺不修改对象状态</li>
        <li>使用初始化列表（<code>: member(val)</code>）而非在函数体内赋值</li>
        <li><code>this</code> 指针指向调用该函数的对象</li>
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
