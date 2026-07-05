<script setup lang="ts">
const cppCode = `#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource 构造" << std::endl; }
    ~Resource() { std::cout << "Resource 析构" << std::endl; }
    void use() { std::cout << "使用资源" << std::endl; }
};

int main() {
    // unique_ptr：独占所有权
    std::unique_ptr<Resource> up = std::make_unique<Resource>();
    up->use();
    // unique_ptr 不能拷贝，只能移动
    std::unique_ptr<Resource> up2 = std::move(up);  // 所有权转移
    // up 现在是 nullptr

    // shared_ptr：共享所有权
    std::shared_ptr<Resource> sp1 = std::make_shared<Resource>();
    {
        std::shared_ptr<Resource> sp2 = sp1;  // 引用计数 +1
        std::cout << "引用计数：" << sp1.use_count() << std::endl;  // 2
    }  // sp2 析构，引用计数 -1

    std::cout << "引用计数：" << sp1.use_count() << std::endl;  // 1

    // weak_ptr：弱引用（打破循环引用）
    std::weak_ptr<Resource> wp = sp1;  // 不增加引用计数
    if (auto sp3 = wp.lock()) {  // 提升为 shared_ptr
        sp3->use();
    }

    return 0;
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 智能指针：unique_ptr、shared_ptr、weak_ptr</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>智能指针选择：</strong></p>
      <ul>
        <li><code>unique_ptr</code>：独占所有权（首选，零开销）</li>
        <li><code>shared_ptr</code>：共享所有权（需要引用计数）</li>
        <li><code>weak_ptr</code>：弱引用（打破循环引用）</li>
      </ul>
      <p><strong>最佳实践：</strong></p>
      <ul>
        <li>使用 <code>make_unique</code> 和 <code>make_shared</code> 创建</li>
        <li>避免用同一个原始指针构造多个 shared_ptr</li>
        <li>不要用 <code>this</code> 构造 shared_ptr（用 <code>enable_shared_from_this</code>）</li>
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
