import{d as e,b as o,e as c,f as a,a0 as n,o as i,I as s}from"./DutfXOOr.js";const l={class:"demo-card"},r=`// 编译期计算：constexpr、consteval、constinit
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
}`,d=e({__name:"CPP27CompileTimeComputation",setup(p){return(u,t)=>(i(),o("div",l,[t[0]||(t[0]=c("h3",null,"🌰 编译期计算",-1)),c("pre",{class:"code-block"},[c("code",null,a(r))]),t[1]||(t[1]=n('<div class="tips-box" data-v-c32c2793><p data-v-c32c2793><strong data-v-c32c2793>编译期计算特性：</strong></p><ul data-v-c32c2793><li data-v-c32c2793><code data-v-c32c2793>constexpr</code>（C++11）：可以在编译期求值</li><li data-v-c32c2793><code data-v-c32c2793>consteval</code>（C++20）：必须在编译期求值</li><li data-v-c32c2793><code data-v-c32c2793>constinit</code>（C++20）：必须在编译期初始化</li><li data-v-c32c2793>编译期计算提升运行时性能</li><li data-v-c32c2793><code data-v-c32c2793>constexpr</code> 函数可用于编译期上下文</li></ul></div>',1))]))}}),x=s(d,[["__scopeId","data-v-c32c2793"]]);export{x as default};
