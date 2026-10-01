<script setup lang="ts">
import WB14ReferenceTypes from './WB14ReferenceTypes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一个会员对象交给 Wasm 的 <code>identity</code> 函数，它什么也没做、原样返回。你在 JS 里用 <code>===</code> 一比，两个引用<strong>相等</strong>——对象跨过 Wasm 边界跑了一个来回，居然没被复制。可你明明记得，数值类型跨边界都是按值拷贝的。
    </div>

    <h2>提出问题</h2>
    <p>
      值类型（<code>i32</code>、<code>f64</code>）跨边界是按值拷贝，这很好理解：数字小，复制一份没负担。但会员对象、DOM 节点、缓存句柄这些没法拆成几个数字。硬要传，看上去只有两条老路。
    </p>
    <p>
      第一条是序列化进线性内存：对象里一旦含有函数、DOM 引用或循环引用，<code>JSON.stringify</code> 直接报错，根本序列化不了；就算能序列化，拿回来也只是个副本，<code>===</code> 不再成立，而且每次调用都要把大对象整个拷一遍。第二条是干脆不传：把所有对象逻辑都留在 JS 侧，那模块就永远够不着宿主对象。真正的问题因此是：<strong>能不能只传一个「引用 / 句柄」，让模块把它持有住，却不复制对象本身？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      答案是引用类型里的 <strong><code>externref</code></strong>。把函数签名写成 <code>(param $obj externref) (result externref)</code>，模块就可以在栈上持有这个引用，也能把它原样传回——它<strong>传的是句柄，不是对象</strong>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「对象的身份」而不是「对象的内容」交给模块</strong>。一次传递是常数开销，和对象多大、多复杂都无关；对象里有函数、有 DOM 节点也无所谓，因为压根没打算复制它。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>模块拿到 <code>externref</code> 也<strong>读不了它的内部</strong>：<code>externref</code> 是不透明（opaque）的，想在 Wasm 里取 <code>obj.name</code> 根本做不到。</li>
      <li>释放引用是个真问题：模块持有期间这个 JS 对象不能被回收，引用类型要让引擎参与垃圾回收，生命周期比自增的数字类型复杂。</li>
      <li>函数得用 <code>funcref</code>：<code>funcref</code> 只能指向函数，拿它去存一个普通对象不合法，两者不能混用。</li>
      <li>环境支持：引用类型是较新的提案，老的引擎或工具链可能根本不认这个签名。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补<strong>「传的确实是同一个引用」</strong>。<code>identity</code> 把收到的 <code>externref</code> 原样返回，JS 用 <code>===</code> 一判定就相等——这说明全程没有发生拷贝。这一步是后面所有用法的立足点：模块保管的，就是宿主那个对象本人。
    </p>
    <p>
      再补<strong>它适合用在哪</strong>。DOM 节点、缓存句柄、回调上下文这类宿主对象，最适合交给模块当「不透明句柄」存着：模块不解读、不修改，只在需要时把它原样传回宿主。整个来回一次拷贝都不做，大对象也好、带方法的对象也好，都不再是负担。
    </p>
    <p>
      接着补 <strong><code>funcref</code></strong>。引用类型这个人家里，<code>funcref</code> 专门指向函数，正是函数表（table）的元素类型——上一课那张表，每个格子放的就是一个 <code>funcref</code>。两者合在一起，补齐了 Wasm 与宿主「对象」和「函数」之间两条高效互操作的通道。
    </p>
    <p>
      然后补<strong>「读不了就回调」</strong>。既然 Wasm 访问不了 <code>externref</code> 的内部，那要真正操作对象，就把句柄回传给宿主、由 JS 去读写，或者通过导入的 JS 函数让宿主处理——<strong>Wasm 负责持有和传递，JS 负责解读</strong>，分工清楚了就不会拧巴。
    </p>
    <p>
      最后往前看一步：<strong>WasmGC 提案</strong>再推进一层，让 Wasm 能直接定义并操作 <code>struct</code> / <code>array</code> 这类结构体对象，不用再满足于「只能拿一个看不懂的句柄」。引用类型是把宿主对象安全地借给模块的第一块地基，GC 提案是在它上面盖的下一层。
    </p>
    <div class="lesson-box hint">
      <code>externref</code> 传的是引用而不是拷贝，但它并不「转移所有权」：对象仍旧归 JS 所有，模块只是暂时持有。要让引擎知道这段持有关系、从而正确回收，就依赖引用类型参与的这套 GC 机制。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点「传入 Wasm 并返回」，看判定结果是「引用完全一致」——同一个会员对象绕过模块一圈，<code>===</code> 仍然成立，说明全程没有复制。</figcaption>
      <WB14ReferenceTypes />
    </figure>

    <h2>总结</h2>
    <p>
      <code>externref</code> 让模块能持有并原样传回一个 JS 对象的引用而不复制它，适合把 DOM 节点、缓存句柄、回调上下文这类对象交给模块保管；模块读不了它的内部，要操作就回调 JS。<code>funcref</code> 是它的兄弟，只能指向函数、也是函数表的元素类型；再往前的 WasmGC 提案则让 Wasm 能直接操作结构体与数组对象。
    </p>
    <div class="lesson-term">
      <span class="term-name">「externref」</span>是 Wasm 的引用类型之一，允许模块持有并原样传回一个 JS 对象的<strong>引用</strong>而不复制数据，一次传递是常数开销，适合 DOM 节点、缓存句柄、回调上下文等宿主对象。边界：<code>externref</code> 是不透明的，模块无法直接读写对象内部，要操作须回调 JS 或经内存传值；对象在模块持有期间不会被回收，生命周期由引用类型参与的 GC 机制管理；函数引用应使用 <code>funcref</code>（函数表的元素类型），不可混用；该提案较新，需引擎支持；WasmGC 提案进一步允许 Wasm 直接定义并操作 <code>struct</code> / <code>array</code> 对象。
    </div>
  </LessonArticle>
</template>
