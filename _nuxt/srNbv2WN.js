import{d as a,b as s,e as t,f as d,a0 as o,o as n,I as b}from"./DutfXOOr.js";const c={class:"demo-card"},i=`#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    // 构造函数
    Person(const std::string& n, int a) : name(n), age(a) {}

    // const 成员函数（不修改对象状态）
    void introduce() const {
        std::cout << "我叫 " << name << "，今年 " << age << " 岁。" << std::endl;
    }

    // getter
    std::string getName() const { return name; }
    int getAge() const { return age; }

    // setter
    void setAge(int a) {
        if (a >= 0 && a <= 150) {
            age = a;
        }
    }
};

int main() {
    Person p("栗子", 3);
    p.introduce();

    p.setAge(4);
    std::cout << p.getName() << " 现在 " << p.getAge() << " 岁了。" << std::endl;
    return 0;
}`,r=a({__name:"CPP09ClassesObjects",setup(l){return(p,e)=>(n(),s("div",c,[e[0]||(e[0]=t("h3",null,"🌰 类与对象：封装、访问控制与 this 指针",-1)),t("pre",{class:"code-block"},[t("code",null,d(i))]),e[1]||(e[1]=o('<div class="tips-box" data-v-e07fbbb3><p data-v-e07fbbb3><strong data-v-e07fbbb3>封装要点：</strong></p><ul data-v-e07fbbb3><li data-v-e07fbbb3>数据成员设为 <code data-v-e07fbbb3>private</code>，通过 <code data-v-e07fbbb3>public</code> 成员函数访问</li><li data-v-e07fbbb3><code data-v-e07fbbb3>const</code> 成员函数承诺不修改对象状态</li><li data-v-e07fbbb3>使用初始化列表（<code data-v-e07fbbb3>: member(val)</code>）而非在函数体内赋值</li><li data-v-e07fbbb3><code data-v-e07fbbb3>this</code> 指针指向调用该函数的对象</li></ul></div>',1))]))}}),f=b(r,[["__scopeId","data-v-e07fbbb3"]]);export{f as default};
