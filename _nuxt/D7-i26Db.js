const n=`import numpy as np

# 残差连接 y = f(x) + x ：那个“+ x”给梯度留了一条不衰减的捷径，
# 任你堆 96 层，梯度也能从顶层几乎原样传回第 1 层
def residual(f, x):
    return f(x) + x

# 层归一化 LayerNorm：把每条样本拉回“均值0 标准差1”
def layernorm(x, eps=1e-5):
    mu, var = x.mean(), x.var()
    return (x - mu) / np.sqrt(var + eps)

# 挡数值漂移，训练更稳；Pre-LN 把主路放在残差捷径上更利于极深网络`;export{n as default};
