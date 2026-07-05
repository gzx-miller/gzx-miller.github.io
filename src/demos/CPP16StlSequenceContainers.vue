<script setup lang="ts">
const cppCode = `#include <iostream>
#include <vector>
#include <deque>
#include <list>

int main() {
    // vector：动态数组
    std::vector<int> vec = {1, 2, 3};
    vec.push_back(4);  // 尾部添加
    vec.insert(vec.begin() + 1, 99);  // 中间插入
    for (int x : vec) {
        std::cout << x << " ";  // 1 99 2 3 4
    }
    std::cout << std::endl;

    // deque：双端队列
    std::deque<int> dq;
    dq.push_front(1);  // 头部添加
    dq.push_back(2);   // 尾部添加
    dq.push_front(0);
    for (int x : dq) {
        std::cout << x << " ";  // 0 1 2
    }
    std::cout << std::endl;

    // list：双向链表
    std::list<int> lst = {1, 2, 3};
    lst.push_front(0);   // 头部添加 O(1)
    lst.push_back(4);    // 尾部添加 O(1)
    lst.insert(++lst.begin(), 99);  // 中间插入 O(1)
    for (int x : lst) {
        std::cout << x << " ";  // 0 1 99 2 3 4
    }
    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 STL 容器（一）：vector、deque、list</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>容器选择：</strong></p>
      <table>
        <thead><tr><th>容器</th><th>随机访问</th><th>头部插入</th><th>中间插入</th><th>内存</th></tr></thead>
        <tbody>
          <tr><td>vector</td><td>✅ O(1)</td><td>❌ O(n)</td><td>❌ O(n)</td><td>连续</td></tr>
          <tr><td>deque</td><td>✅ O(1)</td><td>✅ O(1)</td><td>❌ O(n)</td><td>分页</td></tr>
          <tr><td>list</td><td>❌</td><td>✅ O(1)</td><td>✅ O(1)</td><td>不连续</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tips-box {
  background: #f0f7ff;
  padding: 10px;
  border-radius: 6px;
  border-left: 3px solid #0891b2;
  margin-top: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-top: 10px;
}
th, td {
  padding: 6px 8px;
  border: 1px solid #ddd;
  text-align: center;
}
th {
  background: #fff3e0;
}
</style>
