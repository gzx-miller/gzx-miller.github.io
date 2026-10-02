import{d,b as o,e,f as a,a0 as c,o as s,F as n}from"./CfJSWYGO.js";const r={class:"demo-card"},i=`// C++11/14/17 核心特性
#include <iostream>
#include <vector>
#include <map>

int main() {
    // auto 类型推导
    auto x = 42;                           // int
    auto name = "栗子";                   // const char*
    auto iter = vec.begin();                // std::vector<int>::iterator

    // 范围 for
    std::vector<int> vec = {1, 2, 3, 4, 5};
    for (auto& elem : vec) {
        elem *= 2;
    }

    // 统一初始化
    std::vector<int> nums{1, 2, 3, 4, 5};
    std::map<std::string, int> ages{{"Alice", 25}, {"Bob", 30}};

    // nullptr
    int* ptr = nullptr;  // 替代 NULL

    // 类型别名（using）
    using IntVec = std::vector<int>;
    IntVec numbers = {1, 2, 3};

    // C++17 结构化绑定
    std::map<std::string, int> scores{{"Alice", 95}, {"Bob", 87}};
    for (const auto& [name, score] : scores) {
        std::cout << name << ": " << score << std::endl;
    }

    return 0;
}`,l=d({__name:"CPP26ModernCppCore",setup(p){return(u,t)=>(s(),o("div",r,[t[0]||(t[0]=e("h3",null,"🌰 现代 C++ 核心特性",-1)),e("pre",{class:"code-block"},[e("code",null,a(i))]),t[1]||(t[1]=c('<div class="tips-box" data-v-94bd994c><p data-v-94bd994c><strong data-v-94bd994c>现代 C++ 特性：</strong></p><ul data-v-94bd994c><li data-v-94bd994c><code data-v-94bd994c>auto</code> 简化类型声明，编译器自动推导</li><li data-v-94bd994c><code data-v-94bd994c>范围 for</code> 安全简洁地遍历容器</li><li data-v-94bd994c><code data-v-94bd994c>统一初始化 {}</code> 防止窄化转换</li><li data-v-94bd994c><code data-v-94bd994c>nullptr</code> 类型安全的空指针</li><li data-v-94bd994c><code data-v-94bd994c>结构化绑定</code>（C++17）解构元组、pair</li></ul></div>',1))]))}}),b=n(l,[["__scopeId","data-v-94bd994c"]]);export{b as default};
