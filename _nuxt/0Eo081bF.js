const n=`<script setup lang="ts">
import D26NetTcp from './D26NetTcp.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>客户端连着调了两次 <code>socket.write()</code>，分别发出两段 JSON；服务端的 <code>data</code> 事件却只触发了一次，回调里的数据是两段拼在一起的一大串——你明明分两次写，它为什么一次就交上来了？
    </div>

    <h2>字节流无边界</h2>
    <p>
      你想在两个进程之间传消息：客户端发一条、服务端处理一条，来去清清楚楚。最直觉的写法是「一次 <code>write()</code> 对应一次 <code>data</code>」——我发一条，你就收一条。
    </p>
    <p>
      但 TCP 从一开始就没打算满足这个假设。它承诺的只有三件事：<strong>连接是建立好的、字节按发送顺序到达、丢了会重传</strong>。它<strong>不承诺</strong>的恰恰是「你写了几次，我就分几次交给你」。TCP 只把数据看成一段连续的<strong>字节流</strong>：发送方怎么写、网络怎么分段、接收方缓冲区攒了多少，都会影响它一次交上来多少字节。
    </p>
    <p>
      于是「按一次 write 收一条消息」这套做法，会留下几笔只能你自己扛的成本：<strong>你无法从字节流本身看出消息从哪开始、到哪结束</strong>；<strong>一次 data 可能是半条，也可能是三条半</strong>；想切分只能靠猜——用时间间隔切、用「大概每次都不会太大」来兜底。问题落到一句话：<strong>收到一段没有边界的字节流时，你怎么知道一条完整的消息在哪里结束？</strong>
    </p>

    <h2>换行符作为分隔</h2>
    <p>
      最省事的办法：约定「每条消息以换行符 <code>\\n</code> 结尾」，收到数据就按 <code>\\n</code> 切分，切出来的每一段就当成一条消息。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它给字节流定义了一个显式的边界标记</strong>。一旦有了边界，解析器才有可能判断「这条消息完了没有」——这正是所有应用层协议都要先回答的问题。回想 HTTP：它能一条条地工作，也是因为它在 TCP 之上又加了一层自己的边界（请求头，加上 <code>Content-Length</code> 或分块编码）。
    </p>

    <h2>分隔符自身冲突</h2>
    <ul>
      <li>消息体<strong>自己就可能包含 <code>\\n</code></strong>（比如 JSON 字符串里的换行、或任意二进制数据），这个「分界」会被误当成结束符，消息被拦腰切断。</li>
      <li>一次 <code>data</code> 里可能装着<strong>三条完整消息加半条</strong>：直接切分、不做残留缓存，那半条就被丢了，或者被当成一条不完整的消息解析失败。</li>
      <li>反过来，一条消息也可能被<strong>拆到多次 <code>data</code></strong>：每个分片单独切分，得到的都是碎片，永远拼不出完整消息。</li>
      <li>按字节切分还会和编码打架：一个多字节的汉字可能被拆在两个分片里，逐片按字符串解码会得到乱码。</li>
    </ul>

    <h2>缓冲与残留分帧</h2>
    <p>
      先把「一次 data 必须是一整条消息」这个念头扔掉，改成 <strong>缓冲区加残留</strong>。每收到一个 chunk，就把它追加到一个缓冲区里，然后尝试从缓冲区里切出尽可能多的完整消息，剩下的「半条」留在缓冲区，等下一个 chunk 到了再接上。这一步的要点是：<strong>解析器必须允许「残留半个包」</strong>，它是后面一切方案的地基。
    </p>
    <p>
      接着解决「消息体里含分隔符就误判」的问题。把分隔符换成<strong>长度前缀分帧</strong>：约定每条消息最前面固定 <span class="lesson-kv">4 字节</span> 是一个大端无符号整数，表示后面消息体的字节数。解析器于是变成一台有明确状态的机器：
    </p>
    <ol class="lesson-steps">
      <li>缓冲区不足 4 字节，等待，不做任何解析。</li>
      <li>读满 4 字节头，解出消息体长度 N。</li>
      <li>缓冲区不足 N 字节，继续等待，凑够再切。</li>
      <li>切出这 N 字节作为一条完整消息，回到第 1 步处理剩下的字节。</li>
    </ol>
    <p>
      这样一来，消息体里出现任何字符、任何二进制都无所谓——长度是显式给出的，不需要去猜哪里是结尾。服务端用 <code>net.createServer</code> 拿到 <code>socket</code>，在 <code>data</code> 里把收到的字节喂给上面这台状态机；客户端用 <code>net.createConnection</code> 连上，在 <code>connect</code> 回调里按同样的规则把「头 + 体」拼好再 <code>write()</code>。
    </p>
    <p>
      再把几件工程上的边界补齐。一是<strong>错误与超时</strong>：socket 上要监听 <code>error</code>，否则对端异常断开会变成未捕获异常把进程带崩；也别忘了 <code>setTimeout()</code>，防止连接挂在那不动。二是<strong>安全边界</strong>：长度前缀同时也是攻击面——对端若声称「我这包 2GB」，你的解析器不能真去等；要先校验 N 是否超过协议约定的上限，超了立刻断开。三是<strong>加密边界</strong>：<code>net</code> 是明文传输，需要加密通信要换成 <code>tls</code> 模块。
    </p>
    <div class="lesson-box warn">
      <strong>三条容易踩的坑：</strong>不要假设一次 <code>write()</code> 对应一次 <code>data</code>，粘包与拆包都是正常现象；解析器必须缓存「半条」消息，而且长度字段本身也可能被拆到两次 <code>data</code> 里；长度前缀既要对数值做上限校验，也要记住它给出的字节数未必会一次到齐。
    </div>
    <p>
      最后留一个验证习惯：故意构造一条远超单次缓冲的消息，让它必然被拆成多个分片发出去，观察接收端的解析器是否仍能把它还原成一条完整消息。能过这一关，分帧才算真的写对。
    </p>

    <h2>粘包拆包现象</h2>
    <figure class="lesson-figure">
      <figcaption>分别点「模拟 TCP 服务器」和「模拟 TCP 客户端」，对照两侧日志里连接建立、收发数据、断开连接的先后，体会 socket 是双向字节流端点、而不是一条条独立的消息。</figcaption>
      <D26NetTcp />
    </figure>

    <h2>应用层定义消息边界</h2>
    <p>
      TCP 给你的是「一串有序的字节」，不是「一条条消息」；<strong>消息的边界必须由应用层自己定义</strong>。解析器要缓存残留的半个包，再用长度前缀这类显式规则确定「一条消息到哪里结束」，粘包与拆包才会从 bug 变成可控的常态。
    </p>
    <div class="lesson-term">
      <span class="term-name">「长度前缀分帧」</span>指在每条消息体之前固定写入一段表示其字节数的字段（如 4 字节大端整数），接收端先读这段长度、再等缓冲区凑齐相应字节数，才切出一条完整消息。边界与例外：长度字段本身也可能被拆到多次 <code>data</code> 里，同样要先进缓冲区；必须对长度做上限校验，防止对端用超大数值耗尽内存；分帧规则由应用层自定义，换个协议就不通用。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
