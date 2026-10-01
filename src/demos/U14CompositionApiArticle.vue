<script setup lang="ts">
import U14CompositionApi from './U14CompositionApi.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一个页面从 Options 写法迁到了 <code>&lt;script setup&gt;</code>，H5 上一路正常。可项目里有个老工具函数，要在任意地方调用 <code>this.$scope</code> 拿当前页面实例——你在 <code>&lt;script setup&gt;</code> 里翻遍了也找不到 <code>this</code>。一个没有 <code>this</code> 的组件，怎么拿到页面实例？
    </div>

    <h2>选项式API结构</h2>
    <p>
      在 Options API 里，一切都有 <code>this</code>：<code>this.$scope</code> 是页面实例，<code>data</code> 是状态，生命周期就是 <code>onLoad</code> / <code>onShow</code> 这些同名方法挂在对象上。<strong>组合式 API 去掉了 <code>this</code></strong>：逻辑变成一堆普通函数，状态用 <code>ref</code> / <code>reactive</code>，生命周期从「对象里的方法」变成「导入进来的函数」。这一下冒出两个真实的组织问题：页面级的 <code>onLoad</code> 该从哪来？没有 <code>this</code>，又怎么拿到页面 / 应用实例？
    </p>
    <p>
      继续用 Options 也能跑，但它的隐藏成本同样具体。第一，<strong>一个功能被选项切散</strong>：同一个搜索功能的状态在 <code>data</code>、计算属性在 <code>computed</code>、动作在 <code>methods</code>、初始化在 <code>onLoad</code>，读一个功能要在四五个位置之间来回跳。第二，<strong>复用只能靠 mixin</strong>，而多个 mixin 里同名数据和方法怎么合并，规则出了名的隐晦，很容易互相覆盖。第三，<strong>TypeScript 推断差</strong>，<code>this</code> 上的属性是动态挂上去的，类型提示经常退化成 <code>any</code>。
    </p>
    <p>
      问题于是变得明确：<strong>怎么用组合式 API 而不是 Options 来组织 uni-app 页面，页面级生命周期从哪导入，丢掉 <code>this</code> 之后实例又怎么取？</strong>
    </p>

    <h2>沿用选项式API</h2>
    <p>
      最朴素的方案就是先别动：继续用 Options API，页面照旧写 <code>data</code> / <code>methods</code> / <code>onLoad</code> / <code>onShow</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它是 uni-app 原生支持、稳定、所有老示例都这么写的形态</strong>。页面生命周期就是 <code>options</code> 里的同名方法，不需要任何导入，心智负担为零。对逻辑很少的单页，它完全够用，不迁也不丢人。
    </p>

    <h2>逻辑切分隐患</h2>
    <ul>
      <li>一个功能的状态、方法、生命周期被「选项」切到 <code>data</code> / <code>methods</code> / <code>onLoad</code> / <code>onShow</code> 四处，想读懂一个功能得来回跳。</li>
      <li>可复用逻辑只能塞进 mixin，多个 mixin 的同名数据/方法怎么合并规则隐晦，同名就会互相覆盖，出问题很难定位。</li>
      <li><code>this</code> 上的属性是运行期挂上去的，<code>tsc</code> 推不出来，写着写着就退化成 <code>any</code>，类型保护形同虚设。</li>
      <li>想做点平台特有的事、需要页面实例时，Options 里还能 <code>this.$scope</code>，可一旦进到组合式，连 <code>this</code> 都没有，直接卡住。</li>
    </ul>

    <h2>组合式API聚合</h2>
    <p>
      不推翻「用 Vue 写页面」，而是把组织方式换成 <code>&lt;script setup lang="ts"&gt;</code>。第一层，状态与派生值都写在同一个顶层作用域：状态用 <code>ref</code> / <code>reactive</code>，派生值用 <code>computed</code>。这里有一个省事的地方——<code>&lt;script setup&gt;</code> 里声明的变量和方法<strong>不需要手动 <code>return</code></strong>，模板直接就能用，这比写 <code>setup() { return {...} }</code> 干净得多。
    </p>
    <p>
      第二层，页面生命周期从 <code>@dcloudio/uni-app</code> 导入。这是本课最关键的一条边界：<code>&lt;script setup&gt;</code> 里<strong>没有 options 对象可以放 <code>onLoad</code></strong>，所以页面级的 <code>onLoad</code> / <code>onShow</code> / <code>onUnload</code> / <code>onReachBottom</code> 都要先导入、再当函数调用，回调里写逻辑：
    </p>
    <p>
      <code>import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'</code>，然后 <code>onLoad((options) =&gt; { const id = options.id })</code>。注意 <code>onLoad</code> 的回调参数<strong>就是路由 options（一个对象）</strong>，要按 key 读或解构出来，别指望它是 <code>this</code>。
    </p>
    <p>
      第三层，别把「Vue 的钩子」和「uni 的页面钩子」搞混。<code>onMounted</code> / <code>onUnmounted</code> / <code>computed</code> / <code>watch</code> 来自 <code>vue</code>；<code>onLoad</code> / <code>onShow</code> / <code>onHide</code> / <code>onUnload</code> / <code>onReachBottom</code> / <code>onPullDownRefresh</code> 这些页面级钩子来自 <code>@dcloudio/uni-app</code>。Vue 的钩子<strong>不要</strong>从 <code>@dcloudio/uni-app</code> 导入，页面钩子也别去 <code>vue</code> 里找——分不清来源，就会出现「导进来了但从来不触发」这种最耗时间的 bug。
    </p>
    <p>
      第四层，记住<strong>二选一、不要混用</strong>。同一个页面里，页面生命周期只能挑一种写法：要么 Options 里的 <code>onLoad(options)</code>，要么组合式的 <code>onLoad((options) =&gt; {})</code>。两套都写，注册顺序和实际生效情况会随编译目标变化，行为不可预期。要迁移就整页迁，不要半页迁。
    </p>
    <p>
      第五层，回答开场的那个问题：拿不到 <code>this</code> 时用 <code>getCurrentInstance()</code>。它返回当前组件实例，配合 <code>getApp()</code> 就能拿到应用实例做平台特有的事。但更推荐的方向是<strong>「能不用实例就不用」</strong>，因为绝大多数想用 <code>this</code> 的场景其实都有更干净的去处：
    </p>
    <ol class="lesson-steps">
      <li><code>this.$scope</code> / 想要页面实例 → <code>getCurrentInstance()</code>。</li>
      <li><code>this.data</code> / 响应式状态 → <code>ref</code> / <code>reactive</code>。</li>
      <li>子组件通信 → <code>defineProps</code> / <code>defineEmits</code>。</li>
      <li>全局共享数据 → <code>getApp().globalData</code> 或 Pinia，根本不需要实例。</li>
    </ol>
    <p>
      第六层，也是组合式真正的收益：把可复用逻辑抽成 <strong>composable</strong>。把「加载列表 + 分页 + 下拉刷新」写成一个 <code>useList()</code> 函数，内部用 <code>ref</code> 和 <code>onLoad</code> / <code>onReachBottom</code>，对外只返回 <code>{ list, loading, refresh, loadMore }</code>；多个页面 <code>import</code> 同一个函数就行。它比 mixin 强在合并规则清晰——返回值是你自己命名的，冲突一眼可见，类型也能一路推下去。
    </p>
    <div class="lesson-box warn">
      <strong>注册时机这条边界最容易翻车：</strong>组合式的 uni 页面生命周期（<code>onLoad</code> / <code>onShow</code> 等）<strong>要在 setup 的同步执行阶段调用</strong>。把它放进 <code>await</code> 之后、条件分支里或 <code>setTimeout</code> 里，都可能注册不上——表现就是回调从不触发、又不报错。抽成 composable 时要在函数体顶层直接调用它，别包在异步流程里。另外它与 Options 的同名生命周期不能在同一页面混用。
    </div>

    <h2>生命周期调用次序</h2>
    <figure class="lesson-figure">
      <figcaption>点「onLoad / onShow / onUnload」三个按钮，看页面生命周期作为导入函数被调用时的顺序；左侧搜索框用的是 <code>ref</code> 加 <code>computed</code> 实时过滤课程——这就是组合式写法本身。</figcaption>
      <U14CompositionApi />
    </figure>

    <h2>按功能聚合逻辑</h2>
    <p>
      <code>&lt;script setup&gt;</code> 把逻辑从「按选项分类」变成「按功能聚合」：状态用 <code>ref</code>、派生用 <code>computed</code>、页面生命周期从 <code>@dcloudio/uni-app</code> 导入，模板自动可见不用 <code>return</code>。丢掉 <code>this</code> 不是损失——实例用 <code>getCurrentInstance()</code> 取，数据用 <code>ref</code>，通信靠 <code>defineProps</code> / <code>defineEmits</code>，全局数据走 <code>getApp()</code> 或 store，然后把逻辑抽成 composable。唯一要记死的是：页面生命周期二选一、且在 setup 同步阶段注册。
    </p>
    <div class="lesson-term">
      <span class="term-name">「composable（组合式函数）」</span>以 <code>use</code> 开头、内部可调用 <code>ref</code> / <code>computed</code> / <code>watch</code> 以及页面生命周期、返回一组状态与方法的普通函数，用于跨页面复用有状态的逻辑，替代 <code>mixin</code>。边界：页面级生命周期必须在 <strong>setup 的同步执行阶段</strong>调用，抽进 composable 时要在函数体顶层直接调用 <code>onLoad</code> / <code>onShow</code>，不能包在 <code>await</code> 之后或条件下；同一页面内组合式与 Options 的页面生命周期不能混用。
    </div>
  </LessonArticle>
</template>
