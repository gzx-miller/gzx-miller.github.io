const e=`<script setup lang="ts">
import V20LibraryMode from './V20LibraryMode.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你的组件库发到了 npm，同事只想用其中的一个 <code>Button</code>。他写下 <code>import { Button } from '@my-org/ui-lib/button'</code>，Vite 当场报 <code>Failed to resolve entry for package</code>——<code>button</code> 明明就在包里，为什么这个子路径解析不了？
    </div>

    <h2>按需引入子路径</h2>
    <p>
      你已经知道库要一次输出多种格式、把 <code>vue</code> 外部化。可一个库长大后会被拆成很多块，使用者往往只想按需引其中一小片；而安装到别人机器上时，构建工具手里只有一个包名，它得靠 <code>package.json</code> 的字段决定「这个路径该去取哪个文件」。
    </p>
    <p>
      如果只产出「整包一个入口」，人要付出的隐藏成本是：使用者没法按子路径引，只能整包引入再指望 Tree Shaking 兜底，包一大就救不回来；多种格式的文件名和入口字段对不上，使用方一装就报「找不到模块」；框架依赖没声明清楚，使用方可能重复安装甚至整出多实例；发布时没配清单，源码、测试、配置一起被推上 npm。于是问题落在：<strong>怎么让一个包的产物能被「按入口、按格式、按依赖关系」正确地引用？</strong>
    </p>

    <h2>单入口输出局限</h2>
    <p>
      最直接的做法：用 <code>build.lib</code> 配一个入口、几样格式，把 <code>dist</code> 发出去。
    </p>
    <p>
      这个方案做对了一件事：<strong>库变成了一个可以被安装的包</strong>，整包 <code>import</code> 这一条路是通的。
    </p>

    <h2>子路径解析失败</h2>
    <ul>
      <li>子路径不可达：包里只有整包入口，<code>@my-org/ui-lib/button</code> 这类路径找不到任何文件，于是报 <code>Failed to resolve entry</code>。</li>
      <li>条件导出缺失：<code>exports</code> 没写，Node 与现代打包器只能回退到 <code>main</code> / <code>module</code>，取到的格式可能和当前运行环境对不上。</li>
      <li><code>external</code> 只做了一半：它让 <code>vue</code> 不进产物，可使用方要是根本没装 <code>vue</code>（或装了个错版本），运行时还是一样找不到。</li>
      <li>发布清单失控：没配 <code>files</code>，<code>src</code>、测试、配置文件全被打进包里，体积和暴露面都白白变大。</li>
    </ul>

    <h2>对象式入口映射</h2>
    <p>
      先补「多入口」。<code>build.lib.entry</code> 除了传字符串，还可以传一个对象，<strong>键名就是入口名、也就是子路径名</strong>——比如 <code>index</code> 指向主入口、<code>button</code> 指向 <code>Button</code> 的入口文件。再配一个 <code>fileName(format, entryName)</code>，让每个入口按各自格式产出自己的文件（如 <code>button.mjs</code> / <code>button.cjs</code>）。这样 <code>./button</code> 这条子路径就有实体文件可指了。
    </p>
    <p>
      接着补「条件导出把入口和子路径串起来」。<code>package.json</code> 的 <code>exports</code> 用条件映射，把每条路径对应到正确的文件：<code>"."</code> 同时给出 <code>import</code> / <code>require</code> / <code>types</code>，<code>"./button"</code> 指向对应的 <code>.mjs</code> 与 <code>.cjs</code>，<code>"./style.css"</code> 指向样式文件。这里有个顺序要求：<code>types</code> 条件要写在前面，否则 TypeScript 解析不到类型。
    </p>
    <p>
      再补「<code>external</code> 与 <code>peerDependencies</code> 是一对」。<code>external</code> 让框架依赖不进产物，避免多实例；<code>peerDependencies</code> 声明它「由使用方提供、版本范围是这些」——两者必须配套：只 <code>external</code> 不声明，使用方可能不知道要装；只声明不 <code>external</code>，包又会自带一份。UMD 场景还要在 <code>output.globals</code> 里把模块名映射成全局变量名。
    </p>
    <p>
      再补「CSS 与类型声明也是产物」。库的 CSS 会单独产出一个文件，可以用 <code>assetFileNames</code> 把它重命名成 <code>index.css</code> 并把路径写进文档；类型声明 Rollup 不会自动生成，要用 <code>vite-plugin-dts</code> 产出 <code>.d.ts</code>，并让 <code>exports</code> 的 <code>types</code> 指过去。为什么强调这两样？因为使用者看不到你的源码，只能靠「入口文件 + 类型 + CSS 路径」这三张路标找到路。
    </p>
    <p>
      最后补「发布前用 <code>npm pack</code> 验收」。它会打出 tar 包但不真正发布，正好用来先看一眼<strong>究竟会发出去哪些文件</strong>；再用 <code>files: ["dist"]</code> 把范围收干净；把构建、类型检查、打包串进 <code>prepublishOnly</code> 钩子，避免把一个没构建或类型有错的版本推上去。
    </p>
    <div class="lesson-box warn">
      <strong>两条必守的线：</strong><code>external</code> 管「不打包」，<code>peerDependencies</code> 管「由谁提供」，缺一个都会出问题；<code>exports</code> 的 <code>types</code> 条件要放在 <code>import</code> / <code>require</code> 之前，而且没有在 <code>exports</code> 里登记的子路径，使用者根本 import 不进来。
    </div>

    <h2>多格式构建演示</h2>
    <figure class="lesson-figure">
      <figcaption>切 输出格式 / 配置示例 / package.json / 构建演示 四个页签；点「开始构建」，看 <code>dist</code> 里依次产出 ES / CJS / UMD 三种格式、样式文件与类型声明，并留意发布流程的五步。</figcaption>
      <V20LibraryMode />
    </figure>

    <h2>条件导出映射</h2>
    <p>
      发布一个库的难点不在写代码，而在把「产物如何被引用」交代清楚：多入口让子路径可达，<code>exports</code> 把每条路径与条件映射到正确文件，<code>external</code> 加 <code>peerDependencies</code> 把框架依赖交还给使用方，<code>files</code> 与 <code>prepublishOnly</code> 保证发出去的是一份构建过、清单干净、带类型的产物。库不是应用，它的产物要服务于你见不到的使用者。
    </p>
    <div class="lesson-term">
      <span class="term-name">「条件导出（conditional exports）」</span>指 <code>package.json</code> 的 <code>exports</code> 字段用 <code>import</code> / <code>require</code> / <code>types</code> 等条件，为同一条模块路径指定不同文件，让 ESM 与 CJS 环境各取所需。边界：条件的匹配是<strong>从上到下、先命中先返回</strong>，所以 <code>types</code> 必须写在 <code>import</code> / <code>require</code> 之前；一旦声明了 <code>exports</code>，未列入其中的路径将不再可达，任何子路径都必须显式登记。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
