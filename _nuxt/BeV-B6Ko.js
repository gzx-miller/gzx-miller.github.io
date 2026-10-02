const e=`<script setup lang="ts">
import J20JsonClone from './J20JsonClone.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把课程数据 <code>JSON.stringify</code> 存进 localStorage，取出来时 <code>JSON.parse</code> 也没报错，可紧接着 <code>course.date.getFullYear()</code> 却提示「不是函数」——明明存进去的时候它还是一个 <code>Date</code>，读出来怎么就不是了？
    </div>

    <h2>存储往返损耗</h2>
    <p>
      你在给课程管理页做本地缓存：把课程对象转成字符串写进存储，下次打开再读回来。这套做法本身没错，直到数据里出现了三类麻烦：课程有开课日期 <code>date</code>，是 <code>Date</code> 实例；学生列表里某些字段是 <code>undefined</code>；对象里还随手加了一个指向自身的引用方便查找。这时的序列化往返，就不再是「转成字符串再转回来」这么简单了。
    </p>
    <p>
      不用这两组能力，代价会具体地显现出来：日期经过一轮往返会变成纯字符串，所有依赖日期方法的地方集体失效；带循环引用的对象会让序列化直接抛错，整个导出功能挂掉；而更危险的是，原始对象里若有密码、令牌这类字段，它们会被<strong>一字不差</strong>地写进本地存储和日志里——你以为只是缓存，其实是把敏感数据摊开存放了。
    </p>

    <h2>序列化与反序列化</h2>
    <p>
      最直接的做法就是用内置的 <code>JSON.stringify</code> 和 <code>JSON.parse</code>：一个把对象转成 JSON 字符串，一个把字符串变回对象，一行写一个方向。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它给了数据一个与语言无关的、可存储可传输的纯文本形态</strong>。对于只含字符串、数字、布尔和数组嵌套的「纯数据」，这套往返是完全可靠、零信息损失的。要保留的正是这份「可持久化的文本表示」，问题在那些超出 JSON 表达能力的东西上。
    </p>

    <h2>类型信息丢失</h2>
    <ul>
      <li><code>Date</code> 会被序列化成 ISO 格式的字符串，解析回来仍然只是字符串，类型信息在往返中永久丢失。</li>
      <li>JSON 没有 <code>undefined</code>、函数和 Symbol 这几种值的表示，对象属性遇到它们会被<strong>直接跳过</strong>，而同样的值出现在数组里则会变成 <code>null</code>。</li>
      <li>对象一旦出现循环引用，序列化会直接抛出「Converting circular structure to JSON」，而不是跳过那条引用。</li>
      <li>序列化会无差别地导出所有可枚举字段，密码、令牌这类不该落盘的数据跟着一起被写进存储。</li>
    </ul>

    <h2>定制转换与白名单</h2>
    <p>
      先解决「导出时能不能筛选和改造」。<code>JSON.stringify</code> 其实接受第二个参数 <strong>replacer</strong>，它可以是函数，也可以是白名单数组：写成函数时，每个键值对都会经过你，你可以返回原值、返回一个新值来替换它，或者返回 <code>undefined</code> 把这条属性整个剔除；写成数组时，则只有列出的键会被导出。日常最常用的两件事——把 <code>Date</code> 转成便于阅读的日期字符串、把敏感字段过滤掉——都能在这里一次完成。
    </p>
    <p>
      <code>const json = JSON.stringify(course, (k, v) =&gt; k === 'token' ? undefined : v instanceof Date ? v.toISOString() : v, 2)</code>
    </p>
    <p>
      接着解决「解析时能不能还原类型」。<code>JSON.parse</code> 的第二个参数是 <strong>reviver</strong>，它会在每个值被还原后依次回调，你可以在这里<strong>根据值的形态把它重建回原本的类型</strong>，比如把形如 <code>2025-10-15</code> 的字符串重新变成 <code>Date</code> 实例。导出时用 replacer 降级，导入时用 reviver 还原，一次序列化往返就把类型闭环接上了。
    </p>
    <p>
      最后解决「深拷贝」。上面这套往返是「为了存字符串」而设计的，如果你真正想要的只是把对象<strong>完整复制一份</strong>、并且这份副本要能处理循环引用，那就该换用 <strong><code>structuredClone</code></strong>：它走的是结构化克隆算法，能顺着引用图把循环引用、嵌套对象以及 <code>Date</code>、<code>Map</code>、<code>Set</code>、<code>ArrayBuffer</code> 等内置类型一并正确复制出来，副本与原对象各不相干。
    </p>
    <div class="lesson-box warn">
      两条边界要分清：<code>structuredClone</code> 能处理循环引用，但<strong>不支持函数和 DOM 节点</strong>，遇到它们会直接抛错；而 JSON 路线既不能表示循环引用，也不能表示 <code>undefined</code>、函数与 Symbol。选方案前先看数据里有什么。另外，无论走哪条路，<strong>序列化之前都该先用 replacer 过滤掉密码、令牌等敏感字段</strong>。
    </div>

    <h2>导出还原与深拷贝</h2>
    <figure class="lesson-figure">
      <figcaption>先点「导出 JSON」看 replacer 如何剔除字段并把日期降级，再点「导入还原」看 reviver 把字符串接回 <code>Date</code>，最后试一次含循环引用的深拷贝。</figcaption>
      <J20JsonClone />
    </figure>

    <h2>落盘传输与结构化克隆</h2>
    <p>
      JSON 与结构化克隆回答的是同一个问题的两个方向：<strong>当数据要离开内存（落盘、传输）或要被完整复制一份时，怎么不丢信息、不惹麻烦</strong>。JSON 用 replacer 与 reviver 守住「筛选」和「还原」两个关口，结构化克隆则负责把整个引用图连同类一起照搬——先把数据里有没有循环引用、函数和敏感字段看清楚，再选路线。
    </p>
    <div class="lesson-term">
      <span class="term-name">「序列化」</span>指把内存中的对象转成可存储、可传输的文本，JavaScript 里由 <code>JSON.stringify</code> 完成，可用 <strong>replacer</strong>（函数或键名数组）过滤与转换，或用对象自身的 <code>toJSON</code> 自定义输出；反方向由 <code>JSON.parse</code> 完成，可用 <strong>reviver</strong> 在解析时把字符串重建回原本的类型。JSON 无法表示 <code>undefined</code>、函数、Symbol 与循环引用，<code>Date</code> 会退化为字符串。<span class="term-name">「结构化克隆」</span>指 <code>structuredClone</code> 走的深拷贝算法，能正确处理循环引用与 <code>Date</code>、<code>Map</code>、<code>Set</code>、<code>ArrayBuffer</code> 等内置类型，但不支持函数与 DOM 节点。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
