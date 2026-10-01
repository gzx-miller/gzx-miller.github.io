<script setup lang="ts">
import V06Assets from './V06Assets.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写 <code>&lt;img :src="'./assets/' + name + '.png'"&gt;</code> 按名字动态切图，本地开发张张正常；构建上线后全部变成裂图——因为产物里的文件名已经变成了 <code>logo.2d3a5b1c.png</code>，而你的字符串还停在 <code>logo.png</code>。
    </div>

    <h2>文件到网址转换</h2>
    <p>
      图片、字体、favicon 这些静态资源，在你的源码里是「文件」，交给浏览器时却必须变成「URL」。开发阶段 Vite 直接按源码路径把文件喂给浏览器，所见即所得；可生产构建之后，文件可能被复制到别的目录、被重命名、被压缩，甚至被整个内联进 JS。
    </p>
    <p>
      于是同一份资源，在「源码里的路径」和「最终产物的 URL」之间裂开了一道鸿沟。如果资源全交给人工维护——手动拷进某个目录、手写最终路径——你必须替构建工具记住三件事：<strong>每个文件最后会叫什么名字、放在哪个目录、以文件还是内联的形式存在</strong>。任何一件记错，就是开头那样的 404。所以真正的问题是：当你只写了一句资源引用，究竟由谁来决定它最终的名字、位置和存在形式？
    </p>

    <h2>公共目录引用</h2>
    <p>
      最省事的做法：把所有图片、图标统统丢进 <code>public/</code> 目录，代码里一律用绝对路径引用，比如 <code>/logo.png</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>URL 完全稳定、完全由人掌控</strong>。你在源码里写什么地址，产物里就是什么地址，中间不经过任何加工，脑子里的路径和浏览器的路径永远一致。
    </p>

    <h2>缓存命中旧图</h2>
    <ul>
      <li>改图不生效：新版 <code>logo.png</code> 覆盖旧文件后文件名没变，浏览器和 CDN 仍命中旧缓存，用户看到的还是旧图。</li>
      <li>体积失控：几百 KB 的大图和 1KB 的小图标都得各发一次请求，想让小图标省掉请求也做不到。</li>
      <li>构建工具「看不见」它：public 里的文件不参与模块图，不会被压缩、内联或 Tree Shaking；文件名写错了构建期不报错，上线才 404。</li>
    </ul>

    <h2>资源导入改造</h2>
    <p>
      先补第一层：让构建工具接管资源。改用 <code>import</code> 导入，例如 <code>import logo from './assets/logo.png'</code>。导入之后资源被纳入模块图，Vite 会按文件<strong>内容生成哈希文件名</strong>（如 <code>logo.2d3a5b1c.png</code>）再输出，并把最终 URL 返回给你的变量。内容一变文件名就变，缓存天然被绕过；反过来内容不变文件名就不变，可以放心为产物设置长期强缓存。这是引用资源的第一选择。
    </p>
    <p>
      接着补第二层：小资源内联。每次引用一个小图标都发一次请求，图标一多首屏就是几十次请求。于是 Vite 设了一个阈值 <code>assetsInlineLimit</code>（默认 <code>4096</code> 字节，即 4KB）：<strong>小于阈值的资源会被内联成 base64 data URL</strong>，直接嵌进 JS/CSS，省掉一次请求。但内联不是白捡的——base64 会让体积增大约 33%，而且没法单独缓存，所以大图不该走这条路。
    </p>
    <p>
      再补第三层：给单个资源显式指定处理方式，覆盖默认阈值。在导入后缀上标注即可：
    </p>
    <ol class="lesson-steps">
      <li><code>?url</code>：强制返回 URL，即使小于阈值也不内联。</li>
      <li><code>?inline</code>：强制内联，即使大于阈值也内联。</li>
      <li><code>?raw</code>：不当作资源，直接作为字符串把文件内容读进来。</li>
      <li><code>?worker</code>：作为 Web Worker 导入。</li>
    </ol>
    <p>
      最后一层是「分家住」，也是开头那个 404 的正解。public 不是被淘汰，而是有了明确分工：<strong>它只适合 favicon、robots.txt 这类「不常变更、不参与构建、必须待在根路径」的文件</strong>，原样复制到 dist 根目录，引用时必须写绝对路径 <code>/favicon.ico</code>；其余资源一律放 <code>src/assets</code> 走 import。此外，静态导入图片要有类型提示，需在 <code>vite-env.d.ts</code> 中声明资源模块类型（引入 <code>vite/client</code> 即可）。
    </p>
    <div class="lesson-box warn">
      <strong>两条容易踩的线：</strong>base64 内联会让体积涨约 33% 且无法独立缓存，大图务必让它走 URL 而不是内联；public 目录里的文件名写错了构建期不会报错，上线才 404，引用时必须写绝对路径且拼写完全一致。
    </div>

    <h2>三类资源处理</h2>
    <figure class="lesson-figure">
      <figcaption>切 import / public / inline 三个页签，分别看三种资源处理方式在源码里怎么写、构建后的路径和形式会发生什么变化。</figcaption>
      <V06Assets />
    </figure>

    <h2>可见资源优先</h2>
    <p>
      静态资源的取舍可以收成一句话：<strong>能被构建工具看见的（import）优先，看不见的（public）只留给必须放根路径的少数文件，小到不值得一次请求的（内联）才内联</strong>。哈希命名负责缓存，阈值负责请求数，分工清楚之后，路径 404 和「改图不生效」就都消失了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「内容哈希」</span>指 Vite 用文件<strong>内容</strong>算出的短哈希拼进产物文件名（如 <code>logo.2d3a5b1c.png</code>）。内容不变则哈希不变，内容一变哈希就变，因此可以安全地为产物设置长期强缓存。边界：哈希依赖资源被 <code>import</code> 走构建管线，<code>public</code> 目录里的文件原样复制、没有哈希，缓存策略要自己管。
    </div>
  </LessonArticle>
</template>
