const n=`// ═══════════════════════════════════════════
// 1. 左值与右值：如何区分
// ═══════════════════════════════════════════

#include <iostream>

int main() {
    int a = 1;
    int& lref = a;                         // 左值引用绑定有名字的变量 a
    int&& rref = 2 + 3;                    // 右值引用绑定临时结果 5，并延长其生命期
    std::cout << lref << " " << rref << std::endl;   // 输出：1 5
    return 0;
}

// ═══════════════════════════════════════════
// 2. 右值引用与 std::move
// ═══════════════════════════════════════════

#include <string>
#include <utility>

int main() {
    std::string s = "hello";
    std::string t = std::move(s);          // std::move 把左值转成右值引用
    std::cout << t << std::endl;           // 输出：hello
    std::cout << s.empty() << std::endl;   // 输出：1，s 被搬空但仍是合法对象
    return 0;
}

// ═══════════════════════════════════════════
// 3. 移动构造与移动赋值：接管资源而非复制
// ═══════════════════════════════════════════

#include <cstddef>
#include <utility>

class Vec {
public:
    explicit Vec(std::size_t n) : data(new int[n]), size(n) {}
    ~Vec() { delete[] data; }
    Vec(Vec&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;              // 源对象交出指针并置空
        other.size = 0;
    }
    Vec& operator=(Vec&& other) noexcept {
        if (this != &other) {
            delete[] data;                 // 释放自身旧资源
            data = other.data;             // 接管源对象资源
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
private:
    int* data;
    std::size_t size;
};

int main() {
    Vec a(5);
    Vec b(std::move(a));                   // 移动构造：只搬指针，不复制 5 个 int
    return 0;                              // 两者析构各自释放自己那份，无重复释放
}

// ═══════════════════════════════════════════
// 4. noexcept：让容器敢用移动
// ═══════════════════════════════════════════

#include <type_traits>

class SafeVec {
public:
    SafeVec() = default;
    SafeVec(SafeVec&&) noexcept {}         // 移动构造标为 noexcept
    SafeVec(const SafeVec&) {}
};

static_assert(std::is_nothrow_move_constructible<SafeVec>::value,
              "移动构造应为 noexcept，否则 vector 扩容时会改用拷贝");   // 编译期校验

int main() {
    return 0;
}

// ═══════════════════════════════════════════
// 5. 返回值优化与完美转发
// ═══════════════════════════════════════════

#include <iostream>
#include <string>
#include <utility>

Vec makeVec(std::size_t n) {
    return Vec(n);                         // RVO：直接在调用方位置构造，省掉拷贝/移动
}

template <typename T, typename... Args>
T* make(Args&&... args) {
    return new T(std::forward<Args>(args)...);   // 完美转发：保持实参的左/右值属性
}

int main() {
    Vec v = makeVec(3);
    std::string* sp = make<std::string>("hi");   // 转发到 std::string 的构造函数
    std::cout << *sp << std::endl;               // 输出：hi
    delete sp;
    return 0;
}
`;export{n as default};
