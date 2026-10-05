const n=`#include <iostream>
#include <vector>
#include <map>

int main() {
    // auto 类型推导
    auto x = 42;
    auto name = "栗子";

    // 范围 for
    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (auto& num : nums) {
        num *= 2;
    }

    // 结构化绑定（C++17）
    std::map<std::string, int> scores{{"Alice", 95}, {"Bob", 87}};
    for (const auto& [name, score] : scores) {
        std::cout << name << ": " << score << std::endl;
    }

    return 0;
}`;export{n as default};
