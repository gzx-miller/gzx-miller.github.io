const d=`import numpy as np

# 多头注意力：把 d_model 维拆成 H 份，每个头在自己的子空间算注意力
# 一个头抓“指代”，一个头抓“句法”，一个头抓“情感”……
H = 8
d_model, d_head = 512, 64

def cut(v, head):                       # 切出第 head 头的专属维度
    sl = slice(head * d_head, (head + 1) * d_head)
    return v[:, sl]

# 每头自己算 attention(Q_h, K_h, V_h)，再把 H 个头拼回 d_model
# 成本基本不变(O(n^2) 照旧)，却能同时建模多种关系 —— 即“多头”`;export{d as default};
