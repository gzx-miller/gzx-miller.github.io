<script setup lang="ts">
import D27Zlib from './D27Zlib.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个返回 500KB JSON 的接口，开了 gzip 之后响应体掉到约 55KB、加载肉眼变快；可你把同一套压缩逻辑套到一张已经压好的 PNG 上，体积不但没降，反而涨了几十个字节——同样叫「压缩」，为什么差别这么大？
    </div>

    <h2>压缩带来的体积收益</h2>
    <p>
      你要的就一件事：让要传输、要存储的数据变小。网络带宽、磁盘容量、加载时间都和体积成正比，能压掉一半就是实打实的收益。
    </p>
    <p>
      可「直接上压缩」有几笔藏起来的成本。第一，<strong>压缩要花 CPU</strong>：压得越狠越费算力，不该压的内容也压，算力就白烧了。第二，<strong>不同内容能压出的比例差得很远</strong>：文本里全是重复的模式，能砍掉大半；图片、视频本身已经是压过的格式，几乎没有冗余可去，再压一次反而可能略增体积。第三，<strong>大文件如果整块读进来再压，内存会跟着数据总量一起涨</strong>，一个 2GB 的文件足以把进程顶爆。
    </p>
    <p>
      问题落到一句话：怎样用同一套机制，对<strong>该压的</strong>内容压得动、对<strong>不该压的</strong>内容不去白费力气，而且不给内存添负担？
    </p>

    <h2>一次性整块压缩</h2>
    <p>
      用 <code>node:zlib</code> 的一次性 API：<code>zlib.gzipSync(buffer)</code> 把整块数据压成一段 gzip 字节，<code>zlib.gunzipSync()</code> 再还原回来。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>压缩和解压是无损、可逆的</strong>。压出来的字节可以一字不差地还原成原文，接收方拿到它解一下就得到原始数据——这是压缩能被透明地用在传输和存储里的前提。也正因为无损，「压缩率」衡量的是同一份内容被压掉多少，而不是丢了什么。
    </p>

    <h2>整块压缩的内存压力</h2>
    <ul>
      <li><code>gzipSync()</code> 要求<strong>整块数据先摆进内存</strong>：压一个 2GB 的文件，进程内存得先涨到 2GB 以上，很容易被系统杀掉。</li>
      <li>一次性 API 也意味着<strong>首字节给得晚</strong>：非要等整份数据压完才往外写，流式响应就退化成「全压完再发」。</li>
      <li>把同一套逻辑施加到<strong>已经压过的内容</strong>（PNG、JPEG、MP4）上，里面没有冗余可去，结果通常是体积几乎不变甚至略微变大，还要多付一份 CPU。</li>
      <li>算法不挑：Brotli 压缩率最高，但 CPU 开销也最大；对一段几百字节的小响应，省下的带宽常常抵不上多花的时间。</li>
    </ul>

    <h2>流式压缩实现</h2>
    <p>
      先把「整块压」换成<strong>流式压</strong>，因为内存才是大文件场景的硬约束。<code>zlib.createGzip()</code> 本身就是一个转换流：它吃进原始字节、吐出压缩字节。用 <code>pipeline</code> 把「读文件 → gzip → 写文件」串起来，任一时刻在内存里的只有有限几块数据，占用与文件大小解耦。这正好复用了流那一课的工具——压缩只是链路上的一个 <code>Transform</code> 环节。
    </p>
    <p>
      接着补<strong>按内容和场景选算法</strong>。三者的取舍很清楚：
    </p>
    <ul>
      <li><code>gzip</code>：兼容性最好，几乎所有客户端和代理都认，默认首选。</li>
      <li><code>deflate</code>：与 gzip 同源，略快一点，压缩率相近。</li>
      <li><code>brotli</code>：压缩率明显更高，但压缩更费 CPU；浏览器端通常只在 HTTPS 下启用。</li>
    </ul>
    <p>
      再把它落到最常见的场景——<strong>HTTP 响应压缩</strong>。服务端读请求头里的 <code>Accept-Encoding</code>，客户端支持 gzip 就设上 <code>Content-Encoding: gzip</code>，再把 <code>createGzip()</code> 接进响应流；客户端收到后会自动解压，业务代码无感知。同一次响应的不同编码版本还要在缓存键上区分开，否则中间缓存可能把 gzip 版本回给只认明文的客户端。对不变的静态资源，更划算的做法是<strong>在构建期就预压缩</strong>成 <code>.gz</code> 或 <code>.br</code>，运行期直接发文件，把 CPU 成本挪到离线。
    </p>
    <p>
      最后是<strong>压缩级别的取舍</strong>。级别越高越省带宽、越费 CPU，而且收益递减：从默认级别往上调，常常只多省几个百分点，却要多花成倍的算力。这件事不能拍脑袋，要对着真实的响应体和负载实测——多数情况下选一个折中的级别，比盲目拉满更划算。
    </p>
    <div class="lesson-box warn">
      <strong>别踩的坑：</strong>图片、视频、压缩包这类<strong>已经压过</strong>的内容不要再压，白费 CPU 还可能变大；大文件或大响应一律走 <code>createGzip</code> 流式处理，别用 <code>gzipSync</code> 整块读；压缩级别高不等于好，省下的带宽要能和多花的 CPU 对得上账。
    </div>

    <h2>不同算法的压缩率</h2>
    <figure class="lesson-figure">
      <figcaption>切换压缩算法（Gzip / Deflate / Brotli）并修改要压缩的文本，看「原始大小 → 压缩后大小 → 节省比例」如何随算法变化——同一份输入，压缩率与 CPU 成本的权衡在这里一目了然。</figcaption>
      <D27Zlib />
    </figure>

    <h2>冗余决定压缩收益</h2>
    <p>
      压缩换来的体积收益来自「内容里的冗余」，所以<strong>能不能压、能压多少，取决于数据本身</strong>：文本冗余大、压得动，已压缩的二进制几乎没得压。用流式处理把内存和文件大小解耦，按兼容性与 CPU 成本选算法和级别，HTTP 传输则靠 <code>Content-Encoding</code> 协商——这笔账才算算清。
    </p>
    <div class="lesson-term">
      <span class="term-name">「压缩率」</span>指压缩后体积与原始体积的比值（或等价地，被节省的比例），越低代表压得越狠。边界与例外：它由内容的冗余度决定，文本很高、已压缩的图片视频接近甚至大于 1（可能略增）；同一算法不同压缩级别也会给出不同压缩率；压缩率与 CPU 开销大体成反比，Brotli 压缩率高但更费算力，选择时要拿实测数据对账，而不是只盯压缩率。
    </div>
  </LessonArticle>
</template>
