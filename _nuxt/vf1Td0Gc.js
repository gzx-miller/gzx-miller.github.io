const e=`<script setup lang="ts">
import CPP17StlAssociativeContainers from './CPP17StlAssociativeContainers.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>要用「名字 → 年龄」这种关系查数据，顺序数组得从头扫到尾；可如果还想「按名字有序遍历」，哈希表又给不了顺序。既要查得快、又要能排序，该选哪种容器？
    </div>

    <h2>朴素做法：平行数组或线性查找</h2>
    <p>
      最直接的做法是维护两个平行数组：一个存名字、一个存年龄，下标一一对应，查找时循环比对名字。它「做对了」——简单、直观、不引入额外概念。
    </p>
    <p>
      代价是查找 O(n)，数据一多就慢；更棘手的是两个数组靠<strong>下标对齐</strong>维持关系，一旦插入或删除时忘了同步，键和值就错位了。而且想要「按名字排序遍历」，还得额外排一遍序、再重建对应关系。
    </p>

    <h2>map 与 set：红黑树带来的有序性</h2>
    <p>
      关联容器把「键」直接和「值」绑在一起。C++ 的 <code>std::map</code> / <code>std::set</code> 底层是<strong>红黑树</strong>——一种自平衡的二叉搜索树，于是：
    </p>
    <ul>
      <li>元素按键的大小<strong>有序</strong>存储，顺序遍历天然就是升序。</li>
      <li>查找、插入、删除都是 O(log n)，比线性查找快得多。</li>
      <li><code>map</code> 存的是键值对（<code>value_type</code> 是 <code>pair&lt;const Key, Value&gt;</code>），<code>set</code> 只存键、兼顾去重。</li>
      <li><code>multimap</code> / <code>multiset</code> 允许重复键，因此<strong>没有</strong> <code>operator[]</code>。</li>
    </ul>

    <h2>operator[] 的插入语义：最常踩的坑</h2>
    <p>
      <code>m[key]</code> 看起来像「取值」，实际上它<strong>会插入</strong>：若键不存在，容器先插入一个值初始化的元素（<code>int → 0</code>、<code>string → 空串</code>），再返回它的引用。于是本想「读一下」，却不知不觉得往字典里塞进了一个默认值。
    </p>
    <p>
      只想读取而不修改容器，就用两个工具：<code>at(key)</code> 返回引用、键不存在时抛 <code>out_of_range</code>；<code>find(key)</code> 返回迭代器、未找到返回 <code>end()</code>，全程不插入。<code>operator[]</code> 留给「确认要写入」的场景。
    </p>

    <h2>unordered_map 与 unordered_set：哈希表</h2>
    <p>
      如果不需要顺序、只追求查找速度，可以换成无序容器：<code>std::unordered_map</code> / <code>std::unordered_set</code> 基于<strong>哈希表</strong>，平均查找、插入、删除都是 O(1)，最坏会退化到 O(n)（哈希冲突严重时）。
    </p>
    <ul>
      <li>遍历顺序<strong>未指定</strong>，取决于哈希函数与桶布局，不能依赖它。</li>
      <li>负载因子（元素数 / 桶数）影响性能，可用 <code>reserve(n)</code> 预留、<code>rehash(n)</code> 强制调整桶数。</li>
      <li>键必须可哈希、可比较相等；标准类型已内置，自定义类型需要自己提供。</li>
    </ul>

    <h2>自定义比较与哈希</h2>
    <p>
      用自己的类型当键时，得替容器补上它需要的两样东西：
    </p>
    <ul>
      <li>给有序容器提供<strong>比较器</strong>（默认 <code>std::less&lt;Key&gt;</code>），满足严格弱序，比如按 <code>id</code> 比较。</li>
      <li>给无序容器提供<strong>哈希函数</strong>与<strong>相等比较</strong>：前者决定桶位置，后者处理冲突判断，二者必须一致——相等的东西必须哈希到同一桶。</li>
    </ul>
    <p>
      查找与计数的分工也要清楚：<code>find</code> 返回迭代器、判断存在性；<code>count</code> 返回个数——在 <code>map</code>/<code>set</code> 里非 0 即 1，在 <code>multimap</code>/<code>multiset</code> 里可能大于 1；需要单个键的全部元素时，用 <code>equal_range</code> 取出 <code>[first, last)</code> 区间。
    </p>

    <h2>看一遍有序与无序关联容器</h2>
    <figure class="lesson-figure">
      <figcaption>对照 demo 中 <code>map</code> 的按键有序遍历、<code>find</code> 的不插入查找与 <code>set</code> 的自动排序去重，观察有序与无序容器在输出顺序上的差别。</figcaption>
      <CPP17StlAssociativeContainers />
    </figure>

    <h2>有序与无序，回答的是同一个问题的两面</h2>
    <p>
      关联容器的选择，本质是在「顺序」和「速度」之间做取舍：需要<strong>有序遍历或范围查询</strong>（<code>lower_bound</code>、<code>upper_bound</code>、<code>equal_range</code>）就选红黑树的 <code>map</code>/<code>set</code>；只需要<strong>快速命中</strong>且能给出良好哈希，就用哈希表的 <code>unordered_</code> 版本。把 <code>operator[]</code> 的插入语义和自定义键的哈希/比较补齐，这两族容器就能稳稳地用起来。
    </p>
    <div class="lesson-term">
      <span class="term-name">「关联容器」</span>按关键字存取元素；<span class="term-name">「有序关联容器」</span>（<code>map</code>/<code>set</code>/<code>multimap</code>/<code>multiset</code>）基于红黑树，查找 O(log n) 且按键有序；<span class="term-name">「无序关联容器」</span>（<code>unordered_map</code>/<code>unordered_set</code>）基于哈希表，平均 O(1)、顺序未指定。自定义键需要提供<span class="term-name">「比较器」</span>或<span class="term-name">「哈希函数与相等比较」</span>。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
