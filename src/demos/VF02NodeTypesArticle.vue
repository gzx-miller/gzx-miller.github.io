<script setup lang="ts">
import VF02NodeTypes from './VF02NodeTypes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>流程起点那个节点，我死活连不进去；终点那个节点，我又死活拖不出线——是我的写法错了，还是它们本来就不能这么连？
    </div>

    <h2>报销审批流建模</h2>
    <p>
      用 Vue Flow 画一张报销审批流：左边是「提交报销单」，中间是「组长审批」这类环节，右边是「归档结束」。你希望数据流方向与视觉方向一致——起点在左、终点在右，中间的线从左往右推。问题出现在动手连线的第一刻：从「提交报销单」往外拖，可以；可要往它上面连一根进来的线，怎么拖都接不上。
    </p>
    <p>
      这其实不是 bug，而是节点类型在起作用。一个流程天然有<strong>三种角色</strong>：有起点（只能出发）、有终点（只能抵达）、还有大量中间环节（既能进、也能出）。如果所有节点长得一样、连接方向不加约束，用户完全可以画出「终点又冒出一条出线」「起点被别的节点指进来」这类在业务上毫无意义的图。<strong>类型要解决的，就是把这种方向约束交给引擎，而不是靠事后人工检查。</strong>
    </p>

    <h2>全向连接方案</h2>
    <p>
      最省事的做法：所有节点都不写类型，让它们一律「既能进、又能出」，谁想连谁就连谁。这个方案对在哪里？<strong>它保证了下限：至少任何一个节点都能参与连线</strong>，不会出现「某个节点谁都连不上」的尴尬，对于画一张随便的草图来说确实够用了。
    </p>

    <h2>方向约束缺失</h2>
    <ul>
      <li>起点旁边挂着一堆进线、终点又往外冒线，图形在语义上自相矛盾。</li>
      <li>用户只能靠「拖一下试试」来发现节点到底是起点还是终点，交互反馈为零。</li>
      <li>想统一调整「起点/中间/终点」的视觉风格时，没有分类可依据，只能一个个改。</li>
      <li>数据流方向与画面方向全靠约定，没有东西替你保证。</li>
    </ul>

    <h2>三类连接桩方向</h2>
    <p>
      不推翻「节点都能参与连线」，而是给它加一维<strong>方向的约束</strong>。Vue Flow 内置了三种节点类型，它们的差别只在<strong>连接桩的方向</strong>上：
    </p>
    <table>
      <thead>
        <tr>
          <th>类型</th>
          <th>拥有的连接桩</th>
          <th>典型角色</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>input</code></td>
          <td>只有 source 桩，只能连出</td>
          <td>流程起点，如「提交报销单」</td>
        </tr>
        <tr>
          <td><code>default</code></td>
          <td>同时有 source 与 target 桩</td>
          <td>中间环节，如「组长审批」</td>
        </tr>
        <tr>
          <td><code>output</code></td>
          <td>只有 target 桩，只能连入</td>
          <td>流程终点，如「归档结束」</td>
        </tr>
      </tbody>
    </table>
    <p>
      用法极其简单：起点节点声明 <code>type: 'input'</code>，终点声明 <code>type: 'output'</code>，<strong>中间环节干脆省略 type</strong>——因为 <code>type</code> 不写时的默认值就是 <code>default</code>。布局上也顺势把 <code>input</code> 放最左、<code>output</code> 放最右，让画面方向与数据流方向重合，阅读时视线不用来回折返。
    </p>
    <p>
      有一个细节值得记住：<code>default</code> 这类节点的 target 桩<strong>默认停靠在上边</strong>、source 桩<strong>默认停靠在下边</strong>。所以当你把节点横向排成一排时，连线会从上一个节点的底部绕到下一个节点的顶部，形成一条弧线。理解这一点，就明白为什么布局和桩位要一起考虑。
    </p>
    <p>
      至于颜色，三种类型的主色由各自 CSS 变量 <code>--vf-node-color</code> 定义，官方默认是蓝/黑/粉。本站为了贴合主题，用变量覆盖改成了森林绿、栗棕、枫叶红。需要统一样式时，在主题文件里分别覆盖 <code>.vue-flow__node-input</code>、<code>.vue-flow__node-default</code>、<code>.vue-flow__node-output</code> 的这个变量即可。
    </p>
    <div class="lesson-box warn">
      <strong>两点容易踩的坑：</strong>其一，类型<strong>只管连接桩的方向，不含任何业务语义</strong>——想承载课程卡片这类富信息卡片，得用自定义节点，别指望它。其二，同一个节点其实可以挂多个 source/target 桩，一旦靠 <code>id</code> 区分它们，连线就必须携带对应的 handle id，这是下一课的重点。此外，覆盖 <code>--vf-node-color</code> 时只改主色、不要大改结构，否则升级官方样式后容易错位。
    </div>

    <h2>拖拽连接桩演示</h2>
    <figure class="lesson-figure">
      <figcaption>试从「组长审批」的右侧连接桩拖一根线到「出纳打款」，体会 default 可发可收。</figcaption>
      <VF02NodeTypes />
    </figure>

    <h2>连接桩方向语义</h2>
    <p>
      内置节点类型的全部差别，就是<strong>连接桩的方向</strong>：<code>input</code> 只出不进、<code>output</code> 只进不出、<code>default</code> 双向，<code>type</code> 不写即 <code>default</code>。「起点连不进来、终点连不出去」是类型在正常工作，而不是故障报告。把方向约束交给类型，图在语义上就先立住了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「内置节点类型」</span>指 Vue Flow 提供的 <code>input</code> / <code>default</code> / <code>output</code> 三种节点，差别仅在连接桩方向：<code>input</code> 只有 source 桩（只连出），<code>output</code> 只有 target 桩（只连入），<code>default</code> 两者兼有，<code>type</code> 缺省即为 <code>default</code>。主色由各自 <code>--vf-node-color</code> 控制；类型只约束方向，不含业务语义。
    </div>
  </LessonArticle>
</template>
