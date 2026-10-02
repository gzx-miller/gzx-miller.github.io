const e=`<script setup lang="ts">
import K25ShallowReactivity from './K25ShallowReactivity.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>门店库存工作台只是把接口返回的三千条商品目录「存」进一个响应式变量，列表还没渲染，页面就明显卡了一下——光是把数据放进去，为什么会变慢？
    </div>

    <h2>大数据量响应式开销</h2>
    <p>
      你在做一个门店库存工作台。进入页面时接口一次性返回三千条商品，每条有几十个字段：名称、条码、货架位、多档价格、多仓库存……页面要能点选某个商品、给它扣一件库存，也能一键给整批商品补货。你很自然地写下一句把目录存进 <code>ref</code> 的代码，然后发现列表要好几秒才出来，滚动也发涩。
    </p>
    <p>
      奇怪的地方在于：你并没有做任何计算，也没有遍历渲染前先做处理，真的只是「存了一份数据」。问题出在 Vue 的响应式不是「存下来」这么简单。当 <code>ref</code> 拿到一个对象或数组时，它会<strong>递归</strong>地把里面每一层都转成响应式代理：对象的每个属性被包一层 getter 与 setter，数组的每个元素同样如此。三千条乘上几十个字段，就是十万级别的代理要在打开页面时一次性建好——你付掉的是「为每个深层字段准备一次更新追踪」的成本，而你其实只关心一件事：整份目录什么时候被换掉。
    </p>

    <h2>深度响应式代理</h2>
    <p>
      最省事的做法，也是默认做法：整份目录直接交给 <code>ref</code>，写成 <code>const products = ref&lt;Product[]&gt;([...])</code>。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>目录里任何一处改动都会被自动追踪，你永远不用担心「改了却没刷新」</strong>。对于只有几十条、需要逐字段编辑的数据，这是最省心也最不容易出错的选择，日常表单本来就该继续用它。
    </p>

    <h2>代理构建开销</h2>
    <ul>
      <li>深层代理是有成本的：三千条目录意味着十万级的属性被包上访问器，打开页面时就要全部建好，冷启动明显变慢。</li>
      <li>这份目录是「整体来、整体换」的：从接口一次取回、按批调整、按批写回，几乎不会单独改某个对象的某个字段，深层追踪的钱基本白花。</li>
      <li>库存调整本身就是批量业务，一次可能改几十条；深层响应式会为每一次赋值各排一次更新，大量开销浪费在中间的刷新上。</li>
      <li>目录里常常混着不该被代理的东西，比如图表实例、地图对象、第三方 SDK 实例——被递归包一层之后，它们内部依赖 <code>this</code> 相等的判断可能直接失效。</li>
    </ul>

    <h2>浅层响应式追踪</h2>
    <p>
      把「不要递归代理」这条诉求翻译成 API，对应的工具就是 <code>shallowRef</code>。它只追踪一件事：<code>.value</code> 被整体替换。写成 <code>const products = shallowRef&lt;Product[]&gt;([...])</code> 之后，内部的对象和数组都保持原样，只有顶层这一层是响应式的，省下的正是为海量深层字段建代理的开销。
    </p>
    <p>
      代价随之而来：既然内部没有被追踪，原地修改深层数据就不会触发更新。例如 <code>products.value[0].stock -= 1</code>，数据确实变了，界面却纹丝不动。好在 <code>shallowRef</code> 留了两个出口。
    </p>
    <ol class="lesson-steps">
      <li>整体替换：用 <code>products.value = products.value.map(...)</code> 生成一份新数组。顶层引用变了，所有依赖自然收到通知，这是最贴合「不可变数据」习惯的做法。</li>
      <li>主动通知：改完之后调用 <code>triggerRef(products)</code>，手动告诉依赖「这个浅层引用该重新读了」。</li>
      <li>批量收尾：一次循环把所有库存改完，只在最后调用一次 <code>triggerRef</code>，界面只渲染一次，也不会露出改到一半的中间状态。</li>
      <li>记住原地操作：<code>push</code>、<code>splice</code> 同样不会触发更新，收尾时也要补一次 <code>triggerRef</code>，或者干脆换成整体替换的写法。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>一个常见的误用：</strong><code>triggerRef</code> 本身没有错，错在把它当成「手动刷新视图」的万能按钮。它的前提是你明确知道深层修改已经全部完成；如果随时都在调用它，等于绕过了响应式的粒度控制，退回到手动刷新的老套路里。
    </div>
    <p>
      还有一条容易被忽略的边界：<code>shallowRef</code> 不是「更快的 <code>ref</code>」，而是「语义不同的 <code>ref</code>」。普通业务表单、需要逐字段编辑的配置对象，仍然优先用 <code>ref</code> 或 <code>reactive</code>，不要为了性能牺牲可理解性。它真正适合的是四类场合：大型且倾向整体替换的数据、第三方实例与图表对象、一批改完才需要展示的批量更新，以及只是想守住一个引用、不想被深挖的场景。
    </p>

    <h2>手动刷新与自动追踪</h2>
    <figure class="lesson-figure">
      <figcaption>先点「只修改深层数据」看界面不动，再点「triggerRef 刷新视图」感受主动通知。</figcaption>
      <K25ShallowReactivity />
    </figure>

    <h2>追踪层级取舍</h2>
    <p>
      浅层响应式把「追踪到哪一层」这件事变成了一个显式选择。默认的 <code>ref</code> 追到最深，换来的是逐字段编辑的省心；<code>shallowRef</code> 只守顶层，换来的是海量数据下的启动与更新成本。选定之后，更新时机也由你掌握——要么替换整个 <code>.value</code>，要么在批量完成后自己喊一声 <code>triggerRef</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「浅层响应式」</span>以 <code>shallowRef</code> 为代表，只追踪顶层 <code>.value</code> 的整体替换，不递归代理内部对象，因此省下了为海量深层字段建立代理的开销。原地修改深层数据不触发更新，需要 <code>triggerRef</code> 主动通知或直接替换整个 <code>.value</code>；适合大型不可变数据、第三方实例与批量更新场景。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
