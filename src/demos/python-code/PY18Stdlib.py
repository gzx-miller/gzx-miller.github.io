# ═══════════════════════════════════════════
# 1. datetime：解析、格式化与当前时间
# ═══════════════════════════════════════════

from datetime import datetime, timedelta

now = datetime.now()                                   # 当前本地时间
print(now.strftime("%Y-%m-%d %H:%M"))                  # 结果：如 2026-10-16 09:30

text = "2024-06-01 08:30"
start = datetime.strptime(text, "%Y-%m-%d %H:%M")      # 字符串按格式串解析为对象
print(start)                                           # 结果：2024-06-01 08:30:00
print(start.strftime("%Y年%m月%d日"))                   # 结果：2024年06月01日

# ═══════════════════════════════════════════
# 2. timedelta：时间加减自动处理进位
# ═══════════════════════════════════════════

next_week = start + timedelta(days=7)                  # 加 7 天
print(next_week.strftime("%Y-%m-%d"))                  # 结果：2024-06-08

span = next_week - start                               # 两个时间相减得到时间差
print(span.days)                                       # 结果：7
print((start + timedelta(days=1)).strftime("%d"))      # 结果：02，跨月靠对象算对

# ═══════════════════════════════════════════
# 3. re：search / findall / sub 与分组
# ═══════════════════════════════════════════

import re

sample = "联系 alice@example.com 或 bob@test.com，电话 13800138000"

first = re.search(r"\d+", sample)                      # 找第一个数字串
print(first.group(0))                                  # 结果：13800138000

emails = re.compile(r"([\w.]+)@([\w.]+)")              # 预编译，循环里复用
for match in emails.finditer(sample):
    print(match.group(1), match.group(2))              # 结果：alice example.com / bob test.com

print(re.findall(r"\d+", sample))                      # 结果：['13800138000']
print(re.sub(r"\d", "#", sample))                      # 结果：电话号码数字被替换为 #

# ═══════════════════════════════════════════
# 4. json：dumps 与 loads 互转
# ═══════════════════════════════════════════

import json

payload = {"name": "小松鼠", "skills": ["python", "vue"], "age": 3}

raw = json.dumps(payload, ensure_ascii=False, indent=2)   # 保留中文并缩进
print(raw.splitlines()[1])                             # 结果："name": "小松鼠",

compressed = json.dumps(payload, ensure_ascii=True)    # 中文被转义成 \uXXXX
print("\\u" in compressed)                             # 结果：True

back = json.loads(raw)                                 # 字符串还原成对象
print(back["skills"][0], back["age"])                  # 结果：python 3
print(isinstance(back["age"], int))                    # 结果：True
