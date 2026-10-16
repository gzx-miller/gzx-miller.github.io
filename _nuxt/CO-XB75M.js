const e=`# 编码器：每个位置同时看左右 -> 双向，擅长“读懂输入”，如 BERT
# 解码器：只能看左侧已有内容 -> 单向，擅长自回归“续写”，如 GPT
# 纯解码器(decoder-only) 成为主流：任务被统一成“预测下一个 token”，
#   于是问答、翻译、总结、代码都能用同一套法子改写来实现
# - 隐式：decoder 用因果掩码(mask) 让注意力只看左边
def causal_mask(i, j):
    return 0 if i >= j else -float("inf")   # 遮住未来，保证自回归`;export{e as default};
