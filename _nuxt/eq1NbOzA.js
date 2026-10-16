const n=`# ═══════════════════════════════════════════
# 1. 变量是名字绑定到对象（引用语义）
# ═══════════════════════════════════════════

a = [1, 2, 3]                 # a 绑定到一个列表对象
b = a                          # b 绑定到同一个对象，并没有复制
b.append(4)                    # 通过 b 就地修改对象
print(a)                       # 结果：[1, 2, 3, 4]，a 也跟着变了

c = a.copy()                   # copy() 才产生一个独立的新对象
c.append(5)
print(a, c)                    # 结果：[1, 2, 3, 4] [1, 2, 3, 4, 5]

a = [9]                        # 让 a 改绑到新对象，b 不受影响
print(a, b)                    # 结果：[9] [1, 2, 3, 4]

# ═══════════════════════════════════════════
# 2. 动态类型：同一个名字可指向不同类型
# ═══════════════════════════════════════════

value = 42                     # 此刻指向 int
print(type(value))             # 结果：<class 'int'>
value = "42"                   # 重新绑定为 str，无需任何声明
print(type(value))             # 结果：<class 'str'>

try:
    total = "42" + 1           # 类型不匹配要到运行期才报错
except TypeError as error:
    print(error)               # 结果：can only concatenate str (not "int") to str

# ═══════════════════════════════════════════
# 3. 不可变类型与可变类型
# ═══════════════════════════════════════════

immutable = ("a", "b")         # 元组不可变
mutable = ["a", "b"]           # 列表可变
mutable.append("c")            # 就地修改生效
print(mutable)                 # 结果：['a', 'b', 'c']
# immutable.append("c")        # 取消注释会抛 AttributeError：元组没有 append

shared = mutable               # 共享同一个列表
shared.pop()                   # 从另一处修改
print(mutable)                 # 结果：['a', 'b']，原列表同样被改

# ═══════════════════════════════════════════
# 4. 显式类型转换
# ═══════════════════════════════════════════

print(int("42"))               # 结果：42，字符串转整数
print(float("3.14"))           # 结果：3.14，字符串转浮点
print(str(42))                 # 结果：'42'，数字转字符串
print(bool(""))                # 结果：False，空字符串为假
print(bool("0"))               # 结果：True，非空字符串恒为真
print(list("abc"))             # 结果：['a', 'b', 'c']

try:
    print(int("3.14"))         # 会抛出 ValueError
except ValueError:
    print("int() 无法直接解析小数文本")

# ═══════════════════════════════════════════
# 5. 用注解表达意图，在边界做校验
# ═══════════════════════════════════════════

def add(a: int, b: int) -> int:    # 注解只是提示，运行期并不强制校验
    return a + b

print(add(1, 2))               # 结果：3
print(add("1", "2"))           # 结果：'12'，注解并不阻止错误用法

def to_count(raw: object) -> int:
    if not isinstance(raw, (int, str)):
        raise TypeError("count 只接受 int 或 str")
    return int(raw)

print(to_count("42"))          # 结果：42，边界处把类型钉死
`;export{n as default};
