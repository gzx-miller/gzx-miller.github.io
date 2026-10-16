const n=`// ═══════════════════════════════════════════
// 1. 基本 lambda 与它的唯一类型
// ═══════════════════════════════════════════

#include <iostream>                            // 标准输入输出
#include <vector>                              // 容器
#include <algorithm>                           // std::for_each
#include <functional>                          // std::function

int main() {
    auto greet = []() {                        // 编译器生成唯一的闭包类型
        std::cout << "hello" << std::endl;     // 结果：输出 hello
    };
    greet();                                   // 调用闭包对象的 operator()

    auto add = [](int a, int b) {              // 等价于一个重载了 operator() 的仿函数
        return a + b;
    };
    std::cout << add(3, 5) << std::endl;       // 结果：8
    return 0;
}

// ═══════════════════════════════════════════
// 2. 捕获列表：值捕获与引用捕获
// ═══════════════════════════════════════════

void captureDemo() {
    int factor = 2;
    auto byValue = [factor](int x) {           // 值捕获：创建时复制一份 factor
        return x * factor;                     // 说明：与外部 factor 后续变化无关
    };
    std::cout << byValue(5) << std::endl;      // 结果：10

    int total = 0;
    std::vector<int> nums = {1, 2, 3, 4};
    std::for_each(nums.begin(), nums.end(), [&total](int x) {   // 引用捕获：直接改写外部变量
        total += x;
    });
    std::cout << total << std::endl;           // 结果：10

    auto all = [=]() { return factor; };       // [=] 按值捕获用到的全部自动变量
    auto byRef = [&]() { return total; };      // [&] 按引用捕获用到的全部自动变量
    std::cout << all() + byRef() << std::endl; // 结果：12
}

// ═══════════════════════════════════════════
// 3. mutable 与返回类型推导
// ═══════════════════════════════════════════

void mutableDemo() {
    int base = 10;
    auto counter = [base]() mutable {          // 值捕获默认 const，mutable 才能改副本
        return ++base;                         // 说明：改的是副本，外部 base 仍是 10
    };
    std::cout << counter() << std::endl;       // 结果：11

    auto pick = [](bool flag) -> int {         // 多条 return 语句需显式指定返回类型
        if (flag) return 1;
        return 0;
    };
    std::cout << pick(true) << std::endl;      // 结果：1
}

// ═══════════════════════════════════════════
// 4. 泛型 lambda 与 std::function
// ═══════════════════════════════════════════

void genericDemo() {
    auto addAny = [](auto a, auto b) {         // 泛型 lambda：模板化的 operator()
        return a + b;                          // 说明：对不同参数类型分别实例化
    };
    std::cout << addAny(1, 2) << std::endl;    // 结果：3
    std::cout << addAny(1.5, 2.5) << std::endl;  // 结果：4

    std::function<int(int)> square = [](int x) {  // 类型擦除：统一成固定签名
        return x * x;
    };
    std::cout << square(4) << std::endl;       // 结果：16
}

// ═══════════════════════════════════════════
// 5. 捕获与生命周期：初始化捕获
// ═══════════════════════════════════════════

auto makeOwningCounter() {
    auto p = std::make_unique<int>(42);
    return [q = std::move(p)]() {              // 初始化捕获：把独占资源移进闭包
        return *q;                             // 说明：闭包持有所有权，析构时自动释放
    };
}

auto makeDangling() {
    int local = 7;
    return [&local]() { return local; };       // 危险：返回后 local 已随栈销毁
}                                              // 说明：调用它读取悬垂引用属未定义行为
`;export{n as default};
