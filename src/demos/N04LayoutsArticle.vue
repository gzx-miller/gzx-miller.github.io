<script setup lang="ts">
import N04Layouts from './N04Layouts.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给二十个页面都加了同一根顶部导航，于是把那段 header 复制了二十遍。产品说 logo 要换，你就得改二十个文件。可换到隔壁那个 Nuxt 项目，同样的导航只存在于一个文件里，页面文件里连它的影子都看不到——<strong>页面自己没写的东西，是怎么出现在页面上的？</strong>
    </div>

    <h2>共享外壳复制代价</h2>
    <p>
      一组页面往往要共享同一段外壳：顶部导航栏、侧边菜单、页脚。这层结构和具体页面无关，却要出现在每一个页面上。
    </p>
    <p>
      旧办法的代价一个比一个明显。在每个页面里直接复制外壳，改一处就得改 N 处，迟早漏改；把外壳抽成组件、在每页 import 后再包起来，省了复制，可每个页面都得记得包，漏一个就少了导航；干脆在 <code>App.vue</code> 里统一包住所有页面，省心是省心了，但所有页面被迫共用同一套壳，官网和后台想用不同外壳就没了办法。于是问题凝成一句：<strong>怎么让共享外壳只写一次，又能让不同页面各自选用不同的外壳？</strong>
    </p>

    <h2>外壳抽成布局组件</h2>
    <p>
      最省事的做法：把外壳做成一个 <code>&lt;Layout&gt;</code> 组件，页面 import 进来，用自己的内容把它包住。
    </p>
    <p>
      这个方案做对了一件核心的事：<strong>外壳逻辑只有一份，真正被复用了</strong>。导航要改，改组件一处即可。要挑刺的话，问题出在「每页都得手工包」——壳与页面的关系，仍然由每个页面自己建立和维护。
    </p>

    <h2>逐页包裹漏写风险</h2>
    <ul>
      <li>每个页面都要记得把内容包进 <code>&lt;Layout&gt;</code>，漏写一个页面，它就没了导航。</li>
      <li>想给某个页面换一种壳，得改它的 import 和标签，逐页修改。</li>
      <li>外壳标签和页面内容挤在同一个文件里，页面本身的职责被外壳稀释，读起来更累。</li>
      <li>没有任何地方能「声明式」地一句话说清：这个页面该用哪种外壳。</li>
    </ul>

    <h2>布局一等概念化</h2>
    <p>
      不推翻「把壳抽出来复用」，而是把「壳」提升为框架里的一等概念——<strong>布局</strong>。页面不再自己包裹，而是把「用哪个壳」声明出去，剩下的交给框架拼接。
    </p>
    <ol class="lesson-steps">
      <li>在 <code>layouts/</code> 下建布局文件，内部用一个 <code>&lt;slot /&gt;</code> 标出「页面内容放在这里」的位置。</li>
      <li><code>layouts/default.vue</code> 是默认布局：页面不指定时自动使用它，所以什么都不写也照样有壳。</li>
      <li>页面用 <code>definePageMeta({ layout: 'custom' })</code> 选择布局——这是一句声明，不是一次包裹，页面里从此不再出现任何外壳标签。</li>
      <li>渲染时框架把页面内容填进布局的 <code>&lt;slot /&gt;</code>，两者合成最终页面。</li>
    </ol>
    <p>
      这也就解开了开场的疑问：页面上之所以看得见导航，是因为导航写在布局里，页面只是被填进了布局预留的那个位置。你切换布局不同的页面时会发现一件有意思的事：<strong>布局外壳保持不动，只有 slot 里的内容被替换</strong>——因为更换的只是被填进去的部分。
    </p>
    <p>
      还有一个容易混淆的地方要分清：<code>&lt;slot /&gt;</code> 与 <code>&lt;NuxtPage /&gt;</code> 职责完全不同。<code>&lt;slot /&gt;</code> 是布局留给自己的插槽，用来接收页面内容；而 <code>&lt;NuxtPage /&gt;</code> 用来呈现当前匹配到的路由页面，通常写在 <code>App.vue</code> 里决定「页面渲染在哪个位置」。一个是「把内容放进来」，另一个是「把匹配的页面挂上去」。
    </p>
    <div class="lesson-box warn">
      <strong>SSR 下布局在服务端也会渲染：</strong>布局组件在服务端就会执行，因此<strong>直接在布局里访问 <code>window</code> 会报错</strong>。需要用到浏览器 API 的逻辑，放到 <code>onMounted</code> 里，等组件在客户端挂载后再做。另外，只想在客户端使用的布局，用 <code>.client</code> 后缀命名（如 <code>custom.client.vue</code>）即可声明。
    </div>

    <h2>双布局代码对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 Default 与 Custom 两种布局，一边看预览里外壳与 <code>&lt;slot /&gt;</code> 的位置关系，一边对照两种布局的代码和页面里那句 <code>definePageMeta</code>。</figcaption>
      <N04Layouts />
    </figure>

    <h2>插槽与页面分工</h2>
    <p>
      布局把「共享外壳」从每个页面里搬了出来，只保留一份，并让页面用 <code>definePageMeta</code> 声明选用哪一个。<code>&lt;slot /&gt;</code> 负责把页面内容嵌进外壳的位置，默认布局 <code>default.vue</code> 负责兜底——于是「多页面共享结构」和「不同页面用不同外壳」这两件事，第一次可以同时成立。
    </p>
    <div class="lesson-term">
      <span class="term-name">「布局（Layout）」</span>是包裹页面内容的壳组件：<code>layouts/default.vue</code> 是未指定时的默认布局，内部用 <code>&lt;slot /&gt;</code> 接收页面内容；页面通过 <code>definePageMeta({ layout: 'custom' })</code> 选择布局，渲染时页面内容被填入 slot。它的边界是——<code>&lt;slot /&gt;</code> 承载页面内容而与呈现路由页面的 <code>&lt;NuxtPage /&gt;</code> 职责不同；SSR 下布局会在服务端渲染，访问 <code>window</code> 会报错，须放到 <code>onMounted</code>；仅客户端的布局用 <code>.client</code> 后缀命名。
    </div>
  </LessonArticle>
</template>
