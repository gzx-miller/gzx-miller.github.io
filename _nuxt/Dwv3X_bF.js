const n=`# ═══════════════════════════════════════════
# 1. threading + Lock：共享计数器要加锁
# ═══════════════════════════════════════════

import threading
import time

counter = 0
lock = threading.Lock()

def worker() -> None:
    global counter
    for _ in range(1000):
        with lock:                    # 临界区加锁，避免读-改-写竞态
            counter += 1

threads = [threading.Thread(target=worker) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()                          # 等所有线程结束

print(counter)                        # 结果：4000，加锁后不会丢计数

# ═══════════════════════════════════════════
# 2. GIL 现象：纯计算线程不加速
# ═══════════════════════════════════════════

def busy(n: int) -> int:
    return sum(i * i for i in range(n))   # 纯 Python 计算，全程持有 GIL

t0 = time.perf_counter()
busy(300_000)
serial_cost = time.perf_counter() - t0
print(round(serial_cost, 3) >= 0)     # 结果：True，串行单次耗时被记录

t0 = time.perf_counter()
ts = [threading.Thread(target=busy, args=(300_000,)) for _ in range(2)]
for t in ts:
    t.start()
for t in ts:
    t.join()
thread_cost = time.perf_counter() - t0
print(thread_cost)                    # 结果：与串行两次耗时接近，GIL 下难并行

# ═══════════════════════════════════════════
# 3. ThreadPoolExecutor.map：I/O 密集首选
# ═══════════════════════════════════════════

from concurrent.futures import ThreadPoolExecutor

def fetch(url: str) -> str:
    time.sleep(0.1)                   # 模拟一次网络等待（等待时释放 GIL）
    return f"done:{url}"

urls = ["a", "b", "c", "d"]
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(fetch, urls))   # 结果顺序与输入一致
print(results)                        # 结果：['done:a', 'done:b', 'done:c', 'done:d']

# ═══════════════════════════════════════════
# 4. ProcessPoolExecutor：CPU 密集绕开 GIL
# ═══════════════════════════════════════════

from concurrent.futures import ProcessPoolExecutor, as_completed

def compute(n: int) -> int:
    return sum(i * i for i in range(n))         # 顶层函数才能被 pickle 传递

if __name__ == "__main__":                      # Windows 上多进程入口必须加保护
    with ProcessPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(compute, 200_000) for _ in range(4)]
        for done in as_completed(futures):      # 谁先算完就先产出谁
            print(done.result())                # 结果：4 个相同的平方和
`;export{n as default};
