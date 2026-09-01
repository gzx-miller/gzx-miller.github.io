import{d,b as a,e as t,f as c,a0 as o,o as n,I as s}from"./DutfXOOr.js";const l={class:"demo-card"},i=`#include <iostream>

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
}`,r=d({__name:"CPP08DynamicMemory",setup(p){return(v,e)=>(n(),a("div",l,[e[0]||(e[0]=t("h3",null,"🌰 动态内存管理：new/delete 与常见陷阱",-1)),t("pre",{class:"code-block"},[t("code",null,c(i))]),e[1]||(e[1]=o('<div class="tips-box" data-v-11491dce><p data-v-11491dce><strong data-v-11491dce>常见陷阱：</strong></p><ul data-v-11491dce><li data-v-11491dce><strong data-v-11491dce>内存泄漏</strong>：分配后忘记释放</li><li data-v-11491dce><strong data-v-11491dce>悬垂指针</strong>：释放后继续使用</li><li data-v-11491dce><strong data-v-11491dce>双重释放</strong>：同一指针释放两次</li><li data-v-11491dce><strong data-v-11491dce>不匹配</strong>：new/delete[] 混用</li></ul><p data-v-11491dce><strong data-v-11491dce>现代 C++ 建议：</strong></p><ul data-v-11491dce><li data-v-11491dce>优先使用 <code data-v-11491dce>std::unique_ptr</code> 或 <code data-v-11491dce>std::shared_ptr</code></li><li data-v-11491dce>优先使用 <code data-v-11491dce>std::vector</code> 而非动态数组</li><li data-v-11491dce>几乎不要使用裸 <code data-v-11491dce>new/delete</code></li></ul></div>',1))]))}}),g=s(r,[["__scopeId","data-v-11491dce"]]);export{g as default};
