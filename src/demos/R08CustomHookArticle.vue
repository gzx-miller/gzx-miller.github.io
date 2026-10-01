<script setup lang="ts">
import R08CustomHook from './R08CustomHook.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程编辑器左边要显示「网络正常 / 当前离线」的徽标，右边要在离线时禁用保存按钮，两处都得知道在线状态。你把这套订阅逻辑复制了两份：各自 <code>useState</code>、各自 <code>useEffect</code>、各自 <code>addEventListener</code> 再各自清理。后来要改一句文案，才发现得在两个地方各改一遍。
    </div>

    <h2>重复订阅的复制成本</h2>
    <p>
      问题出在：<strong>「状态逻辑」没法像普通工具函数那样被复用</strong>。旧办法只能复制粘贴，隐藏成本很实在：同一段订阅写两遍，修 bug 要改两处、还容易改漏；两处的监听各自建、各自清，一旦漏掉 <code>removeEventListener</code> 就留下监听泄漏；想把这段逻辑单独验证，必须先搭一个组件把它渲染起来。
    </p>
    <p>
      所以要回答的是：<strong>能不能像抽普通函数一样，把一段「带着状态和副作用」的逻辑整段抽出来复用？</strong>
    </p>

    <h2>订阅逻辑的函数化</h2>
    <p>
      最朴素的一步：先把「怎么订阅」这段实现抽成一个普通函数，比如 <code>watchOnline(onChange)</code>，里面 <code>addEventListener</code>，并在返回的函数里 <code>removeEventListener</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>订阅的实现细节收进了一处</strong>，组件只调用它，不再复制粘贴那段 <code>addEventListener</code> / <code>removeEventListener</code>。
    </p>

    <h2>状态声明仍然重复</h2>
    <ul>
      <li>抽出的函数只管「订阅」，不管「持有状态」：每个组件仍要自己 <code>useState</code> 保存 <code>isOnline</code>，状态声明还是重复的。</li>
      <li>组件还要自己写 <code>useEffect(() =&gt; watchOnline(setOnline), [])</code>，「什么时候订阅」这部分逻辑依旧散在组件里。</li>
      <li>想让两个组件共享同一份在线状态？普通函数做不到——它们各自 <code>useState</code>，各存一份。</li>
      <li>更关键的是：一旦逻辑里要用到 <code>useState</code>、<code>useEffect</code> 这类 Hook，普通函数就没法直接调用了，因为 Hook 规则要求它们在组件或 Hook 的顶层执行。</li>
    </ul>

    <h2>自定义钩子的封装</h2>
    <p>
      要连「状态」一起复用，就得把它升级成<strong>自定义 Hook</strong>——一个以 use 开头、内部可以调用其他 Hook 的普通函数。顺序上，先立命名、再搬状态、后搬副作用。
    </p>
    <ol class="lesson-steps">
      <li>命名以 <code>use</code> 开头：<code>function useOnlineStatus()</code>，lint 与 Hooks 规则才会把它当 Hook 来校验。</li>
      <li>内部用 <code>useState</code> 持有状态，并做惰性初始化：<code>useState(() =&gt; navigator.onLine)</code>，避免每次渲染都白读一次。</li>
      <li>内部用 <code>useEffect</code> 订阅 <code>online</code> / <code>offline</code>，并在清理函数里 <code>removeEventListener</code>——建了什么就拆什么，两者对称。</li>
      <li>最后 <code>return isOnline</code>。<code>StatusBadge</code> 与 <code>SaveButton</code> 各自调用 <code>useOnlineStatus()</code>，共用同一套订阅逻辑。</li>
      <li>关键认知：每次调用都会创建一份<strong>独立且隔离</strong>的 state 与 effect——两个组件各自订阅、各自清理。所以复用 Hook 不等于共享状态。</li>
      <li>守好规则边界：Hook 只能在组件或其他 Hook 的顶层调用，不能放进 <code>if</code>、循环或嵌套函数里，否则每次渲染的调用顺序会变，状态就会串位；真要共享同一份状态，得把状态提升到共同父级，或改用外部状态源。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>最容易踩的坑：</strong>把 Hook 写进条件分支或循环。React 靠「每次渲染时的调用顺序」把每个 Hook 和它的状态槽位一一配对，顺序一变就全乱。看到「Rendered fewer hooks than expected」这类报错，先去检查是不是有 Hook 被放进了 <code>if</code> 里。
    </div>

    <h2>断网恢复的双处响应</h2>
    <figure class="lesson-figure">
      <figcaption>在 DevTools 里把网络切成 offline 再切回来，徽标和保存按钮会同时响应——它们调用的是同一个自定义 Hook，却各自拿着独立的订阅与状态，互不影响。</figcaption>
      <R08CustomHook />
    </figure>

    <h2>有状态逻辑的复用</h2>
    <p>
      自定义 Hook 复用的是「有状态逻辑」——一段包含 state、effect 和清理的完整过程，而不是那份状态本身。每次调用都长出一份自己的 state 与 effect；想共享同一个状态，要么把状态提升，要么换成外部状态源。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Hook 规则（Rules of Hooks）」</span>是两条硬性约定：只在 React 函数组件或自定义 Hook 的<strong>顶层</strong>调用 Hook；不要在条件、循环或嵌套函数里调用。原因在于 React 按「每次渲染时的调用顺序」把 Hook 与它对应的状态槽位一一配对，顺序一旦改变，状态就会错位。自定义 Hook 以 <code>use</code> 开头，正是为了让 lint 能识别并检查它。
    </div>
  </LessonArticle>
</template>
