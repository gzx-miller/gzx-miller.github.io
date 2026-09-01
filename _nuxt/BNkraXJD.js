import{d as e,b as a,e as t,f as r,a0 as d,o as c,I as s}from"./DutfXOOr.js";const n={class:"demo-card"},v=`#include <iostream>
#include <cmath>

class Vector {
private:
    double x, y;

public:
    Vector(double x, double y) : x(x), y(y) {}

    // 运算符重载：+
    Vector operator+(const Vector& other) const {
        return Vector(x + other.x, y + other.y);
    }

    // 运算符重载：-
    Vector operator-(const Vector& other) const {
        return Vector(x - other.x, y - other.y);
    }

    // 运算符重载：*（点积）
    double operator*(const Vector& other) const {
        return x * other.x + y * other.y;
    }

    // 运算符重载：<<（输出）
    friend std::ostream& operator<<(std::ostream& os, const Vector& v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }

    // 下标运算符
    double& operator[](int index) {
        return index == 0 ? x : y;
    }

    const double& operator[](int index) const {
        return index == 0 ? x : y;
    }
};

int main() {
    Vector v1(1, 2), v2(3, 4);
    std::cout << "v1 = " << v1 << std::endl;
    std::cout << "v1 + v2 = " << v1 + v2 << std::endl;
    std::cout << "v1 * v2 = " << v1 * v2 << std::endl;
    std::cout << "v1[0] = " << v1[0] << std::endl;
    return 0;
}`,l=e({__name:"CPP14OperatorOverloading",setup(i){return(p,o)=>(c(),a("div",n,[o[0]||(o[0]=t("h3",null,"🌰 运算符重载：让自定义类型更自然",-1)),t("pre",{class:"code-block"},[t("code",null,r(v))]),o[1]||(o[1]=d('<div class="tips-box" data-v-208163a7><p data-v-208163a7><strong data-v-208163a7>运算符重载规则：</strong></p><ul data-v-208163a7><li data-v-208163a7><code data-v-208163a7>operator+</code> 返回新对象（不修改操作数）</li><li data-v-208163a7><code data-v-208163a7>operator+=</code> 返回引用（修改左操作数）</li><li data-v-208163a7><code data-v-208163a7>operator==</code> 和 <code data-v-208163a7>operator!=</code> 应成对实现</li><li data-v-208163a7>不能重载的运算符：<code data-v-208163a7>::</code> <code data-v-208163a7>.</code> <code data-v-208163a7>.*</code> <code data-v-208163a7>?:</code></li></ul></div>',1))]))}}),x=s(l,[["__scopeId","data-v-208163a7"]]);export{x as default};
