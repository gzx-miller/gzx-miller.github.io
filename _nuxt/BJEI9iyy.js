const t=`# 论文两大核心公式的浓缩：
# 1) Scaled Dot-Product Attention
#    Attention(Q,K,V) = softmax(QKᵀ / √d_k) V   # 除以√d_k防点积变大把softmax推入梯度极小区
# 2) Multi-Head 把 Q/K/V 各投影 h 次并行再拼接：
#    MultiHead(Q,K,V) = Concat(head₁,…,head_h)Wᴼ,  head_i = Attention(QWᵢ^Q,KWᵢ^K,VWᵢ^V)
# 配合 d_model=512、N=6 层、(残差+LayerNorm) Block、正弦位置编码`;export{t as default};
