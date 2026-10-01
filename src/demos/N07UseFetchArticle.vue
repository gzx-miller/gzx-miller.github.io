<script setup lang="ts">
import N07UseFetch from './N07UseFetch.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个商品列表页，用 SSR 打开：你在服务端日志里看到接口被请求了一次；切到浏览器 Network 面板，又看到<strong>同一个地址</strong>的请求发了第二次。页面看起来只是「加载了一次」，数据却取了两遍——多出来的那一趟，究竟是谁发的？
    </div>

    <h2>手动取数的三项负担</h2>
    <p>
      你想在组件里把接口数据显示出来。最直接的办法是在 <code>onMounted</code> 里手动 <code>fetch</code>，把结果塞进 <code>ref</code>。它有三项必须由你自己承担的成本。
    </p>
    <p>
      其一，<code>onMounted</code> <strong>只在浏览器执行</strong>，SSR 阶段服务端根本跑不到它，于是首屏 HTML 里这块数据是空的，要等客户端 JS 跑完才补上，搜索引擎也抓不到正文。其二，每写一次请求，就要把 loading、error 的管理代码再抄一遍。其三，服务端与客户端是两套独立的执行环境，你在服务端取到的数据如果没告诉客户端，客户端就会<strong>再请求一遍</strong>——这正是开场里多出来的那一趟。
    </p>
    <p>
      于是问题落到：<strong>有没有一种「在组件里声明式写一句」的方式，让它自动完成服务端取值、把结果交给客户端复用，顺便把加载态、错误态和刷新都带上？</strong>
    </p>

    <h2>一行声明的取数接口</h2>
    <p>
      最省事的声明是这样一句：<code>const { data, pending, error, refresh } = await useFetch('/api/users')</code>。
    </p>
    <p>
      它做对了一件事：<strong>把「发请求」和「服务端与客户端复用同一份结果」这两件事一起声明了出来</strong>。你只需要给出 URL，剩下的——什么时候在服务端发起、结果怎么传给客户端、加载与错误态怎么暴露——都由它接管。一个 URL、一次声明，就能拿到数据、加载态、错误态和刷新方法四样东西。
    </p>

    <h2>两端执行环境的差异</h2>
    <ul>
      <li>它默认会在<strong>服务端</strong>执行。如果这个接口依赖只有浏览器才有的信息，服务端取到的可能是错的，甚至直接报错。</li>
      <li>服务端与客户端之间的复用靠的是一把「自动生成的 key」。两个不同的请求如果算出了<strong>同一个 key</strong>，就会互相顶掉对方的数据——你以为各取各的，实际共享了同一份缓存。</li>
      <li>它只在<strong>能被追踪到的依赖</strong>变化时重新请求。URL 里放的是 <code>ref</code> 才会建立响应式依赖；用普通变量拼出 URL，值变了它也不会重发。</li>
      <li>有些接口（图表数据、个性化推荐）本来就只该在浏览器请求，默认的 SSR 执行反而帮了倒忙。</li>
    </ul>

    <h2>自动键与负载恢复</h2>
    <p>
      先看清它替你做了什么，再一层层补上参数、状态与开关。
    </p>
    <ol class="lesson-steps">
      <li><strong>自动 key 与 payload 恢复</strong>：<code>useFetch</code> 会按请求 URL <strong>自动生成一把 key</strong>，再用这把 key 把「服务端取到的结果」写进随 HTML 一起下发的 <strong>payload</strong>。客户端 Hydration 时先查 payload，命中就直接拿——于是同一 URL 在服务端与客户端之间<strong>只请求一次</strong>。开场里那第二趟，正是手动 <code>onMounted</code> 拿不到 payload、只能自己再请求一遍的结果。</li>
      <li><strong>参数与响应式 URL</strong>：用 <code>query</code>、<code>method</code> 等选项组合出完整请求；更关键的是把 <code>ref</code> 拼接进 URL 或放进 <code>query</code>，它的值一变，组件就会自动重新请求，不用你手写 watch。</li>
      <li><strong>刷新与错误</strong>：<code>pending</code> 驱动加载态、<code>error</code> 驱动错误提示，需要重取时调用 <code>refresh()</code>。加载、失败、刷新三条路径都收在同一套返回值里，不必再各自写一遍。</li>
      <li><strong>仅客户端请求</strong>：对只在浏览器才成立的接口，加上 <code>server: false</code> 就能跳过服务端执行，改为仅在客户端发起。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>当心自动 key：</strong><code>useFetch</code> 的 key 是按 URL 生成的，<strong>同一 URL 会共享同一份结果</strong>。若你有两处请求 URL 相同、其实想要不同数据，它们会撞在同一把 key 上互相覆盖；反过来，同一 key 的请求在页面切换之间还能直接复用缓存，需要强制刷新时用 <code>refresh()</code>，或干脆换成不同的 key。
    </div>

    <h2>四个返回值的分工</h2>
    <figure class="lesson-figure">
      <figcaption>依次点「获取数据」「模拟错误」「刷新 refresh()」三个按钮，看 <code>data</code>、<code>pending</code>、<code>error</code>、<code>refresh</code> 这四个返回值分别驱动了界面上的哪一块。</figcaption>
      <N07UseFetch />
    </figure>

    <h2>一次取数与两端复用</h2>
    <p>
      <code>useFetch</code> 的省心之处，在于它把「服务端取一次、客户端复用」这条链路封进了一句声明：按 URL 自动生成 key，SSR 的结果写进 payload，客户端 Hydration 时直接恢复，于是同一 URL 只请求一次。记住两条边界——<strong>它默认在服务端执行</strong>、<strong>同 URL 共享同一把 key 与缓存</strong>——就能既拿到 SSR 的首屏数据，又不重复请求。
    </p>
    <div class="lesson-term">
      <span class="term-name">「useFetch」</span>Nuxt 提供的声明式数据获取 composable，本质是 <code>useAsyncData(key, () =&gt; $fetch(url))</code> 的封装：<strong>按请求 URL 自动生成 key</strong>，SSR 时在服务端发起请求并把结果写进 payload，客户端 Hydration 时从 payload 恢复，因此同一 URL 不会重复请求。边界：<strong>默认在服务端执行</strong>（<code>server: false</code> 可改为仅客户端）；响应式 URL 与 <code>query</code> 变化会自动重发；同一 key 在页面切换间复用缓存，强制刷新用 <code>refresh()</code> 或更换 key。
    </div>
  </LessonArticle>
</template>
