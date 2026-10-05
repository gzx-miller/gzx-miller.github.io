const n=`#include <iostream>
#include <memory>

int main() {
    // unique_ptr：独占所有权
    std::unique_ptr<int> up = std::make_unique<int>(42);

    // shared_ptr：共享所有权
    std::shared_ptr<int> sp1 = std::make_shared<int>(100);
    {
        std::shared_ptr<int> sp2 = sp1;  // 引用计数 +1
    }  // sp2 析构，引用计数 -1

    // weak_ptr：弱引用
    std::weak_ptr<int> wp = sp1;  // 不增加引用计数
    if (auto sp3 = wp.lock()) {  // 提升为 shared_ptr
        std::cout << *sp3 << std::endl;
    }

    return 0;
}`;export{n as default};
