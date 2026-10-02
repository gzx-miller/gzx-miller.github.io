import{d as a,b as d,e,f as s,a0 as c,o as n,F as o}from"./CfJSWYGO.js";const i={class:"demo-card"},r=`#include <iostream>
#include <stdexcept>
#include <fstream>

// 自定义异常类
class MyException : public std::runtime_error {
public:
    MyException(const std::string& msg) : std::runtime_error(msg) {}
};

void processFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw MyException("无法打开文件: " + filename);
    }
    // 处理文件...
}

int main() {
    try {
        processFile("nonexistent.txt");
    } catch (const MyException& e) {
        std::cout << "捕获自定义异常: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cout << "捕获标准异常: " << e.what() << std::endl;
    } catch (...) {
        std::cout << "捕获未知异常" << std::endl;
    }

    // noexcept 函数
    auto safeDivide = [](int a, int b) noexcept {
        if (b == 0) return 0;
        return a / b;
    };

    return 0;
}`,l=a({__name:"CPP23ExceptionHandling",setup(p){return(u,t)=>(n(),d("div",i,[t[0]||(t[0]=e("h3",null,"🌰 异常处理：try/catch/throw",-1)),e("pre",{class:"code-block"},[e("code",null,s(r))]),t[1]||(t[1]=c('<div class="tips-box" data-v-acd3028e><p data-v-acd3028e><strong data-v-acd3028e>异常安全保证：</strong></p><ul data-v-acd3028e><li data-v-acd3028e><strong data-v-acd3028e>基本承诺</strong>：异常抛出后程序处于有效状态</li><li data-v-acd3028e><strong data-v-acd3028e>强承诺</strong>：操作要么完全成功，要么完全失败（事务性）</li><li data-v-acd3028e><strong data-v-acd3028e>不抛异常承诺</strong>：函数永远不会抛异常（用 noexcept）</li></ul><p data-v-acd3028e><strong data-v-acd3028e>最佳实践：</strong></p><ul data-v-acd3028e><li data-v-acd3028e>析构函数不应该抛出异常</li><li data-v-acd3028e>使用 RAII 确保异常安全</li><li data-v-acd3028e>catch 块按派生类到基类顺序排序</li></ul></div>',1))]))}}),m=o(l,[["__scopeId","data-v-acd3028e"]]);export{m as default};
