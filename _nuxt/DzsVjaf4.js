const e=`<script setup lang="ts">
import VF15Serialize from './VF15Serialize.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户把流程拖到满意，放大到某个分支的细节，刷新页面后却全回到原点，连线也丢了。图在内存里明明活得好好的，为什么一落盘就散架？
    </div>

    <h2>画布状态不是普通对象</h2>
    <p>
      直觉做法是把 <code>nodes</code> 和 <code>edges</code> 直接 <code>JSON.stringify</code> 存起来。但运行时暴露出来的并不是初始数组，而是 <code>GraphNode</code> 与 <code>GraphEdge</code>：除了 <code>id</code>、<code>type</code>、<code>position</code>、<code>data</code>，还挂着实测尺寸、连接桩边界、选中与拖拽状态，以及内部对象的引用。直接序列化轻则体积暴涨，重则因为循环引用当场抛错。
    </p>
    <p>
      更隐蔽的问题在 <code>node.data</code>。业务方很容易顺手把回调函数、组件实例、DOM 节点甚至响应式代理塞进去——这些都不属于可持久化的数据。所以第一步不是找存储方案，而是先<strong>把画布状态还原成纯数据</strong>。
    </p>

    <h2>导出对象的形状</h2>
    <p>
      <code>useVueFlow()</code> 提供 <code>toObject()</code>，它返回一个可存储的导出对象，包含三部分：
    </p>
    <ul>
      <li><code>nodes</code>：节点数组，保留业务真正需要的字段，运行态内部字段会被剔除。</li>
      <li><code>edges</code>：连线数组，<code>source</code> / <code>target</code> 指向节点 id。</li>
      <li><code>viewport</code>：<code>x</code>、<code>y</code>、<code>zoom</code>，记录保存那一刻的平移与缩放。</li>
    </ul>
    <p>
      它还有两个旧字段 <code>position</code> 与 <code>zoom</code>，是为兼容早期版本保留的别名，新代码统一读 <code>viewport</code>。导出成功不代表业务数据一定安全：<code>toObject()</code> 能去掉画布自身的运行态，却不会替你检查 <code>data</code> 里有没有函数或 DOM 引用，这部分仍要在建模时守住。
    </p>

    <h2>保存时加版本信封</h2>
    <p>
      不要把 <code>toObject()</code> 的结果裸存。结构一旦演进，旧文件就会变成无法解释的脏数据。推荐在外面套一层业务信封：<code>schemaVersion</code> 标记结构版本，<code>updatedAt</code> 记录保存时间，<code>nodeTypes</code> 汇总本次涉及的节点类型，<code>flow</code> 放真正的导出对象。
    </p>
    <p>
      每个字段都有明确用途。<code>schemaVersion</code> 让恢复端在解析前就知道该用哪套迁移规则；<code>updatedAt</code> 既方便界面展示，也能在多端编辑时判断新旧；<code>nodeTypes</code> 是一份轻量的类型清单，排查“某个自定义节点为什么没渲染”时，对照它比翻整份 JSON 快得多。<strong>破坏性变更必须递增版本号</strong>，新增可选字段则不必。
    </p>
    <p>
      信封里还可以按业务需要补上画布名称、文档 id 或所属项目，但不要把整份业务列表也塞进来。快照只负责图结构，业务数据另有归属；两者混在一起，既会放大存储体积，也会让迁移时的边界变得模糊。
    </p>
    <p>
      写入前还要做一次序列化自检：<code>data</code> 只保留字符串、数字、布尔、数组与普通对象；<code>Date</code>、<code>Map</code>、<code>Set</code> 先转成可读的普通结构；响应式对象先转成原始值。否则 <code>JSON.stringify</code> 的结果要么丢字段，要么留下无法还原的空壳。
    </p>

    <h2>恢复先校验再映射</h2>
    <p>
      恢复的第一件事不是 <code>fromObject</code>，而是校验信封。缺少 <code>schemaVersion</code> 的快照无法判断结构，直接拒绝；版本高于当前应用支持的版本，说明文件来自更新的客户端，也应拒绝并提示升级，而不是硬解析出一张残缺的图。版本偏低则进入迁移分支，逐级补齐字段。
    </p>
    <p>
      第二件事是节点类型映射。应用里的自定义节点可能改过名字，例如早期的 <code>approval</code> 现在统一叫 <code>default</code>。维护一张“旧名 → 新名”的映射表，恢复时先翻译；映射表里查不到的类型不能原样丢给画布，而要<strong>降级为 <code>default</code></strong> 并给出提示。这样一张旧图至少还能显示结构与文字，不会整片空白。
    </p>
    <p>
      版本迁移不要跳级执行。当前是 v3、快照是 v1 时，应当先按 v1→v2 的规则补齐字段，再走 v2→v3，而不是写一段只认最新结构的解析逻辑。迁移函数保持纯函数、逐级可测，历史分支才不会在几年后变成没人敢动的黑盒。
    </p>
    <ul>
      <li>版本过高：拒绝载入，提示用户升级应用，避免误读新结构。</li>
      <li>旧类型名：按映射表翻译，保持节点原有数据与位置。</li>
      <li>未知类型：降级为 <code>default</code>，同时记录节点 id 便于排查。</li>
      <li>悬空连线：<code>source</code> 或 <code>target</code> 找不到对应节点时直接丢弃。</li>
    </ul>

    <h2>恢复后的视口复位</h2>
    <p>
      <code>fromObject</code> 是异步方法，返回是否接受成功，必须 <code>await</code> 后再做后续动作。恢复数据与恢复视野是两件事：如果希望用户回到离开时的位置，用 <code>setViewport</code> 写入保存的 <code>viewport</code>；如果只是想让人一眼看全，用 <code>fitView</code> 重新收拢。前者保留上下文，后者适合首次打开或分享链接。
    </p>
    <p>
      还要注意空值与异常视口。旧文件可能没有 <code>viewport</code>，或者 <code>zoom</code> 是非法数值，这时应回退到 <code>fitView</code>，而不是把画布设成 0 倍缩放。恢复完成后最好再读一次节点数、连线数，确认与快照一致，异常数据在入口就被拦下。
    </p>

    <h2>保存恢复演练</h2>
    <p>
      下面的演练把完整链路走一遍：拖动画布或缩放后保存，查看导出的 JSON、版本号、节点类型与视口；再恢复快照，观察视野是否回到保存时的状态。点「载入旧版快照」会注入一个旧类型名和一个未知类型，用来验证映射与降级是否生效。
    </p>
    <figure class="lesson-figure">
      <figcaption>保存后修改视野再恢复，对比视口变化；旧版快照会触发类型映射与未知类型降级日志。</figcaption>
      <VF15Serialize />
    </figure>

    <div class="lesson-box warn">
      <strong>持久化不是无脑写存储：</strong>导出的 JSON 只放纯数据，运行态字段、函数、组件实例、DOM 引用一律不要进入 <code>node.data</code>；浏览器存储容量有限，大图应先压缩或只存增量。快照结构一旦做破坏性调整，务必递增 <code>schemaVersion</code>，并保留旧版本的迁移分支，否则历史文件会集体失效。
    </div>

    <div class="lesson-term">
      <span class="term-name">「序列化与持久化」</span>用 <code>toObject()</code> 导出 <code>nodes</code> / <code>edges</code> / <code>viewport</code> 纯数据，外层附上 <code>schemaVersion</code>、<code>updatedAt</code> 与 <code>nodeTypes</code>。恢复时先校验版本，再按映射表翻译旧类型、把未知类型降级为 <code>default</code>、丢弃悬空连线，最后 <code>await fromObject()</code> 并用 <code>setViewport</code> 或 <code>fitView</code> 复位视野。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
