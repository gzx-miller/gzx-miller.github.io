<script setup lang="ts">
import TW14Forms from './TW14Forms.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>报名表单的邮箱填错了，我用红边框标出错误，视觉上挺清楚；可读屏软件的用户听到的，却只是「编辑框，空」——他根本不知道哪里错了。
    </div>

    <h2>表单可用三要素</h2>
    <p>
      你在做一个课程报名表单，最典型的字段是邮箱：输入框、一行提示「用于接收课程通知」、提交按钮。你需要它同时满足三件事：输入时要有一致的<strong>视觉状态</strong>（焦点在哪、内容是否合法、按钮是否可点）；键盘用户要能<strong>顺畅操作</strong>并看清焦点；辅助技术（读屏软件）要能<strong>正确理解</strong>这个控件叫什么、错在哪。
    </p>
    <p>
      这里有个容易走偏的起点：很多人把表单当成「一堆可以加样式的输入框」。但输入框不是普通的 <code>&lt;div&gt;</code>，它承载着语义——它是什么字段、当前是否合法、帮助和错误信息是什么。工具类能改外观，却改不了这些语义。一旦顺序搞反，先用工具类把外观做漂亮、语义最后补，往往会漏得七零八落。
    </p>

    <h2>占位符充当标签</h2>
    <p>
      最省事的做法，是直接用 <code>placeholder</code> 当提示，用颜色表达状态：正常时灰边框，出错时 <code>border-red-500</code>。这个方案确实做对了一件事：<strong>它让用户第一时间看到了「视觉反馈」</strong>，邮箱格式不对时输入框变红，交互上是即时的。
    </p>
    <p>
      问题在于，它把「语义」压缩成了「颜色」。placeholder 会在用户一输入时消失，颜色对色觉障碍用户不可靠，而读屏软件更是完全读不到「这个框是邮箱、现在填错了」。视觉对了，语义全丢。
    </p>

    <h2>仅靠颜色表达</h2>
    <ul>
      <li><code>placeholder</code> 只在空值时可见，一旦开始输入就消失，无法承担「字段名称」的职责。</li>
      <li>错误只用颜色表达，色觉障碍用户无法分辨，读屏软件也读不出来。</li>
      <li>校验失败只有红框，没有文本错误信息，用户不知道该改成什么样。</li>
      <li>受控组件里 <code>invalid</code> 伪类常常不生效，因为浏览器认为「值合法与否」这件事被 Vue 接管了。</li>
      <li>焦点、禁用、只读等状态样式各写各的，交互体验不一致。</li>
    </ul>

    <h2>原生语义优先</h2>
    <p>
      不推翻「要有视觉反馈」，而是把顺序摆正：<strong>先用原生控件与标签把语义做对，再谈样式统一。</strong>Tailwind 的表单变体可以响应 <code>focus</code>、<code>invalid</code>、<code>disabled</code>、<code>readonly</code> 以及 <code>aria-*</code>、<code>data-*</code> 属性，但请记住：<strong>工具类只负责外观，可访问名称（label）、描述与错误状态仍必须由语义 HTML 提供。二者缺一不可。</strong>
    </p>
    <p>
      第一步是<strong>语义</strong>。给每个输入框配一个真正的 <code>&lt;label&gt;</code>，并用 <code>for</code> 属性关联到控件的 <code>id</code>；HTML5 提供了 <code>type="email"</code>、<code>type="tel"</code> 等输入类型，它们不仅帮助移动端弹出合适的键盘，也让辅助技术知道字段的用途。这两件事都不该被 placeholder 取代——<strong>placeholder 不能代替 label</strong>，它顶多是示例文本。
    </p>
    <p>
      第二步是<strong>把帮助与错误信息关联起来</strong>。给提示文字一个 <code>id</code>，在输入框上用 <code>aria-describedby</code> 指向它，这样读屏软件在读控件时，会顺带把这段描述读出来。错误信息也走同一套机制：出错时把它写进被引用的节点里，让提示从「用于接收课程通知」变成「请输入有效邮箱」。
    </p>
    <p>
      第三步是<strong>状态样式</strong>。焦点用 <code>focus-visible:ring-2</code> 提供清晰焦点环；无效状态用 <code>invalid:border-red-500</code>；禁用与只读分别在 <code>disabled:</code> / <code>readonly:</code> 下调整透明度与光标（如 <code>disabled:cursor-not-allowed</code>）。这些变体让不同状态的视觉反馈走同一套写法，看起来才一致。
    </p>
    <div class="lesson-box warn">
      <strong>两个关键区别：</strong>其一，<strong>错误不能只用颜色表达</strong>——校验失败除了红框，<strong>必须给出文本错误信息，并保证它能被辅助技术读取</strong>（即通过 <code>aria-describedby</code> 关联）。其二，<code>invalid</code> 与 <code>aria-invalid</code> 不是一回事：<code>:invalid</code> 伪类由浏览器根据约束自动判定，而在受控组件里，值的合法性往往由你的 JS 判断，浏览器并不知情，因此<strong>需要你主动把 <code>aria-invalid</code> 同步上去</strong>，让视觉与语义都反映真实状态。
    </div>
    <p>
      最后一步是验证。用读屏器实际抽查一遍表单：Tab 到输入框，确认它读出了字段名称；填一个错误值失焦，确认它读出了错误文本。这个动作能把「我以为对」和「真的对」区分开。
    </p>

    <h2>失焦校验反馈</h2>
    <figure class="lesson-figure">
      <figcaption>在报名邮箱框里输入值再失焦，观察无效状态如何同时改变边框与错误文本。</figcaption>
      <TW14Forms />
    </figure>

    <h2>视觉键盘与辅助技术</h2>
    <p>
      表单的难点从来不在样式，而在「视觉状态、键盘体验、辅助技术语义」三者齐备。先用 <code>label</code>、输入类型、<code>aria-describedby</code> 把语义做对，再用 <code>focus-visible</code>、<code>invalid</code>、<code>disabled</code> 等变体统一外观，并记住两个坑：placeholder 不是标签、错误不能只靠颜色、受控组件要主动维护 <code>aria-invalid</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「表单可访问性」</span>指视觉状态、键盘体验与辅助技术语义三者共同到位。约定：<code>placeholder</code> 不能代替 <code>label</code>，并用 <code>aria-describedby</code> 关联帮助与错误信息；错误除颜色外必须有能被读屏读取的文本；<code>invalid</code> 伪类与 <code>aria-invalid</code> 不是一回事，受控组件需主动同步后者；焦点、无效、禁用、只读各用对应的状态变体统一表达。
    </div>
  </LessonArticle>
</template>
