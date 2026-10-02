import{d as y,b as o,e as t,M as u,f as n,K as d,L as i,A as r,v as b,a0 as g,r as m,o as s,F as f}from"./CfJSWYGO.js";const x={class:"demo-card"},C={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},h={key:0},k={key:1},z={key:2},_=`// 基本类型示例
#include <iostream>
#include <limits>

int main() {
    // 整数类型
    short s = 10;           // 通常 2 字节
    int n = 100;             // 通常 4 字节
    long l = 100000L;        // 至少 4 字节
    long long ll = 1e18;     // 至少 8 字节

    // 无符号类型
    unsigned int u = 4000000000u;

    // 浮点类型
    float f = 3.14f;        // 通常 4 字节
    double d = 3.1415926;   // 通常 8 字节

    // 字符和布尔
    char c = 'A';
    bool b = true;

    // 统一初始化（C++11）
    int x{5};                // 防止窄化转换
    // int bad{3.14};       // 编译错误！

    // 类型转换
    double pi = 3.14159;
    int intPi = static_cast<int>(pi);  // 显式转换，结果为 3

    return 0;
}`,V=y({__name:"CPP02VariablesTypes",setup(P){const a=m("types"),p=[{type:"short",size:"2 字节",range:"-32768 ~ 32767",usage:"小范围整数"},{type:"int",size:"4 字节",range:"-2^31 ~ 2^31-1",usage:"默认整数类型"},{type:"long long",size:"8 字节",range:"-2^63 ~ 2^63-1",usage:"大整数"},{type:"float",size:"4 字节",range:"±3.4e±38",usage:"单精度浮点"},{type:"double",size:"8 字节",range:"±1.7e±308",usage:"双精度浮点"},{type:"char",size:"1 字节",range:"-128 ~ 127 或 0 ~ 255",usage:"单个字符"},{type:"bool",size:"1 字节",range:"true 或 false",usage:"布尔值"}],v=[{method:"直接初始化",syntax:"int x = 5;",note:"传统方式"},{method:"统一初始化",syntax:"int x{5};",note:"C++11，防止窄化转换"},{method:"自动类型推导",syntax:"auto x = 5;",note:"C++11，编译器推导类型"}],c=[{from:"int → double",code:"double d = 42;",result:"42.0",type:"隐式，安全"},{from:"double → int",code:"int x = 3.14;",result:"3",type:"隐式，精度丢失"},{from:"有符号 → 无符号",code:"unsigned u = -1;",result:"4294967295",type:"隐式，危险！"},{from:"显式转换",code:"int x = static_cast<int>(3.14);",result:"3",type:"C++ 风格，推荐"}];return(N,e)=>(s(),o("div",x,[e[8]||(e[8]=t("h3",null,"🌰 变量、基本类型与类型转换",-1)),t("div",C,[t("button",{class:u(["tab-btn",{active:a.value==="types"}]),onClick:e[0]||(e[0]=l=>a.value="types")},"基本类型",2),t("button",{class:u(["tab-btn",{active:a.value==="init"}]),onClick:e[1]||(e[1]=l=>a.value="init")},"初始化方式",2),t("button",{class:u(["tab-btn",{active:a.value==="convert"}]),onClick:e[2]||(e[2]=l=>a.value="convert")},"类型转换",2)]),a.value==="types"?(s(),o("div",h,[t("pre",{class:"code-block"},[t("code",null,n(_))]),t("table",null,[e[3]||(e[3]=t("thead",null,[t("tr",null,[t("th",null,"类型"),t("th",null,"大小"),t("th",null,"范围"),t("th",null,"用途")])],-1)),t("tbody",null,[(s(),o(d,null,i(p,l=>t("tr",{key:l.type},[t("td",null,[t("code",null,n(l.type),1)]),t("td",null,n(l.size),1),t("td",null,[t("small",null,n(l.range),1)]),t("td",null,n(l.usage),1)])),64))])])])):r("",!0),a.value==="init"?(s(),o("div",k,[t("table",null,[e[4]||(e[4]=t("thead",null,[t("tr",null,[t("th",null,"方式"),t("th",null,"语法"),t("th",null,"说明")])],-1)),t("tbody",null,[(s(),o(d,null,i(v,l=>t("tr",{key:l.method},[t("td",null,n(l.method),1),t("td",null,[t("code",null,n(l.syntax),1)]),t("td",null,n(l.note),1)])),64))])]),e[5]||(e[5]=t("div",{class:"tips-box"},[t("p",null,[t("strong",null,"统一初始化的优势：")]),t("ul",null,[t("li",null,[b("防止窄化转换（"),t("code",null,"int x{3.14}"),b(" 编译错误）")]),t("li",null,"可以初始化任何类型（数组、结构体、容器等）"),t("li",null,"语法统一，减少记忆负担")])],-1))])):r("",!0),a.value==="convert"?(s(),o("div",z,[t("table",null,[e[6]||(e[6]=t("thead",null,[t("tr",null,[t("th",null,"转换"),t("th",null,"代码"),t("th",null,"结果"),t("th",null,"类型")])],-1)),t("tbody",null,[(s(),o(d,null,i(c,l=>t("tr",{key:l.from},[t("td",null,n(l.from),1),t("td",null,[t("code",null,n(l.code),1)]),t("td",null,n(l.result),1),t("td",null,[t("small",null,n(l.type),1)])])),64))])]),e[7]||(e[7]=g('<div class="tips-box warning" data-v-bb81a30b><p data-v-bb81a30b><strong data-v-bb81a30b>注意：</strong></p><ul data-v-bb81a30b><li data-v-bb81a30b>避免有符号和无符号混用（<code data-v-bb81a30b>-1 &lt; 0u</code> 为 <code data-v-bb81a30b>false</code>）</li><li data-v-bb81a30b>优先使用 C++ 风格的类型转换（<code data-v-bb81a30b>static_cast</code> 等）</li><li data-v-bb81a30b><code data-v-bb81a30b>auto</code> 可以简化复杂类型声明</li></ul></div>',1))])):r("",!0)]))}}),B=f(V,[["__scopeId","data-v-bb81a30b"]]);export{B as default};
