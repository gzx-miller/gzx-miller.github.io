const n=`# ═══════════════════════════════════════════
# 1. 判断当前是否运行在虚拟环境里
# ═══════════════════════════════════════════

import sys

sys_prefix = sys.prefix                 # 当前解释器使用的环境前缀
base_prefix = sys.base_prefix           # 底层系统 Python 的前缀

in_venv = sys_prefix != base_prefix     # 两者不同即说明处在虚拟环境
print(in_venv)                          # 结果：True 或 False，取决于是否已激活
print(sys.prefix)                       # 结果：激活时是 /path/to/.venv，否则是系统路径

# ═══════════════════════════════════════════
# 2. 解释器版本与模块搜索路径
# ═══════════════════════════════════════════

print(sys.version.split()[0])           # 结果：如 3.12.2，当前解释器版本
print(sys.executable)                   # 结果：当前使用的 python 可执行文件路径
print(len(sys.path) > 0)                # 结果：True，sys.path 决定到哪些目录找模块
print(sys.path[:2])                     # 结果：前两项通常是脚本目录与标准库目录

# ═══════════════════════════════════════════
# 3. 创建 / 激活虚拟环境的命令流程
# ═══════════════════════════════════════════

VENV_COMMANDS = """
# 创建：在项目目录生成独立的 .venv
python -m venv .venv

# 激活（Windows）
.venv\\\\Scripts\\\\activate
# 激活（macOS / Linux）
source .venv/bin/activate

# 安装与冻结：此时 pip 只影响本项目环境
pip install requests
pip freeze > requirements.txt

# 退出
deactivate
"""
print(VENV_COMMANDS.strip().splitlines()[1])   # 结果：python -m venv .venv

# ═══════════════════════════════════════════
# 4. 依赖清单：声明范围与锁定精确版本
# ═══════════════════════════════════════════

REQUIREMENTS_LOCKED = [
    "requests==2.31.0",                 # 冻结后的精确版本，可复现
    "flask==3.0.0",
    "urllib3==2.1.0",
]

PYPROJECT_RANGE = [
    "requests>=2.31",                   # 版本范围，表达可接受的区间
    "flask~=3.0",
]

def parse_pinned(lines: list[str]) -> dict[str, str]:
    pairs = (line.split("==") for line in lines)
    return {name: version for name, version in pairs}

print(parse_pinned(REQUIREMENTS_LOCKED)["flask"])   # 结果：3.0.0
print(PYPROJECT_RANGE[0])                            # 结果：requests>=2.31

# ═══════════════════════════════════════════
# 5. 判断并给出提示
# ═══════════════════════════════════════════

def env_tip(in_venv: bool) -> str:
    if in_venv:
        return "已激活虚拟环境，pip install 只会影响本项目"
    return "警告：未激活虚拟环境，别再往系统 Python 里装业务依赖"

print(env_tip(in_venv))     # 结果：随当前环境状态而变
`;export{n as default};
