<script setup lang="ts">
import V05Env from './V05Env.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把数据库连接串写进 <code>.env</code>，本以为它只在服务端使用；结果打包上线后，打开浏览器 DevTools 的 Network 面板，那串密码明晃晃地躺在 JS 产物里。
    </div>

    <h2>多环境取值差异</h2>
    <p>
      同一套代码要跑在开发、测试、生产三套环境上，API 地址、开关、版本号都不一样。硬编码进代码意味着每次发布都要改一遍源码，漏改一处就是线上事故。自然的想法是：把差异抽成「环境变量」，运行时按环境注入。
    </p>
    <p>
      但前端有个特殊之处：<strong>代码最终跑在用户的浏览器里，而浏览器没有任何「服务端环境」可言</strong>。于是两个问题同时冒出来：变量怎么按环境加载、相互覆盖的优先级是什么？以及——哪些变量能进入客户端，哪些一旦进去就等于公开？后者没处理好，就是开头那场泄漏。
    </p>

    <h2>变量文件写法</h2>
    <p>
      最直接的做法：建一个 <code>.env</code> 文件，按 <code>KEY=VALUE</code> 的格式写好变量，代码里读出来用。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「随环境变化的配置」从源码里剥离了出来</strong>，同一份代码配上不同的 <code>.env</code> 就能适配不同环境，不必再改代码。
    </p>

    <h2>敏感值前端暴露</h2>
    <ul>
      <li>浏览器里没有 <code>process</code>，直接写 <code>process.env.API_URL</code> 拿到的是 <code>undefined</code>，甚至连 <code>process</code> 本身都不存在。</li>
      <li>如果 <code>.env</code> 里所有变量都注入客户端，数据库密码这类服务端专用凭据会被一起打进产物，人人可见。</li>
      <li>不同环境要不同值，但一个 <code>.env</code> 只有一份，开发沿用生产地址就会连错后端。</li>
      <li>改完 <code>.env</code> 不重启开发服务器，浏览器里读到的还是旧值。</li>
    </ul>

    <h2>构建期静态替换</h2>
    <p>
      先解决「浏览器没有 process」。Vite 不在运行时注入变量，而是在<strong>构建时做静态替换</strong>：把代码里的 <code>import.meta.env.VITE_API_URL</code> 直接替换成字符串字面量。这也是为什么它必须在构建前就确定，运行时改不了。
    </p>
    <p>
      再解决「谁有资格进客户端」。Vite 加了一道前缀白名单：<strong>只有 <code>VITE_</code> 开头的变量会被替换进客户端代码</strong>，其余变量仅对配置文件的 Node 侧逻辑可见。把数据库密码写成不带前缀的 <code>DB_PASSWORD</code>，它从机制上就进不了浏览器——这才是防泄漏的正确姿势，而不是靠自觉。
    </p>
    <p>
      接着解决「多环境如何取不同值」。Vite 按固定优先级加载文件，后者覆盖前者：
    </p>
    <ol class="lesson-steps">
      <li><code>.env</code>：所有环境都会加载的公共变量。</li>
      <li><code>.env.local</code>：本机覆盖，通常加入 <code>.gitignore</code>。</li>
      <li><code>.env.[mode]</code>：当前模式专属，如 <code>.env.development</code>、<code>.env.production</code>。</li>
      <li><code>.env.[mode].local</code>：模式专属的本机覆盖，优先级最高。</li>
    </ol>
    <p>
      这里的 <code>mode</code> 默认是 <code>development</code>（<code>dev</code> 时）或 <code>production</code>（<code>build</code> 时），可用 <code>--mode</code> 覆盖。除自定义变量外，Vite 还内置了 <code>import.meta.env.MODE</code>、<code>DEV</code>、<code>PROD</code>、<code>SSR</code>，可以直接判断当前运行模式。
    </p>
    <p>
      再往前一步，配置文件里有时也需要读变量，比如给 <code>server.proxy</code> 配后端地址。这时用 <code>loadEnv(mode, process.cwd())</code> 读取；注意默认它<strong>只返回带 <code>VITE_</code> 前缀的变量</strong>，第三个参数传空字符串 <code>''</code> 才能把不带前缀的也读出来——因为这段逻辑跑在 Node 侧、不进浏览器，是安全的。
    </p>
    <p>
      最后补上类型提示。在 <code>vite-env.d.ts</code> 里扩展 <code>ImportMetaEnv</code> 接口，声明你自定义的变量，编辑器里 <code>import.meta.env.XXX</code> 才有补全和类型检查。
    </p>
    <div class="lesson-box warn">
      <strong>两条容易踩的线：</strong>敏感信息<strong>绝不能</strong>加 <code>VITE_</code> 前缀，它会原样进入客户端产物；变量在构建时被静态写死，多环境意味着各自构建一份，无法在运行时切换。另外，改完 <code>.env</code> 记得重启开发服务器，已注入的旧值不会热更新。
    </div>

    <h2>前缀与文件读取</h2>
    <figure class="lesson-figure">
      <figcaption>切 files / usage / prefix 三个页签：先看变量文件按优先级排列，再看配置文件与代码里分别怎么读，最后看 <code>VITE_</code> 前缀如何决定一个变量暴不暴露给客户端。</figcaption>
      <V05Env />
    </figure>

    <h2>优先级与白名单</h2>
    <p>
      环境变量这件事，关键是分清两件事：<strong>加载有优先级，暴露有白名单</strong>。Vite 按 <code>.env</code> → <code>.env.local</code> → <code>.env.[mode]</code> → <code>.env.[mode].local</code> 依次覆盖，最终值在构建时静态替换进代码；而只有 <code>VITE_</code> 前缀的变量会进入客户端，其余留在 Node 侧。记住这两条，多环境配置和密钥泄漏就都能守住。
    </p>
    <div class="lesson-term">
      <span class="term-name">「VITE_ 前缀」</span>是 Vite 用来区分客户端与服务端变量的白名单：只有以 <code>VITE_</code> 开头的变量才会被静态替换进客户端代码，通过 <code>import.meta<span>.env</span></code> 访问；不带前缀的变量仅对 <code>vite.config.ts</code> 等 Node 侧代码可见。边界：前缀是唯一判据，与变量是否「敏感」无关，所以密钥要刻意<strong>不加</strong>前缀。
    </div>
  </LessonArticle>
</template>
