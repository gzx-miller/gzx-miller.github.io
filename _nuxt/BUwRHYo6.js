const n=`// ═══════════════════════════════════════════
// 1. 静态绑定：非虚函数按指针类型决议
// ═══════════════════════════════════════════

#include <iostream>
#include <string>

class Base {
public:
    void who() { std::cout << "Base::who" << std::endl; }   // 非虚函数，不进入 vtable
};

class Derived : public Base {
public:
    void who() { std::cout << "Derived::who" << std::endl; }  // 只是隐藏，不是重写
};

// Base* p = new Derived; p->who();   // 输出 Base::who：按静态类型 Base 决议

// ═══════════════════════════════════════════
// 2. virtual 与 override：动态绑定生效
// ═══════════════════════════════════════════

class Animal {
public:
    virtual std::string speak() const { return "..."; }   // 虚函数，占用 vtable 槽位
    virtual ~Animal() {}                                  // 虚析构，见第 5 节
};

class Dog : public Animal {
public:
    std::string speak() const override { return "汪汪"; }  // override 由编译器校验签名
};

class Cat : public Animal {
public:
    std::string speak() const override { return "喵喵"; }  // 编译期确认确实重写了基类虚函数
};

void printSpeak(const Animal& a) {          // 引用调用 → 动态绑定
    std::cout << a.speak() << std::endl;    // Dog 传进来输出 汪汪，Cat 输出 喵喵
}

// ═══════════════════════════════════════════
// 3. 纯虚函数与抽象类：只定义接口
// ═══════════════════════════════════════════

class Shape {
public:
    virtual double area() const = 0;    // 纯虚函数 → Shape 成为抽象类
    virtual void draw() const = 0;
    virtual ~Shape() = default;
    // Shape s;                          // 编译错误：不能实例化含纯虚函数的抽象类
};

class Circle : public Shape {
    double r_;
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return 3.14159 * r_ * r_; }  // 必须实现全部纯虚函数
    void draw() const override { std::cout << "圆形 r=" << r_ << std::endl; }
};

// ═══════════════════════════════════════════
// 4. final：阻止派生类继续重写
// ═══════════════════════════════════════════

class Frame {
public:
    virtual void render() const final { std::cout << "Frame::render" << std::endl; }
};

// class FancyFrame : public Frame {
//     void render() const override;   // 编译错误：render 已被 final 修饰，禁止再重写
// };

// ═══════════════════════════════════════════
// 5. 虚析构函数：多态删除才不泄漏
// ═══════════════════════════════════════════

class Session {
public:
    virtual ~Session() { std::cout << "~Session" << std::endl; }   // 必须为 virtual
};

class FileSession : public Session {
public:
    ~FileSession() override { std::cout << "~FileSession" << std::endl; }  // 先于基类析构执行
};

// Session* s = new FileSession();
// delete s;    // 有虚析构：先 ~FileSession 再 ~Session 都被调用；否则只调用 ~Session

// ═══════════════════════════════════════════
// 6. vptr 与 vtable：动态绑定如何落地
// ═══════════════════════════════════════════

int main() {
    Animal* zoo[2] = { new Dog(), new Cat() };   // 同一个数组承载不同真实类型
    for (Animal* a : zoo) {
        std::cout << a->speak() << std::endl;    // 取 vptr → 查 vtable → 各调各自版本
        // 输出：汪汪 / 喵喵
    }
    for (Animal* a : zoo) delete a;              // 虚析构保证 Dog/Cat 完整释放
    return 0;                                    // 输出：~Animal 出现两次，无泄漏
}
`;export{n as default};
