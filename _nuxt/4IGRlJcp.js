const e=`<script setup lang="ts">
import S23Mobx from './S23Mobx.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给「探索森林」写了一个方法，里面依次改了物品列表、体力、经验三样东西。跑起来一看，日志里同一个统计值被重算了十几次，列表也重渲染了好几轮——一次业务动作，凭什么通知了这么多次？
    </div>

    <h2>领域模型被拆散</h2>
    <p>
      这些字段本来是同一个领域对象的一部分：一个「探险家」有物品、体力、经验，还有从它们算出来的完成度、稀有物列表。可你一直把它们当成互不相干的一堆 <code>useState</code> 值，于是成本全冒了出来。
    </p>
    <p>
      <strong>一个动作要改好几个字段</strong>：每 <code>set</code> 一次就渲染一轮，一次操作能触发 N 轮渲染。<strong>派生值每次渲染都重算</strong>：完成率、稀有物列表每次都对整个数组重新 <code>filter</code> 一遍，哪怕依赖根本没变。<strong>状态和行为被拆开</strong>：数据在 state 里，改数据的逻辑散落在各组件的处理函数中，一个业务动作的完整链路在哪，没人说得清。
    </p>
    <p>
      所以要回答的是：<strong>能不能把「领域对象」直接变成可观察的——数据和行为长在一起，改字段时自动通知真正用到它的人，并且一次动作里的多次修改能合成一次通知？</strong>
    </p>

    <h2>类封装状态与行为</h2>
    <p>
      最朴素的做法：写一个普通 class，把数据和行为都装进去——<code>this.items.push(...)</code>、<code>this.energy -= 10</code>，派生值用 getter 写 <code>get discoveredCount() { return this.items.filter(i =&gt; i.discovered).length }</code>。这个方案做对了一件事：<strong>状态和行为内聚在同一个对象里</strong>，领域逻辑不必再散落到组件中。
    </p>
    <p>
      但它对视图是「哑」的：改了字段，React 完全不知情。
    </p>

    <h2>变更通知缺失</h2>
    <ul>
      <li>普通 class 里改字段，界面停在旧值不动，因为没有任何机制把这个变更告诉 React。</li>
      <li>改用一堆 <code>useState</code> 逐字段同步：一个动作里改三处就 <code>set</code> 三次，触发三轮渲染，重复计算也躲不掉。</li>
      <li>派生值写成普通 getter：每次渲染都重新 <code>filter</code> 整个数组，即使 <code>items</code> 根本没动，白算一遍。</li>
      <li>各处随手 <code>store.energy -= 10</code>，区分不出「这是一个业务动作」还是「某处的临时一改」，出了 bug 回溯不到具体动作。</li>
    </ul>

    <h2>自动可观察与缓存</h2>
    <p>
      不推翻「class 收纳状态与行为」，而是让它的成员<strong>变成可观察的</strong>，再补上缓存与事务。一层层来：
    </p>
    <ol class="lesson-steps">
      <li>先让字段「可观察」。<code>makeAutoObservable(this)</code> 自动把类字段标成 observable、把 getter 标成 computed、把方法标成 action。要让系统追踪，先得让对象成员带上「可观察」这个身份；注意它作用在<strong>成员级别</strong>——读到了哪个字段，才订阅哪个字段。</li>
      <li>再让组件订阅。用 <code>observer</code> 包住组件（React 里是 <code>observer(() =&gt; ...)</code>）。组件渲染时读到的每个 observable 字段会被自动登记，某字段一变，只有登记过它的组件重渲染。这套收集是<strong>隐式</strong>的：你不需要写依赖数组。</li>
      <li>再补「派生 + 缓存」。getter 标成 computed 后，它会缓存结果并记录自己依赖了哪些 observable：依赖没变时反复读取直接命中缓存，依赖变了才重算。这正好解决「每次渲染都重新 filter」的问题。</li>
      <li>再补 action 事务。方法标成 action 后，一次 action 里的多次赋值会被打包，只在动作结束时通知一次观察者——开场那种「一次动作通知十几次」就此消失。再配上 <code>configure({ enforceActions: 'always' })</code>，强制状态只能在 action 里改，从约定上堵住「随手一改」。</li>
      <li>再补异步边界。<code>await</code> 之后的续写已经脱离了原 action 的事务作用域，跨组件的异步流程要在批量修改处用 <code>runInAction</code> 包起来，免得又散成多次中间态通知。</li>
    </ol>
    <p>
      最后把与隔壁 Valtio 的差异说清。两者都靠追踪做细粒度更新，但底座不同：Valtio 用 Proxy 包一个普通对象，写就是直接赋值、读走的是不可变快照，依赖在「读快照」那一刻收集，追踪退场后没有独立的派生/事务层；MobX 则直接读可观察对象本身，没有快照层，追踪发生在每次被观察函数执行时，并且额外提供 <code>computed</code> 缓存与 action 事务。一句话——Valtio 更像「给 React 一张不可变快照」，MobX 更像「把面向对象的领域模型整体变透明可观察」。
    </p>

    <h2>单次动作单轮更新</h2>
    <figure class="lesson-figure">
      <figcaption>在「探索」页点「开始探索」，一次动作里同时消耗体力、可能发现新物种、加经验——留意它只更新一轮，而不是每改一个字段就抖一下；切到「图鉴」看发现进度和分类完成度随动作变化，切到「统计」看「稀有以上」的数量与总收集数，这些都是带缓存的派生值。</figcaption>
      <S23Mobx />
    </figure>

    <h2>最小化变更通知</h2>
    <p>
      MobX 把普通对象（尤其 class 实例）包装成一张可观察图谱：字段是 observable，派生值用带缓存的 computed，修改集中在 action 里做，<code>observer</code> 组件只订阅自己渲染时真正读到的那些字段。一次 action 的多次赋值合并成一次通知，重复读取命中 computed 缓存——细粒度更新与「一次动作通知一次」同时拿到，代价是你要理解「谁被追踪、何时重跑」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「computed（派生值）」</span>指由一个或多个 observable 经纯计算得到的只读值。MobX 会为它记录依赖：依赖的 observable 没变时反复读取命中缓存，依赖变了才重算并通知观察者。边界：computed <strong>只在被观察时才缓存</strong>（没人读就懒算、也谈不上缓存）；它必须纯净，不能在里面修改其它 observable；随时间变化或带副作用的计算不适合放进 computed。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
