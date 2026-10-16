const e=`from collections import Counter, defaultdict

corpus = "the dog barked the cat slept the dog slept".split()
model = defaultdict(Counter)

for i in range(len(corpus) - 1):          # 数“最近 N 个词”的共现次数
    model[corpus[i]][corpus[i + 1]] += 1

def next_word(w):                          # 纯数数，不懂语法/语义
    return model[w].most_common(1)[0][0]

print(next_word("the"))                    # 接出最多的后继词
# 缺陷：只记 N 个词(记性很短) + 词被当独立符号(组合稀疏灾难)`;export{e as default};
