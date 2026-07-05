<script setup lang="ts">
const cppCode = `#include <iostream>
#include <map>
#include <unordered_map>
#include <set>

int main() {
    // map：有序键值对
    std::map<std::string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages["Charlie"] = 35;

    // 访问元素
    std::cout << "Bob: " << ages["Bob"] << std::endl;  // 30
    // 注意：operator[] 在键不存在时会插入！

    // 安全访问
    auto it = ages.find("David");
    if (it != ages.end()) {
        std::cout << "David: " << it->second << std::endl;
    }

    // 遍历（按键排序）
    for (const auto& [name, age] : ages) {
        std::cout << name << ": " << age << std::endl;
    }

    // unordered_map：无序哈希表
    std::unordered_map<std::string, int> hashAges;
    hashAges["Alice"] = 25;
    hashAges["Bob"] = 30;

    // set：有序集合
    std::set<int> nums = {5, 2, 8, 1, 2};
    for (int x : nums) {
        std::cout << x << " ";  // 1 2 5 8（自动排序，去重）
    }
    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 STL 容器（二）：map、set、unordered_map</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>容器选择：</strong></p>
      <ul>
        <li><code>map</code>：需要有序遍历或范围查询，O(log n)</li>
        <li><code>unordered_map</code>：只关心查找速度，平均 O(1)</li>
        <li><code>set</code>：有序唯一集合</li>
        <li><code>unordered_set</code>：无序唯一集合，平均 O(1)</li>
      </ul>
      <p><strong>注意：</strong></p>
      <ul>
        <li><code>operator[]</code> 在键不存在时会插入默认值</li>
        <li>如果只是读取，用 <code>at()</code> 或 <code>find()</code></li>
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
