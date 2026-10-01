<script setup lang="ts">
import WB12MemoryArrays from './WB12MemoryArrays.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>上一步存进内存的一小段字符串占了 6 个字节，你想着「紧接着放就行」，于是从地址 <code>6</code> 开始写价格数组，再建一个 <code>new Int32Array(buffer, 6, n)</code> 去读——构造函数当场抛了 <code>RangeError</code>：起始字节必须是 4 的倍数。地址 6 到底差在哪，读写内存不是只要能对得上地址就行吗？
    </div>

    <h2>数组并非内置类型</h2>
    <p>
      Wasm 没有数组类型。想在模块和宿主之间共享一个价格列表，只能把它摊平到那条一维的线性内存里。可内存本身只是一串字节，它并不知道「从这里开始是一个 int 数组」，也不知道「一共几个、每个几字节」。旧办法是把每个元素当成一个参数传进去，元素一多参数表就爆掉；也不能原地修改；两边更没法共享同一份数据。
    </p>
    <p>
      于是问题变成：<strong>一段连续内存，要按什么约定才能被双方同时「解释」成同一个数组？</strong>地址、长度、每个元素占多宽、多字节怎么排——这几件事必须由一条清晰的规则钉死，否则一边写、一边读，就会出现「明明写对了却读成乱的」。
    </p>

    <h2>起始地址与元素数</h2>
    <p>
      最朴素的约定是：用<strong>「起始地址 + 元素个数」</strong>来表示数组，元素按固定步长连续摆放。<code>i32</code> 占 4 字节，所以步长就是 4，每个元素对齐到 4 字节。模块侧写一个 <code>sum(ptr, n)</code>，从 <code>ptr</code> 开始循环读 <code>n</code> 个 <code>i32</code> 累加。
    </p>
    <p>
      这个方案做对了一件事：<strong>数组退化成「基址 + 长度 + 步长」三个数，没有任何元数据开销</strong>。双方只要按同一套约定读同一段字节，拿到的就是同一个数组，不需要拷贝，也不需要结构体。
    </p>

    <h2>长度传递责任</h2>
    <ul>
      <li>长度<strong>不自带</strong>：内存里只有字节，没有「这数组有几个元素」，<code>n</code> 完全得靠调用方记着传，传小了就漏算、传大了就多读。</li>
      <li>索引公式一旦算错就整段错位：第 <code>i</code> 个元素是 <code>ptr + i * 4</code>，写成 <code>ptr + i</code> 就会读到重叠的字节。</li>
      <li>对齐要求会当场报错：地址 <code>6</code> 起头的 <code>Int32Array</code> 直接抛 <code>RangeError</code>，根本不是「对得上地址就行」。</li>
      <li>视图选错会踩字节序：<code>Int32Array</code> 只能按平台字节序解释，而多字节值在 Wasm 里是<strong>小端</strong>排列的。</li>
    </ul>

    <h2>索引公式与步长</h2>
    <p>
      先把<strong>索引公式</strong>钉死：第 <code>i</code> 个元素地址 = <code>ptr + i * 4</code>。模块里就是做一个乘法求偏移、再 <code>i32.load</code> 取值；宿主里就是 <code>i * 4</code> 去算落点。这是整套约定里最不容出错的一环，因为它错一位，后面全错。
    </p>
    <p>
      再补<strong>对齐</strong>。<code>i32</code> 的自然对齐是 4 字节，地址必须是 4 的倍数，数据就摆成 0、4、8、12…… 起点落在 4 的倍数上，一次 4 字节访问才落在单一内存事务里。如果一段结构里混着 1 字节和 4 字节的字段，就得手动 <em>padding</em> 把后面的 <code>i32</code> 顶到 4 的倍数上，否则视图构造就会拒收。
    </p>
    <p>
      接着补<strong>宿主侧该怎么看这段内存</strong>，这里有两条路。要精确控制字节序、或者只想读写一两个值，用 <code>DataView</code>——<code>setInt32</code> / <code>getInt32</code> 的第三个参数显式传 <code>true</code> 表示小端，本课的演示就是用它按小端写入。要把它当成「真正的数组」批量读写、追求速度，就用 <code>Int32Array</code>，代价是它按平台字节序、并且构造时的 <code>byteOffset</code> 必须对齐。
    </p>
    <p>
      最后补<strong>边界</strong>。数组没有自带长度，也就没有自动的范围保护；但 Wasm 的 <code>i32.load</code> 只要越出内存范围就会触发 <code>RuntimeError</code>，当场停下而不是安静地读坏别处——这份「天然防缓冲溢出」是引擎给的，而「读几个」这个长度判断，仍旧是调用方自己的责任。
    </p>
    <div class="lesson-box hint">
      同一段字节，用不同视图去读会得到完全不同的结果：<code>Uint8Array</code> 看到的是原始字节，<code>Int32Array</code> 看到的是 4 字节一组的整数。视图只是「怎么解释这段字节」的约定，底层 buffer 只有一份。
    </div>

    <h2>内存布局柱状观测</h2>
    <figure class="lesson-figure">
      <figcaption>改一改购物车的价格列表，点「写入并求和」，看每格 4 字节的内存柱状图、底部的十六进制字节，以及 <code>sum(ptr=0, n)</code> 累加出的合计——顺便数一数第 <code>i</code> 格对应的是哪几个字节。</figcaption>
      <WB12MemoryArrays />
    </figure>

    <h2>连续内存寻址约定</h2>
    <p>
      数组不是 Wasm 的内置类型，而是一段连续内存加上「起始地址 + 元素个数 + 步长」的约定。<code>i32</code> 步长为 4、对齐到 4 字节，第 <code>i</code> 个元素落在 <code>ptr + i * 4</code>；宿主用 <code>DataView</code>（可控字节序）或 <code>Int32Array</code>（更快、要求对齐）去解释同一段字节，长度则由调用方自己管好。
    </p>
    <div class="lesson-term">
      <span class="term-name">「数组的字节布局：起始地址 + 步长 + 对齐」</span>指 Wasm 没有数组类型，复合数据以「起始地址 + 元素个数」的连续内存表示：第 <code>i</code> 个元素地址为 <code>ptr + i * 4</code>（<code>i32</code> 步长 4 字节、自然对齐到 4 字节）。边界：数组无元数据，长度必须由调用方管理；索引算错会整段错位；对齐不满足时 <code>Int32Array</code> 构造会抛 <code>RangeError</code>；<code>Int32Array</code> 按平台字节序、而 Wasm 多字节值是小端，需要精确控制时改用 <code>DataView</code>；越界访问触发 <code>RuntimeError</code>，天然防缓冲区溢出。
    </div>
  </LessonArticle>
</template>
