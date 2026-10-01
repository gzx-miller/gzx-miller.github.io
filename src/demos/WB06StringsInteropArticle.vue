<script setup lang="ts">
import WB06StringsInterop from './WB06StringsInterop.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 JS 里写下 <code>const addr = 'squirrel hazelnut'</code>，想交给 Wasm 处理，可它导出的函数签名清一色是 <code>i32</code>、<code>f64</code> 这些数字类型——<strong>根本没有一个叫 string 的类型</strong>。这一串字符到底怎么塞得进去？
    </div>

    <h2>提出问题</h2>
    <p>
      你想让宿主和模块之间传一段文本——收货地址、用户名、一段 JSON。麻烦在于 Wasm 的类型系统里压根没有字符串：它只有 <code>i32</code>、<code>i64</code>、<code>f32</code>、<code>f64</code> 这些数字，外加 <code>funcref</code>、<code>externref</code> 这些引用。为什么不加一个 string 类型？因为 Wasm 是给各种语言共用的编译目标，C 的字符串、Rust 的 <code>String</code>、Go 的 string 表示法各不相同，语言层面统一不划算，索性交给编译工具去约定。
    </p>
    <p>
      于是问题落到你身上：<strong>一段本来就是「字符序列」的数据，怎么穿过一道只认数字的边界？</strong> 最笨的办法是把每个字符拆成一个单独的数字参数一个个传。它的成本很实在——字符数不固定，函数签名就没法固定；一千个字符要一千个参数，签名会膨胀到无法维护；就算传进去了，模块手里也只是一堆散落的数字，没有「这是一整段文本」的概念。
    </p>

    <h2>最小方案</h2>
    <p>
      换个思路：既然边界只认数字，而模块已经有一块按字节编号的线性内存，那就<strong>把字符串按编码写成一块字节，只把这块字节的起始地址——一个 <code>i32</code>——传过去</strong>。起始地址就是「指针」，模块顺着它就能摸到整段文本。
    </p>
    <p>
      这个方案做对了一件事：<strong>它用已有的内存机制承载了任意长度的数据，把签名收敛成一个干净的 <code>(i32)</code></strong>。文本再长也不用改签名，模块拿到的也不再是散落的数字，而是一个能顺藤摸瓜的位置。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>只给起始地址，<code>strlen</code> 从哪知道到哪里结束？没有终点，它会一直往下数，把内存里别的数据也当成字符串的一部分。</li>
      <li>JS 的字符串是 UTF-16 code unit，一个字符可能不只占一个字节。直接按 <code>charCodeAt</code> 逐字符写，得到的是错的字节序列。</li>
      <li>只传地址、不传长度，模块想读回一段文本时，除了地址别无信息，容易多读或漏读。</li>
      <li>模块想把这段文本改个大写，改完又该怎样把结果交还给 JS？</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补「怎么划边界」。约定一种<strong>C 风格字符串</strong>：字节序列最后额外补一个值为 0 的字节 <code>\0</code> 作结束符。模块侧的 <code>strlen(ptr)</code> 从 <code>ptr</code> 起逐字节 <code>i32.load8_u</code>，一遇到 0 就停，数出来的就是字节长度。签名因此只要 <code>(i32) -&gt; i32</code>，长度不用调用方显式传——但代价也出来了：<strong>长度靠内容里的 <code>\0</code> 自己界定，调用方必须保证这段字节里没有意外的 0</strong>。
    </p>
    <p>
      再补「怎么把文本变成字节」。JS 用 <code>TextEncoder</code> 把字符串按 <strong>UTF-8</strong> 编码成 <code>Uint8Array</code>，再 <code>memBytes.set(data, 0)</code> 写进内存，最后在末尾补一个 0。要留意：<code>strlen</code> 返回的是<strong>字节数，不是字符数</strong>——中文一个字在 UTF-8 里占 3 个字节，一个 emoji 可能占 4 个，所以「长度 8」不代表「8 个字符」。读回时用 <code>TextDecoder</code> 从内存切片解码，字节序列才重新变回字符串。
    </p>
    <p>
      接着补「模块要改文本怎么办」。方法就是<strong>原地改内存字节</strong>。<code>toupper(ptr)</code> 从起点遍历，把落在 <code>0x61–0x7A</code>（即 <code>a</code>–<code>z</code>）范围内的字节减去 <code>0x20</code>，正好落进大写区间 <code>0x41–0x5A</code>；遇到 <code>\0</code> 就停。它<strong>不产生新的字符串对象，只改那块内存</strong>——因为 Wasm 里本就没有字符串对象，能改的只有字节。JS 随后用 <code>TextDecoder</code> 从同一块内存读回，就看到了大写结果。
    </p>
    <div class="lesson-box warn">
      <strong>两个易错点：</strong>模块端把字节只当字节，<strong>从不解析 UTF-8</strong>，所以 <code>toupper</code> 只对 ASCII 小写字母有效，中文字节不会被它动到一个字；而 <code>strlen</code> 数的是字节数，别拿它当字符数用。现代工程里这些编码、写内存、补结束符的胶水代码，通常交给 <code>wasm-bindgen</code> 之类的工具自动生成。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>改一下收货地址再点「交给 Wasm 处理」，同时看 <code>strlen</code> 数出的字节长度、<code>toupper</code> 原地转大写后的文本，以及内存前 16 字节的十六进制。</figcaption>
      <WB06StringsInterop />
    </figure>

    <h2>总结</h2>
    <p>
      字符串跨边界的完整链路只有这么几步：<strong>JS 用 <code>TextEncoder</code> 编码成 UTF-8 字节 → 写进线性内存并补 <code>\0</code> → 只传起始地址（指针）→ 模块按字节处理 → JS 用 <code>TextDecoder</code> 解码读回</strong>。Wasm 没有字符串类型，它认得的一直只是地址和字节。
    </p>
    <div class="lesson-term">
      <span class="term-name">「C 风格字符串（C string）」</span>指用一块以 <code>\0</code>（值为 0 的字节）结尾的连续字节表示字符串，起始地址即指针，长度由遍历数到 <code>\0</code> 得到。边界：<code>\0</code> 本身不计入长度；长度是<strong>字节数而非字符数</strong>（UTF-8 下一个中文占 3 字节）；模块端不解析 UTF-8，只按字节操作；<code>toupper</code> 这类操作是原地改写内存字节，不产生新字符串；工程中常由 <code>wasm-bindgen</code> 等工具自动生成编解码胶水。
    </div>
  </LessonArticle>
</template>
