<script setup lang="ts">
import E04Dialog from './E04Dialog.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户点了「创建课程」，你把表单直接塞进列表页中间，列表被顶下去、原来的筛选状态也乱了——到底什么时候该用一个盖住页面的对话框？
    </div>

    <h2>前置容器的适用场景</h2>
    <p>
      后台里有三类场景需要一个「跳到前面来」的容器：删除前的强打断确认、创建或编辑的临时录入、需要用户聚焦注意力的提示。这些场景的共同点是——<strong>此刻不处理完，就不该继续碰页面其他部分</strong>。这就是模态对话框存在的意义。
    </p>
    <p>
      不用组件库的话，代价全在那些看不见的细节里：一层半透明遮罩、正确的层级 <code>z-index</code>、点击遮罩关闭、按 ESC 关闭、把键盘焦点锁进弹窗、打开时锁住背景滚动、关闭后再把焦点还回去。任意一环忘了，用户就会掉进「背景还能滚」「Tab 键跑到弹窗外」这类尴尬里。
    </p>

    <h2>手写遮罩浮层</h2>
    <p>
      最朴素的做法：写一个绝对定位的容器加上半透明遮罩，靠一个布尔值控制显隐。这个方案做对了一件基本的事——<strong>视觉上确实弹出来了</strong>，模态的观感成立，用户能看出这是需要优先处理的层。
    </p>

    <h2>滚动锁定与焦点管理</h2>
    <ul>
      <li>遮罩与背景滚动锁定要自己管，稍有不慎，弹窗打开时背景仍在滚动。</li>
      <li>焦点还留在背后的按钮上，反复按 Tab 会跑到弹窗之外，键盘用户彻底迷失。</li>
      <li>ESC 关闭、点击遮罩关闭都得单独监听，还容易和页面其他快捷键打架。</li>
      <li>关闭时要清空或重置内容、打开时要聚焦首个控件，全靠手动，漏一次就留下上一次的脏状态。</li>
    </ul>

    <h2>细节交给弹窗组件</h2>
    <p>
      不推翻「浮层」这个思路，而是把上面这些细节统一交给一个封装好的组件。这就是 <code>el-dialog</code>，它用 <code>v-model</code> 控制显隐，<code>title</code> 设置标题、<code>width</code> 设置宽度。
    </p>
    <ol class="lesson-steps">
      <li>用一个 <code>ref</code> 保存布尔值控制开关，点击「打开」按钮时把它置为 <code>true</code>。</li>
      <li>把表单或提示内容放进默认插槽，底栏的操作按钮放进 <code>footer</code> 插槽，结构与内容各司其职。</li>
      <li>确认按钮先校验、再执行业务逻辑、最后关闭；取消按钮直接把 <code>v-model</code> 置为 <code>false</code>。</li>
      <li>编辑场景打开时，把原始数据拷进一份本地副本，取消关闭时直接丢弃改动，原数据毫发无损。</li>
    </ol>
    <p>
      关闭这件事值得单独说清：<strong>右上角的关闭图标、底栏的取消按钮，本质上都在把 <code>v-model</code> 更新为 <code>false</code></strong>，所以只要你把握住这个值的流向，显隐控制就始终是单向、可控的。<code>show-close</code> 用来决定是否显示那个关闭图标，适用于希望用户明确二选一的场合。
    </p>
    <div class="lesson-box warn">
      <strong>三个细节别忽略：</strong>模态对话框会阻止与背景内容交互，适合强打断的确认或录入，别拿它当轻量提示；把 <code>show-close</code> 设为 <code>false</code> 隐藏了关闭图标后，<strong>必须提供明确的取消按钮作为出口</strong>，否则用户会被困住；对话框内的表单每次打开都应重置校验状态，否则上一次的红色错误提示会被带到下一次。
    </div>
    <p>
      还有一条设计纪律：弹窗内容的层级应保持扁平，避免过深嵌套。弹窗本来就抢注意力，里面再套一组复杂的多级结构，用户会无所适从——那种情况更适合独立页面。
    </p>

    <h2>打断强度的对比</h2>
    <figure class="lesson-figure">
      <figcaption>分别打开基础、表单与关闭按钮被隐藏的三种对话框，感受不同的打断强度。</figcaption>
      <E04Dialog />
    </figure>

    <h2>阻塞式内容的承载</h2>
    <p>
      对话框的价值，是把「需要立即处理、处理完才能继续」的内容，从页面的正常流里拎出来，盖在上面。用 <code>v-model</code> 把握显隐这条主线，用默认插槽与 <code>footer</code> 插槽组织内容与操作，把焦点、遮罩、滚动的琐事交给组件——你只需要关心「里面放什么、确认后做什么」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「模态对话框」</span>指用 <code>v-model</code> 控制显隐、以遮罩盖住页面并可阻止与背景交互的浮层，适合强打断的确认或录入场景。默认插槽放主体内容，<code>footer</code> 插槽放底栏按钮；关闭图标与取消按钮都会把 <code>v-model</code> 更新为 <code>false</code>；设 <code>show-close</code> 为 <code>false</code> 时须另留取消出口，且弹窗内表单打开时应重置校验状态。
    </div>
  </LessonArticle>
</template>
