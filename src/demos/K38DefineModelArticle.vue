<script setup lang="ts">
import K38DefineModel from './K38DefineModel.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>只是想给弹窗组件加一个 <code>v-model</code>，为什么要先声明一个 <code>modelValue</code> prop、再手动 <code>emit</code> 一个 <code>update:modelValue</code> 事件，还要处理 <code>trim</code> 这种修饰符？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个课程提醒设置的弹窗：里面有一个「是否开启提醒」的开关、一组单选的提醒频率、还有一个备注输入框。父组件希望像用原生表单一样「绑定」它们，于是用 <code>v-model:enabled</code>、<code>v-model:frequency</code>、<code>v-model:label.trim</code> 把值传进来。
    </p>
    <p>
      问题出在子组件这边：按旧写法，你要为每一个绑定项各写一对「prop 加事件」，还要自己认出哪个事件对应哪个字段、以及修饰符要不要清洗输入。<strong>真正想表达的只是「这个值可以被父组件双向绑定」，可代码里却是一大堆与意图无关的样板</strong>。
    </p>

    <h2>最小方案</h2>
    <p>
      最标准的做法：用 <code>props</code> 接收 <code>modelValue</code>（命名绑定时是 <code>enabled</code> 等），再用 <code>emit</code> 派发对应的 <code>update:modelValue</code>（命名时是 <code>update:enabled</code>）事件，把「我改了」这件事告诉父组件。
    </p>
    <p>
      它守住了 Vue 最核心的一条纪律：<strong>单向数据流</strong>。父组件负责持有数据，子组件不能偷偷改父组件的值，只能通过事件请求更新。前提完全正确，只是表达它所需的「仪式」太重了——每一项绑定都要重复一遍 prop 声明、事件声明、赋值时再 emit，字段一多就显得啰嗦又易错。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>每个绑定项都要写一份 prop 与 emit 的样板，重复且容易写错名字。</li>
      <li>命名绑定要同时维护 <code>enabled</code> 与 <code>update:enabled</code>，成对出现却分散两处。</li>
      <li>修饰符（如 <code>trim</code>）的解析要自己写，父组件和子组件的职责边界模糊。</li>
      <li>把 prop 的值当本地状态直接用会失去响应式更新的意义，得再套一层中转。</li>
      <li>字段越多，样板代码线性增长，模板之外还藏着一堆只管转发的逻辑。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻单向数据流，而是<strong>用编译器宏把「prop 加事件」这对样板收敛成一行</strong>。这个宏就是 <code>defineModel</code>，从 Vue 3.4 起提供。它返回一个<strong>可读写的 ref</strong>：读它就是当前的绑定值；给它赋值时，<strong>既更新本地状态，又自动帮父组件派发 update 事件</strong>。于是子组件里不再需要手写 prop、也不再需要手写 emit。
    </p>
    <p>
      命名绑定的写法同样直白：<code>defineModel('frequency')</code> 对应的就是父组件的 <code>v-model:frequency</code>。<strong>宏里的名字必须与 <code>v-model</code> 后面的后缀保持一致</strong>，一个组件里也可以声明多个 <code>defineModel</code>，各管一个绑定项。
    </p>
    <p>
      需要默认值、必填或本地转换时，把它们写进第二个参数：<code>defineModel('enabled', { default: false })</code> 就声明了一个默认关闭的开关。至于修饰符，<code>defineModel</code> 的第二个返回值就是修饰符对象——<strong>解构出来读一下 <code>trim</code> 是否为真</strong>，就能在子组件内决定要不要清洗输入，父组件不必再重复处理。
    </p>
    <ol class="lesson-steps">
      <li>父组件用 <code>v-model:enabled</code>、<code>v-model:frequency</code>、<code>v-model:label.trim</code> 绑定子组件。</li>
      <li>子组件用 <code>defineModel</code> 声明同名模型，不再手写 props 与 emits。</li>
      <li>用户交互时直接给返回的 ref 赋值，Vue 自动向父组件派发 update 事件。</li>
      <li>对带修饰符的字段，从解构出的修饰符对象读取 <code>trim</code> 决定是否清洗输入。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>使用前必须确认的两点：</strong><code>defineModel</code> <strong>只能在 <code>script setup</code> 中使用</strong>，且<strong>项目里的 Vue 版本要达到 3.4 及以上</strong>，低版本跑不起来。另外，旧的 <code>modelValue</code> 加 <code>emit</code> 的写法仍然被支持，所以可以逐步替换；但新写的组件建议直接用它，减少样板。
    </div>
    <p>
      回到开场那个弹窗：现在「开关」「频率」「备注」三处绑定，在子组件里就是三行声明加一句修饰符判断，模板与逻辑各归其位，读起来几乎和需求描述一一对应。
    </p>

    <div class="lesson-box hint">
      <strong>为什么推荐用命名模型：</strong>一个组件虽然可以声明多个 <code>defineModel</code>，但不带名字的那个默认对应最普通的 <code>v-model</code>。开关、频率这类有明确含义的字段，用命名绑定 <code>v-model:enabled</code> 更能表达意图，父组件读起来也一目了然。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换开关与频率、输入备注，观察父组件的绑定值如何被子组件直接更新。</figcaption>
      <K38DefineModel />
    </figure>

    <h2>总结</h2>
    <p>
      <code>defineModel</code> 并没有改变单向数据流的规则，它只是把「prop 加 update 事件」这套样板交给了编译器：你拿到的还是一个受控的 ref，赋值时框架替你同步给父组件。少写的是重复代码，守住的是同一套响应式与可预测性。
    </p>
    <div class="lesson-term">
      <span class="term-name">「defineModel」</span>是 Vue 3.4 起提供的编译器宏，把「<code>modelValue</code> prop 加 <code>update:modelValue</code> 事件」收敛成一行声明，<strong>仅在 <code>script setup</code> 中可用</strong>。它返回一个可读写 ref，赋值时既更新本地状态又自动派发 update 事件；<code>defineModel('frequency')</code> 对应 <code>v-model:frequency</code>，第二个返回值是修饰符对象（如 <code>trim</code>），默认值与必填等配置写在第二个参数里。
    </div>
  </LessonArticle>
</template>
