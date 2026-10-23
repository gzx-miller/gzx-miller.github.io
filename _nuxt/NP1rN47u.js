const n=`// ═══════════════════════════════════════════
// 1. auto 与 decltype 的推导规则
// ═══════════════════════════════════════════

#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <type_traits>                         // std::is_same_v

void deduceDemo() {
    int n = 0;
    const int& cr = n;
    auto a = cr;                               // auto 丢弃顶层 const 与引用 → int
    auto& b = cr;                              // 保留引用 → const int&
    decltype(cr) c = n;                        // decltype 保留引用与 const → const int&
    static_assert(std::is_same_v<decltype(a), int>);            // 说明：a 是值类型 int
    static_assert(std::is_same_v<decltype(c), const int&>);     // 说明：c 是 const int&
    std::cout << a + b + c << std::endl;       // 结果：0
}

// ═══════════════════════════════════════════
// 2. 范围 for 与结构化绑定
// ═══════════════════════════════════════════

void rangeDemo() {
    std::vector<int> nums = {1, 2, 3};
    for (auto& x : nums) {                     // 范围 for：底层用 begin/end 迭代
        x *= 2;                                // 引用遍历：就地修改元素
    }
    for (const auto& x : nums) {
        std::cout << x << " ";                 // 结果：2 4 6
    }
    std::cout << std::endl;

    std::map<std::string, int> ages = {{"Alice", 25}, {"Bob", 30}};
    for (const auto& [name, score] : ages) {   // 结构化绑定：解构 key-value
        std::cout << name << "=" << score << " ";   // 结果：Alice=25 Bob=30
    }
    std::cout << std::endl;
}

// ═══════════════════════════════════════════
// 3. nullptr、using 与 enum class
// ═══════════════════════════════════════════

using IntVec = std::vector<int>;               // using 别名，比 typedef 更清晰

enum class Color { Red, Green, Blue };         // 强类型枚举：有作用域、不隐式转 int

void typedDemo() {
    int* ptr = nullptr;                        // 类型安全的空指针，类型为 std::nullptr_t
    IntVec v = {1, 2, 3};                      // 别名可直接使用
    Color c = Color::Red;                      // 必须写 Color:: 前缀，避免作用域污染
    int code = static_cast<int>(c);            // 说明：需显式转换才能得到整数值
    std::cout << v.size() << " " << code << std::endl;   // 结果：3 0
}

// ═══════════════════════════════════════════
// 4. 统一初始化、initializer_list 与 constexpr
// ═══════════════════════════════════════════

constexpr int square(int x) { return x * x; }  // 可在编译期求值的函数

struct Point { int x; int y; };                // 聚合类型

void initDemo() {
    // int bad{3.14};                          // 编译错误：花括号初始化禁止窄化转换
    std::vector<int> a(10, 20);                // 结果：10 个元素，每个值 20
    std::vector<int> b{10, 20};                // 结果：2 个元素 10 和 20
    Point p{1, 2};                             // 聚合初始化
    constexpr int area = square(4);            // 结果：编译期算出 16
    int buf[area];                             // 说明：constexpr 结果可作数组长度
    std::cout << a.size() << " " << b.size() << " " << p.x << " " << area << std::endl;
    // 结果：10 2 1 16
}
`;export{n as default};
