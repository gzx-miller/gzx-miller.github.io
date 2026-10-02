import{d as t,b as r,e as o,f as d,a0 as a,o as c,F as s}from"./CfJSWYGO.js";const n={class:"demo-card"},v=`#include <iostream>
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
}`,l=t({__name:"CPP14OperatorOverloading",setup(i){return(p,e)=>(c(),r("div",n,[e[0]||(e[0]=o("h3",null,"🌰 运算符重载：让自定义类型更自然",-1)),o("pre",{class:"code-block"},[o("code",null,d(v))]),e[1]||(e[1]=a('<div class="tips-box" data-v-568859eb><p data-v-568859eb><strong data-v-568859eb>运算符重载规则：</strong></p><ul data-v-568859eb><li data-v-568859eb><code data-v-568859eb>operator+</code> 返回新对象（不修改操作数）</li><li data-v-568859eb><code data-v-568859eb>operator+=</code> 返回引用（修改左操作数）</li><li data-v-568859eb><code data-v-568859eb>operator==</code> 和 <code data-v-568859eb>operator!=</code> 应成对实现</li><li data-v-568859eb>不能重载的运算符：<code data-v-568859eb>::</code> <code data-v-568859eb>.</code> <code data-v-568859eb>.*</code> <code data-v-568859eb>?:</code></li></ul></div>',1))]))}}),b=s(l,[["__scopeId","data-v-568859eb"]]);export{b as default};
