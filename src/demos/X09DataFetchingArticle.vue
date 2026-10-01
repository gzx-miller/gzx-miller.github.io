<script setup lang="ts">
import X09DataFetching from './X09DataFetching.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表页打开时先闪一下空白，过一会儿才冒出内容——数据服务明明很快，为什么用户一定要盯着空屏等一轮请求？
    </div>

    <h2>渲染等待数据</h2>
    <p>
      你在做课程站的列表页：进入页面要展示一批课程，数据存在后端接口里。在单页应用里，这几乎是一套固定动作——页面组件先挂载，然后在 <code>useEffect</code> 里发请求，拿到数据再存进 <code>state</code>，界面才第一次真正有内容。整个过程用户看到的，是一段「先空、后满」的过渡。
    </p>
    <p>
      这段过渡看起来只是「加载了一下」，但它的代价一直被默认接受了：首帧 HTML 里没有任何数据，浏览器必须先把脚本下载、执行，再发出请求、等响应回来，界面才会被填满。问题不在请求快不快，而在<strong>渲染的时机被排在了数据之后</strong>。
    </p>

    <h2>浏览器取数流程</h2>
    <p>
      最省事的做法，是把这段「挂载后取数」的逻辑留在浏览器里：用 <code>const [posts, setPosts] = useState([])</code> 建一个空列表，再在 <code>useEffect</code> 中 <code>fetch('/api/posts')</code> 并把结果 <code>setPosts</code>。组件先渲染空列表，数据到了触发一次更新，列表补上。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「页面」和「数据」解耦了</strong>——页面结构先出来，数据后到，两者互不阻塞对方的代码编写。当只有一处数据、用户体验要求不高时，它确实能用。
    </p>

    <h2>挂载取数的短板</h2>
    <ul>
      <li>首屏空白或转圈：HTML 到达时没有数据，用户必须等浏览器完成一次请求往返。</li>
      <li>请求瀑布：父组件取完数据渲染子组件，子组件再发请求，一层层串行叠加。</li>
      <li>重复请求：多个组件需要同一份数据，各自写一个 <code>useEffect</code>，同一个地址被请求多次。</li>
      <li>缓存失控：缓存散落在浏览器里，服务端想统一控制命中与失效很困难。</li>
      <li>敏感逻辑无处安放：客户端代码会打包给用户，数据库、密钥、私密接口都不敢碰。</li>
    </ul>

    <h2>服务端数据预取</h2>
    <p>
      不推翻「取数据再渲染」，而是<strong>把取数搬到渲染之前、搬到服务端</strong>。App Router 里的页面默认就是 Server Component，可以直接写 async 函数并在组件里 <code>await</code>：
    </p>
    <p>
      <code>async function getPosts()</code> 里 <code>await fetch('https://api.example.com/posts')</code>，检查 <code>res.ok</code> 后返回 <code>res.json()</code>；页面组件写成 <code>export default async function</code>，里面 <code>const posts = await getPosts()</code>，拿到结果直接渲染。
    </p>
    <p>
      这样做的关键差别是：<strong>数据在服务端渲染时就已就位</strong>，吐给浏览器的 HTML 本身就带着列表内容，首帧即有数据；同时这段逻辑不进入客户端 bundle，访问数据库或内部接口都不必担心泄露。
    </p>
    <p>
      接着解决「要不要每次都去取」的问题。Next.js 扩展了原生 <code>fetch</code>，用选项表达缓存意图：
    </p>
    <table>
      <thead>
        <tr><th>选项</th><th>行为</th><th>适用场景</th></tr>
      </thead>
      <tbody>
        <tr><td><code>cache: 'no-store'</code></td><td>不缓存，每次请求重新获取</td><td>实时数据</td></tr>
        <tr><td><code>cache: 'force-cache'</code></td><td>持久缓存</td><td>很少变动的静态内容</td></tr>
        <tr><td><code>next: { revalidate: 60 }</code></td><td>60 秒后重新验证（ISR）</td><td>半静态内容</td></tr>
        <tr><td><code>next: { tags: ['posts'] }</code></td><td>按标签缓存，可主动失效</td><td>按需更新</td></tr>
      </tbody>
    </table>
    <p>
      想让数据一改就生效，就给请求打上 <code>tags</code>，在 Server Action 或 Route Handler 里调用 <code>revalidateTag('posts')</code> 精确失效；想按路径刷新则用 <code>revalidatePath</code>。缓存因此从「碰运气」变成一句可读的声明。
    </p>
    <p>
      还有一个白捡的好处是<strong>请求去重</strong>：在同一次渲染中，相同 URL 的 <code>fetch</code> 只会真正执行一次（Request Memoization）。所以多个组件各自请求同一份数据也不必担心翻倍，这对需要用 React 的 <code>cache()</code> 包一层非 fetch 的函数时同样成立。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>较新版本（15+）里 <code>fetch</code> 默认<strong>不缓存</strong>，需要缓存时要显式写上缓存项，别想当然以为它沿用旧默认；另外 Data Cache 存在服务端并跨请求共享，它<strong>不是浏览器缓存</strong>，用「清浏览器的缓存」来排查往往无效。
    </div>
    <p>
      排查缓存命中时也别靠直觉：先用日志确认取数函数有没有被重新执行，再结合构建输出的路由标记对照，才能判断到底命中了哪一层。
    </p>
    <p>
      选哪种策略，本质上取决于三件事：数据多久变一次、用户能否接受短暂的不一致、以及变更能不能被明确地触发。首页内容可能一周才改一次，用定时重新验证最省心；库存、余额这类随时在变的数据，用 <code>no-store</code> 才稳妥；而后台一改就要立刻反映到前台的数据，则靠 <code>tags</code> 加 <code>revalidateTag</code> 的组合，让「哪里变了」这件事由业务代码说了算，而不是交给时间去猜。
    </p>

    <h2>四种缓存差异</h2>
    <figure class="lesson-figure">
      <figcaption>切换四种缓存选项，观察同一段 fetch 在不同策略下的行为差异。</figcaption>
      <X09DataFetching />
    </figure>

    <h2>数据先行的顺序</h2>
    <p>
      数据获取这件事的核心矛盾是「渲染和数据谁先到位」。把它搬进 Server Component 直接 <code>await</code>，让数据先于 HTML 到达；再用手里的缓存选项，把「每次都取、多久变一次、何时主动失效」说清楚——首屏白屏和重复请求这两类问题就一起消失了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「服务端 fetch 缓存」</span>指 Next.js 扩展过的 <code>fetch</code>：可用 <code>no-store</code> 关缓存、<code>force-cache</code> 持久缓存、<code>next.revalidate</code> 定时刷新、<code>next.tags</code> 打标签并用 <code>revalidateTag</code> 或 <code>revalidatePath</code> 主动失效。同一次渲染中相同 URL 的请求自动去重（Request Memoization），且 Data Cache 位于服务端、跨请求共享，并非浏览器缓存。
    </div>
  </LessonArticle>
</template>
