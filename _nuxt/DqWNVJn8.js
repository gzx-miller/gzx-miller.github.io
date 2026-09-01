import{d as u,b as a,e,M as s,f as n,A as i,a0 as v,v as d,r as f,o as l,I as p}from"./DutfXOOr.js";const b={class:"demo-card"},m={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},k={key:0},g={key:1},C={key:2},r=`// 控制流示例
#include <iostream>
#include <vector>

int main() {
    // if-else
    int score = 85;
    if (score >= 90) {
        std::cout << "优秀";
    } else if (score >= 60) {
        std::cout << "及格";
    } else {
        std::cout << "不及格";
    }

    // switch
    int day = 3;
    switch (day) {
        case 1: std::cout << "周一"; break;
        case 2: std::cout << "周二"; break;
        case 3: std::cout << "周三"; break;
        default: std::cout << "其他"; break;
    }

    // while 循环
    int i = 0;
    while (i < 5) {
        std::cout << i << " ";
        i++;
    }

    // for 循环
    for (int j = 0; j < 5; j++) {
        std::cout << j << " ";
    }

    // 范围 for（C++11）
    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (int num : nums) {
        std::cout << num << " ";
    }

    // 修改元素需要用引用
    for (int& num : nums) {
        num *= 2;
    }

    return 0;
}`,x=u({__name:"CPP04ControlFlow",setup(w){const o=f("branching");return(_,t)=>(l(),a("div",b,[t[5]||(t[5]=e("h3",null,"🌰 控制流：if/switch/while/for/范围 for",-1)),e("div",m,[e("button",{class:s(["tab-btn",{active:o.value==="branching"}]),onClick:t[0]||(t[0]=c=>o.value="branching")},"分支",2),e("button",{class:s(["tab-btn",{active:o.value==="loops"}]),onClick:t[1]||(t[1]=c=>o.value="loops")},"循环",2),e("button",{class:s(["tab-btn",{active:o.value==="rangefor"}]),onClick:t[2]||(t[2]=c=>o.value="rangefor")},"范围 for",2)]),o.value==="branching"?(l(),a("div",k,[e("pre",{class:"code-block"},[e("code",null,n(r))])])):i("",!0),o.value==="loops"?(l(),a("div",g,[e("pre",{class:"code-block"},[e("code",null,n(r))]),t[3]||(t[3]=v('<div class="tips-box" data-v-563e4269><p data-v-563e4269><strong data-v-563e4269>循环选择：</strong></p><ul data-v-563e4269><li data-v-563e4269><code data-v-563e4269>for</code>：已知迭代次数</li><li data-v-563e4269><code data-v-563e4269>while</code>：条件驱动，可能一次都不执行</li><li data-v-563e4269><code data-v-563e4269>do-while</code>：至少执行一次</li><li data-v-563e4269><code data-v-563e4269>范围 for</code>：遍历容器（C++11）</li></ul></div>',1))])):i("",!0),o.value==="rangefor"?(l(),a("div",C,[e("pre",{class:"code-block"},[e("code",null,n(r))]),t[4]||(t[4]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"范围 for 要点：")]),e("ul",null,[e("li",null,[e("code",null,"for (auto x : container)"),d("：复制元素")]),e("li",null,[e("code",null,"for (const auto& x : container)"),d("：只读引用（推荐）")]),e("li",null,[e("code",null,"for (auto& x : container)"),d("：可修改元素的引用")]),e("li",null,"遍历过程中不要增删容器元素！")])],-1))])):i("",!0)]))}}),h=p(x,[["__scopeId","data-v-563e4269"]]);export{h as default};
