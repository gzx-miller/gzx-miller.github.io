<script setup lang="ts">
import K07ComponentBasics from './K07ComponentBasics.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一张卡片明明是用父级传来的标题渲染的，子组件里改输入框却立刻变了样——到底该直接改它，还是先复制一份草稿？
    </div>

    <h2>就地编辑与数据归属</h2>
    <p>
      你在做一个课程列表：父级握着一份真实数据（课程标题），列表里每张卡片既要展示这个标题，又允许用户就地编辑，改完点「保存」才写回列表。这时候你会发现一处别扭：<strong>数据源在父级，编辑动作却发生在子级</strong>。如果子组件顺手把父级给的值改了，列表上的其他视图就会跟着抖，而「改了没改、什么时候改的」谁也说不清。
    </p>
    <p>
      问题的本质，是把一块界面拆成三件事来想：<strong>哪些信息是外部给的、哪些交互是组件自己的、改完之后怎么告诉外面</strong>。组件没有清晰的边界，就没法被安全地复用，也没法被整体替换和单独测试。
    </p>

    <h2>状态内聚与封闭</h2>
    <p>
      最省事的做法：把标题、输入框、保存后的展示值全部写成组件内部的 <code>ref</code>，所有状态都留在自己家里，用户怎么改都只影响这张卡片，父级完全不参与。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它承认组件需要自己的内部状态</strong>。编辑过程中的草稿本来就属于组件自己，没必要每敲一个字就通知外面。这个「局部状态」的想法要保留。
    </p>

    <h2>数据进出通道缺失</h2>
    <ul>
      <li>父级想传入初始标题时无从下手，数据根本进不来。</li>
      <li>用户点保存后，父级的真实数据拿不到结果，两边各说各话。</li>
      <li>同一张卡片想复用到另一处，只能把整段逻辑复制一遍。</li>
      <li>没有输入输出的约定，组件既难以组合，也难以单独测试。</li>
    </ul>

    <h2>输入交互与输出</h2>
    <p>
      不推翻「组件要有内部状态」，而是给组件划出三条明确的通道：<strong>输入、交互、输出</strong>。
    </p>
    <ul>
      <li><strong>输入用 props</strong>：父级通过属性把初始标题传进来。props 是<strong>只读</strong>的，子组件不能直接修改，更新必须由父级发起——这条纪律正是单向数据流的根。</li>
      <li><strong>输出用 emits</strong>：子组件用 <code>defineEmits</code> 声明一个 <code>saved</code> 事件，保存时把结果作为参数发出去，父级监听后更新真实数据。</li>
      <li><strong>交互用局部状态</strong>：编辑中的草稿放一个自己的 <code>ref</code>，初始值取自 props，保存前的修改不会污染父级。</li>
    </ul>
    <p>
      于是流程串成一条闭环，读代码时可以照着这几步走：
    </p>
    <ol class="lesson-steps">
      <li>用 <code>defineProps</code> 声明外部输入，用 <code>defineEmits</code> 声明对外事件。</li>
      <li>把 props 的值复制进局部 <code>draft</code>，编辑只动草稿。</li>
      <li>保存时先更新本地展示，再 <code>emit('saved', draft)</code> 把结果通知父级。</li>
      <li>父级监听 <code>saved</code> 事件、更新真实数据，单向数据流闭环完成。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>顺带一提：</strong>如果想要「输入即同步」的双向效果，不必手写 props 加事件，用 <code>v-model</code> 语法糖即可——它<strong>底层仍然是 props 加一个 update 事件</strong>，只是写法更短。用 TypeScript 声明 props 与 emits，还能把事件名和参数类型一起约束住。
    </div>
    <p>
      回头看开场的别扭：子组件改输入框之所以没事，是因为它改的是<strong>草稿</strong>而不是 props；点保存才通过事件把结果交还父级。编辑要自由，边界要清楚，这两件事并不矛盾。
    </p>

    <h2>草稿回写与保存</h2>
    <figure class="lesson-figure">
      <figcaption>改一下输入框、点保存，体会草稿与父级真实数据各自的分工。</figcaption>
      <K07ComponentBasics />
    </figure>

    <h2>组件边界与职责划分</h2>
    <p>
      组件基础就是给一块界面划出「输入 → 交互 → 输出」的边界：props 负责只读输入，emits 负责对外通知，局部状态负责组件自己的临时交互。三者各司其职，组件才可预测、可复用、可替换，也更容易被测试。
    </p>
    <div class="lesson-term">
      <span class="term-name">「单向数据流」</span>指数据只能由 props 从父级向下流入子组件，子组件不能直接修改 props；需要变更时通过 <code>emits</code> 向上通知父级，由父级更新数据后再流下来。编辑场景中未保存的内容放在组件自己的局部状态（草稿）里，保存时才用事件交还父级。
    </div>
  </LessonArticle>
</template>
