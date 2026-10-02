import{d as e,b as d,e as c,f as s,a0 as a,o,F as r}from"./CfJSWYGO.js";const l={class:"demo-card"},i=`#include <iostream>
#include <string>
#include <vector>

int main() {
    // 移动语义：资源转移而非拷贝
    std::string str1 = "Hello, World!";
    std::string str2 = std::move(str1);  // 移动构造

    std::cout << "str2: " << str2 << std::endl;  // Hello, World!
    std::cout << "str1: " << str1 << std::endl;  // 空（被移动后）

    // 移动赋值
    std::vector<int> vec1 = {1, 2, 3, 4, 5};
    std::vector<int> vec2;
    vec2 = std::move(vec1);  // 移动赋值

    std::cout << "vec2 大小: " << vec2.size() << std::endl;  // 5
    std::cout << "vec1 大小: " << vec1.size() << std::endl;  // 0

    // 返回值优化（RVO）
    auto getVector = []() {
        std::vector<int> v = {1, 2, 3};
        return v;  // 移动或复制省略
    };

    std::vector<int> result = getVector();  // 通常无拷贝

    return 0;
}`,n=e({__name:"CPP21MoveSemantics",setup(v){return(f,t)=>(o(),d("div",l,[t[0]||(t[0]=c("h3",null,"🌰 移动语义与右值引用",-1)),c("pre",{class:"code-block"},[c("code",null,s(i))]),t[1]||(t[1]=a('<div class="tips-box" data-v-76cc5b4f><p data-v-76cc5b4f><strong data-v-76cc5b4f>移动语义要点：</strong></p><ul data-v-76cc5b4f><li data-v-76cc5b4f><code data-v-76cc5b4f>std::move(x)</code> 将左值转换为右值引用</li><li data-v-76cc5b4f>移动后对象处于有效但不确定的状态</li><li data-v-76cc5b4f>移动通常比拷贝快得多（只拷贝指针，不拷贝数据）</li></ul><p data-v-76cc5b4f><strong data-v-76cc5b4f>右值引用：</strong></p><ul data-v-76cc5b4f><li data-v-76cc5b4f><code data-v-76cc5b4f>T&amp;&amp;</code> 是右值引用，可以绑定到临时对象</li><li data-v-76cc5b4f>用于实现移动构造和移动赋值</li><li data-v-76cc5b4f>用于完美转发（<code data-v-76cc5b4f>std::forward</code>）</li></ul></div>',1))]))}}),b=r(n,[["__scopeId","data-v-76cc5b4f"]]);export{b as default};
