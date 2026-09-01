const n=`<script setup lang="ts">
const cppCode = \`#include <iostream>
#include <string>

// 基类
class Animal {
public:
    Animal(const std::string& n) : name(n) {
        std::cout << "Animal 构造：" << name << std::endl;
    }

    // 虚函数
    virtual void speak() const {
        std::cout << name << " 发出声音。" << std::endl;
    }

    // 虚析构函数（重要！）
    virtual ~Animal() {
        std::cout << "Animal 析构：" << name << std::endl;
    }

protected:
    std::string name;
};

// 派生类
class Dog : public Animal {
public:
    Dog(const std::string& n) : Animal(n) {
        std::cout << "Dog 构造：" << name << std::endl;
    }

    // 重写虚函数
    void speak() const override {
        std::cout << name << " 汪汪！" << std::endl;
    }

    ~Dog() {
        std::cout << "Dog 析构：" << name << std::endl;
    }
};

int main() {
    Dog dog("旺财");
    dog.speak();  // 旺财 汪汪！

    // 多态：通过基类指针调用派生类方法
    Animal* animal = new Dog("小黑");
    animal->speak();  // 小黑 汪汪！（动态绑定）

    delete animal;  // 正确调用 Dog 的析构函数
    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 继承与派生类：基类、访问控制与切片</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>继承要点：</strong></p>
      <ul>
        <li><strong>公有继承</strong>（<code>class Dog : public Animal</code>）：is-a 关系</li>
        <li><strong>虚函数</strong>：实现运行时多态</li>
        <li><strong>override</strong>（C++11）：显式标记重写，编译器检查</li>
        <li><strong>虚析构函数</strong>：确保通过基类指针删除派生类对象时正确清理</li>
      </ul>
      <p><strong>对象切片：</strong></p>
      <ul>
        <li><code>Dog d; Animal a = d;</code> → 派生类部分被"切掉"</li>
        <li>应使用指针或引用：<code>Animal* a = &d;</code></li>
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
