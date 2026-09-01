import{d as a,b as s,e,f as n,a0 as o,o as i,I as d}from"./DutfXOOr.js";const c={class:"demo-card"},r=`#include <iostream>
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
}`,l=a({__name:"CPP23ExceptionHandling",setup(p){return(f,t)=>(i(),s("div",c,[t[0]||(t[0]=e("h3",null,"🌰 异常处理：try/catch/throw",-1)),e("pre",{class:"code-block"},[e("code",null,n(r))]),t[1]||(t[1]=o('<div class="tips-box" data-v-3809f1ae><p data-v-3809f1ae><strong data-v-3809f1ae>异常安全保证：</strong></p><ul data-v-3809f1ae><li data-v-3809f1ae><strong data-v-3809f1ae>基本承诺</strong>：异常抛出后程序处于有效状态</li><li data-v-3809f1ae><strong data-v-3809f1ae>强承诺</strong>：操作要么完全成功，要么完全失败（事务性）</li><li data-v-3809f1ae><strong data-v-3809f1ae>不抛异常承诺</strong>：函数永远不会抛异常（用 noexcept）</li></ul><p data-v-3809f1ae><strong data-v-3809f1ae>最佳实践：</strong></p><ul data-v-3809f1ae><li data-v-3809f1ae>析构函数不应该抛出异常</li><li data-v-3809f1ae>使用 RAII 确保异常安全</li><li data-v-3809f1ae>catch 块按派生类到基类顺序排序</li></ul></div>',1))]))}}),v=d(l,[["__scopeId","data-v-3809f1ae"]]);export{v as default};
