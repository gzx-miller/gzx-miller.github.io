const n=`#include <iostream>
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
}

int main() {
    try {
        processFile("nonexistent.txt");
    } catch (const MyException& e) {
        std::cout << "捕获自定义异常: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cout << "捕获标准异常: " << e.what() << std::endl;
    }

    return 0;
}`;export{n as default};
