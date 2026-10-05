const n=`#include <iostream>
#include <string>

// 基类
class Animal {
public:
    virtual void speak() const {
        std::cout << "动物发出声音。" << std::endl;
    }
    virtual ~Animal() {}
};

// 派生类
class Dog : public Animal {
public:
    void speak() const override {
        std::cout << "汪汪！" << std::endl;
    }
};

int main() {
    Dog dog;
    dog.speak();

    // 多态
    Animal* animal = new Dog();
    animal->speak();
    delete animal;

    return 0;
}`;export{n as default};
