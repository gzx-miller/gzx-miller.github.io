<script setup lang="ts">
import S12Valtio from './S12Valtio.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>结算组件里你写下 <code>state.qty++</code>，既没调 <code>useState</code> 的 setter，也没 <code>dispatch</code>，数量、总价却都更新了；更怪的是，同一屏里那个输入框组件改自己的内容时，计数组件一次都没重渲染。它是怎么在没人通知的情况下知道该更新哪儿的？
    </div>

    <h2>重渲染触发条件</h2>
    <p>
      React 的更新模型很明确：只有 <code>setState</code>（或 <code>dispatch</code>）才会触发重渲染，组件不过是「状态到界面」的纯函数。可业务里你最想要的写法，是让状态「就是个普通对象」——读时 <code>state.qty</code>，改时 <code>state.qty++</code>。这两种心智一直对不上，旧办法各有各的成本。
    </p>
    <p>
      <strong>把状态提升到共同祖先、再靠回调一层层往下传</strong>：跨了两三层组件就开始满地传回调，改一处牵动一片。<strong>塞进 <code>Context</code></strong>：任何字段一变，读到这个 Context 的组件全部重渲染，你改文本，旁边只读计数的组件也跟着跑。<strong>手写 <code>reducer</code> + <code>dispatch</code></strong>：每次改动都要造一个 action、写一条不可变更新，样板比状态本身还多。
    </p>
    <p>
      所以要回答的是：<strong>能不能让状态用最自然的普通对象写法直接读写，同时由系统自动追踪「谁读了哪一部分」，把重渲染收敛到真正依赖它的组件上？</strong>
    </p>

    <h2>普通对象式写法</h2>
    <p>
      最朴素的做法：状态就是一个普通对象，动作函数里直接改它——<code>function inc() { state.count++ }</code>。这个方案做对了一件事：<strong>状态的读写回到了零样板</strong>，没有 <code>reducer</code>、没有 <code>dispatch</code>、没有把状态塞进组件树。
    </p>
    <p>
      问题在于，它对 React 是「哑」的：React 只认 <code>setState</code>，一个普通对象被改了，没有任何人知道，界面自然不动。
    </p>

    <h2>变更不触发渲染</h2>
    <ul>
      <li>执行 <code>inc()</code> 后，界面上的数字完全不变——因为 React 根本不知道这个普通对象被改过。</li>
      <li>想让它更新，你只好另造一个版本号 state，每次改动都 <code>setVersion(v =&gt; v + 1)</code>；漏写一次，界面就静默停在旧值。</li>
      <li>把对象塞进 Context：改 <code>text</code> 时，只读 <code>count</code> 的组件也被重渲染，粒度粗到整棵子树。</li>
      <li>派生值继续用 <code>useMemo</code>：依赖仍靠人列，改的数据和列的依赖一旦对不上，就又回到那个「永远不刷新」的坑里。</li>
    </ul>

    <h2>Proxy拦截读写</h2>
    <p>
      不推翻「普通对象」这个写法，而是给对象套一层 <strong>Proxy</strong>，把「读写」本身变成可拦截的动作。Valtio 的 <code>proxy(state)</code> 返回的就是一个被代理的对象：你写 <code>state.count++</code> 时，代理的写拦截器知道某个属性被改了。但此刻它还不知道「该通知谁」——所以关键的设计是：<strong>不追踪「写」，而是追踪「读」</strong>。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>proxy</code> 创建响应式状态对象，跨组件共享同一引用：<code>const state = proxy({ count: 0, text: '', user: { name: 'Alice', age: 25 } })</code>。</li>
      <li>组件不直接读 proxy，而是用 <code>useSnapshot(state)</code> 拿到一份当时的<strong>不可变快照</strong>，渲染读的是快照。读取快照的过程中，代理的读拦截器记下组件实际访问了哪些路径：读了 <code>count</code> 就只登记 <code>count</code>，没读 <code>text</code> 就不登记。</li>
      <li>于是依赖范围由「组件读到了什么」自动决定。改 <code>text</code> 时只通知登记过 <code>text</code> 的组件，<code>Counter</code> 没读过它，纹丝不动；给 <code>useSnapshot(state.user)</code> 传子对象，还能把追踪进一步收敛到 <code>user</code> 这棵子树。</li>
      <li>快照是只读且不可变的，正好符合 React「状态是渲染时的一份快照」这个前提；而写始终发生在 proxy 上、读始终发生在快照上，两个方向井水不犯河水。</li>
    </ol>
    <p>
      再补上两条边界。不要把 proxy 整体放进 <code>Context</code> 往下传，那会把「依赖自动收敛」重新打回「整个子树重渲染」，快照隔离本来就是给组件消费用的；<code>useSnapshot</code> 返回的是只读快照，想改必须回到 proxy 上，快照里若含可变对象引用，也不宜当作 props 长期保存。
    </p>
    <p>
      最后一层便利在于：组件之外的普通逻辑可以直接读写 proxy，这让它很适合接入调试与持久化——<code>subscribe</code> 能订阅任意路径的变化，想在某个字段变动时写日志或落盘，不必让它经过 React。
    </p>

    <h2>实时更新与快照</h2>
    <figure class="lesson-figure">
      <figcaption>点「数量 +1」直接改写 proxy，看数量与总价实时变化；点「降价到 ¥79 / 恢复 ¥99」改单价；再点「snapshot()」把此刻的状态深拷贝成一条快照记录——直观感受「写代理、读快照」这套分工。</figcaption>
      <S12Valtio />
    </figure>

    <h2>读写时机分工</h2>
    <p>
      Valtio 把状态做成一个可写的普通对象，用 Proxy 在<strong>读时记录依赖、写时通知对应的人</strong>。你照旧直接改属性，组件用 <code>useSnapshot</code> 读不可变快照，重渲染就自动收敛到真正读了那部分数据的组件上。写的时候不追踪、读的时候才追踪，是它既能省掉样板、又保持细粒度的关键。
    </p>
    <div class="lesson-term">
      <span class="term-name">「响应式代理（reactive proxy / 读时依赖追踪）」</span>指用 Proxy 包住普通对象，在属性被<strong>读取</strong>时记录「哪个消费者读了哪条路径」，在属性被赋值时只通知读了这些路径的消费者。边界：追踪发生在读快照时、而不是写的时候；快照只读且不可变，改状态一律回到 proxy；不要把整个 proxy 丢进 React 的 Context，那会让依赖收敛失效。
    </div>
  </LessonArticle>
</template>
