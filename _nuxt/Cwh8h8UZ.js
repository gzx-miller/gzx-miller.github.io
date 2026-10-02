const e=`import numpy as np

# 思想：上下文相似 => 意思相近；用“遮住当前词猜词”来训练
# 语义关系被编码成向量方向，于是能做向量算术
vec = {}.fromkeys(["king", "man", "woman", "queen"], np.zeros(64))
# 真实训练后：
# vec["king"] - vec["man"] + vec["woman"] ≈ vec["queen"]

def top_cosine_rank(target, exclude):
    # 用余弦相似度列出与 target 最相近的词（此处示意）
    return sorted(exclude, key=lambda w: cosine(target, w), reverse=True)

# 相似的词在高维空间里挨得近，距离/方向即可计算的“语义”`;export{e as default};
