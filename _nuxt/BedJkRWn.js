const n=`# ═══════════════════════════════════════════
# 1. with 读写：显式编码 + 自动关闭
# ═══════════════════════════════════════════

import tempfile
from pathlib import Path

tmp_dir = tempfile.TemporaryDirectory()      # 用临时目录，脚本可安全反复运行
file_path = Path(tmp_dir.name) / "data.txt"

with open(file_path, "w", encoding="utf-8") as f:   # 'w' 会清空原有内容
    f.write("第一行\\n第二行\\n")
print(file_path.exists())                     # 结果：True

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()                           # 一次读入全部内容
print(repr(text))                             # 结果：'第一行\\n第二行\\n'
print(f.closed)                               # 结果：True，离开 with 已自动关闭

# ═══════════════════════════════════════════
# 2. 追加模式：保留旧内容
# ═══════════════════════════════════════════

with open(file_path, "a", encoding="utf-8") as f:   # 'a' 指针在末尾，不清空
    f.write("第三行\\n")

print(file_path.read_text(encoding="utf-8").count("\\n"))   # 结果：3

# ═══════════════════════════════════════════
# 3. 按行迭代：大文件也不吃内存
# ═══════════════════════════════════════════

with open(file_path, "r", encoding="utf-8") as f:
    for index, line in enumerate(f, start=1):  # 直接迭代文件对象，逐行读
        print(index, line.strip())             # 结果：依次打印 3 行内容

# ═══════════════════════════════════════════
# 4. pathlib：用 / 拼路径，拆解各部分
# ═══════════════════════════════════════════

p = Path("reports") / "2024" / "data.csv"      # / 运算符适配不同平台分隔符
print(p.name)                                  # 结果：data.csv
print(p.stem)                                  # 结果：data
print(p.suffix)                                # 结果：.csv
print(p.parent)                                # 结果：reports/2024
print(p.with_suffix(".txt"))                   # 结果：reports/2024/data.txt

# ═══════════════════════════════════════════
# 5. 文件不存在时的处理
# ═══════════════════════════════════════════

missing = file_path.parent / "missing.txt"
print(missing.exists())                        # 结果：False

try:
    open(missing, "r", encoding="utf-8")       # 只读打开不存在的文件
except FileNotFoundError as error:
    print("捕获 FileNotFoundError:", error.filename)   # 结果：文件路径

tmp_dir.cleanup()                              # 清理临时目录
`;export{n as default};
