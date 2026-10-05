const n=`<script setup lang="ts">
import U07Routing from './U07Routing.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>登录成功后你用 <code>navigateTo</code> 跳到首页，用户按下系统返回键，却又回到了登录页，输入框里账号还填着——他会以为自己根本没登录成功。
    </div>

    <h2>多页面往返导航</h2>
    <p>
      一个多页面应用，页面之间要能来回走：列表点进详情、详情返回列表、登录后进主页、底部 tab 互相切换。最原始的做法是用一个全局变量记录「当前该显示谁」，所有页面写在一个文件里，靠条件渲染切换。
    </p>
    <p>
      这个办法把三份成本留给了你。第一，<strong>每个「页面」的生命周期得自己管</strong>：进入时要拉数据、离开时要清状态，全靠手写，忘了就是脏数据。第二，<strong>系统返回键和手势返回对不上</strong>，用户按了返回，你可能还停在同一个视图里。第三，所有页面挤进同一个组件，文件越来越大，而 <code>onLoad</code> 这类页面钩子根本无处安放。
    </p>
    <p>
      于是问题变成：<strong>页面之间该按什么规则跳转，才能让「到达哪、能不能回、回几层」都符合直觉？</strong>
    </p>

    <h2>变量驱动视图切换</h2>
    <p>
      先用一个 <code>currentPage</code> 变量来决定显示哪个视图，改一下字符串就切换。
    </p>
    <p>
      这个方案做对了一件事：<strong>它让「切换视图」变得极其简单</strong>——一个字符串就能决定当前看谁，不用新建文件、不用配置路由表。单页里做几个面板切换时，它是最快的选择。
    </p>

    <h2>返回键与深层跳转</h2>
    <ul>
      <li>用户按系统返回键时，视图不会自动回退——返回本是「页面栈」的行为，而你手里根本没有栈。</li>
      <li>深层跳转（列表 → 详情 → 再进一层详情）想一次退回两层，没有「弹栈」这个概念，只能手写状态回滚。</li>
      <li>传参只能靠变量，页面刷新后参数丢失，也无法从外部链接直接进入某个详情页。</li>
      <li>tab 页和普通页混在一个变量里，切 tab 该关掉谁、保留谁，全无规则可依。</li>
    </ul>

    <h2>页面栈压栈弹栈</h2>
    <p>
      不推翻「切换」，而是引入一个更结实的模型：<strong>页面栈</strong>。uni-app 维护一个栈，栈顶就是当前显示的页面，新页「压栈」、返回「弹栈」。四类跳转 API 的差别，本质上就是它们对栈做了什么。
    </p>
    <ol class="lesson-steps">
      <li><code>uni.navigateTo</code>：把新页压到栈顶，当前页保留在栈里，返回时弹回它。适合「列表 → 详情」。</li>
      <li><code>uni.redirectTo</code>：用新页<strong>替换</strong>当前栈顶页，当前页被销毁，返回回不来。适合「登录页 → 首页」，防止用户返回登录页。</li>
      <li><code>uni.switchTab</code>：只能跳到 tabBar 页面，且会<strong>关闭所有非 tab 页</strong>，重新打开目标 tab。跳 tab 页必须用它。</li>
      <li><code>uni.reLaunch</code>：关闭所有页面、清空栈，再打开目标页。适合退出登录、跳回首页这种「重新开始」。</li>
      <li><code>uni.navigateBack</code>：从栈顶弹出一层或多层，<code>delta</code> 指定层数；层数超过栈深则回到首页。</li>
    </ol>
    <p>
      接着补上参数传递。跳转时用 URL query 带参：<code>uni.navigateTo({ url: '/pages/course/detail?id=3' })</code>，目标页在 <code>onLoad(options)</code> 里解构出 <code>options.id</code>。注意 query 只能带字符串，大对象要么序列化、要么放进全局 store 或本地缓存——这是页面间通信的通用退路。
    </p>
    <div class="lesson-box warn">
      <strong>一个必须提前评估的边界：</strong>页面栈有上限，<strong>小程序最多 10 层</strong>。超过之后 <code>navigateTo</code> 会直接调用失败（不是静默丢弃），一条长链路上不小心层层压栈，用户就会在某一层跳不动。深链场景要么改用 <code>redirectTo</code> 控制栈深，要么用 <code>reLaunch</code> 重开。
    </div>

    <h2>四类跳转对栈操作</h2>
    <figure class="lesson-figure">
      <figcaption>依次点 <code>navigateTo</code>、<code>redirectTo</code>、<code>switchTab</code>、<code>navigateBack</code>，看页面栈如何逐层叠加、替换栈顶、清空重来、再逐层弹出。</figcaption>
      <U07Routing />
    </figure>

    <h2>跳转选型判断依据</h2>
    <p>
      路由的本质是一个页面栈，四类跳转的差别就是它们对栈做了什么：压栈、换掉栈顶、清空重来、弹栈。所以选哪个 API，本质是在回答「用户按下返回时，应该回到哪里」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「页面栈」</span>uni-app（及各小程序平台）管理页面的数据结构：<code>navigateTo</code> 把新页面压到栈顶，<code>navigateBack</code> 从栈顶弹出，<code>redirectTo</code> 替换栈顶页，<code>reLaunch</code> 清空后重开。边界：栈深有限（小程序通常 10 层），超限的 <code>navigateTo</code> 会失败；<code>switchTab</code> 跳转不压栈，而是关闭其它非 tab 页。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
