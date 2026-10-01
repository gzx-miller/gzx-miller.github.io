<script setup lang="ts">
import E05Message from './E05Message.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户点了「保存」，界面一动不动，也没有任何提示——他到底是保存成功了，还是压根就没点上？
    </div>

    <h2>提出问题</h2>
    <p>
      每一次操作都需要一个回音。轻量的回音是「保存成功」「网络失败」这种一闪而过的提示；重一点的回音，是危险操作执行前让用户停一下、点一次确认。前者不打断你，后者必须打断你——<strong>两类反馈分开，用户才知道什么时候可以继续、什么时候必须做决定</strong>。
    </p>
    <p>
      不用组件库，代价在「临时的东西怎么生、怎么死」上。手写一个提示条要先动态创建元素、定位、设置停留时长、到点移除，还得处理多个提示同时出现时的排队；写一个确认框则要遮罩、要按钮、还要把「用户点了确定还是取消」这件事用回调或 Promise 传回给业务代码。这些一次性逻辑只要手写一次，就会在各个页面重复。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法是用浏览器自带的 <code>alert()</code>。这个方案做对了一件根本的事——<strong>它确实把结果告诉用户了</strong>，一行代码，无需任何样式和挂载，还天然阻断。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>alert()</code> 会打断整个页面，用户必须点掉它才能继续，语气生硬、体验粗暴。</li>
      <li>它无法区分成功、警告、错误，外观只有一种，用户读不出轻重。</li>
      <li>需要用户输入时只能用 <code>prompt()</code>，拿不到自定义按钮文案，样式也不可控。</li>
      <li>同时触发多个提示时，它们只能一个接一个排队弹出，无法堆叠成一列。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「给回音」，而是按打断强度把反馈分成两档，分别交给两个命令式 API。
    </p>
    <p>
      第一档是轻量提示 <code>ElMessage</code>：提供 <code>success</code>、<code>warning</code>、<code>error</code>、<code>info</code> 四种类型，调用后自动出现、到点自动消失，不打断用户操作。它的用法是<strong>命令式的</strong>——不需要在模板里声明标签，直接在脚本里写出调用即可。
    </p>
    <p>
      第二档是需要回应的 <code>ElMessageBox</code>：<code>confirm</code> 用于二次确认，<code>prompt</code> 用于索取一次输入。二者都返回 <strong>Promise</strong>，因此可以 <code>await</code> 它，再用 <code>try/catch</code> 分清「确认」与「取消」两条分支——<code>confirm</code> 走 <code>try</code>、取消走 <code>catch</code>；<code>prompt</code> 则把用户输入放在 resolve 值的 <code>value</code> 字段里。
    </p>
    <table>
      <thead>
        <tr><th>反馈方式</th><th>适用场景</th></tr>
      </thead>
      <tbody>
        <tr><td>ElMessage</td><td>轻量、无需用户回应的结果提示</td></tr>
        <tr><td>ElMessageBox</td><td>需要二次确认或索取输入</td></tr>
        <tr><td>ElResult</td><td>一整页的流程结束反馈</td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>两个高频事故点：</strong>取消操作会让 Promise <strong>reject</strong>，若不处理就会抛出「未捕获的拒绝」，所以 <code>await confirm</code> 或 <code>await prompt</code> <strong>务必用 <code>catch</code> 或 <code>try/catch</code> 接住</strong>；另外，危险操作的二次确认应把 <code>type</code> 设为 <code>warning</code>，并写清操作后果，而错误提示要给出<strong>具体失败原因与后续动作</strong>，别丢一句泛化的「操作失败」了事。
    </div>
    <p>
      还有一个实用开关：连续批量操作时开启 <code>grouping</code> 合并同类提示，避免消息刷屏把屏幕糊住。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点一遍四种轻量提示，再试试确认框的确定与取消，看两条 Promise 分支各走哪里。</figcaption>
      <E05Message />
    </figure>

    <h2>总结</h2>
    <p>
      反馈的核心是「分成两档」：不需要回应的用 <code>ElMessage</code>，一闪而过；需要用户做决定的用 <code>ElMessageBox</code>，以 Promise 形式把结果交还业务。两者都是命令式 API，脚本里直接调用即可——但要记住，取消会让 Promise 拒绝，稳住这条分支，才不会让一个「点了取消」变成控制台里的红色报错。
    </p>
    <div class="lesson-term">
      <span class="term-name">「命令式反馈 API」</span>指无需在模板中声明标签、直接在脚本里调用即可弹出反馈的接口。<code>ElMessage</code> 提供 <code>success</code>、<code>warning</code>、<code>error</code>、<code>info</code> 四种类型并自动消失；<code>ElMessageBox</code> 的 <code>confirm</code> 与 <code>prompt</code> 返回 Promise，可用 <code>await</code> 配合 <code>try/catch</code> 处理确认与取消，其中 <code>prompt</code> 的输入值在 resolve 的 <code>value</code> 里，<strong>取消会 reject，必须捕获</strong>。
    </div>
  </LessonArticle>
</template>
