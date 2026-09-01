import{d as e,b as a,e as d,f as c,a0 as s,o as n,I as o}from"./DutfXOOr.js";const v={class:"demo-card"},b=`#include <iostream>
#include <vector>
#include <deque>
#include <list>

int main() {
    // vector：动态数组
    std::vector<int> vec = {1, 2, 3};
    vec.push_back(4);  // 尾部添加
    vec.insert(vec.begin() + 1, 99);  // 中间插入
    for (int x : vec) {
        std::cout << x << " ";  // 1 99 2 3 4
    }
    std::cout << std::endl;

    // deque：双端队列
    std::deque<int> dq;
    dq.push_front(1);  // 头部添加
    dq.push_back(2);   // 尾部添加
    dq.push_front(0);
    for (int x : dq) {
        std::cout << x << " ";  // 0 1 2
    }
    std::cout << std::endl;

    // list：双向链表
    std::list<int> lst = {1, 2, 3};
    lst.push_front(0);   // 头部添加 O(1)
    lst.push_back(4);    // 尾部添加 O(1)
    lst.insert(++lst.begin(), 99);  // 中间插入 O(1)
    for (int x : lst) {
        std::cout << x << " ";  // 0 1 99 2 3 4
    }
    return 0;
}`,r=e({__name:"CPP16StlSequenceContainers",setup(i){return(l,t)=>(n(),a("div",v,[t[0]||(t[0]=d("h3",null,"🌰 STL 容器（一）：vector、deque、list",-1)),d("pre",{class:"code-block"},[d("code",null,c(b))]),t[1]||(t[1]=s('<div class="tips-box" data-v-3b5e02c0><p data-v-3b5e02c0><strong data-v-3b5e02c0>容器选择：</strong></p><table data-v-3b5e02c0><thead data-v-3b5e02c0><tr data-v-3b5e02c0><th data-v-3b5e02c0>容器</th><th data-v-3b5e02c0>随机访问</th><th data-v-3b5e02c0>头部插入</th><th data-v-3b5e02c0>中间插入</th><th data-v-3b5e02c0>内存</th></tr></thead><tbody data-v-3b5e02c0><tr data-v-3b5e02c0><td data-v-3b5e02c0>vector</td><td data-v-3b5e02c0>✅ O(1)</td><td data-v-3b5e02c0>❌ O(n)</td><td data-v-3b5e02c0>❌ O(n)</td><td data-v-3b5e02c0>连续</td></tr><tr data-v-3b5e02c0><td data-v-3b5e02c0>deque</td><td data-v-3b5e02c0>✅ O(1)</td><td data-v-3b5e02c0>✅ O(1)</td><td data-v-3b5e02c0>❌ O(n)</td><td data-v-3b5e02c0>分页</td></tr><tr data-v-3b5e02c0><td data-v-3b5e02c0>list</td><td data-v-3b5e02c0>❌</td><td data-v-3b5e02c0>✅ O(1)</td><td data-v-3b5e02c0>✅ O(1)</td><td data-v-3b5e02c0>不连续</td></tr></tbody></table></div>',1))]))}}),p=o(r,[["__scopeId","data-v-3b5e02c0"]]);export{p as default};
