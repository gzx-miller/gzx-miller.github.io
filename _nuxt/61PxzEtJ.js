const e=`<script setup lang="ts">
import R04ControlledForm from './R04ControlledForm.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给姓名输入框传了 <code>value={form.name}</code>，满心以为能接管它的值，结果手指按下去一个字也敲不进去——输入框像被冻住了，控制台还飘出一句警告。为什么给输入框指定了值，它反而变得不能输入？
    </div>

    <h2>字段状态分散管理</h2>
    <p>
      报名表要做两件事：收集姓名和学习方向，提交前校验姓名至少两个字。如果你每个字段都自己管一份 state、每个输入框都配一个独立的处理器，字段一多，代码里就散落着一堆相似的 <code>handleName</code> / <code>handleDirection</code>；校验逻辑也会四处生根，同一个「至少两个字」的规则可能被写在两个地方。
    </p>
    <p>
      还有一笔账经常被忽略：直接点「提交」，页面会整页刷新、输入全部清空——浏览器对 <code>form</code> 的默认提交行为接管了你的流程。也就是说，值散落在 DOM 里、校验散落在各处、提交流程又不受你控制，这三件事凑在一起，表单就成了最难维护的地方之一。
    </p>
    <p>
      要回答的问题是：<strong>怎么让表单元素显示的值、你手里的数据、以及校验结果，全都指向同一个来源，并且由你亲手接管提交这个动作？</strong>
    </p>

    <h2>唯一事实来源</h2>
    <p>
      最小的一步：让 React 的状态来当输入框唯一的事实来源。给它一个 <code>value</code> 决定显示什么，再给一个 <code>onChange</code> 在每次输入时把新值写回去：<code>value={form.name}</code> 配上 <code>onChange={(e) =&gt; setForm(...)}</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>输入框里显示的内容，和你的 state 永远是同一个值</strong>。用户敲一个字符，事件先把值写进 state；state 一变，React 重新渲染，输入框显示的就是这份新值——显示与数据之间形成了一个闭环，你随时能读到、也能校验当前的输入。
    </p>

    <h2>缺失变更处理器</h2>
    <ul>
      <li>给了 <code>value</code> 却忘了给 <code>onChange</code>：输入框直接变成只读，怎么敲都不动，控制台还会警告「给了 value 却没有 onChange 处理器」。</li>
      <li><code>value</code> 一开始是 <code>undefined</code>、后来才变成字符串：输入框会在「不受控」和「受控」之间反复横跳，React 会警告你它的行为变得不可预测。</li>
      <li>每个字段都单独存一份 state、各写一个处理器：字段一多就成片复制，校验规则也散在几个函数里，改一处容易漏另一处。</li>
      <li>提交时忘了阻止浏览器默认行为：点击提交会触发整页刷新，你刚填的内容连同 state 一起被清空。</li>
    </ul>

    <h2>值绑定与变更回调</h2>
    <p>
      第一层，把闭环补完整。<code>value</code> 和 <code>onChange</code> 是<strong>成对出现</strong>的：一个负责「显示什么」，一个负责「变了之后写去哪」。少了任何一半，输入框要么只读，要么失控，两者都不算受控。
    </p>
    <p>
      第二层，把散落的字段收进一个<strong>对象 state</strong>：<code>useState({ name: '', direction: 'frontend' })</code>。名称、方向都放在同一个对象里，配一个统一的处理器。它靠输入框的 <code>name</code> 属性当计算属性键，一次更新一个字段：
    </p>
    <p>
      <code>const { name, value } = event.target; setForm(cur =&gt; ({ ...cur, [name]: value }))</code>。注意这里用了<strong>函数式更新</strong>和展开语法——把当前对象摊开、只覆盖变化的那一个键、产出一个新对象，既没改动旧状态，又能一句话应付所有字段。
    </p>
    <p>
      第三层，接管提交。在提交处理器里先调用 <code>event.preventDefault()</code> 挡掉浏览器默认的整页刷新，再从容地做校验、给出反馈。<strong>注意 <code>disabled</code> 只是体验层的顺手提示，不能当作校验</strong>——提交逻辑里仍然要再判一次，因为按钮状态并不能保证数据合法。
    </p>
    <p>
      最后，校验结果本身就是<strong>派生值</strong>：<code>nameError</code> 完全由当前的 <code>form.name</code> 算出来，所以它在渲染时现算即可，不必再存一份进 state。这样一来，显示值、数据、校验全都长在同一条链上——一处变，处处一致。
    </p>
    <div class="lesson-box warn">
      <strong>受控表单的三条纪律：</strong><code>value</code> 与 <code>onChange</code> 必须成对；不要让 <code>value</code> 在 <code>undefined</code> 和字符串之间切换，那会让输入框在受控与非受控间跳变；提交一定要 <code>preventDefault()</code>，<code>disabled</code> 只是提示，真正的校验还得在提交时再做一次。
    </div>

    <h2>输入联动与提交校验</h2>
    <figure class="lesson-figure">
      <figcaption>在姓名和方向里输入：输入框显示的值全部来自同一份对象 state；姓名不足两个字时错误提示在渲染阶段即时算出，点提交时则被 <code>preventDefault()</code> 挡住整页刷新。</figcaption>
      <R04ControlledForm />
    </figure>

    <h2>受控闭环与字段聚合</h2>
    <p>
      受控表单的核心是让 state 成为输入框唯一的事实来源：<code>value</code> 决定显示什么，<code>onChange</code> 把变化写回去，两者合成一个闭环。把字段收进一个对象、用统一的处理器更新，再把能推导的校验留在渲染里现算——显示、数据、校验三者从此指向同一个来源。
    </p>
    <div class="lesson-term">
      <span class="term-name">「受控组件（controlled component）」</span>指表单元素的值由 React 的状态驱动，通过 <code>value</code> 与 <code>onChange</code> 构成「显示—回写」闭环的写法，从而让组件成为唯一的数据来源。边界与例外：缺少 <code>onChange</code> 会让输入框变成只读；<code>value</code> 不能从 <code>undefined</code> 切到字符串，否则会在受控与非受控之间跳变；与之相对的是「非受控组件」，值存在 DOM 里、用 <code>defaultValue</code> 给初值、靠 ref 读取。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
