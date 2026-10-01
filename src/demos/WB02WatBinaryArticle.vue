<script setup lang="ts">
import WB02WatBinary from './WB02WatBinary.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你手上只有一个编译好的 <code>math.wasm</code>，想把里面那个常量 10 改成 20。可你没有源码，文件又是一长串十六进制——<strong>到底该改哪个字节，改完又怎么知道没把它改坏？</strong>
    </div>

    <h2>字节与文本互译</h2>
    <p>
      你要在「机器看的字节」和「人看的文字」之间来回翻译：既要读懂一份二进制里写了什么，也要能让手改的结果重新变回合法模块。
    </p>
    <p>
      旧办法是拿肉身直接读十六进制，成本有三：操作码全是数字，人脑记不住哪条对应哪条指令；在文本里改一行，二进制里可能牵动一整段的长度前缀；改完无法验证，只能丢给引擎看它报不报错。
    </p>

    <h2>反编译为文本</h2>
    <p>
      最朴素的做法：用 <code>wasm2wat</code> 把 <code>.wasm</code> 反编译成可读文本，看懂它、在文本上改，再用 <code>wat2wasm</code> 编译回二进制。
    </p>
    <p>
      这个方案做对了最关键的一件事：<strong>文本和二进制是同一件事的两面，可以互相翻译</strong>。你不再需要拿眼睛去啃字节，而是先在「图纸」上想清楚，再让它自动落成字节。
    </p>

    <h2>行数与字节错位</h2>
    <ul>
      <li>一行 WAT 可能对应好几个字节（<code>local.get $a</code> 是 <code>20 00</code> 两个字节），按行数根本对不齐。</li>
      <li>不认识操作码，就没法在二进制里手工定位、修改某条指令。</li>
      <li>反编译出来的文本是「结构等价」而非「逐字相同」，和原作者手写的写法可能不一样。</li>
      <li>段的长度是字节数：你插入一条指令，就要同步改正长度前缀，改错一位整段作废。</li>
    </ul>

    <h2>映射表分层对应</h2>
    <p>
      不推翻「翻译」，而是把翻译拆成一张<strong>映射表</strong>，一层层对上。第一层，模块头和根节点对应：文本最外层的 <code>(module ...)</code>，对应二进制的魔数加版本 <code>00 61 73 6d 01 00 00 00</code>。文本换了行、加了缩进、写了注释，二进制一个字节都不多——<strong>注释和空白不占任何空间</strong>。
    </p>
    <p>
      第二层，函数签名落在类型段。文本里 <code>(func $add (param i32 i32) (result i32) ...)</code> 声明了签名，二进制里对应 <code>01 07 01 60 02 7f 7f 01 7f</code>：<code>60</code> 表示这是一个函数类型，<code>02</code> 表示两个参数，<code>7f</code> 正是 <code>i32</code> 的类型码，末尾的 <code>7f</code> 则是返回值类型。
    </p>
    <p>
      第三层，指令与<strong>操作码</strong>一一对应：<code>local.get</code> 是 <code>0x20</code>，后面紧跟一个字节的局部索引（<code>$a</code> 是 <code>00</code>、<code>$b</code> 是 <code>01</code>）；<code>i32.add</code> 是 <code>0x6a</code>；函数体的 <code>end</code> 是 <code>0x0b</code>。只要对着操作码表，你就能在二进制里精确定位一条指令。
    </p>
    <p>
      第四层，导出段 <code>0x07</code> 把内部函数挂上一个对外名字。文本里的 <code>(export "add" (func $add))</code> 编译后是 <code>07 08 01 03 61 64 64 00 00</code>，其中 <code>61 64 64</code> 正是字符 <code>a</code> <code>d</code> <code>d</code> 的 ASCII——原来字符串在二进制里就是一个个字节。
    </p>
    <ol class="lesson-steps">
      <li>先看 <code>(func ...)</code> 的签名，确认参数与返回类型。</li>
      <li>再顺着函数体逐条读指令，把指令名翻译成对应的操作码。</li>
      <li>遇到 <code>export</code> 就回到导出段，看它把哪个索引挂成了什么名字。</li>
    </ol>
    <div class="lesson-box hint">
      调试任何来路不明的 <code>.wasm</code>，第一件事都是 <code>wasm2wat</code> 反编译出来读一遍——<strong>文本即图纸</strong>，看懂了图纸再决定动不动字节。
    </div>

    <h2>指令与字节高亮</h2>
    <figure class="lesson-figure">
      <figcaption>左侧是 <code>add</code> 模块的 WAT 源码，点右侧任意一条指令，会高亮它在二进制里对应的操作码字节。</figcaption>
      <WB02WatBinary />
    </figure>

    <h2>文本与字节等价</h2>
    <p>
      WAT 是可读文本，二进制是它的紧凑编码，两者一一对应。<code>wat2wasm</code> 向下编译、<code>wasm2wat</code> 向上还原；指令名对应固定操作码（<code>local.get</code>=0x20、<code>i32.add</code>=0x6a、<code>end</code>=0x0b），函数名落到导出段，签名落到类型段。拿到一份二进制，先用文本还原成图纸，再决定动不动它。
    </p>
    <div class="lesson-term">
      <span class="term-name">「操作码（opcode）」</span>指二进制里表示某条指令的那个字节，如 <code>local.get</code>=0x20、<code>i32.add</code>=0x6a、<code>end</code>=0x0b；WAT 里的指令名与操作码一一对应，操作码之后还会跟它的立即数（如 <code>local.get</code> 后面的局部索引 <code>00</code>）。边界：注释、空白、缩进不占任何字节；一行 WAT 可能对应多个字节，反过来一条指令也可能横跨多字节，所以对账不能按行数来数。
    </div>
  </LessonArticle>
</template>
