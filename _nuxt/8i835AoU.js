const n=`# 用一组有顺序的数字（向量）把事物变成可计算的距离
cat    = [0.25, 0.80]      # (体型, 凶猛)
tiger  = [0.90, 0.95]
goldfish = [0.02, 0.30]

def dist(a, b):            # 欧几里得距离：算两个向量差多“远”
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

print(dist(cat, tiger))    # 0.66 —— 猫与老虎“像”
print(dist(cat, goldfish)) # 0.55 —— 猫与金鱼“不像”
# 维度不足就再加一维，直到能把想区分的事物全部拉开`;export{n as default};
