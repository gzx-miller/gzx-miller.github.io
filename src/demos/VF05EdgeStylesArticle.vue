<script setup lang="ts">
import VF05EdgeStyles from './VF05EdgeStyles.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>订单流程图里「锁定库存」和「核销优惠券」两条支线都汇到「仓库打包」，可画出来五条线长得一模一样——哪条是主线、哪条是绕过分支，凭什么让我一眼看出来？
    </div>

    <h2>订单图边数据</h2>
    <p>
      你在画一张订单履约流程图。数据模型其实已经很清楚：<code>nodes</code> 摆好节点，<code>edges</code> 用 <code>source</code> 与 <code>target</code> 写好连接关系，画布照着把线一根根拉出来。麻烦出现在下一句——<strong>这些线全长一个样</strong>：同样的弧度、同样的粗细、同样没有方向。于是这张图只能「看得到结构」，却「读不出信息」：哪条是正常主流程、哪条是异常绕行、数据往哪个方向流，全靠盯着节点位置去猜。
    </p>
    <p>
      如果不给线赋予形态，流程图就退化成一堆连线的集合，节点越多越没人愿意看。真正要解决的是：<strong>怎么让「关系」本身也携带语义</strong>，让读图的人不用点开任何节点就能分清主次。
    </p>

    <h2>默认连线绘制</h2>
    <p>
      最省事的做法是接受默认：所有边都交给 Vue Flow 自己画。连线路径它会根据两个节点的位置自动算出一条贝塞尔曲线，起止点、弧度都不需要你操心。
    </p>
    <p>
      这个方案对在一件事上：<strong>它先保证了「连对」</strong>。只有 edges 的关系数据是准确的，后面才有谈样式的余地；反过来先急着调外观、关系却连错了，等于在一张错图上精装修。图只有三五个节点时，默认形态确实够用。
    </p>

    <h2>方向提示缺失</h2>
    <ul>
      <li>五条线一个样，主路径和分支路径没有视觉差异，阅读顺序全靠人脑补。</li>
      <li>没有任何方向提示，谁指向谁得靠节点左右位置反推，绕行的分支尤其容易读反。</li>
      <li>关键链路（比如「用了券」这种特殊分支）混在普通线里，一眼扫不到。</li>
      <li>想统一调整所有新连线的形态，却没有全局出口，只能挨个 edge 去改 <code>type</code>。</li>
    </ul>

    <h2>路径装饰默认值</h2>
    <p>
      不推翻默认连线，而是给每条边装上「表达三件套」——<strong>路径、装饰、全局默认</strong>。
    </p>
    <p>
      第一件是路径。Vue Flow 内置五种边路径，差别全在「两个点之间怎么连」。写法只是 <code>type</code> 上的一个字符串，适用场景却相当分明：
    </p>
    <table>
      <thead>
        <tr>
          <th>路径 type</th>
          <th>画法</th>
          <th>适合场景</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>贝塞尔曲线，两端平滑起弧</td>
          <td>不指定时的默认形态，节点分布自由、想要柔和观感</td>
        </tr>
        <tr>
          <td><code>straight</code></td>
          <td>直线，两点直接相连</td>
          <td>强调直线距离、线条越简越好的极简图</td>
        </tr>
        <tr>
          <td><code>step</code></td>
          <td>直角折线，横平竖直</td>
          <td>管线、电路一类强调正交走向的图</td>
        </tr>
        <tr>
          <td><code>smoothstep</code></td>
          <td>圆角折线，直角处圆滑过渡</td>
          <td>既要规整正交、又要柔和观感（本课默认）</td>
        </tr>
        <tr>
          <td><code>simplebezier</code></td>
          <td>简化贝塞尔，控制点更收敛</td>
          <td>节点密集、不想让曲线甩得太开</td>
        </tr>
      </tbody>
    </table>
    <p>
      第二件是装饰，写在单个 edge 对象上。<code>label</code> 放文字，把「用了券」这类条件标在线的中点上；<code>animated</code> 加流动虚线，让这条线动起来，天然吸引视线；<code>markerEnd</code> 配 <code>MarkerType.ArrowClosed</code> 收一个实心箭头，方向立刻可读；<code>style</code> 覆盖描边，例如 <code>{ stroke: 'var(--leaf-red)', strokeWidth: 2 }</code> 就能把重点线加粗染红。
    </p>
    <div class="lesson-box hint">
      <strong>小技巧：</strong><code>style</code> 里的 <code>stroke</code> 直接写 CSS 变量，深浅主题切换时线条颜色跟着站点自动换，不必为两套主题各维护一份色值。
    </div>
    <p>
      第三件是全局默认。<code>:default-edge-options</code> 一次配好「之后新建的连线」的默认形态，本课顶部切换按钮改的正是它的 <code>type</code>。
    </p>
    <div class="lesson-box warn">
      <strong>最容易踩的坑：</strong><code>default-edge-options</code> 只影响<strong>之后新建</strong>的连线；已经存在的 edge 形态由它自身的 <code>type</code> 字段决定。所以点按钮时原有五条线纹丝不动，只有你新拉的那条才会变——这不是 bug，而是「已有数据优先于默认值」的预期行为。
    </div>
    <p>
      还有两处细节值得记牢。其一，<code>MarkerType</code> 枚举要从 <code>@vue-flow/core</code> 正确导入，手拼箭头字符串很容易踩上符号错误；其二，默认边的 <code>label</code> 渲染在 SVG 文本层，纯文字场景够用，一旦标签里要塞按钮、输入框这类结构，就得换成自定义连线加 <code>EdgeLabelRenderer</code>，那正是下一课要讲的事。
    </p>

    <h2>五种路径差异</h2>
    <figure class="lesson-figure">
      <figcaption>切换顶部按钮看五种路径的差异，再留意「用了券」那条被单独点亮的边。</figcaption>
      <VF05EdgeStyles />
    </figure>

    <h2>连线表达语义</h2>
    <p>
      连线的形态，本质上是把「关系」从结构升级成表达。<code>type</code> 选路径、<code>label</code> 写条件、<code>animated</code> 提主次、<code>markerEnd</code> 标方向、<code>style</code> 做区分，全局则用 <code>:default-edge-options</code> 兜底。记住默认值只管新连线、老边只认自己的 <code>type</code>，这张图就从「能看」变成了「能读」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「边路径类型」</span>指 <code>edge.type</code>，内置五种：<code>default</code>（贝塞尔）、<code>straight</code>（直线）、<code>step</code>（直角折线）、<code>smoothstep</code>（圆角折线）、<code>simplebezier</code>（简化贝塞尔）。单条边的 <code>label</code> / <code>animated</code> / <code>markerEnd</code> / <code>style</code> 写在 edge 对象上，全局默认由 <code>:default-edge-options</code> 提供，且只对之后新建的连线生效。
    </div>
  </LessonArticle>
</template>
