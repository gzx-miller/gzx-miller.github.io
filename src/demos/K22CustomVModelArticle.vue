<script setup lang="ts">
import { ref } from 'vue'
import K22CustomVModel from './K22CustomVModel.vue'

// 演示组件本身是「子组件」，需要父级用 v-model 把值传下去
const rating = ref(3)
const title = ref('课程评分')
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我封装的评分选择器，父组件想用 <code>v-model</code> 像原生输入框一样直接双向绑定，可子组件改了值以后，怎么让父级知道并且同步过去？
    </div>

    <h2>评分选择器用法</h2>
    <p>
      你做了一个评分选择器组件：五颗星，点一下就选中对应分数，旁边还有一个标题输入框。现在父组件想这样用它——<code>v-model="rating"</code>，拿到和原生输入框一模一样的体验：值传下去、改完自动传上来。可原生控件那套「value 加 input」的绑定是浏览器给的，你自己写的组件并没有这层魔法。
    </p>
    <p>
      所以你要回答的是：<strong>一个自定义组件，怎么把自己伪装成原生表单控件那样的双向绑定</strong>，让父级不必关心内部究竟是怎么传值的，也不必为每个组件记一套新的读写规则。
    </p>

    <h2>手动回路搭建</h2>
    <p>
      最朴素的写法是手动搭一条回路：子组件接收一个 <code>value</code> 属性作为当前值，用户点击星星时不直接改它，而是 <code>emit</code> 一个事件把新值抛出去；父组件监听这个事件、更新自己的状态，再把新值通过属性传回来。
    </p>
    <p>
      这个方案做对了最关键的一件事：<strong>它守住了单向数据流</strong>。属性只读、值靠事件上行，父子之间的数据流向清晰可追，不会出现「不知道是谁改的」这种失控局面。这也是所有双向绑定最终都要落回的地基。
    </p>
    <p>
      但要注意，这条回路你每写一个组件就要搭一次，名字还得自己定。当页面里同时有十几个需要双向绑定的自定义控件时，光是「记住每个组件用的是哪个属性名、哪个事件名」就足以让人头疼，更别说代码评审时很难一眼看出父子之间到底是怎么传值的。
    </p>

    <h2>样板代码反复</h2>
    <ul>
      <li>每做一个双向绑定的组件，都要手写一遍「属性 + 事件 + 父级更新」，样板代码反复出现。</li>
      <li>组件里若有两个都需要双向绑定的值（比如评分和标题），光靠一个约定的属性名区分不开。</li>
      <li>父级想加 <code>.trim</code> 这类修饰符时，子组件拿不到「用了什么修饰符」这一信息，没法做对应处理。</li>
    </ul>

    <h2>回路语法糖化</h2>
    <p>
      不推翻「属性 + 事件」，而是给这套回路一个统一的语法糖。组件级 <code>v-model</code> 的本质，就是 <code>modelValue</code> 属性加上 <code>update:modelValue</code> 事件的语法糖：<code>v-model="rating"</code> 等价于 <code>:modelValue="rating"</code>，再配上 <code>@update:modelValue</code>。子组件接收 <code>modelValue</code>，修改时用 <code>emit</code> 抛出 <code>update:modelValue</code> 通知父级，剩下的交给 Vue。
    </p>
    <p>
      第二个问题是「多个值」。既然默认绑定的名字是 <code>modelValue</code>，那再要一个就可以给它起名：<code>v-model:title</code> 对应子组件的 <code>title</code> 属性和 <code>update:title</code> 事件。<strong>一个组件因此可以同时挂多个 v-model</strong>，例如 <code>v-model="data"</code> 与 <code>v-model:title="name"</code> 并存，互不干扰。
    </p>
    <p>
      第三个问题是修饰符。当父级写 <code>v-model:title.trim</code>，子组件会收到一个 <code>modelModifiers</code> 对象，里面标记了 <code>trim</code> 为 <code>true</code>。组件据此自行决定如何清洗输入——<strong>修饰符的处理逻辑在组件内部完成，并不会改变父级的绑定行为</strong>。
    </p>
    <p>
      把三点合起来看，会发现这套设计其实一直在做「约定」：约定默认名字、约定事件名格式、约定修饰符对象的挂载位置。<strong>约定越统一，父级使用组件就越像使用原生控件</strong>，不必为每个组件重新记一套输入输出的名字。这也是 v-model 相比手写属性与事件最大的价值——它把「怎么通信」这件琐碎事，变成了一个所有组件通用的词汇。
    </p>
    <div class="lesson-box warn">
      <strong>迁移别踩坑：</strong>Vue3 的组件 <code>v-model</code> 默认绑定名是 <code>modelValue</code>，而 Vue2 是 <code>value</code>，从 Vue2 迁移时这里最容易漏改。另外，新代码如果要支持组件级 v-model，可以优先用 <code>defineModel</code> 宏，它能把这套属性与事件的样板收敛成一行声明。
    </div>

    <h2>同步回传父级</h2>
    <figure class="lesson-figure">
      <figcaption>点星星、输入标题，看子组件如何通过 update 事件把值同步回父级。</figcaption>
      <K22CustomVModel v-model="rating" v-model:title.trim="title" />
    </figure>

    <h2>命名约定规则</h2>
    <p>
      自定义 <code>v-model</code> 并不神秘，它只是把「属性向下传、事件向上抛」这条单向回路约定成了固定名字：默认用 <code>modelValue</code>，需要多个就加命名，需要修饰符就用 <code>modelModifiers</code> 在组件内处理。理解了这层语法糖，你就既能让组件像原生控件一样好用，又不会破坏单向数据流的清晰——组件越多，这套统一约定的收益就越明显。
    </p>
    <div class="lesson-term">
      <span class="term-name">「组件级 v-model」</span>是 <code>modelValue</code> 属性与 <code>update:modelValue</code> 事件的语法糖；命名 model（如 <code>v-model:title</code>）使用对应名称的属性与 <code>update:</code> 事件；<code>modelModifiers</code> 让组件内部感知并处理 <code>.trim</code> 这类修饰符。注意 Vue3 默认名是 <code>modelValue</code>（Vue2 为 <code>value</code>），新代码可用 <code>defineModel</code> 宏替代手写样板。
    </div>
  </LessonArticle>
</template>
