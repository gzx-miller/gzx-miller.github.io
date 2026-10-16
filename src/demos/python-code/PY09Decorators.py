# ════════════════════════════════════════════
# 1. 闭包：内层函数记住外层变量
# ════════════════════════════════════════════

def make_multiplier(factor):
    def multiply(number):
        return number * factor      # 说明：multiply 记住了外层变量 factor
    return multiply                 # 说明：返回的是函数对象，不是调用结果

double = make_multiplier(2)
print(double(21))                   # 结果：42

triple = make_multiplier(3)
print(triple(21))                   # 结果：63，每次调用都生成独立闭包


# ════════════════════════════════════════════
# 2. 手写一个计时装饰器
# ════════════════════════════════════════════

import time

def timer(func):
    def wrapper(*args, **kwargs):   # 说明：*args/**kwargs 让包装层支持任意签名
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} 耗时 {elapsed:.6f} 秒")
        return result
    return wrapper

@timer
def sum_to(n):
    return sum(range(n + 1))

print(sum_to(100000))               # 结果：5000050000，并打印一行耗时


# ════════════════════════════════════════════
# 3. functools.wraps 保住元信息
# ════════════════════════════════════════════

import functools

def logged(func):
    @functools.wraps(func)          # 说明：把原函数的名字与文档复制到 wrapper
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logged
def hello(name):
    """向某人问好。"""
    return f"你好，{name}"

hello("小明")                        # 结果：先打印"调用 hello"，再返回字符串
print(hello.__name__)               # 结果：hello（没有 wraps 的话会是 wrapper）


# ════════════════════════════════════════════
# 4. 带参数的装饰器（三层嵌套）
# ════════════════════════════════════════════

def repeat(n):                      # 第 1 层：接收配置参数
    def decorator(func):            # 第 2 层：接收被装饰的函数
        @functools.wraps(func)
        def wrapper(*args, **kwargs):   # 第 3 层：真正执行
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def cheer():
    print("加油")

cheer()                             # 结果：连续打印三次"加油"


# ════════════════════════════════════════════
# 5. 多个装饰器叠加：从下往上包裹
# ════════════════════════════════════════════

def bold(func):
    def wrapper(*args, **kwargs):
        return f"[{func(*args, **kwargs)}]"
    return wrapper

def star(func):
    def wrapper(*args, **kwargs):
        return f"*{func(*args, **kwargs)}*"
    return wrapper

@bold                               # 最外层，最后包裹
@star                               # 靠近函数，先包裹
def word():
    return "嗨"

print(word())                       # 结果：[ *嗨* ]，先加星号再加方括号


# ════════════════════════════════════════════
# 6. functools.lru_cache 缓存结果
# ════════════════════════════════════════════

@functools.lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)  # 说明：相同参数直接命中缓存

print(fib(30))                      # 结果：832040，重复子问题不再重算
print(fib.cache_info().hits)        # 结果：缓存命中次数（远大于递归次数）
