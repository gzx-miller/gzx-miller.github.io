<script setup lang="ts">
import V17DependencyPrebundle from './V17DependencyPrebundle.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把某个依赖升级了一个版本，<code>package.json</code> 和 lockfile 都改过了，重启开发服务器——行为还是旧的。你翻遍业务代码也找不到线索，最后抱着试试看的心态删掉整个 <code>node_modules/.vite</code>，一重启，新版本生效了。明明依赖变了，Vite 为什么没察觉？
    </div>

    <h2>预构建缓存代价</h2>
    <p>
      上一课你已经知道：预构建把依赖转成 ESM 合并成单文件，是为了让开发服务器快。但「快」是有代价的——它把结果<strong>缓存</strong>下来复用，而不是每次启动都重算。缓存一旦存在，就必须回答一个问题：这份产物还代表当前的依赖吗？
    </p>
    <p>
      如果每次启动都重算，冷启动永远慢，「预构建」的意义也就没了；如果永远信任缓存，依赖升级了却读到旧产物，就会像开场那样「改了没生效」。于是核心问题不是「怎么预构建」，而是<strong>怎么判断一份预构建缓存还能不能用</strong>。
    </p>

    <h2>指纹比对机制</h2>
    <p>
      最直接的想法：把产物写进 <code>node_modules/.vite</code>，同时记一份说明，启动时比对说明和当前情况，一致就跳过预构建。
    </p>
    <p>
      这个方案做对了一件事：<strong>它让第二次启动不必重算</strong>。开销被一次性付掉，后续启动直接读现成的文件。
    </p>

    <h2>动态导入盲点</h2>
    <ul>
      <li>比对用的「说明」覆盖不全就会漏判：动态 <code>import()</code> 的依赖静态扫描发现不了，它压根不在缓存清单里，运行时才报 404。</li>
      <li>缓存是「要么整份有效、要么整份重算」，一条输入变了就全废，看不出是哪条引起的。</li>
      <li>既然缓存能长期有效，人就会误以为「改了就会生效」——手工改过的 <code>node_modules</code>、本地 <code>link</code> 的包根本不在比对范围内。</li>
      <li>启动变慢时，人第一反应是怀疑 CPU 或磁盘，很少想到是缓存失效后被反复重算。</li>
    </ul>

    <h2>依赖指纹构成</h2>
    <p>
      先补「缓存里到底存了什么」。<code>node_modules/.vite/deps/</code> 下每个依赖一个 <code>.js</code> 加一份 <code>.js.map</code>，另有一份 <code>_metadata.json</code>，记录当时的依赖列表与 hash、以及配置的指纹。启动时 Vite 拿当前情况算出指纹，和这份元数据一比：相同就跳过预构建，不同就整份重建。
    </p>
    <p>
      接着补「什么会让指纹变化」。这组输入就是缓存失效的条件，任一条变动都会作废整份缓存：
    </p>
    <ul>
      <li><code>package.json</code> 里的依赖列表变化。</li>
      <li>lockfile（<code>package-lock.json</code> / <code>yarn.lock</code> / <code>pnpm-lock.yaml</code>）变化。</li>
      <li><code>vite.config.ts</code> 中 <code>optimizeDeps</code> 配置变化。</li>
      <li><code>NODE_ENV</code>，以及配置文件里用到的 <code>VITE_</code> 环境变量变化。</li>
      <li>显式设置 <code>force</code> 或启动时加 <code>--force</code>。</li>
    </ul>
    <p>
      那为什么开场里依赖变了却还读到旧行为？因为指纹只覆盖它算进去的输入。手工改过的文件、本地 <code>link</code> 进来的包不在其中，这时唯一的办法就是<strong>强制重算</strong>。手动控制缓存有三种等价手段：删掉 <code>node_modules/.vite</code>、启动时 <code>vite --force</code>、或配置 <code>optimizeDeps.force = true</code>。
    </p>
    <p>
      再补「排障清单」。既然预构建的问题大多能归到「缓存」或「哪些依赖参与」两类，可以照症状对症：
    </p>
    <ol class="lesson-steps">
      <li>某个包运行时 404：多半是动态 <code>import()</code> 没被扫到，把它加进 <code>optimizeDeps.include</code> 强制预构建。</li>
      <li>CommonJS 包报 <code>require is not defined</code>：通常 esbuild 能自动转，个别包仍出错就加进 <code>include</code> 再试。</li>
      <li>启动太慢：先确认缓存是否有效（无效会被反复重算），再减少 <code>include</code> 里不必要的项。</li>
      <li>依赖更新没生效：优先 <code>--force</code> 或删缓存，先排除缓存因素再怀疑代码。</li>
    </ol>
    <p>
      最后补「monorepo 场景」。本地 <code>link</code> 的包不在依赖指纹的自然覆盖里，建议加入 <code>include</code> 强制预构建，并配上 <code>resolve.dedupe</code>，避免同一个依赖被打出多份实例。
    </p>
    <div class="lesson-box warn">
      <strong>两条容易踩的线：</strong><code>include</code> 里只能写第三方依赖，绝不能写 <code>src</code> 下的业务路径——预构建压根不处理业务源码；遇到「改了没生效」这类诡异现象，先 <code>--force</code> 重算一次，能排除一大半缓存问题，再回头看代码。
    </div>

    <h2>状态标签流转</h2>
    <figure class="lesson-figure">
      <figcaption>切 核心概念 / 构建流程 / 配置示例 / 交互演示 四个页签，在演示里点「重新预构建」，看每个依赖的状态从「已缓存」经「构建中」再回到「已缓存」，以及进度条与总大小的变化。</figcaption>
      <V17DependencyPrebundle />
    </figure>

    <h2>缓存失效判定</h2>
    <p>
      预构建快，是因为它把结果缓存了下来；缓存可信，是因为它记了一份指纹来比对。理解「哪些输入会让指纹失效」以及「哪些变化根本不在指纹里」，就握住了 <code>optimizeDeps</code> 的大部分排障钥匙——多数「改了没生效」，答案都是清缓存或 <code>--force</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「缓存失效（cache invalidation）」</span>指判断一份缓存是否还能代表当前真实输入的过程：命中就复用，失效就重建。Vite 用依赖列表、lockfile、<code>optimizeDeps</code> 配置、<code>NODE_ENV</code> 等一组输入来判定预构建缓存是否有效。边界：失效判断只覆盖它<strong>算进去</strong>的输入，手工改动的 <code>node_modules</code>、本地 <code>link</code> 的包都不在其中，所以「改了没生效」时强制重算才是第一诊断手段。
    </div>
  </LessonArticle>
</template>
