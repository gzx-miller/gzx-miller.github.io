<script setup lang="ts">
import C21CascadeLayers from './C21CascadeLayers.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只想把第三方 UI 库的按钮圆角改小一点，自己的样式写了三遍都被压过去，最后不得不加上 <code>!important</code>——为什么明明是「我的项目」，样式却说了不算？
    </div>

    <h2>提出问题</h2>
    <p>
      设想你在一个已经跑了一阵的课程后台里工作。项目引入了第三方 UI 库，又加了一套工具类，同时还有自己的组件样式。某天产品说：按钮圆角统一改成 8px。你写下 <code>.btn { border-radius: 8px }</code>，没生效；加一层父级变成 <code>.page .btn</code>，还是没生效；最后写成 <code>.page .btn.btn { border-radius: 8px !important }</code>，终于生效了。
    </p>
    <p>
      <strong>真正的代价在这里：下一次别人要改这个按钮，就得写得更长、加上更多 <code>!important</code> 才能压过你。</strong>更麻烦的是，你的样式能不能赢，往往并不由你决定——它取决于 CSS 文件在页面里的加载顺序，而顺序由打包工具和懒加载时机决定，会随着每一次构建、每一次路由切换而改变。也就是说，同一个项目换一次打包配置，颜色可能就变了，而没人改动过一行样式代码。
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的办法是提高特异性：往上叠选择器、叠类名，或者干脆用 <code>!important</code>。
    </p>
    <p>
      它确实做对了一件事：<strong>当规则被压住时，你手里一直有一个能立即生效的手段</strong>。在紧急修一个线上样式 bug 的时候，先加 <code>!important</code> 止血是合理的，它不该被完全否定——只是它属于「止血」，不属于「治疗」。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>特异性会变成军备竞赛：<code>.page .btn</code> 压不过 <code>.page .btn.btn</code>，谁想覆盖谁就写得更长，样式表越来越难读。</li>
      <li><code>!important</code> 会打乱整条层叠规则，一旦用了，后面的人也只能用 <code>!important</code> 去压它，层层加码。</li>
      <li>依靠书写顺序并不可靠：第三方库可能是异步加载进来的，加载时机一变，谁后声明就跟着变。</li>
      <li>工具类本应「一句顶一句」稳定压过组件样式，但在特异性相近时也压不住。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      换个思路：不去比谁的特异性更高，而是<strong>先把样式的层级关系一次性约定好，让优先级与书写顺序彻底解耦</strong>。这就是 <code>@layer</code>。用法很简单，先用一行声明层的先后：
    </p>
    <p>
      <code>@layer reset, base, components, utilities;</code>
    </p>
    <p>
      这一行规定了四个层的优先级：<strong>靠后声明的层优先级更高</strong>，所以 <code>utilities</code> 高过 <code>components</code>，<code>components</code> 高过 <code>base</code>，<code>base</code> 高过 <code>reset</code>。之后再往每个层里写规则：
    </p>
    <p>
      <code>@layer components { .btn { padding: 8px 16px; } }</code>，<code>@layer utilities { .m-0 { margin: 0; } }</code>
    </p>
    <p>
      关键差别在于：<strong>层与层之间比较的是层顺序，不再看选择器长短</strong>。只要把工具类放进 <code>utilities</code> 层，无论它写在 CSS 文件的前面还是后面、无论它用了多少个类名，它都稳定地压过 <code>components</code> 层。而在<strong>层内部</strong>，则照旧按常规层叠比较——特异性优先，同特异性看声明先后，你原来的直觉在层内依然成立。
    </p>
    <div class="lesson-box hint">
      一句话记法：<strong>未分层的样式优先级高于所有分层样式；分层之间按声明顺序，后者胜；层内则按常规层叠。</strong>把这三条背下来，绝大多数「为什么会这样」的疑问都能自己推出来。
    </div>
    <p>
      这条规则解释了两种常见现象。第一，<strong>没有放进任何层的样式，优先级高于全部 <code>@layer</code></strong>，所以组件里临时写的、没归层的样式总能盖住框架层——这既是便利，也是隐患。第二，想收拾第三方库，不必再去改它的源码或堆特异性，只要在引入时把它整体送进一个靠前的层：
    </p>
    <p>
      <code>@import 'third-party-ui.css' layer(vendor);</code>
    </p>
    <p>
      这样库的样式永远排在 <code>base</code>、<code>components</code> 之前，业务代码只要写进更靠后的层，就能干净地覆盖它。需要更细的粒度时，层还可以嵌套：<code>@layer components { @layer button { .btn { border-radius: 6px; } } }</code>，其中 <code>components.button</code> 是一个独立的子层，它比 <code>components</code> 自身更晚，因此可以稳定地覆盖组件层的通用按钮样式。
    </p>
    <div class="lesson-box warn">
      两个坑要记住。其一，<strong>层内的 <code>!important</code> 仍然会提升优先级</strong>，把它写进层里并不等于被驯服，务必谨慎。其二，调整 <code>@layer</code> 声明的先后会同时改变整组的相对优先级，所以要把层的顺序当成一份对外接口来对待，别随手插队。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>先看默认模式下多条规则谁赢，再切到 @layer 模式，观察 utilities 层的颜色始终胜出。</figcaption>
      <C21CascadeLayers />
    </figure>

    <h2>总结</h2>
    <p>
      <code>@layer</code> 要解决的不是「哪条规则更特别」，而是「谁该听谁的」这个问题本身。它用一行声明把 reset、base、components、utilities 的先后固定下来，让优先级与文件书写顺序、打包顺序脱钩；再配合 <code>@import ... layer(vendor)</code> 收纳第三方库，业务代码就不必再靠堆特异性和 <code>!important</code> 去硬拼。
    </p>
    <div class="lesson-term">
      <span class="term-name">「层叠层 @layer」</span>是 CSS 用来<strong>显式声明优先级顺序</strong>的机制。写法是先用 <code>@layer reset, base, components, utilities;</code> 声明层的先后，<strong>越靠后的层优先级越高</strong>；随后把规则分别写进各层。层之间只比层顺序、不比选择器特异性，层内仍按常规层叠比较。此外，<strong>未分层的样式优先级高于所有分层样式</strong>，而 <code>@import url(...) layer(vendor)</code> 可以把第三方库整体归入指定层。
    </div>
  </LessonArticle>
</template>
