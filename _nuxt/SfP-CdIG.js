import{d,b as o,e as a,f as c,a0 as e,o as l,I as s}from"./DutfXOOr.js";const f={class:"demo-card"},n=`#include <iostream>
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
}`,i=d({__name:"CPP19LambdaExpressions",setup(r){return(b,t)=>(l(),o("div",f,[t[0]||(t[0]=a("h3",null,"🌰 Lambda 表达式：匿名函数与捕获",-1)),a("pre",{class:"code-block"},[a("code",null,c(n))]),t[1]||(t[1]=e('<div class="tips-box" data-v-c5f637bf><p data-v-c5f637bf><strong data-v-c5f637bf>捕获列表：</strong></p><ul data-v-c5f637bf><li data-v-c5f637bf><code data-v-c5f637bf>[]</code>：不捕获任何变量</li><li data-v-c5f637bf><code data-v-c5f637bf>[x]</code>：值捕获 x</li><li data-v-c5f637bf><code data-v-c5f637bf>[&amp;x]</code>：引用捕获 x</li><li data-v-c5f637bf><code data-v-c5f637bf>[=]</code>：值捕获所有变量</li><li data-v-c5f637bf><code data-v-c5f637bf>[&amp;]</code>：引用捕获所有变量</li><li data-v-c5f637bf><code data-v-c5f637bf>[this]</code>：捕获 this 指针</li></ul><p data-v-c5f637bf><strong data-v-c5f637bf>注意：</strong></p><ul data-v-c5f637bf><li data-v-c5f637bf>值捕获的变量默认是 const 的，需要修改时用 <code data-v-c5f637bf>mutable</code></li><li data-v-c5f637bf>引用捕获要确保被捕获的变量生命周期长于 lambda</li></ul></div>',1))]))}}),v=s(i,[["__scopeId","data-v-c5f637bf"]]);export{v as default};
