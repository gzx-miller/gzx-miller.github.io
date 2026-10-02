const e=`<script setup lang="ts">
import X04DynamicRoutes from './X04DynamicRoutes.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>商品详情页只有一个文件 <code>app/products/[id]/page.tsx</code>，可全站有上万件商品——这个文件名里没写数字，页面又是怎么知道用户到底点开的是哪一件的？URL 后面那串 <code>?utm_source=xxx</code> 又该从哪里读？
    </div>

    <h2>同类页面规则化</h2>
    <p>
      电商站的商品详情页、内容站的分类页、搜索页，都有一个共同点：<strong>它们的「长相」是同一个，只是数据不同</strong>。你不会为每一件商品都建一个目录，而是希望一条规则覆盖一整类路径，运行时再根据实际地址取出参数，去查对应的数据。
    </p>
    <p>
      这里其实藏着两类完全不同的「参数字段」：一类是路径的一部分，比如 <code>/products/123</code> 里的 <code>123</code>，它决定了你访问的是哪个资源；另一类是路径之外的查询串，比如 <code>/products/123?utm_source=wechat</code>，它通常是统计来源、分页、筛选这类附加信息。搞清楚 <strong>这两类参数各自从哪读、读出来是什么类型</strong>，是这一课要解决的核心问题。
    </p>

    <h2>单段参数捕获</h2>
    <p>
      最小的一步，是先用方括号捕获一段路径：<code>app/products/[id]/page.tsx</code>。页面组件会收到一个 <code>params</code> 对象，访问 <code>/products/123</code> 时 <code>params.id</code> 就是字符串 <code>'123'</code>，拿它去请求数据即可。
    </p>
    <p>
      这一步做对了最关键的事——<strong>用文件名表达「这一段是变量」</strong>，一条路由就能覆盖整类页面。只要路径只有一段可变、且这一段必然存在，这样写就足够。
    </p>

    <h2>任意深度捕获</h2>
    <ul>
      <li>分类页的路径可能有任意多段，像 <code>/categories/electronics/phones</code>，单段 <code>[id]</code> 只能吃到一段。</li>
      <li>搜索页希望 <code>/search</code>、<code>/search/react</code>、<code>/search/react/hooks</code> 都能命中，尾段可有可无，普通方括号表达不了「可选」。</li>
      <li>来源、分页这类信息写在查询串里，<code>params</code> 里读不到，得另找入口。</li>
      <li>查询串的值可能是字符串，也可能是同名参数的数组，直接当字符串用会出错。</li>
      <li>热门商品如果能提前生成静态页，首屏会更快，但静态目录没法为「未知的上万个 id」预先建好。</li>
    </ul>

    <h2>捕获能力分级</h2>
    <p>
      不推翻「方括号捕获变量」，而是把捕获能力按需要分级，并为查询串单独留一个入口。
    </p>
    <ol class="lesson-steps">
      <li>单段参数继续用 <code>[id]</code>：<code>params.id</code> 是<strong>字符串</strong>，适合 <code>/products/123</code> 这类固定一段的路径。</li>
      <li>多段捕获用 <code>[...slug]</code>：<code>app/categories/[...slug]/page.tsx</code> 访问 <code>/categories/electronics/phones</code> 时，<code>params.slug</code> 是<strong>数组</strong> <code>['electronics', 'phones']</code>。</li>
      <li>可选尾段用 <code>[[...slug]]</code>：<code>app/search/[[...query]]/page.tsx</code> 同时匹配 <code>/search</code> 与 <code>/search/react/hooks</code>；没有尾段时 <code>params.query</code> 可能为 <code>undefined</code>，取值前先兜底。</li>
      <li>查询串改从 <code>searchParams</code> 读取：页面组件同时接收 <code>searchParams</code> 对象，用 <code>searchParams.utm_source</code> 这类写法拿到来源、页码等附加信息。</li>
    </ol>
    <p>
      到这里，「路径参数」和「查询参数」的分工就清楚了：<strong>决定资源身份的用 <code>params</code>，附加信息用 <code>searchParams</code></strong>。两者类型也不同，前者按段数可能是字符串或数组，后者的值同样可能是字符串或数组，因此读取前应先规范化为单值再用。
    </p>
    <p>
      接着解决「提前生成静态页」的需求。<code>generateStaticParams()</code> 可以在构建时返回一个参数列表，框架据此把动态路由预先渲染成一批静态页面：
    </p>
    <div class="lesson-box hint">
      在页面文件里导出 <code>generateStaticParams()</code>，它使用 <code>async</code> 返回形如 <code>[{ id: '1' }, { id: '2' }]</code> 的数组，构建时框架就会为这些 id 生成静态页。需要时还可以配合增量再生成，让新商品上架后自动补齐。
    </div>
    <p>
      最后是一个版本差异，也是初学者最容易卡住的地方：<strong>在 Next.js 15 及以上，<code>params</code> 与 <code>searchParams</code> 都是 Promise</strong>，不能直接当作普通对象读取，而要先把页面组件声明为 <code>async</code>，再用 <code>await</code> 解包，例如 <code>const { id } = await params</code>。这个变化是为了让框架能更晚、更精准地决定何时去读取这些请求相关信息。
    </p>
    <table>
      <thead>
        <tr><th>写法</th><th>匹配示例</th><th>取到的值</th></tr>
      </thead>
      <tbody>
        <tr><td><code>[id]</code></td><td><code>/products/123</code></td><td><code>params.id = '123'</code></td></tr>
        <tr><td><code>[...slug]</code></td><td><code>/categories/a/b</code></td><td><code>params.slug = ['a', 'b']</code></td></tr>
        <tr><td><code>[[...query]]</code></td><td><code>/search</code> 或 <code>/search/a/b</code></td><td><code>params.query</code> 可能为 <code>undefined</code></td></tr>
        <tr><td>查询串</td><td><code>?utm_source=x</code></td><td><code>searchParams.utm_source = 'x'</code></td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>两个要注意的副作用：</strong>一是在 Server Component 中读取 <code>searchParams</code>，会让这条路由<strong>转为动态渲染</strong>（每次请求执行），因为它依赖每次请求都可能不同的查询串；二是 <code>searchParams</code> 的每个值都可能是字符串或数组，直接当字符串拼接容易出错，先判断类型再使用。
    </div>

    <h2>参数解析结果</h2>
    <figure class="lesson-figure">
      <figcaption>切换不同的路径写法，看 <code>params</code> 与 <code>searchParams</code> 各自解析出什么。</figcaption>
      <X04DynamicRoutes />
    </figure>

    <h2>路径参数与查询串</h2>
    <p>
      动态路由这一课，本质是把「一类页面」压进一条规则：方括号捕获单段（字符串）、三点号捕获多段（数组）、双层方括号做可选捕获，路径参数走 <code>params</code>、附加信息走 <code>searchParams</code>。<code>generateStaticParams</code> 负责把已知参数预先静态化，而 Next.js 15+ 中这两个参数都是 Promise，记得用 <code>await</code> 解包。
    </p>
    <div class="lesson-term">
      <span class="term-name">「动态路由」</span>用文件名表达可变路径段：<code>[id]</code> 捕获单段、<code>[...slug]</code> 捕获多段（结果数组）、<code>[[...slug]]</code> 可选捕获。页面通过 <code>params</code> 读路径参数、通过 <code>searchParams</code> 读查询串，两者的值都可能是字符串或数组，使用前先规范化。<code>generateStaticParams()</code> 在构建期预生成动态路由的静态页；Next.js 15+ 中 <code>params</code> 与 <code>searchParams</code> 都是 Promise，需 <code>await</code> 解包。在 Server Component 中读取 <code>searchParams</code> 会使路由转为动态渲染。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
