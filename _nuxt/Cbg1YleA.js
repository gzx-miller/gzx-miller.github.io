const n=`// ═══════════════════════════════════════════
// 1. 类定义：数据成员与成员函数
// ═══════════════════════════════════════════

#include <iostream>
#include <string>

class Person {
public:
    Person(const std::string& n, int a) : name(n), age(a) {}   // 初始化列表构造
    void introduce() const {
        std::cout << "我叫 " << name << "，今年 " << age << " 岁。" << std::endl;
    }
private:
    std::string name;                      // 数据成员：每个对象一份
    int age;
};

int main() {
    Person p("栗子", 3);
    p.introduce();                         // 输出：我叫 栗子，今年 3 岁。
    return 0;
}

// ═══════════════════════════════════════════
// 2. 访问控制：public / protected / private
// ═══════════════════════════════════════════

class Account {
public:
    explicit Account(const std::string& i, double b) : id(i), balance(b) {}
    double getBalance() const { return balance; }        // 只读接口
    void deposit(double amount) {                        // 受控修改
        if (amount > 0) balance += amount;               // 校验收拢在类内
    }
protected:
    double balance;                        // 派生类可访问，外部不可
private:
    std::string id;                        // 仅本类内部可访问
};

int main() {
    Account acc("A001", 100);
    acc.deposit(50);
    std::cout << acc.getBalance() << std::endl;   // 输出：150
    // acc.balance = 0;                    // 编译错误：protected 成员外部不可访问
    return 0;
}

// ═══════════════════════════════════════════
// 3. this 指针与 const 成员函数
// ═══════════════════════════════════════════

class Counter {
public:
    Counter& increment() {
        ++count;                           // 等价于 ++this->count
        return *this;                      // 返回自身引用，支持链式调用
    }
    int value() const { return count; }    // const 成员函数承诺不修改对象
private:
    int count = 0;
};

int main() {
    Counter c;
    c.increment().increment();             // 链式调用，count 变为 2
    const Counter k;                       // const 对象只能调用 const 成员
    std::cout << c.value() << std::endl;   // 输出：2
    std::cout << k.value() << std::endl;   // 输出：0
    return 0;
}

// ═══════════════════════════════════════════
// 4. 静态成员与友元
// ═══════════════════════════════════════════

class Registry {
public:
    static int total;                      // 静态数据成员：属于类，所有对象共用
    static int getTotal() { return total; }   // 静态成员函数没有 this
    friend void reset(Registry& r);        // 友元：可访问本类 private 成员
private:
    int local = 0;
};

int Registry::total = 0;                   // 静态成员需在类外定义

void reset(Registry& r) {
    r.local = 0;                           // 友元函数直接访问私有成员
    Registry::total = 0;
}

int main() {
    Registry r;
    Registry::total = 5;
    std::cout << Registry::getTotal() << std::endl;   // 输出：5
    reset(r);
    std::cout << Registry::getTotal() << std::endl;   // 输出：0
    return 0;
}

// ═══════════════════════════════════════════
// 5. struct 与 class：只差默认访问权限
// ═══════════════════════════════════════════

struct Point {                             // struct 成员默认 public
    int x;
    int y;
};

class Vector {                             // class 成员默认 private
public:
    Vector(int x, int y) : x(x), y(y) {}
    int sum() const { return x + y; }
private:
    int x;
    int y;
};

int main() {
    Point p{1, 2};
    p.x = 3;                               // 合法：成员公有
    int total = p.x + p.y;                 // 结果：5
    Vector v(1, 2);
    std::cout << v.sum() << std::endl;     // 输出：3
    return 0;
}
`;export{n as default};
