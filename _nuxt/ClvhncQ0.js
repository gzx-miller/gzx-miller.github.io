const n=`// ═══════════════════════════════════════════
// 1. 默认拷贝：逐成员复制指针，埋下隐患
// ═══════════════════════════════════════════

#include <iostream>

class Box {
public:
    explicit Box(int v) : data(new int(v)) {}
    ~Box() { delete data; }
    int get() const { return *data; }
private:
    int* data;
};

int main() {
    Box a(1);
    Box b = a;                             // 默认拷贝构造：只复制指针 data
    std::cout << b.get() << std::endl;     // 输出：1
    return 0;
}   // a、b 析构时 delete 同一块内存 → 重复释放，未定义行为

// ═══════════════════════════════════════════
// 2. 拷贝构造函数：改成深拷贝
// ═══════════════════════════════════════════

class Box {
public:
    explicit Box(int v) : data(new int(v)) {}
    Box(const Box& other)
        : data(new int(*other.data)) {}    // 深拷贝：另分配一块内存再复制内容
    ~Box() { delete data; }
    int get() const { return *data; }
private:
    int* data;
};

int main() {
    Box a(1);
    Box b = a;                             // 走自定义拷贝构造，两个对象各自独立
    std::cout << b.get() << std::endl;     // 输出：1
    return 0;                              // 各自释放自己的内存，安全
}

// ═══════════════════════════════════════════
// 3. 拷贝赋值运算符与自赋值检查
// ═══════════════════════════════════════════

class Box {
public:
    explicit Box(int v) : data(new int(v)) {}
    Box(const Box& other) : data(new int(*other.data)) {}
    Box& operator=(const Box& other) {
        if (this == &other) return *this;  // 自赋值检查，防止先删自己再读自己
        int* fresh = new int(*other.data); // 先分配新资源，保证异常安全
        delete data;                       // 再释放旧资源
        data = fresh;
        return *this;                      // 返回自身引用，支持链式赋值
    }
    ~Box() { delete data; }
    int get() const { return *data; }
private:
    int* data;
};

int main() {
    Box a(1);
    Box b(2);
    b = a;                                 // 拷贝赋值
    b = b;                                 // 自赋值：被检查挡住，不产生悬垂
    std::cout << b.get() << std::endl;     // 输出：1
    return 0;
}

// ═══════════════════════════════════════════
// 4. =default 与 =delete：显式控制默认行为
// ═══════════════════════════════════════════

class NonCopyable {
public:
    NonCopyable() = default;                            // 要求编译器生成默认构造
    NonCopyable(const NonCopyable&) = delete;           // 禁止拷贝构造
    NonCopyable& operator=(const NonCopyable&) = delete; // 禁止拷贝赋值
};

int main() {
    NonCopyable a;
    // NonCopyable b = a;                  // 编译错误：拷贝构造已被删除
    return 0;
}

// ═══════════════════════════════════════════
// 5. Rule of Five：把移动版一并补齐
// ═══════════════════════════════════════════

#include <cstddef>
#include <cstring>
#include <utility>

class Buffer {
public:
    explicit Buffer(std::size_t n) : data(new char[n]), size(n) {}
    ~Buffer() { delete[] data; }                        // 1. 析构
    Buffer(const Buffer& other)                         // 2. 拷贝构造
        : data(new char[other.size]), size(other.size) {
        std::memcpy(data, other.data, size);
    }
    Buffer(Buffer&& other) noexcept                     // 4. 移动构造
        : data(other.data), size(other.size) {
        other.data = nullptr;                           // 源对象交出资源并置空
        other.size = 0;
    }
    Buffer& operator=(Buffer&& other) noexcept {        // 5. 移动赋值
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
private:
    char* data;
    std::size_t size;
};

int main() {
    Buffer a(4);
    Buffer b(std::move(a));                 // 移动构造：只搬指针，不复制数据
    return 0;                               // a 已置空，析构安全
}
`;export{n as default};
