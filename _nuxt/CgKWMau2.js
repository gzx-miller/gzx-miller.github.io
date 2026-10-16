const n=`import math

# 线性层的线叠线还是线：两层不含激活等价于一层
import numpy as np
W2, b2 = np.array([[2.0, -1.0]]), np.array([0.0])
W1, b1 = np.array([[1.0], [1.0]]), np.array([0.0])
merged = W2 @ W1          # 0 层，等价一层
print(merged)

# 激活函数在层间断出“弯折”，层数才带来表达能力
def relu(x): return max(0, x)
def tanh(x): return math.tanh(x)

x = np.linspace(-3, 3, 100)
# 每层用 relu/tanh 再叠，就能逼近任意曲线（万能逼近）`;export{n as default};
