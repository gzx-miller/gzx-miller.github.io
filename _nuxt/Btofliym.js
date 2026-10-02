import{d as e,b as d,e as t,f as o,a0 as l,o as s,F as n}from"./CfJSWYGO.js";const i={class:"demo-card"},c=`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // 基本 lambda
    auto print = []() {
        std::cout << "Hello from lambda!" << std::endl;
    };
    print();

    // 带参数的 lambda
    auto add = [](int a, int b) {
        return a + b;
    };
    std::cout << "3 + 5 = " << add(3, 5) << std::endl;

    // 值捕获
    int factor = 2;
    auto multiply = [factor](int x) {
        return x * factor;
    };
    std::cout << "5 * 2 = " << multiply(5) << std::endl;

    // 引用捕获
    int total = 0;
    std::for_each(nums.begin(), nums.end(), [&total](int x) {
        total += x;
    });
    std::cout << "总和：" << total << std::endl;

    // 泛型 lambda（C++14）
    auto generic = [](auto a, auto b) {
        return a + b;
    };
    std::cout << generic(1, 2) << std::endl;
    std::cout << generic(1.5, 2.5) << std::endl;

    return 0;
}`,r=e({__name:"CPP19LambdaExpressions",setup(b){return(u,a)=>(s(),d("div",i,[a[0]||(a[0]=t("h3",null,"🌰 Lambda 表达式：匿名函数与捕获",-1)),t("pre",{class:"code-block"},[t("code",null,o(c))]),a[1]||(a[1]=l('<div class="tips-box" data-v-99fe5b4a><p data-v-99fe5b4a><strong data-v-99fe5b4a>捕获列表：</strong></p><ul data-v-99fe5b4a><li data-v-99fe5b4a><code data-v-99fe5b4a>[]</code>：不捕获任何变量</li><li data-v-99fe5b4a><code data-v-99fe5b4a>[x]</code>：值捕获 x</li><li data-v-99fe5b4a><code data-v-99fe5b4a>[&amp;x]</code>：引用捕获 x</li><li data-v-99fe5b4a><code data-v-99fe5b4a>[=]</code>：值捕获所有变量</li><li data-v-99fe5b4a><code data-v-99fe5b4a>[&amp;]</code>：引用捕获所有变量</li><li data-v-99fe5b4a><code data-v-99fe5b4a>[this]</code>：捕获 this 指针</li></ul><p data-v-99fe5b4a><strong data-v-99fe5b4a>注意：</strong></p><ul data-v-99fe5b4a><li data-v-99fe5b4a>值捕获的变量默认是 const 的，需要修改时用 <code data-v-99fe5b4a>mutable</code></li><li data-v-99fe5b4a>引用捕获要确保被捕获的变量生命周期长于 lambda</li></ul></div>',1))]))}}),v=n(r,[["__scopeId","data-v-99fe5b4a"]]);export{v as default};
