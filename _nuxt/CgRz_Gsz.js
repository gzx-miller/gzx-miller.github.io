const o=`<script setup lang="ts">
import X15RouteGroups from './X15RouteGroups.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个项目里，营销页要有顶部大导航，后台管理要有侧边栏——它们共用一套代码，可为什么不能按「页面属于谁」来套外壳，而非得靠 URL 多带一层路径才能区分？
    </div>

    <h2>布局外壳与URL解耦</h2>
    <p>
      课程站通常有两副面孔：面向访客的营销页（首页、关于、定价），和面向内部的后台（仪表盘、设置）。两边的导航、页脚、整体风格完全不同，但它们是同一个 Next.js 项目、共用同一套组件和工具函数。
    </p>
    <p>
      麻烦在于，布局是跟着目录层级走的，而 URL 又不该因此变样——你不想为了「换一套外壳」就让地址栏多出一层 <code>/marketing</code> 之类的路径。开发中还常有内部组件要存放，既不能被当成页面，也不该污染路由。
    </p>

    <h2>导航页脚逐页复制</h2>
    <p>
      最直白的做法是把导航和页脚直接写进每个页面里：营销页复制一份顶部大导航，后台页复制一份侧边栏。内部组件则随手放在 <code>app/</code> 下的某个目录里。
    </p>
    <p>
      它在页面数量极少时确实能跑——<strong>每个页面自给自足，想怎么排就怎么排</strong>，不需要理解任何新概念。
    </p>

    <h2>重复代码与冗余路由</h2>
    <ul>
      <li>重复代码：导航改了要一处处同步，漏一处就样式打架。</li>
      <li>误生成路由：放在 <code>app/</code> 下的组件目录可能被当成页面路径，凭空多出路由。</li>
      <li>无法按区域切换外壳：想整体换掉后台的壳层，只能逐个页面改。</li>
      <li>结构混乱：页面组件、内部组件、工具函数混在同一层，越写越难找。</li>
    </ul>

    <h2>圆括号路由分组</h2>
    <p>
      先解决「换外壳不改 URL」。Route Groups 用<strong>圆括号目录</strong>表达这件事：<code>(marketing)</code> 和 <code>(dashboard)</code> 这样的目录<strong>不参与 URL 生成</strong>，却可以各自拥有一个 <code>layout.tsx</code>。
    </p>
    <p>
      于是 <code>app/(marketing)/page.tsx</code> 的地址就是 <code>/</code>，<code>app/(marketing)/about/page.tsx</code> 就是 <code>/about</code>，外面套的是营销布局；而 <code>app/(dashboard)/page.tsx</code> 是 <code>/dashboard</code>，<code>app/(dashboard)/settings/page.tsx</code> 是 <code>/dashboard/settings</code>，外面套的是带侧边栏的后台布局。地址栏里看不到任何括号，代码里却分得清清楚楚。
    </p>
    <p>
      再解决「内部东西放哪」。私有文件夹用<strong>下划线前缀</strong>：<code>_components</code>、<code>_lib</code>、<code>_hooks</code> 这些目录<strong>完全不参与路由生成</strong>，是存放内部实现的干净位置。页面里照常写 <code>import { Button } from './_components/Button'</code> 使用，但外面永远访问不到它。
    </p>
    <p>
      至此可以对照一份完整的命名约定，把每种符号的职责理清：
    </p>
    <table>
      <thead>
        <tr><th>写法</th><th>作用</th></tr>
      </thead>
      <tbody>
        <tr><td><code>[param]</code></td><td>动态路由参数</td></tr>
        <tr><td><code>[...slug]</code></td><td>Catch-all 动态路由</td></tr>
        <tr><td><code>(group)</code></td><td>路由组，不影响 URL</td></tr>
        <tr><td><code>@slot</code></td><td>并行路由插槽</td></tr>
        <tr><td><code>_folder</code></td><td>私有文件夹，不参与路由</td></tr>
        <tr><td><code>(.)folder</code></td><td>同级拦截路由</td></tr>
      </tbody>
    </table>
    <p>
      可以看出，路由组和私有文件夹是两种<strong>正交</strong>的手段：前者解决「同一批页面用哪套外壳」，后者解决「哪些内容不该成为路由」。它们都不改变 URL，却让工程结构从「一堆平铺目录」变成分区清晰的几块。
    </p>
    <p>
      还有一点值得强调：私有文件夹只是「不生成路由」，并不影响你如何导入它——在页面里仍按普通相对路径引入即可，区别只在于外部永远访问不到这个目录。反过来，路由组只影响布局与代码分区，不影响 URL。两者合起来，等于给了你两把互不干涉的「整理结构」的尺子。
    </p>
    <div class="lesson-box warn">
      <strong>冲突的坑要提前避开：</strong>路由组虽然不显示在 URL 里，但它<strong>并没有消除路径冲突</strong>。如果两个路由组各自解析出同一条 URL、却挂着不相容的 <code>layout</code>，构建时就会直接报冲突错误。同理，同一条路径不要同时出现在两个路由组的同名段中——一旦撞车，问题会在构建阶段暴露出来，而不是悄悄生效。
    </div>
    <p>
      判断要不要用路由组，标准很简单：当你希望「一组页面共享同一层布局、但地址里又不想多出这一层目录名」时，它就是答案；而若某个目录只是为了放代码、根本不该被访问，那就交给私有文件夹。
    </p>

    <h2>路由组外壳切换</h2>
    <figure class="lesson-figure">
      <figcaption>切换两组路由，看同一套代码如何在不改变 URL 的前提下套上不同外壳。</figcaption>
      <X15RouteGroups />
    </figure>

    <h2>私有目录与布局</h2>
    <p>
      路由组用 <code>(group)</code> 让一组路由共用独立布局、却不改动 URL；私有文件夹用 <code>_folder</code> 把内部组件与工具从路由里摘出去。两者都服务于「整理工程结构」这个目标：一个管外壳的归属，一个管内容的边界。记住它们并不消除路径冲突，撞车会在构建时毫不含糊地报出来。
    </p>
    <div class="lesson-term">
      <span class="term-name">「路由组与私有文件夹」</span>指两类不影响 URL 的目录约定：<code>(folder)</code> 圆括号目录是路由组，可为一组路由指定独立 <code>layout</code>（如营销页与后台各一套外壳）；<code>_folder</code> 下划线目录是私有文件夹，完全不参与路由生成，适合存放 <code>_components</code>、<code>_lib</code>、<code>_hooks</code> 等内部内容。两者都不改变 URL，但都不会消除路径冲突。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
