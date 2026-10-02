const n=`<script setup lang="ts">
import S11VuexMigration from './S11VuexMigration.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个用 Vuex 写了三年的购物车项目，改一个字段要在 <code>state</code>、<code>mutations</code>、<code>actions</code> 之间来回跳；想换成 Pinia，可线上功能天天在迭代，到底怎么换才不至于一换就崩？
    </div>

    <h2>存量Vuex模块</h2>
    <p>
      你要接手一个存量项目：它用 Vuex 组织状态，按业务拆成好几个 module，每个 module 都开了 <code>namespaced: true</code>，组件里靠 <code>mapState</code>、<code>mapActions</code> 取用。项目仍在持续迭代，每天都有人合代码。你心里有两个念头：Pinia 确实更顺手；可这套旧的还能跑，动它的风险看起来很大。
    </p>
    <p>
      真正的难点不在于「会不会写 Pinia」，而在于<strong>怎么在不停机的前提下，把一个正在运行的状态层换掉</strong>。好消息是：Vuex 和 Pinia 并非两套毫不相干的东西，它们只是对同一件事的两组命名。只要先看清概念之间的一一对应，迁移就能从「玄学重构」变成一件可以拆开做、随时停下的普通工作。
    </p>

    <h2>分支整体重写</h2>
    <p>
      最省心的做法是拉一个分支把它一次重写干净：删掉 Vuex，按 Pinia 的语法把所有 module 重新写一遍，测通了再合并上线。
    </p>
    <p>
      这个方案做对了一件重要的事：<strong>它承认目标形态是 Pinia 的独立 store，而不是继续往 Vuex 里糊补丁</strong>。方向没错，问题出在执行粒度——它把一次跨度很长、牵涉所有页面的改动，捆成了一个不可分割的整体。
    </p>

    <h2>整体重写风险</h2>
    <ul>
      <li>重写期间分支会不断积累冲突，越晚合并越难合。</li>
      <li>中途任何一步出问题都无法单独回滚，只能整体推倒。</li>
      <li>其他成员在旧代码上的新功能，会被迫一起改成新写法。</li>
      <li>没有中间状态可验证，风险全压在最后那一次上线。</li>
      <li>一次性重写容易顺手把无关行为一并「优化」，出问题难定位。</li>
    </ul>

    <h2>逐模块迁移方案</h2>
    <p>
      不推翻「换成 Pinia」，而是把「一次全换」改成<strong>按模块逐个换</strong>。要做到这一点，先建一张概念映射表，让每一步都有明确的对应关系，而不是临场发挥。
    </p>
    <table>
      <thead>
        <tr>
          <th>Vuex 里的概念</th>
          <th>Pinia 里的对应物</th>
          <th>迁移时的动作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>state</code></td>
          <td><code>ref</code> 定义的状态</td>
          <td>原样搬进 store，取出时不再写 <code>this.$store</code></td>
        </tr>
        <tr>
          <td><code>getters</code></td>
          <td><code>computed</code> 定义的 getter</td>
          <td>改写成 computed，保留原有的派生逻辑</td>
        </tr>
        <tr>
          <td><code>mutations</code>（同步）</td>
          <td>没有这一层</td>
          <td>把同步改动并入对应的 action，直接赋值</td>
        </tr>
        <tr>
          <td><code>actions</code>（可异步）</td>
          <td>普通函数 action</td>
          <td>搬为函数即可，同步异步写法一致</td>
        </tr>
        <tr>
          <td><code>modules</code> 加 <code>namespaced</code></td>
          <td>多个独立 store</td>
          <td>一个 module 一个 store，store id 就是命名空间</td>
        </tr>
      </tbody>
    </table>
    <p>
      有了映射表，每个 module 的迁移就成了对照翻译。其中最关键的其实是 <code>mutations</code> 那一格：Vuex 要求同步改动也必须提交 mutation，Pinia 直接删掉这层，<strong>同步和异步的状态修改都统一写在 action 里</strong>，不再有「该用哪层」的犹豫。
    </p>
    <ol class="lesson-steps">
      <li>列出全部 module，为每个 module 标注它依赖了谁，排出迁移顺序。</li>
      <li>把每个 module 映射成一个独立 store，store 之间用 <code>useXxxStore()</code> 互相引用。</li>
      <li>把 mutations 里的同步改动并入对应 action，getters 改写为 store 的 computed。</li>
      <li>从依赖最少、最独立的 module 开始切，用一个开关决定该状态当前走哪条读写路径。</li>
      <li>全部切换完成后，再删除 Vuex 依赖与残留代码，状态层收敛为单一来源。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>迁移期最危险的坑：</strong>新旧两套并存时，<strong>同一份状态绝不能被 Vuex 和 Pinia 两边同时写入</strong>，否则你会看到数据莫名被覆盖。危险改动拆成小步提交并跑测试，保证任何一步都能安全回滚。
    </div>
    <p>
      还有两个细节值得提前记住。Vuex 里的 <code>namespaced: true</code> 与模块互相 import 的写法，在 Pinia 里都不再需要——<strong>store id 天然就是命名空间</strong>，需要别的 store 直接引入即可。另外 Pinia 的类型推导更完整，迁移时顺手补上类型标注，收益会立刻体现在编辑器里。
    </p>

    <div class="lesson-box hint">
      <strong>怎么判断一步迁移可以合并了：</strong>把该模块相关页面的读写都切到新 store 后，跑一遍原有的功能测试与手测路径；确认 Vuex 那一侧已没有任何读写，再删除旧代码。判断标准是「旧路径已无人使用」，而不是「新代码看起来写完了」。
    </div>

    <h2>两种写法对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 Vuex 与 Pinia 两种模式，对照同一件「加购」在两种写法下的差别。</figcaption>
      <S11VuexMigration />
    </figure>

    <h2>渐进重构路径</h2>
    <p>
      从 Vuex 迁移到 Pinia，本质上不是重写，而是一次有映射表可依的渐进重构：概念先对齐，再按模块逐个切换，用开关控制读写路径，直到最后才移除旧依赖。这样每一步都可验证、可回滚，线上也就不会被一次大爆炸拖下水。
    </p>
    <div class="lesson-term">
      <span class="term-name">「渐进式迁移」</span>指不一次性重写，而是先做 API 映射再按模块逐个切换：<code>state</code> 搬到 <code>ref</code>、<code>getters</code> 改写为 <code>computed</code>、<code>mutations</code> 并入 action、module 升级为独立 store（id 即命名空间）。迁移期间新旧并存，<strong>同一状态只允许一侧写入</strong>，全部完成后才移除 Vuex。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
