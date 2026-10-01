<script setup lang="ts">
import K23ErrorHandling from './K23ErrorHandling.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>某个子组件因为接口返回的数据格式不对，在渲染时抛了错，结果整个页面直接白屏——能不能让错误只影响那一小块区域，并且还能被统一上报？
    </div>

    <h2>组件抛错白屏</h2>
    <p>
      你在做一个数据看板：页面上有图表、有列表、有统计卡片。某天接口抽风，返回了预期之外的结构，其中一个子组件在渲染时抛出了异常。你原本以为「最多就是那一块显示不出来」，结果整页变成空白——一个局部的问题，却让用户什么都看不到。
    </p>
    <p>
      更麻烦的是，这个错误只在控制台一闪而过，没有任何上报。你要解决的是两个问题：<strong>怎么把错误的影响范围限制在一小块区域内</strong>，以及<strong>怎么给错误一个统一的收集入口</strong>。
    </p>

    <h2>同步捕获与降级</h2>
    <p>
      最自然的反应是用 <code>try / catch</code> 把可疑的代码包起来，接住异常后展示一段降级提示。
    </p>
    <p>
      这个做法做对了一件事：<strong>它承认了「出错是常态而不是意外」</strong>，并且愿意为出错准备一条退路，而不是放任它把页面带崩。对于自己显式调用、能定位到具体语句的同步代码，<code>try / catch</code> 确实够用。
    </p>
    <p>
      更现实的是，就算你每处都补上 <code>try / catch</code>，只要还有一处漏网，整棵组件树的渲染就会被中断。靠人手动去堵每一个窟窿，注定会漏——而且事后根本不知道该从哪查起。
    </p>

    <h2>框架调用难以捕获</h2>
    <ul>
      <li>模板渲染、生命周期钩子里抛出的错误<strong>不是由你的 <code>try / catch</code> 调用的</strong>，而是由 Vue 框架调用，包不住。</li>
      <li>一处未捕获的错误会让组件树的渲染中断，结果是整页白屏，影响范围被无限放大。</li>
      <li>错误散落在控制台，没有统一的上报入口，线上出了问题也难以定位。</li>
      <li>错误发生后没有恢复手段，用户只能刷新页面重来。</li>
    </ul>

    <h2>错误边界声明</h2>
    <p>
      不推翻「接住错误」，而是换一个更懂 Vue 的接法：用 <code>onErrorCaptured</code> 在组件里声明一个错误边界。它会在<strong>当前组件捕获后代组件抛出的错误</strong>，参数里带着错误对象、出错实例和信息类型；在这里把错误写进日志、把降级状态打开，出问题的那一小块就变成「此处暂不可用」，页面其余部分照常运行。
    </p>
    <p>
      捕获之后还有一步选择：回调<strong>返回 <code>false</code> 会阻止错误继续向上冒泡</strong>，让这个边界自己消化；而返回 <code>true</code> 或不返回，则让它继续向上传播，最终落到全局兜底那里。紧接着，在应用入口注册一个全局处理器 <code>app.config.errorHandler</code>，它会捕获所有<strong>未被 errorCaptured 拦截</strong>的错误——这里正是接监控服务、统一上报的最佳位置。
    </p>
    <ol class="lesson-steps">
      <li>后代组件在渲染或生命周期中抛出错误。</li>
      <li><code>onErrorCaptured</code> 捕获错误，展示降级 UI 并记录日志。</li>
      <li>返回 <code>false</code> 阻止冒泡到全局；不返回则继续传播。</li>
      <li>全局 <code>errorHandler</code> 作为最终兜底，处理所有漏网的错误并上报监控。</li>
    </ol>
    <p>
      值得单独强调「降级」这件事：捕获到错误之后，展示什么往往比捕获本身更重要。一个只写着「出错了」的空白区域，和一句「这块数据暂时加载失败，可点击重试」的提示，给用户的感受完全不同。错误边界的意义不只是拦住崩溃，更是让页面在部分失效时<strong>仍然可用、仍然可理解</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>其一，<code>errorCaptured</code> <strong>只能捕获后代组件的错误，捕获不到自身抛出的错误</strong>，边界要包在目标之上；其二，它管的是 Vue 调用流程里的错误，<strong>异步错误（<code>setTimeout</code>、<code>Promise</code>）不会被它接住</strong>，那类错误要用 <code>window.onerror</code> 或 <code>window.addEventListener</code> 来兜。
    </div>

    <h2>局部降级与上报</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮让子组件抛错，看错误边界如何只降级那一块区域并写入日志。</figcaption>
      <K23ErrorHandling />
    </figure>

    <h2>影响范围与上报分级</h2>
    <p>
      错误处理的关键，是把「一个错误的影响范围」收窄到它该在的地方。<code>onErrorCaptured</code> 负责在局部接住后代错误、给出降级 UI，并用返回值决定是否继续上抛；<code>app.config.errorHandler</code> 负责全局兜底与上报。两者一前一后，页面才不会因为一处异常就整片白掉。
    </p>
    <div class="lesson-term">
      <span class="term-name">「错误边界」</span>指通过 <code>onErrorCaptured</code> 划分的错误捕获范围：它能捕获<strong>后代组件</strong>抛出的错误并展示降级 UI，返回 <code>false</code> 阻止冒泡，返回 <code>true</code> 或不返回则继续传播给 <code>app.config.errorHandler</code> 全局兜底。注意它捕获不到自身错误，也接不住 <code>Promise</code>、<code>setTimeout</code> 等异步错误，后者需借助 <code>window.onerror</code> 等浏览器机制。
    </div>
  </LessonArticle>
</template>
