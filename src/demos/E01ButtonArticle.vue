<script setup lang="ts">
import E01Button from './E01Button.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>后台列表里「保存」和「删除」长得几乎一模一样，用户手一滑就把数据删了——按钮除了文字，到底还能靠什么告诉人「这个很危险」？
    </div>

    <h2>操作重要性的外显</h2>
    <p>
      你在做一个课程管理后台。一行里有「详情」「报名」「删除」，页面底部又有「保存」「取消」「重置」。这些按钮功能完全不同、重要程度也不同：保存是主操作、删除是危险操作、重置是次要操作。可如果它们全都长成同一个灰底矩形，用户在快速点击时只能靠读文字来分辨，而误操作的代价却由数据来承担。
    </p>
    <p>
      这才是按钮真正要解决的问题：<strong>把「这个操作有多重要、多危险」翻译成一眼能认出的视觉信号</strong>。不用组件库的话，这个翻译得由你亲手完成——每一种语义色、每一档尺寸、加载态、禁用态、悬浮与聚焦态，都要自己写样式，还要让全站几十个按钮保持同一套语言。一旦手写样式各写各的，视觉层级立刻乱掉。
    </p>

    <h2>原生按钮加类名</h2>
    <p>
      最省事的做法是直接用原生按钮，再挂一个类名：<code>&lt;button class="btn btn-primary"&gt;保存&lt;/button&gt;</code>。这个方案做对了一件根本的事——<strong>它用语义正确的原生元素承载操作</strong>，天生可点击、可聚焦、能被键盘回车触发，这是任何封装都不该丢掉的底线。
    </p>
    <p>
      只要再补几个类，外观也能凑出来。当页面只有两三个按钮时，这套写法完全够用。
    </p>

    <h2>多套样式的维护成本</h2>
    <ul>
      <li>每加一种语义色就要新增一套样式，不同人写的色值、圆角、内边距很难对齐，主次层级逐渐失控。</li>
      <li>加载态要手动加转圈动画、手动置灰、手动阻止再次点击，漏掉一步用户就能提交两次。</li>
      <li>纯图标按钮没有文字，屏幕阅读器读不出含义，无障碍全靠自觉。</li>
      <li>多个相邻按钮各自带边框，紧挨着排会叠出一条双线。</li>
    </ul>

    <h2>语义与外观分离</h2>
    <p>
      不推翻原生按钮，而是把「语义」和「外观」拆开：你只声明这个按钮扮演什么角色，具体长什么样交给组件库统一渲染。这就是 <code>el-button</code>，它用 <code>type</code> 表达五种语义。
    </p>
    <table>
      <thead>
        <tr><th>type</th><th>语义</th><th>典型场景</th></tr>
      </thead>
      <tbody>
        <tr><td>primary</td><td>主操作</td><td>提交、保存</td></tr>
        <tr><td>success</td><td>正向结果</td><td>确认通过、启用</td></tr>
        <tr><td>warning</td><td>需要留意</td><td>消耗积分的操作</td></tr>
        <tr><td>danger</td><td>危险不可逆</td><td>删除、清空</td></tr>
        <tr><td>info</td><td>中性信息</td><td>次要入口</td></tr>
      </tbody>
    </table>
    <p>
      选 <code>type</code> 的依据是<strong>操作语义，而不是好不好看</strong>：删除类操作一律 <code>danger</code>，主操作才用 <code>primary</code>。想让按钮更轻，用 <code>plain</code> 生成描边朴素样式；想要圆角用 <code>round</code>；只放一个图标用 <code>circle</code>；尺寸则由 <code>size</code> 提供 <code>large</code>、默认、<code>small</code> 三档。
    </p>
    <p>
      接着补上两个状态。用 <code>:loading</code> 绑定一个布尔值，按钮进入加载态并显示转圈图标，最好同时给出「加载中…」这类文字提示；用 <code>:icon</code> 把图标组件直接挂到按钮上。当几个按钮需要成组排布时，把它们放进 <code>el-button-group</code>，由它负责合并相邻边框，避免叠线。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>加载态不只是转圈，<strong>必须同时阻止重复点击</strong>，否则用户在请求返回前连点，就会重复提交；纯图标按钮（<code>circle</code>）完全依赖图形传达含义，务必补上 <code>aria-label</code> 说明，否则读屏用户听到的只是一个空按钮。
    </div>
    <p>
      最后是层级纪律：同一个操作区里，<code>primary</code> 和 <code>danger</code> 各限一个主角，其余按钮降级为默认或 <code>plain</code>。整页都是 <code>primary</code>，等于没有主次。
    </p>

    <h2>不同状态的视觉层级</h2>
    <figure class="lesson-figure">
      <figcaption>点一点不同语义、尺寸与加载态的按钮，体会视觉层级是怎么被建立起来的。</figcaption>
      <E01Button />
    </figure>

    <h2>组件库的语义约定</h2>
    <p>
      按钮的难点从来不是「怎么画一个矩形」，而是把操作的重要与危险稳定地翻译成视觉语言。<code>type</code> 管语义，<code>plain</code>、<code>round</code>、<code>circle</code> 管形态，<code>size</code> 管层级，<code>:loading</code> 与 <code>:icon</code> 管状态——把语义交给组件声明，把一致性交给组件库，用户才不会点错。
    </p>
    <div class="lesson-term">
      <span class="term-name">「语义化按钮」</span>指用 <code>type</code> 表达操作角色而非外观：<code>primary</code> 主操作、<code>danger</code> 危险操作，<code>success</code>、<code>warning</code>、<code>info</code> 分别对应正向、提示与中性。加载态用 <code>:loading</code> 进入并<strong>同时阻断重复点击</strong>；纯图标按钮必须配 <code>aria-label</code>；成组按钮交给 <code>el-button-group</code> 合并边框。
    </div>
  </LessonArticle>
</template>
