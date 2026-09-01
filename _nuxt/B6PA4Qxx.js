const n=`<script setup lang="ts">
const cppCode = \`// C++ 编码规范与工程最佳实践
// 遵循 C++ Core Guidelines

#include <iostream>
#include <memory>
#include <vector>
#include <string>

// 1. 使用 RAII 和智能指针管理资源
class Resource {
    std::unique_ptr<int[]> data;
public:
    Resource(size_t size) : data(std::make_unique<int[]>(size)) {}
    // 不需要显式析构函数！unique_ptr 自动管理
};

// 2. 优先使用标准库
void process(const std::vector<int>& nums) {
    // 使用算法而非手写循环
    auto sum = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "Sum: " << sum << std::endl;
}

// 3. 使用 const 正确
class Widget {
    int value;
public:
    int getValue() const { return value; }  // const 成员函数
};

// 4. 避免使用宏
// 用 constexpr、enum、template 替代
constexpr int MAX_SIZE = 1024;
constexpr auto getDefaultValue() { return 42; }

// 5. 理解对象生命周期和所有权
void ownershipExample() {
    auto ptr = std::make_unique<Widget>();  // 独占所有权
    std::vector<std::unique_ptr<Widget>> widgets;
    widgets.push_back(std::move(ptr));  // 转移所有权
}

int main() {
    // 使用 {} 初始化（防止窄化转换）
    std::vector<int> nums{1, 2, 3, 4, 5};

    // 使用 auto 简化类型声明
    auto it = nums.begin();

    // 使用范围 for
    for (const auto& num : nums) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}

/*
构建与工具链：
- 构建系统：CMake（现代 C++ 事实标准）
- 包管理：vcpkg、Conan
- 测试：Google Test、Catch2
- 静态分析：clang-tidy、Cppcheck
- Sanitizers：AddressSanitizer、UndefinedBehaviorSanitizer
- CI：GitHub Actions、GitLab CI
*/\`
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 C++ 编码规范与工程最佳实践</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>C++ Core Guidelines 核心建议：</strong></p>
      <ul>
        <li>R.1：使用 RAII 管理资源</li>
        <li>F.15：按 const 引用传递，按值返回</li>
        <li>C.21：如果定义了析构函数，也要定义拷贝/移动操作</li>
        <li>ES.47：避免使用宏</li>
        <li>P.1：用表达式表达意图，用语句表达动作</li>
      </ul>
      <p><strong>工程实践：</strong></p>
      <ul>
        <li>使用构建系统（CMake）</li>
        <li>使用包管理器（vcpkg/Conan）</li>
        <li>使用静态分析和 sanitizers</li>
        <li>建立 CI/CD 流程</li>
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
