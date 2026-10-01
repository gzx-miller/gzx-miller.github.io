<script setup lang="ts">
import N01ProjectStructure from './N01ProjectStructure.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你克隆下一个 Nuxt 项目，想找它的入口：没有 <code>main.js</code>，没有 <code>App.vue</code>，也翻不到任何写着 <code>path: '/about'</code> 的路由配置——可它照样跑了起来，页面一个不少。这些「接线」代码，究竟是谁写的？
    </div>

    <h2>手工接线代码负担</h2>
    <p>
      在一个普通 Vue 单页应用里，应用长什么样、有哪些页面、组件从哪来，全靠手写的接线代码交代：<code>main.js</code> 里 <code>createApp</code> 挂载，<code>router/index.ts</code> 里一条条注册路由，每个页面顶部再 import 上它用到的组件。这些代码本身不产出任何业务价值，却必须有人写、有人维护。
    </p>
    <p>
      麻烦的是，这些成本会随着项目变大而放大。新增一个页面要同时改文件和路由表，漏一处就 404；组件路径越深，<code>../../../components/</code> 这样的 import 越容易写错；新人想搞清一个功能的落点，得顺着一串 import 才能摸到源头。于是问题变成：<strong>能不能让「文件放在哪个目录」本身就说明「它是干什么的」，把人从接线里解放出来？</strong>
    </p>

    <h2>目录约定文档化</h2>
    <p>
      最省事的做法：目录照样自己定，只是把规矩写进 README——页面放 <code>pages/</code>、组件放 <code>components/</code>、工具放 <code>utils/</code>，接线代码还是手写，但位置照着文档来。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它承认「目录结构应当表达职责」</strong>。放对位置的文件，别人一眼能猜到它是页面还是组件。要说问题，就出在「规矩」两个字上——它是纸面的，不是机器执行的。
    </p>

    <h2>构建期不校验目录</h2>
    <ul>
      <li>README 不参与构建：新人把页面文件误放进 <code>components/</code>，构建不会报错，直到有人访问发现 404，才知道位置放错了。</li>
      <li>每个项目都要重新定义一套目录规矩，彼此不通用，换一个项目就得重新学一遍布局。</li>
      <li>接线代码仍要手写：目录一改名，路由表、import 路径都得跟着同步改，容易漏。</li>
      <li>「文档说该这么放」和「代码确实这么放」是两套东西，时间一长必然漂移。</li>
    </ul>

    <h2>固定目录扫描机制</h2>
    <p>
      不推翻「用目录表达职责」，而是把口头约定变成框架亲自执行的规则：Nuxt 在启动时扫描一批<strong>名字固定</strong>的目录，每个目录绑定一项明确职责，文件放进去就自动生效，不需要任何中心化的注册文件。
    </p>
    <ol class="lesson-steps">
      <li><code>pages/</code> 下的 <code>.vue</code> 文件自动映射为路由，目录层级就是路径层级。</li>
      <li><code>components/</code> 下的组件自动全局注册，模板里可直接用；<code>composables/</code> 与 <code>utils/</code> 下的导出自动完成 import。</li>
      <li><code>layouts/</code> 放布局模板，<code>plugins/</code> 放插件（文件名即执行顺序），<code>middleware/</code> 放路由中间件。</li>
      <li><code>server/</code> 交给 Nitro 扫描，其中 <code>api/</code> 与 <code>routes/</code> 自动注册为服务端路由。</li>
      <li>静态资源分两处：<code>public/</code> 下的文件按根路径直接访问，<code>assets/</code> 下的资源需经构建处理，用 <code>~/assets/</code> 引用。</li>
    </ol>
    <p>
      「自动生效」的底气来自一个构建步骤：Nuxt 在构建时扫描这些约定目录，把自动导入的内容写进 <code>.nuxt/</code> 下的类型声明文件，编辑器于是能提示、类型也能对上——这也是为什么你从不写 import，代码却依然有智能补全。（这套扫描与命名规则的细节较多，留到「自动导入」那一课展开。）
    </p>
    <p>
      约定之外的东西也被归拢到了一处：<code>nuxt.config.ts</code>。它集中声明模块（<code>modules</code>）、全局样式（<code>css</code>）、全局 head（<code>app.head</code>）、服务端引擎（<code>nitro</code>）与运行时配置（<code>runtimeConfig</code>）。想整体换一种源码组织方式，用它的一项 <code>srcDir</code> 就够了——写成 <code>srcDir: 'src/'</code>，源码全部移进 <code>src/</code>，而 <code>pages/</code>、<code>components/</code> 这些约定名保持不变。
    </p>
    <div class="lesson-box hint">
      <strong>动手前先查内置：</strong>Nuxt 已经把大量能力做成自动导入的内置函数，例如服务端引擎里的 <code>h3</code>、数据获取的 <code>useFetch</code>。决定装一个依赖之前，先确认是不是已经有内置方案，免得重复造轮子、徒增包体积。
    </div>

    <h2>四类目录职责对照</h2>
    <figure class="lesson-figure">
      <figcaption>在「目录约定 / 自动导入 / 核心配置」三个页签间切换，逐张对照每个目录的职责，以及 nuxt.config.ts 里的核心配置项。</figcaption>
      <N01ProjectStructure />
    </figure>

    <h2>结构契约与集中配置</h2>
    <p>
      这一课讲的其实是把「目录」升级成「契约」：文件放进约定目录，框架就替你做掉路由、导入、注册这些接线工作，只留下 <code>nuxt.config.ts</code> 一处集中配置。于是「东西放哪」和「它怎么生效」第一次成了同一件事。
    </p>
    <div class="lesson-term">
      <span class="term-name">「约定优于配置」</span>指框架预先给出一套默认的目录名与命名规则，符合约定即零配置生效，只有当你决定偏离约定时才需要显式配置。Nuxt 里 <code>pages/</code>、<code>components/</code>、<code>layouts/</code> 等目录名就是这套约定；改动约定目录之外的结构（如把源码整体移进 <code>src/</code>）才用 <code>nuxt.config.ts</code> 显式声明。
    </div>
  </LessonArticle>
</template>
