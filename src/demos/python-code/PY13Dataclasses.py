# ════════════════════════════════════════════
# 1. 手写类 vs @dataclass
# ════════════════════════════════════════════

class CoursePlain:                    # 手写：字段一多，样板就成倍增长
    def __init__(self, title, hours):
        self.title = title
        self.hours = hours

    def __repr__(self):
        return f"CoursePlain({self.title!r}, {self.hours})"

    def __eq__(self, other):
        return (self.title, self.hours) == (other.title, other.hours)

from dataclasses import dataclass, field, asdict

@dataclass                            # 自动生成 __init__ / __repr__ / __eq__
class Course:
    title: str = "未命名"
    hours: int = 12

print(Course("Python 入门", 12))       # 结果：Course(title='Python 入门', hours=12)
print(Course("A", 1) == Course("A", 1))   # 结果：True，按字段内容比较


# ════════════════════════════════════════════
# 2. 默认值与 field(default_factory=...)
# ════════════════════════════════════════════

@dataclass
class Cart:
    owner: str
    items: list = field(default_factory=list)   # 说明：每次构造各自新建列表

c1, c2 = Cart("小明"), Cart("小红")
c1.items.append("栗子")
print(c1.items)                        # 结果：['栗子']
print(c2.items)                        # 结果：[]，两件购物车互不共享


# ════════════════════════════════════════════
# 3. frozen 让实例不可变
# ════════════════════════════════════════════

@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(3, 4)
print(p)                               # 结果：Point(x=3, y=4)
try:
    p.x = 10                           # frozen 实例禁止赋值
except Exception as error:
    print(type(error).__name__)        # 结果：FrozenInstanceError


# ════════════════════════════════════════════
# 4. field 精细控制字段
# ════════════════════════════════════════════

@dataclass
class Account:
    name: str
    balance: float = field(default=0.0, repr=False)   # 不参与 __repr__ 展示
    tags: list = field(default_factory=list, repr=False, compare=False)  # 不参与相等比较

account = Account("小明", 100)
print(account)                         # 结果：Account(name='小明')，balance 与 tags 被隐藏
print(account == Account("小明", 100))  # 结果：True，tags 不参与比较


# ════════════════════════════════════════════
# 5. asdict 转为普通字典
# ════════════════════════════════════════════

course = Course("Vue3 实战", 20)
print(asdict(course))                  # 结果：{'title': 'Vue3 实战', 'hours': 20}


# ════════════════════════════════════════════
# 6. 配合类型注解的函数
# ════════════════════════════════════════════

def total_hours(courses: list[Course]) -> int:   # 注解表达意图，运行期不强制
    return sum(course.hours for course in courses)

print(total_hours([Course("A", 12), Course("B", 8)]))   # 结果：20
