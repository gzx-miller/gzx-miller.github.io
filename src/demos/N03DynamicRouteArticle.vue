<script setup lang="ts">
import N03DynamicRoute from './N03DynamicRoute.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程详情页的地址是 <code>/courses/3</code>，你在页面里写 <code>if (route.params.id === 3)</code> 判断「这是第三门课」，它却从来不成立；你再写 <code>route.params.id + 1</code>，本以为得到 4，结果拼出了字符串 <code>'31'</code>。地址栏里那个明明是数字的 3，取出来到底变成了什么？
    </div>

    <h2>提出问题</h2>
    <p>
      一个课程详情页要服务无数条数据。如果每条数据都得对应一个自己的页面文件，产品让你上十门课，你就得新建十个文件——数据量一涨，文件数跟着线性膨胀，显然不可维护。你真正需要的，是<strong>一个文件按「路径的形状」匹配一整类 URL，并把其中会变的那一段作为参数接出来</strong>。
    </p>
    <p>
      旧的替代方案各有代价。用查询串 <code>/course?id=3</code>，一个文件确实够用，但 URL 只表达了「某个页面带了个参数」，像 <code>/docs/guide/installation</code> 这样的层级关系无从体现，对搜索引擎和分享链接也不友好；自己动手解析路径字符串、写正则去匹配，不但容易写错，还等于在框架的路由匹配之外又维护了一套平行逻辑，两边容易打架。于是问题落到一句：<strong>怎么让一个文件接住一整类 URL，并把变动的那一段干净地交出来？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：用查询串。写一个 <code>pages/course.vue</code>，所有数据都走 <code>/course?id=3</code>，组件里用 <code>useRoute().query.id</code> 把参数取出来。
    </p>
    <p>
      这个方案做对了一件重要的事：<strong>它把「变动的那一部分」从页面里抽了出来，变成了参数</strong>，于是同一个文件能服务所有 id。但它把资源地址退化成了「一个固定页面加一串参数」，URL 不再表达「这就是第 3 号资源的地址」。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>/course?id=3</code> 语义弱，搜索引擎与分享卡片都读不出这是一个具体资源的地址。</li>
      <li>表达不了层级：<code>/docs/guide/installation</code> 这种多段路径，查询串完全无能为力。</li>
      <li><code>?id=</code> 缺失时页面照样匹配成功，得自己在组件里判空，否则拿到 <code>undefined</code>。</li>
      <li>想在「访问之前」就校验参数是否合法，查询串方案没有一个自然的挂载点。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「把变动部分抽成参数」，而是让<strong>路径本身</strong>来承载这个参数——用方括号把文件名的某一段标成可变段。分三步补齐。
    </p>
    <p>
      先看单段参数。<code>pages/courses/[id].vue</code> 匹配 <code>/courses/</code> 下的<strong>一个</strong>路径段，组件里用 <code>useRoute().params.id</code> 取值。这里立刻撞上开场那个坑：<strong>参数值始终是字符串</strong>。地址里写的是 3，取出来的是 <code>'3'</code>，所以 <code>=== 3</code> 恒为 <code>false</code>，而 <code>'3' + 1</code> 会按字符串拼接成 <code>'31'</code>。要参与数值运算，必须先 <code>Number()</code> 转换，并判掉 <code>NaN</code>——像 <code>/courses/abc</code> 这样的非法段转出来正是 <code>NaN</code>，不处理就会带着脏值往下走。
    </p>
    <p>
      再补多段路径。<code>pages/docs/[...slug].vue</code> 匹配余下的<strong>全部</strong>路径段：访问 <code>/docs/guide/installation</code>，得到的是 <code>params.slug</code>，而它的类型和单参数不一样——<strong>单参数是一个字符串，catch-all 则是一个字符串数组</strong>，这里是 <code>['guide', 'installation']</code>，这一点最容易记混。它的匹配优先级低于更具体的静态与动态路由，所以它天然承担「前面都没命中的收尾路径」。
    </p>
    <p>
      最后补校验。在页面的 <code>definePageMeta</code> 里写一个 <code>validate</code> 函数，对参数做格式检查，返回 <code>false</code> 就让这次匹配失效、把请求转交错误处理（例如落到 404）。要留意的是，<code>validate</code> 在服务端渲染<strong>与</strong>客户端导航上都会执行，两端的逻辑必须写一致，否则同一地址在两种场景下会给出不同结果。
    </p>
    <p>
      把这条链路串起来就是：地址命中文件 → 从 <code>params</code> 取值（记得转类型）→ 用数据渲染页面。开场那两个怪现象，答案都在第一步——URL 里的一切，到了 <code>params</code> 里都是字符串。
    </p>
    <div class="lesson-box warn">
      <strong>同一路径别写两份：</strong>不要让 <code>[id].vue</code> 和 <code>[id]/index.vue</code> 同时存在——二者的路由是等价的，框架里只会有一份生效，容易让人搞不清到底走的哪个文件。先统一约定，再动手写页面。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在两个输入框里分别改路径：左边验证 <code>[id].vue</code> 的单段参数与类型转换，右边看 <code>[...slug].vue</code> 把多段路径拆成数组。</figcaption>
      <N03DynamicRoute />
    </figure>

    <h2>总结</h2>
    <p>
      动态路由把「一类地址」和「一个文件」对应了起来：方括号标出可变的那一段，命中后从 <code>params</code> 取值。要带走的关键判断只有一条——<strong>参数值永远是字符串</strong>，参与数值运算前先转换；而单段参数给字符串、catch-all 给数组，这个差别决定了你该怎么消费它。
    </p>
    <div class="lesson-term">
      <span class="term-name">「动态路由参数」</span>指由文件名方括号声明的可变路径段：<code>[id].vue</code> 匹配单个路径段，<code>route.params.id</code> 取到<strong>字符串</strong>；<code>[...slug].vue</code> 匹配余下全部路径段，<code>route.params.slug</code> 取到<strong>字符串数组</strong>。它的边界是取值恒为字符串（运算前需 <code>Number()</code> 并处理 <code>NaN</code>），且可用 <code>definePageMeta</code> 的 <code>validate</code> 校验参数、在不合法时返回 <code>false</code> 转交错误处理。
    </div>
  </LessonArticle>
</template>
