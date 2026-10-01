<script setup lang="ts">
import WB17Simd from './WB17Simd.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在做视频调色预览，要把一帧里每个像素的亮度偏移加 20。一帧 200 万像素意味着约 600 万次加法，主线程上肉眼可见地卡；同事说「上 SIMD，能快好几倍」，你翻到 WebAssembly 的写法却是 <code>v128</code>、<code>i32x4.add</code>——一个「值」怎么装得下 4 个数，一条指令又怎么能同时加 4 次？
    </div>

    <h2>向量寄存器宽度</h2>
    <p>
      反直觉的地方在于：<strong>你的 CPU 里本来就有能一次装下 4 个 32 位整数的寄存器</strong>。一个 128 位的 SIMD 寄存器，可以并排放下 4 个 <code>i32</code>。可你平时写的循环一次只把一个 <code>i32</code> 搬进寄存器做加法，等于让这 128 位的通道只用了 32 位——<strong>四分之三的宽度一直是空着的</strong>。
    </p>
    <p>
      纯标量写法的隐藏成本还不止「浪费宽度」这一条：每次循环都要做下标自增和边界比较，这些开销跟计算无关却按元素数量累积；元素越小、数组越长，这种「搬运和维护」的比例越高；整型运算还受分支预测影响，数据一没规律就慢下来。于是问题变成一个很具体的问句：<strong>图像、音频、矩阵这类「同一套运算原封不动套到成片数据上」的批量计算，怎么让一条指令一次就算好几个元素，把空着的通道宽度用起来？</strong>
    </p>

    <h2>逐元素循环写法</h2>
    <p>
      最朴素的方案：逐元素写一个循环，一次处理一个 <code>i32</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>语义完全正确，而且对数组长度没有任何要求</strong>——不管多少个元素，按顺序一个个加总能算对。它是所有优化都必须先跑通、再拿来当对照答案的基线。
    </p>

    <h2>单通道吞吐损失</h2>
    <ul>
      <li>循环每绕一圈只推进<strong>一个元素</strong>，无论寄存器多宽都只用其中一个通道，吞吐天生被卡在低位。</li>
      <li>循环体里除了真正要做的加法，还混着<strong>下标自增、边界比较和跳转</strong>，元素个数越多，这些「非计算」开销累积越明显。</li>
      <li>元素个数不是批大小的整数倍时，得补一段<strong>标量尾巴</strong>单独处理，处理不好就会越界或漏算。</li>
      <li>指望编译器自动向量化并不稳：一旦它判断<strong>存在内存别名或对齐不确定</strong>，就会悄悄退回标量，你以为优化了，其实没有。</li>
    </ul>

    <h2>多通道值类型</h2>
    <p>
      先补<strong>一个能装下多个数的数据类型</strong>。<code>v128</code> 是 Wasm 的 128 位值类型，它不是「一个很大的整数」，而是被<strong>切成一排等宽的小格子</strong>：同一段 128 位，可以解释成 4 个 <code>i32</code>、8 个 <code>i16</code>、16 个 <code>i8</code>，或者 4 个 <code>f32</code>。每个小格子叫一个<strong>通道（lane）</strong>，通道之间各管各的，互不干扰。
    </p>
    <p>
      再补<strong>把内存搬进向量、再搬回去</strong>这两个动作。内存里存的还是普通的一串 <code>i32</code>：用 <code>v128.load</code> 从某个地址一次读进<strong>连续 16 字节</strong>，得到一条 <code>v128</code>；算完用 <code>v128.store</code> 把这条 <code>v128</code> 一次性写回内存。演示里的三个地址——<code>a</code> 在 <code>0</code>、<code>b</code> 在 <code>16</code>、<code>dest</code> 在 <code>32</code>——就是三块各自 16 字节的连续空间。
    </p>
    <p>
      中间那一步才是主角：<code>i32x4.add</code> 用<strong>一条指令</strong>，对两条入参向量的 4 个 <code>i32</code> 通道<strong>各自做一次加法</strong>，一次得到 4 个结果。这就是 SIMD 的全名——单指令多数据：一份指令流，同时喂给多个通道。指令名本身就是规格说明：<code>i32x4.add</code> 里的 <code>i32</code> 是每通道的类型、<code>x4</code> 是通道数；换成浮点就写 <code>f32x4.mul</code>，那是 4 路乘法；换成更窄的类型则是 <code>i16x8.add</code>。整条 <code>vadd</code> 的链路就是「载入 → 计算 → 写回」四步。
    </p>
    <ol class="lesson-steps">
      <li>把两组各 4 个 <code>i32</code> 分别写进内存。</li>
      <li><code>v128.load</code> 从 <code>a</code>、<code>b</code> 两个地址各加载一条 128 位向量。</li>
      <li><code>i32x4.add</code> 一条指令完成 4 路加法。</li>
      <li><code>v128.store</code> 把结果向量写回 <code>dest</code> 地址。</li>
    </ol>
    <p>
      再补<strong>能力检测</strong>。SIMD 并非在所有环境下都开箱即用，缺少支持时<strong>编译这个模块会直接抛 <code>CompileError</code></strong>，而不是运行时才降级。上线前可以先 <code>WebAssembly.validate</code> 一段带 SIMD 的小模块，或把实例化包进 <code>try/catch</code>，据此决定加载 SIMD 版还是退回标量兜底版。
    </p>
    <div class="lesson-box warn">
      <strong>两个必须记住的边界：</strong>其一，通道内的整数运算是<strong>按位宽回绕</strong>的——<code>i32x4.add</code> 溢出时截断在 <code>i32</code> 里，不会自动进位到更大类型，处理价格、像素这类可能溢出的量要先想清楚值域；其二，SIMD 只对<strong>规整、同构、规模大</strong>的数据划算，遇到大量分支判断、长度很小的数组，加上载入写回的固定成本，反而可能比标量更慢。
    </div>
    <p>
      最后把<strong>两种并行叠起来</strong>看。<code>i32x4.add</code> 是「一条指令处理多个数据」，属于<strong>数据并行</strong>；多线程是「多个核各跑一条指令流」，属于<strong>任务并行</strong>。两者正交，可以同时用：在一个 Worker 内部用 SIMD 处理一整块，多个 Worker 再把数据分块并行——总加速大致是两者的乘积。这也正是它比单纯多开线程更值的地方：不增加线程，单核的利用率就已经上去了。
    </p>

    <h2>四道并行相加</h2>
    <figure class="lesson-figure">
      <figcaption>在两个输入框里各填 4 个整数，回车或点「执行 vadd」：下方会按 <code>lane0</code> 到 <code>lane3</code> 逐道展示，你能看到 <code>A</code> 与 <code>B</code> 的每一道各自相加，得到 4 个结果——一条 <code>i32x4.add</code> 就把这四次加法同时做完了。试着把某一道改成接近上限的大数，观察溢出后结果如何回绕。</figcaption>
      <WB17Simd />
    </figure>

    <h2>并行通道价值</h2>
    <p>
      标量循环一次只喂饱一个通道，等于把 128 位寄存器浪费了四分之三。SIMD 把 <code>v128</code> 当作「一排并排的通道」，用 <code>v128.load</code> 载入、<code>i32x4.add</code> 一次算完 4 路、<code>v128.store</code> 写回，用数据并行把单个核的吞吐拉起来；它和线程正交，可以乘积式叠加。代价是要求数据规整、要注意整数回绕，并且上线前得先探测环境是否支持，否则会直接 <code>CompileError</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「SIMD（Single Instruction, Multiple Data，单指令多数据）」</span>指用一条指令同时作用于多个数据。Wasm 以 128 位值类型 <code>v128</code> 承载，按通道（lane）切分为 4 个 <code>i32</code>、8 个 <code>i16</code>、16 个 <code>i8</code> 或 4 个 <code>f32</code>，指令名形如 <code>i32x4.add</code>（元素类型 + 通道数 + 操作）。边界与例外：整数通道运算按位宽回绕、不自动进位；适合规整且规模大的批量计算，分支多或数据很小时可能得不偿失；不支持的环境会在编译期抛 <code>CompileError</code>，需先做能力检测；它不是线程，属数据并行，可与多线程组合叠加。
    </div>
  </LessonArticle>
</template>
