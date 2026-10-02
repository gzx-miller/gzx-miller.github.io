const e=`<script setup lang="ts">
import D05Streams from './D05Streams.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>导出一个 2GB 的报表，「先生成完整内容再写文件」的写法把进程内存顶到几个 GB、最后被系统杀掉；改成按块写，内存稳定在几十 MB——写的是同一个文件，内存凭什么差出几百倍？
    </div>

    <h2>整份读入内存压力</h2>
    <p>
      你要把「产出得快」和「消耗得慢」两端接起来：一边生成或读取数据，一边把它写到文件或网络。最省事的做法是把数据整个准备好再交付——<code>readFile</code> 一把读进来，或者拼成一个完整字符串再 <code>writeFile</code>。
    </p>
    <p>
      可这种做法有几笔藏起来的成本：<strong>内存占用正比于数据总量</strong>，数据一大就地爆；<strong>两端的快慢不一致</strong>，生产方一直往缓冲区塞、消费方处理不过来，积压就无限膨胀；<strong>首字节迟迟给不出</strong>，非要等全部数据就绪才能写出第一个字节；而且<strong>一旦中途出错，手动把已经打开的文件句柄、连接逐个收拾干净很容易漏</strong>。
    </p>
    <p>
      所以问题落到一句话：怎样让数据<strong>边产边消</strong>，既不随数据量吃光内存，又能在消费不过来时自动踩一脚刹车？
    </p>

    <h2>三类流职责分工</h2>
    <p>
      用 Node 的<strong>流</strong>。可读流（<code>Readable</code>）分块产出数据，可写流（<code>Writable</code>）分块写入，转换流（<code>Transform</code>）在中间把每一块改一下形态；两端用 <code>pipe</code> 或 <code>pipeline</code> 接起来。
    </p>
    <p>
      这个方案做对了一件最本质的事：<strong>它把「整份数据」拆成了「一个接力棒式的数据块」</strong>。任一时刻在内存里只有有限几块，而不是整份数据——于是内存占用与数据总量解耦，首字节也能尽早给出。
    </p>

    <h2>内部缓冲堆积</h2>
    <ul>
      <li>光把两端「接起来」还不够：消费者慢、生产者快时，<code>write()</code> 塞进去的数据会在内部缓冲区越堆越多，直到撑爆内存。</li>
      <li>手工 <code>pipe</code> 链条<strong>错误处理很脆</strong>：中间某一段报错，它不会自动把上游关掉，已经打开的文件句柄或连接就可能一直泄漏。</li>
      <li><code>highWaterMark</code> 在<strong>字节模式</strong>和<strong>对象模式</strong>下含义不同：一个按字节数算缓冲上限，一个按对象个数算，照默认值套用会误判「到底满没满」。</li>
      <li>忽略 <code>write()</code> 的返回值，会让背压形同虚设：它返回 <code>false</code> 是在说「我满了，先别写了」，不理会它就等于一直硬塞。</li>
    </ul>

    <h2>背压机制生效</h2>
    <p>
      先让<strong>背压</strong>真正生效，因为它是这套方案的灵魂。写侧调用 <code>writable.write(chunk)</code>，返回 <code>false</code> 就表示内部缓冲已达上限（由 <code>highWaterMark</code> 界定），此时应停下生产、等 <code>'drain'</code> 事件再继续；读侧 <code>push()</code> 返回 <code>false</code> 则是「消费者还没消化完，先别读了」的信号。它的本质是——<strong>用返回值把下游的压力一路传回上游，让生产主动放慢</strong>，而不是把数据堆在内存里。
    </p>
    <p>
      接着用 <code>pipeline</code> 替掉手工 <code>pipe</code> 链。在 <code>node:stream/promises</code> 里有 Promise 版的 <code>pipeline</code>：它把各阶段串起来，并且<strong>只要任意一段出错，就销毁整条管道、释放所有资源</strong>，错误从唯一一个地方抛出。这恰好补上了手工链「中间出错、上下游不管」的短板，也是为什么说「优先用 <code>pipeline</code> 而不是手工 <code>pipe</code>」。
    </p>
    <p>
      然后把<strong>中间的加工</strong>放进 <code>Transform</code>。报表导出的「格式化每一行」、传输前的「压缩」，都是「吃一块、吐一块」的转换，用转换流表达最自然。于是整条链路就是一条直线：<code>Readable</code> → <code>Transform</code> → <code>Writable</code>，每一段只关心自己的输入输出。
    </p>
    <p>
      再按<strong>数据形态</strong>调缓冲上限。字节流按字节数、对象流按对象个数理解 <code>highWaterMark</code>，按实际数据形态设置，而不是照搬默认值——它直接决定了「多大算满」这个判断的准确性。
    </p>
    <p>
      最后是<strong>验证</strong>这一步，别省。在管道中间的人为抛一个错误，观察 <code>pipeline</code> 返回的 Promise 是否 reject、各段是否被销毁、资源是否被释放。只有亲手验证过「出错会整条拆掉」，「用了 pipeline」才算真的落地。顺带回头看一眼上一课：那种「读进来再写出去」的大文件场景，正是把 <code>readFile</code> / <code>writeFile</code> 换成一条流的地方。
    </p>
    <div class="lesson-box hint">
      <strong>两个背压信号，记牢方向：</strong><code>write()</code> 返回 <code>false</code> → 暂停写入，等 <code>'drain'</code>；<code>push()</code> 返回 <code>false</code> → 暂停读取，稍后再推。它们都是「我这侧满了」的反馈，而不是错误。
    </div>

    <h2>数据块逐段落地</h2>
    <figure class="lesson-figure">
      <figcaption>点「流式导出报表」，看数据块一块接一块落下来——这就是分块产出，而不是等整份报表拼好再一次性给出。</figcaption>
      <D05Streams />
    </figure>

    <h2>大数据低内存搬运</h2>
    <p>
      流解决的是「大块数据怎么低内存地搬运」这件事：数据被拆成块逐段流过，<strong>背压用返回值把下游的压力传回上游、让生产自动放慢</strong>，而 <code>pipeline</code> 把各段串成一条线、任一环出错就销毁整条链路并释放资源。只要数据大到不该整体进内存，就该用流。
    </p>
    <div class="lesson-term">
      <span class="term-name">「背压（backpressure）」</span>指消费端处理速度跟不上生产端时，通过返回值与暂停信号让上游主动放缓生产，把数据积压限制在有限缓冲区内，避免内存无限增长。边界与例外：<code>highWaterMark</code> 在字节模式下按字节数、对象模式下按对象个数计量，含义不同；背压依赖两端都遵守信号，忽略 <code>write()</code> 的返回值就会失效；它只是进程内部的缓冲控制，不等于流量整形或限流。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
