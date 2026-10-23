const d=`<script setup lang="ts">
import VF09StateManage from './VF09StateManage.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>接口回调里想往画布上补一个「质检环节」节点，可那个回调只是个普通函数，既拿不到画布组件，也够不着父组件里的 <code>nodes</code> 数组——难道只能一路 <code>emit</code> 到顶层，让别人替我改数据吗？
    </div>

    <h2>组件树外调用</h2>
    <p>
      真实业务里的流程图从来不是静态的。用户点了「开始质检」，请求回来的结果决定要在图里插一个节点；推送来了新状态，要把某个节点标成已完成；图改完一轮，还要把视野重新收拢到全部节点上。而这些动作的发起者，往往并不是画布本身，而是工具栏按钮、定时器、WebSocket 回调，甚至另一个毫不相干的模块。
    </p>
    <p>
      用 <code>v-model:nodes</code> 的写法本身没问题：数据源是父组件里的一个数组，改数组就等于改图。麻烦出在<strong>「谁有资格改那个数组」</strong>——数组属于某个组件，只有这棵子树里的人才看得见它。一旦逻辑跑到组件树之外，你就同时丢掉了读和写的入口。
    </p>

    <h2>事件逐层上抛</h2>
    <p>
      最自然的补法：需要加节点的子组件调 <code>emit('add', payload)</code>，父组件监听后往数组里追加一条新节点；要标记完成就 <code>emit('done', id)</code>，父组件遍历数组改掉对应节点的 <code>data.label</code>。事件把意图往上送，改数据的事只发生在唯一的地方。
    </p>
    <p>
      这个方案做对了最关键的一件事：<strong>数据源唯一，改数据即改图</strong>。画布只是那个数组的一面镜子，没有任何一份业务状态藏在组件内部，调试时看着数组就能推断画面。这条原则必须保留。
    </p>

    <h2>逐层透传链路</h2>
    <ul>
      <li>事件要一层层向上透传，嵌套几层之后链路长到没人敢删其中任何一环。</li>
      <li>接口回调、定时器、全局命令面板这些位置根本不是组件，没有 <code>emit</code> 可调。</li>
      <li>业务数据在父组件，交互状态（选中、拖拽中、实际渲染尺寸）却在画布内部，两边各维护一份，容易对不上。</li>
      <li>想做「按 id 找到某个节点并选中它」，还得自己写查找与响应式替换，等于把画布的能力重新实现一遍。</li>
    </ul>

    <h2>画布实例暴露</h2>
    <p>
      不推翻「数据源唯一」，换一个入口：让画布把这套状态和操作能力<strong>主动暴露出来</strong>，谁能调到它，谁就能操作图。这就是 <code>useVueFlow()</code>——一个组合式函数，调用即可拿到当前画布的响应式实例。
    </p>
    <p>
      它给出两类东西。一类是状态：<code>nodes</code>、<code>edges</code> 是实时响应式数据，运行态下是带有选中、尺寸等字段的 <code>GraphNode</code> 与 <code>GraphEdge</code>，读它们的长度就得到了节点数与连线数。另一类是方法，覆盖增删改查：
    </p>
    <table>
      <thead>
        <tr>
          <th>方法</th>
          <th>作用</th>
          <th>注意点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>addNodes / addEdges</code></td>
          <td>追加节点或连线</td>
          <td>落点坐标要按画布坐标系给</td>
        </tr>
        <tr>
          <td><code>removeNodes / removeEdges</code></td>
          <td>按 id 删除</td>
          <td>删节点前先清掉与它相连的边</td>
        </tr>
        <tr>
          <td><code>updateNode / updateEdge</code></td>
          <td>改任意字段，例如 <code>position</code></td>
          <td>适合布局写回这类整体替换</td>
        </tr>
        <tr>
          <td><code>updateNodeData</code></td>
          <td>只浅合并 <code>data</code></td>
          <td>不触碰位置等其他字段</td>
        </tr>
        <tr>
          <td><code>findNode / findEdge</code></td>
          <td>按 id 查找</td>
          <td>返回 <code>GraphNode</code>，可直接置 <code>selected</code></td>
        </tr>
        <tr>
          <td><code>fitView</code></td>
          <td>把全部节点收进视野</td>
          <td>可传 <code>padding</code>、<code>duration</code> 做动画</td>
        </tr>
      </tbody>
    </table>
    <p>
      还要留意一点：实例暴露出来的 <code>nodes</code> 与初始传入的那个数组<strong>并不是同一个对象</strong>。传入只是给了起始值，之后实例内部维护的是运行时的图结构，额外带着选中、尺寸等字段。所以别拿旧数组去比较「是不是同一份」，要读就读实例的。
    </p>
    <p>
      有了这层接口，业务代码不再需要「把意图翻译成事件往上抛」，而是就地操作画布。比如新增质检节点之后想顺手收拢视野，直接 <code>await fitView({ padding: 0.2, duration: 300 })</code>；想把「拣货打包」标成完成，<code>updateNodeData('pick', { label: '拣货打包 ✓ 已完成' })</code> 只动 <code>data</code>，位置纹丝不动。
    </p>
    <p>
      反向联动也顺了：从侧边列表点一项，用 <code>findNode(id)</code> 拿到节点对象，把它的 <code>selected</code> 置为 <code>true</code>，画布就替你选中了——不用自己去拼选中态数组。
    </p>
    <div class="lesson-box warn">
      <strong>两种托管模式别混用：</strong>用 <code>v-model:nodes</code> 时数据源在外部数组，用 <code>:nodes</code> 传入初始值后则由实例接管。它们在初始化那一刻就分了道，<strong>中途互换等于出现两份状态源</strong>，改了 A 却看见 B 反应。同一页面要放多张画布时，用 <code>useVueFlow({ id })</code> 指定实例，否则拿到的是同一个。
    </div>

    <h2>状态栏实时变化</h2>
    <figure class="lesson-figure">
      <figcaption>五个按钮各调一个实例方法，注意状态栏里节点数与提示文字如何随操作实时变化。</figcaption>
      <VF09StateManage />
    </figure>

    <h2>入口方式迁移</h2>
    <p>
      <code>useVueFlow</code> 把「画布」从一棵组件子树变成了一个随处可取的对象。状态仍然只有一份，只是入口从「顺着 props 和事件往上爬」换成了「直接调方法」——那些游离在组件树之外的业务代码，终于插得上手了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「useVueFlow」</span>是 Vue Flow 的组合式函数，返回当前画布的响应式实例：<code>nodes</code> / <code>edges</code> 为实时状态，<code>addNodes</code>、<code>removeNodes</code>、<code>updateNode</code>、<code>updateNodeData</code> 负责增删改，<code>findNode</code> / <code>findEdge</code> 负责查，<code>fitView</code> 收拢视野。记住 <code>updateNodeData</code> 只浅合并 <code>data</code>，且 <code>v-model</code> 与 <code>:nodes</code> 两种托管模式不可中途互换。
    </div>
  </LessonArticle>
</template>
`;export{d as default};
