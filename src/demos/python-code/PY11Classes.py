# ════════════════════════════════════════════
# 1. class 与 __init__、self
# ════════════════════════════════════════════

class Course:
    def __init__(self, name, hours):
        self.name = name          # 实例属性：每个对象各一份
        self.hours = hours

    def describe(self):           # 实例方法，第一个参数永远是 self
        return f"{self.name} 共 {self.hours} 学时"

python = Course("Python 入门", 12)
vue = Course("Vue3 实战", 20)
print(python.describe())          # 结果：Python 入门 共 12 学时
print(vue.name)                   # 结果：Vue3 实战


# ════════════════════════════════════════════
# 2. 实例属性 vs 类属性
# ════════════════════════════════════════════

class Student:
    school = "小松鼠学院"          # 类属性：写在类体里，全体共享

    def __init__(self, name):
        self.name = name          # 实例属性：每个对象独有的名字

a = Student("小明")
b = Student("小红")
print(a.school, b.school)         # 结果：小松鼠学院 小松鼠学院（读的是同一份类属性）

a.school = "新学院"               # 这只是给 a 新建了同名实例属性
print(a.school, b.school)         # 结果：新学院 小松鼠学院（b 依旧读类属性）
print(Student.school)             # 结果：小松鼠学院（类属性本身没变）


# ════════════════════════════════════════════
# 3. 可变类属性被共享的陷阱
# ════════════════════════════════════════════

class BadCart:
    items = []                    # 可变类属性：所有实例共享同一个列表

    def add(self, item):
        self.items.append(item)   # 说明：改的是共享的那一份

c1, c2 = BadCart(), BadCart()
c1.add("栗子")
print(c2.items)                   # 结果：['栗子']，c2 被无辜牵连


class GoodCart:
    def __init__(self):
        self.items = []           # 每个实例在 __init__ 里各自新建列表

    def add(self, item):
        self.items.append(item)

d1, d2 = GoodCart(), GoodCart()
d1.add("栗子")
print(d2.items)                   # 结果：[]，互不影响


# ════════════════════════════════════════════
# 4. classmethod 与 staticmethod
# ════════════════════════════════════════════

class Temperature:
    unit = "摄氏度"

    def __init__(self, value):
        self.value = value

    @classmethod
    def from_fahrenheit(cls, f):      # cls 指向类本身，可用来造实例
        return cls(round((f - 32) / 1.8, 1))

    @staticmethod
    def is_freezing(value):           # 与实例无关的纯工具函数
        return value <= 0

t = Temperature.from_fahrenheit(212)
print(t.value)                    # 结果：100.0
print(Temperature.is_freezing(-3))  # 结果：True


# ════════════════════════════════════════════
# 5. 属性查找顺序：先实例后类
# ════════════════════════════════════════════

print("school" in a.__dict__)     # 结果：True，a 自己也存了一份 school
print("school" in b.__dict__)     # 结果：False，b 的实例字典里没有
print(Student.school)             # 结果：小松鼠学院，类上始终保留着它
