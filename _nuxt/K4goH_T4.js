import{d as a,b as c,e as d,f as e,a0 as r,o as s,I as n}from"./DutfXOOr.js";const o={class:"demo-card"},l=`#include <iostream>

int main() {
    int x = 42;

    // 指针
    int* p = &x;  // p 指向 x
    std::cout << *p << std::endl;  // 42（解引用）
    *p = 100;  // 通过指针修改 x
    std::cout << x << std::endl;  // 100

    // 指针算术
    int arr[] = {10, 20, 30};
    int* q = arr;  // 等价于 &arr[0]
    std::cout << *q << std::endl;  // 10
    std::cout << *(q + 1) << std::endl;  // 20（指针算术）

    // 引用
    int y = 5;
    int& r = y;  // r 是 y 的别名
    r = 10;  // 修改 y
    std::cout << y << std::endl;  // 10

    // nullptr（C++11）
    int* np = nullptr;  // 空指针
    if (np != nullptr) {
        std::cout << *np << std::endl;
    }

    // 引用 vs 指针
    // 引用：必须初始化，不能重新绑定，没有空引用
    // 指针：可以为 nullptr，可以重新指向其他对象

    return 0;
}`,v=a({__name:"CPP07PointersReferences",setup(p){return(i,t)=>(s(),c("div",o,[t[0]||(t[0]=d("h3",null,"🌰 指针与引用：地址、解引用与别名",-1)),d("pre",{class:"code-block"},[d("code",null,e(l))]),t[1]||(t[1]=r('<div class="tips-box" data-v-781a9c3d><p data-v-781a9c3d><strong data-v-781a9c3d>指针 vs 引用：</strong></p><table data-v-781a9c3d><thead data-v-781a9c3d><tr data-v-781a9c3d><th data-v-781a9c3d>特性</th><th data-v-781a9c3d>指针</th><th data-v-781a9c3d>引用</th></tr></thead><tbody data-v-781a9c3d><tr data-v-781a9c3d><td data-v-781a9c3d>初始化</td><td data-v-781a9c3d>可以不初始化</td><td data-v-781a9c3d>必须初始化</td></tr><tr data-v-781a9c3d><td data-v-781a9c3d>空值</td><td data-v-781a9c3d>可以为 nullptr</td><td data-v-781a9c3d>不能有空引用</td></tr><tr data-v-781a9c3d><td data-v-781a9c3d>重新绑定</td><td data-v-781a9c3d>可以指向其他对象</td><td data-v-781a9c3d>不能重新绑定</td></tr><tr data-v-781a9c3d><td data-v-781a9c3d>使用</td><td data-v-781a9c3d>需要解引用 *p</td><td data-v-781a9c3d>直接使用（像变量）</td></tr></tbody></table></div>',1))]))}}),_=n(v,[["__scopeId","data-v-781a9c3d"]]);export{_ as default};
