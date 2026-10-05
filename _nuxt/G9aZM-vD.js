const o=`<script setup lang="ts">
import U02ConditionalCompilation from './U02ConditionalCompilation.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在页面里写了一个"分享给好友"的按钮，用 <code>// #ifdef MP-WEIXIN</code> 圈了起来。切到 H5 平台预览，这个按钮不仅不显示，翻遍打包产物也找不到它的任何一行——它不是运行时被藏起来了，而是压根没被编译进去。
    </div>

    <h2>三端平台能力分叉</h2>
    <p>
      你在做一套三端共用的代码：分享、保存海报、唤起支付，各个平台能做的事并不一样。顺手的老办法是在逻辑里写运行时判断，比如 <code>if (平台 === 'h5')</code> 走这个分支、否则走那个。功能确实能跑，但代价藏在看不见的地方。
    </p>
    <p>
      第一，<strong>各端无关的分支照样会被打进所有端的产物</strong>，小程序的包里躺着 H5 的代码，包体白白变大。第二，<strong>只有某端才有的 API</strong>（比如微信的 <code>wx.shareAppMessage</code>）写进判断后，其它端仍要能编译通过、能加载，稍不留神就在运行时才炸。第三，差异一旦多起来，<strong>判断会层层嵌套</strong>，读代码要同时在脑子里模拟三端。于是问题落成一个明确的问句：能不能让"只属于某端的代码"，在它不该存在的那一端根本不存在？
    </p>

    <h2>运行时平台判定</h2>
    <p>
      最朴素的做法：运行时判断当前平台，例如读 <code>uni.getSystemInfoSync().platform</code>，再决定走哪一段逻辑。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认"不同平台的行为必须能分叉"</strong>，而且不依赖任何额外的构建配置——只要有平台信息，就能在同一处代码里做出选择，功能立刻可跑。
    </p>

    <h2>分支代码全量入包</h2>
    <ul>
      <li>分叉之后两边的代码<strong>仍然都会被打进每一端的产物</strong>，包体不为所动，等于把三端的代码全塞进一端的包里。</li>
      <li>某端专属的 API 写进判断里，其它端在编译和加载阶段依然要面对它，写错一个拼写就可能在<em>运行到那个分支时</em>才报错。</li>
      <li>判断落在热路径上会被反复执行，差异一多就嵌套成"俄罗斯套娃"，性能和可读性一起变差。</li>
      <li>运行时判断只能管到 JS 逻辑，<strong>模板结构和样式里的端差异它管不到</strong>——你想让某端多渲染一段 DOM，它无能为力。</li>
    </ul>

    <h2>编译期条件裁剪</h2>
    <p>
      不推翻"按平台分叉"，而是把分叉的时机<strong>从运行时提前到编译期</strong>：用注释式条件编译。把一段代码用 <code>// #ifdef MP-WEIXIN</code> 与 <code>// #endif</code> 包起来，编译器在为目标平台构建时决定这段代码的去留——非目标平台的分支<strong>直接不进产物</strong>。
    </p>
    <p>
      这一步换来两个关键性质：<strong>不产生任何运行时判断开销</strong>（因为判断根本不存在），以及<strong>不会把其它平台的死代码带进产物</strong>（因为它已经被裁掉了）。
    </p>
    <p>
      先补反向表达：<code>// #ifndef H5</code> 表示"除 H5 之外"，用来圈定"某端不做某事"。有了正向与反向两个方向，常见的端差异就都能描述了。
    </p>
    <p>
      再补它出现的位置——同一套注释写法能落在三个地方，因为差异可能出现在逻辑、结构或样式里：
    </p>
    <ol class="lesson-steps">
      <li>js/ts 里用 <code>// #ifdef MP-WEIXIN</code> 与 <code>// #endif</code> 包裹一行或一段代码。</li>
      <li>template 里用 HTML 注释包裹：<code>&lt;!-- #ifdef MP-WEIXIN --&gt;</code> 与 <code>&lt;!-- #endif --&gt;</code>。</li>
      <li>style/css 里用块注释包裹：<code>/* #ifdef H5 */</code> 与 <code>/* #endif */</code>。</li>
    </ol>
    <p>
      最后把平台标识对齐：<code>H5</code>、<code>MP-WEIXIN</code>、<code>APP-PLUS</code>，以及支付宝、抖音等更多小程序端的标识，官方文档里有全集。除了写进 <code>#ifdef</code>，部分场景还会以构建时常量的形式注入（例如 <code>process.env.UNI_PLATFORM</code>），供极少数无法用条件编译表达的判断使用。
    </p>
    <div class="lesson-box warn">
      <strong>三个必须守住的边界：</strong>条件编译是<strong>编译期行为</strong>，运行时看不到任何痕迹，别指望在真机上调它；每个 <code>#ifdef</code> / <code>#ifndef</code> 都<strong>必须有配对的 <code>#endif</code></strong>，一页里出现多次时要保证闭合关系正确，否则整段语法错乱；一段 <code>#ifdef</code> <strong>不能跨 script 与 template 之间包裹</strong>，它必须完整落在同一个区块内。差异逻辑一多，抽到外部文件再条件引入，可读性会好得多。
    </div>

    <h2>平台功能槽位增减</h2>
    <figure class="lesson-figure">
      <figcaption>点三个平台按钮，看哪些功能槽位出现、哪些整个消失——消失的那块不是被隐藏，而是编译期就不存在。</figcaption>
      <U02ConditionalCompilation />
    </figure>

    <h2>构建期分支裁剪</h2>
    <p>
      条件编译把"一套代码适配多端"从运行时的判断，变成构建时的选择：目标平台之外的分支在编译期就被裁掉，既不占包体，也不留运行时开销。用它表达端差异，你写的是同一份源码，产出的却是各自干净的产物。
    </p>
    <div class="lesson-term">
      <span class="term-name">「平台标识」</span>uni-app 用来指代目标端的字符串常量，如 <code>H5</code>、<code>MP-WEIXIN</code>、<code>APP-PLUS</code>，供 <code>#ifdef</code> / <code>#ifndef</code> 引用，全集以官方文档为准。要记住的边界：标识<strong>大小写敏感、需按文档原样书写</strong>；它只做编译期的取舍，无法表达"按用户设备临时决定"这类运行时条件。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
