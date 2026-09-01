import{d as t,b as d,e,f as s,a0 as o,o as c,I as n}from"./DutfXOOr.js";const i={class:"demo-card"},r=`#include <iostream>
#include <map>
#include <unordered_map>
#include <set>

int main() {
    // map：有序键值对
    std::map<std::string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages["Charlie"] = 35;

    // 访问元素
    std::cout << "Bob: " << ages["Bob"] << std::endl;  // 30
    // 注意：operator[] 在键不存在时会插入！

    // 安全访问
    auto it = ages.find("David");
    if (it != ages.end()) {
        std::cout << "David: " << it->second << std::endl;
    }

    // 遍历（按键排序）
    for (const auto& [name, age] : ages) {
        std::cout << name << ": " << age << std::endl;
    }

    // unordered_map：无序哈希表
    std::unordered_map<std::string, int> hashAges;
    hashAges["Alice"] = 25;
    hashAges["Bob"] = 30;

    // set：有序集合
    std::set<int> nums = {5, 2, 8, 1, 2};
    for (int x : nums) {
        std::cout << x << " ";  // 1 2 5 8（自动排序，去重）
    }
    return 0;
}`,l=t({__name:"CPP17StlAssociativeContainers",setup(f){return(p,a)=>(c(),d("div",i,[a[0]||(a[0]=e("h3",null,"🌰 STL 容器（二）：map、set、unordered_map",-1)),e("pre",{class:"code-block"},[e("code",null,s(r))]),a[1]||(a[1]=o('<div class="tips-box" data-v-9f3ac647><p data-v-9f3ac647><strong data-v-9f3ac647>容器选择：</strong></p><ul data-v-9f3ac647><li data-v-9f3ac647><code data-v-9f3ac647>map</code>：需要有序遍历或范围查询，O(log n)</li><li data-v-9f3ac647><code data-v-9f3ac647>unordered_map</code>：只关心查找速度，平均 O(1)</li><li data-v-9f3ac647><code data-v-9f3ac647>set</code>：有序唯一集合</li><li data-v-9f3ac647><code data-v-9f3ac647>unordered_set</code>：无序唯一集合，平均 O(1)</li></ul><p data-v-9f3ac647><strong data-v-9f3ac647>注意：</strong></p><ul data-v-9f3ac647><li data-v-9f3ac647><code data-v-9f3ac647>operator[]</code> 在键不存在时会插入默认值</li><li data-v-9f3ac647>如果只是读取，用 <code data-v-9f3ac647>at()</code> 或 <code data-v-9f3ac647>find()</code></li></ul></div>',1))]))}}),v=n(l,[["__scopeId","data-v-9f3ac647"]]);export{v as default};
