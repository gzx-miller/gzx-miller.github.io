const n=`import math

# 神经元：加权投票 + 可调门槛 + 压扁成概率
def neuron(x, w, b, activation='sigmoid'):
    z = sum(wi * xi for wi, xi in zip(w, x)) + b   # 加权求和 + 偏置
    if activation == 'sigmoid':
        return 1 / (1 + math.exp(-z))              # 压到 0~1
    return max(0, z)                               # ReLU

x = [1, 0, 1]
w = [0.4, -0.1, 0.8]
b = -0.3
print(neuron(x, w, b))     # 0.71 —— 偏向“激活”

# 单个神经元只能切一条直线；多类就给每类配一个神经元再用 softmax`;export{n as default};
