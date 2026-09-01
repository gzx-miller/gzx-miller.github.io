import{d,b as a,e as s,f as e,a0 as o,o as r,I as n}from"./DutfXOOr.js";const i={class:"demo-card"},l=`#include <iostream>
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
}`,c=d({__name:"CPP06ArraysStrings",setup(g){return(v,t)=>(r(),a("div",i,[t[0]||(t[0]=s("h3",null,"🌰 数组、C 风格字符串与 std::string",-1)),s("pre",{class:"code-block"},[s("code",null,e(l))]),t[1]||(t[1]=o('<div class="tips-box" data-v-3844ab99><p data-v-3844ab99><strong data-v-3844ab99>建议：</strong></p><ul data-v-3844ab99><li data-v-3844ab99>优先使用 <code data-v-3844ab99>std::string</code> 而非 C 风格字符串</li><li data-v-3844ab99>优先使用 <code data-v-3844ab99>std::array</code> 或 <code data-v-3844ab99>std::vector</code> 而非内置数组</li><li data-v-3844ab99><code data-v-3844ab99>std::string</code> 的 <code data-v-3844ab99>operator[]</code> 不检查越界</li><li data-v-3844ab99><code data-v-3844ab99>std::string::at()</code> 会检查越界并抛异常</li></ul></div>',1))]))}}),b=n(c,[["__scopeId","data-v-3844ab99"]]);export{b as default};
