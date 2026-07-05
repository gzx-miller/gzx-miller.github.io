<script setup lang="ts">
const cppCode = `#include <iostream>
#include <cmath>

class Vector {
private:
    double x, y;

public:
    Vector(double x, double y) : x(x), y(y) {}

    // 运算符重载：+
    Vector operator+(const Vector& other) const {
        return Vector(x + other.x, y + other.y);
    }

    // 运算符重载：-
    Vector operator-(const Vector& other) const {
        return Vector(x - other.x, y - other.y);
    }

    // 运算符重载：*（点积）
    double operator*(const Vector& other) const {
        return x * other.x + y * other.y;
    }

    // 运算符重载：<<（输出）
    friend std::ostream& operator<<(std::ostream& os, const Vector& v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }

    // 下标运算符
    double& operator[](int index) {
        return index == 0 ? x : y;
    }

    const double& operator[](int index) const {
        return index == 0 ? x : y;
    }
};

int main() {
    Vector v1(1, 2), v2(3, 4);
    std::cout << "v1 = " << v1 << std::endl;
    std::cout << "v1 + v2 = " << v1 + v2 << std::endl;
    std::cout << "v1 * v2 = " << v1 * v2 << std::endl;
    std::cout << "v1[0] = " << v1[0] << std::endl;
    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 运算符重载：让自定义类型更自然</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>运算符重载规则：</strong></p>
      <ul>
        <li><code>operator+</code> 返回新对象（不修改操作数）</li>
        <li><code>operator+=</code> 返回引用（修改左操作数）</li>
        <li><code>operator==</code> 和 <code>operator!=</code> 应成对实现</li>
        <li>不能重载的运算符：<code>::</code> <code>.</code> <code>.*</code> <code>?:</code></li>
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
