<script setup lang="ts">
import TW19Interactivity from './TW19Interactivity.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>后台活动列表里，我想让鼠标移到某一行时行内「立即报名」按钮才浮现，于是给按钮本身加了 <code>hover:opacity-100</code>——结果按钮一直不出现，因为鼠标根本没悬在它上面。
    </div>

    <h2>整行悬停的按钮</h2>
    <p>
      你在做一个后台活动列表：每行有活动名、时间、剩余名额和一个「立即报名」按钮。产品希望界面干净——按钮平时隐藏，鼠标移到整行上才出现，指向性更明确。同时你还在同一个页面里做了另外两件事：卡片悬停时标题变橙、复选框勾选后旁边的文字变成强调色。
    </p>
    <p>
      这三件事的视觉需求都很普通，但它们触发的源头并不相同：标题变色的源头是<strong>父级卡片</strong>被悬停，文字变色的源头是<strong>同级的复选框</strong>被勾选，而按钮浮现的源头又是一整行。你发现自己写的 <code>hover:</code> 要么挂错了元素，要么干脆对不上——因为 <code>hover:</code> 只描述「这个元素自己被悬停」，它管不了别人。
    </p>

    <h2>逐元素状态样式</h2>
    <p>
      最直接的做法，是给每个需要变的东西各写一份状态样式：按钮写 <code>hover:bg-orange-600</code>，标题写 <code>hover:text-orange-600</code>，文字写 <code>hover:text-orange-700</code>。单个元素自己响应鼠标，这套写法完全正确，而且最直观。
    </p>
    <p>
      它做对的是<strong>把状态和元素绑在一起</strong>：谁的样式变，就把状态前缀写在谁身上。当交互局限在元素自身时，这是最短的路径，不需要任何额外约定。问题一旦跨到「一个元素的状态影响另一个元素」，这份写法立刻失效，因为你需要的是描述元素之间的<strong>关系</strong>。
    </p>

    <h2>元素关系的盲区</h2>
    <ul>
      <li><code>hover:</code> 只作用于元素自身，父级悬停没法让子元素变色，兄弟勾选也没法让文字变色。</li>
      <li>全靠鼠标：键盘用户用 Tab 走到按钮上时，永远看不到「浮现」的按钮，功能等于对他关上了门。</li>
      <li>只写 <code>hover:</code> 会让鼠标点击输入框也弹出焦点圈，<code>focus:</code> 与 <code>focus-visible:</code> 的差别没有区分开。</li>
      <li>禁用、选中、校验失败这些状态没有统一入口，容易漏写，禁用按钮上仍残留悬停高亮。</li>
      <li>列表的斑马纹、首尾圆角、空态这些「结构性」样式无处安放，只能另写裸 CSS。</li>
    </ul>
    <p>
      归根到底，状态样式写重复只是表层问题，核心是<strong>缺少描述元素间状态关系的机制</strong>：如何表达「当祖先处于某状态，影响这个后代」和「当前面的兄弟处于某状态，影响后面的兄弟」。
    </p>

    <h2>状态变体的补全</h2>
    <p>
      先把「自身状态」这一类补全。变体的本质，是把 <code>hover</code>、<code>focus</code>、<code>active</code>、<code>disabled</code>、<code>checked</code> 这些伪类编码成前缀，编译时展开成对应的选择器。补齐时有一条底线：<strong>键盘可达优先</strong>，焦点圈用 <code>focus-visible</code> 而不是 <code>focus</code>，这样键盘用户看得见、鼠标用户不被打扰。
    </p>
    <p>
      再引入描述关系的两个角色。<strong>group 读取祖先的状态向下传递</strong>：给卡片或表格行加上 <code>group</code>，后代用 <code>group-hover:text-orange-600</code>、<code>group-hover:opacity-100</code>，就能让整行悬停带动行内元素。规则能否命中完全取决于 DOM 结构——<strong>目标元素必须是标记了 group 的那个祖先的后代</strong>，否则选择器选不中。
    </p>
    <p>
      <strong>peer 让前置兄弟的状态影响后续兄弟</strong>。复选框勾选后要让文字变色，就把 <code>peer</code> 加在 <code>input</code> 上，文字用 <code>peer-checked:text-orange-700</code>。这里有个必须记住的限制：<strong>peer 只能匹配它之后的同级元素</strong>，这是 CSS 后续兄弟选择器的固有约束，把文字写在复选框前面就永远不会生效。
    </p>
    <div class="lesson-box warn">
      <strong>嵌套时记得命名：</strong>同一个页面里往往有多组联动，卡片里套卡片、行里套开关都会出现，此时用 <code>group/name</code> 与 <code>peer/name</code> 给每一组起名，子元素写 <code>group-hover/name:</code> 指向自己那一组，避免大的 group 把小的 group 抢走匹配。
    </div>
    <p>
      最后补齐结构性伪类。列表间隔用 <code>odd:</code> 与 <code>even:</code> 做斑马纹，首尾元素的圆角用 <code>first:</code> 与 <code>last:</code>，空列表隐藏用 <code>empty:</code>，输入框占位符用 <code>placeholder:</code>，选中文字用 <code>selection:</code>。要留意的是：<strong>这类变体依赖 DOM 顺序</strong>，增删一个节点就可能让首尾、奇偶整体错位，改完结构要重新核对。
    </p>
    <p>
      还有两个坑必须避开。其一，<code>disabled</code> 的元素不会再触发 <code>hover</code> 等变体，禁用态需要<strong>单独写样式</strong>，而不是指望它自动继承原状态。其二，不能只依赖 <code>hover</code> 传达信息——悬浮才出现的按钮，对触屏和键盘用户都不友好，务必同时给出焦点态或让按钮常驻但弱化。
    </p>
    <ol class="lesson-steps">
      <li>先保证键盘可达：用 <code>focus-visible:</code> 提供清晰焦点环。</li>
      <li>为禁用、选中、校验等状态补齐语义反馈。</li>
      <li>确有跨元素联动时，父级加 <code>group</code>、前置兄弟加 <code>peer</code>，并控制嵌套层级。</li>
      <li>用键盘 Tab 走到每个控件，确认焦点环清晰可见且不被遮挡。</li>
    </ol>

    <h2>卡片与行联动</h2>
    <figure class="lesson-figure">
      <figcaption>依次试「状态变体」「Group 组状态」「其他伪类」三个页签，重点体会卡片与表格行的联动。</figcaption>
      <TW19Interactivity />
    </figure>

    <h2>关系写进标记</h2>
    <p>
      状态变体解决的从来不只是「少写几行 CSS」，而是把状态与元素的关系写进标记：自己变用 <code>hover:</code> / <code>focus-visible:</code>，祖先影响后代用 <code>group-*</code>，前置兄弟影响后续兄弟用 <code>peer-*</code>，结构顺序用 <code>first:</code> / <code>odd:</code>。记住 group 要目标在后代里、peer 要目标在后面，联动就不会再莫名其妙失效。
    </p>
    <div class="lesson-term">
      <span class="term-name">「group 与 peer 联动」</span><code>group</code> 标在祖先上，后代用 <code>group-hover:</code>、<code>group-focus:</code> 读取祖先状态；<code>peer</code> 标在前置兄弟上，后续兄弟用 <code>peer-checked:</code>、<code>peer-invalid:</code> 读取其状态。前者要求目标元素是祖先的后代，后者受「后续兄弟选择器」限制只影响其后的同级元素；多组并存时用 <code>group/name</code>、<code>peer/name</code> 命名区分。
    </div>
  </LessonArticle>
</template>
