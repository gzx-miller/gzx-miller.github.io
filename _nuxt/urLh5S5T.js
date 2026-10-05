const n=`<script setup lang="ts">
import K24PluginDev from './K24PluginDev.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>好几个项目都需要同一套「通知提示」能力，难道每个项目都要把注册代码再抄一遍、每个组件都要手动 import 同一个工具函数？
    </div>

    <h2>全局提示能力</h2>
    <p>
      你们团队沉淀了一套通知提示：要有一个全局可用的提示组件，还要能在任意组件里调一句方法就弹出提示。新项目一开工，你就得把组件、方法、注册步骤再搬一遍。做得多了会发现，真正麻烦的不是功能本身，而是「怎么把它干净地装进一个应用」，并且还能按项目传不同配置，比如前缀是「通知」还是「系统」。
    </p>
    <p>
      你需要的是一个<strong>可复用的装配单元</strong>：一次写好，在任何 Vue 应用里用一句话装上，装完就能全局使用。
    </p>

    <h2>导入复用与全局挂载</h2>
    <p>
      最朴素的复用方式有两种：把提示工具函数抽成一个模块，谁用谁 <code>import</code>；或者干脆在每个项目里各写一遍注册代码，把提示组件挂到全局，再往全局属性上塞一个方法。
    </p>
    <p>
      这个做法做对了一件事：<strong>能力本身确实被复用了</strong>。工具函数只有一份，逻辑不再重复实现，功能上没有问题，小项目里也跑得通。
    </p>
    <p>
      顺带说一句，这类「抄一遍」的代价往往不在第一次，而在第二十次：只要哪一步顺序记错，或者忘了传配置，问题就会在最不该出的时候冒出来，而排查的人还得先读懂一遍注册代码。
    </p>

    <h2>注册逻辑散落</h2>
    <ul>
      <li>「注册」这件事没有归口：全局组件、全局方法、配置散落在各项目的入口文件里，抄一遍就容易漏一步。</li>
      <li>靠 <code>import</code> 拿到工具函数，每个组件都要多一行引入，也失去了「应用级统一装配」的机会。</li>
      <li>想按项目传不同配置（前缀、超时时间）时，没有合适的地方接收这些选项。</li>
      <li>直接往 <code>app.config.globalProperties</code> 挂方法，类型不安全，模板里用起来还得靠约定。</li>
    </ul>

    <h2>插件容器与安装</h2>
    <p>
      不推翻「复用」，而是给复用加一个正式的容器：<strong>插件</strong>。Vue 插件就是一个带有 <code>install</code> 方法的对象，当你调用 <code>app.use(plugin)</code> 时，Vue 会自动调用这个 <code>install</code> 方法。所有「装进应用」的动作都收进这一个入口，谁要用，谁就 <code>app.use</code> 一次。
    </p>
    <p>
      <code>install</code> 会收到应用实例和可选配置两部分。于是它可以做几件事：注册全局组件（<code>app.component</code>）、注册全局指令（<code>app.directive</code>），或者通过 <code>app.provide</code> 把方法注入进去。组件那边则用 <code>inject</code> 把它取出来使用——<strong>这一步是推荐做法</strong>，因为相比直接挂到全局属性上，<code>provide / inject</code> 的类型更安全，配合 <code>InjectionKey</code> 还能保证提供方与使用方的类型一致。
    </p>
    <ol class="lesson-steps">
      <li>定义插件对象，实现 <code>install(app, options)</code> 方法。</li>
      <li>在 <code>install</code> 中注册全局组件、指令，或通过 <code>app.provide</code> 注入方法。</li>
      <li>在入口用 <code>app.use(plugin, options)</code> 安装插件，配置通过第二个参数传入并支持默认值。</li>
      <li>组件中通过 <code>inject</code> 获取插件提供的能力，无需再手动 import。</li>
    </ol>
    <p>
      这里有个容易被忽略的细节：插件在 <code>install</code> 里注册的能力是<strong>应用级</strong>的——它挂在应用实例上，而不是某个组件上。这意味着它天然适合承载「几乎所有页面都要用」的东西：请求封装、埋点、国际化、权限指令。反过来，只服务单个页面的逻辑就不该塞进插件，否则会把应用级的公共面越撑越大，反而让「全局」失去分寸。
    </p>
    <div class="lesson-box hint">
      <strong>选型提示：</strong>优先用 <code>provide / inject</code> 交出能力，而非 <code>app.config.globalProperties</code>，前者类型更安全；注入 key 用 <code>InjectionKey</code> 声明，能保证提供方与使用方的类型一致；配置通过 <code>install</code> 的第二个参数传入，并给出合理默认值。
    </div>
    <p>
      之所以说这是「正式方案」，还有一个佐证：你熟悉的那些库——路由、状态管理、组件库——<strong>都是通过插件机制注册的</strong>。你只是用同样一套约定，把自己的能力包装成了它们中的一员。
    </p>

    <h2>注入方法与调用</h2>
    <figure class="lesson-figure">
      <figcaption>点不同按钮发送通知，看插件注入的方法如何在组件里被直接调用。</figcaption>
      <K24PluginDev />
    </figure>

    <h2>应用级能力装配</h2>
    <p>
      插件的价值不在「多了一个 API」，而在于它给「一套能力如何装进应用」定了统一的套路：一个带 <code>install</code> 的对象，一次 <code>app.use</code> 完成注册，配置从第二个参数进来，能力用 <code>provide / inject</code> 交出。当你也想沉淀一份跨项目复用的全局能力时，插件就是那个正确的容器。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Vue 插件」</span>指一个带有 <code>install</code> 方法的对象，通过 <code>app.use()</code> 安装时 Vue 会自动调用它。它接收应用实例与可选配置，可以注册全局组件、指令，或通过 <code>app.provide</code> 注入全局能力，组件再用 <code>inject</code> 取用。优先使用 <code>provide / inject</code> 而非 <code>app.config.globalProperties</code>，前者类型更安全；Router、Pinia 等库都是通过插件机制注册的。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
