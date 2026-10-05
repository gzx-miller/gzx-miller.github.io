const n=`#include <iostream>
#include <limits>

int main() {
    int n = 100;
    double d = 3.14159;
    char c = 'A';
    bool b = true;

    // 统一初始化
    int x{5};
    // int bad{3.14};  // 编译错误！

    // 类型转换
    double pi = 3.14159;
    int intPi = static_cast<int>(pi);

    return 0;
}`;export{n as default};
