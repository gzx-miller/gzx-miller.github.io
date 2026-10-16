const n=`<script setup lang="ts">
import S24Overmind from './S24Overmind.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了一个「加载待办」的函数，里面 <code>fetch</code> 了一下、<code>setState</code> 了一下、顺手把 token 存进 <code>localStorage</code>。后来接口报错，你花半天才分清到底是网络挂了、状态写错了、还是存储满了；更头疼的是想给这段逻辑补个单测，得先把 <code>fetch</code> 和 <code>localStorage</code> 都 mock 一遍。
    </div>

    <h2>状态变更与副作用</h2>
    <p>
      这类逻辑里混着两种东西：<strong>改自己的状态</strong>，和<strong>与外界打交道</strong>（网络、存储、路由）。它们挤在同一个函数里，就同时带来三个必须由人承担的成本。
    </p>
    <p>
      <strong>测试要 mock 一整套环境</strong>：不 mock 就没法跑，逻辑没法脱离环境单独验证。<strong>出错时无从回溯</strong>：改状态和外部调用纠缠在一起，分不清是哪一步出的问题。<strong>和框架绑死</strong>：想把同一套业务搬到别的界面框架，得原样重写一遍。
    </p>
    <p>
      所以要回答的是：<strong>能不能立一条约定——状态只有一条变更入口，所有和外界打交道的能力都放进一个可替换的独立层，让「决定改什么」和「真的去外面拿」彻底分开？</strong>
    </p>

    <h2>单一状态树约定</h2>
    <p>
      最朴素的做法：把所有状态放进一个对象——一棵<strong>单一状态树</strong>，所有修改都通过 <code>actions</code> 里定义好的函数进行。这个方案做对了一件事：<strong>它建立了「变更入口唯一」的约定</strong>，每次改动都对应到一个有名字的动作，界面永远通过调用动作来推进，而不是到处直接改字段。
    </p>
    <p>
      但只做到这一步还不够。
    </p>

    <h2>动作内副作用</h2>
    <ul>
      <li><code>actions</code> 里照样直接 <code>fetch</code>、直接写 <code>localStorage</code>，测试还是得 mock 网络和存储，逻辑离不开环境。</li>
      <li>「决定改什么」和「怎么去外面拿」写在同一个函数里，想换一种取数方式（缓存、mock、离线）只能改动 action 本身。</li>
      <li>派生值（完成率、按类型分组）还得在组件里现算，和状态分成两地，复用也就无从谈起。</li>
      <li>所有状态平铺在一个大对象里，业务一多就成一张大表，看不出边界在哪。</li>
    </ul>

    <h2>副作用外置与派生</h2>
    <p>
      不推翻「单一状态树 + 唯一入口」，而是把副作用抽出来、把派生和模块结构补齐。一层层来：
    </p>
    <ol class="lesson-steps">
      <li>先钉死唯一入口：所有 state 变更都写进 <code>actions</code>，组件只调用 <code>actions</code>。为什么先补它——没有唯一入口，就谈不上「每次变更都能对应到一个动作」，也就无从追踪与回放。actions 里对 state 直接赋值即可，不必手写不可变更新。</li>
      <li>再把副作用抽出来：网络、存储、路由这类「和外界打交道」的能力放进 <code>effects</code>，action 里通过 <code>effects.api.getTodos()</code> 使用。为什么第二步补它——这一步把 action 从环境里解放出来：action 只负责「拿到数据后把 state 改成什么样」，「数据从哪儿来」交给 effects。测试时给 effects 注入一个假 api，action 逻辑不碰真网络就能验证。</li>
      <li>再补派生：把完成率、按类型分组这类值做成 <code>derived</code>（示例里也叫 getters），从 state 派生，和 state 待在同一棵树上，组件不必自己算。</li>
      <li>再补「分形」组织：按业务域把 state、actions、derived、effects 拆成一个个命名空间模块，每个模块内部结构一致、还能嵌套——大应用也能按域切清楚。注意它们仍合成<strong>同一个 store</strong>，不是各管各的多个状态源。</li>
      <li>最后补跨框架：核心与界面框架解耦，同一份 config 既能在 React 用 <code>useOvermind</code> 解构出 <code>state</code> / <code>actions</code>，也能给 Vue 用，业务逻辑只写一次。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>三条边界：</strong>state 只能在 action 里改，别在组件里直接动它；effects 只放「外部能力」，别把业务状态判断塞进去，那等于把耦合又搬了个位置；命名空间要先按业务域划分，再往里放 actions / effects，否则「分形结构」只是摆设。
    </div>

    <h2>单次动作连锁变更</h2>
    <figure class="lesson-figure">
      <figcaption>在「森林区域」页点已解锁区域的「探索」——它是一次 action，里面对外同时扣体力、加经验、可能解锁新区域、往背包里收东西；切到「背包」看物品与稀有度，「收藏价值」和「稀有数量」都是派生值；再切到「状态结构」页，能直观看到这棵树是怎么按 state / getters / actions 分层、又如何由命名空间组合起来的。</figcaption>
      <S24Overmind />
    </figure>

    <h2>命名空间与硬约定</h2>
    <p>
      Overmind 把状态组织成一棵按命名空间「分形」展开的单一状态树，并立下两条硬约定：<strong>state 只能由 actions 改</strong>，<strong>与外界打交道的副作用一律放进 effects</strong>。这样一来，每次状态变更都能回溯到某个具名动作，而外部能力因为成了可注入、可替换的一层，action 逻辑就能脱离真实环境单独测试——网络、存储、框架都不再和业务逻辑纠缠。
    </p>
    <div class="lesson-term">
      <span class="term-name">「effects（副作用层）」</span>是与 state、actions 并列的一层，专门容纳网络请求、本地存储、路由跳转等与外界交互的能力，由 Overmind 在创建 store 时统一注册，并注入进每个 action 的上下文里。边界：action 通过 effects 调用外部能力，<strong>从不在 action 里直接 fetch 或写 localStorage</strong>；effects 只负责「把外部世界的能力搬进来」，业务判断仍留在 action；因为它可以被替身整体替换，这一层一旦抽出来，action 逻辑就能脱离真实环境单独测试。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
