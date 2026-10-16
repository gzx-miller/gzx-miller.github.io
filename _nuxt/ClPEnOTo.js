const e=`// ═══════════════════════════════════════════
// 1. RAII：把释放交给析构函数
// ═══════════════════════════════════════════

#include <iostream>
#include <memory>
#include <cstdio>                              // std::fopen / std::fclose

class Resource {                               // 被托管的资源
public:
    Resource() { std::cout << "acquire" << std::endl; }   // 构造函数获取资源
    ~Resource() { std::cout << "release" << std::endl; }  // 析构函数释放资源
    void use() { std::cout << "use" << std::endl; }       // 结果：输出 use
};

// ═══════════════════════════════════════════
// 2. unique_ptr：独占所有权与 std::move
// ═══════════════════════════════════════════

void uniqueDemo() {
    std::unique_ptr<Resource> up = std::make_unique<Resource>();   // 结果：acquire
    up->use();                                 // 使用资源
    // std::unique_ptr<Resource> copy = up;    // 编译错误：unique_ptr 不可拷贝
    std::unique_ptr<Resource> moved = std::move(up);   // 只能移动，转移所有权
    std::cout << (up == nullptr) << std::endl;         // 结果：1，源指针已置空
    std::cout << (moved != nullptr) << std::endl;      // 结果：1
}                                              // 离开作用域，moved 析构：输出 release

// ═══════════════════════════════════════════
// 3. shared_ptr：引用计数与管理
// ═══════════════════════════════════════════

void sharedDemo() {
    std::shared_ptr<Resource> sp1 = std::make_shared<Resource>();  // 对象与控制块一次分配
    std::cout << sp1.use_count() << std::endl;  // 结果：1
    {
        std::shared_ptr<Resource> sp2 = sp1;    // 拷贝：引用计数递增
        std::cout << sp1.use_count() << std::endl;  // 结果：2
    }                                           // sp2 析构：计数递减
    std::cout << sp1.use_count() << std::endl;  // 结果：1
}                                               // sp1 析构，计数归零：输出 release

// ═══════════════════════════════════════════
// 4. weak_ptr：打破循环引用
// ═══════════════════════════════════════════

class Node {
public:
    std::shared_ptr<Node> next;                // 强引用：拥有下一个节点
    std::weak_ptr<Node> prev;                  // 弱引用：只观察，不增加计数
};

void weakDemo() {
    auto a = std::make_shared<Node>();
    auto b = std::make_shared<Node>();
    a->next = b;                               // 计数 +1
    b->prev = a;                               // 说明：若此处是 shared_ptr 则形成循环，永不释放
    if (auto locked = b->prev.lock()) {        // 提升为 shared_ptr，失败则为空
        std::cout << locked->use_count() << std::endl;  // 结果：2
    }
}

// ═══════════════════════════════════════════
// 5. 自定义删除器：管理非内存资源
// ═══════════════════════════════════════════

struct FileCloser {
    void operator()(std::FILE* fp) const {
        if (fp) std::fclose(fp);               // 自定义释放逻辑
    }
};

void deleterDemo() {
    std::unique_ptr<std::FILE, FileCloser> fp(std::fopen("data.txt", "r"));
    // unique_ptr<T, Deleter>：删除器是类型的一部分，与默认删除器不是同一类型
    std::shared_ptr<Resource> sp(new Resource(), [](Resource* p) { delete p; });
}                                              // fp 析构：调用 FileCloser 关闭文件
`;export{e as default};
