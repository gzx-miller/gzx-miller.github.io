const t=`#include <iostream>
#include <string>
#include <vector>

int main() {
    // 移动语义：资源转移而非拷贝
    std::string str1 = "Hello, World!";
    std::string str2 = std::move(str1);  // 移动构造

    std::cout << "str2: " << str2 << std::endl;
    std::cout << "str1: " << str1 << std::endl;  // 空（被移动后）

    // 移动赋值
    std::vector<int> vec1 = {1, 2, 3, 4, 5};
    std::vector<int> vec2;
    vec2 = std::move(vec1);  // 移动赋值

    return 0;
}`;export{t as default};
