<script setup lang="ts">
import U05BuiltinComponents from './U05BuiltinComponents.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一段在 Vue 里写好的页面原样复制进 uni-app：<code>&lt;div&gt;</code> 做布局、<code>&lt;span&gt;</code> 放文字、<code>&lt;img&gt;</code> 放头像。H5 预览一切正常，切到微信小程序，整页内容塌成了一个小点——<code>div</code> 在小程序里根本不认识。
    </div>

    <h2>小程序视图体系</h2>
    <p>
      你想让同一套页面喂给小程序渲染，而小程序并不是浏览器：它<strong>没有文档流、没有 HTML 标签体系</strong>，视图层是自绘的。HTML 标签对它来说只是些不认识的字符串。
    </p>
    <p>
      继续用 HTML 标签的代价很具体：<strong>div、span、img 只在 H5 生效</strong>，小程序里不渲染，布局当场崩掉；<strong>浏览器原生的 input、button 三端默认样式与行为都不一致</strong>，要分别写覆盖样式；再加上<strong>图片不给尺寸时各端默认表现不同</strong>，最容易把布局撑破。于是问题收成一句：既然不能直接用 HTML 标签，一套跨端 UI 到底该用什么来搭？
    </p>

    <h2>容器与文本组件</h2>
    <p>
      最朴素的做法：按"块级 / 行内"给出一一对应——用 <code>&lt;view&gt;</code> 替代 <code>&lt;div&gt;</code>，用 <code>&lt;text&gt;</code> 替代 <code>&lt;span&gt;</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给出了最小可用的"容器 + 文本"两种单元</strong>，页面骨架能搭起来，数据也能照常绑上去——跨端的起点就此立住。
    </p>

    <h2>图像按钮的缺位</h2>
    <ul>
      <li>光有 view、text 不够用：图片、按钮、输入框都还没有对应物，<code>img</code> 在小程序里不识别，头像直接不显示。</li>
      <li>只给图片一个 URL 而不管尺寸时，小程序按默认 <code>320px × 240px</code> 渲染，一张小头像也能把整行撑开。</li>
      <li><code>text</code> 并非"什么都能装"：它只渲染内部的文本与嵌套的 text，塞进去的其它节点会被丢弃；段落级文本的正确做法是外层用 view、内部按需嵌套 text。</li>
      <li>各端 button 自带不同的默认外观，样式写死在一端，换一端就变形。</li>
    </ul>

    <h2>五类内置组件</h2>
    <p>
      不推翻"用容器和文本搭页面"，而是把<strong>每一类元素都补上平台级等价物</strong>，凑齐一组跨端基础组件：
    </p>
    <ol class="lesson-steps">
      <li><code>view</code>：块级容器，承担布局（对应 <code>div</code>）。</li>
      <li><code>text</code>：行内文本，可嵌套、可复制、能正确换行（对应 <code>span</code>）。</li>
      <li><code>image</code>：图片（对应 <code>img</code>），<strong>默认尺寸 320px × 240px，必须显式设定宽高</strong>，或用 <code>mode</code> 控制缩放。</li>
      <li><code>button</code>：按钮，用 <code>size</code> / <code>type</code> / <code>loading</code> 等属性控制形态。</li>
      <li><code>input</code>：输入框，<code>type</code> 支持 <code>text</code> / <code>number</code> / <code>digit</code> / <code>password</code> 等场景值。</li>
    </ol>
    <p>
      这里要理解"为什么必须换"：这组内置组件会被<strong>编译到各端的原生等价物</strong>——小程序端映射到原生组件，H5 端映射到 <code>div</code>、<code>span</code>、<code>img</code> 这些标签。H5 虽然顺带也认识 div，但为了跨端一致，统一写内置组件，才不会出现"某端正常、某端塌掉"的分裂。
    </p>
    <p>
      再补图片的适配细节：<code>image</code> 用 <code>mode</code> 控制裁剪与缩放，常见值有 <code>aspectFit</code>（等比完整显示，可能留白）、<code>aspectFill</code>（等比裁剪填满）、<code>widthFix</code>（宽度固定、高度自适应）。选对 mode，配合显式尺寸，图片才不会撑破或变形。
    </p>
    <div class="lesson-box warn">
      <strong>三条必须记住的边界：</strong>H5 端兼容 <code>div</code> 只是"顺带"，小程序端不识别，跨端务必用内置组件；<code>image</code> 不设宽高时在小程序里按 <code>320px × 240px</code> 渲染，务必显式设定；<code>input</code> 的 <code>type</code> 要按场景选，收数字就用 <code>number</code> 或 <code>digit</code>，别一律默认 text。
    </div>

    <h2>组件的定位验证</h2>
    <figure class="lesson-figure">
      <figcaption>先看五件套各自的定位说明，再在下方用 input 改昵称、点 button 报名，验证它们就是能绑定数据的普通组件。</figcaption>
      <U05BuiltinComponents />
    </figure>

    <h2>内置组件的分工</h2>
    <p>
      uni-app 用一套内置组件替代了 HTML 标签：view 管布局、text 管文本、image 管图片、button 与 input 管表单交互。它们不是"HTML 的别名"，而是会被编译到各端原生等价物的抽象层——记住这一点，就不会再写只在小程序里塌掉的页面。
    </p>
    <div class="lesson-term">
      <span class="term-name">「mode（图片缩放模式）」</span><code>image</code> 组件上控制裁剪与缩放方式的属性，常见值有 <code>aspectFit</code>（等比完整显示）、<code>aspectFill</code>（等比裁剪填满）、<code>widthFix</code>（宽固定、高自适应）。要记住的边界：它<strong>只决定图片在给定尺寸里的填充方式，不会替你补上尺寸</strong>——宽高仍要显式设定；各端对个别 mode 的支持也略有差异，源图尺寸过小放大后会模糊。
    </div>
  </LessonArticle>
</template>
