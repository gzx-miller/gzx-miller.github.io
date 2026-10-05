const e=`<script setup lang="ts">
import E20Skeleton from './E20Skeleton.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>接口慢了两秒，页面就白屏两秒——用户以为没反应，连点三次刷新，其实数据早就在路上了。
    </div>

    <h2>请求等待与白屏</h2>
    <p>
      你在做一个课程卡片列表，数据来自接口。请求发出的那一刻，页面上什么都没有；等数据回来，卡片才「啪」地一下出现。这两秒的空白，用户看不到任何信息，大脑只能把它解读成「坏了」。于是刷新、重试、反复点击，反而给服务器添了乱。
    </p>
    <p>
      更麻烦的是<strong>布局跳动</strong>：内容出现的一瞬间，原本空荡荡的页面突然被撑开，下方的元素整体往下弹，用户正想点的按钮瞬间移了位。加载态做得不好，代价不只是不好看，而是误操作和信任流失。
    </p>

    <h2>文字提示与加载态</h2>
    <p>
      最省事的做法：在数据没回来之前，用条件渲染显示一句「加载中…」，或者干脆什么都不显示，等数据到了再一次性渲染。
    </p>
    <p>
      它至少承认了一件事：<strong>加载态是一种需要被表达的状态</strong>，不能假装它不存在。给用户一句话，总比给他一片空白强。但「一句话」能传达的信息实在太少。
    </p>

    <h2>占位形状与布局跳动</h2>
    <ul>
      <li>文字提示只是「一行字」，完全没有内容的形状，用户猜不出会加载出什么。</li>
      <li>占位的面积和真实内容对不上，内容一出现就发生布局塌陷与跳动。</li>
      <li>多个区块各自显示文字，视觉上很零散，不像一个整体。</li>
      <li>没有动画时会显得「卡死」，有动画又得自己去写闪烁效果。</li>
      <li>每个列表、每张卡片都要重复写一套「加载中」判断，逻辑散落各处。</li>
    </ul>

    <h2>内容轮廓占位</h2>
    <p>
      不推翻「把加载态表达出来」，而是把它<strong>升级成内容的「轮廓草图」</strong>。骨架屏的思路是：在真实内容出现之前，先用几块灰色的占位图形，把内容的形状提前画出来。Element Plus 的 <code>el-skeleton</code> 用一个 <code>loading</code> 开关在两种状态间切换。
    </p>
    <p>
      先理解它最核心的双插槽模型：<strong><code>loading</code> 为 <code>true</code> 时渲染骨架占位，为 <code>false</code> 时渲染默认插槽里的真实内容</strong>。也就是说，你只需要维护一个布尔值——数据在路上时置为 <code>true</code>，数据就绪后置为 <code>false</code>，组件自动完成切换。
    </p>
    <p>
      接着是占位怎么画。默认骨架是通用的几行灰条，但真正贴合业务的做法是用 <code>#template</code> 插槽，自己用 <code>el-skeleton-item</code> 拼出结构。每个占位块用 <code>variant</code> 指定形状，例如 <code>circle</code> 画圆形头像、<code>h3</code> 画标题、<code>text</code> 画正文行。把轮廓摆成和真实卡片一致，切换时几乎看不出跳动。
    </p>
    <p>
      然后是数量：<code>count</code> 可以控制骨架的数量，用来平铺一列卡片骨架——与其放一个通用的三行占位，不如按真实列表的条数铺出几块卡片轮廓，切换时更稳。最后给骨架加个 <code>animated</code>，让它带上闪烁动画，用户就知道「它在动，没死」。
    </p>
    <p>
      还有两个体验细节。其一，骨架的形状<strong>应尽量贴近最终内容</strong>，减少加载完成后的跳动感。其二，为骨架容器<strong>限定一个最小高度</strong>，这样占位与真实内容切换时布局不会塌陷；切换 <code>loading</code> 时还可以配合过渡动画，让内容出现得更平滑，而不是硬切。
    </p>
    <div class="lesson-box hint">
      <strong>不是所有加载都值得上骨架屏：</strong>骨架屏适合<strong>结构复杂、面积较大</strong>的内容区域，比如卡片列表或详情块。像按钮、简短列表这种小范围的加载，直接用 <code>v-loading</code> 指令盖一层遮罩就够，没必要给整页铺骨架——滥用骨架屏反而会让页面看起来一直在「闪」。
    </div>

    <h2>骨架与卡片切换</h2>
    <figure class="lesson-figure">
      <figcaption>点「重新加载」看骨架占位与真实课程卡片之间的平滑切换。</figcaption>
      <E20Skeleton />
    </figure>

    <h2>整页布局与占位适配</h2>
    <p>
      骨架屏解决的，是「数据在路上时页面一片空白」的焦虑。它用一块块贴合真实布局的灰色占位，提前把内容的形状画出来，让等待有了解释、切换不再跳动。用法上很轻：一个 <code>loading</code> 开关在骨架与真实内容之间切换，<code>#template</code> 配 <code>el-skeleton-item</code> 拼结构，<code>count</code> 控制数量，<code>animated</code> 负责动起来。记住分寸——大块结构化内容才用它，小范围加载交给 <code>v-loading</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「骨架屏」</span>用 <code>el-skeleton</code> 在加载期间显示内容轮廓：<code>loading</code> 为 <code>true</code> 渲染骨架、为 <code>false</code> 渲染默认插槽的真实内容；<code>animated</code> 开启闪烁动画，<code>#template</code> 插槽用 <code>el-skeleton-item</code> 拼出贴合真实布局的占位（<code>variant</code> 可取 <code>circle</code>、<code>h3</code>、<code>text</code> 等），<code>count</code> 控制骨架数量。骨架形状应贴近最终内容、为容器限定最小高度，简短的按钮或列表加载可直接用 <code>v-loading</code>。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
