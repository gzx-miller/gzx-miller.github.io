# ════════════════════════════════════════════
# 1. 生成器函数与 for 遍历
# ════════════════════════════════════════════

def squares(limit):
    for n in range(limit):
        yield n * n               # 每次迭代产出平方，暂停后继续

for value in squares(5):
    print(value, end=" ")         # 结果：0 1 4 9 16
print()


# ════════════════════════════════════════════
# 2. next() 手动推进与 StopIteration
# ════════════════════════════════════════════

def countdown(n):
    while n > 0:
        yield n                   # 说明：产出当前值后在此暂停
        n -= 1

gen = countdown(3)
print(next(gen))                 # 结果：3
print(next(gen))                 # 结果：2
print(next(gen))                 # 结果：1
try:
    next(gen)                    # 已经耗尽，再取会抛出异常
except StopIteration:
    print("生成器已耗尽")        # 结果：生成器已耗尽


# ════════════════════════════════════════════
# 3. yield from 委托给另一个可迭代对象
# ════════════════════════════════════════════

def chain(*iterables):
    for part in iterables:
        yield from part          # 把子序列的每个元素原样转发出去

print(list(chain([1, 2], (3, 4), "56")))   # 结果：[1, 2, 3, 4, '5', '6']


# ════════════════════════════════════════════
# 4. 无限序列：惰性求值不占内存
# ════════════════════════════════════════════

def natural_numbers():
    n = 1
    while True:                  # 死循环本身不会卡死，因为只在被取用时才算
        yield n                  # 说明：交出一个值立即暂停
        n += 1

numbers = natural_numbers()
first_five = [next(numbers) for _ in range(5)]
print(first_five)                # 结果：[1, 2, 3, 4, 5]


# ════════════════════════════════════════════
# 5. 生成器表达式（惰性，区别于列表推导）
# ════════════════════════════════════════════

lazy = (x * x for x in range(6))      # 圆括号：生成器表达式，按需计算
print(sum(lazy))                 # 结果：55（0+1+4+9+16+25）

eager = [x * x for x in range(6)]     # 方括号：列表推导，立刻造好整个列表
print(eager)                     # 结果：[0, 1, 4, 9, 16, 25]


# ════════════════════════════════════════════
# 6. 自定义迭代器类（__iter__ / __next__）
# ════════════════════════════════════════════

class Fib:
    def __init__(self, limit):
        self.limit = limit
        self.index = 0
        self.a, self.b = 0, 1

    def __iter__(self):
        return self                  # 说明：迭代器返回自身

    def __next__(self):
        if self.index >= self.limit:
            raise StopIteration      # 说明：取完主动抛出，for 才会停下
        value = self.a
        self.a, self.b = self.b, self.a + self.b
        self.index += 1
        return value

print(list(Fib(7)))               # 结果：[0, 1, 1, 2, 3, 5, 8]
