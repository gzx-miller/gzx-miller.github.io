import{d as e,b as a,e as d,f as c,a0 as o,o as s,I as r}from"./DutfXOOr.js";const n={class:"demo-card"},u=`#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
#include <async>
#include <future>

std::mutex coutMutex;

void printThreadId(int id) {
    std::lock_guard<std::mutex> lock(coutMutex);
    std::cout << "线程 " << id << " 正在执行" << std::endl;
}

int calculateSquare(int x) {
    return x * x;
}

int main() {
    // 创建线程
    std::thread t1(printThreadId, 1);
    std::thread t2(printThreadId, 2);

    t1.join();
    t2.join();

    // 使用 async 异步任务
    std::future<int> result = std::async(calculateSquare, 42);
    std::cout << "42 的平方是: " << result.get() << std::endl;

    // 线程安全的计数器
    int counter = 0;
    std::mutex counterMutex;
    std::vector<std::thread> threads;

    for (int i = 0; i < 10; ++i) {
        threads.emplace_back([&]() {
            std::lock_guard<std::mutex> lock(counterMutex);
            ++counter;
        });
    }

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "计数器最终值: " << counter << std::endl;
    return 0;
}`,i=e({__name:"CPP25Concurrency",setup(l){return(v,t)=>(s(),a("div",n,[t[0]||(t[0]=d("h3",null,"🌰 并发编程：std::thread、mutex、async",-1)),d("pre",{class:"code-block"},[d("code",null,c(u))]),t[1]||(t[1]=o('<div class="tips-box" data-v-386d7c4e><p data-v-386d7c4e><strong data-v-386d7c4e>并发要点：</strong></p><ul data-v-386d7c4e><li data-v-386d7c4e><code data-v-386d7c4e>std::thread</code>：创建和管理线程</li><li data-v-386d7c4e><code data-v-386d7c4e>std::mutex</code> + <code data-v-386d7c4e>std::lock_guard</code>：保护共享数据</li><li data-v-386d7c4e><code data-v-386d7c4e>std::async</code>：启动异步任务，返回 <code data-v-386d7c4e>std::future</code></li><li data-v-386d7c4e><code data-v-386d7c4e>std::condition_variable</code>：线程间通信</li></ul><p data-v-386d7c4e><strong data-v-386d7c4e>数据竞争避免：</strong></p><ul data-v-386d7c4e><li data-v-386d7c4e>使用互斥锁保护共享数据</li><li data-v-386d7c4e>优先使用 <code data-v-386d7c4e>std::lock_guard</code> 或 <code data-v-386d7c4e>std::unique_lock</code>（RAII）</li><li data-v-386d7c4e>避免在锁内执行耗时操作</li></ul></div>',1))]))}}),x=r(i,[["__scopeId","data-v-386d7c4e"]]);export{x as default};
