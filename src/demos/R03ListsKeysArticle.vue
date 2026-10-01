<script setup lang="ts">
import R03ListsKeys from './R03ListsKeys.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表里每行都带一个「收藏备注」输入框。你在第二行敲了半句话，删掉第一行，结果那半句话莫名其妙跑到了新的第一行——你删的是别的行，为什么注释会跟着串门？
    </div>

    <h2>提出问题</h2>
    <p>
      你要渲染一串课程，还要在上面加一个搜索框：敲关键词，列表实时过滤。这里其实藏着两个问题。第一个是<strong>身份</strong>：列表会增、会删、会重排，当数据顺序变了，React 得知道「这一项还是原来那一项」，而不是按位置随便认亲。第二个是<strong>来源</strong>：筛选结果到底该不该单独存起来。
    </p>
    <p>
      旧办法往往有两笔隐藏成本。第一笔，用数组下标当身份——<code>map((course, index) =&gt; &lt;li key={index}&gt;...)</code>。第二笔，把过滤结果写进另一个 state，再用 <code>useEffect</code> 去和原始列表保持同步。前者在插入删除时让身份漂移，后者凭空多出一个需要维护的真相，还可能慢半拍。
    </p>
    <p>
      于是问题清楚了：<strong>列表项的身份该由什么决定，才能让它在增删重排后依然稳定；哪些值应该现算，根本不必另存？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最小的一步：给每个列表项一个 <code>key</code>，让 React 有个抓手去匹配新旧节点；同时筛选结果直接在渲染阶段算出来：<code>const visibleCourses = courses.filter(course =&gt; course.title.includes(keyword))</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>身份来自数据本身，筛选结果是渲染时顺带算出的产物</strong>。每渲染一次，就把当前关键词和当前列表重新过一遍，得到的列表天然是最新的；界面上永远只有「课程数组 + 关键词」这两份原始事实。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>用 <code>key={index}</code> 当下标：在列表头部插入一项后，后面所有项的 index 都加一，React 认为「第 0 项还是第 0 项」，于是把旧节点的状态（输入框里的文字、焦点）留在原位，出现内容错位。</li>
      <li><code>key</code> 只在同一级列表里要求唯一即可，并且它<strong>不会作为 props 传进组件</strong>——想在子组件里读 <code>props.key</code>，永远读不到。</li>
      <li>把 <code>visibleCourses</code> 存成 state、再靠 <code>useEffect</code> 去同步：多出一份真相，更新会慢一帧出现闪烁，依赖写不好还可能陷入死循环。</li>
      <li>凡是<strong>能在渲染中算出来的值</strong>（筛选、排序、计数）都存进 state，等于给自己安排了一项「保证两份数据不打架」的长期负担。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补<strong>身份</strong>这一层。把 <code>key</code> 换成数据里的稳定标识——数据库 id、业务编码这类天然唯一、且不随位置变化的值：<code>&lt;li key={course.id}&gt;</code>。这样即便列表重排，React 也能凭 id 认出「这项还是原来那项」，把节点连同它的局部状态一起搬到新位置，而不是错误地复用邻居的节点。顺序可能变化的列表，这一点尤其关键。
    </p>
    <p>
      再补<strong>派生</strong>这一层。筛选结果不需要独立存活，它完全由「课程数组 + 关键词」推导而来，所以留在渲染里现算即可。你要记住的分界线是：如果某个值能被已有状态算出来，它就不该是新的状态。
    </p>
    <p>
      最后收一下边界。确实存在一些<strong>不能由其他状态推导出的独立事实</strong>——比如「用户当前选中了哪门课」的 id，它既不等于列表本身，也推不出来，这种才值得存进 state。换句话说，判断标准不是「这个值会不会变」，而是「它能不能从已有的状态算出来」。
    </p>
    <div class="lesson-box hint">
      <strong>两个好习惯：</strong>列表顺序可能变动时，key 一律用稳定的业务 id，别用数组下标；筛选、排序、统计这类结果留在渲染阶段现算，别用 Effect 去把一份 state 复制成另一份。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在搜索框里敲关键词——列表在渲染阶段被实时过滤，每张卡片都以课程 id 作为稳定 key，让 React 在列表变化时准确认领每个节点。</figcaption>
      <R03ListsKeys />
    </figure>

    <h2>总结</h2>
    <p>
      列表的稳定靠两件事：给每一项一个来自数据的<strong>稳定身份</strong>（key），以及把<strong>派生值留在渲染里现算</strong>，不另存状态。身份稳了，增删重排就不会串行；来源少了，界面就不会再有两份互相对不上的真相。
    </p>
    <div class="lesson-term">
      <span class="term-name">「协调（Reconciliation）」</span>指 React 对比新旧元素树、决定哪些节点复用来更新、哪些被创建或销毁的过程；在列表里，<code>key</code> 就是它匹配同一层级中前后项的依据。边界与例外：只有<strong>同一层级</strong>的兄弟节点之间才靠 key 比对，跨层级会整棵重建；key 只需同级唯一、不会传给组件；一旦 key 改变，React 会视为一个全新的节点，连同其内部状态一起重建。
    </div>
  </LessonArticle>
</template>
