const n=`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};

    // 基本 lambda
    auto print = []() {
        std::cout << "Hello from lambda!" << std::endl;
    };
    print();

    // 带参数的 lambda
    auto add = [](int a, int b) {
        return a + b;
    };
    std::cout << "3 + 5 = " << add(3, 5) << std::endl;

    // 值捕获
    int factor = 2;
    auto multiply = [factor](int x) {
        return x * factor;
    };

    return 0;
}`;export{n as default};
