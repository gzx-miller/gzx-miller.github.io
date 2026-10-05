const e=`<script setup lang="ts">
import T18Namespace from './T18Namespace.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>老项目里满屏都是 <code>Validation.StringValidator</code> 这样的写法，你想在新模块里改用 <code>import</code>，却在 <code>namespace</code> 与 ES 模块之间犹豫——这两套组织方式到底差在哪，什么时候该留、什么时候该换？
    </div>

    <h2>带前缀调用写法</h2>
    <p>
      你在接手一个历史项目，代码里到处是 <code>CourseApp.formatCourse(course)</code> 这类带前缀的调用，相关类型和函数被收进一个个命名空间里。团队准备新写一个模块，你按新习惯写了 <code>export</code>，却发现旁边就是一堆 <code>namespace</code>，两种风格摆在一起格外割裂。
    </p>
    <p>
      这背后是 TypeScript 的一段历史：<code>namespace</code> 出现得比 ES 模块标准在工具链里普及更早，它当时承担了「把一堆类型和函数收在一起、顺便避免命名冲突」的职责。而今天，<code>import</code> 与 <code>export</code> 早就是语言标准。搞不清两者的差别，就会在新代码里选错组织方式，也会在迁移旧代码时改出问题。
    </p>

    <h2>命名空间组织</h2>
    <p>
      最省事的做法：沿用现状，新代码也照着老代码用 <code>namespace</code> 组织——里面放接口、函数、常量，成员前面加 <code>export</code> 暴露给外部。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它把相关的声明聚成了一个带前缀的整体</strong>，同名类型不会再撞车，调用处一眼就能看出归属。在小范围、单个文件里，它简洁而自洽。
    </p>

    <h2>摇树优化失效</h2>
    <ul>
      <li><code>namespace</code> 会在运行时生成一个真实存在的对象，即使你只用到里面的类型——多出来的产物很难被摇树摇掉。</li>
      <li>ES 模块让每个文件自成作用域、依赖关系写在文件顶部；<code>namespace</code> 把东西挂在一起，依赖反而变得不透明。</li>
      <li>在新模块里混用 <code>namespace</code> 与 <code>import</code> / <code>export</code>，会让产物和语义都变混乱。</li>
      <li>它真正的定位是全局类型聚合；把它当日常模块系统使用，等于一直背着一套过时的约定。</li>
    </ul>

    <h2>模块与声明分工</h2>
    <p>
      不推翻「把相关声明聚在一起」这个诉求，而是<strong>按场景把它交给不同的工具</strong>：日常的代码组织交给 ES 模块，只有声明文件这类需要全局聚合的场合，才保留 <code>namespace</code>。
    </p>
    <p>
      先说 ES 模块为什么成为默认。每个文件就是一个模块、自带作用域，导出关系是静态的、写在文件顶部的——打包工具能顺着这些静态关系判断哪些导出没被用到，安全地摇掉。<strong>这正是 tree-shaking 成立的前提</strong>。而 <code>namespace</code> 生成的运行时对象恰好相反：工具很难判断它是否真的被使用，往往整块留下，产物里就多出一堆没人碰的代码。
    </p>
    <p>
      再看 <code>namespace</code> 仍然站得住脚的场合：声明文件。用 <code>declare namespace MyAPI</code> 把一组相关的接口与函数声明挂在同一个名字下，可以让全局环境里的类型聚合得清清楚楚。它还有两个特性值得知道：
    </p>
    <ul>
      <li><strong>声明合并</strong>：同名的 <code>namespace</code> 会自动把成员合并到一起，处理旧库或多文件声明时很好用。</li>
      <li><strong>import 别名</strong>：<code>import polygons = Shapes.Polygons</code> 这类写法能缩短深层命名空间的访问路径。</li>
    </ul>
    <p>
      迁移旧代码时，稳妥的顺序是「<strong>先保持导出形状不变，再逐步换成具名导出</strong>」：先让 <code>CourseApp.format</code> 这样的调用点原样可用，再一层层替换成 <code>import { format } from './course'</code>，而不是一次性大改。这样每一小步都能独立验证。
    </p>
    <div class="lesson-box hint">
      <strong>判断标准很简单：</strong>这段代码要不要在运行时真实存在？要，就用 ES 模块；只是给编译器看的全局类型聚合，才考虑 <code>namespace</code>。同一份新模块里不要两套并用。
    </div>
    <p>
      最后回到构建产物：迁移完成后要检查一遍打包结果，确认旧的 <code>namespace</code> 代码没有被误留成全局对象，也没有污染全局作用域。这一步不做，前面的迁移可能只是把问题从语法层面搬到了产物层面。
    </p>

    <h2>两种组织方式对比</h2>
    <figure class="lesson-figure">
      <figcaption>在 <code>namespace</code> 与 ES 模块两种写法之间切换，再分别运行，感受它们组织方式的差异。</figcaption>
      <T18Namespace />
    </figure>

    <h2>历史方案与标准</h2>
    <p>
      <code>namespace</code> 是 TypeScript 发展早期的模块组织方式，会在运行时留下对象、支持声明合并；ES 模块是 JavaScript 标准，静态关系清晰、对 tree-shaking 友好。新代码统一用 ES 模块，<code>namespace</code> 只保留在声明文件与旧代码里——这条界线划清了，组织方式就不会再纠结。
    </p>
    <div class="lesson-term">
      <span class="term-name">「命名空间与模块」</span>指两种组织声明的方式。<code>namespace</code> 是 TypeScript 特有语法，成员需 <code>export</code> 才能被外部访问，同名会自动<strong>声明合并</strong>，且可能生成运行时全局对象；ES 模块是语言标准，每文件一作用域、依赖显式、便于 tree-shaking。实践原则：新代码一律用 ES 模块，<code>namespace</code> 留给声明文件与迁移中的旧代码，且用 <code>import</code> 别名缩短深层路径。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
