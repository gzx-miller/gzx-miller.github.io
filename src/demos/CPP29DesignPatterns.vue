<script setup lang="ts">
const cppCode = `// 常用设计模式在 C++ 中的实现
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
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 常用设计模式在 C++ 中的实现</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>设计模式要点：</strong></p>
      <ul>
        <li><strong>单例</strong>：Meyer's Singleton（函数局部 static）是推荐实现</li>
        <li><strong>工厂</strong>：返回 unique_ptr&lt;Base&gt;，调用者不需要关心删除</li>
        <li><strong>观察者</strong>：可用 std::function 替代接口继承，更灵活</li>
        <li><strong>策略</strong>：可用模板或 std::function 实现，比继承更灵活</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  background: #1e1e2e;
  color: #e0e0e0;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  overflow-x: auto;
  line-height: 1.6;
  margin-bottom: 12px;
}
.tips-box {
  background: #f0f7ff;
  padding: 10px;
  border-radius: 6px;
  border-left: 3px solid #0891b2;
  margin-top: 10px;
}
ul {
  padding-left: 18px;
  font-size: 13px;
}
</style>
