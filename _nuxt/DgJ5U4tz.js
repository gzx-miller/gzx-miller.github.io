const n=`<script setup lang="ts">
import U01ProjectStructure from './U01ProjectStructure.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 Vue 项目里新建一个页面，只要往路由表加一行就能跳过去；换到 uni-app，页面文件明明建好了，<code>uni.navigateTo('/pages/course/course')</code> 却直接失败、页面一片空白——为什么"新建页面"这件事，还得先去改一个配置文件？
    </div>

    <h2>多端运行环境差异</h2>
    <p>
      你想做一件很朴素的事：一套代码同时产出微信小程序、H5 网页和 App，页面结构只维护一份。可这三个端并不是同一种运行环境——H5 有浏览器的文档流和 URL 路由，小程序没有 DOM、也没有可以被"猜"出来的页面清单。
    </p>
    <p>
      如果按老路走，每个端各维护一份工程，代价很具体：<strong>页面清单要在三份工程里各写一遍</strong>，改一个跳转就要同时改三处；<strong>导航栏标题和配色散落在各个页面文件里</strong>，想统一换风格就是一场全局搜索；再加上<strong>底部 tab、首页这类"平台级"约定，在页面组件内部根本没有地方声明</strong>。于是问题收成一句：一套代码要同时面向三端，页面在哪里登记、全局窗口和底部 tab 又该去哪里声明？
    </p>

    <h2>一页一文件约定</h2>
    <p>
      最省事的组织方式其实你已经在用了：<code>main.js</code> 创建应用、<code>App.vue</code> 作为根、<code>pages/</code> 目录下"一个页面一个 .vue 文件"。这个方案做对了一件要紧的事——<strong>它承认"页面就是一个 Vue 组件"</strong>，写页面的手感和写组件完全一致，不必为多端重学一套写法。
    </p>
    <p>
      只要再给这套目录加一层"说明书"，平台就知道该加载谁、该怎么显示。
    </p>

    <h2>页面清单与窗口外观</h2>
    <ul>
      <li>小程序没有浏览器那种 URL 路由，它需要一份明确的"有哪些页面、谁是第一个"的清单，否则导航调用连目标页都找不到。</li>
      <li>导航栏标题、背景色这类窗口外观如果写在每个页面里，三端统一换风格时要逐页改，漏一个就不一致。</li>
      <li>底部 tab 是平台级入口，它不属于任何一个普通页面，靠页面内的跳转代码声明不出来。</li>
      <li>应用的启动时机（比如只读一次本地缓存）没有"应用级"的落脚点——写进页面组件，等于每进一个页面都执行一遍。</li>
    </ul>

    <h2>声明式页面注册</h2>
    <p>
      不推翻"目录 + 组件"，而是在目录之上补一层<strong>静态配置</strong>：<code>pages.json</code>。它用一份声明把上面几件事一次说清。
    </p>
    <p>
      先补最关键的一件：<code>pages</code> 数组。按顺序列出页面，<strong>第一项就是应用启动后加载的首页</strong>——uni-app 没有单独的"首页配置项"，顺序即优先级。每一项带 <code>path</code>（页面路径）和可选的 <code>style</code>（该页窗口样式）。
    </p>
    <p>
      首页定了，再补全局外观：<code>globalStyle</code>。导航栏标题、背景色、文字风格都在这里声明一次，全局页面的默认窗口外观就统一了；某个页面需要例外时，再在自己的 <code>style</code> 里覆盖。
    </p>
    <p>
      接着补底部入口：<code>tabBar</code>。它声明底部有哪些 tab、各自的图标与文字。<strong>被 tabBar 声明的页面必须同时出现在 pages 数组里</strong>，而且它们之间的切换只能用 <code>uni.switchTab</code>，普通跳转是进不去的。
    </p>
    <div class="lesson-box warn">
      <strong>两个最容易踩的坑：</strong>新增页面文件后<strong>必须在 pages 数组里注册</strong>，否则路由访问不到、跳转直接失败；tabBar 里写的页面路径如果没在 pages 里出现过，应用可能连启动都出错。
    </div>
    <p>
      最后把两个"入口文件"的职责补齐。<code>main.js</code> 用 <code>createSSRApp</code> 创建应用实例，是跨端统一的启动入口，全局 API、状态库都挂在这里，避免各端各写一套；<code>App.vue</code> 提供<strong>应用级生命周期</strong>与全局样式，比如 <code>onLaunch</code> 只在应用启动时执行一次，正好补上前面说的"应用启动落脚点"。
    </p>
    <p>
      到这里目录骨架就各就各位了：页面路径与文件<strong>一一对应</strong>，<code>static/</code> 放静态资源，<code>components/</code> 放约定好可自动注册的组件。当页面多到主包吃不消时，还能在同一份 <code>pages.json</code> 里用分包（<code>subPackages</code>）把低频页面下沉——同样是"静态声明"这一条思路的延伸。
    </p>

    <h2>目录职责与入口切换</h2>
    <figure class="lesson-figure">
      <figcaption>点左侧目录树的每个节点，看它负责什么；再点右侧手机底部的 tab，体会 tabBar 声明的入口如何切换。</figcaption>
      <U01ProjectStructure />
    </figure>

    <h2>静态声明生成页面</h2>
    <p>
      uni-app 的页面不是"扫目录扫出来的"，而是由 <code>pages.json</code> 静态声明出来的：pages 数组定页面、且第一项即首页，globalStyle 定全局窗口，tabBar 定底部入口。把页面当组件写、把页面清单当配置管，多端骨架就稳了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「pages 数组」</span><code>pages.json</code> 中按顺序声明页面的清单，每项包含 <code>path</code> 与可选 <code>style</code>，<strong>第一项即应用首页</strong>。必须记住的边界：页面不在此登记就无法被路由访问；tabBar 声明的页面必须同时出现在这里；同一页面不能在主包与分包里重复声明。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
