import{d as e,b as a,e as d,f as c,a0 as s,o as n,F as o}from"./CfJSWYGO.js";const v={class:"demo-card"},r=`#include <iostream>
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
}`,i=e({__name:"CPP16StlSequenceContainers",setup(l){return(u,t)=>(n(),a("div",v,[t[0]||(t[0]=d("h3",null,"🌰 STL 容器（一）：vector、deque、list",-1)),d("pre",{class:"code-block"},[d("code",null,c(r))]),t[1]||(t[1]=s('<div class="tips-box" data-v-21c2486e><p data-v-21c2486e><strong data-v-21c2486e>容器选择：</strong></p><table data-v-21c2486e><thead data-v-21c2486e><tr data-v-21c2486e><th data-v-21c2486e>容器</th><th data-v-21c2486e>随机访问</th><th data-v-21c2486e>头部插入</th><th data-v-21c2486e>中间插入</th><th data-v-21c2486e>内存</th></tr></thead><tbody data-v-21c2486e><tr data-v-21c2486e><td data-v-21c2486e>vector</td><td data-v-21c2486e>✅ O(1)</td><td data-v-21c2486e>❌ O(n)</td><td data-v-21c2486e>❌ O(n)</td><td data-v-21c2486e>连续</td></tr><tr data-v-21c2486e><td data-v-21c2486e>deque</td><td data-v-21c2486e>✅ O(1)</td><td data-v-21c2486e>✅ O(1)</td><td data-v-21c2486e>❌ O(n)</td><td data-v-21c2486e>分页</td></tr><tr data-v-21c2486e><td data-v-21c2486e>list</td><td data-v-21c2486e>❌</td><td data-v-21c2486e>✅ O(1)</td><td data-v-21c2486e>✅ O(1)</td><td data-v-21c2486e>不连续</td></tr></tbody></table></div>',1))]))}}),h=o(i,[["__scopeId","data-v-21c2486e"]]);export{h as default};
