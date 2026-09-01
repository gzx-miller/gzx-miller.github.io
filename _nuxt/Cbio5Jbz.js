import{d,b as o,e,f as n,a0 as s,o as a,I as c}from"./DutfXOOr.js";const i={class:"demo-card"},r=`// 常用设计模式在 C++ 中的实现
#include <iostream>
#include <memory>
#include <vector>
#include <functional>

// 1. 单例模式（Meyer's Singleton）
class Singleton {
private:
    Singleton() = default;

public:
    static Singleton& getInstance() {
        static Singleton instance;  // C++11 线程安全
        return instance;
    }

    void doSomething() {
        std::cout << "单例方法" << std::endl;
    }

    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
};

// 2. 工厂模式
class Product {
public:
    virtual void use() = 0;
    virtual ~Product() = default;
};

class ConcreteProductA : public Product {
public:
    void use() override {
        std::cout << "使用产品 A" << std::endl;
    }
};

class ConcreteProductB : public Product {
public:
    void use() override {
        std::cout << "使用产品 B" << std::endl;
    }
};

std::unique_ptr<Product> createProduct(char type) {
    if (type == 'A') {
        return std::make_unique<ConcreteProductA>();
    } else {
        return std::make_unique<ConcreteProductB>();
    }
}

// 3. 观察者模式（使用 std::function）
class Subject {
private:
    std::vector<std::function<void(int)>> observers;

public:
    void attach(std::function<void(int)> observer) {
        observers.push_back(observer);
    }

    void notify(int value) {
        for (const auto& obs : observers) {
            obs(value);
        }
    }
};

int main() {
    // 单例
    Singleton::getInstance().doSomething();

    // 工厂
    auto product = createProduct('A');
    product->use();

    // 观察者
    Subject subject;
    subject.attach([](int x) {
        std::cout << "观察者1收到: " << x << std::endl;
    });
    subject.attach([](int x) {
        std::cout << "观察者2收到: " << x << std::endl;
    });
    subject.notify(42);

    return 0;
}`,u=d({__name:"CPP29DesignPatterns",setup(l){return(v,t)=>(a(),o("div",i,[t[0]||(t[0]=e("h3",null,"🌰 常用设计模式在 C++ 中的实现",-1)),e("pre",{class:"code-block"},[e("code",null,n(r))]),t[1]||(t[1]=s('<div class="tips-box" data-v-bd7d08ca><p data-v-bd7d08ca><strong data-v-bd7d08ca>设计模式要点：</strong></p><ul data-v-bd7d08ca><li data-v-bd7d08ca><strong data-v-bd7d08ca>单例</strong>：Meyer&#39;s Singleton（函数局部 static）是推荐实现</li><li data-v-bd7d08ca><strong data-v-bd7d08ca>工厂</strong>：返回 unique_ptr&lt;Base&gt;，调用者不需要关心删除</li><li data-v-bd7d08ca><strong data-v-bd7d08ca>观察者</strong>：可用 std::function 替代接口继承，更灵活</li><li data-v-bd7d08ca><strong data-v-bd7d08ca>策略</strong>：可用模板或 std::function 实现，比继承更灵活</li></ul></div>',1))]))}}),p=c(u,[["__scopeId","data-v-bd7d08ca"]]);export{p as default};
