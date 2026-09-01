import{d as t,b as s,e,f as d,a0 as o,o as r,I as i}from"./DutfXOOr.js";const l={class:"demo-card"},c=`#include <iostream>
#include <vector>
#include <memory>

// 抽象基类（有纯虚函数）
class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数
    virtual void draw() const = 0;
    virtual ~Shape() {}  // 虚析构函数
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    double area() const override {
        return 3.14159 * radius * radius;
    }

    void draw() const override {
        std::cout << "○ 圆形（半径：" << radius << "）" << std::endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() const override {
        return width * height;
    }

    void draw() const override {
        std::cout << "▭ 矩形（" << width << "×" << height << "）" << std::endl;
    }
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));

    for (const auto& shape : shapes) {
        shape->draw();
        std::cout << "面积：" << shape->area() << std::endl;
    }
    return 0;
}`,u=t({__name:"CPP13Polymorphism",setup(n){return(p,a)=>(r(),s("div",l,[a[0]||(a[0]=e("h3",null,"🌰 多态与虚函数：动态绑定与虚函数表",-1)),e("pre",{class:"code-block"},[e("code",null,d(c))]),a[1]||(a[1]=o('<div class="tips-box" data-v-290e7a01><p data-v-290e7a01><strong data-v-290e7a01>多态实现机制：</strong></p><ul data-v-290e7a01><li data-v-290e7a01>包含虚函数的类有<strong data-v-290e7a01>虚函数表</strong>（vtable）</li><li data-v-290e7a01>每个对象有指向 vtable 的指针（vptr）</li><li data-v-290e7a01>调用虚函数时通过 vptr 找到正确的函数</li></ul><p data-v-290e7a01><strong data-v-290e7a01>纯虚函数与抽象类：</strong></p><ul data-v-290e7a01><li data-v-290e7a01><code data-v-290e7a01>= 0</code> 标记纯虚函数</li><li data-v-290e7a01>有纯虚函数的类是<strong data-v-290e7a01>抽象类</strong>，不能实例化</li><li data-v-290e7a01>派生类必须重写所有纯虚函数才能实例化</li></ul></div>',1))]))}}),h=i(u,[["__scopeId","data-v-290e7a01"]]);export{h as default};
