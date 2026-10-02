import{d as a,b as d,e as t,f as s,a0 as l,o as i,F as o}from"./CfJSWYGO.js";const n={class:"demo-card"},c=`#include <iostream>
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
}`,r=a({__name:"CPP22RAII",setup(u){return(p,e)=>(i(),d("div",n,[e[0]||(e[0]=t("h3",null,"🌰 RAII 原则：资源获取即初始化",-1)),t("pre",{class:"code-block"},[t("code",null,s(c))]),e[1]||(e[1]=l('<div class="tips-box" data-v-0dd36aae><p data-v-0dd36aae><strong data-v-0dd36aae>RAII 核心思想：</strong></p><ul data-v-0dd36aae><li data-v-0dd36aae>构造函数中获取资源</li><li data-v-0dd36aae>析构函数中释放资源</li><li data-v-0dd36aae>利用栈展开（stack unwinding）自动清理</li></ul><p data-v-0dd36aae><strong data-v-0dd36aae>RAII 的好处：</strong></p><ul data-v-0dd36aae><li data-v-0dd36aae>异常安全（即使抛异常，局部对象也会析构）</li><li data-v-0dd36aae>自动资源管理（不会忘记释放）</li><li data-v-0dd36aae>代码简洁（不需要手动 close/release）</li></ul></div>',1))]))}}),v=o(r,[["__scopeId","data-v-0dd36aae"]]);export{v as default};
