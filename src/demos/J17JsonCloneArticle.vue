<script setup lang="ts">
import J20JsonClone from './J20JsonClone.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程数据导出成 JSON 存进了本地缓存，重新读回来时，<code>price</code> 还是数字、<code>name</code> 还是字符串，唯独日期从 <code>Date</code> 变成了一个 <code>'2025-10-15'</code> 的字符串。同一份数据往返一趟，怎么就变了模样？更怪的是，有人用展开语法复制这份数据，改副本竟把原对象也一起改了。
    </div>

    <h2>JSON 能装下什么</h2>
    <p>
      你要做的是一件小事：把内存里的数据变成一段能存进文件、能发上网络的文本。JSON 就是这个格式的约定。但它比想象中要窄——它只认识对象、数组、字符串、数字、布尔和 <code>null</code> 这几种值。
    </p>
    <ul>
      <li><code>undefined</code>、函数、<code>Symbol</code> 都不是合法值：出现在对象里，整个键会被丢弃；出现在数组里，则被替换成 <code>null</code>。</li>
      <li>循环引用直接抛错——一个对象引用回自己，JSON 没有语法能表示「回到自己」。</li>
      <li><code>Date</code> 会被降级成 ISO 字符串，<code>Map</code>、<code>Set</code> 则退化成空对象 <code>{}</code>。</li>
    </ul>
    <p>
      这就是日期往返变样的根源。要记住的结论是：<strong>JSON 不是对象的「截图」，而是可传输值的一个子集</strong>——凡是子集之外的，都会被丢掉或改写。
    </p>

    <h2>序列化的三个参数</h2>
    <p>
      序列化用 <code>JSON.stringify(value, replacer, space)</code>，三个参数各管一段：
    </p>
    <ul>
      <li><code>value</code> 是要序列化的数据。</li>
      <li><code>replacer</code> 可以是函数，逐键拿到 <code>(key, value)</code>，返回什么就写入什么；返回 <code>undefined</code> 就等于删除这个键。</li>
      <li><code>replacer</code> 也可以是字符串数组，只保留数组里点名的那些键。</li>
      <li><code>space</code> 控制缩进，传数字或字符串，纯粹为了可读。</li>
    </ul>
    <p>
      其中函数形式的 <code>replacer</code> 会从外到内遍历每个值，这就给了你一个现成的「筛子」——不需要的字段在这里返回 <code>undefined</code> 即可剔除。
    </p>

    <h2>两端各留一个钩子</h2>
    <p>
      第一端在序列化这侧：如果某个对象自己定义了 <code>toJSON()</code>，<code>stringify</code> 会先调用它，再用它的返回值去序列化。这比在 <code>replacer</code> 里按类型写一堆 <code>if</code> 更内聚——<strong>对象自己最清楚「我该被存成什么样」</strong>。日期对象就自带 <code>toJSON</code>。
    </p>
    <p>
      第二端在还原这侧：<code>JSON.parse(text, reviver)</code>。<code>reviver</code> 同样逐键拿到 <code>(key, value)</code>，你可以在这一步把日期字符串重新构造成 <code>Date</code>——配合一个形如 <code>/^\d{4}-\d{2}-\d{2}$/</code> 的判断，只重建长得像日期的那些字符串。
    </p>
    <p>
      两端配成一对：存出去是字符串，收回来是 <code>Date</code>，格式就能对齐，开头那个「往返变样」的问题也就有了解法。
    </p>

    <h2>展开只是浅拷贝</h2>
    <p>
      有人会说：那我不用序列化，直接 <code>const copy = { ...src }</code> 复制一份不就行了？它做对了一半——顶层属性确实复制了，改 <code>copy</code> 上的基本类型字段不会影响 <code>src</code>。
    </p>
    <p>
      但它做错的正是嵌套这一层：<code>copy.meta === src.meta</code> 仍然为 <code>true</code>，两个对象共享同一个内层引用。你改了 <code>copy.meta.tag</code>，<code>src.meta.tag</code> 会跟着一起变。一句话，<strong>展开语法只复制最外一层</strong>，嵌套结构照旧共享。
    </p>

    <h2>结构化克隆的边界</h2>
    <p>
      真正意义上的深拷贝，浏览器给了 <code>structuredClone</code>。它走的是「结构化克隆算法」，会把对象、数组、<code>Date</code>、<code>Map</code>、<code>Set</code>、<code>ArrayBuffer</code> 都各复制一份独立的，连循环引用也能正确重建。
    </p>
    <ul>
      <li>支持：对象、数组、<code>Date</code>、<code>Map</code>、<code>Set</code>、<code>RegExp</code>、<code>ArrayBuffer</code> 等可结构化类型，以及循环引用。</li>
      <li>不支持：函数会抛 <code>DataCloneError</code>，DOM 节点也不行。</li>
      <li>它不等于 JSON——不经过文本中转，也不受「JSON 能表示什么」那套窄集限制。</li>
    </ul>
    <p>
      最后一条落点很实际：无论走序列化还是克隆，只要对象里有密码、令牌这类敏感字段，都应当在序列化前用 <code>replacer</code> 把它们过滤掉，而不是等写进日志或缓存才想起删。<strong>数据一旦离开内存，就很难收回</strong>。
    </p>

    <h2>往返与克隆对照</h2>
    <figure class="lesson-figure">
      <figcaption>三个按钮：导出 JSON（用 <code>replacer</code> 过滤 <code>id</code>、格式化日期）、导入还原（用 <code>reviver</code> 把日期字符串重建为 <code>Date</code>）、深拷贝（含循环引用）。留意导出后 <code>date</code> 变成了字符串、还原后 <code>type</code> 又变回 <code>Date</code>，以及循环引用在 <code>structuredClone</code> 下被正确重建。</figcaption>
      <J20JsonClone />
    </figure>

    <h2>两条路各取所需</h2>
    <p>
      序列化与克隆是两条不同的路：JSON 走文本中转，能跨网络、能落盘，但只认值的子集，靠 <code>replacer</code> 与 <code>reviver</code> 两端钩子补足类型往返；<code>structuredClone</code> 走结构化克隆算法，能复制循环引用和更多类型，却只留在本进程内存里、不经过文本，也带不走函数。选哪条，取决于数据是要「存下来、发出去」，还是「留在内存里复制一份」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「结构化克隆」</span>是 <code>structuredClone()</code> 使用的复制算法，按值递归复制对象并保留类型：支持对象、数组、<code>Date</code>、<code>Map</code>、<code>Set</code>、<code>ArrayBuffer</code> 以及循环引用，复制结果与原数据不共享任何引用。它<strong>不支持函数、DOM 节点与 <code>Symbol</code></strong>，遇到会抛 <code>DataCloneError</code>；与 JSON 往返不同，它在内存中直接完成、不经过文本，也就无法在途中过滤敏感字段，需要过滤时仍得另想办法。
    </div>
  </LessonArticle>
</template>
