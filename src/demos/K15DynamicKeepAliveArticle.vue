<script setup lang="ts">
import K15DynamicKeepAlive from './K15DynamicKeepAlive.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>学习工作台里，我在「笔记」面板写了一半，切到「练习」再切回来——输入框全空了。同一块区域，数据为什么没跟着回来？
    </div>

    <h2>同区面板切换</h2>
    <p>
      你做一个学习工作台：右侧是同<strong>一块区域</strong>，点「笔记」显示笔记面板，点「练习」显示练习面板。笔记面板里有一个文本输入，用户一边看课一边记；练习面板里则是几道题。用户很自然的期望是：<strong>切走再切回来，刚才写的东西还在</strong>。
    </p>
    <p>
      这里其实藏着两个独立的问题，容易被人混为一谈。第一个是「渲染哪一个」——同一位置，此刻该显示笔记还是练习？第二个是「记住哪一个」——切走之后，那个面板里用户填了一半的状态要不要留。前者是选择问题，后者是生命周期问题，如果一开始就把它们揉在一起想，代码必然会乱。
    </p>

    <h2>条件分支渲染</h2>
    <p>
      最省事的做法：在模板里写一串条件分支，用 <code>v-if</code> / <code>v-else-if</code> 判断当前是哪个标签，分别渲染笔记组件和练习组件。
    </p>
    <p>
      这个方案做对了一件基本的事：<strong>它准确表达了「同一位置只显示一个面板」</strong>。位置固定，内容互斥，逻辑直白，两三个面板时一眼就能看懂。如果没有切换状态的保留需求，它其实已经够用。
    </p>

    <h2>销毁重建清空</h2>
    <ul>
      <li><code>v-if</code> 为假时组件被<strong>销毁</strong>，内部状态随之清空；切回来是全新实例，输入内容、滚动位置、请求结果统统丢失。</li>
      <li>面板一多，模板里就是一长串 <code>v-else-if</code>，加一个面板要改一处分支，维护愈发笨重。</li>
      <li>想按数据动态决定渲染谁（比如配置化的工作台）做不到，分支是写死在模板里的。</li>
      <li>如果把「保留状态」硬塞进组件内部用 <code>ref</code> 记，就得在每个面板里重复一套「离开前存、进入后取」的样板代码。</li>
    </ul>

    <h2>动态组件选型</h2>
    <p>
      先把「渲染哪一个」这件事交给数据。<strong>动态组件</strong>用一个 &lt;component&gt; 标签的 <code>is</code> 属性决定当前渲染谁：把 <code>currentTab</code> 这个响应式变量做成「标签名到组件」的映射，<code>is</code> 指向映射里的值，切换标签时只改数据，模板里再也不用铺条件分支。组件本身成了数据，面板可以按配置增删，模板纹丝不动。
    </p>
    <p>
      但换成动态组件，前面那个「切走就销毁」的问题原样还在——因为<strong>动态组件只负责选择，不负责记忆</strong>。所以要再加一层：用 <code>KeepAlive</code> 把动态组件包住。被包住的组件在离开时不会被销毁，而是<strong>被缓存下来</strong>；再次切回时直接复用同一个实例，内部状态原封不动。至此两个问题各归其位：动态组件管「渲染哪一个」，<code>KeepAlive</code> 管「记住上一个」，职责分明。
    </p>
    <table>
      <thead>
        <tr><th>角色</th><th>解决的问题</th><th>关心的东西</th></tr>
      </thead>
      <tbody>
        <tr><td>动态组件（<code>is</code>）</td><td>渲染哪一个</td><td>当前选中的组件是哪个</td></tr>
        <tr><td><code>KeepAlive</code></td><td>记住上一个</td><td>离开的实例缓不缓存</td></tr>
      </tbody>
    </table>
    <p>
      缓存本身也需要护栏，否则就成了内存泄漏的温床。三条边界要记住：其一，<code>KeepAlive</code> 支持 <code>include</code> / <code>exclude</code>，<strong>按组件名控制哪些进缓存</strong>，想缓存的留下、不想缓存的路过；其二，用 <code>max</code> 限制最大缓存实例数，超出后按 LRU 思路淘汰最久未用的那个，<strong>避免缓存无限增长</strong>；其三，永远不要把所有动态组件都无脑缓存——缓存越多内存占用越高，该重建的面板就该让它重建。
    </p>
    <div class="lesson-box hint">
      <strong>需要感知缓存状态时，</strong>被 <code>KeepAlive</code> 缓存的组件可以定义 <code>activated</code> 与 <code>deactivated</code> 两个钩子：前者在每次进入（含从缓存恢复）时触发，后者在离开被缓存时触发。用它来做「切回来时刷新一下时间戳」这类动作，比在 <code>mounted</code> 里做更准确——因为从缓存恢复并不会再走一次 <code>mounted</code>。
    </div>
    <p>
      动态组件加缓存这套组合，最典型的落点就是<strong>工作台、标签页、配置化局部区域</strong>这几种场景：一块位置要按状态切换内容，且切换回来的体验要连续。识别出「同一位置、多种内容、要保留状态」这三个特征，就等于认出了它。
    </p>

    <h2>实例缓存观察</h2>
    <figure class="lesson-figure">
      <figcaption>点「笔记」和「练习」来回切换，观察面板实例被 <code>KeepAlive</code> 缓存而非重建。</figcaption>
      <K15DynamicKeepAlive />
    </figure>

    <h2>渲染缓存分工</h2>
    <p>
      这块区域的两个需求是分开的：用动态组件让 <code>is</code> 决定「渲染哪一个」，用 <code>KeepAlive</code> 决定「记住上一个」。前者把选择交给数据，后者把生命周期接管过来。再用 <code>include</code> / <code>exclude</code> 和 <code>max</code> 给缓存设边界，用 <code>activated</code> / <code>deactivated</code> 感知进出缓存——切换才不会丢状态，也不会悄悄吃光内存。
    </p>
    <div class="lesson-term">
      <span class="term-name">「动态组件与缓存」</span>中，动态组件用 &lt;component&gt; 的 <code>is</code> 属性决定当前渲染哪个组件，只负责「渲染哪一个」；<code>KeepAlive</code> 缓存离开的组件实例，负责「记住上一个」，再次切回时保留内部状态。用 <code>include</code> / <code>exclude</code> 控制缓存范围，<code>max</code> 限制最大缓存数，并用 <code>activated</code> / <code>deactivated</code> 感知进入与离开缓存。
    </div>
  </LessonArticle>
</template>
