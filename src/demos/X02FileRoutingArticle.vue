<script setup lang="ts">
import X02FileRouting from './X02FileRouting.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同样是文件夹，<code>app/blog/[slug]/page.tsx</code>、<code>app/docs/[...slug]/page.tsx</code>、<code>app/(marketing)/about/page.tsx</code> 分别能匹配到什么地址？满屏的方括号、圆括号、点号，到底各自代表什么意思？
    </div>

    <h2>提出问题</h2>
    <p>
      后台要做一套内容站，路径不止「一个页面一个目录」这么简单：博客文章是 <code>/blog/某某</code>，文档是 <code>/docs/第一章/第一节</code> 这种能无限往下钻的多段路径，商品页还希望 <code>/shop</code> 和 <code>/shop/手机/旗舰</code> 都能命中同一个页面。这些需求和「一个文件对应一条固定 URL」的直觉明显对不上。
    </p>
    <p>
      如果在传统方案里解决，你多半会到路由配置里写正则：先匹配固定段，再匹配参数段，还要处理可选段和通配。规则一多，配置文件就成了最难读懂、也最容易改错的地方。于是问题变成：<strong>能不能不用正则，让文件名自己把这种结构说清楚？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最小的一步，是接受「目录即路由」这条规则，只用最简单的一层：新建 <code>app/blog/page.tsx</code>，它就对应 <code>/blog</code>，页面组件直接返回内容即可。
    </p>
    <p>
      这个方案做对了核心的一件事——<strong>固定路径的映射是直观且零配置的</strong>，你看到目录结构就等于看到了站点地图。只要站点只有几个静态页面，这样写完全够用，也不会有人抱怨。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>文章 ID、分类名这类「运行时才知道」的路径段，静态目录表达不了。</li>
      <li>文档那种任意深度的路径，没法为每一层都建一个文件夹。</li>
      <li>像 <code>/shop</code> 与 <code>/shop/a/b</code> 这种「可有可无的尾段」，静态目录只能二选一。</li>
      <li>想把「营销页」和「后台页」分成两组代码、各用一套布局，但 URL 里又不该出现分组的名字。</li>
      <li>内部组件和工具函数如果随手放进 <code>app/</code>，会连同它们所在的目录一起被当成路由，凭空多出页面。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不用推翻「目录即路由」，而是给目录名加一套<strong>约定符号</strong>，把上述每一种需求都翻译成一个可见的写法。核心依旧只有一句：<code>page.tsx</code> 才是页面的 UI 入口，目录层级就是 URL 层级，其余符号只是在描述「这一段路径怎么匹配」。
    </p>
    <ol class="lesson-steps">
      <li>单段动态参数用方括号：<code>app/blog/[slug]/page.tsx</code> 匹配 <code>/blog/anything</code>，组件通过 <code>params.slug</code> 拿到那一段字符串。</li>
      <li>多段捕获用三点号：<code>app/docs/[...slug]/page.tsx</code> 匹配 <code>/docs/a/b/c</code>，此时 <code>params.slug</code> 是 <code>['a', 'b', 'c']</code> 这样的数组。</li>
      <li>可选的尾段用双层方括号：<code>app/shop/[[...slug]]/page.tsx</code> 既能匹配 <code>/shop</code>，也能匹配 <code>/shop/a/b</code>，零个路径段也算命中。</li>
      <li>只想分组、不改 URL 时用圆括号：<code>app/(marketing)/about/page.tsx</code> 的最终 URL 仍是 <code>/about</code>，圆括号部分只影响代码组织与布局。</li>
      <li>内部文件用下划线前缀隔离：<code>app/_components/Button.tsx</code> 里的 <code>_components</code> 不参与路由生成，可以安心放组件和工具。</li>
    </ol>
    <p>
      把这几条并排写出来，就能一眼记住各自的适用范围：
    </p>
    <table>
      <thead>
        <tr><th>写法</th><th>含义</th><th>URL 影响</th></tr>
      </thead>
      <tbody>
        <tr><td><code>[param]</code></td><td>动态参数，匹配单段</td><td>该段为变量</td></tr>
        <tr><td><code>[...slug]</code></td><td>Catch-all，捕获一段或多段</td><td>该段起为变量数组</td></tr>
        <tr><td><code>[[...slug]]</code></td><td>可选 Catch-all，零段也可匹配</td><td>该段可选</td></tr>
        <tr><td><code>(group)</code></td><td>路由组，组织代码与布局</td><td>不出现</td></tr>
        <tr><td><code>@slot</code></td><td>并行路由插槽</td><td>不出现</td></tr>
        <tr><td><code>_folder</code></td><td>私有文件夹，不参与路由</td><td>不生成</td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>两个易错点：</strong>动态段的<strong>目录名要和页面里读取的 <code>params</code> 字段一致</strong>，把 <code>[slug]</code> 改成 <code>[id]</code> 后，组件里的 <code>params.slug</code> 也要同步改成 <code>params.id</code>，否则拿到的是 <code>undefined</code>；另外，<code>page.tsx</code> 之外的文件（<code>layout</code>／<code>loading</code>／<code>error</code> 等）本身<strong>不直接生成路由</strong>，它们只是页面周边的约定文件。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换不同的目录写法，看它们各自能匹配出哪些真实 URL。</figcaption>
      <X02FileRouting />
    </figure>

    <h2>总结</h2>
    <p>
      文件路由把「这条路径怎么匹配」这件事，从正则表达式搬到了目录名字里：方括号管动态，三点号管多段，双层方括号管可选，圆括号管分组不改路径，下划线管私有。你只要读一遍目录，就能推断出整个站点的路由结构。
    </p>
    <div class="lesson-term">
      <span class="term-name">「约定式路由」</span>指不写集中式路由表，而是用文件名与目录名表达路由：<code>page.tsx</code> 是唯一入口，目录层级即 URL 层级。<code>[param]</code> 捕获单段、<code>[...slug]</code> 捕获多段（结果数组）、<code>[[...slug]]</code> 可选捕获（零段也匹配）、<code>(group)</code> 路由组不影响 URL、<code>@slot</code> 是并行插槽、<code>_folder</code> 是私有文件夹。动态段名必须与页面读取的 <code>params</code> 字段一致。
    </div>
  </LessonArticle>
</template>
