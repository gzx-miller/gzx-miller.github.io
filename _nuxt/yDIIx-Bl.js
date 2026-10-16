const n=`# ═══════════════════════════════════════════
# 1. 创建与增删查
# ═══════════════════════════════════════════

user = {"name": "Ada"}
user["age"] = 23               # 结果：{'name': 'Ada', 'age': 23}
user["age"] = 24               # 覆盖已有键
print(user.get("lang"))        # 结果：None，键不存在
print(user.get("lang", "py"))  # 结果：py，给出默认值
print("name" in user)          # 结果：True，判断的是键

# ═══════════════════════════════════════════
# 2. setdefault 与 items 遍历
# ═══════════════════════════════════════════

user.setdefault("lang", "Python")   # 键不存在时写入默认值
print(user["lang"])                 # 结果：Python
for k, v in user.items():
    print(k, v)                     # 结果：name Ada / age 24 / lang Python

# ═══════════════════════════════════════════
# 3. 删除
# ═══════════════════════════════════════════

removed = user.pop("age")
print(removed, user)   # 结果：24 {'name': 'Ada', 'lang': 'Python'}

# ═══════════════════════════════════════════
# 4. 集合去重与运算
# ═══════════════════════════════════════════

a = {1, 2, 3}
b = {3, 4}
print(a | b)           # 结果：{1, 2, 3, 4}，并集
print(a & b)           # 结果：{3}，交集
print(a - b)           # 结果：{1, 2}，差集
print(a ^ b)           # 结果：{1, 2, 4}，对称差
print(list({1, 1, 2}))  # 结果：[1, 2]，自动去重

# ═══════════════════════════════════════════
# 5. frozenset 可哈希
# ═══════════════════════════════════════════

fs = frozenset([1, 2])
print({fs, frozenset([3])})   # 结果：{frozenset({1, 2}), frozenset({3})}

# ═══════════════════════════════════════════
# 6. 不可哈希的键会报 TypeError
# ═══════════════════════════════════════════

try:
    {[1, 2]: "x"}          # 列表不能作为键
except TypeError as error:
    print(error)           # 结果：unhashable type: 'list'
`;export{n as default};
