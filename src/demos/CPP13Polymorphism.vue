<script setup lang="ts">
const cppCode = `#include <iostream>
#include <vector>
#include <memory>

// 抽象基类（有纯虚函数）
class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数
    virtual void draw() const = 0;
    virtual ~Shape() {}  // 虚析构函数
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    double area() const override {
        return 3.14159 * radius * radius;
    }

    void draw() const override {
        std::cout << "○ 圆形（半径：" << radius << "）" << std::endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() const override {
        return width * height;
    }

    void draw() const override {
        std::cout << "▭ 矩形（" << width << "×" << height << "）" << std::endl;
    }
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));

    for (const auto& shape : shapes) {
        shape->draw();
        std::cout << "面积：" << shape->area() << std::endl;
    }
    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 多态与虚函数：动态绑定与虚函数表</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>多态实现机制：</strong></p>
      <ul>
        <li>包含虚函数的类有<strong>虚函数表</strong>（vtable）</li>
        <li>每个对象有指向 vtable 的指针（vptr）</li>
        <li>调用虚函数时通过 vptr 找到正确的函数</li>
      </ul>
      <p><strong>纯虚函数与抽象类：</strong></p>
      <ul>
        <li><code>= 0</code> 标记纯虚函数</li>
        <li>有纯虚函数的类是<strong>抽象类</strong>，不能实例化</li>
        <li>派生类必须重写所有纯虚函数才能实例化</li>
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
