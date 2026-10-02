import{d,b as o,e,f as a,a0 as n,o as i,F as c}from"./CfJSWYGO.js";const s={class:"demo-card"},l=`// 编译期计算：constexpr、consteval、constinit
#include <iostream>

// constexpr 函数：编译期或运行期求值
constexpr int square(int x) {
    return x * x;
}

// C++14：constexpr 函数可以包含循环和条件
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; ++i) {
        result *= i;
    }
    return result;
}

// consteval 函数（C++20）：必须在编译期求值
consteval int compileTimeOnly(int x) {
    return x * 2;
}

// 编译期计算的查找表
constexpr int lookupTable(int index) {
    constexpr int table[] = {1, 4, 9, 16, 25};
    return table[index];
}

int main() {
    // 编译期计算
    constexpr int val = square(5);        // 编译期
    int arr[lookupTable(2)];             // 编译期确定数组大小
    static int x = factorial(10);         // 编译期计算

    // constinit（C++20）：必须在编译期初始化
    constinit static int y = 42;

    std::cout << "square(5) = " << val << std::endl;
    std::cout << "factorial(10) = " << factorial(10) << std::endl;
    std::cout << "compileTimeOnly(21) = " << compileTimeOnly(21) << std::endl;

    return 0;
}`,r=d({__name:"CPP27CompileTimeComputation",setup(f){return(p,t)=>(i(),o("div",s,[t[0]||(t[0]=e("h3",null,"🌰 编译期计算",-1)),e("pre",{class:"code-block"},[e("code",null,a(l))]),t[1]||(t[1]=n('<div class="tips-box" data-v-7dfcfdb2><p data-v-7dfcfdb2><strong data-v-7dfcfdb2>编译期计算特性：</strong></p><ul data-v-7dfcfdb2><li data-v-7dfcfdb2><code data-v-7dfcfdb2>constexpr</code>（C++11）：可以在编译期求值</li><li data-v-7dfcfdb2><code data-v-7dfcfdb2>consteval</code>（C++20）：必须在编译期求值</li><li data-v-7dfcfdb2><code data-v-7dfcfdb2>constinit</code>（C++20）：必须在编译期初始化</li><li data-v-7dfcfdb2>编译期计算提升运行时性能</li><li data-v-7dfcfdb2><code data-v-7dfcfdb2>constexpr</code> 函数可用于编译期上下文</li></ul></div>',1))]))}}),v=c(r,[["__scopeId","data-v-7dfcfdb2"]]);export{v as default};
