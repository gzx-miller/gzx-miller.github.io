import{d as a,b as n,e,f as d,a0 as o,o as s,I as i}from"./DutfXOOr.js";const c={class:"demo-card"},l=`#include <iostream>
#include <string>

// 按值传递（复制）
void byValue(int x) {
    x = 100;  // 修改的是副本
}

// 按引用传递（可以修改原值）
void byReference(int& x) {
    x = 100;  // 修改原值
}

// 按 const 引用传递（避免复制，不能修改）
void print(const std::string& s) {
    std::cout << s;  // 不能修改 s
}

// 按指针传递
void byPointer(int* p) {
    if (p != nullptr) {
        *p = 100;
    }
}

// 函数重载
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }

// 递归函数
int factorial(int n) {
    if (n <= 1) return 1;  // 递归基
    return n * factorial(n - 1);
}

int main() {
    int x = 5;
    byValue(x);
    std::cout << x << std::endl;  // 5（未修改）

    byReference(x);
    std::cout << x << std::endl;  // 100（已修改）

    int y = 5;
    byPointer(&y);
    std::cout << y << std::endl;  // 100

    std::cout << add(1, 2) << std::endl;   // 3
    std::cout << add(1.5, 2.5) << std::endl;  // 4.0

    std::cout << factorial(5) << std::endl;  // 120
    return 0;
}`,r=a({__name:"CPP05Functions",setup(b){return(u,t)=>(s(),n("div",c,[t[0]||(t[0]=e("h3",null,"🌰 函数：参数传递、重载与递归",-1)),e("pre",{class:"code-block"},[e("code",null,d(l))]),t[1]||(t[1]=o('<div class="tips-box" data-v-fe89cb03><p data-v-fe89cb03><strong data-v-fe89cb03>参数传递选择：</strong></p><ul data-v-fe89cb03><li data-v-fe89cb03><strong data-v-fe89cb03>按值</strong>：小对象（int、double），不需要修改原值</li><li data-v-fe89cb03><strong data-v-fe89cb03>按 const 引用</strong>：大对象，只读（推荐默认使用）</li><li data-v-fe89cb03><strong data-v-fe89cb03>按引用</strong>：需要修改原值</li><li data-v-fe89cb03><strong data-v-fe89cb03>按指针</strong>：参数可选（可为 nullptr）</li></ul><p data-v-fe89cb03><strong data-v-fe89cb03>递归要点：</strong></p><ul data-v-fe89cb03><li data-v-fe89cb03>必须有递归基（终止条件）</li><li data-v-fe89cb03>每次递归调用必须趋向递归基</li><li data-v-fe89cb03>深度递归考虑改为迭代（避免栈溢出）</li></ul></div>',1))]))}}),v=i(r,[["__scopeId","data-v-fe89cb03"]]);export{v as default};
