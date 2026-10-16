const n=`import numpy as np

# 梯度：把所有偏导数装进一个向量，指向“最陡上升”方向
def f(w1, w2):                  # 损失曲面，比如一个碗
    return (w1 - 3) ** 2 + (w2 + 2) ** 2

def grad(w1, w2, h=1e-3):       # 数值求导近似
    g1 = (f(w1 + h, w2) - f(w1 - h, w2)) / (2 * h)
    g2 = (f(w1, w2 + h) - f(w1, w2 - h)) / (2 * h)
    return np.array([g1, g2])

w = np.array([0.0, 0.0])
alpha = 0.1                      # 学习率：一步迈多大
for _ in range(60):              # 沿负梯度方向迭代下山
    w = w - alpha * grad(*w)
print(w)                         # ≈ [3., -2.] 山谷最低点`;export{n as default};
