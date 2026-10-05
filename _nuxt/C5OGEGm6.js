const e=`<script setup lang="ts">
import D30Readline from './D30Readline.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个小脚本，直接监听 <code>process.stdin.on('data')</code>，想一回合一回合地问用户；可用户一次粘贴了三行，回调一下子给你一大坨；换个环境把输入用管道灌进来，它又只给你半行。按「数据块」读，怎么就读不出「一行」？
    </div>

    <h2>字节流与行切分</h2>
    <p>
      你要做一个命令行工具：先问名字、再问年龄、最后确认，然后打印结果。输入来自终端，本质是<strong>字节流</strong>——用户敲一下、粘贴一段、或者用管道灌进来，到达的节奏和大小都不由你控制。
    </p>
    <p>
      直接监听 <code>data</code> 事件，等于自己接手了所有麻烦：<strong>拿到的是一块块字节，不是行</strong>，一行可能分两次到、一次也可能来三行；<strong>要自己找换行、缓存残留、处理编码</strong>，还容易在边界上出错；<strong>要逐行处理大文件时，先 <code>readFile</code> 再按行切会把整份内容塞进内存</strong>；交互结束后<strong>终端状态和资源的恢复</strong>也容易漏。
    </p>
    <p>
      问题落到一句话：怎样把「按块到达的字节流」变成「一行一行的事件」，并且把「提问—等待回答」这种异步流转表达清楚？
    </p>

    <h2>行事件回调接口</h2>
    <p>
      用 <code>node:readline</code>：<code>readline.createInterface({ input, output })</code> 拿到一个接口对象，监听它的 <code>'line'</code> 事件，每凑齐一整行就触发一次回调，参数就是这一行的字符串。
    </p>
    <p>
      这个方案做对了一件省心的事：<strong>它把「按块到达的字节流」翻译成「按行触发的事件」</strong>。分片、残留、换行判定、编码，这些原本要你自己扛的细节，全被收进接口内部；你只管对「一行」做业务处理。
    </p>

    <h2>回调嵌套与资源释放</h2>
    <ul>
      <li><code>'line'</code> 事件是<strong>推给你</strong>的：当一问依赖上一答时，只能在回调里再套一层回调，几步下来就成了回调金字塔。</li>
      <li>忘记调 <code>rl.close()</code>，接口不释放、<strong>进程迟迟不退出</strong>——因为 stdin 还活着，事件循环还有东西可等。</li>
      <li>要逐行处理大文件时，若先 <code>readFile</code> 再按行切，<strong>整份文件会常驻内存</strong>，文件一大就地爆；正确做法是把 <code>createReadStream()</code> 交给接口当输入。</li>
      <li>用户按下 <code>Ctrl+C</code>（<code>SIGINT</code>）时如果什么都不做，可能<strong>留下半截状态</strong>，终端也没被正确恢复。</li>
      <li>多选、输入校验、动态提示这类交互，用 <code>'line'</code> 一个个手写会迅速膨胀，越写越难维护。</li>
    </ul>

    <h2>提问原语与顺序化</h2>
    <p>
      先补上「提问」这个原语，因为交互式 CLI 的核心就是「打印提示、暂停等输入、收到一行后继续」。<code>rl.question('请输入名字: ', callback)</code> 一步到位：它打印提示、挂起等待，用户回车后把这一行交给回调。用提问串起四步，结构是这样的：
    </p>
    <ol class="lesson-steps">
      <li>调 <code>rl.question('请输入名字: ', ...)</code>，等到答案，进入它的回调。</li>
      <li>在回调里再调 <code>rl.question('请输入年龄: ', ...)</code>。</li>
      <li>继续嵌套 <code>rl.question('请选择语言: ', ...)</code>。</li>
      <li>最内层再问「确认提交？」，然后打印结果并 <code>rl.close()</code>。</li>
    </ol>
    <p>
      四步就是四层嵌套，问题一眼可见：每多问一句就多一层缩进，「先做 A、拿到结果再做 B」的顺序被折进了回调里。于是补上<strong>现代写法</strong>：<code>node:readline/promises</code> 提供了 Promise 版接口，<code>const name = await rl.question('名字: ')</code>，把嵌套拉平成一条顺序执行的 <code>async</code> 函数。<span class="lesson-kv">同样的四步，从四层嵌套变成四行顺序代码</span>，可读性差别很大。
    </p>
    <p>
      接着补<strong>流式处理大文件</strong>这条支线。readline 之所以被单独抽出来，是因为它面对的从来不只是终端：把 <code>fs.createReadStream('big.log')</code> 作为 <code>input</code>，<code>'line'</code> 事件就会随着文件被读入而逐行触发，任一时刻只有有限内容在内存里，多大的文件都不会撑爆。同一套「按行」的接口，既能驱动交互，又能扫大文件——这正是它的价值所在。
    </p>
    <p>
      最后是<strong>收尾</strong>，别省。用 <code>try ... finally</code> 保证无论中间是否出错都调 <code>rl.close()</code>，让进程能干净退出；给 <code>SIGINT</code> 挂一个处理，在用户中断时把终端状态和资源恢复好；而当交互复杂到需要多选、校验、动态提示时，不必自己硬造，交给 <code>inquirer</code> 或 <code>prompts</code> 这类封装，readline 作为底层能力继续在它们下面工作。
    </p>
    <div class="lesson-box warn">
      <strong>四点提醒：</strong><code>readline</code> 是处理流的<strong>低级 API</strong>，复杂交互推荐用 <code>inquirer</code> / <code>prompts</code>；交互结束务必 <code>rl.close()</code>，否则进程不退出；逐行处理大文件要用 <code>createReadStream</code> 当输入、按需消费，别整份读入内存；处理 <code>SIGINT</code>，保证终端状态与资源被正确恢复。
    </div>

    <h2>四步问答推进节奏</h2>
    <figure class="lesson-figure">
      <figcaption>点「开始模拟交互式输入」，看脚本依次抛出「请输入名字 / 年龄 / 语言 / 确认提交」，每答完一题才进入下一题——这就是 <code>rl.question</code> 的「提问—等待—回调」节奏，也是改造前那层嵌套的来源。</figcaption>
      <D30Readline />
    </figure>

    <h2>通用按行消费接口</h2>
    <p>
      <code>readline</code> 解决的是「把输入流按行消费」这件事：它把字节块翻译成一行一行的事件，于是同一套接口既能驱动「提问—等待回答」的交互式 CLI，也能流式扫过大文件。再配上 Promise 版接口把嵌套拉平、用 <code>close</code> 与 <code>SIGINT</code> 做好收尾，一个稳的 CLI 就成型了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「标准输入（stdin）」</span>指进程的标准输入流，可以是交互终端，也可以是被重定向的管道或文件。边界与例外：当它是终端（TTY）时，readline 会回显输入并显示提示符；一旦被重定向成管道或文件，它就不再是 TTY，逐行消费照常但交互行为不同；终端宽度、<code>Ctrl+C</code>（<code>SIGINT</code>）等行为也都依赖 TTY，处理时要按是否终端分别对待。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
