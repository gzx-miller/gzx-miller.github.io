<script setup lang="ts">
import E12Tooltip from './E12Tooltip.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>表格里有个只写着「⋯⋯」的图标按钮，鼠标放上去我想弹一句「导出名单」；可关键是——同一个「提示」需求，我在列表页写得挺好，到了表单页领导却说「触屏上根本看不到」。一段小提示，到底该做成什么形态？
    </div>

    <h2>就近解释的普遍需求</h2>
    <p>
      后台里到处是「差一句解释」的地方：一排操作图标按钮，图标本身表达不了「导出/复制/停用」，用户得靠猜；一个专业术语字段（结算周期、预留额度），运营同学不知道口径；一个被禁用的按钮，为什么不给点，也没人告诉他。这些内容的共同点是——<strong>它是一句话，不值得占用常驻布局，但用户必须在需要的那一刻看得到</strong>。
    </p>
    <p>
      如果不用组件库，这些活全得自己干：算提示框相对触发元素的坐标、监听鼠标进入与离开、处理提示被父级 <code>overflow: hidden</code> 裁掉、被 z-index 盖住、贴到屏幕边缘时方向翻转。更麻烦的是「该不该显示」的判断题：图标按钮上一个 <code>title</code> 属性看着省事，但它的文字样式和触屏表现完全不受你控制；自己写 div 又得处理提示和触发源之间那段间隙——鼠标穿过时既不在按钮上也不在提示里，提示当场消失。这些细节没有一条是业务逻辑，却每一条都能让功能「看起来坏了」。
    </p>

    <h2>原生属性的尝试</h2>
    <p>
      最朴素的做法：给元素加个原生 <code>title</code> 属性，或者包一层 <code>span</code> 自己用 <code>@mouseenter</code> 显示一段绝对定位的文本。浏览器自带的 <code>title</code> 零成本，光标悬停一会儿也会浮出文字。
    </p>
    <p>
      它做对了一件事：<strong>把辅助说明和触发源绑在一起</strong>，用户不必离开当前上下文就能读到信息。对于「一句话纯文本、不赶时髦」的场景，这个方案完全不丢人。
    </p>

    <h2>样式与位置的失控</h2>
    <ul>
      <li>原生 <code>title</code> 的延迟、样式、位置全由浏览器决定，不同系统长得不一样，无法纳入设计规范。</li>
      <li>自己写的浮层照样会遇到间隙误关闭、父级裁剪、层级遮挡、视口边缘方向翻转。</li>
      <li>只支持 hover 一种触发，触屏和键盘用户根本看不到——这正是「领导说触屏看不到」的根源。</li>
      <li>想做多行、加粗、列表这种结构化内容，<code>title</code> 属性直接无能为力。</li>
      <li>触发源如果只是个 <code>div</code>，键盘用户按 Tab 根本聚焦不到它，提示永远出不来。</li>
    </ul>

    <h2>提示组件接管浮层</h2>
    <p>
      不推翻「就近展示一句话」，而是把这套浮层逻辑交给 <code>el-tooltip</code>。它替你处理坐标、边界、层级，你只要声明两件事：<strong>提示什么</strong>和<strong>怎么触发</strong>。
    </p>
    <p>
      第一步定方向和触发方式。<code>placement</code> 控制弹出方向，取 <code>top</code> / <code>bottom</code> / <code>left</code> / <code>right</code>，辅助说明默认用 <code>hover</code> 触发，移入即显示；需要用户主动查看（比如上面那句话必须被读到）时改用 <code>trigger="click"</code>。方向不是随便挑的：提示靠近视口上边缘时用 <code>top</code> 会被裁掉，选 <code>bottom</code> 更稳。
    </p>
    <p>
      第二步定内容形态。这一步是 Tooltip 最常踩的分水岭：<strong>纯文本走 <code>content</code> 属性，需要多行、加粗、列表这类富内容时必须改用 <code>#content</code> 插槽</strong>。你可以把课程详情写成一段「讲师 / 评分 / 学员数」的小卡片放进插槽。但要记住，Tooltip 的定位是「短文案」，内容一多、还需要点击交互时，就该换成气泡卡片式弹层，而不是把 Tooltip 塞成小面板。
    </p>
    <table>
      <thead>
        <tr>
          <th>属性</th>
          <th>作用</th>
          <th>何时关心</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>placement</code></td>
          <td>提示方向 top/bottom/left/right</td>
          <td>靠近视口边缘时避免被裁</td>
        </tr>
        <tr>
          <td><code>trigger</code></td>
          <td>触发方式 hover / click</td>
          <td>需要用户主动查看时用 click</td>
        </tr>
        <tr>
          <td><code>#content</code></td>
          <td>多行/结构化富内容插槽</td>
          <td>纯文本放不下时</td>
        </tr>
        <tr>
          <td><code>show-after</code> / <code>hide-after</code></td>
          <td>显隐延迟（毫秒）</td>
          <td>快速划过时避免频繁闪烁</td>
        </tr>
      </tbody>
    </table>
    <p>
      第三步打磨手感。<code>show-after</code> 与 <code>hide-after</code> 用来微调显隐延迟：一连排图标按钮，鼠标扫过去会连着一串提示乱闪，加点 <code>show-after</code> 让它「停一下再出」，体验立刻安静下来。
    </p>
    <p>
      第四步也是最容易被忽略的一步——可聚焦语义。<strong>触发源本身应该是按钮或链接</strong>，因为只有可聚焦元素，键盘用户才能按 Tab 走到它、进而触及提示。如果触发源只是一个普通 <code>div</code>，鼠标用户能看到，键盘用户则完全被挡在门外。
    </p>
    <div class="lesson-box warn">
      <strong>两个反复出现的坑：</strong>其一，<strong>触屏与键盘场景没有 hover</strong>，关键说明要么直接展示在界面上，要么同时提供 click 触发，否则用户永远看不到——这不是体验问题，是信息可达性问题。其二，别拿 Tooltip 装需要交互的内容：内容多、要点击就改用气泡卡片，层级也别套娃。
    </div>

    <h2>悬停与点击的差异</h2>
    <figure class="lesson-figure">
      <figcaption>把鼠标依次悬停到四个方向的按钮上，再点击「点击触发」和「富内容提示」，体会 hover 与 click 的差别。</figcaption>
      <E12Tooltip />
    </figure>

    <h2>参数化的提示能力</h2>
    <p>
      工具提示把「就近补一句说明」做成了可复用的能力：<code>placement</code> 决定出现在哪一侧，<code>trigger</code> 决定何时出现，<code>content</code> 或 <code>#content</code> 决定它承载多少信息。选型时先问自己两句——这段话需要点击交互吗？需要就让位给气泡卡片；触屏和键盘用户能拿到这条信息吗？拿不到就说明你的方案还差一半。
    </p>
    <div class="lesson-term">
      <span class="term-name">「工具提示」</span>是 <code>el-tooltip</code> 提供的轻量浮层，用 <code>placement</code> 控制方向、<code>trigger</code> 选择 <code>hover</code> / <code>click</code> 触发。纯文本用 <code>content</code>，多行或结构化内容用 <code>#content</code> 插槽，<code>show-after</code> / <code>hide-after</code> 微调显隐延迟。它只适合短文案；内容多或需交互应改用气泡卡片，且触屏与键盘无 hover，关键信息要有其他获取途径。
    </div>
  </LessonArticle>
</template>
