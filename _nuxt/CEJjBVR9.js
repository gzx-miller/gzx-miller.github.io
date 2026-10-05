const e=`<script setup lang="ts">
import U04DataBindingEvents from './U04DataBindingEvents.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表每一项都能点开详情，项内还有个"报名"按钮。你给按钮绑了普通的点击事件，结果点"报名"的一瞬间，详情页也被打开了——两个动作一起触发，用户看到的是一次没头没脑的跳转。
    </div>

    <h2>列表点击与冒泡干扰</h2>
    <p>
      你要处理的是一个典型的列表页：顶部搜索框实时过滤，列表项点击进详情，项内还有一个不该连带触发父级的按钮。老办法是照搬原生 DOM 那一套——用 <code>addEventListener</code> 监听、读 <code>input</code> 事件的 <code>target</code>、靠 <code>return false</code> 阻止默认行为。
    </p>
    <p>
      但代价马上显出来：<strong>小程序没有 DOM</strong>，<code>addEventListener</code> 无从谈起；<strong>各端的事件对象长得不一样</strong>，H5 把值放在 <code>event.target.value</code>，小程序把它放在 <code>event.detail.value</code>，手写同步就得写三端兼容；<strong>阻止冒泡和默认行为在各端表现不一致</strong>，换一端就失灵。所以要问的是：怎么把手势和输入稳定地映射成页面状态，并让"谁触发、传什么、要不要继续冒泡"在各端都一致？
    </p>

    <h2>手动同步输入状态</h2>
    <p>
      最朴素的做法：手写双向绑定，自己把输入同步进状态，例如 <code>&lt;input :value="keyword" @input="keyword = $event.target.value"&gt;</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认"输入即状态"</strong>——输入框的内容是页面数据的一部分，改数据就能改界面，数据驱动这条路走通了。
    </p>

    <h2>三端取值路径差异</h2>
    <ul>
      <li>取值的路径三端不一样：H5 是 <code>$event.target.value</code>，小程序是 <code>$event.detail.value</code>，照抄一套写法就会有一端拿到 <code>undefined</code>。</li>
      <li>"报名"按钮的点击会冒泡到父级列表项，父级绑的"打开详情"被连带触发，出现一次双重动作。</li>
      <li>把过滤逻辑直接写在模板里（当场 <code>filter</code>），每次渲染都要重算一遍，且没法缓存结果。</li>
      <li>循环出来的列表项如果缺少稳定 key，Vue 的 diff 会复用错行，表现为"点了 A 报名，B 却亮了"。</li>
    </ul>

    <h2>双向绑定屏蔽差异</h2>
    <p>
      不推翻"输入即状态"，而是一层层把容易出错的手工活交给框架。先补 <code>v-model</code>：它把"读值 + 写回"收敛成一个指令，由框架屏蔽各端事件对象的差异——用在小程序内置组件上时，<code>v-model</code> 会被映射成对应的 value 属性与 input 事件。<span class="lesson-kv">:value + @input</span> 那套手写绑定就此可以省掉。
    </p>
    <p>
      接着补事件本身。<code>@click</code> 与 <code>@tap</code> 都能绑定点击，<strong>编译到小程序端时 <code>@click</code> 会被统一映射为原生 tap 事件</strong>，两者可互换，不必刻意二选一。
    </p>
    <p>
      再补传参：<code>@tap="fn($event, id)"</code>。这里的 <code>$event</code> 会带上原生事件对象，但要注意它<strong>不是标准的 DOM Event</strong>——在小程序端，坐标和目标信息躲在 <code>detail</code> 与 <code>target</code> 里，跨端取值优先靠 v-model，或者读 <code>e.detail</code>。
    </p>
    <p>
      然后是冒泡控制：给"报名"按钮加上 <code>@click.stop</code>，点击就<strong>不再向上冒泡</strong>，父级的"打开详情"自然不会被误触发；需要阻止默认行为时用 <code>.prevent</code>。这一层补完，两个动作才真正分开。
    </p>
    <p>
      最后补列表的稳定性与派生：循环项配 <code>:key</code> 让 diff 复用可靠；把筛选结果交给 <code>computed</code> 派生，而不是在模板里现算——关键字一变自动重算，其余渲染照旧。
    </p>
    <div class="lesson-box warn">
      <strong>三个跨端陷阱：</strong><code>$event</code> 在小程序端不是 DOM Event，别硬写 <code>e.target.value</code>，它会在一端静默取到 <code>undefined</code>；<code>.prevent</code> 对应的"默认行为"是浏览器概念，小程序端多数场景压根没有默认行为，不要指望它兜底；长按、触摸这类手势事件在不同端的触发细节也各有差异，别假设三端完全一致。
    </div>

    <h2>事件修饰符拦截冒泡</h2>
    <figure class="lesson-figure">
      <figcaption>输入关键字过滤课程；点"报名"按钮（@click.stop）不会连带打开详情，点列表项本身才会冒泡到父级。</figcaption>
      <U04DataBindingEvents />
    </figure>

    <h2>绑定与事件统一映射</h2>
    <p>
      数据绑定与事件处理，本质是把"输入同步、事件触发、传递参数、控制冒泡、列表复用"这些手工活交给框架统一映射。用 <code>v-model</code> 收口取值差异、用 <code>@click</code> / <code>@tap</code> 绑事件、用 <code>.stop</code> 切断多余冒泡、用 <code>:key</code> 配 <code>computed</code> 稳住列表，同一份交互就能在三端表现一致。
    </p>
    <div class="lesson-term">
      <span class="term-name">「tap 事件」</span>小程序 / uni-app 的原生点击事件，<code>@click</code> 在编译到小程序端时会被统一映射为 tap，因此两者在 uni-app 中可互换使用。要记住的边界：tap 的<strong>事件对象不是 DOM Event</strong>，取值要看 <code>detail</code> 与 <code>target</code>；长按、触摸等手势要用各自的事件名，不能指望 click 一并覆盖。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
