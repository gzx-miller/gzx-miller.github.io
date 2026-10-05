const n=`#include <iostream>
#include <vector>

int main() {
    int score = 85;
    if (score >= 90) {
        std::cout << "优秀";
    } else if (score >= 60) {
        std::cout << "及格";
    }

    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (int num : nums) {
        std::cout << num << " ";
    }

    return 0;
}`;export{n as default};
