import{d,b as o,e as a,f as e,a0 as i,o as b,F as c}from"./CfJSWYGO.js";const s={class:"demo-card"},l=`// C++20 模块（示例，需要支持模块的编译器）
// 模块接口文件（.cppm 或 .ixx）

// === math.cppm ===
export module math;  // 声明模块

export int add(int a, int b) {
    return a + b;
}

export int multiply(int a, int b) {
    return a * b;
}

export namespace math_ops {
    double divide(double a, double b) {
        return a / b;
    }
}

// === main.cpp ===
import math;  // 导入模块
import std.io;  // 导入标准库模块（C++23）

int main() {
    int sum = add(10, 20);
    int product = multiply(5, 4);
    double quotient = math_ops::divide(10.0, 3.0);

    std::cout << "sum = " << sum << std::endl;
    std::cout << "product = " << product << std::endl;
    std::cout << "quotient = " << quotient << std::endl;

    return 0;
}

// 与传统头文件的对比：
// - 更快的编译速度（模块只解析一次）
// - 更好的封装（宏不会泄漏）
// - 明确的导出声明`,n=d({__name:"CPP28Modules",setup(p){return(r,t)=>(b(),o("div",s,[t[0]||(t[0]=a("h3",null,"🌰 C++20 模块",-1)),a("pre",{class:"code-block"},[a("code",null,e(l))]),t[1]||(t[1]=i('<div class="tips-box" data-v-2b7bc0ad><p data-v-2b7bc0ad><strong data-v-2b7bc0ad>模块的优势：</strong></p><ul data-v-2b7bc0ad><li data-v-2b7bc0ad>更快的编译速度（避免重复解析）</li><li data-v-2b7bc0ad>更好的封装（宏不会泄漏到模块使用者）</li><li data-v-2b7bc0ad>明确的导出声明（<code data-v-2b7bc0ad>export</code>）</li><li data-v-2b7bc0ad>隔离的实现细节（未导出的声明不可见）</li></ul><p data-v-2b7bc0ad><strong data-v-2b7bc0ad>当前状态：</strong></p><ul data-v-2b7bc0ad><li data-v-2b7bc0ad>MSVC 支持较好</li><li data-v-2b7bc0ad>GCC 和 Clang 正在实现中</li><li data-v-2b7bc0ad>标准库模块（<code data-v-2b7bc0ad>import std;</code>）在 C++23</li></ul></div>',1))]))}}),m=c(n,[["__scopeId","data-v-2b7bc0ad"]]);export{m as default};
