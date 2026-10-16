# ════════════════════════════════════════════
# 1. try/except/else/finally 的执行顺序
# ════════════════════════════════════════════

def divide(a, b):
    try:
        result = a / b                # try：正常流程
    except ZeroDivisionError as error:
        print("捕获到除零:", error)  # except：出错时执行
        return None
    else:
        print("一切正常，结果", result)   # else：无异常时执行
        return result
    finally:
        print("finally 一定会执行")   # finally：无论如何都执行

print(divide(10, 2))
# 结果：一切正常，结果 5.0 / finally 一定会执行 / 5.0
print(divide(10, 0))
# 结果：捕获到除零: division by zero / finally 一定会执行 / None


# ════════════════════════════════════════════
# 2. 捕获多种异常与 except 顺序
# ════════════════════════════════════════════

def to_int(text):
    try:
        return int(text)
    except (ValueError, TypeError) as error:   # 一次接住多种类型
        print("无法转换:", error)
        return None

print(to_int("42"))                   # 结果：42
print(to_int("abc"))                  # 结果：无法转换: ... / None

def pick(first):
    try:
        return first[0]
    except IndexError:                # 具体的子类放在前面
        return "索引越界"
    except Exception:                 # 宽泛的兜底放在后面
        return "其他错误"

print(pick([]))                       # 结果：索引越界


# ════════════════════════════════════════════
# 3. 自定义异常类
# ════════════════════════════════════════════

class InsufficientBalance(Exception):
    """余额不足时抛出。"""            # 自定义异常通常继承 Exception

class Wallet:
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientBalance(f"余额 {self.balance} 不足以取出 {amount}")
        self.balance -= amount
        return self.balance

try:
    Wallet(50).withdraw(100)
except InsufficientBalance as error:
    print("业务异常:", error)         # 结果：业务异常: 余额 50 不足以取出 100


# ════════════════════════════════════════════
# 4. raise ... from 保留异常链
# ════════════════════════════════════════════

class ConfigError(Exception):
    pass

def load_config(text):
    try:
        return int(text)
    except ValueError as error:
        raise ConfigError("配置项不是整数") from error   # 说明：保留原始异常

try:
    load_config("abc")
except ConfigError as error:
    print("配置错误:", error)          # 结果：配置错误: 配置项不是整数
    print("起因是:", type(error.__cause__).__name__)   # 结果：起因是: ValueError


# ════════════════════════════════════════════
# 5. EAFP：先做，出错再处理
# ════════════════════════════════════════════

data = {"name": "小明"}

try:
    age = data["age"]                 # 直接取值，出错再说
except KeyError:
    age = 0                           # 结果：没有 age 键，回退为 0
print(age)                            # 结果：0
