import{d as e,b as n,e as t,f as r,o as a,I as i}from"./DutfXOOr.js";const l={class:"demo-card"},o=`#include <iostream>
#include <string>

// 函数模板
template <typename T>
T max(T a, T b) {
    return a > b ? a : b;
}

// 类模板
template <typename T>
class Pair {
private:
    T first, second;

public:
    Pair(T a, T b) : first(a), second(b) {}

    T getFirst() const { return first; }
    T getSecond() const { return second; }

    void setFirst(T a) { first = a; }
    void setSecond(T b) { second = b; }
};

// 模板特化
template <>
class Pair<std::string> {
private:
    std::string first, second;

public:
    Pair(const std::string& a, const std::string& b) : first(a), second(b) {}

    std::string getConcat() const {
        return first + " " + second;
    }
};

int main() {
    // 函数模板（类型推导）
    std::cout << max(3, 7) << std::endl;        // 7
    std::cout << max(3.14, 2.71) << std::endl; // 3.14

    // 类模板（显式指定类型）
    Pair<int> intPair(10, 20);
    std::cout << intPair.getFirst() << std::endl;  // 10

    Pair<std::string> strPair("Hello", "World");
    std::cout << strPair.getConcat() << std::endl;  // Hello World
    return 0;
}`,d=e({__name:"CPP15TemplatesBasics",setup(c){return(u,s)=>(a(),n("div",l,[s[0]||(s[0]=t("h3",null,"🌰 函数模板与类模板：泛型编程基础",-1)),t("pre",{class:"code-block"},[t("code",null,r(o))]),s[1]||(s[1]=t("div",{class:"tips-box"},[t("p",null,[t("strong",null,"模板要点：")]),t("ul",null,[t("li",null,"函数模板：编译器根据实参推导类型"),t("li",null,"类模板：使用时必须显式指定类型参数"),t("li",null,"模板代码通常放在头文件中（因为需要完整定义才能实例化）"),t("li",null,"模板特化：为特定类型提供特殊实现")])],-1))]))}}),m=i(d,[["__scopeId","data-v-d6f31380"]]);export{m as default};
