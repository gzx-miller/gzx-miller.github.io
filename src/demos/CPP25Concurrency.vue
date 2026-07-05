<script setup lang="ts">
const cppCode = `#include <iostream>
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
}`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 并发编程：std::thread、mutex、async</h3>
    <pre class="code-block"><code>{{ cppCode }}</code></pre>
    <div class="tips-box">
      <p><strong>并发要点：</strong></p>
      <ul>
        <li><code>std::thread</code>：创建和管理线程</li>
        <li><code>std::mutex</code> + <code>std::lock_guard</code>：保护共享数据</li>
        <li><code>std::async</code>：启动异步任务，返回 <code>std::future</code></li>
        <li><code>std::condition_variable</code>：线程间通信</li>
      </ul>
      <p><strong>数据竞争避免：</strong></p>
      <ul>
        <li>使用互斥锁保护共享数据</li>
        <li>优先使用 <code>std::lock_guard</code> 或 <code>std::unique_lock</code>（RAII）</li>
        <li>避免在锁内执行耗时操作</li>
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
