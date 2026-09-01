import{d as v,b as n,e,M as r,F as i,E as u,v as b,A as d,f as o,r as m,o as a,I as x}from"./DutfXOOr.js";const f={class:"demo-card"},k={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},y={key:0},C={key:1},_={key:2},g=`// 运算符示例
#include <iostream>

int main() {
    // 算术运算符
    int a = 10, b = 3;
    std::cout << a + b << std::endl;   // 13
    std::cout << a / b << std::endl;   // 3（整数除法）
    std::cout << a % b << std::endl;   // 1（取余）

    // 关系运算符
    std::cout << (a > b) << std::endl;  // 1（true）

    // 逻辑运算符（短路求值）
    int x = 0;
    if (a > b && ++x) { }  // x 会增加
    std::cout << x << std::endl;  // 1

    // 位运算符
    int bits = 5;  // 二进制 0101
    std::cout << (bits << 1) << std::endl;  // 10（1010）
    std::cout << (bits & 3) << std::endl;   // 1（0101 & 0011 = 0001）

    // 三元运算符
    int max = (a > b) ? a : b;

    // 逗号运算符
    int c = (a++, b++, a + b);  // a=11, b=4, c=15

    return 0;
}`,h=v({__name:"CPP03OperatorsExpressions",setup(E){const s=m("precedence"),c=[{level:"最高",operators:"::"},{level:"↓",operators:"() [] -> . ++ --（后缀）"},{level:"↓",operators:"++ --（前缀）! ~ + - * & sizeof"},{level:"↓",operators:"* / %"},{level:"↓",operators:"+ -"},{level:"↓",operators:"<< >>"},{level:"↓",operators:"< <= > >="},{level:"↓",operators:"== !="},{level:"↓",operators:"&"},{level:"↓",operators:"^"},{level:"↓",operators:"|"},{level:"↓",operators:"&&"},{level:"↓",operators:"||"},{level:"↓",operators:"?:"},{level:"↓",operators:"= += -= 等赋值"},{level:"最低",operators:","}],p=[{problem:"运算符优先级",code:"if (a & mask == 0)",fix:"if ((a & mask) == 0)",desc:"== 优先级高于 &"},{problem:"整数提升",code:"char c1=100, c2=200; char sum=c1+c2;",fix:"int sum = c1 + c2;",desc:"char 相加会提升为 int"},{problem:"未定义行为",code:"int i = 0; i = i++;",fix:"i++; 或 ++i;",desc:"同一表达式中多次修改变量"},{problem:"有符号溢出",code:"int x = INT_MAX + 1;",fix:"使用 long long",desc:"有符号溢出是未定义行为"}];return(N,l)=>(a(),n("div",f,[l[6]||(l[6]=e("h3",null,"🌰 运算符、表达式与类型提升",-1)),e("div",k,[e("button",{class:r(["tab-btn",{active:s.value==="precedence"}]),onClick:l[0]||(l[0]=t=>s.value="precedence")},"优先级",2),e("button",{class:r(["tab-btn",{active:s.value==="examples"}]),onClick:l[1]||(l[1]=t=>s.value="examples")},"代码示例",2),e("button",{class:r(["tab-btn",{active:s.value==="pitfalls"}]),onClick:l[2]||(l[2]=t=>s.value="pitfalls")},"常见陷阱",2)]),s.value==="precedence"?(a(),n("div",y,[e("table",null,[l[3]||(l[3]=e("thead",null,[e("tr",null,[e("th",null,"优先级"),e("th",null,"运算符")])],-1)),e("tbody",null,[(a(),n(i,null,u(c,t=>e("tr",{key:t.level},[e("td",null,o(t.level),1),e("td",null,[e("code",null,o(t.operators),1)])])),64))])]),l[4]||(l[4]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"建议："),b("对复杂表达式使用括号明确意图，不要依赖优先级记忆！")])],-1))])):d("",!0),s.value==="examples"?(a(),n("div",C,[e("pre",{class:"code-block"},[e("code",null,o(g))])])):d("",!0),s.value==="pitfalls"?(a(),n("div",_,[e("table",null,[l[5]||(l[5]=e("thead",null,[e("tr",null,[e("th",null,"问题"),e("th",null,"错误代码"),e("th",null,"修正"),e("th",null,"说明")])],-1)),e("tbody",null,[(a(),n(i,null,u(p,t=>e("tr",{key:t.problem},[e("td",null,o(t.problem),1),e("td",null,[e("code",null,o(t.code),1)]),e("td",null,[e("code",null,o(t.fix),1)]),e("td",null,[e("small",null,o(t.desc),1)])])),64))])])])):d("",!0)]))}}),B=x(h,[["__scopeId","data-v-76436f8f"]]);export{B as default};
