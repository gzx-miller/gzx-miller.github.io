import{d as s,b as e,e as d,f as o,a0 as a,o as r,F as n}from"./CfJSWYGO.js";const i={class:"demo-card"},l=`#include <iostream>
#include <string>
#include <cstring>

int main() {
    // 内置数组
    int arr[5] = {1, 2, 3};  // 未初始化的元素为 0
    std::cout << arr[0] << std::endl;  // 1
    // arr[10] = 5;  // 越界访问，未定义行为！

    // 数组退化：传递给函数时丢失大小信息
    // void foo(int a[]) 等价于 void foo(int* a)

    // C 风格字符串
    char greeting[] = "Hello";
    std::cout << greeting << std::endl;  // Hello
    std::cout << strlen(greeting) << std::endl;  // 5

    // std::string（推荐）
    std::string s1 = "Hello";
    std::string s2 = "World";
    std::string s3 = s1 + ", " + s2 + "!";  // 拼接
    std::cout << s3 << std::endl;  // Hello, World!

    // string 常用操作
    std::cout << s3.size() << std::endl;  // 13
    std::cout << s3.substr(0, 5) << std::endl;  // Hello
    std::cout << s3.find("World") << std::endl;  // 7

    // c_str() 获取 C 风格字符串
    const char* cstr = s3.c_str();

    return 0;
}`,c=s({__name:"CPP06ArraysStrings",setup(g){return(v,t)=>(r(),e("div",i,[t[0]||(t[0]=d("h3",null,"🌰 数组、C 风格字符串与 std::string",-1)),d("pre",{class:"code-block"},[d("code",null,o(l))]),t[1]||(t[1]=a('<div class="tips-box" data-v-665ed896><p data-v-665ed896><strong data-v-665ed896>建议：</strong></p><ul data-v-665ed896><li data-v-665ed896>优先使用 <code data-v-665ed896>std::string</code> 而非 C 风格字符串</li><li data-v-665ed896>优先使用 <code data-v-665ed896>std::array</code> 或 <code data-v-665ed896>std::vector</code> 而非内置数组</li><li data-v-665ed896><code data-v-665ed896>std::string</code> 的 <code data-v-665ed896>operator[]</code> 不检查越界</li><li data-v-665ed896><code data-v-665ed896>std::string::at()</code> 会检查越界并抛异常</li></ul></div>',1))]))}}),p=n(c,[["__scopeId","data-v-665ed896"]]);export{p as default};
