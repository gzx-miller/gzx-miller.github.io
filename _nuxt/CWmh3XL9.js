const n=`#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    Person(const std::string& n, int a) : name(n), age(a) {}

    void introduce() const {
        std::cout << "我叫 " << name << "，今年 " << age << " 岁。" << std::endl;
    }
};

int main() {
    Person p("栗子", 3);
    p.introduce();
    return 0;
}`;export{n as default};
