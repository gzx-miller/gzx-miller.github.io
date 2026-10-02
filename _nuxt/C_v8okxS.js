const o=`<script setup lang="ts">
import U03PageLifecycle from './U03PageLifecycle.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 <code>onLoad</code> 里拉了一次课程列表。用户点进详情、又返回列表页，看到的还是刚才那份旧数据——你明明把刷新写在"页面加载"里，可返回时它一次都没再执行。
    </div>

    <h2>返回列表刷新时机</h2>
    <p>
      场景很常见：列表页进详情页，返回时希望列表是最新的。你在 Vue 里习惯把初始化写进 <code>onMounted</code>，把它当成"页面加载时执行一次"；可小程序没有 <code>activated</code> 那套路由钩子，页面也不是"每次显示都重新挂载"。
    </p>
    <p>
      于是要求变得矛盾：<strong>只在首次拉一次</strong>，返回时数据就陈旧；<strong>每次可见都重新拉</strong>，来回切换又变成请求风暴；而<strong>定时器、事件监听只在挂载时建、却没有合适的销毁时机</strong>，用着用着就积成了内存泄漏。所以真正要问的是：一个页面从创建到销毁，哪些时刻注定只发生一次、哪些时刻会反复发生，初始化、刷新和清理该怎么分别安放？
    </p>

    <h2>初始化写入挂载钩子</h2>
    <p>
      最朴素的办法：把初始化写进 Vue 的 <code>onMounted</code>，把它当成"页面加载时执行一次"。
    </p>
    <p>
      这个方案做对了一件事：<strong>首次进入页面时确实完成了初始化</strong>，请求发出去了，数据也渲染出来了，单次打开的场景完全够用。
    </p>

    <h2>挂载钩子触发局限</h2>
    <ul>
      <li><code>onMounted</code> 只代表"组件首次挂载"——从后台或其他页面返回时不会再触发，列表永远停在第一次拉到的数据上。</li>
      <li>它区分不了"页面被切走（隐藏）"和"页面被销毁"：小程序里切走并不销毁，回到前台时组件根本不会重新挂载。</li>
      <li><code>onMounted</code> 触发时首帧未必渲染完成，这时去量节点尺寸，可能只拿到 <code>0</code>。</li>
      <li>没有与"离开"对称的时机，定时器、事件监听无处清理，来回几次就越积越多。</li>
    </ul>

    <h2>两套生命周期并存</h2>
    <p>
      不推翻"初始化只做一次"的判断，而是<strong>把"页面"这个对象的完整一生拆成几个明确的时刻</strong>。uni-app 的页面生命周期继承自小程序模型，和 Vue 自身的生命周期<strong>并存</strong>——各管一摊，谁适合做什么就交给谁。
    </p>
    <ol class="lesson-steps">
      <li><code>onLoad</code>：页面<strong>首次创建</strong>时触发一次，用来读取路由参数、做一次性初始化。</li>
      <li><code>onShow</code>：<strong>每次</strong>页面进入前台都触发，首次紧跟在 onLoad 之后，从后台或其他页面返回时还会再来——适合刷新可能变化的数据。</li>
      <li><code>onReady</code>：页面<strong>首次渲染完成</strong>后触发，此时访问节点尺寸、初始化依赖真实渲染的第三方库才可靠。</li>
      <li><code>onHide</code>：页面切走但<strong>未销毁</strong>，用来暂停轮询、计时这类后台行为。</li>
      <li><code>onUnload</code>：页面<strong>销毁</strong>，用来清理定时器与事件监听。</li>
    </ol>
    <p>
      拿着这套时刻表回头看开场就通了：首次进入的序列是 <span class="lesson-kv">onLoad → onShow → onReady</span>；用户返回列表页时，页面并没有重新创建，触发的是 <code>onShow</code> 而不是 <code>onLoad</code>，<code>onMounted</code> 更是不会再出现。所以<strong>刷新要放进 onShow，一次性初始化才留给 onLoad</strong>。
    </p>
    <p>
      这些生命周期用组合式写法时，从 <code>@dcloudio/uni-app</code> 导入即可（它的写法细节下一课还会展开）；注意它们和 <code>vue</code> 自带的 <code>onMounted</code>、<code>onUnmounted</code> 是两套东西，不要互相替代。
    </p>
    <div class="lesson-box warn">
      <strong>几个容易混淆的边界：</strong><code>onShow</code> 在 <code>onLoad</code> 之后以及从后台返回时都会执行，别把"只该做一次"的初始化塞进它；不要在 <code>onLoad</code> 里做依赖 DOM 的操作，那时页面还没渲染；<code>onHide</code> 是"暂时隐藏、可能还会回来"，<code>onUnload</code> 才是"销毁、不再回来"，清理逻辑要放在后者。下拉刷新、触底加载是另外两个页面事件（对应 <code>onPullDownRefresh</code> / <code>onReachBottom</code>），别和这几个混为一谈。
    </div>

    <h2>钩子触发次序演示</h2>
    <figure class="lesson-figure">
      <figcaption>依次点"进入页面 / 返回前台 / 切走后 / 退出页面"，看日志区按顺序打出各个钩子——尤其注意 onShow 会反复出现，onLoad 只出现一次。</figcaption>
      <U03PageLifecycle />
    </figure>

    <h2>生命周期时刻划分</h2>
    <p>
      页面生命周期的价值，是把"页面的一生"切成几个可命名的时刻：创建只一次、每次可见都一次、渲染完成一次、隐藏与销毁各一次。把一次性初始化交给 <code>onLoad</code>、把刷新交给 <code>onShow</code>、把渲染后操作交给 <code>onReady</code>、把清理交给 <code>onUnload</code>，数据陈旧和资源泄漏就同时解决了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「onReady」</span>页面<strong>首次渲染完成后</strong>触发的生命周期，只触发一次；此时才适合访问节点尺寸、初始化依赖真实渲染的第三方库。要记住的边界：它<strong>只对应首帧</strong>，后续数据更新不会再次触发；需要访问 DOM 的操作必须等到它，而不是放在 <code>onLoad</code> 里。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
