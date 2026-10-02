import{d as e,b as a,e as d,f as o,a0 as n,o as s,F as l}from"./CfJSWYGO.js";const i={class:"demo-card"},r=`#include <iostream>

int main() {
    // 动态分配单个 int
    int* p = new int(42);  // 分配并初始化
    std::cout << *p << std::endl;  // 42
    delete p;  // 释放内存
    p = nullptr;  // 避免悬垂指针

    // 动态分配数组
    int* arr = new int[5]{1, 2, 3, 4, 5};
    for (int i = 0; i < 5; i++) {
        std::cout << arr[i] << " ";
    }
    delete[] arr;  // 注意：delete[] 而非 delete

    // 常见错误
    // int* p2 = new int(10);
    // delete p2;
    // std::cout << *p2 << std::endl;  // 悬垂指针，未定义行为！
    // delete p2;  // 双重释放，未定义行为！

    return 0;
}`,c=e({__name:"CPP08DynamicMemory",setup(p){return(v,t)=>(s(),a("div",i,[t[0]||(t[0]=d("h3",null,"🌰 动态内存管理：new/delete 与常见陷阱",-1)),d("pre",{class:"code-block"},[d("code",null,o(r))]),t[1]||(t[1]=n('<div class="tips-box" data-v-d0952896><p data-v-d0952896><strong data-v-d0952896>常见陷阱：</strong></p><ul data-v-d0952896><li data-v-d0952896><strong data-v-d0952896>内存泄漏</strong>：分配后忘记释放</li><li data-v-d0952896><strong data-v-d0952896>悬垂指针</strong>：释放后继续使用</li><li data-v-d0952896><strong data-v-d0952896>双重释放</strong>：同一指针释放两次</li><li data-v-d0952896><strong data-v-d0952896>不匹配</strong>：new/delete[] 混用</li></ul><p data-v-d0952896><strong data-v-d0952896>现代 C++ 建议：</strong></p><ul data-v-d0952896><li data-v-d0952896>优先使用 <code data-v-d0952896>std::unique_ptr</code> 或 <code data-v-d0952896>std::shared_ptr</code></li><li data-v-d0952896>优先使用 <code data-v-d0952896>std::vector</code> 而非动态数组</li><li data-v-d0952896>几乎不要使用裸 <code data-v-d0952896>new/delete</code></li></ul></div>',1))]))}}),g=l(c,[["__scopeId","data-v-d0952896"]]);export{g as default};
