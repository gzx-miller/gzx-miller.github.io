<script setup lang="ts">
import S06JotaiAtoms from './S06JotaiAtoms.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>结算页的总价是这么算的：<code>const total = useMemo(() =&gt; count * price, [count, price])</code>。后来你加了会员开关，单价改成 <code>isMember ? memberPrice : price</code>，却忘了把 <code>isMember</code> 补进依赖数组——切一下会员开关，单价明明变了，总价却停在旧值一动不动。依赖关系得你亲手列，漏一个就静默出错。
    </div>

    <h2>独立事实与派生</h2>
    <p>
      这一页的真实状态其实是几个彼此独立的小事实：数量、单价、是否会员。而总价根本不是「又一份状态」，它是从这几个事实<strong>算出来</strong>的。问题在于：当一个值由别的值派生而来时，谁来记住「它依赖了谁」？
    </p>
    <p>
      旧办法各有各的成本。<strong>把所有字段塞进一个 <code>useState({ count, price, isMember })</code> 对象</strong>：任何字段变化都会产生新对象，读它的组件统统重渲染，粒度太粗。<strong>用几个独立 <code>useState</code> 再加 <code>useMemo</code> 手写依赖数组</strong>：依赖关系靠人维护，漏写就得到开场那个永远不变的总价，多写又白白重算。<strong>干脆把总价也存成一份 state</strong>，每次数量变了手动 <code>setTotal</code>：于是又多出一个必须和来源保持同步的真相来源，两处一不同步就打架。
    </p>
    <p>
      所以要回答的是：<strong>能不能让「状态」和「从状态算出来的值」都各自成为一个最小单元，依赖关系由「读取」这个动作自动建立、而不是靠人列依赖数组；并且让每个组件只订阅它真正读到的那几个单元？</strong>
    </p>

    <h2>最小原子单元</h2>
    <p>
      最朴素的做法：Jotai 把状态拆成最小单元 <code>atom</code>。每个基础 atom 直接持有一个值——<code>const countAtom = atom(1)</code>、<code>const priceAtom = atom(129)</code>，组件里 <code>const [count, setCount] = useAtom(countAtom)</code> 就读写它。
    </p>
    <p>
      这个方案做对了一件事：<strong>它不再按「页面」或「对象」打包状态，而是拆到了可独立订阅的最小粒度</strong>。改数量只会碰到订阅数量的组件，单价那边纹丝不动；而且 atom 定义在模块顶层、住在 React 树外面，和 Store 一样不依赖组件树。
    </p>

    <h2>计算落点之争</h2>
    <ul>
      <li>光有基础原子，总价在哪算？如果还是塞进某个组件里 <code>count * price</code>，它只是个临时变量——另一个组件想要「总价」就得重算一遍，还得自己保证算法和这里完全一致。</li>
      <li>继续用 <code>useMemo</code> 算总价：又回到手写依赖数组，像开场那样漏掉 <code>isMember</code>，总价会永远停在旧值，而且编译器不报错。</li>
      <li>把总价也做成一个可写 atom 存起来，每次数量变了手动 set 一下：立刻制造出第二个真相来源，两处不同步时谁对谁错都说不清。</li>
      <li>只关心总价的组件却直接订阅了 <code>countAtom</code>：数量每变一次，这个和数量无关的组件也白白重渲染一次，精细拆分的意义被抵消。</li>
    </ul>

    <h2>派生作为原子</h2>
    <p>
      不推翻「最小单元」，而是让<strong>派生这件事也成为一种原子</strong>。Jotai 允许 atom 不是给一个初值，而是给一个读取函数：<code>const totalAtom = atom((get) =&gt; get(countAtom) * get(priceAtom))</code>。它自己没有值、也不存值，每次需要时现算现得。这就像把派生值也放进同一个「单元体系」里，区别只是它靠计算而不是靠存储。
    </p>
    <ol class="lesson-steps">
      <li>先补「派生原子」。写下 <code>totalAtom</code> 的读取函数，里面用 <code>get(countAtom)</code>、<code>get(priceAtom)</code> 去读别的 atom。注意：<strong>这就是全部声明，没有额外的依赖数组</strong>——你不需要告诉系统它依赖了谁。</li>
      <li>再理解依赖是怎么建立起来的。派生 atom 一旦被读取，Jotai 在求值时就会调它的读取函数；读取函数里每执行一次 <code>get(otherAtom)</code>，系统就记下一条「读边」。等价的说法是：<strong>依赖关系由「读取动作」自动声明，而不是由人在依赖数组里列举</strong>。</li>
      <li>再把订阅粒度收回来。组件用 <code>useAtomValue(totalAtom)</code> 只订阅总价，它压根没读 <code>countAtom</code> / <code>priceAtom</code>，所以将来如果新增一个与总价无关的 atom，读它的组件完全不理会；<strong>某个原子变化时，只有依赖链路上真正受影响的消费者会被触发</strong>。再把派生链放进组件树，更新范围就自然收敛到了那条链上。</li>
      <li>再补可写性的边界。派生原子本身不可直写——<code>useAtom(totalAtom)</code> 拿到的 setter 是空的，除非你显式给读取函数再配一个写入函数。它的值<strong>始终来自依赖原子的当前状态</strong>，想改就改上游的基础原子。</li>
      <li>再补组织方式。atom 按功能领域拆分并在模块顶层集中定义、导出，保持引用稳定；如果确实要按 id 动态创建大量 atom（比如每门课程一个），引入 <code>atomFamily</code> 来统一管理，别自己手搓缓存。</li>
      <li>最后回到开场。把 <code>isMember</code> 也做成 atom，在 <code>totalAtom</code> 的读取函数里加一句 <code>get(isMemberAtom)</code>，这条依赖就自动挂上了。以后谁再往里加引用，只要读了，就进了依赖图——<strong>漏依赖这件事从根上被消掉了</strong>。</li>
    </ol>
    <p>
      再体会一下「派生」和「存储」的区别：<code>countAtom</code>、<code>priceAtom</code> 有价值、可以被写；<code>totalAtom</code> 没有自己的值，它只是「读的时候才跑的一段计算」。正因为如此，它永远不可能和上游不同步——它压根没存过副本。
    </p>
    <div class="lesson-box warn">
      <strong>两条容易忽略的边界：</strong>派生原子<strong>不可直写</strong>，它的值只来自上游原子，想改请改上游；atom 的<strong>定义要放在组件外部</strong>，若在渲染过程中新建 atom，每次渲染都是一个全新的引用，既拿不到缓存，订阅也会错位。
    </div>

    <h2>数量联动实时值</h2>
    <figure class="lesson-figure">
      <figcaption>用「增加 / 减少」改课程数量，看数字下面的总价 <code>¥129 × 数量</code> 实时跟着变。留意数量与单价是两个互不相干的基础原子，总价则是它们派生出来的——你只管改上游，总价自己会重算。</figcaption>
      <S06JotaiAtoms />
    </figure>

    <h2>读写即连依赖</h2>
    <p>
      Jotai 把状态拆成最小 atom，让「基础值」和「派生值」活在同一套单元体系里：基础 atom 存值，派生 atom 用读取函数现算。依赖关系由 <code>get</code> 的读取动作自动建立成一张图，某个原子一变，只有链路上真正受影响的消费者会被触发。你从此不必再手写依赖数组，也就不再有「漏列一个依赖」的错误。
    </p>
    <div class="lesson-term">
      <span class="term-name">「派生状态（derived state）」</span>指不额外存储、而是由其它状态经纯计算得到的值。Jotai 用读取函数 <code>atom((get) =&gt; ...)</code> 表达它：读取函数里每读一个上游原子，就自动建立一条依赖边。边界：派生状态<strong>只读、不可直写</strong>，想改要改上游；它<strong>不应</strong>再被复制成一份独立的可变状态，否则会出现需要同步的第二个真相来源；读取函数必须保持纯净，别在派生里产生副作用。
    </div>
  </LessonArticle>
</template>
