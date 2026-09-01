const n=`<script setup lang="ts">
const cppCode = \`#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    // 查找
    auto it = std::find(nums.begin(), nums.end(), 8);
    if (it != nums.end()) {
        std::cout << "找到 8，位置：" << (it - nums.begin()) << std::endl;
    }

    // 计数
    int count = std::count(nums.begin(), nums.end(), 8);
    std::cout << "8 出现 " << count << " 次" << std::endl;

    // 排序
    std::sort(nums.begin(), nums.end());
    std::cout << "排序后：";
    for (int x : nums) std::cout << x << " ";
    std::cout << std::endl;

    // 累加
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "总和：" << sum << std::endl;

    // 变换
    std::vector<int> doubled(nums.size());
    std::transform(nums.begin(), nums.end(), doubled.begin(),
                   [](int x) { return x * 2; });
    std::cout << "翻倍后：";
    for (int x : doubled) std::cout << x << " ";
    std::cout << std::endl;

    return 0;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 STL 迭代器与算法</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>常用算法：</strong></p>
      <ul>
        <li><code>find</code>：查找元素</li>
        <li><code>count</code>：计数</li>
        <li><code>sort</code>：排序</li>
        <li><code>accumulate</code>：累加（在 &lt;numeric&gt; 中）</li>
        <li><code>transform</code>：变换</li>
        <li><code>copy</code>：复制</li>
      </ul>
      <p><strong>迭代器类别：</strong></p>
      <ul>
        <li>输入/输出迭代器：只读/只写</li>
        <li>前向迭代器：读写，单向</li>
        <li>双向迭代器：读写，双向（list、map）</li>
        <li>随机访问迭代器：读写，任意跳转（vector、deque）</li>
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
