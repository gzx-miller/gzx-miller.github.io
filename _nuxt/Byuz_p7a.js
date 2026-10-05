const r=`import math

probs = [0.7, 0.2, 0.1]          # 非负且和为 1，才是合法分布

def entropy(p):                  # 熵 = 平均“意外程度”
    return -sum(pi * math.log2(pi) for pi in p)

# 交叉熵分类损失：只看正确类概率，越离谱越受罚
def cross_entropy(q_correct, y_correct=1.0):
    return -y_correct * math.log(q_correct)

print(entropy(probs))            # 信息更“散”，熵更大
print(cross_entropy(0.9))        # 0.105 —— 很有把握
print(cross_entropy(0.1))        # 2.30  —— 错得离谱`;export{r as default};
