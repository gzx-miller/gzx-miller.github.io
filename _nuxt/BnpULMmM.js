const n=`<script setup lang="ts">
import K09Communication from './K09Communication.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>页面主题色由最外层决定，可真正需要变色的标签藏在好几层组件深处——难道主题得一层层往下传？
    </div>

    <h2>顶层主题与深层消费</h2>
    <p>
      你在做一个课程站，需要「主题切换」：最外层选一个主题色，页面里任意深度的按钮、标签、提示条都要跟着变色。数据源头只有一个，使用它的组件却散落在很深的层级里。
    </p>
    <p>
      麻烦在于：<strong>源头和使用者之间隔着好几层组件，而这些中间层根本不关心主题</strong>。中间的布局组件只是把子组件套起来，它们没有任何业务理由去碰这份数据。
    </p>

    <h2>属性下传与事件上抛</h2>
    <p>
      最直接的做法：父子之间用两条腿走路——<strong>props 往下传值、emits 往上通知</strong>。源头把主题作为 prop 交给儿子，儿子再交给孙子，一路传到需要它的那一层。
    </p>
    <p>
      这个方案做对了核心的一件事：<strong>数据流单向、可追溯</strong>。谁传给了谁，顺着代码就能看明白。当层级只有一两层时，它足够清晰，也最容易调试。
    </p>

    <h2>中间层透传负担</h2>
    <ul>
      <li>中间层被迫当「二传手」，自己不用的数据也得原样接住再往下传。</li>
      <li>链条一深，加一个字段就要改动整条路径上的每一个组件。</li>
      <li>中间层堆满与业务无关的 props，把真正的意图淹没掉。</li>
      <li>主题、语言、表单上下文这类「环境能力」本就不是父子关系，硬套逐层传值很别扭。</li>
    </ul>

    <h2>依赖注入直达通道</h2>
    <p>
      不推翻单向数据流，而是给它加一条<strong>直达通道</strong>：由上层组件 <code>provide</code> 注入一份能力，任意深度的后代用 <code>inject</code> 取用，<strong>中间层完全无需感知</strong>。这就是依赖注入。
    </p>
    <ol class="lesson-steps">
      <li>上层组件维护 <code>theme</code>，并通过 <code>provide</code> 暴露给后代。</li>
      <li>后代组件用 <code>inject</code> 取得同一个主题。</li>
      <li>用户切换主题时，依赖它的后代视图自动更新。</li>
      <li>在深层后代中使用该主题，验证中间层一个字都不用改。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>最容易踩的坑：</strong><code>provide</code> 出去的<strong>普通值默认不是响应式的</strong>。要让后代跟着变化，必须提供 <code>ref</code> 或 <code>reactive</code> 对象本身，而不是它的当前值——否则切换主题时，后代只会看到最初那一份快照。
    </div>
    <p>
      边界也要划清：依赖注入适合<strong>主题、表单上下文、组件库配置</strong>这类相对稳定的上下文能力；而频繁变化、又需要跨页面共享的业务状态，更适合交给 Pinia 这样的状态库，别让注入通道变成万能口袋。组件规模变大后，建议用 <code>Symbol</code> 作为注入 key，避免字符串重名冲突；<code>inject</code> 的第二个参数还能给一个默认值，缺失提供者时后代也能安全运行。
    </p>

    <p>
      把三种做法放在一起对照，选择的依据就清楚了：距离近、关系明确的数据走父子两条腿；跨层的稳定上下文交给依赖注入；高频变化的全局业务状态则用状态库承接。
    </p>
    <table>
      <thead>
        <tr>
          <th>场景</th>
          <th>推荐方式</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>父子直接传递、需要保持单向可追溯</td>
          <td>props 向下、emits 向上</td>
        </tr>
        <tr>
          <td>跨越多层、相对稳定的上下文能力</td>
          <td>provide / inject</td>
        </tr>
        <tr>
          <td>频繁变化、跨页面共享的业务状态</td>
          <td>Pinia 等状态库</td>
        </tr>
      </tbody>
    </table>

    <h2>主题切换深层跟随</h2>
    <figure class="lesson-figure">
      <figcaption>切换上方主题，观察深层子组件如何直接跟随变化。</figcaption>
      <K09Communication />
    </figure>

    <h2>组件通信选型原则</h2>
    <p>
      组件通信按距离选工具：父子之间用 props 向下、emits 向上，数据流单向清晰；跨越多层、又更像「环境能力」时，改用 provide 与 inject，让中间层彻底无感。记住注入值默认非响应式，传 <code>ref</code> 或 <code>reactive</code> 后代才会跟随变化。
    </p>
    <div class="lesson-term">
      <span class="term-name">「依赖注入」</span>指上层组件用 <code>provide</code> 向下提供一份能力，任意深度的后代用 <code>inject</code> 读取，中间层无需参与。它适合主题、表单上下文、组件库配置等稳定上下文；注入普通值默认非响应式，需提供 <code>ref</code> 或 <code>reactive</code> 才能随变化更新，频繁变化的共享业务状态则应交给 Pinia。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
