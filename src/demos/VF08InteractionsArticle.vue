<script setup lang="ts">
import VF08Interactions from './VF08Interactions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>画布做得挺好看，用户一上手就露馅——同一对节点被拉出三条一模一样的线叠在一起，想批量删几个节点只能一个个点，删完节点还留下断头线挂在半空。
    </div>

    <h2>提出问题</h2>
    <p>
      一个真正能用的编辑画布，光能看不行，得能编。用户会反复做三件事：在节点之间拉线建立依赖，一次选中一片元素，然后把选中的东西删掉。这三件事听着简单，每一件都藏着坑。
    </p>
    <p>
      如果不处理，后果很具体。拉线不查重，同一对连接桩会被拉出多条重叠的线，看图和删图都乱成一团；不给框选能力，清场只能靠一个个点，效率低到没人愿意用；删除时不清理相邻的边，图上就会留下一条连着空气的悬空线。<strong>所以要把「连接、框选、删除」当成一组交互来编排</strong>，而不是三件互不相干的小功能。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法是全部交给库：连线一松手它自动加边，按下默认删除键它自动删除。
    </p>
    <p>
      这个方案对在「开箱即用」：<strong>画布默认就支持拉线和键盘删除</strong>，一行业务代码都不用写。当图很小、只有一个操作者、也不在乎整洁时，它确实够用。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>不查重，同一对节点会被拉出多条一模一样的线，叠在一起互相遮挡。</li>
      <li>默认选不中一批元素，批量操作无从下手。</li>
      <li>默认删除只删元素本身，删节点时与它相连的边可能变成悬空连线。</li>
      <li>删完没有任何反馈，用户不知道刚才到底发生了什么。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻默认行为，而是给它补上业务规则。梳理下来是四个动作，一步步来。
    </p>
    <ol class="lesson-steps">
      <li>
        <strong>拦截新建连线。</strong>连线松手会触发 <code>connect</code> 事件——模板里写 <code>@connect</code>，或通过 <code>useVueFlow()</code> 拿到 <code>onConnect</code>。业务在这里<strong>先查重、再补默认、最后 addEdges</strong>。查重的键是四元组：<code>source</code> + <code>target</code> + <code>sourceHandle</code> + <code>targetHandle</code>，四项都相同才算重复，命中就跳过并给出提示。
      </li>
      <li>
        <strong>把选中集合算出来。</strong>Vue Flow 会把选中状态落在每个元素的 <code>selected</code> 上——节点的 <code>node.selected</code>、连线的 <code>edge.selected</code>。用 <code>computed</code> 过滤出选中的 nodes 与 edges，就能驱动按钮上的计数，也能据此决定删除按钮是否可用。
      </li>
      <li>
        <strong>批量删除时照顾图结构。</strong>删除选中节点之前，要<strong>先清掉与它相连的所有边</strong>，再删节点，才能避免悬空连线。做法是同时保留「未选中的边」和「两端都不在选中节点里的边」，最后才剔除选中节点。
      </li>
      <li>
        <strong>把交互键配置化。</strong>按住 <code>selection-key-code</code>（默认 <code>Shift</code>）拖空白区是框选，拖节点本身则是移动，二者靠这个键区分；<code>delete-key-code</code> 配置删除键，默认 <code>Backspace</code>，本课额外把 <code>Delete</code> 也配上。
      </li>
    </ol>
    <div class="lesson-box hint">
      <strong>为什么用 props 而不是监听键盘：</strong><code>selection-key-code</code> 与 <code>delete-key-code</code> 都是画布自身的属性。交给画布去管，焦点、修饰键、跨平台差异都由它处理，比自己监听原生键盘事件可靠得多。
    </div>
    <div class="lesson-box warn">
      <strong>两种删除方式各有场合：</strong>面向业务的删除建议走按钮加确认，避免误操作；键盘删除适合高频的快捷清场。另外，<strong>不查重就直接 push edges</strong>，会让同一对桩位堆出多条重叠连线，删的时候也极容易漏删——查重这一步不能省。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>拖线建依赖（重复的会被拦下），按住 Shift 框选几个节点，再按 Delete 或点按钮一起清场。</figcaption>
      <VF08Interactions />
    </figure>

    <h2>总结</h2>
    <p>
      交互编排的思路，是把库的默认行为当成起点，再按业务补规则：连接经 <code>onConnect</code> 查重后再落账，选中态读 <code>selected</code> 算出集合，删除时连同相邻边一起清理，交互键则交给 <code>selection-key-code</code> 与 <code>delete-key-code</code> 配置。画布这才从「能看」变成「能编」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「连接、框选与删除」</span>是编辑画布的三种基础交互：连线松手触发 <code>connect</code>（模板 <code>@connect</code> 或 <code>useVueFlow().onConnect</code>），业务用 <code>source</code> / <code>target</code> / <code>sourceHandle</code> / <code>targetHandle</code> 四元组查重后再 <code>addEdges</code>；选中态落在 <code>node.selected</code> / <code>edge.selected</code>；框选键由 <code>selection-key-code</code>（默认 <code>Shift</code>）配置，删除键由 <code>delete-key-code</code> 配置，且删除节点前必须先清理相邻边。
    </div>
  </LessonArticle>
</template>
