const o=`<script setup lang="ts">
import U09Easycom from './U09Easycom.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>项目里有 12 个页面，几乎每个页面都要用 <code>course-card</code>、<code>empty-state</code>、<code>nav-bar</code> 这几个组件，你在这 12 个文件顶部各手写了一遍 <code>import</code> 和注册；某天把其中一个组件改了名，漏改了一处引用路径，构建直接报错。
    </div>

    <h2>逐页手动引入成本</h2>
    <p>
      高频组件到底该怎么引入？最原始的做法是<strong>每个页面手动 <code>import</code> 再注册</strong>。这么写，三份成本是隐蔽的。
    </p>
    <p>
      第一，<strong>样板代码和业务混在一起</strong>，页面开头一大段引用，跟这页在做什么毫无关系。第二，<strong>改名或挪目录时要同步所有引用点</strong>，漏一个就编译失败，而且往往在构建时才暴露。第三，想省掉 <code>import</code> 就得全局注册，可全局注册会把所有组件一股脑打进主包，首屏跟着变大。
    </p>
    <p>
      问题因此变成：<strong>能不能让「用到什么组件」由模板自己决定，只要组件放在约定位置，就自动生效？</strong>
    </p>

    <h2>全局注册公共组件</h2>
    <p>
      先试全局注册：把所有公共组件在入口处一次性注册，页面里直接写标签。
    </p>
    <p>
      这个方案做对了一件事：<strong>它确实省掉了每个页面的 <code>import</code></strong>，页面顶部干净了，标签也确实能直接用。
    </p>

    <h2>主包体积与命名冲突</h2>
    <ul>
      <li>全局注册的组件无论用不用都会进主包，包里塞了一堆当前页根本没用的组件，首屏变慢。</li>
      <li>命名一旦冲突（两个组件都叫 <code>card</code>），后注册的覆盖先注册的，而且不报错，静默出错。</li>
      <li>「哪些算公共组件」需要提前拍板，团队协作时归属模糊，容易把所有东西都塞进全局。</li>
      <li>局部注册的页面照样要写 <code>import</code> 和注册，重复问题一点没解决。</li>
    </ul>

    <h2>目录约定替代注册</h2>
    <p>
      换一种思路：不要「注册」，要「约定」。<strong>easycom</strong> 规定，只要组件位于 <code>components/组件名/组件名.vue</code>，页面模板里就能直接写标签，既不用 <code>import</code>，也不用注册。框架在编译时扫描这个约定目录，命中的组件被<strong>异步加载、按需打包</strong>——用到的才进包，没用的不会被打进去。
    </p>
    <p>
      关键全在「命名一致」这四个字上：<strong>目录名、文件名、标签名三者必须一模一样</strong>，这是默认匹配规则。比如 <code>components/course-card/course-card.vue</code>，对应模板里的标签就是 <code>&lt;course-card&gt;</code>；少一层目录、或者文件跟目录不同名，默认规则就匹配不上。
    </p>
    <p>
      那目录结构不想迁就这个约定怎么办？去 <code>pages.json</code> 的 <code>easycom</code> 字段自定义。<code>custom</code> 是一个正则，把文件路径映射到组件名，你既可以用它把别的目录纳入扫描范围，也可以改写匹配规则。默认规则之外的额外支持，全靠它兜底。
    </p>
    <p>
      还要知道它的作用范围：easycom 默认覆盖 <code>src/components</code> 下的规范路径，以及 <code>uni_modules</code> 下的规范组件路径，这些都能免 <code>import</code> 直接用。
    </p>
    <div class="lesson-box warn">
      <strong>一个容易误解的点：</strong>easycom 只解决「自动引入」，<strong>不解决组件接口</strong>。组件的 <code>props</code>、事件、插槽仍然要在组件内部自行声明——它替你省的是那行 <code>import</code>，不是组件的功能定义。
    </div>
    <p>
      那到底选 easycom 还是手动 <code>import</code>？判据其实很清楚：<strong>高频、跨页复用、又符合目录规范</strong>的组件，交给 easycom；<strong>只在个别页面用</strong>，或目录结构特殊不愿迁就约定的，手动 <code>import</code> 更直接；对包体极度敏感、组件又很少时，手动引入反而更可控。
    </p>

    <h2>免引入组件按需加载</h2>
    <figure class="lesson-figure">
      <figcaption>点课程卡片切换收藏，注意页面模板里直接写了 <code>&lt;course-card&gt;</code> 却没有 <code>import</code>——easycom 按 <code>components/组件名/组件名.vue</code> 的目录约定把它自动加载了进来。</figcaption>
      <U09Easycom />
    </figure>

    <h2>引入方式改为目录约定</h2>
    <p>
      easycom 把「引入组件」从每个页面的样板代码，变成了一条目录约定：路径对了，标签就能直接用，还能按需打包。它的前提是命名一致，例外交给 <code>pages.json</code> 里的 <code>custom</code> 正则；不满足约定、或只在少数页面用到的组件，手动引入依然更划算。
    </p>
    <div class="lesson-term">
      <span class="term-name">「easycom」</span>uni-app 的组件自动引入机制：组件只要放在 <code>components/组件名/组件名.vue</code>，模板中即可直接使用 <code>&lt;组件名&gt;</code>，无需 <code>import</code> 与注册，框架在编译时将命中的组件按需异步加载。边界：默认只匹配「目录名 = 文件名 = 标签名」的约定，其他结构需在 <code>pages.json</code> 的 <code>easycom.custom</code> 用正则自定义；它只负责引入，组件的 props 与事件仍需自行声明。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
