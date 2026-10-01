<script setup lang="ts">
import T11Mapped from './T11Mapped.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个课程模型，要一份「字段全只读」的展示类型、一份「字段全可选」的补丁类型，难道每加一个字段，就要把 <code>id</code>、<code>title</code>、<code>teacher</code> 这些名字在各个版本里再抄一遍？
    </div>

    <h2>同一结构的三版</h2>
    <p>
      你在维护课程后台。一份课程对象有 <code>id</code>、<code>title</code>、<code>teacher</code>、<code>duration</code>、<code>published</code> 五个字段。业务很快提出三类需求：编辑表单要一份「字段全可选」的补丁类型，详情页要一份「字段全只读」的展示类型，序列化到缓存前还要一份把每个字段包成 <code>getXxx()</code> 的访问器类型。你手上只有一份 <code>CourseModel</code>。
    </p>
    <p>
      每个需求都手写一遍字段清单，最要命的不是当时写得累，而是<strong>字段一改动，这几份类型会悄悄漂移</strong>：模型加了 <code>cover</code>，补丁类型忘了补，编译器不会报错，运行时却少同步了一个字段。所以真正的痛点不是「少写几行」，而是「同一份结构被复制成了多个互相独立的真相」。
    </p>

    <h2>手写只读类型</h2>
    <p>
      最朴素的做法是逐字写出来——把只读这件事直接写进类型里：<code>interface ReadonlyCourse { readonly id: number; readonly title: string; ... }</code>。
    </p>
    <p>
      这个写法做对了一件事：<strong>把「只读」这个意图显式地表达在了类型上</strong>，读代码的人一眼就能看出它不能被修改。这种「用意清楚的类型」要保留。问题只出在它是怎么被写出来的——它把字段当成了要复述的内容。
    </p>

    <h2>定格类型的分叉</h2>
    <ul>
      <li>写好的类型是「定格」的：模型新增或重命名字段时，这份手写类型不会跟着动，两边就此分叉。</li>
      <li>需要「只读」「可选」「访问器」三套时，就要把字段清单复制三遍，任何一处漏改都是隐性缺陷。</li>
      <li>手写类型与模型之间没有任何绑定，编译器无法帮你核对它们是否一致。</li>
      <li>维护成本随「字段数 × 需求数」一起涨，字段一多就很难保证不出错。</li>
    </ul>

    <h2>映射遍历键名</h2>
    <p>
      把「列举字段」这件事交还给编译器。既然 <code>keyof T</code> 已经能给出一个类型上所有键组成的联合，就不必再手写键名——真正要描述的不是「哪几个字段」，而是「<strong>对每个字段做什么变换</strong>」。这就是映射类型：用 <code>[K in keyof T]</code> 遍历 <code>T</code> 的每一个键 <code>K</code>，右侧用索引访问 <code>T[K]</code> 取回该键对应的值类型。
    </p>
    <p>
      于是「把每个属性变成只读」只需要一行：
      <code>type ReadonlyCourse = { readonly [K in keyof CourseModel]: CourseModel[K] }</code>。
      这里没有出现任何具体字段名，字段增删都会自动反映到结果上。顺着这条线索，你也解释清了一件旧事：<code>Readonly&lt;T&gt;</code>、<code>Partial&lt;T&gt;</code>、<code>Pick&lt;T, K&gt;</code> 为什么长得那么像——它们不过是同一套映射语法配上不同的修饰符。
    </p>
    <p>
      接下来是修饰符。<code>?</code> 让属性变为可选，前缀 <code>-</code> 表示把它去掉：<code>{ [K in keyof T]?: T[K] }</code> 得到全可选版本，<code>{ readonly [K in keyof T]: T[K] }</code> 得到全只读版本，<code>-readonly</code> 与 <code>-?</code> 则把只读或可选重新剥掉。
    </p>
    <p>
      再往下是键重命名。用 <code>as</code> 子句可以在生成属性的同时改写键名，比如给每个字段生成一个取值的方法。这里有一个必须记住的坑：<strong>参与字符串拼接之前，键要先收窄为 <code>string</code></strong>，也就是写成 <code>string &amp; K</code>：
    </p>
    <p>
      <code>type GetterMap = { [K in keyof CourseModel as `get${Capitalize&lt;string &amp; K&gt;}`]: () =&gt; CourseModel[K] }</code>
    </p>
    <p>
      如果某个键不该出现在结果里，就把它重命名成 <code>never</code>，这类键会被自动过滤掉——这是映射类型的「过滤」手法，与重命名共用同一条路径。
    </p>
    <p>
      最后交代两条边界。其一，<strong>映射类型只作用在当前这一层</strong>：模型里若有嵌套对象，内层属性不会被一并转换，想深入必须配合递归条件类型逐层下钻。其二，<code>as</code> 子句里的新键必须能与模板字面量兼容，拼不出字符串的键会被静默过滤，别指望它报错来提醒你。
    </p>
    <div class="lesson-box hint">
      回看这一步的意义：映射类型并没有引入任何新的信息，它做的只是<strong>让同一份信息以不同形态出现</strong>——原模型是唯一的真相，只读、可选、重命名都只是从它出发的一个视角。视角由规则生成，就永远不会与真相脱节；而手写复制出的类型，本质上是一个迟早会走样的副本。
    </div>

    <h2>每个键的覆盖</h2>
    <figure class="lesson-figure">
      <figcaption>改动表单里的字段，看映射类型如何覆盖课程模型的每一个键，而不需要手写任何一个键名。</figcaption>
      <T11Mapped />
    </figure>

    <h2>变换规则的描述</h2>
    <p>
      映射类型把「复制字段清单」换成了「描述变换规则」：<code>[K in keyof T]</code> 负责遍历，修饰符负责调整读写与可选，<code>as</code> 子句负责重命名与过滤。从此模型是唯一的真相，只读版、可选版、访问器版都从它派生出来，字段一改动，每一处都会自动跟上。
    </p>
    <div class="lesson-term">
      <span class="term-name">「映射类型」</span>用 <code>[K in keyof T]</code> 遍历已有类型的全部键并逐个生成新属性，可叠加 <code>readonly</code>、<code>?</code> 及其 <code>-</code> 前缀来调整修饰符，再用 <code>as</code> 子句重命名键（键需先收窄为 <code>string</code>，如 <code>string &amp; K</code>）或映射为 <code>never</code> 以过滤。它只作用于当前一层，深层结构需配合递归类型；<code>Partial</code>、<code>Readonly</code>、<code>Pick</code> 等内置工具都由它实现。
    </div>
  </LessonArticle>
</template>
