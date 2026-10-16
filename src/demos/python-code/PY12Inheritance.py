# ════════════════════════════════════════════
# 1. 单继承与 super()
# ════════════════════════════════════════════

class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):                    # Dog 继承 Animal
    def speak(self):
        return super().speak() + "汪汪"   # 说明：先复用父类行为，再补充差异

print(Animal("生物").speak())          # 结果：...
print(Dog("旺财").speak())             # 结果：...汪汪


# ════════════════════════════════════════════
# 2. 重写方法与多态
# ════════════════════════════════════════════

class Cat(Animal):
    def speak(self):                  # 重写父类的 speak
        return "喵~"

animals = [Animal("生物"), Dog("旺财"), Cat("咪咪")]
for animal in animals:
    print(animal.name, animal.speak())
# 结果：生物 ... / 旺财 ...汪汪 / 咪咪 喵~，同一句调用各自响应


# ════════════════════════════════════════════
# 3. __str__ 与 __repr__
# ════════════════════════════════════════════

class Course:
    def __init__(self, title, hours):
        self.title = title
        self.hours = hours

    def __str__(self):                # print / str() 时调用，面向使用者
        return f"{self.title} ({self.hours}h)"

    def __repr__(self):               # 面向开发者，尽量能重建对象
        return f"Course({self.title!r}, {self.hours})"

c = Course("Python 入门", 12)
print(str(c))                         # 结果：Python 入门 (12h)
print(repr(c))                         # 结果：Course('Python 入门', 12)


# ════════════════════════════════════════════
# 4. __eq__：按内容比较而非身份
# ════════════════════════════════════════════

class Course2:
    def __init__(self, title, hours):
        self.title, self.hours = title, hours

    def __eq__(self, other):          # 重写后 == 比较字段内容
        if not isinstance(other, Course2):
            return NotImplemented
        return (self.title, self.hours) == (other.title, other.hours)

x = Course2("Python 入门", 12)
y = Course2("Python 入门", 12)
print(x == y)                          # 结果：True（默认情况下会是 False）


# ════════════════════════════════════════════
# 5. __len__ 与 __add__
# ════════════════════════════════════════════

class Basket:
    def __init__(self, items):
        self.items = list(items)

    def __len__(self):                 # 让对象支持 len()
        return len(self.items)

    def __add__(self, other):          # 让对象支持 + 合并
        return Basket(self.items + other.items)

basket = Basket(["栗子", "橡果"])
print(len(basket))                     # 结果：2
merged = basket + Basket(["松果"])
print(len(merged), merged.items)       # 结果：3 ['栗子', '橡果', '松果']


# ════════════════════════════════════════════
# 6. MRO：多继承下的方法查找顺序
# ════════════════════════════════════════════

class A:
    def who(self):
        return "A"

class B(A):
    def who(self):
        return "B"                     # 说明：子类自己先被找到

class C(B):
    pass

print(C().who())                       # 结果：B（先子类，再沿 MRO 上溯）
print([cls.__name__ for cls in C.__mro__])   # 结果：['C', 'B', 'A', 'object']
