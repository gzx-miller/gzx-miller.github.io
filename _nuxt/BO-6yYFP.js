const n=`#include <iostream>
#include <memory>

// 抽象基类
class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override {
        return 3.14159 * radius * radius;
    }
};

int main() {
    std::unique_ptr<Shape> shape = std::make_unique<Circle>(5.0);
    std::cout << "面积：" << shape->area() << std::endl;
    return 0;
}`;export{n as default};
