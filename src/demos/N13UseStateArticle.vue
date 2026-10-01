<script setup lang="ts">
import N13UseState from './N13UseState.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>为了让主题在导航栏和设置页之间同步，你在 <code>composables/useTheme.ts</code> 的模块顶层写了 <code>const theme = ref('light')</code>，再导出 <code>useTheme()</code> 把它交出去。纯前端跑起来一切正常，两个组件都跟着变。上线开 SSR 后，同事把他的主题切成暗色，你刷新页面——第一眼看到的也是暗色。一个模块级的 ref，怎么就把两个人的界面搅到一起了？
    </div>

    <h2>跨用户的状态串扰</h2>
    <p>
      你要的很朴素：让主题、侧边栏开合、当前登录用户这类<strong>轻量状态</strong>在几个组件之间共享一份。共享这件事在纯浏览器里很容易，真正难的是它还得在服务端渲染下成立。
    </p>
    <p>
      旧办法的麻烦，全出在「状态挂在哪儿」。写在各自组件里的 <code>ref</code>：每个组件一份，改 A 不动 B，根本没有共享。提到<strong>模块顶层再导出</strong>：纯客户端下确实能同步，但服务端进程是长期驻留的，这个模块级的 ref 就成了进程内的全局变量——多个用户的请求反复读写同一格内存，A 用户的主题污染到 B 用户；就算是只读，客户端接管后这份内存与 HTML 里渲染出来的内容也可能对不上。干脆上 Pinia：能力当然够，但为一个主题开关引入完整 store，还要额外做 SSR 配置，成本偏高。
    </p>
    <p>
      于是问题落到：<strong>有没有一种状态容器，既跨组件共享，又按请求彼此隔离，还能被服务端序列化后交给客户端复用？</strong>
    </p>

    <h2>键名与初始化函数</h2>
    <p>
      用 <code>useState('theme', () =&gt; 'light')</code>。第一个参数是一个字符串 key，第二个参数给出首次创建时的默认值。
    </p>
    <p>
      这个方案做对了一件事：<strong>状态不再寄存在模块内存里</strong>，而是挂在「当前这次请求（服务端）或当前这个应用实例（客户端）」的上下文上，用 key 当索引。两个组件用同一个 key，自然拿到同一份；不同请求各有各的上下文，也就天然隔离了。
    </p>

    <h2>同名键的相互覆盖</h2>
    <ul>
      <li>key 只是一个普通字符串，没有任何命名空间：购物车和结算页都随手写了 <code>useState('count')</code>，两份本来无关的数据会变成同一份。</li>
      <li>初始化函数 <code>() =&gt; 'light'</code> <strong>只在该 key 第一次创建时执行</strong>：后面某个组件再写 <code>useState('theme', () =&gt; 'dark')</code>，传进去的默认值会被直接忽略。</li>
      <li>如果初始值在服务端依赖了外部的<strong>模块级变量</strong>（比如一个全局缓存的用户信息），那它每次算出来都可能是上一个请求的残留——污染只是从 ref 搬到了初始化函数里。</li>
      <li>它本身没有 getters、没有 actions、没有 DevTools、也没有插件生态；把带异步请求和派生计算的复杂状态塞进去，只能手写一堆函数。</li>
    </ul>

    <h2>命名空间式前缀</h2>
    <p>
      第一步先给 key 立规矩：加上业务命名空间，用 <code>'cart:count'</code>、<code>'user:theme'</code> 这样的形式，避免不同模块撞车。
    </p>
    <p>
      接着要弄明白它为什么 SSR 安全。这条链是这样的：
    </p>
    <ol class="lesson-steps">
      <li>组件 A 调用 <code>useState('theme', () =&gt; 'light')</code>，这个 key 被首次创建并初始化。</li>
      <li>SSR 阶段这份状态被序列化进 payload，跟 HTML 一起发给客户端。</li>
      <li>组件 B 用 <code>useState('theme')</code> 读到同一份，读的时候不需要再传默认值。</li>
      <li>客户端 Hydration 时从 payload 恢复这份值，而不是重新执行初始化函数——服务端算出的数据被原样复用，页面不会先闪一个默认值再跳回来。</li>
    </ol>
    <p>
      第三步，把「初始化只发生一次」这条规则用对地方。既然初始化函数只在首次创建时执行，那么「因请求而异」的初值就必须在函数里<strong>现算</strong>（读当前请求的 cookie 或数据），绝不能引用模块级变量，否则等于把跨请求污染换了个位置。
    </p>
    <p>
      最后划清它与 Pinia 的边界，这才是这节课真正要带走的判断。useState 适合主题、侧边栏、简单的全局标记——<strong>共享范围小、逻辑就是读和写</strong>；Pinia 适合复杂业务状态——有<strong>异步 action</strong>、有 getters 派生、需要 DevTools 调试、需要插件和多个 store 分工。两者不互斥，可以在同一个项目里各管一段：轻量的交互开关走 useState，业务域模型走 Pinia。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>用模块级 <code>ref</code> 或普通变量做共享状态——纯客户端下看不出问题，一开 SSR 就会跨请求串数据，这正是前面讲 SSR 时说的「跨请求污染」在共享状态上的具体形态；把 useState 当 store 用——它没有 action 和 getters，硬塞复杂逻辑只会写出一堆手工函数，该上 Pinia 的时候就要上。
    </div>

    <h2>计数器按钮的联动</h2>
    <figure class="lesson-figure">
      <figcaption>两个「+1」按钮分别模拟组件 A 和组件 B 操作同一个共享计数器，点哪个都会让数字一起涨——这就是「同一个 key 拿到同一份状态」；再点「切换主题」看共享的主题值变化，右侧对照代码示例、SSR 数据流的四个步骤，以及 useState 与 Pinia 的对比表。</figcaption>
      <N13UseState />
    </figure>

    <h2>共享与独立的取舍</h2>
    <p>
      <code>useState</code> 把共享状态从模块内存搬到了「每次请求 / 每个应用实例」的上下文里，再用一个全局 key 把它找回来：key 相同就共享，请求不同就隔离，SSR 期间算出的值随 payload 下发、Hydration 时从 payload 恢复而不再重新初始化。它就是一层很薄的 SSR 安全共享，够用就用它，复杂了再交给 Pinia。
    </p>
    <div class="lesson-term">
      <span class="term-name">「请求作用域（request scope）」</span>指把可变状态的生命周期绑定在<strong>单次 HTTP 请求</strong>上，而不是进程或模块上，这样不同请求之间互不可见、不会互相污染。Nuxt 的 <code>useState</code> 正是按这个思路存放状态：服务端按请求隔离，客户端则对应到当前应用实例。边界：模块级变量、模块顶层 <code>new</code> 出来的对象、闭包缓存、单例 HTTP 客户端都属于<strong>进程作用域</strong>而非请求作用域，把它们当成共享状态用，就会在并发请求下串数据。
    </div>
  </LessonArticle>
</template>
