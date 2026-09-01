const n=`<template>
  <LlmArticle>
    <div class="llm-question"><strong>开场问题：</strong>注意力的账单是 <code>O(n²)</code>——处理一本书，工程师用什么手段把它变快？</div>

    <h2>提出问题</h2>
    <p>注意力要让每个 token 和所有 token 两两比较，<code>n</code> 个 token 就有 <code>n×n</code> 个格子：1k token 约 100 万次比较、32k（约一本书）就达 10 亿个格子，而且<strong>每一层都要重算一遍</strong>。拿 GPT-4 的 128k 上下文算：标准注意力一层就有 <code>128000² ≈ 164 亿</code> 个格子，乘上约 120 层，一次推理光注意力就得算两万亿次。序列长度翻倍、计算量翻 4 倍——这道平方的账单，是长上下文路上最硬的一堵墙。</p>

    <h2>最小方案</h2>
    <p>最直觉的省法是<strong>稀疏注意力</strong>：别让每个 token 看全部 <code>n</code> 个位置，只看左右 <code>W</code> 个邻居，即滑动窗口注意力，计算量从 <code>O(n²)</code> 降到 <code>O(n·W)</code>（W 固定，近似线性）。序列越长省得越多。但只看邻居有个明显代价：<strong>看不到远处</strong>——开头那句关键信息到结尾就盲了。实战中因此打几个补丁：保留几个「全局 token」（如开头的指令）让所有位置都能看到它，或用膨胀窗口「跳着看」，用同样的格子数覆盖更远。Longformer、Mistral 就靠这类组合把上下文撑到几十万 token。</p>

    <h2>发现不足</h2>
    <p>稀疏注意力存在两处先天局限：</p>
    <ul>
      <li>它<strong>改变了数学结果</strong>，是在赌「远处不重要」——赌对了省钱、赌错了漏信息（近似）。</li>
      <li>可有时候我们就是想要<strong>完整精确</strong>的注意力，一格不漏，只是嫌它慢、嫌它占内存。</li>
    </ul>

    <h2>迭代</h2>
    <p><strong>先摘个唾手可得的果子——KV 缓存。</strong>自回归生成时模型一个字一个字地吐，每吐一个就把前面所有词的 K、V 从头又算一遍；可那些词根本没变。KV 缓存把它们<strong>存起来</strong>，下一步只算新来的那一个词，其余从缓存取。这样生成 <code>n</code> 个词从每步重算全部（共 <code>O(n²)</code>）降到每步只算 1 个（每步 <code>O(n)</code>）。代价是拿显存换速度：缓存要一直占内存，序列越长占得越多——后来的 <strong>MQA/GQA</strong>（让多头共享同一份 K/V）就是为了缩小这份缓存而生的。</p>
    <p><strong>第二条路——FlashAttention：不减计算，只改顺序。</strong>它一格都不少算，结果与标准注意力分毫不差，却能快好几倍。秘密不在「算」而在「搬」：GPU 有读写慢的 HBM（显存，几十 GB）和快十几倍的 SRAM（片上缓存，仅几十 MB）。标准注意力的真正瓶颈是那张 <code>n×n</code> 大矩阵塞不进 SRAM，只能反复进出慢吞吞的 HBM。障碍在于 softmax 要看到一整行所有分数才能归一化；若把行切成小块进 SRAM，看第一块时还不知道后面有没有更大的数。FlashAttention 的核心绝活是<strong>「在线 softmax」</strong>：边读边修——发现更大的数，就把已算的部分等比缩小一下。靠一个 running 最大值和一个 running 分母，softmax 不用一次看到整行也能流式算出精确结果，于是注意力可分块在 SRAM 算完，那张 <code>n²</code> 大矩阵根本不落地 HBM，快 2~4 倍、省显存数倍，且不改变结果、不丢信息。</p>

    <h2>总结</h2>
    <p>注意力的 <code>O(n²)</code> 墙有三条攻法：<strong>稀疏注意力少算</strong>（只看邻居，是近似、会丢远处）；<strong>KV 缓存不重算</strong>（生成时缓存旧词 K/V，配 MQA/GQA 进一步缩缓存）；<strong>FlashAttention 不减计算、只改搬运</strong>（在线 softmax 让大矩阵不落显存，结果还精确）。稀疏与 Flash 还能叠加使用，正是这些工程把 128k+ 的长上下文从妄想变成了日常。</p>
    <div class="llm-term"><span class="term-name">「FlashAttention」</span>是指利用「在线 softmax」——用一个不断修正的 running 最大值与分母，让 softmax 无需看到整行也能流式精确计算——从而把注意力分块在快速的 SRAM 中算完、大矩阵不落入慢速显存，在不改变数学结果的前提下大幅提速并省显存。</div>
  </LlmArticle>
</template>`;export{n as default};
