import{d as u,b as d,e as t,M as l,f as s,A as n,a0 as v,v as c,r as b,o as a,F as f}from"./CfJSWYGO.js";const p={class:"demo-card"},m={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},k={key:0},g={key:1},C={key:2},i=`// 控制流示例
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
}`,x=u({__name:"CPP04ControlFlow",setup(w){const e=b("branching");return(_,o)=>(a(),d("div",p,[o[5]||(o[5]=t("h3",null,"🌰 控制流：if/switch/while/for/范围 for",-1)),t("div",m,[t("button",{class:l(["tab-btn",{active:e.value==="branching"}]),onClick:o[0]||(o[0]=r=>e.value="branching")},"分支",2),t("button",{class:l(["tab-btn",{active:e.value==="loops"}]),onClick:o[1]||(o[1]=r=>e.value="loops")},"循环",2),t("button",{class:l(["tab-btn",{active:e.value==="rangefor"}]),onClick:o[2]||(o[2]=r=>e.value="rangefor")},"范围 for",2)]),e.value==="branching"?(a(),d("div",k,[t("pre",{class:"code-block"},[t("code",null,s(i))])])):n("",!0),e.value==="loops"?(a(),d("div",g,[t("pre",{class:"code-block"},[t("code",null,s(i))]),o[3]||(o[3]=v('<div class="tips-box" data-v-65ddb70c><p data-v-65ddb70c><strong data-v-65ddb70c>循环选择：</strong></p><ul data-v-65ddb70c><li data-v-65ddb70c><code data-v-65ddb70c>for</code>：已知迭代次数</li><li data-v-65ddb70c><code data-v-65ddb70c>while</code>：条件驱动，可能一次都不执行</li><li data-v-65ddb70c><code data-v-65ddb70c>do-while</code>：至少执行一次</li><li data-v-65ddb70c><code data-v-65ddb70c>范围 for</code>：遍历容器（C++11）</li></ul></div>',1))])):n("",!0),e.value==="rangefor"?(a(),d("div",C,[t("pre",{class:"code-block"},[t("code",null,s(i))]),o[4]||(o[4]=t("div",{class:"tips-box"},[t("p",null,[t("strong",null,"范围 for 要点：")]),t("ul",null,[t("li",null,[t("code",null,"for (auto x : container)"),c("：复制元素")]),t("li",null,[t("code",null,"for (const auto& x : container)"),c("：只读引用（推荐）")]),t("li",null,[t("code",null,"for (auto& x : container)"),c("：可修改元素的引用")]),t("li",null,"遍历过程中不要增删容器元素！")])],-1))])):n("",!0)]))}}),h=f(x,[["__scopeId","data-v-65ddb70c"]]);export{h as default};
