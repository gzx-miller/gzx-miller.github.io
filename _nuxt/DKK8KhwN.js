const n=`# ═══════════════════════════════════════════
# 1. if / elif / else
# ═══════════════════════════════════════════

score = 86
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "D"
print(grade)               # 结果：B

# ═══════════════════════════════════════════
# 2. 真值判断：任意对象都能当真假
# ═══════════════════════════════════════════

print(bool(0), bool(""), bool([]), bool({}))  # 结果：False False False False
print(bool([0]), bool("0"))                    # 结果：True True，非空即为真
items = []
print("空" if not items else "非空")            # 结果：空

# ═══════════════════════════════════════════
# 3. for + range（不含 stop）
# ═══════════════════════════════════════════

total = 0
for i in range(1, 5):      # 得到 1, 2, 3, 4，不含 5
    total += i
print(total)               # 结果：10
print(list(range(0, 10, 3)))  # 结果：[0, 3, 6, 9]，带步长

# ═══════════════════════════════════════════
# 4. while 循环
# ═══════════════════════════════════════════

n = 3
while n > 0:
    print(n)               # 结果：3 2 1
    n -= 1                 # 让条件趋于为假，否则死循环

# ═══════════════════════════════════════════
# 5. break 与循环的 else 子句
# ═══════════════════════════════════════════

for i in range(10):
    if i == 3:
        break
else:
    print("未触发 break")   # 结果：不执行，循环被 break 打断

for _ in range(3):
    pass
else:
    print("循环正常结束")   # 结果：循环正常结束

# ═══════════════════════════════════════════
# 6. continue
# ═══════════════════════════════════════════

for i in range(5):
    if i % 2 == 0:
        continue           # 跳过偶数
    print(i)               # 结果：1 3

# ═══════════════════════════════════════════
# 7. enumerate 与 zip
# ═══════════════════════════════════════════

for idx, name in enumerate(["a", "b"]):
    print(idx, name)       # 结果：0 a / 1 b
for x, y in zip([1, 2], ["a", "b"]):
    print(x, y)            # 结果：1 a / 2 b
`;export{n as default};
