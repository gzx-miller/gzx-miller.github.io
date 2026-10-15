<script setup lang="ts">
import J03ArrayPipeline from './J03ArrayPipeline.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表新加了一个「按评分排序」的按钮，点一下列表确实排好了，可再点「恢复默认顺序」却回不去——因为排序那次调用把原数组自己改了，默认顺序在内存里根本没留下痕迹。
    </div>

    <h2>想到就去改数组</h2>
    <p>
      最初的直觉很自然：既然数据是数组，要改就直接在数组上改。<code>push</code> 往末尾加一件商品，<code>pop</code> 去掉最后一件，<code>unshift</code> 插到最前面，<code>shift</code> 摘掉最前面一件，中间位置要增删就交给 <code>splice</code>。这套方法把「改完」这件事做到了极致：调用一结束数组立刻是新状态，调用方甚至不必接收返回值。
    </p>
    <p>
      它们也确实解决了问题——数据的维护不需要来回传递副本，改动就地落地，内存和心智都轻。麻烦只在数组被多方共享时才浮现。
    </p>

    <h2>就地修改埋下的坑</h2>
    <p>
      你想展示一次排序，调用 <code>sort</code>，原数组的顺序也一并没了；你想取前十条做分页，调用 <code>splice</code>，原始数据也跟着少了一段。更隐蔽的是：Vue、React 这类框架靠「引用有没有变」来判断数据是否更新，就地修改后引用原地不动，框架看不到变化，界面就不刷新。
    </p>
    <ul>
      <li>撤销历史、分页缓存、新旧对比都依赖「旧版本」，可旧版本已经被就地改没了。</li>
      <li>多个组件共享同一个数组时，一处修改会悄悄影响另一处的渲染结果。</li>
      <li>排序、截取这类纯展示需求，本不该反过来污染数据源。</li>
    </ul>
    <p>
      既然「改」是问题所在，那就把「改」与「取值」拆开：需要判断时只读，需要新结果时产出一份新数组。
    </p>

    <h2>只读的检索方法</h2>
    <p>
      不是每个需求都要改数据。想回答「有没有、在哪、是否都满足」，有一套只读方法：<code>includes</code> 判断是否包含某个值，它用 SameValueZero 规则比较，因此能正确识别 <code>NaN</code>；<code>find</code> 返回第一个满足条件的元素；<code>findIndex</code> 返回它的下标；<code>some</code> 只要有一个命中就提前返回 <code>true</code>；<code>every</code> 只要有一个不满足就提前返回 <code>false</code>。它们一个字节都不会动原数组。
    </p>

    <h2>转换方法与不破坏的对应版本</h2>
    <p>
      真正做「加工」的是 <code>map</code>、<code>filter</code>、<code>reduce</code>：<code>map</code> 一对一映射，<code>filter</code> 按条件筛选，<code>reduce</code> 把整串折叠成一个值；<code>flat</code> 按深度拍平嵌套数组（默认只拍一层），<code>flatMap</code> 等于先 <code>map</code> 再 <code>flat(1)</code>，适合「一个元素展开成多个」的场景。这几个方法本就返回新数组，调用后原数组原封不动。
    </p>
    <p>
      与前面的增删改一一对应，也有一套非破坏版本：<code>splice</code> 对应 <code>toSpliced</code>，下标赋值 <code>arr[i] = x</code> 对应 <code>with(i, x)</code>，<code>sort</code> 对应 <code>toSorted</code>，<code>reverse</code> 对应 <code>toReversed</code>。它们都返回新数组，把「改」翻译成「得到一份改过的拷贝」。
    </p>
    <p>
      还有两个构造入口值得记住。<code>Array.from</code> 把类数组或可迭代对象转成真数组：类数组指有 <code>length</code> 与下标、却没有数组方法的对象，例如 <code>arguments</code>、DOM 的 <code>NodeList</code>、甚至字符串；它接受第二个参数直接做映射，写成 <code>Array.from({ length: 5 }, (_, i) =&gt; i)</code> 就能造出 <code>[0, 1, 2, 3, 4]</code>。稀疏数组则是另一回事——像 <code>[1, , 3]</code> 这种带空槽（hole）的数组，<code>map</code>、<code>filter</code>、<code>forEach</code> 会跳过空槽不执行回调，而 <code>Array.from</code> 会把空槽一律读成 <code>undefined</code> 补实。
    </p>

    <h2>把只读操作串成流水线</h2>
    <p>
      把只读检索、转换、非破坏排序按顺序串起来，就得到一条不可变流水线：每一步都基于上一步的返回值产生新数组，原数组全程没被碰过。下面这个「按关键词筛选 + 按评分排序」的演示，正是 <code>filter</code> 与 <code>toSorted</code> 的组合。
    </p>
    <figure class="lesson-figure">
      <figcaption>在搜索框输入关键词，结果由 filter 筛选、toSorted 排序得到，原始 courses 数组始终不变。</figcaption>
      <J03ArrayPipeline />
    </figure>

    <h2>不可变流水线的价值</h2>
    <p>
      把操作写成链式流水线后，几个问题一起解决了：原数组始终是可信的基准，随时能「恢复默认」或重新筛一遍；框架通过引用比较就能察觉每一步的新结果，界面随之更新；每一环单独取出都能验证，调试不必在脑中模拟整段就地修改。至于写日志、发请求、改 DOM 这类副作用，交给 <code>forEach</code>——它遍历数组执行回调，但不返回数组，因此不能链式，这正是「副作用」与「转换」在接口上的分界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「不可变方法」</span>指不修改原数组、而是返回新数组的方法，例如 <code>map</code>、<code>filter</code>、<code>reduce</code>、<code>toSpliced</code>、<code>with</code>、<code>toSorted</code>、<code>toReversed</code>；与之相对的是 <code>push</code>、<code>splice</code>、<code>sort</code> 这类就地修改的方法。把不可变方法串成链式流水线，就能在保留数据源的前提下完成筛选、映射与排序。
    </div>
  </LessonArticle>
</template>
