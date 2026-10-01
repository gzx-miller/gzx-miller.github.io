<script setup lang="ts">
import N06Composables from './N06Composables.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 <code>composables/useCart.ts</code> 里写了购物车逻辑，页头用它显示商品数量、商品卡片用它负责加购。你以为这是「一处逻辑、一份状态」，结果在卡片上连点加购，页头的数字纹丝不动。更奇怪的是：这个函数页面里一行 import 都没写，却照样能调用——「免 import」和「状态不共享」这两件看起来矛盾的事，到底是怎么同时成立的？
    </div>

    <h2>提出问题</h2>
    <p>
      你想让一段<strong>响应式逻辑</strong>在多个组件里复用：比如「点击加一、同时给出双倍值」这种计数逻辑，页头要用、侧栏也要用。旧办法有三种，各有各的隐性成本。
    </p>
    <p>
      第一种是把逻辑复制粘贴到每个组件里——两处一模一样的 <code>ref</code> 与 <code>computed</code>，改动时漏改一处就留下不一致。第二种是把逻辑和视图揉在同一个组件里，想让别的组件也用，就得先把这个组件拆开一半。第三种是干脆把它做成全局状态塞进 store，可很多时候这段逻辑根本不是「一份人人共享的状态」，而只是「一组可复用的操作」，塞进全局反而制造了跨组件的隐式耦合。
    </p>
    <p>
      于是问题落到：<strong>能不能有一个约定好的地方，把这类「以 use 开头、封装一组响应式逻辑的函数」放进去，让它免手写 import 就能在任意组件复用，同时又不必强行把它变成全局单例？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      约定就在这里：把函数放进 <code>composables/</code> 目录、名字以 <code>use</code> 开头，Nuxt 构建时会扫描到它，并在被引用的地方自动插入 import。函数内部用 <code>ref</code>、<code>computed</code> 建立状态，把加、减、重置这些操作作为函数一起返回，调用方直接解构使用即可。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「逻辑」从「组件」里搬了出来</strong>。同一段 <code>useCounter</code> 既能被页头用，也能被侧栏用；而它待在哪个目录、叫什么名字，本身就已经说明了「这是一个可复用的组合式函数」，不需要你手写 import 去指路。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>每次调用 <code>useXxx()</code> 都会<strong>重新执行一遍函数体</strong>，得到一份全新的 <code>ref</code>。它不是全局单例：页头点加一，侧栏不会跟着变——这正是开场里那个「连点加购、页头不动」的原因。</li>
      <li>函数体在<strong>服务端和客户端都会执行一次</strong>。你在里面直接读 <code>localStorage</code> 或 <code>window</code>，服务端渲染时这些对象并不存在，整页就会报错。</li>
      <li>如果 composable 返回的是一个 <code>reactive</code> 对象，调用方直接解构取值会<strong>丢掉响应性</strong>——解构进普通变量之后，它就不再跟随源状态变化了。</li>
      <li>只有当它待在 <code>composables/</code> 目录、且名字以 <code>use</code> 开头时才会被自动导入；放到别处或忘了前缀，运行时就会提示函数不存在。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻这个方案，而是一层层把它的边界补上。
    </p>
    <ol class="lesson-steps">
      <li><strong>先立约定</strong>：把它安顿到 <code>composables/</code> 目录下、函数名以 <code>use</code> 开头。这两条同时满足，Nuxt 才会在构建时扫到并自动导入——这就是开场里「没写 import 也能调用」的答案。</li>
      <li><strong>再拆职责</strong>：一个 composable 只封装<strong>一个</strong>关注点；需要更复杂的业务时，让 composable 之间相互调用——先抽出一个基础的 <code>useCounter</code>，再在它之上组合出业务级的 <code>useCart</code>，每一层都能被单独复用与测试。</li>
      <li><strong>再保响应性</strong>：调用方解构时，保持拿到的是 <code>ref</code>（用 <code>.value</code> 访问）；若内部返回 <code>reactive</code> 对象，外面就用 <code>toRefs</code> 转换后再解构，别让响应性在解构那一刻被抹掉。</li>
      <li><strong>最后补双端安全</strong>（最关键的一步）：同一个 composable 在两端都会跑，而浏览器 API 只在客户端存在。稳妥的写法是用一个 <code>ref</code> 先放<strong>两端都安全</strong>的默认值，把读取 <code>localStorage</code> 的动作推迟到 <code>onMounted</code> 里——服务端渲染时跳过它，客户端挂载后再补上真实值。也可以先用 <code>import.meta<span>.client</span></code> 判断当前端侧，或用 <code>typeof(window) !== 'undefined'</code> 兜底。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个最容易踩的坑：</strong>其一，composable <strong>每次调用都是一份新状态</strong>，它解决的是「逻辑复用」，不是「状态共享」，需要共享就去用 <code>useState</code> 或 Pinia；其二，它会在两端各执行一次，任何<strong>浏览器专属对象</strong>——<code>window</code>、<code>document</code>、<code>localStorage</code>——都必须先判环境或推迟到 <code>onMounted</code> 之后再访问。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>分别玩一下三个 composable：给 <code>useCounter</code> 点加一减一、切换 <code>useToggle</code>、在 <code>useLocalStorage</code> 的输入框里改写文字并保存——每一块界面都各自维护一份状态，彼此互不串扰。</figcaption>
      <N06Composables />
    </figure>

    <h2>总结</h2>
    <p>
      在 Nuxt 里，<code>composables/</code> 目录加上 <code>use</code> 前缀，就是「免 import 复用逻辑」的约定：它把一段响应式逻辑从组件里抽出来，按需注入到任意调用方。但它既不是全局单例（每次调用一份新状态），又会在服务端和客户端各跑一次——<strong>把访问浏览器 API 的动作推迟到客户端</strong>，才是它能在 SSR 下稳稳工作的前提。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Composable（组合式函数）」</span>以 <code>use</code> 开头的函数，内部用 Vue 响应式 API 封装<strong>单一关注点</strong>的逻辑，返回响应式状态与操作方法；在 Nuxt 中，位于 <code>composables/</code> 目录且符合 <code>use</code> 前缀约定的会被自动导入。边界：每次调用都会新建独立的响应式状态（<strong>非全局单例</strong>，共享状态请用 <code>useState</code> 或 Pinia）；函数体会在<strong>服务端与客户端各执行一次</strong>，访问浏览器 API 前必须判环境或推迟到 <code>onMounted</code>。
    </div>
  </LessonArticle>
</template>
