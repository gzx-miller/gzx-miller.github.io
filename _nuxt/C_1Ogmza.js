const t=`<script setup lang="ts">
import SC13AtRoot from './SC13AtRoot.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我在 <code>.dashboard .panel</code> 里写了一条「暗色主题下换 widget 边框」的规则，心里想要的是 <code>.theme-dark .widget</code>，编译出来却是 <code>.dashboard .panel .theme-dark .widget</code>——一条本该站在最外层的规则，凭什么被嵌套一路拖进了组件里？
    </div>

    <h2>嵌套与默认归属</h2>
    <p>
      嵌套是 Sass 最讨人喜欢的能力：把父子关系写在一起，读起来像 DOM 结构。但它背后藏着一条默认假定——<strong>只要你在某个选择器块里写规则，这条规则就属于这个选择器</strong>。每往下一层，选择器就长一截，特异性也跟着抬高。
    </p>
    <p>
      大多数时候这条假定是对的，父子关系本来就该这么表达。可总有那么几条规则，从语义上根本不归当前组件管：主题级的颜色覆盖、打印时才生效的排版、工具类的补充、框架约定必须写在顶层的规则。它们被塞进组件里，唯一理由是「恰好这个组件需要在这儿改一下」。
    </p>
    <p>
      不借助任何手段的代价很直接：要么把规则搬到嵌套之外，让它和组件分离，读到组件的人完全看不到「它在暗色下会变」；要么留下一条特异性极高、与 DOM 深度绑定的选择器。更隐蔽的是，选择器越长，越难被后续样式覆盖，于是你又被迫加 <code>!important</code> 或再叠一层选择器，陷入「越写越重」的循环，等哪天要调整结构，它就成了撬不动的那根钉子。
    </p>

    <h2>移到根级写规则</h2>
    <p>
      最朴素的做法：把这条规则直接写在组件块的外面，或者干脆另起一个文件，让它从根级出生。
    </p>
    <p>
      这个办法确实做对了一件事：<strong>结果选择器是干净的根级选择器</strong>。<code>.theme-dark .widget</code> 就是 <code>.theme-dark .widget</code>，不继承任何父级，特异性也低。当这条规则确实只出现一次、又和上下文毫无关系时，搬出去干脆利落，读起来也不绕。
    </p>

    <h2>脱离组件上下文</h2>
    <ul>
      <li>规则被搬离组件后，「这个组件在暗色下会变」这件事就从读代码的视野里消失了，就近维护的便利没了。</li>
      <li>如果这条规则本来就写在 <code>@media</code> 或 <code>@supports</code> 里，搬出去要么丢掉媒体条件，要么把整段查询再抄一遍。</li>
      <li>反过来，当规则已经位于 <code>@media</code> 块内，你想剥掉父选择器、却把媒体条件留下时，靠搬家做不到——它会连媒体查询一起带走。</li>
      <li>拆到两个位置之后，重构组件时很容易只改一处，漏掉外面那条。</li>
    </ul>

    <h2>剥离父级选择器</h2>
    <p>
      不去推翻嵌套，而是给「输出位置」补一个开关：<code>@at-root</code>。它的默认行为是<strong>移除当前的普通选择器上下文，把规则输出到文档顶层</strong>。写进组件里，是为了就近维护；编译出去，却是根级规则。
    </p>
    <p>把它套在刚才那条规则上：</p>
    <p>
      <code>.dashboard .panel { @at-root .theme-dark .widget { ... } }</code>
    </p>
    <p>
      编译产物里只剩 <code>.theme-dark .widget</code>，父级 <code>.dashboard .panel</code> 被干净地剥离。规则仍然长在组件旁边，读代码的人一眼就知道它的来历，重构时也不会漏。
    </p>
    <p>
      这里有个必须记住的细节：默认的 <code>@at-root</code> 剥掉的是<strong>普通选择器（style rule）</strong>，像 <code>@media</code>、<code>@supports</code> 这样的 at-rule 反而会被保留。它解决的是输出位置问题，不是「清空一切上下文」。当你想更精确地控制保留哪一层，用 with / without 查询：
    </p>
    <table>
      <thead>
        <tr><th>写法</th><th>保留什么</th></tr>
      </thead>
      <tbody>
        <tr><td><code>@at-root</code></td><td>保留 at-rule，剥掉选择器（等价于 <code>(without: rule)</code>）</td></tr>
        <tr><td><code>@at-root (with: media)</code></td><td>只保留媒体查询，剥掉选择器与其他 at-rule</td></tr>
        <tr><td><code>@at-root (without: media)</code></td><td>剥掉媒体查询这一层，保留选择器与其他 at-rule</td></tr>
      </tbody>
    </table>
    <p>
      还有一个容易踩的地方：在 <code>@at-root</code> 内部使用 <code>&amp;</code> 时，它引用的仍是外层的完整选择器，展开结果常常和直觉不同。复杂场景请先把编译产物打出来对比，确认无误再定稿；需要更精细的选择器拼装时，可以配合 <code>sass:selector</code> 模块的 API。
    </p>
    <div class="lesson-box warn">
      <strong>别把它当挡箭牌：</strong><code>@at-root</code> 用来表达「这条规则本来就在根级」，不是用来给糟糕的深层架构打补丁。当你发现嵌套深到必须靠它拉平时，先停下来反思结构本身——多数情况下，把那个类名拆出来，比强行拉平更简单也更耐改。
    </div>
    <p>
      还有一步不能省：改完之后打开编译产物对比一眼，确认规则的<strong>输出位置</strong>与预期一致再合入。这类「位置错误」不会报语法错，它只会安安静静地生成一条你不想要的选择器。
    </p>

    <h2>根级组件上下文切换</h2>
    <figure class="lesson-figure">
      <figcaption>勾选开关，看同一段嵌套编译出的选择器如何在根级与组件上下文之间切换。</figcaption>
      <SC13AtRoot />
    </figure>

    <h2>输出位置控制</h2>
    <p>
      <code>@at-root</code> 管的是「这条规则该长在哪」，而不是「这条规则长什么样」。默认剥掉选择器、保留 at-rule，配上 with / without 就能精确控制上下文；真正的修养是：只在规则本不属于当前组件时用它，而不是用它掩盖失控的嵌套。
    </p>
    <div class="lesson-term">
      <span class="term-name">「@at-root」</span>把规则从当前选择器上下文中取出、输出到文档顶层。默认等价于 <code>@at-root (without: rule)</code>：剥掉普通选择器，保留 <code>@media</code>、<code>@supports</code> 等 at-rule。用 <code>(with: media)</code> 只保留媒体查询，用 <code>(without: media)</code> 剥掉媒体查询；它解决输出位置问题，不该被当作掩盖深层嵌套的捷径。
    </div>
  </LessonArticle>
</template>
`;export{t as default};
