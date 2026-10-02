import{d as e,b as n,e as t,f as d,a0 as o,o as s,F as c}from"./CfJSWYGO.js";const l={class:"demo-card"},i=`#include <iostream>
#include <string>

// 基类
class Animal {
public:
    Animal(const std::string& n) : name(n) {
        std::cout << "Animal 构造：" << name << std::endl;
    }

    // 虚函数
    virtual void speak() const {
        std::cout << name << " 发出声音。" << std::endl;
    }

    // 虚析构函数（重要！）
    virtual ~Animal() {
        std::cout << "Animal 析构：" << name << std::endl;
    }

protected:
    std::string name;
};

// 派生类
class Dog : public Animal {
public:
    Dog(const std::string& n) : Animal(n) {
        std::cout << "Dog 构造：" << name << std::endl;
    }

    // 重写虚函数
    void speak() const override {
        std::cout << name << " 汪汪！" << std::endl;
    }

    ~Dog() {
        std::cout << "Dog 析构：" << name << std::endl;
    }
};

int main() {
    Dog dog("旺财");
    dog.speak();  // 旺财 汪汪！

    // 多态：通过基类指针调用派生类方法
    Animal* animal = new Dog("小黑");
    animal->speak();  // 小黑 汪汪！（动态绑定）

    delete animal;  // 正确调用 Dog 的析构函数
    return 0;
}`,r=e({__name:"CPP12Inheritance",setup(m){return(v,a)=>(s(),n("div",l,[a[0]||(a[0]=t("h3",null,"🌰 继承与派生类：基类、访问控制与切片",-1)),t("pre",{class:"code-block"},[t("code",null,d(i))]),a[1]||(a[1]=o('<div class="tips-box" data-v-fcea0132><p data-v-fcea0132><strong data-v-fcea0132>继承要点：</strong></p><ul data-v-fcea0132><li data-v-fcea0132><strong data-v-fcea0132>公有继承</strong>（<code data-v-fcea0132>class Dog : public Animal</code>）：is-a 关系</li><li data-v-fcea0132><strong data-v-fcea0132>虚函数</strong>：实现运行时多态</li><li data-v-fcea0132><strong data-v-fcea0132>override</strong>（C++11）：显式标记重写，编译器检查</li><li data-v-fcea0132><strong data-v-fcea0132>虚析构函数</strong>：确保通过基类指针删除派生类对象时正确清理</li></ul><p data-v-fcea0132><strong data-v-fcea0132>对象切片：</strong></p><ul data-v-fcea0132><li data-v-fcea0132><code data-v-fcea0132>Dog d; Animal a = d;</code> → 派生类部分被&quot;切掉&quot;</li><li data-v-fcea0132>应使用指针或引用：<code data-v-fcea0132>Animal* a = &amp;d;</code></li></ul></div>',1))]))}}),p=c(r,[["__scopeId","data-v-fcea0132"]]);export{p as default};
