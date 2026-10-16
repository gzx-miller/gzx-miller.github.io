const n=`# ═══════════════════════════════════════════
# 1. async def 与 await：可以暂停的协程
# ═══════════════════════════════════════════

import asyncio
import time

async def fetch(name: str, delay: float) -> str:
    await asyncio.sleep(delay)        # 挂起本协程，控制权交回事件循环
    return f"{name} 完成于 {delay}s"

async def serial() -> list[str]:
    results = []
    for name, delay in [("A", 0.03), ("B", 0.05), ("C", 0.04)]:
        results.append(await fetch(name, delay))   # 逐个等待，总耗时相加
    return results

# ═══════════════════════════════════════════
# 2. asyncio.gather：一次性并发多个协程
# ═══════════════════════════════════════════

async def gathered() -> list[str]:
    return await asyncio.gather(      # 三个请求同时开始等待
        fetch("A", 0.03),
        fetch("B", 0.05),
        fetch("C", 0.04),
    )                                 # 结果按传入顺序返回，总耗时接近最慢的

# ═══════════════════════════════════════════
# 3. create_task：先启动，稍后再取结果
# ═══════════════════════════════════════════

async def with_tasks() -> str:
    task = asyncio.create_task(fetch("D", 0.02))   # 立刻排入事件循环
    print("先去做别的事")                            # 任务已在后台跑
    return await task                              # 需要结果时再 await

# ═══════════════════════════════════════════
# 4. wait_for：给等待设上限并支持取消
# ═══════════════════════════════════════════

async def with_timeout() -> str:
    try:
        return await asyncio.wait_for(fetch("E", 0.5), timeout=0.05)
    except asyncio.TimeoutError:
        return "超时被取消"                          # 超时的协程会被取消

# ═══════════════════════════════════════════
# 5. asyncio.run：脚本级唯一入口
# ═══════════════════════════════════════════

async def main() -> None:
    t0 = time.perf_counter()
    print(await serial())             # 结果：总耗时约 0.12s
    serial_cost = time.perf_counter() - t0

    t0 = time.perf_counter()
    print(await gathered())           # 结果：总耗时约 0.05s，明显更短
    gather_cost = time.perf_counter() - t0

    print(serial_cost > gather_cost)  # 结果：True，并发比逐个 await 更快
    print(await with_tasks())         # 结果：D 完成于 0.02s
    print(await with_timeout())       # 结果：超时被取消

if __name__ == "__main__":
    asyncio.run(main())               # 创建事件循环，跑完入口协程后关闭
`;export{n as default};
