import{d as t,b as a,e,f as s,a0 as n,o,I as i}from"./DutfXOOr.js";const u={class:"demo-card"},c=`#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    // 查找
    auto it = std::find(nums.begin(), nums.end(), 8);
    if (it != nums.end()) {
        std::cout << "找到 8，位置：" << (it - nums.begin()) << std::endl;
    }

    // 计数
    int count = std::count(nums.begin(), nums.end(), 8);
    std::cout << "8 出现 " << count << " 次" << std::endl;

    // 排序
    std::sort(nums.begin(), nums.end());
    std::cout << "排序后：";
    for (int x : nums) std::cout << x << " ";
    std::cout << std::endl;

    // 累加
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "总和：" << sum << std::endl;

    // 变换
    std::vector<int> doubled(nums.size());
    std::transform(nums.begin(), nums.end(), doubled.begin(),
                   [](int x) { return x * 2; });
    std::cout << "翻倍后：";
    for (int x : doubled) std::cout << x << " ";
    std::cout << std::endl;

    return 0;
}`,l=t({__name:"CPP18IteratorsAlgorithms",setup(r){return(b,d)=>(o(),a("div",u,[d[0]||(d[0]=e("h3",null,"🌰 STL 迭代器与算法",-1)),e("pre",{class:"code-block"},[e("code",null,s(c))]),d[1]||(d[1]=n('<div class="tips-box" data-v-d2e42bde><p data-v-d2e42bde><strong data-v-d2e42bde>常用算法：</strong></p><ul data-v-d2e42bde><li data-v-d2e42bde><code data-v-d2e42bde>find</code>：查找元素</li><li data-v-d2e42bde><code data-v-d2e42bde>count</code>：计数</li><li data-v-d2e42bde><code data-v-d2e42bde>sort</code>：排序</li><li data-v-d2e42bde><code data-v-d2e42bde>accumulate</code>：累加（在 &lt;numeric&gt; 中）</li><li data-v-d2e42bde><code data-v-d2e42bde>transform</code>：变换</li><li data-v-d2e42bde><code data-v-d2e42bde>copy</code>：复制</li></ul><p data-v-d2e42bde><strong data-v-d2e42bde>迭代器类别：</strong></p><ul data-v-d2e42bde><li data-v-d2e42bde>输入/输出迭代器：只读/只写</li><li data-v-d2e42bde>前向迭代器：读写，单向</li><li data-v-d2e42bde>双向迭代器：读写，双向（list、map）</li><li data-v-d2e42bde>随机访问迭代器：读写，任意跳转（vector、deque）</li></ul></div>',1))]))}}),v=i(l,[["__scopeId","data-v-d2e42bde"]]);export{v as default};
