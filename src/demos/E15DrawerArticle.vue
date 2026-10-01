<script setup lang="ts">
import E15Drawer from './E15Drawer.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表里点「详情」，我跳去了一个新页面；用户改完备注点返回，筛选条件没了、滚动条也回到了顶部——他只是想改一条备注，为什么要把整个列表的上下文都丢掉？
    </div>

    <h2>跳转带来的状态丢失</h2>
    <p>
      列表页里点一行看详情，是后台最常见的交互。传统的做法是跳一个新页面：路由切走、列表组件卸载、再回来时筛选条件、页码、滚动位置全部重置。<strong>用户的心智是「我还是在列表里，只是顺手看了一眼这行」</strong>，而页面的跳转在物理上把他丢开了——他得重新搜一遍、重新滚回刚才那行，操作的连贯性被打断。
    </p>
    <p>
      如果不用组件库，你也可以自己在右侧绝对定位一块面板：加遮罩、写开关变量、处理层级和滚动穿透。<code>overflow: hidden</code>、<code>z-index</code>、点击遮罩关闭、按 Esc 关闭、焦点管理……这些活全得手写，而且每加一个弹层就要重新来一遍。它们同样不是业务逻辑，却一点不比业务简单。
    </p>

    <h2>手写侧滑面板</h2>
    <p>
      最朴素的做法：在详情加一个 <code>v-if</code> 控制的面板，用绝对定位贴在列表右侧，配一层半透明遮罩，点遮罩把开关置为 <code>false</code>。
    </p>
    <p>
      它做对了一件关键的事：<strong>详情展示没有离开列表页面</strong>，列表组件始终挂载着，筛选与滚动位置天然保留。这就解决了「返回后上下文全没了」的核心痛点。
    </p>

    <h2>滚动穿透与焦点锁定</h2>
    <ul>
      <li>遮罩层级、滚动穿透（面板开着时背景列表还能滚）都要自己处理，容易出现「滚动串味」。</li>
      <li>按 Esc 关闭、点遮罩关闭、焦点锁定，这些键盘无障碍细节手写一遍成本不低。</li>
      <li>固定宽度在窄屏上会溢出视口，用户看不到面板左半边。</li>
      <li>面板关掉后，上一轮编辑的临时状态还留在组件里，下次打开看到的是旧内容、旧报错。</li>
      <li>「没保存就关闭」无法拦截，用户一失手改的内容就没了。</li>
    </ul>

    <h2>面板交给抽屉组件</h2>
    <p>
      不推翻「详情留在列表里」，而是把这块从边缘滑出的面板交给 <code>el-drawer</code>。它<strong>默认从视口右侧展开</strong>，正好贴着列表的右侧，让用户始终看得见身后的列表上下文；开关用 <code>v-model</code> 控制，配一个 <code>title</code> 就有标题栏。遮罩、层级、滚动穿透、Esc 关闭这些脏活它一并接管。
    </p>
    <ol class="lesson-steps">
      <li>用户点「查看并编辑」打开右侧抽屉，列表滚动位置保持不变。</li>
      <li>抽屉内用 <code>el-descriptions</code> 展示详情，用 <code>el-input</code> 编辑运营备注。</li>
      <li>保存时进入 loading 态，完成后关闭抽屉并给出反馈。</li>
      <li>配置 <code>destroy-on-close</code>，关闭时清理复杂的临时编辑状态。</li>
    </ol>
    <p>
      第二步是尺寸。<code>size</code> 控制抽屉宽度，可以直接写固定像素，但更稳妥的是写 <code>min(420px, 90%)</code> 这类 CSS 值——宽屏上取 420px，窄屏上自动收到 90%，<strong>移动端就不会出现固定宽度超出视口的情况</strong>。除了宽度，<code>direction</code> 还能控制展开方向，需要从左侧滑出时改一下即可。
    </p>
    <p>
      第三步是临时状态的生命周期，这也是抽屉一个隐藏的坑。抽屉里的表单状态（备注内容、校验报错、滚动位置）在关闭后默认还留着，下次打开会看到上一轮的残留。给抽屉加上 <code>destroy-on-close</code>，关闭时销毁内部 DOM 与状态，下次打开就是干干净净的一份——<strong>它不是「关掉隐藏」，而是真的把内容扔了重建</strong>。
    </p>
    <table>
      <thead>
        <tr>
          <th>属性</th>
          <th>作用</th>
          <th>要点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>v-model</code></td>
          <td>控制显示隐藏</td>
          <td>打开前把详情数据准备好</td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td>标题栏文案</td>
          <td>说明当前在改什么</td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td>宽度</td>
          <td>建议 min(420px, 90%) 之类，避免窄屏溢出</td>
        </tr>
        <tr>
          <td><code>direction</code></td>
          <td>展开方向</td>
          <td>默认右侧，可改从其他边缘滑出</td>
        </tr>
        <tr>
          <td><code>destroy-on-close</code></td>
          <td>关闭时销毁内部 DOM 与状态</td>
          <td>清理临时编辑状态</td>
        </tr>
        <tr>
          <td><code>before-close</code></td>
          <td>关闭前拦截</td>
          <td>未保存确认场景</td>
        </tr>
      </tbody>
    </table>
    <p>
      第四步是拦截。用户改了一半直接点遮罩关闭，改动就悄悄丢了。用 <code>before-close</code> 在关闭前弹一句「有未保存的修改，确定关闭吗」，把关口的决定权交回给用户。
    </p>
    <div class="lesson-box warn">
      <strong>三个容易踩的坑：</strong>其一，<strong>抽屉适合轻量编辑</strong>，表单字段一多、步骤一复杂就该用独立页面，别把一个审批流的全部环节塞进 420px 的侧栏里。其二，<code>size</code> 用固定像素时要记得移动端会溢出，用 <code>min()</code> 或百分比更稳。其三，也是最小但最容易漏的一条——<strong>打开时把焦点移入抽屉内的首个控件、关闭后归还给触发按钮</strong>，键盘与无障碍体验才完整；焦点还留在背后被遮住的列表上，用户按 Tab 会迷路。
    </div>
    <p>
      最后验收：打开抽屉确认列表的筛选与滚动位置没变；反复开关几次，看表单里是不是还残留上一轮内容（这就是 <code>destroy-on-close</code> 在不在的差别）；把窗口拖窄，确认抽屉没有跑出视口；用键盘 Tab 与 Esc 走一遍，确认焦点能进能出。
    </p>

    <h2>列表不中断的编辑</h2>
    <figure class="lesson-figure">
      <figcaption>点「查看并编辑详情」打开右侧抽屉，改一段运营备注再保存，感受「列表不被中断」的体验。</figcaption>
      <E15Drawer />
    </figure>

    <h2>上下文保留的取舍</h2>
    <p>
      抽屉把「在保留当前上下文的前提下看详情、做轻量编辑」这件事做成了一个侧滑面板：<code>v-model</code> 管开关，<code>size</code> 与 <code>direction</code> 管形态，<code>destroy-on-close</code> 管状态生命周期。选型时问一句——这个任务是「顺手看一眼、改一笔」，还是「一整套流程」？前者用抽屉，后者回独立页面，别让侧栏承载它扛不住的复杂度。
    </p>
    <div class="lesson-term">
      <span class="term-name">「抽屉」</span>是 <code>el-drawer</code> 从视口边缘（默认右侧）滑出的浮层，适合在不丢列表上下文时查看详情或轻量编辑。<code>v-model</code> 控制开关，<code>title</code> 设标题，<code>size</code> 支持 <code>min(420px, 90%)</code> 这类 CSS 值以免窄屏溢出，<code>direction</code> 控制方向，<code>destroy-on-close</code> 关闭时销毁内部状态，<code>before-close</code> 可拦截关闭确认。打开与关闭要做好焦点转移。
    </div>
  </LessonArticle>
</template>
