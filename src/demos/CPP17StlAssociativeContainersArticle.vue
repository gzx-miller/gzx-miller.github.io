<script setup lang="ts">
import CPP17StlAssociativeContainers from './CPP17StlAssociativeContainers.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只想查一下字典里有没有 <code>David</code> 的年龄，顺手写了一句 <code>ages["David"]</code>。程序没报错，可当你把整张表打印出来时，凭空多了一行 <code>David: 0</code>——你只是「读」了一下，它怎么就悄悄「写」进去一条了？
    </div>

    <h2>提出问题</h2>
    <p>
      你要的不是「第 5 个元素」，而是「叫 Alice 的那个人今年几岁」——也就是按一个<strong>关键字</strong>去定位数据，还得能快速判断某个键在不在。最笨的老办法是拿两个平行数组，一个存名字、一个存年龄，按下标对齐。它能跑，但成本都落在你身上：
    </p>
    <ul>
      <li>按键查找只能从头到尾逐个比对，是 <code>O(n)</code>；数据一大就慢。</li>
      <li>想删掉一个人，得在<strong>两个</strong>数组里各删一次、还得保证下标不再错位，稍不留神两边就对不上了。</li>
      <li>同一个键很容易被插进去两次，靠人工保证「键唯一」几乎做不到。</li>
      <li>算法本身也不知道「键」是有意义的标识，它只会傻傻地按位置找。</li>
    </ul>
    <p>
      所以要问的是：<strong>能不能有一个容器，直接按「键」来存和取，让「查、插、删」都不必逐个扫描？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的答案是 <code>std::map&lt;std::string, int&gt;</code>：你存的是键值对，用 <code>ages["Alice"] = 25</code> 直接写、用 <code>ages["Alice"]</code> 直接读，容器内部替你维护「键唯一」这件事。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>查找、插入、删除都是 <code>O(log n)</code></strong>，而且它把键按大小排好序，遍历时天然是升序。它底层是一棵<strong>自平衡的红黑树</strong>，这棵树既保证了查找快，也保证了「随时能按顺序取出所有键」。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>operator[]</code> 在键不存在时会<strong>插入一个值初始化的元素</strong>（<code>int</code> 是 0、<code>std::string</code> 是空串），于是「只是想读一下」变成了「偷偷加了一条」。</li>
      <li>每次操作都要走一遍树高，<code>O(log n)</code> 虽然不慢，但在海量数据、纯查找为主的场景里仍不是最快。</li>
      <li>它<strong>强制维护有序</strong>，可你未必需要这个顺序——这份「排序」是要花代价换来的。</li>
      <li>自定义的类当键时直接编译不过：容器不知道拿什么标准去比大小。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补最贴近日常、也最容易踩的一步：<strong>「读」不要用 <code>operator[]</code></strong>。想读一个键，用 <code>at()</code>——键不存在时它抛 <code>std::out_of_range</code>，而不是悄悄插入；或者用 <code>find()</code>——它返回迭代器，没找到就是 <code>end()</code>，你显式判断一下再用 <code>it-&gt;second</code> 取值。把「读」和「写」在语法上分开，那个凭空出现的 <code>David: 0</code> 就再也不会发生了。
    </p>
    <p>
      接着补第二个需求：<strong>我只要查得快，不在乎顺序</strong>。于是换成 <code>std::unordered_map&lt;std::string, int&gt;</code>，底层是<strong>哈希表</strong>，平均查找、插入、删除都是 <code>O(1)</code>。但它不是白拿的：遍历顺序<strong>未指定</strong>（取决于哈希和桶布局），而且冲突严重时最坏会退化到 <code>O(n)</code>。所以用无序容器，第一件事是给它一个<strong>高质量的哈希函数</strong>，并盯住负载因子，必要时用 <code>rehash(n)</code> 或 <code>reserve(n)</code> 主动留出空间。
    </p>
    <p>
      再补「只要键、不需要值」的场景：用 <code>set</code>（有序）或 <code>unordered_set</code>（无序）存唯一键集合。<code>insert</code> 插入、<code>find</code> 查找，未找到返回 <code>end()</code>。一个 <code>std::set&lt;int&gt; nums = {5, 2, 8, 1, 2};</code> 遍历出来就是 <code>1 2 5 8</code>——<strong>自动排序、自动去重</strong>，重复的 <code>2</code> 被吃掉了。
    </p>
    <p>
      如果键本来就允许重复呢？那就补上 <code>multimap</code> / <code>multiset</code>：它们允许同一个键出现多次，用 <code>count(key)</code> 数出一共几条。
    </p>
    <p>
      补到这里，一个差别就浮出来了：<strong>有序容器能做范围查询，哈希表做不了</strong>。「找出所有年龄在 20 到 30 之间的人」这种需求，要靠 <code>lower_bound</code> / <code>upper_bound</code> 拿到一个区间，再用 <code>equal_range</code> 取某个键的整段范围。既然只有红黑树保证了键有序，那么<strong>一旦你需要范围查询，就必须回到 <code>map</code>/<code>set</code></strong>——这正是「要不要有序」的真正分水岭，不只是遍历好不好看。
    </p>
    <p>
      再补如何让容器认得你自己的类型。把自定义类型当键时，两种容器的要求不同：
    </p>
    <ol class="lesson-steps">
      <li>当 <strong><code>map</code>/<code>set</code> 的键</strong>：要提供「小于」运算符，或传入一个自定义比较器（它必须构成严格弱序）。</li>
      <li>当 <strong><code>unordered_</code> 的键</strong>：要提供哈希函数，以及相等比较函数——哈希说了「放哪个桶」，相等说了「桶里哪个才是它」。</li>
    </ol>
    <p>
      补完自定义键，还有一个绕不开的现实：<strong>容器里的键是 <code>const</code> 的，不能就地改</strong>（改了它会破坏树序或哈希，容器再也找不到它）。C++17 为此引入了 <strong>node handles</strong>：用 <code>extract(key)</code> 把节点从容器里摘下来，此时你可以改它的键，再 <code>insert</code> 回去。摘下来的节点还能在不重新分配内存的前提下，直接搬到另一个兼容的关联容器里，避免了一次次拷贝元素。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>对着代码和要点表看：同一个「按键取值」的动作，<code>operator[]</code> 会在键缺失时插入默认值，<code>find()</code> 只返回一个迭代器而不改数据；再看 <code>map</code> 遍历为什么是升序，而 <code>unordered_map</code> 的顺序不可依赖。</figcaption>
      <CPP17StlAssociativeContainers />
    </figure>

    <h2>总结</h2>
    <p>
      关联容器让你按「键」而不是按「位置」存取。<code>map</code>/<code>set</code> 用红黑树换来<strong>有序 + <code>O(log n)</code></strong>，<code>unordered_map</code>/<code>unordered_set</code> 用哈希表换来<strong>平均 <code>O(1)</code>、但顺序不定</strong>。要不要有序遍历、要不要范围查询，是这两条路的分界。至于日常代码，只要记住一件事：用 <code>operator[]</code> 之前先问自己，我到底是在读，还是在写。
    </p>
    <div class="lesson-term">
      <span class="term-name">「负载因子」</span>指无序容器中 <code>size() / bucket_count()</code> 的比值，衡量桶被填满的程度。它越高，哈希冲突越多，查找越可能从平均 <code>O(1)</code> 退化到最坏 <code>O(n)</code>。<code>rehash(n)</code> 强制把桶数调整到至少 <code>n</code>，<code>reserve(n)</code> 则提前备好容纳 <code>n</code> 个元素的空间、避免反复重哈希。边界：调整桶数会让已存在的<strong>迭代器失效</strong>；而无论负载因子多低，无序容器的遍历顺序都是未指定的，需要有序遍历或 <code>lower_bound</code>/<code>upper_bound</code> 范围查询时，必须改用 <code>map</code>/<code>set</code>。
    </div>
  </LessonArticle>
</template>
