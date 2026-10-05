const o=`<script setup lang="ts">
import J22Symbol from './J22Symbol.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你和同事各自往同一个用户对象上挂元数据，一个写 <code>user.type = 'vip'</code>，另一个也写 <code>user.type</code>，合并后互相覆盖——有没有一种键，天生就不可能重名？
    </div>

    <h2>字符串键命名冲突</h2>
    <p>
      你负责一个课程平台，需要在用户对象上附加一些「框架级」的信息：这是不是付费学员、他收藏过哪些课程、埋点 SDK 记下了什么。最顺手的写法就是给对象挂属性：<code>user.type = 'vip'</code>、<code>user.marked = [...]</code>。
    </p>
    <p>
      麻烦在于，同一个 <code>user</code> 对象会被很多人惦记。你写业务模块，图表库要挂它的渲染状态，埋点 SDK 要挂它的访客编号，隔壁同事的插件还想挂一个「类型」。而大家能想到的键名就那么几个，<strong>字符串键的世界里，两个都想表达「类型」的人，注定要争同一个名字</strong>。冲突一旦发生，后写的一方静默覆盖先写的一方，往往要等到线上数据出错才被发现。
    </p>

    <h2>前缀划分命名空间</h2>
    <p>
      给键名统一加前缀，靠团队约定划分命名空间：业务用 <code>__course_</code>，埋点用 <code>__track_</code>，插件用 <code>__plugin_</code>。这个方案确实做对了一件事：<strong>键名本身是可读的</strong>，打开控制台一眼就知道这数据是谁写的、属于哪一层。
    </p>

    <h2>约定与机制分野</h2>
    <ul>
      <li>前缀只是约定，不是机制。第三方库若也用 <code>__course_</code>，照样撞车，而你无法阻止它。</li>
      <li>字符串键默认可枚举，<code>for...in</code> 和 <code>Object.keys()</code> 会把它们一并捞出来，本该私有的元数据混进了业务遍历。</li>
      <li><code>JSON.stringify()</code> 会把它们一并序列化出去，一个纯前端的埋点标记被悄悄传给了后端接口。</li>
      <li>每个字符串键都能被外部随意读取和改写，不存在「这是我的私有字段」这回事。</li>
    </ul>

    <h2>Symbol唯一键</h2>
    <p>
      不推翻「用属性键携带元数据」，而是换一种键。<code>Symbol()</code> 每次调用都造出一个全新的值，独一无二：即使两次调用写了同样的描述，它们也不相等——<code>Symbol('type') === Symbol('type')</code> 得到 <code>false</code>，而两个值的 <code>description</code> 都只是字符串 <code>'type'</code>，仅供调试时辨认。这意味着，哪怕全世界的库都写 <code>Symbol('type')</code>，它们拿到的也是不同的键，永远撞不上。<strong>字符串键比的是「名字」，符号键比的是「身份」。</strong>
    </p>
    <p>
      顺带还解决了可见性。用 Symbol 做键的属性不参与 <code>for...in</code>、<code>Object.keys()</code> 与 <code>Object.getOwnPropertyNames()</code>，也不会被 <code>JSON.stringify()</code> 序列化，天然适合存放「想随对象一起存在、却不愿被当成普通字段遍历或传输」的元数据。要留意这只是默认不被遍历，并非绝对隐藏：<code>Object.getOwnPropertySymbols()</code> 仍然取得到它。
    </p>
    <p>
      再往下推一步会发现，有些场景恰恰需要跨模块、按名字共享同一个符号——比如两个文件都要用同一个「课程类型」标记。这时用 <code>Symbol.for('course.type')</code>：它先到全局注册表里按描述查，有就返回已有的那个，没有才新建。所以两次 <code>Symbol.for('course.type')</code> 得到的是同一个值，而 <code>Symbol.keyFor(sym)</code> 能反向取回它的描述字符串。一句话：<strong><code>Symbol()</code> 造「唯一」，<code>Symbol.for</code> 造「共享」</strong>，别把两者混用。
    </p>
    <p>
      Symbol 更大的价值，是它默认充当语言与对象之间的协议钩子。给对象加上一个 <code>[Symbol.iterator]</code> 方法，返回带 <code>next()</code> 的迭代器，<code>for...of</code>、展开运算符、数组解构就都能作用到这个对象上——你没有改动语言，只是填上了语言预留的插槽，等于把自定义对象接进了内建行为。同类的钩子还有几个：<code>Symbol.toPrimitive</code> 接管对象参与加法、比较、字符串拼接时的类型转换，回调会收到 <code>hint</code>，取值是 <code>'number'</code>、<code>'string'</code> 或 <code>'default'</code>；<code>Symbol.hasInstance</code> 自定义 <code>instanceof</code> 的判断逻辑；<code>Symbol.toStringTag</code> 决定 <code>Object.prototype.toString</code> 打印出的标签。它们说的是同一件事：语言把某些内建行为做成了可插拔的，插槽名就是这些内置符号。
    </p>
    <p>
      最后留一个必须记住的边界：符号不是字符串，不能当作 JSON 的键，也无法用字符串下标去访问，读它必须持有同一个符号引用。所以符号适合做「协议」和「私有标记」，不适合需要序列化或字符串寻址的普通数据。
    </p>

    <h2>符号展开与全局注册</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮分别验证：符号如何让对象可被展开、如何接管类型转换、以及 Symbol.for 的共享与 keyFor 的反查。</figcaption>
      <J22Symbol />
    </figure>

    <h2>属性键身份化</h2>
    <p>
      Symbol 解决的是「同名」这件事：它把属性键从「比较名字」升级为「比较身份」，从根本上消除了命名冲突；同时，内置符号是一排语言预留的插槽，实现它们就等于让自定义对象接管 <code>for...of</code>、类型转换、<code>instanceof</code> 等内建行为。前缀方案那些毛病——可枚举、会被序列化、靠自觉——到这里一并消失了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Symbol」</span>是 JavaScript 的一种原始类型，每次调用 <code>Symbol()</code> 都产生一个独一无二、永不与任何其他值相等的值，因此适合作为不会冲突的属性键。内置符号（<code>Symbol.iterator</code>、<code>Symbol.toPrimitive</code>、<code>Symbol.hasInstance</code>、<code>Symbol.toStringTag</code> 等）是语言约定的协议钩子，实现它们即可把对象接入 <code>for...of</code>、隐式类型转换、<code>instanceof</code> 等内建行为；<code>Symbol.for</code> 在全局注册表中按描述共享，<code>Symbol.keyFor</code> 反向查询。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
