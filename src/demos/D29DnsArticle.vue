<script setup lang="ts">
import D29Dns from './D29Dns.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>本地联调时，你在 hosts 文件里把 <code>api.internal</code> 指到 <code>127.0.0.1</code>，浏览器和 <code>fetch</code> 都通；可脚本里调 <code>dns.resolve4('api.internal')</code> 却直接报 <code>ENOTFOUND</code>。同一个域名，为什么一个解析得到、一个查不到？
    </div>

    <h2>域名解析的多重分叉</h2>
    <p>
      你要在建立连接前把域名换成 IP，或者校验收件域名有没有配对的邮件服务器。这件事看起来只有一个答案，实际却处处是分叉。
    </p>
    <p>
      如果假设「域名解析只有一个结果」，就有几笔成本要人扛：<strong>把 IP 写死在代码里</strong>，服务换 IP 就要改代码重新发版；<strong>靠系统命令去查</strong>，临时、不可编程，不同平台输出还不一样；<strong>忽略 hosts 与缓存</strong>，本地联调和线上行为对不上，排查半天才发现「你查的地方和程序连的地方根本不是一回事」。
    </p>
    <p>
      问题落到一句话：一个域名到 IP 的解析<strong>究竟发生在哪一层，为什么从不同入口去问，得到的答案会不一样？</strong>
    </p>

    <h2>系统解析器查询</h2>
    <p>
      用 <code>node:dns</code> 的 <code>dns.lookup('example.com', callback)</code>：它走<strong>系统解析器</strong>，也就是先读 hosts 文件、再查系统缓存与系统配置的 DNS 服务器，最后交回一个地址。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它的行为和浏览器、和其它系统程序保持一致</strong>。你接下来真正要发起的连接用哪个 IP，<code>lookup</code> 就报哪个 IP——包括 hosts 里那条本地覆盖。所以「发起连接之前」这个时刻，它才是对的那个入口。
    </p>

    <h2>单一地址的能力盲区</h2>
    <ul>
      <li><code>lookup</code> 只给你<strong>一个地址</strong>，问不到 <code>MX</code>、<code>TXT</code>、<code>NS</code> 这些记录——想校验收件域名，它根本给不了这个能力。</li>
      <li>正因为 <code>lookup</code> 读 hosts，而 <code>dns.resolve*()</code> <strong>不读 hosts、直接向 DNS 服务器查询</strong>，所以 hosts 里手动改过的域名在 <code>resolve4</code> 下会报 <code>ENOTFOUND</code>——这就是开场那个「一个通、一个不通」的由来。</li>
      <li><code>dns.lookup()</code> 默认跑在 <strong>libuv 线程池</strong>里：解析请求一多，线程池被占满，解析会排队变慢，还可能拖累同一池子里的文件 I/O。</li>
      <li>每次请求都解析、<strong>不做缓存</strong>，DNS 一抖动就会把等待放大到所有并发请求上，整站跟着变慢。</li>
      <li>只处理 A 记录会漏掉现实：<code>AAAA</code>（IPv6）不少环境在用，一个域名也常有多个 A 记录，只取一个并不代表全貌。</li>
    </ul>

    <h2>查询入口的职责划分</h2>
    <p>
      先把两个入口的分工划清楚，这是理解这道题的关键。<code>dns.lookup()</code> 走<strong>系统解析器</strong>，包含 hosts 文件与系统缓存，行为与实际建立连接一致；<code>dns.resolve*()</code> 系列则<strong>绕开系统</strong>，直接向 DNS 服务器查询指定类型的记录。所以「为了避免连错」用前者，「为了查记录本身」用后者。
    </p>
    <p>
      接着把<strong>记录类型</strong>补齐，<code>resolve</code> 系列正是为此而生：<code>resolve4</code> 查 IPv4 的 A 记录、<code>resolve6</code> 查 IPv6 的 AAAA、<code>resolveMx</code> 查邮件交换、<code>resolveTxt</code> 查文本记录、<code>resolveNs</code> 查权威名称服务器、<code>resolveCname</code> 查别名。校验收件域能不能收信，看的就是 <code>MX</code>；这些是 <code>lookup</code> 永远给不了的信息。
    </p>
    <p>
      再补<strong>反向解析</strong>：<code>dns.reverse(ip, callback)</code> 把 IP 换回主机名。排查网络问题时，日志里出现一个陌生 IP，反查一下常常能立刻定位到来源。
    </p>
    <p>
      最后是<strong>缓存与降级</strong>，因为解析是最容易被忽略的单点。给解析结果加一层应用层缓存，按记录的 TTL 决定缓存多久——TTL 是这条记录在缓存里能活多少秒，也是「改了 DNS 却迟迟不生效」的原因。缓存之外还要有降级预案：查询失败时用上一次成功的结果兜底，或者切到备用解析服务，别让一次 DNS 抖动直接变成全站不可用。
    </p>
    <div class="lesson-box warn">
      <strong>别把两件事混在一起：</strong><code>dns.lookup()</code> 走系统解析器、会读 hosts，<code>resolve*()</code> 直接查 DNS 服务器、不读 hosts，两者结果不同是正常的，不是 bug；高频解析要加缓存并考虑线程池排队；DNS 要有失败降级方案，缓存上次成功结果或切换备用解析。
    </div>

    <h2>记录类型切换结果</h2>
    <figure class="lesson-figure">
      <figcaption>输入域名、选择记录类型（A / AAAA / CNAME / MX / TXT / NS）后点「查询 DNS」，看同一个域名在不同记录类型下返回的内容完全不同——这正是 <code>resolve</code> 系列必须指定记录类型的原因。</figcaption>
      <D29Dns />
    </figure>

    <h2>解析路径的差异</h2>
    <p>
      域名解析不是一个函数，而是一条有分叉的路径：<code>lookup</code> 走系统、和真实连接一致，<code>resolve*</code> 直连 DNS 服务器、能查各种记录类型。分清「我要的是连接结果，还是记录本身」，再给解析加上按 TTL 的缓存与失败降级，域名这一环才算稳。
    </p>
    <div class="lesson-term">
      <span class="term-name">「TTL」</span>全称 Time to Live，指一条 DNS 记录允许被缓存器保留的秒数；它决定了改完解析记录后，旧地址还要在缓存里存活多久。边界与例外：不同的解析器和中间缓存可能不完全遵守 TTL；TTL 设为 0 表示不缓存，会带来更高的查询频率；查询失败的结果也会被「负缓存」一段时间，所以刚配好的域名可能暂时仍报 <code>ENOTFOUND</code>。
    </div>
  </LessonArticle>
</template>
