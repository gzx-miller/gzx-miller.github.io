<script setup lang="ts">
import CPP16StlSequenceContainers from './CPP16StlSequenceContainers.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你用一个列表维护「最新消息排最前」的缓冲区，每来一条就写 <code>vec.insert(vec.begin(), msg)</code>。本地测几十条消息时快得感觉不到，上线后数据涨到几万条，这个插入却让程序肉眼可见地卡住——同样是「插入一个元素」，为什么换个位置，耗时就像按元素个数成倍增长？
    </div>

    <h2>内置数组局限</h2>
    <p>
      你要存一串同类型的元素，还要能随时按位置取出来用。最朴素的老办法是内置数组：<code>int arr[100]</code>。它能跑，但代价都压在人身上：
    </p>
    <ul>
      <li>长度在编译期写死，运行时想多存几个就没办法。</li>
      <li>数组自己不知道「我装了几个元素」，你得另开一个变量记着当前用到了哪。</li>
      <li>要在中间插一个，后面的元素得你手写循环一个个往后挪。</li>
      <li>越界访问没人拦你，写错了就是一段随机崩溃。</li>
    </ul>
    <p>
      所以要问的是：<strong>能不能有一个容器，自己知道大小、能按位置读写、能在任意位置增删，还能在运行时长大？</strong>——而且，这个「任意位置增删」的代价，是不是在任何位置都一样？
    </p>

    <h2>vector动态扩容</h2>
    <p>
      最省事的答案就是 <code>std::vector&lt;int&gt;</code>：一块会自己长大的连续动态数组，用 <code>push_back</code> 往尾部追加，用 <code>v[i]</code> 按下标随机访问。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它是一段连续内存</strong>。元素挨着存放，所以按下标访问是常数时间，而且 CPU 缓存命中率极高——顺着 <code>v[i]</code> 从头读到尾，数据几乎是一整块搬进缓存的。尾部追加也是摊还常数时间。对「存一批、顺序处理一遍」这种最常见需求来说，vector 已经是最优解。
    </p>

    <h2>头部插入开销</h2>
    <ul>
      <li>头部插入是 <code>O(n)</code>：<code>vec.insert(vec.begin(), x)</code> 要把后面<strong>每一个</strong>元素都往后挪一格。几万条数据，每次插入都挪几万下，瓶颈立刻出现。</li>
      <li>中间插入同样是 <code>O(n)</code>，越靠前越贵。</li>
      <li>扩容会失效引用：当 <code>size</code> 超过 <code>capacity</code> 时 vector 会另找一块更大的内存、把元素全部搬过去，<strong>此前保存的所有迭代器、指针、引用瞬间全部失效</strong>。你在遍历时调用一次 <code>push_back</code>，循环里那个旧迭代器就可能指向已释放的内存。</li>
      <li><code>size()</code> 和 <code>capacity()</code> 很容易混：前者是实际元素数，后者是当前分配出去、还能装多少。若用 <code>vec[i]</code> 去写一个下标大于等于 <code>size()</code> 的位置，那是未定义行为，不是「自动扩容」。</li>
    </ul>

    <h2>容器按需选型</h2>
    <p>
      不推翻 vector，而是给它补几个「按需换容器」的选项。第一个要补的是<strong>头部也要能高效进出</strong>——因为它最常出现。如果缓冲区要两端都能压入弹出，就用 <code>std::deque&lt;int&gt;</code>：它按分段连续的方式存数据，<code>push_front</code> 和 <code>push_back</code> 都是 <code>O(1)</code>，同时仍然支持随机访问。代价是它的内存不是一整块连续，随机访问要绕一层分段表，性能略低于 vector，也不如 vector 缓存友好。
    </p>
    <p>
      补完头部，接着补<strong>「中间任意位置增删要 O(1)」</strong>这个需求。这就轮到 <code>std::list&lt;int&gt;</code>：双向链表，每个元素各自带着指向前后邻居的两个指针。插入和删除只用改几个指针，不搬动任何元素，所以任意位置都是 <code>O(1)</code>。但它换来的是三份代价：
    </p>
    <ul>
      <li><strong>没有随机访问</strong>——想去第 5 个元素，只能从链表头一个个走，<code>O(n)</code>。</li>
      <li>每个元素额外背上两个指针，内存开销明显变大。</li>
      <li>节点分散在堆上，<strong>缓存极不友好</strong>，顺着遍历时几乎每次都踩缓存未命中。</li>
    </ul>
    <p>
      如果连「两个指针」都嫌重，还有 C++11 的 <code>std::forward_list&lt;int&gt;</code>：单向链表，每个节点只存一个「下一个」指针，空间进一步压缩，代价是<strong>只能单向遍历</strong>，回不了头。它适合那些只需要从头扫到尾、并且对每个节点体积非常敏感的场景。
    </p>
    <p>
      选完容器，必须再补上一条最容易炸掉程序、却最常被忽略的规则：<strong>迭代器失效</strong>。不同容器在插入/删除后，先前拿到的迭代器、指针、引用还灵不灵，规则并不一样：
    </p>
    <ol class="lesson-steps">
      <li><strong>vector</strong>：插入若触发扩容重分配，<strong>所有</strong>迭代器、指针、引用全部失效；即便没扩容，插入点之后的迭代器也会失效。删除会让被删元素之后的迭代器全部失效。</li>
      <li><strong>deque</strong>：首尾插入通常只让迭代器失效，但中间的插入/删除会让全部迭代器失效。</li>
      <li><strong>list</strong>：插入<strong>不使任何</strong>已存在的迭代器失效；删除只让<strong>指向被删元素</strong>的那一个失效，其余照常可用。</li>
    </ol>
    <p>
      所以「在遍历时改容器」这件事，能不能做、怎么写，完全取决于上面这张表。也因此，当你要一边遍历一边频繁增删时，list 常常比 vector 更安全、更快。
    </p>
    <p>
      最后再补两个日常写法上的点。填充容器时优先用范围构造或 <code>assign</code>，让容器一次到位；<code>push_back</code> 一个临时对象时，改用 <code>emplace_back</code>（C++11）<strong>就地构造</strong>，省掉「先构造临时对象、再拷进来」这一步，C++11 的移动语义也让容器填充整体变快了。另外，list 和 forward_list 自带的<strong>特化成员函数</strong> <code>splice</code>、<code>merge</code>、<code>sort</code>、<code>reverse</code>、<code>unique</code> 比通用算法高效得多——它们只改指针、不搬元素，把排序压到 <code>O(n log n)</code> 的同时省下大量拷贝，别用错成通用 <code>std::sort</code>。
    </p>
    <div class="lesson-box warn">
      <strong>别把容器当黑盒换着玩：</strong>算法对<b>迭代器类别</b>有硬性要求——vector/deque 给的是随机访问迭代器，list 是双向迭代器，forward_list 只是前向迭代器。凡是需要随机访问的算法（如 <code>std::sort</code>）用在 list 上根本编译不过。反过来，<code>list::sort</code> 也不能用在 vector 上。换容器前先确认你要用的算法接受哪一类迭代器。另外 C++11 的 <code>array</code> 是编译期固定大小、但比内置数组安全（有 <code>at()</code> 边界检查、<code>size()</code>、迭代器）的容器，大小已知时优先用它。
    </div>

    <h2>三种容器插入对比</h2>
    <figure class="lesson-figure">
      <figcaption>对着代码和对照表看：同一个「往容器里加元素」的动作，在 vector、deque、list 上分别落在头部、中间还是尾部，各自是 <code>O(1)</code> 还是 <code>O(n)</code>——先想清楚你会选哪个，再看表验证。</figcaption>
      <CPP16StlSequenceContainers />
    </figure>

    <h2>顺序容器取舍</h2>
    <p>
      顺序容器的选择，本质是在「随机访问、增删位置、内存局部性」这三者之间取舍。<strong>默认选 vector</strong>；需要两端高效进出选 deque；需要中间任意位置 <code>O(1)</code> 增删选 list；连单向链表的指针开销都要省就选 forward_list。选定之后，还要按各自的迭代器失效规则来写遍历与增删——否则性能对了，程序照样会崩。
    </p>
    <div class="lesson-term">
      <span class="term-name">「迭代器失效」</span>指容器的某次操作让先前取得的迭代器、指针或引用不再指向一个有效元素。规则随容器而异：vector 一旦扩容重分配，<strong>全部</strong>迭代器失效，未扩容时插入点之后的也会失效；list 的插入<strong>不使任何</strong>迭代器失效，删除只失效指向被删元素的那一个。边界：正是这条差异决定了「遍历中能不能改容器」，也是把 <code>std::sort</code> 用在 list 上会编译失败、必须改用 <code>list::sort</code> 的原因。
    </div>
  </LessonArticle>
</template>
