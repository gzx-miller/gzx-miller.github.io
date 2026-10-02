import{d as e,b as d,e as t,f as s,a0 as c,o,F as n}from"./CfJSWYGO.js";const i={class:"demo-card"},r=`#include <iostream>
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
}`,l=e({__name:"CPP09ClassesObjects",setup(p){return(b,a)=>(o(),d("div",i,[a[0]||(a[0]=t("h3",null,"🌰 类与对象：封装、访问控制与 this 指针",-1)),t("pre",{class:"code-block"},[t("code",null,s(r))]),a[1]||(a[1]=c('<div class="tips-box" data-v-1a5c4db1><p data-v-1a5c4db1><strong data-v-1a5c4db1>封装要点：</strong></p><ul data-v-1a5c4db1><li data-v-1a5c4db1>数据成员设为 <code data-v-1a5c4db1>private</code>，通过 <code data-v-1a5c4db1>public</code> 成员函数访问</li><li data-v-1a5c4db1><code data-v-1a5c4db1>const</code> 成员函数承诺不修改对象状态</li><li data-v-1a5c4db1>使用初始化列表（<code data-v-1a5c4db1>: member(val)</code>）而非在函数体内赋值</li><li data-v-1a5c4db1><code data-v-1a5c4db1>this</code> 指针指向调用该函数的对象</li></ul></div>',1))]))}}),g=n(l,[["__scopeId","data-v-1a5c4db1"]]);export{g as default};
