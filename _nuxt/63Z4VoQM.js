const e=`<script setup lang="ts">
import TW03StateVariants from './TW03StateVariants.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>卡片悬停时标题会变橙色，鼠标一移上去效果很好；可换成键盘 Tab 走一遍、或者用触屏点一下，同样「选中」了卡片，却什么反馈都没有——交互状态到底该怎么写才算完整？
    </div>

    <h2>交互状态并存</h2>
    <p>
      你在做一个「小组报名」的课程卡：鼠标移上去时标题变色、出现「查看名额」的高亮；用户勾选「我已阅读报名须知」后，提交提示才亮起来；输入框聚焦时要有一圈清晰的焦点环。这些状态都发生在同一张卡片上，但触发条件各不相同。
    </p>
    <p>
      麻烦在于状态并不只属于被操作的那个元素。有时你要让「鼠标停在卡片上」去改变<strong>卡片内部标题</strong>的颜色，有时又要让「复选框被勾选」去点亮<strong>它后面的文字</strong>。前者跨的是父子，后者跨的是兄弟。
    </p>

    <h2>手写伪类选择器</h2>
    <p>
      最直接的做法是手写伪类：给标题一个类，写成 <code>.card:hover .title</code> 来变色；兄弟联动就写成 <code>input:checked + span</code>。单看每一段都能正常工作。
    </p>
    <p>
      它做对了一件重要的事：<strong>把「什么状态下该变成什么样」直接对应起来</strong>，不需要额外加一层运行时逻辑。问题出在，一旦状态种类变多，这套手写选择器就开始反过来支配你的结构。
    </p>

    <h2>选择器重复与层级</h2>
    <ul>
      <li>同一个按钮的 hover、active、disabled 各写一段，状态一多，样式文件里全是重复选择器。</li>
      <li>父子联动必须给祖先补一个类，还得手动保证选择器层级和 DOM 结构一致，改一处容易漏一处。</li>
      <li>兄弟联动依赖 <code>+</code> 或 <code>~</code> 这类选择器，对元素先后顺序极度敏感，节点一挪就失效。</li>
      <li>如果只写了 hover，键盘用户和触屏用户就拿不到任何反馈——信息被只挂在鼠标上了。</li>
    </ul>

    <h2>状态变体前缀</h2>
    <p>
      Tailwind 把状态做成<strong>前缀</strong>：<code>hover:</code>、<code>focus:</code>、<code>active:</code>、<code>disabled:</code> 这些前缀在编译时展开成对应的伪类选择器。于是「悬停变色」就是 <code>hover:bg-orange-700</code>，状态和样式写在同一个类名上，不用再分别维护选择器与声明。
    </p>
    <p>
      跨元素联动则交给两个专门的前缀。<code>group</code> 加在祖先上，后代用 <code>group-hover:</code> 读取祖先的状态——鼠标停在卡片上、卡片内标题跟着变色就靠它；<code>peer</code> 加在前置兄弟上，后续兄弟用 <code>peer-checked:</code> 读取它的状态——复选框勾选后点亮后面的文字。规则能否命中，<strong>完全取决于 DOM 结构关系</strong>，这也是它们最容易出错的地方。
    </p>
    <div class="lesson-box warn">
      <strong>两个结构性限制，必须记住：</strong><code>group</code> 要求目标元素在 DOM 上是那个祖先的<strong>后代</strong>；<code>peer</code> 只能匹配它<strong>之后</strong>的同级元素，这是 CSS 后续兄弟选择器的固有约束，把 peer 元素写在后面就永远不生效。
    </div>
    <p>
      状态里最容易被忽略的是焦点。用 <code>focus:</code> 会让鼠标点击也弹出焦点环，视觉上很吵；改用 <code>focus-visible:</code>，只在这次聚焦来自键盘时才显示，既保住键盘可达性，又不打扰鼠标用户。另外要留意：<strong>禁用元素不会触发 hover 等变体</strong>，禁用态必须单独写，不能指望它在旧状态上「停住」。
    </p>
    <p>
      最后是命名。同一个页面里出现多组联动时，默认的 <code>group</code> 会互相干扰，这时用 <code>group/name</code> 与 <code>peer/name</code> 给它们分别命名，就能各管各的。
    </p>
    <p>
      状态变体之外，还有一批<strong>结构性伪类变体</strong>同样常用：列表的间隔样式可以交给 <code>first:</code>、<code>last:</code>、<code>odd:</code>、<code>even:</code>，输入框的占位文字用 <code>placeholder:</code>，被选中的文本用 <code>selection:</code>。它们和状态变体是同一套机制，只是触发条件不同。要留意的是，结构伪类<strong>依赖 DOM 顺序</strong>，一旦增删节点，首尾与奇偶的样式就要重新核对一遍。
    </p>
    <ol class="lesson-steps">
      <li>先保证键盘可达：用 <code>focus-visible:</code> 提供清晰的焦点环。</li>
      <li>为禁用、选中、校验等状态补齐语义反馈，而不只依赖 hover。</li>
      <li>确有跨元素联动时才引入 group 或 peer，并控制嵌套层级。</li>
      <li>用键盘 Tab 走一遍页面，确认焦点环清晰可见且没有被遮挡。</li>
    </ol>

    <h2>悬停勾选与聚焦</h2>
    <figure class="lesson-figure">
      <figcaption>悬停卡片、勾选复选框、聚焦输入框，感受三种状态变体各自触发的位置。</figcaption>
      <TW03StateVariants />
    </figure>

    <h2>分组与同级联动</h2>
    <p>
      状态变体把「什么时候变」编码成前缀，让状态与样式待在一起；跨元素的联动则交给 group 与 peer，用 DOM 关系说话。动手之前先想清楚目标元素和状态元素在结构上是什么关系，比事后反复调试省力得多。
    </p>
    <div class="lesson-term">
      <span class="term-name">「状态变体」</span>是把 <code>hover:</code>、<code>focus-visible:</code>、<code>active:</code>、<code>disabled:</code> 等状态写成前缀，编译时展开为伪类选择器。跨元素联动用 <code>group</code>（祖先状态传给后代）与 <code>peer</code>（前置兄弟影响后续兄弟），命中与否由 DOM 结构决定。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
