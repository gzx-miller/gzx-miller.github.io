import{d,b as a,e,f as s,a0 as n,o,F as i}from"./CfJSWYGO.js";const u={class:"demo-card"},c=`#include <iostream>
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
}`,l=d({__name:"CPP18IteratorsAlgorithms",setup(r){return(b,t)=>(o(),a("div",u,[t[0]||(t[0]=e("h3",null,"🌰 STL 迭代器与算法",-1)),e("pre",{class:"code-block"},[e("code",null,s(c))]),t[1]||(t[1]=n('<div class="tips-box" data-v-642b3e36><p data-v-642b3e36><strong data-v-642b3e36>常用算法：</strong></p><ul data-v-642b3e36><li data-v-642b3e36><code data-v-642b3e36>find</code>：查找元素</li><li data-v-642b3e36><code data-v-642b3e36>count</code>：计数</li><li data-v-642b3e36><code data-v-642b3e36>sort</code>：排序</li><li data-v-642b3e36><code data-v-642b3e36>accumulate</code>：累加（在 &lt;numeric&gt; 中）</li><li data-v-642b3e36><code data-v-642b3e36>transform</code>：变换</li><li data-v-642b3e36><code data-v-642b3e36>copy</code>：复制</li></ul><p data-v-642b3e36><strong data-v-642b3e36>迭代器类别：</strong></p><ul data-v-642b3e36><li data-v-642b3e36>输入/输出迭代器：只读/只写</li><li data-v-642b3e36>前向迭代器：读写，单向</li><li data-v-642b3e36>双向迭代器：读写，双向（list、map）</li><li data-v-642b3e36>随机访问迭代器：读写，任意跳转（vector、deque）</li></ul></div>',1))]))}}),v=i(l,[["__scopeId","data-v-642b3e36"]]);export{v as default};
