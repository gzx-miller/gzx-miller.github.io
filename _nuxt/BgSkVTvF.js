import{d as s,b as a,e as t,f as d,a0 as o,o as r,I as u}from"./DutfXOOr.js";const c={class:"demo-card"},p=`#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource 构造" << std::endl; }
    ~Resource() { std::cout << "Resource 析构" << std::endl; }
    void use() { std::cout << "使用资源" << std::endl; }
};

int main() {
    // unique_ptr：独占所有权
    std::unique_ptr<Resource> up = std::make_unique<Resource>();
    up->use();
    // unique_ptr 不能拷贝，只能移动
    std::unique_ptr<Resource> up2 = std::move(up);  // 所有权转移
    // up 现在是 nullptr

    // shared_ptr：共享所有权
    std::shared_ptr<Resource> sp1 = std::make_shared<Resource>();
    {
        std::shared_ptr<Resource> sp2 = sp1;  // 引用计数 +1
        std::cout << "引用计数：" << sp1.use_count() << std::endl;  // 2
    }  // sp2 析构，引用计数 -1

    std::cout << "引用计数：" << sp1.use_count() << std::endl;  // 1

    // weak_ptr：弱引用（打破循环引用）
    std::weak_ptr<Resource> wp = sp1;  // 不增加引用计数
    if (auto sp3 = wp.lock()) {  // 提升为 shared_ptr
        sp3->use();
    }

    return 0;
}`,n=s({__name:"CPP20SmartPointers",setup(i){return(l,e)=>(r(),a("div",c,[e[0]||(e[0]=t("h3",null,"🌰 智能指针：unique_ptr、shared_ptr、weak_ptr",-1)),t("pre",{class:"code-block"},[t("code",null,d(p))]),e[1]||(e[1]=o('<div class="tips-box" data-v-3e44eb07><p data-v-3e44eb07><strong data-v-3e44eb07>智能指针选择：</strong></p><ul data-v-3e44eb07><li data-v-3e44eb07><code data-v-3e44eb07>unique_ptr</code>：独占所有权（首选，零开销）</li><li data-v-3e44eb07><code data-v-3e44eb07>shared_ptr</code>：共享所有权（需要引用计数）</li><li data-v-3e44eb07><code data-v-3e44eb07>weak_ptr</code>：弱引用（打破循环引用）</li></ul><p data-v-3e44eb07><strong data-v-3e44eb07>最佳实践：</strong></p><ul data-v-3e44eb07><li data-v-3e44eb07>使用 <code data-v-3e44eb07>make_unique</code> 和 <code data-v-3e44eb07>make_shared</code> 创建</li><li data-v-3e44eb07>避免用同一个原始指针构造多个 shared_ptr</li><li data-v-3e44eb07>不要用 <code data-v-3e44eb07>this</code> 构造 shared_ptr（用 <code data-v-3e44eb07>enable_shared_from_this</code>）</li></ul></div>',1))]))}}),b=u(n,[["__scopeId","data-v-3e44eb07"]]);export{b as default};
