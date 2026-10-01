<script setup lang="ts">
import T08VueTyping from './T08VueTyping.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>父组件把 <code>size="middle"</code> 传给了按钮，拼错了一个字母，模板里却毫无提示——组件明明有 <code>size</code> 这个 prop，为什么编译器拦不住这个错误取值？
    </div>

    <h2>组件对外接口</h2>
    <p>
      组件就是对外的一个接口：props 从外部流入，emits 向外部流出，模板引用指向内部真实的 DOM 或子组件实例，组合式函数则是把状态与行为打包给使用方。这四处只要有一处没有类型，调用方就可能传错、用错，而错误要等到运行时渲染异常或点击无反应才暴露。
    </p>
    <p>
      代价是双向的。对使用组件的人来说，拼错 prop 取值、传错事件参数、在未挂载时就去访问 DOM，都不会在编译期被拦下；对维护组件的人来说，改动一个 prop 的名字或类型，也无法通过类型检查知道自己破坏了多少调用点。<strong>组件越是被复用，这种沉默的错配就越贵。</strong>
    </p>

    <h2>运行时声明方式</h2>
    <p>
      最省事的做法：运行时声明。用对象写法声明 props 的默认值，emits 写成字符串数组，模板引用就当它是普通变量直接取值。
    </p>
    <p>
      这个方案做对了一件事：<strong>组件能跑起来，运行时也能拿到默认值</strong>。在只是渲染几个文本的小组件里，这套写法完全够用，也不必引入额外的类型成本。
    </p>

    <h2>两份声明的错位</h2>
    <ul>
      <li>运行时声明和 TypeScript 类型是两份知识，改了一处容易忘记另一处，二者悄悄对不上。</li>
      <li>prop 的合法取值（如 <code>'small'</code> 这类字面量联合）没有约束，拼错字母不会报错。</li>
      <li>emits 的参数形状没人检查，事件名对但参数传错，编译期一样沉默。</li>
      <li>模板引用在挂载前值是 <code>null</code>，直接取值或调用方法会在运行时崩。</li>
      <li>组合式函数若不写返回类型，解构出来的属性会退化成宽泛类型，丢失精确性。</li>
    </ul>

    <h2>编译宏的类型推导</h2>
    <p>
      不推翻「组件是对外接口」，而是让这四处边界<strong>各自带上精确类型</strong>。Vue 3 的编译宏能从泛型声明直接推导出模板里的类型，正好承接这件事。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>defineProps&lt;Props&gt;()</code> 的类型参数声明 props，再配合 <code>withDefaults</code> 给默认值，模板与调用处都获得校验与提示。</li>
      <li>用 <code>defineEmits&lt;Events&gt;()</code> 按「事件名 → 参数元组」的映射声明 emits，事件名与参数形状同时被约束。</li>
      <li>模板引用用 <code>ref&lt;T | null&gt;(null)</code> 声明，并在访问前做空值守卫，比直接 <code>as</code> 断言更安全。</li>
      <li>为组合式函数与计算属性标注返回类型，保证解构出来的接口同样精确。</li>
    </ol>
    <p>
      把这几步合起来看，组件的类型边界就闭成了环：props 流入有约束，emits 流出有约束，模板引用在访问前被守卫提醒可能为 <code>null</code>，计算属性只读，组合式函数对外暴露的形状也被固定。开场那个 <code>size="middle"</code> 的拼写错误，会在模板里当场被标红。
    </p>
    <p>
      还有两个细节值得一并记住。<strong>其一</strong>，父组件想引用子组件暴露出来的公开实例类型，可以用 <code>InstanceType&lt;typeof Comp&gt;</code>，从而在类型层面拿到子组件的方法与属性。<strong>其二</strong>，组件对外暴露的类型要尽量收窄，别把内部实现里那些复杂的中间类型泄漏给使用方——组件的类型既是文档，也是长期的公共契约，泄漏得越少，未来改动越自由。
    </p>

    <h2>挂载后的引用访问</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮聚焦输入框，观察模板引用在挂载后如何被安全访问。</figcaption>
      <T08VueTyping />
    </figure>

    <h2>各出口的类型约束</h2>
    <p>
      Vue 3 组件类型实践的落点，是让组件的每一处出入口都有类型：props 与 emits 用泛型声明约束形状，模板引用先声明可能为 <code>null</code> 再做守卫，组合式函数与计算属性标注返回类型。把这些边界补齐，错配就止步于编辑器，而不必等到运行时。
    </p>
    <div class="lesson-term">
      <span class="term-name">「组件类型边界」</span>指组件对外交互的四个口子：<code>defineProps</code> 约束输入、<code>defineEmits</code> 约束输出、模板引用 <code>ref&lt;T | null&gt;</code> 需在访问前守卫、组合式函数与计算属性应标注返回类型。父组件可借 <code>InstanceType&lt;typeof Comp&gt;</code> 取得子组件的公开实例类型。
    </div>
  </LessonArticle>
</template>
