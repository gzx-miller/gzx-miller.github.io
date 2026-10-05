const n=`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    // 查找
    auto it = std::find(nums.begin(), nums.end(), 8);

    // 排序
    std::sort(nums.begin(), nums.end());

    // 累加
    int sum = std::accumulate(nums.begin(), nums.end(), 0);

    return 0;
}`;export{n as default};
