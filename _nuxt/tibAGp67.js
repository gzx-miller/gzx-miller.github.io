const e=`<script setup lang="ts">
import X11RouteHandlers from './X11RouteHandlers.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程站要对外提供一个「按关键词查课程」的 JSON 接口，给小程序和第三方调用——可页面本身已经能取到数据了，为什么还要专门做一份接口？
    </div>

    <h2>对外接口缺口</h2>
    <p>
      页面能拿到数据，不等于别人能拿到数据。页面用的取数逻辑，要么是服务端渲染时直接查库，要么是写死在组件里的假数据；它们都只服务于「这一个页面」，没有对外的稳定形状。当小程序、移动端、第三方平台也想用这些数据时，你需要的是一个标准的、能被 curl 直接调用的 HTTP 接口。
    </p>
    <p>
      还有一类需求更棘手：接收第三方平台推送过来的 Webhook。它是外部服务主动<strong>发请求给你</strong>，你必须有一个能收 POST 的地址。
    </p>

    <h2>前端直连第三方</h2>
    <p>
      最省事的做法，是让前端直接去调对方的开放接口：组件里写 <code>fetch('https://third-party.com/api/...')</code>，由浏览器自己完成请求。
    </p>
    <p>
      它在「只是想显示别人的数据」时确实够用——<strong>浏览器天然就能发起跨域请求</strong>，不需要我们自己维护服务器。只要接口公开、没有密钥，这几乎零成本。
    </p>

    <h2>密钥泄露与回调</h2>
    <ul>
      <li>密钥泄露：调用第三方接口需要的 API Key 会写进前端代码，等于公开。</li>
      <li>无法对外提供接口：别人想调用你的数据，你却没有一个稳定的地址。</li>
      <li>收不了 Webhook：外部服务推来的请求，前端页面无从接收。</li>
      <li>没有统一治理：鉴权、限流、入参校验、错误码，散落在各处无从统一。</li>
    </ul>

    <h2>路由处理器机制</h2>
    <p>
      我们需要一个「服务端的接口层」。在 App Router 里，这件事由 Route Handler 承担：在 <code>app/api/</code> 下创建固定命名的 <code>route.ts</code>，<strong>目录层级即接口路径</strong>。文件里导出与 HTTP 方法同名的函数，就对应一个处理入口：
    </p>
    <p>
      <code>export async function GET()</code> 里用 <code>NextResponse.json(posts)</code> 返回数据；<code>export async function POST(request: NextRequest)</code> 里 <code>await request.json()</code> 解析请求体，再用 <code>NextResponse.json(newPost, { status: 201 })</code> 返回创建结果。GET、POST、PUT、DELETE、PATCH 都是同一种写法。
    </p>
    <p>
      动态段和查询串也各有位置。<code>app/api/posts/[id]/route.ts</code> 的函数第二个参数拿 <code>params</code>，里面的 <code>id</code> 就是路径里的动态段；查询参数则从 <code>new URL(request.url).searchParams</code> 里取，比如 <code>searchParams.get('q')</code>。
    </p>
    <p>
      和响应相关的常见操作也都能覆盖：用 <code>cookies()</code> 或 <code>response.cookies.set</code> 写 Cookie（记得带上 <code>httpOnly</code>、<code>secure</code>、<code>sameSite</code> 等属性），用 <code>headers</code> 选项自定义响应头，比如给 GET 的结果加上 <code>Cache-Control</code>。
    </p>
    <table>
      <thead>
        <tr><th>方法</th><th>用途</th><th>缓存</th></tr>
      </thead>
      <tbody>
        <tr><td><code>GET</code></td><td>读取数据</td><td>满足静态条件时可缓存</td></tr>
        <tr><td><code>POST</code></td><td>创建数据</td><td>默认不缓存</td></tr>
        <tr><td><code>PUT</code> / <code>PATCH</code></td><td>更新数据</td><td>默认不缓存</td></tr>
        <tr><td><code>DELETE</code></td><td>删除数据</td><td>默认不缓存</td></tr>
      </tbody>
    </table>
    <p>
      这里最容易被混淆的是「什么时候该用 Route Handler、什么时候该用 Server Action」。两者的定位并不重叠：<strong>Route Handler 面向的是「外部调用者」</strong>，产出标准 REST API、Webhook 或第三方接口代理，读方法在满足静态条件时可被缓存、写方法默认不缓存；<strong>Server Action 面向的是「自己页面里的表单与数据变更」</strong>，直接省掉接口层。要给别人一个地址，选前者；只是自家表单提交，选后者。
    </p>
    <div class="lesson-box warn">
      <strong>安全上必须有意识地做两件事：</strong>一是对外暴露的接口要<strong>校验入参</strong>并返回合适的错误码，绝不能默认信任客户端传来的数据；二是要记住写操作默认不缓存这一条，别指望用它来「顺带缓存一下」。
    </div>
    <p>
      把这两类需求放回 Route Handler 就都顺了：接 Webhook 就是在 <code>app/api/webhook/route.ts</code> 里导出 <code>POST</code>，读取并校验外部请求，再返回一个 200；做第三方代理则是把它当成「自己服务器上的中转站」，密钥留在服务端，前端只访问自家接口。至于缓存，只有读出型的 GET 才谈得上被复用，一旦这个 GET 读取了 cookies 或请求头，它也会转为按请求执行。
    </p>
    <p>
      最后，Route Handler 既能跑在 Node Runtime，也能跑在 Edge Runtime，视依赖而定；不需要读写文件系统或 Node 专有模块的接口，放到 Edge 上会更贴近用户。
    </p>
    <p>
      还要记住，Route Handler 与渲染页面走的是不同的入口：它不参与页面渲染，只负责处理请求并返回一个响应。理解这一点，就不容易把「读数据渲染页面」和「对外提供接口」两件事混在一起。
    </p>

    <h2>单文件多方法响应</h2>
    <figure class="lesson-figure">
      <figcaption>逐个点开各 HTTP 方法，看同一个 route.ts 如何分别响应不同请求。</figcaption>
      <X11RouteHandlers />
    </figure>

    <h2>服务端接口层</h2>
    <p>
      Route Handler 补上了「服务端对外接口」这一层：在 <code>app/api/</code> 下按目录层级写 <code>route.ts</code>，导出同名方法处理请求，用 <code>NextResponse</code> 返回 JSON、状态码与响应头，动态段与查询串各归其位。它和 Server Action 不是替代关系，而是「给外人用的 API」与「给自家表单用的函数」的分工。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Route Handler」</span>是 <code>app/api/</code> 下用 <code>route.ts</code> 定义的 HTTP 接口，文件名固定、目录层级即 API 路径。每个导出的方法（GET/POST/PUT/DELETE/PATCH）对应一个处理函数并返回 <code>NextResponse</code>：动态参数取自第二参数的 <code>params</code>，查询串取自 <code>new URL(request.url).searchParams</code>。GET 满足静态条件时可缓存，写操作默认不缓存，可运行在 Node 或 Edge Runtime。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
