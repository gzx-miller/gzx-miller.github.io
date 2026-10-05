const e=`<script setup lang="ts">
import V07PreBundle from './V07PreBundle.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你 <code>npm install lodash</code> 后写下 <code>import debounce from 'lodash/debounce'</code>，本地一刷新直接白屏，控制台甩出一句 <code>require is not defined</code>——浏览器明明支持 ESM，为什么一个正常安装的包会当场崩掉？
    </div>

    <h2>依赖格式转换</h2>
    <p>
      浏览器只认 ESM，而 npm 上大量包是用 CommonJS/UMD 写的——它们内部用的是 <code>require</code> 和 <code>module.exports</code>，浏览器不认识。麻烦还不止格式：很多包内部被拆成了成百上千个小模块（比如 <code>lodash-es</code> 一个函数一个文件），就算格式没问题，浏览器也得为它们发起成百上千次请求。
    </p>
    <p>
      如果退回「把依赖整体打包」的老办法，人要付出的隐藏成本是：每次冷启动都要<strong>重新打包整个依赖图</strong>，项目越大启动越慢；任何一个文件改动都要重新构建，热更新的延迟随依赖规模一起增长。于是问题变成：能不能既保留原生 ESM 的按需加载，又同时避开 CommonJS 和模块碎片这两个坑？
    </p>

    <h2>启动期依赖转译</h2>
    <p>
      最直接的想法：启动时先把 <code>node_modules</code> 里的依赖统一「翻译」一遍，用极快的 esbuild 把 CommonJS/UMD 统统转成 ESM。
    </p>
    <p>
      这个方案做对了一件事：<strong>让浏览器有办法加载任何来源的包</strong>，无论它是 CommonJS 还是 UMD，转换之后都能当作标准 ESM 被 <code>import</code> 进来。
    </p>

    <h2>模块碎片化请求</h2>
    <ul>
      <li>只转格式不够：<code>lodash-es</code> 内部几百个文件转完还是几百个，浏览器仍要发几百次请求，Network 面板像瀑布一样往下排，首屏照样慢。</li>
      <li>每次启动都跑一遍，冷启动并没有变快，只是把代价从「打包业务源码」转移到了「处理依赖」。</li>
      <li>动态 <code>import()</code> 的路径是运行时拼出来的，静态扫描发现不了，运行时才报 404。</li>
      <li>有些包本就是规整 ESM、模块又少，硬走一遍预构建反而多此一举。</li>
    </ul>

    <h2>合并与缓存复用</h2>
    <p>
      先补「格式化」。预构建的第一件事确实是格式转换：esbuild 把 CommonJS/UMD 转成浏览器能直接加载的 ESM，<code>require is not defined</code> 就此消失。
    </p>
    <p>
      接着补「合并」。光转格式治不了模块碎片，于是预构建会把一个依赖的<strong>众多内部模块合并成单个文件</strong>——<code>lodash-es</code> 的几百个文件被打成一个 <code>lodash-es.js</code>，浏览器一次请求就拿到全部。这正是「100+ 次请求变成 1 次」背后的机制。
    </p>
    <p>
      再补「缓存」。每次都重新合并显然是浪费，于是 Vite 把预构建产物<strong>带 hash 缓存在 <code>node_modules/.vite/deps/</code></strong>。启动时它算一遍依赖指纹，与缓存里的元数据比对，一致就直接复用，跳过预构建。指纹会覆盖依赖与配置的变化，任一变动即整份失效重算：
    </p>
    <ul>
      <li><code>package.json</code> 里的依赖列表变化。</li>
      <li>lockfile（<code>package-lock.json</code> / <code>yarn.lock</code> / <code>pnpm-lock.yaml</code>）变化。</li>
      <li><code>vite.config.ts</code> 中 <code>optimizeDeps</code> 配置变化。</li>
      <li><code>NODE_ENV</code> 变化。</li>
    </ul>
    <p>
      需要手动放弃缓存时，删掉 <code>node_modules/.vite</code> 或启动时加 <code>vite --force</code> 即可强制重建。
    </p>
    <p>
      再往下补「谁来预构建」。默认 Vite 会扫描源码里的 import 自动发现依赖，但动态 <code>import()</code> 的路径是拼出来的，扫不到——这类依赖要手动加进 <code>optimizeDeps.include</code> 强制预构建，否则运行时 404。反向地，本来就是规整 ESM、模块又少的包，可以用 <code>optimizeDeps.exclude</code> 排除，省掉一次没必要的预构建。
    </p>
    <div class="lesson-box warn">
      <strong>两条边界：</strong>预构建只处理<strong>第三方依赖</strong>，业务源码不参与，所以 <code>include</code> 里绝不能写 <code>src</code> 下的路径；产物是带 hash 的缓存，依赖升级或行为诡异时，先把 <code>node_modules/.vite</code> 删掉再重启，能排除一大半「改了没生效」的怪问题。
    </div>

    <h2>预构建动机与配置</h2>
    <figure class="lesson-figure">
      <figcaption>切 why / config / esbuild 三个页签，看预构建为什么必要、在 <code>optimizeDeps</code> 里怎么配置，以及底层的 esbuild 还能做哪些转换。</figcaption>
      <V07PreBundle />
    </figure>

    <h2>开发期依赖预处理</h2>
    <p>
      依赖预构建是开发服务器为第三方依赖做的一次性「预处理」：用极快的 esbuild 把 CommonJS 转成 ESM、把碎片模块合并成单文件，再把结果按 hash 缓存起来供后续启动复用。它只服务于开发阶段的加载效率，业务源码不参与，生产构建也不走这条路。
    </p>
    <div class="lesson-term">
      <span class="term-name">「依赖预构建」</span>指首次启动时用 esbuild 把 <code>node_modules</code> 中的依赖转成 ESM 并合并成单个文件，产物缓存在 <code>node_modules/.vite</code>。它既解决了 CommonJS/UMD 无法被浏览器加载的问题，也压掉了海量模块请求。边界：<strong>只处理第三方依赖</strong>、不处理业务源码；缓存随依赖与配置的 hash 失效，异常时用 <code>--force</code> 或删除缓存强制重建。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
