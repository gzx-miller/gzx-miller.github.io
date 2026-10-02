import{d,b as s,e as t,f as e,a0 as r,o as n,F as o}from"./CfJSWYGO.js";const l={class:"demo-card"},c=`#include <iostream>
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
}`,i=d({__name:"CPP11CopyControl",setup(g){return(p,a)=>(n(),s("div",l,[a[0]||(a[0]=t("h3",null,"🌰 拷贝控制：拷贝构造、拷贝赋值与 Rule of Three/Five",-1)),t("pre",{class:"code-block"},[t("code",null,e(c))]),a[1]||(a[1]=r('<div class="tips-box" data-v-ad22c5a8><p data-v-ad22c5a8><strong data-v-ad22c5a8>Rule of Three：</strong></p><ul data-v-ad22c5a8><li data-v-ad22c5a8>如果类需要自定义<strong data-v-ad22c5a8>析构函数</strong>、<strong data-v-ad22c5a8>拷贝构造函数</strong>或<strong data-v-ad22c5a8>拷贝赋值运算符</strong>中的任何一个</li><li data-v-ad22c5a8>那么通常也需要自定义所有三个</li></ul><p data-v-ad22c5a8><strong data-v-ad22c5a8>Rule of Five（C++11）：</strong></p><ul data-v-ad22c5a8><li data-v-ad22c5a8>加上<strong data-v-ad22c5a8>移动构造函数</strong>和<strong data-v-ad22c5a8>移动赋值运算符</strong></li></ul><p data-v-ad22c5a8><strong data-v-ad22c5a8>Rule of Zero：</strong></p><ul data-v-ad22c5a8><li data-v-ad22c5a8>如果所有成员都是 RAII 类型，不需要自定义任何特殊成员函数</li></ul></div>',1))]))}}),v=o(i,[["__scopeId","data-v-ad22c5a8"]]);export{v as default};
