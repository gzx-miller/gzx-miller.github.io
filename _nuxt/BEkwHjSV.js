import{d as e,b as d,e as a,f as s,a0 as r,o as n,I as o}from"./DutfXOOr.js";const l={class:"demo-card"},i=`#include <iostream>
#include <cstring>

class String {
private:
    char* data;
    size_t length;

public:
    // 构造函数
    String(const char* str) {
        length = std::strlen(str);
        data = new char[length + 1];
        std::strcpy(data, str);
        std::cout << "构造：" << data << std::endl;
    }

    // 拷贝构造函数（深拷贝）
    String(const String& other) {
        length = other.length;
        data = new char[length + 1];
        std::strcpy(data, other.data);
        std::cout << "拷贝构造：" << data << std::endl;
    }

    // 拷贝赋值运算符
    String& operator=(const String& other) {
        if (this != &other) {  // 自赋值检查
            delete[] data;  // 释放旧资源
            length = other.length;
            data = new char[length + 1];
            std::strcpy(data, other.data);
        }
        std::cout << "拷贝赋值：" << data << std::endl;
        return *this;
    }

    // 析构函数
    ~String() {
        std::cout << "析构：" << (data ? data : "null") << std::endl;
        delete[] data;
    }
};

int main() {
    String s1("Hello");
    String s2 = s1;  // 拷贝构造
    String s3("World");
    s3 = s1;          // 拷贝赋值
    return 0;
}`,g=e({__name:"CPP11CopyControl",setup(c){return(p,t)=>(n(),d("div",l,[t[0]||(t[0]=a("h3",null,"🌰 拷贝控制：拷贝构造、拷贝赋值与 Rule of Three/Five",-1)),a("pre",{class:"code-block"},[a("code",null,s(i))]),t[1]||(t[1]=r('<div class="tips-box" data-v-55e7a5d5><p data-v-55e7a5d5><strong data-v-55e7a5d5>Rule of Three：</strong></p><ul data-v-55e7a5d5><li data-v-55e7a5d5>如果类需要自定义<strong data-v-55e7a5d5>析构函数</strong>、<strong data-v-55e7a5d5>拷贝构造函数</strong>或<strong data-v-55e7a5d5>拷贝赋值运算符</strong>中的任何一个</li><li data-v-55e7a5d5>那么通常也需要自定义所有三个</li></ul><p data-v-55e7a5d5><strong data-v-55e7a5d5>Rule of Five（C++11）：</strong></p><ul data-v-55e7a5d5><li data-v-55e7a5d5>加上<strong data-v-55e7a5d5>移动构造函数</strong>和<strong data-v-55e7a5d5>移动赋值运算符</strong></li></ul><p data-v-55e7a5d5><strong data-v-55e7a5d5>Rule of Zero：</strong></p><ul data-v-55e7a5d5><li data-v-55e7a5d5>如果所有成员都是 RAII 类型，不需要自定义任何特殊成员函数</li></ul></div>',1))]))}}),v=o(g,[["__scopeId","data-v-55e7a5d5"]]);export{v as default};
