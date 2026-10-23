const n=`// ═══════════════════════════════════════════
// 1. 函数模板：由实参推导类型
// ═══════════════════════════════════════════

#include <iostream>
#include <string>

template <typename T>
T maxValue(T a, T b) {          // T 由调用实参推导，用一次生成一份实体
    return a > b ? a : b;
}

// maxValue(3, 7);          // T = int，实例化 maxValue<int>
// maxValue(2.5, 1.5);      // T = double，实例化 maxValue<double>
// maxValue(3, 7.0);        // 推导失败：T 同时为 int 与 double → 需 maxValue<double>(3, 7.0)

// ═══════════════════════════════════════════
// 2. 类模板：使用时显式指定类型
// ═══════════════════════════════════════════

template <typename T>
class Box {
    T item_;
public:
    explicit Box(const T& item) : item_(item) {}
    const T& get() const { return item_; }
};

// Box<int> bi(42);         // 类模板参数靠显式写出，不从构造参数推导
// Box<std::string> bs("hi");

// ═══════════════════════════════════════════
// 3. 全特化：为特定类型换一套实现
// ═══════════════════════════════════════════

template <>
class Box<bool> {               // 全特化：所有参数都指定
public:
    explicit Box(bool v) : flag_(v) {}
    const char* get() const { return flag_ ? "true" : "false"; }
private:
    bool flag_;
};

// ═══════════════════════════════════════════
// 4. 类模板偏特化：只固定部分参数
// ═══════════════════════════════════════════

template <typename T, typename U>
class Pair {                    // 主模板
public:
    Pair(T a, U b) : first(a), second(b) {}
    T first; U second;
};

template <typename U>
class Pair<int, U> {            // 偏特化：只把第一个参数固定为 int
public:
    Pair(int a, U b) : first(a), second(b) {}
    int first; U second;
    int firstAsInt() const { return first; }
};

// 函数模板没有偏特化，只能用重载替代

// ═══════════════════════════════════════════
// 5. 非类型模板参数与默认模板参数
// ═══════════════════════════════════════════

template <typename T, int N>    // N 是非类型参数，必须是编译期常量
class FixedArray {
    T data_[N];
public:
    int size() const { return N; }   // 大小在编译期已确定
};

template <typename T = int>     // 默认模板参数
class Stack {
public:
    T top_;                     // Stack<> 等价于 Stack<int>
};

// ═══════════════════════════════════════════
// 6. 可变参数模板概览与实例化代价
// ═══════════════════════════════════════════

template <typename... Args>     // 可变参数模板，接受任意个数、任意类型
int countArgs(Args... args) {   // C++11 起
    return sizeof...(args);     // sizeof... 返回参数包中的参数个数
}

int main() {
    std::cout << maxValue(3, 7) << std::endl;                 // 7
    std::cout << maxValue(std::string("a"), std::string("b")) << std::endl;  // b

    Box<bool> flag(true);
    std::cout << flag.get() << std::endl;                    // true

    std::cout << countArgs(1, 2, 3) << std::endl;            // 3
    // 每用一种类型就生成一份代码，滥用会导致代码膨胀、编译变慢
    return 0;
}
`;export{n as default};
