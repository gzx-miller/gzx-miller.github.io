const e=`<script setup lang="ts">
import R16AccessibleId from './R16AccessibleId.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一个「输入框 + 标签」的字段组件抽出来复用，第一份显示得好好的；再放一份「讲师姓名」，点第二个标签时，光标却跳进了第一个输入框——读屏软件念的，也还是第一段的说明文字。
    </div>

    <h2>标签与输入框关联</h2>
    <p>
      你想要的其实是一件事：让 <code>&lt;label&gt;</code> 和它对应的输入框、以及旁边那行说明文字，在语义上真正「绑」在一起。浏览器和辅助技术判断它们是不是一家人，靠的全是 <code>id</code>：标签用 <code>htmlFor</code> 指向输入框的 <code>id</code>，说明文字再用自己的 <code>id</code> 被输入框的 <code>aria-describedby</code> 引用。也就是说，<strong>这层关联不是画出来的，是几个共享同一个字符串的 id 拼出来的</strong>。
    </p>
    <p>
      组件一复用，麻烦就来了：字符串写死在组件里，两份实例就撞了同一个 id。可如果交给调用方手填 id，又有三笔隐藏成本落到人身上——你得保证全站不重名；每多用一次组件就多填一次；而且服务端渲染时服务端要先吐一份 HTML、客户端再「接管」它，两边生成的 id 一旦不一致，水合就对不上。
    </p>
    <p>
      于是问题被逼成一个明确的问句：<strong>一个可复用的表单组件，怎么自动得到一个既唯一、又稳定、还能兼顾水合的关联 id？</strong>
    </p>

    <h2>调用方传入标识</h2>
    <p>
      最省事的做法是把 id 当成普通 prop 交给调用方：<code>&lt;CourseField id="course-name" /&gt;</code>，组件内部拿它同时赋给 <code>htmlFor</code>、<code>id</code> 和拼接出的说明 id。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它承认了「关联靠共享 id 完成」这个前提</strong>，并且把生成 id 的权力交给唯一清楚上下文的人——调用方。只要调用方不传重，关联就是对的。
    </p>

    <h2>重复标识指向错位</h2>
    <ul>
      <li>调用方很容易忘了传 id，或顺手复制粘贴出两个一样的值：此时第二个标签会指向第一个输入框，正是开场那一幕。</li>
      <li>想省事地在组件里用 <code>Math.random()</code> 或 <code>Date.now()</code> 生成 id：服务端和客户端各跑一次，得到的字符串不同，<strong>水合阶段直接对不上</strong>，表现为报错或页面闪烁。</li>
      <li>改用模块级自增计数器：它是一份可变全局状态，同页面渲染多个 React 根、或同一个组件被反复挂载卸载时，计数会漂移，也不再可复现。</li>
      <li>手写的拼接还得靠自己保证不重复，比如两个不同组件都想用 <code>-hint</code> 后缀，很容易再撞一次。</li>
    </ul>

    <h2>实例标识自动生成</h2>
    <p>
      先解决「自动生成唯一 id」。React 给出的钩子是 <code>useId()</code>：在每个 <code>CourseField</code> 实例里调用一次，就得到一串属于这个实例的稳定标识。<strong>注意它稳定的是「同一位置的前后两次渲染」，而不是随机</strong>——正因如此，服务端与客户端算出的值才会一致，水合才不会错位。把返回值同时接给 <code>htmlFor</code> 与 <code>id</code>，标签和输入框就绑上了。
    </p>
    <ol class="lesson-steps">
      <li>每个 <code>CourseField</code> 调用 <code>useId()</code>，拿到自己那一份稳定前缀。</li>
      <li><code>label</code> 的 <code>htmlFor</code> 与 <code>input</code> 的 <code>id</code> 指向同一个值，建立可点击的标签关系。</li>
      <li>说明文字用 <code>\${id}-hint</code> 这类后缀拼出第二个 id，交给输入框的 <code>aria-describedby</code>——由一个父 id 派生多个关联 id，是官方推荐的用法，新增字段也不会冲突。</li>
      <li>在辅助技术里验证：每个输入都能读出与它绑定的那行说明文字。</li>
    </ol>
    <p>
      再看边界。页面里若挂了多个 React 根，各自生成的 id 理论上可能重叠，此时给根容器配置 <code>identifierPrefix</code> 就能错开。另外要记住 <code>useId</code> 的返回值<strong>只保证稳定与唯一，不保证可读</strong>，不要试图解析它内部的格式（比如当成有意义的编号去用）。
    </p>
    <div class="lesson-box warn">
      <strong>最容易混的一处：</strong><code>useId</code> 不是列表 <code>key</code> 的来源。列表 key 表达的是「这一项在业务上是谁」，必须来自数据库 id、业务编码这类真实身份；而 <code>useId</code> 表达的是「这是当前组件树里哪个实例」，只服务于可访问性关联。两者目的不同，不能互换。
    </div>

    <h2>字段增删关联稳定</h2>
    <figure class="lesson-figure">
      <figcaption>先点「增加讲师字段」，看新增的字段各自带着自己的标签、输入框与说明且互不串台；再点「移除讲师字段」，验证第一份字段的关联始终没被打乱。</figcaption>
      <R16AccessibleId />
    </figure>

    <h2>组件内生成关联标识</h2>
    <p>
      <code>useId</code> 把「生成一个稳定、唯一的关联 id」这件事从人手上收回到组件内部：它既不像手写 id 那样容易撞车，也不像随机数那样在水合时翻脸。记住它的定位——<strong>专为 label/input 绑定与 <code>aria-describedby</code> 这类可访问性关联而生，而不是列表的身份标识</strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「水合（Hydration）」</span>指客户端拿服务端渲染好的 HTML，在其上挂载 React 事件与状态、把它「接管」为可交互页面的过程。水合要求两端首屏输出一致，因此任何随机或依赖运行环境的 id（如用 <code>Math.random()</code> 生成的关联 id）都会造成不匹配；<code>useId</code> 正是为生成「两端一致」的 id 而设计。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
