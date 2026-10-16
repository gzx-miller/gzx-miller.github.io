const e=`<script setup lang="ts">
import S22Recoil from './S22Recoil.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个统计面板要显示「完成率」，它订阅的是整份 todo 数组。你勾掉一项，整份列表重渲染是应该的，可那个只显示 <code>3/5</code> 的小面板也跟着重渲染——它明明只关心完成数，凭什么数组一变它就得跟着跑一遍？
    </div>

    <h2>原始值与派生值</h2>
    <p>
      当状态被塞进一个大对象时，谁读这个大对象，谁就得在它<strong>任何</strong>字段变化时重渲染。可业务里的两类东西本不该捆在一起：文字是原始事实，字符数是算出来的；todo 数组是原始事实，完成率是算出来的。旧办法各有各的成本。
    </p>
    <p>
      <strong>用 Context 存大对象</strong>：任何字段一变，全部消费者重渲染，粒度粗。<strong>手写 selector + <code>useMemo</code></strong>：派生逻辑散落在各个组件里，依赖靠人列，换个组件想复用同一算法就得重抄一遍。<strong>全局 store 里放 selector</strong>：能复用，但「派生引派生」的多级关系、以及异步派生，仍然缺一套统一的表达。
    </p>
    <p>
      所以要回答的是：<strong>能不能让每个「事实」和每个「派生值」都成为独立的节点，节点之间靠「读取」连成一张有方向的依赖图，谁只读自己关心的节点，就只在那条链上被触发？</strong>
    </p>

    <h2>原子状态单元</h2>
    <p>
      最朴素的做法：Recoil 用 <code>atom</code> 把状态拆成最小单元——<code>const textState = atom({ key: 'textState', default: '' })</code>，组件里 <code>const [text, setText] = useRecoilState(textState)</code> 读写。这个方案做对了一件事：<strong>它把「一个大对象」拆成了可独立订阅的最小单元</strong>，改一个 atom 只惊动读它的组件。
    </p>
    <p>
      但只要只有原子，派生值还是临时变量。
    </p>

    <h2>组件内派生计算</h2>
    <ul>
      <li>字符数、完成率这类派生如果写在组件里 <code>text.length</code>，就只是个临时变量：另一个组件要同样的值得重算一遍，算法一旦不同步就冒出两个「字符数」。</li>
      <li>「派生引派生」——比如完成率依赖已完成数、已完成数依赖列表——没有统一写法，只能层层硬塞进同一个组件。</li>
      <li>异步派生无从表达：按 <code>userId</code> 去取用户资料这种「算一半要去网络拿」的值，纯同步函数写不出来。</li>
      <li>组件直接读整个数组 atom，哪怕只用到完成数，数组一变它照样重渲染，粒度又粗回去了。</li>
    </ul>

    <h2>派生提升为节点</h2>
    <p>
      不推翻「最小单元」，而是让<strong>派生也成为一种节点</strong>，并把节点连成一张有方向的图。一层层补上：
    </p>
    <ol class="lesson-steps">
      <li>先补「派生节点」：引入 <code>selector</code>，它是个纯函数，用 <code>get</code> 去读别的 atom / selector，产出派生值。于是「字符数」「完成率」不再散落在组件里，而是图上一个有名字的节点。</li>
      <li>再补「节点可复用」这个关键：每个 atom 与 selector 都必须有一个<strong>全局唯一的 key</strong>，这个 key 就是节点在图里的身份。任意组件都能按同一个节点引用同一份计算与结果，「派生写一遍、处处可用」才成立——这正是它和「把派生写死在某个组件里」的根本区别。</li>
      <li>再看依赖是有方向的：selector 可以读 selector，节点便连成一张有向无环图。<code>greetingSelector</code> 同时读 <code>userNameAtom</code> 与 <code>userMoodAtom</code>，两个原子任一变它都重算；而只读 <code>collectedLeavesAtom</code> 的叶子计数器，完全不受昵称影响。</li>
      <li>再补订阅粒度：组件用 <code>useRecoilValue</code> 只订阅它读的那几个节点。改一个 atom，只有图上真正连到它的订阅者被触发，旁支纹丝不动——开场那个「只关心完成数却被数组连累」的统计面板就此脱身。</li>
      <li>再补异步：<code>selector</code> 的 <code>get</code> 可以返回 Promise，于是「派生」也能是异步的。读到这样一个异步 selector 的组件会进入挂起状态，由外层 <code>Suspense</code> 展示后备界面；依赖的 atom 一变，它还能失效重算。</li>
      <li>最后守住边界：key 必须全局唯一，重名会直接报错，这是把一堆散落派生组织成一张图的前提；selector 的 <code>get</code> 要保持纯净，别在里面写副作用。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>选型提醒：</strong>这类原子化方案与 React 生态深度绑定，主要面向 React 项目。同一个团队后来推出了新的原子化工具，采用前先确认它仍在积极维护，再决定是否落到生产。
    </div>

    <h2>两节点共同派生</h2>
    <figure class="lesson-figure">
      <figcaption>在「探险者档案」里改昵称、点心情按钮，看顶部问候语跟着变——它由 <code>userNameAtom</code> 与 <code>userMoodAtom</code> 两个节点共同派生；再点「记录一次森林访问」，看等级徽章和进度条变化，这两者都派生自 <code>forestVisitsAtom</code>。切到「Atoms 原子」「Selectors 派生」两个页签，能逐个看到节点的当前值与它依赖了谁。</figcaption>
      <S22Recoil />
    </figure>

    <h2>有向无环依赖图</h2>
    <p>
      Recoil 把状态切成最小 atom，再用 selector 表达派生，atom 与 selector 通过「谁读了谁」连成一张有向无环图。全局唯一的 key 让每个节点都能被任意组件引用，派生逻辑从此写一遍、处处可用；组件只订阅自己读到的节点，更新就沿着图里真正相关的那条链传播，而不是整棵树一起动。
    </p>
    <div class="lesson-term">
      <span class="term-name">「有向无环依赖图（DAG）」</span>指若干节点用有方向的边连接、且不存在环的图。在这里，atom 是源节点、selector 是派生节点，selector 每次 <code>get</code> 到一个上游节点，就相当于画了一条从上游指向它的边；因为读取是单向的、派生不能回头改上游，这张图不会有环，也就不会互相触发成死循环。边界：每个节点的 key 必须<strong>全局唯一</strong>，否则图无法确定身份；selector 必须纯净、不产生副作用。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
