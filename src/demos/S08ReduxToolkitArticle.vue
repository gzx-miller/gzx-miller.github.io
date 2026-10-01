<script setup lang="ts">
import S08ReduxToolkit from './S08ReduxToolkit.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>报名功能上线两周，产品说「有用户反馈名额显示成了负数」。你翻遍代码：报名按钮里名额减一、某处「取消报名」里加一、还有一个「管理员调整」直接改字段。谁先谁后、到底哪一步把它减到了负数，只能靠你在脑子里推。你打开浏览器想看点历史——什么都没有，因为名额散在三个组件的 <code>useState</code> 里，改一次没人知道是谁干的。
    </div>

    <h2>提出问题</h2>
    <p>
      报名这件事的状态规则其实很硬：名额只能从 3 往下减到 0、绝不能变负，已报名数只能往上加。可现实是团队里好几个人、好几个入口都能改它，而「规则」只散在每个人的印象里。
    </p>
    <p>
      旧办法各有各的成本。<strong>状态散在各个组件的 <code>useState</code> 里</strong>：没有一个地方能同时回答「当前状态是什么」和「它是怎么变成这样的」。<strong>把改状态的 setter 交给十几个组件</strong>：想加一条「名额不为负」的规则，得在十几个地方各写一遍，漏一处就有漏洞。<strong>出问题想排查</strong>：状态在哪里被改的、改成了什么，没有统一记录，只能靠复现和猜。
    </p>
    <p>
      所以要回答的是：<strong>能不能让「状态如何变化」只在一个地方定义、所有改动都走同一条路，并且每一步都留下可供回放的历史？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：用 Redux Toolkit 的 <code>createSlice</code>，把初始状态和所有 reducer 放在一起。<code>createSlice({ name: 'enrollment', initialState: { seats: 3, enrolled: 0 }, reducers: { enroll(state) { if (state.seats &gt; 0) { state.seats--; state.enrolled++ } }, reset: () =&gt; ({ seats: 3, enrolled: 0 }) } })</code>。它顺手还会生成对应的 <code>actions.enroll</code>、<code>actions.reset</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>状态规则被集中了</strong>。「名额不能为负」这条判断只写在 <code>enroll</code> 里一次，报名按钮、取消入口、管理员入口全都共享同一条规则——而不是每人各写一遍。再用 <code>configureStore({ reducer: { enrollment: enrollmentSlice.reducer } })</code> 组合成单一 store，用 <code>&lt;Provider store={store}&gt;</code> 把它交给整棵组件树。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>想让组件直接改 store——不行，store 是只读的。你若试着写 <code>store.getState().seats--</code>，值可能被改了，但没有任何人收到通知，界面也不会更新。</li>
      <li>每个组件都写 <code>useSelector((root) =&gt; root)</code> 取回整棵状态树：任何一个 slice 变一下，所有组件统统重渲染，订阅粒度形同虚设。</li>
      <li>所有业务都塞进一个 slice：文件膨胀到读不动，改报名逻辑还得先翻过认证、购物车的 reducer。</li>
      <li>沿用 Redux 的原始写法——手写 <code>action type</code> 常量、手写一堆 <code>{ ...state, ... }</code> 的不可变展开：样板多到容易写错，这正是当年 Redux 被嫌弃的主要原因。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「集中定义规则」，而是把<strong>数据怎么流、样板怎么省、读取怎么收窄、历史怎么看</strong>这四件事一层层补齐。
    </p>
    <ol class="lesson-steps">
      <li>先补「单向数据流」。组件不再直接改 store：它用 <code>useDispatch()</code> 拿到 dispatch，调用 <code>dispatch(enrollmentSlice.actions.enroll())</code> 发出一个 action；reducer 接收「当前状态 + 这个 action」，返回下一个状态；store 更新；订阅它的组件再渲染。<strong>整条链路只有一条方向，任何改动都必须经过 dispatch。</strong></li>
      <li>再补「用 Immer 消掉样板」。<code>enroll</code> 里写的 <code>state.seats--</code> 看起来是在直接修改，其实 reducer 内部被 Immer 包住了：它记下你对草稿对象的修改，最后生成一份新的不可变状态。<strong>所以你不用再手写 <code>{ ...state }</code>，但 reducer 依然必须保持纯函数</strong>——不要在里面对外发请求、不要去改 reducer 之外的东西。</li>
      <li>再补「读取的粒度」。组件用 <code>useSelector((root) =&gt; root.enrollment.seats)</code> 只取需要的切片，让订阅收敛；selector 返回稳定最小切片，避免整个 store 一动就全树重渲染。</li>
      <li>再补「可回溯」。<code>configureStore</code> 默认就接好了 Redux DevTools：每一次 dispatch 都进时间线，你能看到 action 名、前后的 state，甚至「时间旅行」回到某一步。<strong>名额究竟在哪一步被减到了负数，一眼就能查出来</strong>——这正是开场那个问题的答案。</li>
      <li>再补「组织边界」。按功能域拆 slice（enrollment、auth、cart 各自一个），在根 reducer 里组合，避免单个 store 文件无限膨胀；同时把光标位置、临时输入这类<strong>短暂 UI 状态</strong>留在组件本地，它们不属于全局 store。</li>
      <li>最后回到开场。现在名额的每一次增减都对应一条有名字的 action，负数从哪一步冒出来一目了然；规则集中在 slice 里，管理员入口也只能走同一个 <code>enroll</code>，绕不过去。</li>
    </ol>
    <p>
      顺带说清它和前面几课的分别：Zustand 是轻量、分散、树外的一份 store，Jotai 是把状态拆成细粒度原子，而 Redux Toolkit 走的是另一条路——<strong>刻意用更多约定换取更强的可预测与可追溯</strong>。它把「状态怎么变」完全收进 reducer，让整条数据流成为一条可被记录、回放的单行线。
    </p>
    <div class="lesson-box warn">
      <strong>两条容易忽视的边界：</strong>reducer 里那些「看着像直接修改」的写法由 Immer 负责转成不可变更新，但 <strong>reducer 仍必须是纯函数</strong>，不要在 reducer 里发请求或写外部变量；另外别把光标位置、折叠状态、临时输入这类短暂 UI 状态塞进全局 store，它们跟着组件生灭更合适。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点「报名」，剩余名额减一、已报名加一；一直点到 0 之后按钮还在，但状态不再变化——规则在 reducer 里把它拦住了。再点「重置」回到初始名额。整个过程每一步都对应一条命名的 action，可按同样的思路在 DevTools 里逐条回放。</figcaption>
      <S08ReduxToolkit />
    </figure>

    <h2>总结</h2>
    <p>
      Redux Toolkit 把「状态如何变化」收进 slice 里的 reducer，让所有改动都必须沿 dispatch 这条单行道流过去，因而每一步都可被记录、回放。Immer 负责把「可变写法」翻译成不可变更新，省掉手写展开；selector 负责把读取收窄到最小切片。它用更多的结构与约定，换来大型项目里最难得到的东西——可预测与可追溯。
    </p>
    <div class="lesson-term">
      <span class="term-name">「单向数据流（unidirectional data flow）」</span>指状态只能沿 <code>dispatch action → reducer 计算 → 更新 store → 组件订阅渲染 → 再触发 action</code> 这一条单行道变化，任何组件都不能绕过 dispatch 直接改 store。边界：它带来可追踪与可回放的代价是更多样板与一层间接；因此更适合状态规则严格、多人协作、需要统一调试工具的大型项目，局部的简单状态仍应以 <code>useState</code> 处理。
    </div>
  </LessonArticle>
</template>
