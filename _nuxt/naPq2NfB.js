const n=`<script setup lang="ts">
const cppCode = \`#include <iostream>
#include <string>

// 函数模板
template <typename T>
T max(T a, T b) {
    return a > b ? a : b;
}

// 类模板
template <typename T>
class Pair {
private:
    T first, second;

public:
    Pair(T a, T b) : first(a), second(b) {}

    T getFirst() const { return first; }
    T getSecond() const { return second; }

    void setFirst(T a) { first = a; }
    void setSecond(T b) { second = b; }
};

// 模板特化
template <>
class Pair<std::string> {
private:
    std::string first, second;

public:
    Pair(const std::string& a, const std::string& b) : first(a), second(b) {}

    std::string getConcat() const {
        return first + " " + second;
    }
};

int main() {
    // 函数模板（类型推导）
    std::cout << max(3, 7) << std::endl;        // 7
    std::cout << max(3.14, 2.71) << std::endl; // 3.14

    // 类模板（显式指定类型）
    Pair<int> intPair(10, 20);
    std::cout << intPair.getFirst() << std::endl;  // 10

    Pair<std::string> strPair("Hello", "World");
    std::cout << strPair.getConcat() << std::endl;  // Hello World
    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 函数模板与类模板：泛型编程基础</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>模板要点：</strong></p>
      <ul>
        <li>函数模板：编译器根据实参推导类型</li>
        <li>类模板：使用时必须显式指定类型参数</li>
        <li>模板代码通常放在头文件中（因为需要完整定义才能实例化）</li>
        <li>模板特化：为特定类型提供特殊实现</li>
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
