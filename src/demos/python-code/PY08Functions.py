# ════════════════════════════════════════════
# 1. def 定义函数与返回值
# ════════════════════════════════════════════

def no_return():
    pass                              # 没有 return，结果默认是 None

print(no_return())                    # 结果：None


def min_max(numbers):
    return min(numbers), max(numbers)  # 逗号分隔其实返回一个元组

pair = min_max([3, 1, 4, 1, 5])
print(pair)                           # 结果：(1, 5)
low, high = min_max([3, 1, 4])        # 元组可直接解包成两个名字
print(low, high)                      # 结果：1 4


# ════════════════════════════════════════════
# 2. 默认参数与关键字参数
# ════════════════════════════════════════════

def greet(name, greeting="你好"):        # greeting 是默认参数，必须排在必填参数之后
    return f"{greeting}，{name}"

print(greet("小明"))                     # 结果：你好，小明
print(greet("小明", "早上好"))           # 结果：早上好，小明（位置传参）
print(greet("小明", greeting="嗨"))      # 结果：嗨，小明（关键字传参，顺序随意）


# ════════════════════════════════════════════
# 3. *args 与 **kwargs 收集变参
# ════════════════════════════════════════════

def report(title, *tags, **meta):        # *tags 收位置实参，**meta 收关键字实参
    print("标题:", title)
    print("标签:", tags)                 # 说明：tags 是元组
    print("附加:", meta)                 # 说明：meta 是字典

report("周报", "前端", "复盘", author="小明", week=42)
# 结果：标题: 周报 / 标签: ('前端', '复盘') / 附加: {'author': '小明', 'week': 42}


# ════════════════════════════════════════════
# 4. 调用处解包：星号的反向用法
# ════════════════════════════════════════════

args = ["小明", "晚上好"]
kwargs = {"name": "小红", "greeting": "早安"}

print(greet(*args))                   # 结果：晚上好，小明（列表展开成位置实参）
print(greet(**kwargs))                # 结果：早安，小红（字典展开成关键字实参）


# ════════════════════════════════════════════
# 5. LEGB 作用域查找
# ════════════════════════════════════════════

level = "模块级"                        # Global：模块作用域的名字

def outer():
    level = "外层"                      # Enclosing：外层函数的局部名字

    def inner():
        level = "内层"                  # Local：内层函数的局部名字
        return level                    # 按 LEGB，就近先拿到"内层"

    return inner()

print(outer())                        # 结果：内层
print(level)                          # 结果：模块级（未改动全局名字）


# ════════════════════════════════════════════
# 6. 可变默认参数陷阱
# ════════════════════════════════════════════

def add_bad(item, box=[]):            # 默认值 [] 只在定义时创建一次
    box.append(item)
    return box

print(add_bad("栗子"))                # 结果：['栗子']
print(add_bad("橡果"))                # 结果：['栗子', '橡果']，跨调用累积了


def add_ok(item, box=None):           # 用 None 占位，进入函数后再新建列表
    if box is None:
        box = []
    box.append(item)
    return box

print(add_ok("栗子"))                 # 结果：['栗子']
print(add_ok("橡果"))                 # 结果：['橡果']，每次都独立


# ════════════════════════════════════════════
# 7. lambda 与函数是一等对象
# ════════════════════════════════════════════

double = lambda x: x * 2              # lambda 是匿名的单表达式函数
print(double(21))                     # 结果：42

numbers = [3, 1, 2]
print(sorted(numbers, key=lambda n: -n))  # 结果：[3, 2, 1]（函数作为参数传入）
