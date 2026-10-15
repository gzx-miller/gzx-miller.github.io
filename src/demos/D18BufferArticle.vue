<script setup lang="ts">
import D18Buffer from './D18Buffer.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你下载一个中文文件，按字符串的 <code>length</code> 切了一刀做分片上传，拼回来的文件里，某个汉字变成了两个乱码方块——长度明明算对了，字节却在中间被切断了，为什么？
    </div>

    <h2>字符与字节不是一回事</h2>
    <p>
      原因是 JavaScript 的字符串是 <strong>UTF-16 码元</strong>序列，它数的是「字符」，而文件、网络、加密这些底层操作面对的却是「字节」。中文、emoji 在 UTF-8 里要占好几个字节：一个汉字占 3 字节，一个 emoji 往往占 4 字节。于是「第 100 个字符」和「第 100 个字节」根本不在同一个位置，按字符切，正好把一个多字节字符劈成两半。
    </p>
    <p>
      你想用字符串硬扛过去，会遇到三笔必须自己承担的隐藏成本：
    </p>
    <ul>
      <li>把一段非 UTF-8 的原始字节转成字符串时，非法字节会被替换成 <code>�</code>，信息当场丢失，再也拼不回去。</li>
      <li>网络分片陆续到达，用字符串拼接再切割，多字节字符一旦跨了分片边界就被切坏。</li>
      <li>读协议头、算加密分块、定位文件偏移时，「长度」必须按字节算，字符串的 <code>length</code> 给不了你想要的数。</li>
    </ul>
    <p>
      <strong>怎么在 Node 里表示「一段原始字节」？</strong>
    </p>

    <h2>用 Buffer 表示字节序列</h2>
    <p>
      用 <code>Buffer.from(字符串)</code> 得到一段字节，用 <code>buf.toString()</code> 转回文本。Node 里文件读取、网络收发、加密的底层数据本来就都是 Buffer。
    </p>
    <p>
      它做对的一件事：<strong>Buffer 是固定长度的字节序列，索引的单位就是字节</strong>。它是 <code>Uint8Array</code> 的子类，所以 <code>buf[0]</code> 拿到的是第 0 个字节的值、<code>buf.length</code> 是字节数（而不是字符数），<code>Buffer.byteLength(文本)</code> 则直接告诉你一段文本按字节算是多长——这正是上面那些场景真正需要的语义。
    </p>

    <h2>创建方式与「不清零」的隐患</h2>
    <ul>
      <li>用 <code>new Buffer(n)</code> 创建已被废弃，既不安全又语义含糊；新代码一律走 <code>Buffer.from</code> / <code>Buffer.alloc</code>。</li>
      <li>编码必须配对：写入用 <code>Buffer.from(str, 'utf8')</code>、读出却用 <code>toString('hex')</code>，得到的就是乱码；用 <code>'ascii'</code> 或 <code>'latin1'</code> 处理中文，超出一个字节范围的字会被压成 <code>?</code>。</li>
      <li><code>Buffer.allocUnsafe(size)</code> 来自 V8 堆之外的内存池，<strong>不清零</strong>，里面可能残留上一个请求的数据——涉密内容必须用 <code>Buffer.alloc</code> 或手动 <code>fill(0)</code>。</li>
      <li><code>buf.slice()</code> / <code>buf.subarray()</code> 返回的是<strong>共享内存的视图</strong>而不是拷贝，你改切出来的那一小段，原 Buffer 里对应的字节也跟着变。</li>
      <li>在循环里反复 <code>Buffer.concat()</code> 拼接，每轮都要重新分配并整段拷贝一次，分片一多就是 O(n²)。</li>
    </ul>

    <h2>定死创建、编码与拼接三件事</h2>
    <p>
      先把<strong>创建方式</strong>定死：从现有的东西构造用 <code>Buffer.from()</code>；要一块确定安全、已清零的内存用 <code>Buffer.alloc(size)</code>；只有确认会立刻写满、且不涉密时，才用 <code>Buffer.allocUnsafe(size)</code> 换速度。之所以先卡这一步，是因为「残留内存」是安全事件，不是性能问题。
    </p>
    <p>
      再补<strong>编码转换</strong>。<code>Buffer.from(str, charset)</code> 负责「文本 → 字节」，<code>buf.toString(charset)</code> 负责「字节 → 文本」，两端用同一个 charset：UTF-8 是默认的文本编码；<code>hex</code> 与 <code>base64</code> 是给传输与持久化用的表示层编码，其中 base64 会把体积撑大约 <span class="lesson-kv">4/3</span>。记住一句：<strong>字节本身没有编码，编码只是你解释它的方式</strong>，解释错了就出乱码。
    </p>
    <p>
      再补<strong>分片拼接</strong>。从流里拿到的是一段段 chunk，正确做法是先把它们收进数组，结束时先算总长度、<code>Buffer.allocUnsafe(total)</code> 预分配一块，再逐段 <code>copy</code> 写进去——只分配一次、只拷贝一趟，避开循环里的 O(n²)。另外要留个心：把大量文本编码成字节、或把一整个大文件读进内存，体积都会短暂膨胀，这种大体积转换应改用流式处理，分段编解码。
    </p>
    <p>
      最后补<strong>多字节边界</strong>。即便按字节切分，也可能正好切断一个 UTF-8 字符，所以处理文本流时要么用 <code>StringDecoder</code>（它会把跨 chunk 的半个字符缓存到下一次再吐），要么自己保证只在字符边界上切。想真正拷贝一份而不是拿到共享视图，就用 <code>Buffer.from(buf.subarray(...))</code>。
    </p>
    <div class="lesson-box warn">
      <strong>别把「视图」当「副本」：</strong><code>slice</code> 和 <code>subarray</code> 都是零拷贝的视图，改动会互相影响。需要独立数据时务必显式复制，否则一处看似无关的写操作会诡异地改到别处的数据。
    </div>

    <h2>各编码下的字节对照</h2>
    <figure class="lesson-figure">
      <figcaption>在输入框里改一改字符串——试试中文和 emoji——看同一段文本在 UTF-8、hex、base64、ASCII、Latin1 各编码下的字节数与十六进制表示有什么差别。</figcaption>
      <D18Buffer />
    </figure>

    <h2>二进制世界的统一单位</h2>
    <p>
      Buffer 是 Node 面对二进制世界的统一单位：一段按字节索引、长度固定的字节序列，是文件、网络与加密数据的最小载体。用它只要守住三件事——创建走 <code>from</code> / <code>alloc</code>、读写编码配对、拼接先预分配；再记住 <code>slice</code> / <code>subarray</code> 是共享视图而非拷贝、大体积编解码要走流式，二进制处理就基本不会踩坑。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Buffer 池」</span>是 Node 在 V8 堆之外维护的一块内部预分配内存（默认 <code>Buffer.poolSize</code> 为 <span class="lesson-kv">8 KiB</span>）：小于该阈值的 <code>Buffer.allocUnsafe</code>（以及很多 <code>Buffer.from</code> 的结果）会从这块池里切片分配，因此更快，但也因此<strong>不清零、可能残留旧数据</strong>，且多个小 Buffer 可能共享同一池内存。边界与例外：涉密数据必须用 <code>Buffer.alloc</code> 或手动 <code>fill(0)</code> 清零；需要独立副本时，不要依赖池内切片的 <code>slice</code> / <code>subarray</code> 结果。
    </div>
  </LessonArticle>
</template>
