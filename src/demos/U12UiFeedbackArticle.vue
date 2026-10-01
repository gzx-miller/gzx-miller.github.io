<script setup lang="ts">
import U12UiFeedback from './U12UiFeedback.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>提交订单的流程里，你写了 <code>uni.showLoading({ title: '提交中' })</code>，请求回来后再 <code>uni.showToast({ title: '提交成功' })</code>。真机上用户只看到转圈转了一秒多才消失，那个「提交成功」根本没露面——两句提示明明都调了，为什么第二句像没执行？
    </div>

    <h2>提出问题</h2>
    <p>
      三端各有各的原生弹窗：小程序有 <code>wx.showToast</code> 那套，App 有自己的原生提示，H5 又是浏览器里的 div。如果每个页面都自己写一个 <code>&lt;div class="dialog"&gt;</code>，你会立刻遇到遮罩层级互相压、点击穿透、被软键盘顶飞、安全区不适配这一串问题。uni-app 的做法是提供一套统一的反馈 API，把它们分别映射到各端的原生控件。
    </p>
    <p>
      但麻烦不在「有没有 API」，而在<strong>这些反馈会抢占同一块屏幕区域</strong>。旧办法把每个提示当成孤立的一行代码，谁需要谁就调一下，于是成本同样藏在三处。第一，<strong>不知道谁盖得住谁</strong>：转圈是个铺满全屏的遮罩，它一在场，后面的 toast 就被压在底下。第二，<strong>不知道什么时候该收</strong>：toast 会自己消失，loading 不会，忘了收就一直挡。第三，<strong>三端的表现并不一致</strong>：有的端转圈是原生控件，有的端震动干脆没反应。
    </p>
    <p>
      问题于是落到一句：<strong>这几类反馈，各自该在什么时机用，同时出现在屏幕上时又该按什么规则排先后？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的用法：哪里需要提示，就在哪里 <code>uni.showToast({ title: '报名成功' })</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它用一行代码换来了一个跨端一致、无需自己维护层级、还会自动消失的提示</strong>。对「结果已经发生，告诉用户一声」这种单向通知，它完全够用——不用写遮罩、不用写定时器、不用担心三端样式跑偏。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>耗时操作里转圈和 toast 挨着写，toast 被 loading 的全屏遮罩压在下面，直到 loading 自己超时才露出来，用户以为提示没出现。</li>
      <li><code>showLoading</code> 之后忘了 <code>hideLoading</code>，转圈一直挂着，界面谁也点不动，用户只能杀进程重开。</li>
      <li>确认框的 <code>success</code> 回调里没读 <code>res.confirm</code>，用户点了「取消」，删除照样执行了。</li>
      <li><code>showActionSheet</code> 传了 8 个选项，平台自动转成列表或截断，用户找不到自己想点的那一项。</li>
      <li><code>showToast</code> 的 <code>title</code> 写了一大段话，真机上被截成几个字，关键信息丢了一半。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻这几个 API，而是先给它们<strong>分时机</strong>。这四类是两种截然不同的东西，按「要不要等用户回话」一刀切开：
    </p>
    <ol class="lesson-steps">
      <li><code>showToast</code> 是<strong>单向通知</strong>——结果已经发生，轻量、自动消失、不阻断，如「报名成功」。</li>
      <li><code>showLoading</code> 是<strong>单向进行中</strong>——正在处理、请稍等，阻断式遮罩，必须手动收，如「提交中…」。</li>
      <li><code>showModal</code> 是<strong>双向询问</strong>——动作有风险、请你决定，需要用户点确认或取消，如「删除后不可恢复」。</li>
      <li><code>showActionSheet</code> 是<strong>双向选择</strong>——有多个下一步、请你挑一个，如「分享 / 复制链接 / 举报」。</li>
    </ol>
    <p>
      分完类，互斥规则就自然浮现了。既然 loading 是一块铺满全屏的遮罩，它和 toast 就是抢屏幕的：<strong>只要有 loading 在场，任何 toast 都会被挡住</strong>。所以耗时流程的顺序被固定死了——先 <code>showLoading</code>，<code>await</code> 请求，回到之后再<strong>先 <code>hideLoading</code>、再 <code>showToast</code></strong>。这就是「先 hide 再 toast」：不是风格问题，是遮罩的层级决定了顺序反过来 toast 就会消失。
    </p>
    <p>
      接着补 modal 的回调。它的 <code>success</code> 里拿到的是 <code>res</code>，你<strong>必须看 <code>res.confirm</code> 是不是 <code>true</code></strong>：为真才执行删除，为假（取消）就什么都不做。同时记住 <code>showModal</code> 能让 <code>title</code> 和 <code>content</code> 同屏两行——第一行短标题、第二行把后果讲清楚，别只丢一句「确定吗」。
    </p>
    <p>
      再补多选项。actionSheet 通过 <code>success</code> 里的 <code>tapIndex</code>（从 0 开始）区分你点了第几项，末尾通常还要留一个「取消」。它<strong>最多 6 项</strong>，超出会被平台改成列表形式或截断，所以选项要压到 6 个以内，再多就该改成跳转到一个选择页。
    </p>
    <p>
      最后补一层「视觉之外」的反馈。除了弹提示，还能用 <code>uni.vibrateShort</code> / <code>uni.vibrateLong</code> 触发震动，用 <code>uni.createInnerAudioContext()</code> 播放提示音，给操作加一点触觉和听觉的确认。但这里三端差异最明显：<strong>H5 端的震动大多依赖浏览器能力、还可能要求先有用户手势，App 与各小程序平台的震动强度、支持与否也各不相同；提示音要处理播放失败与自动播放限制</strong>。所以震动和音效只能是锦上添花——核心反馈永远是屏幕上看得见的 toast / loading / modal，不能把「震一下、响一声」当作唯一的成功信号。
    </p>
    <div class="lesson-box warn">
      <strong>一个常见的自伤：</strong>把 <code>showLoading</code> 当成页面的全局开关，多个请求同时在跑时，先回来的那个调了 <code>hideLoading</code>，把还没结束的请求的转圈也一起关掉了。要么用一个计数记录进行中的请求数、归零才收，要么干脆不用全屏 loading 遮罩，改用行内骨架屏。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>依次点四个按钮：「轻提示」看它自动出现又自动消失；「提交订单」会先转圈、结束后<strong>先收转圈再弹成功</strong>；「删除确认」先问你再动手；「更多操作」从底部选一项。留意每一种的阻断感差别。</figcaption>
      <U12UiFeedback />
    </figure>

    <h2>总结</h2>
    <p>
      交互反馈的关键不是会用哪个 API，而是<strong>分清「通知」还是「询问」，再处理它们的先后</strong>：toast 与 loading 是单向通知、modal 与 actionSheet 是双向询问；loading 会挡住 toast，所以耗时流程必须「先 hideLoading 再 showToast」；modal 一定要判 <code>res.confirm</code>。震动和音效可以加分，但它们在三端的能力参差，不能当作主要反馈。
    </p>
    <div class="lesson-term">
      <span class="term-name">「阻断式反馈」</span>指会占用整屏遮罩、在用户响应或手动收尾前阻止其它交互的反馈，典型是 <code>showLoading</code>（必须手动 <code>hideLoading</code>）与 <code>showModal</code>（要读 <code>res.confirm</code>）；与之相对的是 <code>showToast</code> 这类非阻断、自动消失的轻提示。边界：阻断式反馈与轻提示互斥，loading 在场时 toast 会被遮住，故耗时流程必须「先 hideLoading 再 showToast」；<code>showToast</code> 的 <code>title</code> 有长度限制、<code>showActionSheet</code> 最多 6 项。
    </div>
  </LessonArticle>
</template>
