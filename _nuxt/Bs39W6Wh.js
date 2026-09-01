import{d as a,b as s,e,f as l,a0 as d,o as i,I as o}from"./DutfXOOr.js";const n={class:"demo-card"},c=`#include <iostream>
#include <fstream>
#include <mutex>

// RAII 类示例：文件句柄
class FileHandle {
private:
    std::fstream file;

public:
    FileHandle(const char* filename) {
        file.open(filename, std::ios::out);
        if (!file.is_open()) {
            throw std::runtime_error("无法打开文件");
        }
        std::cout << "文件已打开" << std::endl;
    }

    ~FileHandle() {
        if (file.is_open()) {
            file.close();
            std::cout << "文件已关闭" << std::endl;
        }
    }

    void write(const std::string& content) {
        file << content;
    }
};

// 使用 RAII 的锁守卫
std::mutex mtx;

void safeFunction() {
    std::lock_guard<std::mutex> lock(mtx);  // 构造时加锁
    // 临界区
    std::cout << "线程安全操作" << std::endl;
}  // 析构时解锁（即使抛异常也会解锁）

int main() {
    try {
        FileHandle file("test.txt");
        file.write("Hello, RAII!");
        // 函数结束时自动析构，文件被关闭
    } catch (const std::exception& e) {
        std::cout << "错误: " << e.what() << std::endl;
    }

    return 0;
}`,r=a({__name:"CPP22RAII",setup(b){return(u,t)=>(i(),s("div",n,[t[0]||(t[0]=e("h3",null,"🌰 RAII 原则：资源获取即初始化",-1)),e("pre",{class:"code-block"},[e("code",null,l(c))]),t[1]||(t[1]=d('<div class="tips-box" data-v-b321b182><p data-v-b321b182><strong data-v-b321b182>RAII 核心思想：</strong></p><ul data-v-b321b182><li data-v-b321b182>构造函数中获取资源</li><li data-v-b321b182>析构函数中释放资源</li><li data-v-b321b182>利用栈展开（stack unwinding）自动清理</li></ul><p data-v-b321b182><strong data-v-b321b182>RAII 的好处：</strong></p><ul data-v-b321b182><li data-v-b321b182>异常安全（即使抛异常，局部对象也会析构）</li><li data-v-b321b182>自动资源管理（不会忘记释放）</li><li data-v-b321b182>代码简洁（不需要手动 close/release）</li></ul></div>',1))]))}}),f=o(r,[["__scopeId","data-v-b321b182"]]);export{f as default};
