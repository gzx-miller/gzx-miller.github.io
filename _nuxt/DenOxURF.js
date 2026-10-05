const n=`import numpy as np

# 矩阵乘法的几何真相：把整个空间做线性变换
# 看矩阵的两列 = 两条基向量 (1,0)、(0,1) 分别落在了哪里
shear = np.array([[1, 1],
                  [0, 1]])    # 沿 x 轴的切变
rot   = np.array([[0, -1],
                  [1,  0]])    # 逆时针旋转 90°

v = np.array([2, 1])
print(shear @ v)   # 拉伸成倾斜
print(rot @ v)     # 旋转到 (-1, 2)

# 再加偏置得到 y = Wx + b；但纯线性叠多层仍等价于一层，
# 想要真正的表达能力，必须引入激活函数（见第八课）`;export{n as default};
