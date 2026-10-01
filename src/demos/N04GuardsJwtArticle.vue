<script setup lang="ts">
import N04GuardsJwt from './N04GuardsJwt.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>登录成功后拿到一串 token，之后带它访问 <code>/auth/profile</code> 就通过了；可我把 token 改掉一位再试，得到的是 <code>401</code>——服务端到底凭什么判断这串字符串「是它发的」且「还没过期」？
    </div>

    <h2>提出问题</h2>
    <p>
      课程系统里，一部分接口人人可访问（课程列表），另一部分必须登录后才能用（我的报名、个人资料）。你要在<strong>请求真正到达业务逻辑之前</strong>，判断「这个人是谁、有没有资格」。
    </p>
    <p>
      一个自然的直觉是：服务端把每个登录用户的会话存起来，请求来了就查表。可一旦服务要部署多个实例，会话该存哪份、实例之间怎么同步，立刻成了新问题。你真正想要的是一种<strong>「服务端不存会话、只靠请求自带的凭证就能验明身份」</strong>的方案。这就是 JWT 要解决的：把所有身份信息签名打包在一串 token 里，交给客户端保管、每次请求带回来。而承担「进门之前先查证件」职责的，就是守卫。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：在每个受保护的方法里，自己从请求头取 token、自己验一遍。能过就继续，不能过就抛错。比如在 <code>getProfile</code> 的开头写几行校验。
    </p>
    <p>
      它做对了一件关键的事：<strong>把「放行与否」的判断放在了业务代码之前</strong>，非法请求不会污染业务逻辑。只有一个受保护接口时，这样写足够直白。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>每个受保护接口都要复制一遍「取 token、验签、查过期」的样板，遗漏一处就是一处漏洞。</li>
      <li>校验逻辑与业务逻辑混在一个函数里，鉴权改动牵一发动全身。</li>
      <li>无法统一区分「没带凭证」和「凭证过期」等失败语义，错误码容易混乱。</li>
      <li>想在一组接口上统一启用鉴权，没有可挂载的组织单位，只能逐个方法加。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「先验身份再进业务」，而是把这段校验<strong>抽成一个独立的、可挂载的组件</strong>——守卫（Guard）。守卫实现 <code>CanActivate</code> 接口，在请求进入路由处理器<strong>之前</strong>决定是否放行，是鉴权与授权的首选位置。用 <code>@UseGuards(JwtAuthGuard)</code> 挂在控制器或方法上，就能按需启用。
    </p>
    <p>
      整条链路可以拆成三个动作，正好对应你要理解的三个问题：
    </p>
    <ol class="lesson-steps">
      <li><strong>登录发 token：</strong><code>POST /auth/login</code> 校验用户名密码，通过后用 <code>JwtService.sign</code> 签发一串带签名的 token 返回给客户端。</li>
      <li><strong>守卫解析校验：</strong>之后每个受保护请求都带上 <code>Authorization: Bearer &lt;token&gt;</code> 头。守卫 <code>canActivate</code> 里从头部取出 token，调用 <code>jwtService.verifyAsync</code> 验签并解析出 payload（过期会抛出 <code>TokenExpiredError</code>）。</li>
      <li><strong>放行或 401：</strong>验签成功则把用户信息挂到请求对象上（<code>request.user = payload</code>）并返回 <code>true</code> 放行；缺 token 或验签失败则抛 <code>UnauthorizedException</code>，客户端收到 <code>401</code>。</li>
    </ol>
    <p>
      这里有个容易混淆的细节：<strong>守卫返回 <code>false</code> 时框架自动回 <code>403</code>（禁止访问），而抛 <code>UnauthorizedException</code> 才是 <code>401</code>（未认证）</strong>。语义上，「没登录」用 401，「登录了但没权限」用 403，别把两者混为一谈。
    </p>
    <p>
      守卫还有两个特性值得记住。其一，它的<strong>执行位置在中间件之后、管道之前</strong>，因此能通过 <code>ExecutionContext</code> 拿到请求元数据——这正是它比中间件更适合做鉴权的原因。其二，基于角色的授权可以在它之上叠加：用自定义的 <code>@Roles()</code> 装饰器标注所需角色，再让守卫反射出这份元数据做校验，就能实现「只有讲师能发公告」这类规则。
    </p>
    <div class="lesson-box warn">
      <strong>JWT 是无状态的，代价要认清：</strong>服务端不保存会话，所以<strong>密钥一旦泄漏，等于所有已签发的 token 全部失效</strong>，必须立刻轮换。另外，过期由 token 里的 <code>exp</code> 决定，服务端无法像传统会话那样「主动踢人下线」——demo 里的 token 只带 60 秒有效期，守卫在验签之后还要判断是否超过 <code>exp</code>，过期即抛 <code>401</code>，体现的正是无状态会话的过期机制。
    </div>
    <div class="lesson-box hint">
      <strong>token 该放在哪：</strong>塞进 <code>localStorage</code> 并自动附加到每次请求确实方便，但一旦页面发生 XSS，脚本就能把 token 直接盗走。生产环境优先用 <code>HttpOnly Cookie</code> 承载 JWT，让脚本读不到它，同时通过 <code>SameSite</code> 等策略处理 CSRF 风险。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>先登录签发 token，再访问受保护接口，看守卫逐步校验；试试不登录直接访问，或等 60 秒后再访问。</figcaption>
      <N04GuardsJwt />
    </figure>

    <h2>总结</h2>
    <p>
      守卫把「进门之前查证件」这件事从业务代码里独立出来，放在请求进入处理器之前统一执行。JWT 让身份凭证自带签名、服务端不再存会话：登录签发、请求携带、守卫验签，成功挂上 <code>request.user</code> 放行，失败回 401。它换来的是无状态与可扩展，代价是密钥必须严守、过期之外无法主动吊销。
    </p>
    <div class="lesson-term">
      <span class="term-name">「守卫与 JWT 认证」</span>守卫（Guard）实现 <code>CanActivate</code>，在请求进入处理器前决定是否放行，位置在中间件之后、管道之前。JWT 流程：登录用 <code>JwtService.sign</code> 签发签名 token，之后请求携带 <code>Authorization: Bearer &lt;token&gt;</code>，守卫用 <code>verifyAsync</code> 验签解析 payload，有效则挂到 <code>request.user</code> 放行，无效或过期抛 <code>401</code>。返回 <code>false</code> 得 403，抛 <code>UnauthorizedException</code> 得 401；搭配 <code>@Roles()</code> 可做角色授权，生产环境优先用 <code>HttpOnly Cookie</code> 承载 token。
    </div>
  </LessonArticle>
</template>
