<script setup lang="ts">
import N18RuntimeConfig from './N18RuntimeConfig.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把两个配置都写进了同一个 <code>runtimeConfig</code>：一个 <code>secretKey</code> 放在顶层，一个 <code>apiKey</code> 放在 <code>public</code> 里。上线后你在浏览器里搜打包好的 JS，发现 <code>apiKey</code> 赫然躺在里面，而 <code>secretKey</code> 怎么也搜不到。同一份配置，凭什么一个能被用户翻出来、另一个藏得住？
    </div>

    <h2>公有与私密配置混同</h2>
    <p>
      「配置」这个词其实把两件完全不同的事混在了一起。一类是主题色、功能开关这种<strong>代码的一部分</strong>，定了就不该变；另一类是数据库地址、密钥、按环境切换的接口域名这种<strong>随运行环境变化的东西</strong>。前者可以写死在仓库里，后者绝不能。
    </p>
    <p>
      旧办法通常只有两种，各有代价。把所有值都写死在配置文件里：换个环境就得改代码重新构建，CI 上根本没法改。把所有值都塞进环境变量：服务端没问题，可前端要用一个本来就该公开的公钥时，客户端进程读不到 <code>process.env</code>，你还得自己想办法把它注入到浏览器里。
    </p>
    <p>
      更麻烦的是第三笔成本：<strong>需要打进客户端的公钥，和绝不能出服务端的密钥，如果放在同一个地方，打包时无法区分</strong>。稍不留神把密钥写进会被序列化给客户端的那一侧，就等于把它公开了——而且本地开发时你完全看不到异常，直到上线后才暴露。
    </p>
    <p>
      于是问题落到：<strong>能不能用一个统一入口管理配置，同时明确标出「哪部分是公开的、哪部分只给服务端」，并且靠环境变量在各环境覆盖默认值？</strong>
    </p>

    <h2>两层结构的集中声明</h2>
    <p>
      在 <code>nuxt.config.ts</code> 里用 <code>runtimeConfig</code> 集中声明配置，并且分成两层：顶层是<strong>私有配置</strong>，比如 <code>secretKey</code>、<code>dbUrl</code>；<code>public</code> 下是<strong>公有配置</strong>，比如 <code>apiKey</code>、<code>appVersion</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>用同一个入口管配置，并在写代码时就显式声明了可见范围</strong>。选错了位置会立刻在结构上显得别扭，而不是等到上线才靠搜索 JS 排查。
    </p>

    <h2>环境覆盖与可见范围</h2>
    <ul>
      <li>只声明了默认值，各环境要怎么覆盖？总不能在每个环境的 CI 里都改一次 <code>nuxt.config.ts</code>。</li>
      <li>服务端和客户端的读法不一样：在浏览器里调用 <code>useRuntimeConfig()</code> 后写 <code>config.secretKey</code> 拿到的是 <code>undefined</code>，调试时很容易误判成「配置没读到」。</li>
      <li>它和 <code>app.config.ts</code> 的关系不清——把主题色放错地方，就会出现「改了配置却没生效」。</li>
      <li>把密钥误放进 <code>public</code> 而不自知：本地能正常读到，一切看起来都对，直到有人打开浏览器开发者工具。</li>
    </ul>

    <h2>前缀环境变量的覆盖</h2>
    <p>
      不推翻这套分层，而是<strong>把「覆盖、读取、安放」三件事各自补清楚</strong>。
    </p>
    <p>
      先补覆盖方式：用带 <code>NUXT_</code> 前缀的环境变量在部署时覆盖默认值。规则是固定的——<code>NUXT_PUBLIC_</code> 前缀的变量映射到 <code>config.public</code> 下（如 <code>NUXT_PUBLIC_API_KEY</code> 对应 <code>config.public.apiKey</code>），<code>NUXT_</code> 前缀的变量映射到顶层私有配置（如 <code>NUXT_SECRET_KEY</code> 对应 <code>config.secretKey</code>）。这样一来，同一份代码在不同环境靠注入环境变量切换，不用改一行代码。
    </p>
    <p>
      再补读取场景。服务端用 <code>useRuntimeConfig(event)</code>，可以读到全部配置，包括私有项；客户端用 <code>useRuntimeConfig()</code>，<strong>只能读到 <code>public</code> 下的配置</strong>。这个差异不是缺陷，而是一条明确的安全边界：凡是要读密钥的逻辑，必须待在服务端一侧（<code>server/api</code>、<code>server/routes</code> 或服务端中间件里），不要在组件里试图读取它。
    </p>
    <p>
      最后补构建期常量的安放。主题色、功能开关这类<strong>不敏感、不随环境变化、构建后就固定</strong>的常量，放 <code>app.config.ts</code>，用 <code>useAppConfig()</code> 读取。它和 <code>runtimeConfig</code> 的定位刚好互补：一个在构建期确定、不读环境变量，一个在运行时由环境变量注入。分清了这条线，就不会再出现「配置改了不生效」的困惑。
    </p>
    <div class="lesson-box warn">
      <strong>最该记住的一条：</strong>不要把密钥放进 <code>public</code> 配置——它会被打包并暴露到客户端代码里，任何访问者都能看到。反过来，<code>public</code> 是专门留给「本来就要暴露给浏览器的公钥、版本号」的。另外要意识到 <code>runtimeConfig</code> 是在<strong>应用启动时</strong>读取环境变量的，修改它之后需要重启 dev server 或重新部署才生效，热更新不会带上新值。
    </div>

    <h2>配置定义与使用方式</h2>
    <figure class="lesson-figure">
      <figcaption>三个页签分别是「配置定义 / 环境变量 / 使用方式」：配置定义页签里用「锁」与「开锁」两组图标摊开私有项和公有项各自的可见范围，并对照 <code>app.config.ts</code>；环境变量页签给 <code>NUXT_</code> 前缀到配置字段的映射规则；使用方式页签有一张 <code>runtimeConfig</code> 与 <code>appConfig</code> 的逐项对比表。照着表把「什么该放哪儿」对一遍。</figcaption>
      <N18RuntimeConfig />
    </figure>

    <h2>分层声明与可见范围</h2>
    <p>
      运行时配置解决的是「同一份代码怎么在不同环境跑成不同样子，同时不把秘密带出服务器」：分层声明决定可见范围，<code>NUXT_</code> 前缀的环境变量负责覆盖，<code>useRuntimeConfig(event)</code> 与 <code>useRuntimeConfig()</code> 的差异守住安全边界，而构建期固定、不随环境变化的东西交给 <code>app.config.ts</code>。想清一个值「要不要给浏览器看、跟不跟环境变」，答案就唯一了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「公有运行时配置（public runtimeConfig）」</span>指定义在 <code>runtimeConfig.public</code> 下的配置项，服务端与客户端都能读取，并且会被<strong>序列化进发往客户端的载荷</strong>。它适合承载本来就要暴露给浏览器的公钥、CDN 域名、应用版本号。<strong>边界</strong>：放进来的东西等同于公开，绝不能放密钥或任何服务端凭证；它与私有配置共用 <code>NUXT_</code> 前缀映射规则，但公有项要多一段 <code>PUBLIC_</code>（即形如 <code>NUXT_PUBLIC_API_KEY</code>），并且只有它能在客户端被读到。
    </div>
  </LessonArticle>
</template>
