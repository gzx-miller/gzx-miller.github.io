import{d as e,b as a,e as d,f as o,a0 as c,o as s,F as r}from"./CfJSWYGO.js";const n={class:"demo-card"},u=`#include <iostream>
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
}`,i=e({__name:"CPP25Concurrency",setup(l){return(v,t)=>(s(),a("div",n,[t[0]||(t[0]=d("h3",null,"🌰 并发编程：std::thread、mutex、async",-1)),d("pre",{class:"code-block"},[d("code",null,o(u))]),t[1]||(t[1]=c('<div class="tips-box" data-v-b5681290><p data-v-b5681290><strong data-v-b5681290>并发要点：</strong></p><ul data-v-b5681290><li data-v-b5681290><code data-v-b5681290>std::thread</code>：创建和管理线程</li><li data-v-b5681290><code data-v-b5681290>std::mutex</code> + <code data-v-b5681290>std::lock_guard</code>：保护共享数据</li><li data-v-b5681290><code data-v-b5681290>std::async</code>：启动异步任务，返回 <code data-v-b5681290>std::future</code></li><li data-v-b5681290><code data-v-b5681290>std::condition_variable</code>：线程间通信</li></ul><p data-v-b5681290><strong data-v-b5681290>数据竞争避免：</strong></p><ul data-v-b5681290><li data-v-b5681290>使用互斥锁保护共享数据</li><li data-v-b5681290>优先使用 <code data-v-b5681290>std::lock_guard</code> 或 <code data-v-b5681290>std::unique_lock</code>（RAII）</li><li data-v-b5681290>避免在锁内执行耗时操作</li></ul></div>',1))]))}}),p=r(i,[["__scopeId","data-v-b5681290"]]);export{p as default};
