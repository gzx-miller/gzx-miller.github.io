<script setup lang="ts">
import N02FileRouting from './N02FileRouting.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你新建一个 <code>pages/about.vue</code>，一个字都没注册路由，浏览器打开 <code>/about</code> 就能访问；把它重命名成 <code>pages/about-us.vue</code>，<code>/about</code> 立刻变成 404。从头到尾没有任何「路由配置」被改动过——那这张路由表到底存放在哪里？
    </div>

    <h2>手写路由表</h2>
    <p>
      用过 Vue Router 的人都知道，路由表是一个你亲手写的 <code>routes</code> 数组：每条记录说明路径是什么、对应哪个组件。<strong>文件放在哪是一回事，URL 长什么样完全由这张表决定</strong>，两者并无必然联系。
    </p>
    <p>
      这套写法把两三个成本交给了人来承担。新增一个页面要改两处——建文件、再往表里补一条，漏掉一处页面就打不开；路由表和页面文件会各自演化，看表不知道文件在哪，翻目录又不知道 URL 长什么样；等到重构时把目录改个名，还得回头逐个改表里的字符串路径。于是问题很清楚：<strong>能不能让文件的位置直接决定 URL，把路由表从「手写」变成「推导出来」？</strong>
    </p>

    <h2>文件路径即路由</h2>
    <p>
      最省事的做法：路由表还是手写，但给自己定一条硬规矩——<strong>文件路径就等于路由路径</strong>，<code>pages/about.vue</code> 一定对应 <code>/about</code>，命名照此对齐。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它承认了「路由路径应当可以从文件推导出来」</strong>。只要命名足够自律，路径就变得可预测。问题在于，这条规矩仍然靠人守，没有任何东西替你执行它。
    </p>

    <h2>双处同步的负担</h2>
    <ul>
      <li>仍要两处同步：建完文件还得回车去补路由记录，漏一处页面就打不开，且不会有任何报错提醒。</li>
      <li><code>routes</code> 数组是有序的，顺序会影响匹配结果，维护时得时刻留意排列。</li>
      <li>嵌套路由要手写 <code>children</code>，目录层级一深，嵌套结构就变得很啰嗦。</li>
      <li>表和文件对不上时系统不会报错，只有当用户访问到 404 才被发现，反馈严重滞后。</li>
    </ul>

    <h2>目录即路由表</h2>
    <p>
      不推翻「路径由文件推导」，而是把推导这件事交给框架：Nuxt 直接把 <code>pages/</code> 目录本身当作路由表，构建时扫描它、生成对应的配置。<strong>底层依然是 Vue Router，只是这份配置由文件推导而来，而不是你手写的</strong>。映射规则很朴素：
    </p>
    <ol class="lesson-steps">
      <li><code>pages/index.vue</code> 映射根路径 <code>/</code>——<code>index</code> 代表该层目录的根。</li>
      <li><code>pages/about.vue</code> 映射 <code>/about</code>；嵌套目录映射层级路径，<code>pages/users/index.vue</code> 映射 <code>/users</code>。</li>
      <li>文件名用方括号包住表示可变的一段：<code>pages/users/[id].vue</code> 映射 <code>/users/:id</code>，<code>[...slug].vue</code> 则匹配余下的全部路径段。</li>
      <li>把页面文件删除或重命名后，去 <code>.nuxt/</code> 里看生成的路由表，会发现路由严格跟着文件一一对应——文件没了，那条路由也就跟着没了。</li>
    </ol>
    <p>
      验证「一一对应」这件事有个很直接的办法：删掉一个页面文件，再去看生成的结果，那条路由当场消失；加回来，它又自动出现。路由表不再是一份需要背下来的清单，而是目录结构的一层层投影。
    </p>
    <div class="lesson-box warn">
      <strong>别把组件塞进 <code>pages/</code>：</strong>文件路由只在 <code>pages/</code> 目录生效，其它目录里的 <code>.vue</code> 不会生成路由；反过来说，<code>pages/</code> 下随手丢一个组件文件，它会被当成一条路由。页面和组件要分开放，组件请进 <code>components/</code>。
    </div>
    <p>
      还有两个便利要记住。开发模式下新增或重命名 <code>pages/</code> 里的文件会被自动监听并重建路由，<strong>不需要手动重启开发服务器</strong>。而方括号接出来的参数值始终是字符串——这一条下一课专门展开。
    </p>

    <h2>路径与地址映射</h2>
    <figure class="lesson-figure">
      <figcaption>点选左侧的路由映射表，看每条文件路径如何对应成一个 URL，再对照右侧的静态、动态、catch-all 三类命名速查。</figcaption>
      <N02FileRouting />
    </figure>

    <h2>路由表的投影化</h2>
    <p>
      文件路由把「路由表」从一份需要手动维护的清单，变成了 <code>pages/</code> 目录结构的投影：目录层级对应路径层级，<code>index.vue</code> 对应该层级的根。你只需要把文件放对地方，路径就自动成立，路由表也就永远和文件保持一致。
    </p>
    <div class="lesson-term">
      <span class="term-name">「文件路由」</span>指路由由 <code>pages/</code> 目录结构推导而来：目录层级对应路径层级，<code>index.vue</code> 对应该层级的根路径，方括号文件名表示可变的一段。它的边界是<strong>只在 <code>pages/</code> 目录生效</strong>，且页面文件不可与组件混放——<code>pages/</code> 下的每个 <code>.vue</code> 都会被当成一条路由。
    </div>
  </LessonArticle>
</template>
