<script setup lang="ts">
import VF01FirstFlow from './VF01FirstFlow.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我在 Vue3 项目里想画一张学习路径图，用一堆绝对定位的 <code>div</code> 摆好了节点，可连线怎么都对齐不上——难道一定要自己算坐标、画折线、处理缩放吗？
    </div>

    <h2>流程图常见形态</h2>
    <p>
      流程图是前端非常常见的一类界面：审批流、依赖关系、学习路径、组织架构，本质上都是「一堆方块，再加上方块之间的连线」。第一反应通常是手工实现：用绝对定位的 <code>div</code> 当节点、用 <code>svg</code> 或 <code>canvas</code> 画线，位置自己写死。
    </p>
    <p>
      这套做法的代价会随着图变大而迅速显现。节点一挪动，所有连到它的线都要重算；用户一旦缩放平移画布，屏幕坐标与画布坐标就分家了，你写下的每一个坐标都要判断「现在是处在哪个坐标系里」。更麻烦的是，拖动、框选、删除、连线这些交互，全部要自己从零实现一遍。<strong>结果就是：大部分时间花在画布引擎上，而不是花在业务图形上。</strong>
    </p>

    <h2>节点加连线模型</h2>
    <p>
      最朴素的做法，也是手工派会先写出来的版本：节点是定好 <code>top/left</code> 的方块，连线是一条从一个节点中心指向另一个节点中心的直线。这个模型本身没有错——<strong>它做对了一件关键的事：承认了「节点是一个带坐标的方块，连线是两点之间的一条路径」</strong>。真正的信息只有两部分：谁来、连谁。剩下的都是渲染细节。
    </p>
    <p>
      既然信息只有两部分，那有没有可能我们只声明这两部分，把渲染和交互全部交出去？
    </p>

    <h2>位置变化的连锁</h2>
    <ul>
      <li>拖动节点后连线不会自己重算，必须监听位置变化并重新绘制，节点越多越难维护。</li>
      <li>缩放与平移要自己维护 <code>transform</code> 和坐标系，屏幕坐标换成画布坐标极易算错。</li>
      <li>框选、删除、连接这些交互没有现成能力，每个都要手写，工作量远超预期。</li>
      <li>节点内容一复杂，文档流的布局规则和画布坐标就混在一起，谁也说不清位置从哪来。</li>
    </ul>

    <h2>声明与渲染分离</h2>
    <p>
      不推翻「节点 + 连线」这个模型，而是把「画」和「算」彻底拆开：<strong>业务只负责声明数据，画布引擎负责把它渲染出来并接管交互</strong>。Vue Flow 就是按这个思路设计的，它把图拆成两组数据。
    </p>
    <p>
      第一组是 <code>nodes</code>。每个节点至少要有三个字段：<code>id</code> 唯一标识、<code>position</code> 画布坐标、<code>data.label</code> 显示文字；可选字段 <code>type</code> 决定它渲染成什么形式。要特别记住一点：<strong><code>position</code> 指的是画布坐标系里的位置，而不是常规文档流的定位</strong>，缩放平移之后它并不会跟着变。
    </p>
    <p>
      第二组是 <code>edges</code>。每条边只需要 <code>id</code>、<code>source</code>、<code>target</code> 三个字段，后两者写的是节点 id。连线的路径、折法、箭头方向，全部由库根据两端节点的实时位置自动计算——你不需要关心它从哪个点绕过去。
    </p>
    <p>
      把两组数组用 <code>v-model:nodes</code> 与 <code>v-model:edges</code> 双向绑定到 <code>&lt;VueFlow&gt;</code> 上，拖动节点时数组里的 <code>position</code> 会自动更新，连线也会跟着重画。安装方式是独立的包 <code>@vue-flow/core</code>。
    </p>
    <div class="lesson-box warn">
      <strong>一个必须先排掉的坑：</strong>官方样式有两套，且<strong>必须同时引入</strong>——<code>style.css</code> 负责结构布局，<code>theme-default.css</code> 负责默认配色，缺任何一个画布都不可用。凡是遇到「画布一片空白或节点位置全乱」，第一件事就是回头确认这两行样式有没有漏。
    </div>
    <p>
      再补两个初始化参数：<code>fit-view-on-init</code> 让首帧自动把整张图收进视口，<code>min-zoom</code> 与 <code>max-zoom</code> 限定缩放范围（本课设为 <code>0.5</code> 到 <code>1.5</code>），避免用户把画布缩到看不见或放到无限大。
    </p>
    <p>
      最后是数据回写的礼节。直接改 <code>nodes[0].position.x</code> 这类数组元素也会生效，但更推荐<strong>整体替换数组、或者走实例方法</strong>，这样每一次变更的来源都清晰可追踪。事件参数也要留意：<code>@node-click</code> 收到的是<strong>单个事件对象</strong>（包含 <code>event</code> 与 <code>node</code>），业务字段统一从 <code>node.data</code> 里取，而不是从事件对象顶层取。
    </p>

    <h2>数据与视口联动</h2>
    <figure class="lesson-figure">
      <figcaption>拖动节点、滚轮缩放、点一下节点，观察数据与视口如何联动。</figcaption>
      <VF01FirstFlow />
    </figure>

    <h2>图由数据描述</h2>
    <p>
      第一个流程图要建立的心智模型只有一句话：<strong>用 <code>nodes</code> 和 <code>edges</code> 描述图，其余交给画布</strong>。安装 <code>@vue-flow/core</code>、引入两套官方样式、准备两组数组并双向绑定，你就得到了一个可拖拽、可缩放的流程图；位置、路径、视口状态全部由实例接管，业务只需改数据。
    </p>
    <div class="lesson-term">
      <span class="term-name">「节点与连线数据模型」</span>指用 <code>nodes</code>（含 <code>id</code>、<code>position</code> 画布坐标、<code>data.label</code>，可选 <code>type</code>）与 <code>edges</code>（含 <code>id</code>、<code>source</code>、<code>target</code> 节点 id）两组数据描述整张图。连线路径由库按节点位置自动计算，交互与视口由实例接管；两套官方样式 <code>style.css</code> 与 <code>theme-default.css</code> 必须同时引入，缺一则画布不可用。
    </div>
  </LessonArticle>
</template>
