const n=`// ═══════════════════════════════════════════
// 1. 参数传递：值 / 引用 / const 引用
// ═══════════════════════════════════════════

#include <iostream>
#include <string>

void byValue(int x) {                       // 按值：操作的是副本
    x = 100;                                // 结果：不影响调用方的原变量
}

void byReference(int& x) {                  // 按引用：形参是实参的别名
    x = 100;                                // 结果：原变量被改成 100
}

void print(const std::string& s) {          // 按 const 引用：不拷贝、且不可修改
    std::cout << s << std::endl;            // 结果：输出传入的字符串
}

int main() {
    int a = 5;
    byValue(a);
    std::cout << a << std::endl;            // 结果：5，未被修改

    int b = 5;
    byReference(b);
    std::cout << b << std::endl;            // 结果：100，已被修改
    return 0;
}

// ═══════════════════════════════════════════
// 2. 默认实参与返回值
// ═══════════════════════════════════════════

std::string greet(const std::string& name = "同学") {   // 默认实参从右往左连续给
    return "你好，" + name;                  // 返回值拷贝给调用方
}

int main() {
    std::cout << greet() << std::endl;       // 结果：你好，同学
    std::cout << greet("小松鼠") << std::endl; // 结果：你好，小松鼠
    return 0;
}

// ═══════════════════════════════════════════
// 3. 函数重载与重载决议
// ═══════════════════════════════════════════

int add(int a, int b) {                      // 整型版本
    return a + b;
}

double add(double a, double b) {             // 浮点版本，仅靠参数列表区分
    return a + b;
}

int main() {
    std::cout << add(1, 2) << std::endl;         // 结果：3，命中 int 版
    std::cout << add(1.5, 2.5) << std::endl;     // 结果：4，命中 double 版
    return 0;
}

// ═══════════════════════════════════════════
// 4. 递归与调用栈
// ═══════════════════════════════════════════

int factorial(int n) {
    if (n <= 1) return 1;                    // 递归基：终止条件
    return n * factorial(n - 1);             // 每次规模减 1，朝递归基收敛
}

int main() {
    std::cout << factorial(5) << std::endl;  // 结果：120，5*4*3*2*1
    return 0;
}

// ═══════════════════════════════════════════
// 5. inline 与函数指针
// ═══════════════════════════════════════════

inline int maxOf(int a, int b) {             // 建议就地展开，省去调用开销
    return a > b ? a : b;
}

int main() {
    int (*fp)(int, int) = &maxOf;            // 函数指针：指向一个 int(int,int) 函数
    std::cout << fp(3, 7) << std::endl;      // 结果：7，等价于 maxOf(3, 7)
    return 0;
}
`;export{n as default};
