# ═══════════════════════════════════════════
# 1. 三种导入写法各自绑定什么名字
# ═══════════════════════════════════════════

import math                        # 名字 math 绑定到整个模块对象
print(math.sqrt(16))               # 结果：4.0，用「模块名.成员」访问

from math import pi                # 只把 pi 这一个名字绑进当前命名空间
print(pi)                          # 结果：3.141592653589793，无需模块前缀

import statistics as stats         # as 给模块起一个短别名
print(stats.mean([1, 2, 3, 4]))    # 结果：2.5

# ═══════════════════════════════════════════
# 2. 模块是对象：查看 __name__ 与缓存
# ═══════════════════════════════════════════

import sys

print(__name__)                    # 结果：__main__（本文件被直接运行时）
print(math.__name__)               # 结果：math，模块自报的名字
print("math" in sys.modules)       # 结果：True，导入过的模块会被缓存
print(len(sys.path) > 0)           # 结果：True，sys.path 是模块的搜索路径列表

# ═══════════════════════════════════════════
# 3. if __name__ == "__main__"：入口与模块分离
# ═══════════════════════════════════════════

def run_demo() -> str:
    return "只有直接运行本文件时，这段逻辑才会执行"

if __name__ == "__main__":
    # 被别的模块 import 时，__name__ 不是 "__main__"，这段不会跑
    # 因此导入本模块不会有副作用，只提供可复用的函数
    print(run_demo())              # 结果：只有直接运行本文件时，这段逻辑才会执行

# ═══════════════════════════════════════════
# 4. 包的 __init__.py 与 __all__ 导出范围
# ═══════════════════════════════════════════

# 真实包结构示例（myapp/ 目录下）：
#   myapp/__init__.py      ->  __all__ = ["slugify"]
#   myapp/utils/__init__.py
#   myapp/utils/slugify.py ->  def slugify(text): ...

__all__ = ["run_demo"]             # 只影响 from this import * 的导出范围
print(__all__)                     # 结果：['run_demo']

# ═══════════════════════════════════════════
# 5. 包内相对导入示意（需在包内运行才成立）
# ═══════════════════════════════════════════

RELATIVE_SAMPLE = """
# 位于 myapp/main.py 内部时：
from .utils import slugify          # . 表示当前包 myapp
from ..models import User           # .. 表示上一层包
# 直接把 main.py 当脚本运行会报错：
# ImportError: attempted relative import with no known parent package
"""
print(RELATIVE_SAMPLE.strip().splitlines()[1].split("#")[0].strip())  # 结果：from .utils import slugify

# ═══════════════════════════════════════════
# 6. 查找路径与同名文件抢占的陷阱
# ═══════════════════════════════════════════

print(sys.path[0])                 # 结果：脚本所在目录（排在搜索顺序最前）
print(hasattr(math, "sqrt"))       # 结果：True，正常导入到的是标准库 math
# 若当前目录存在自写的 math.py，它会排在标准库之前，把真正的 math“抢占”掉
