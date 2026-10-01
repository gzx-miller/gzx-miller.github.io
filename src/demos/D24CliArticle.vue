<script setup lang="ts">
import D24Cli from './D24Cli.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个部署脚本，约定用 <code>deploy --env prod --port 8080</code>。同事敲成了 <code>--port=8080</code>（用等号连写），脚本既不报错、也不退出，静默地套用了默认端口 3000，把服务发到了错误的环境；CI 里流水线一路绿灯——因为从退出码看，它「成功」了。
    </div>

    <h2>原始参数字符串</h2>
    <p>
      命令行工具得先读懂用户敲进来的参数，才谈得上干活。最原始的做法是直接摆弄 <code>process.argv</code>，可它交到你手上的只是一串没有结构的字符串，于是三笔成本全落到了你身上：
    </p>
    <ul>
      <li><code>--port 8080</code> 到底是「一个带值的选项」还是「两个各自独立的参数」，没有任何标注，全靠你的代码去猜。</li>
      <li>用户可能写成 <code>--port 8080</code>、<code>--port=8080</code>、<code>-p 8080</code> 好几种形态，手写解析漏掉任何一种，参数就默默丢了。</li>
      <li>解析失败若程序不吭声地继续跑，脚本和 CI 根本无从判定失败，错误会被一路带到生产环境。</li>
    </ul>
    <p>
      <strong>怎样让参数解析既稳，又能在出错时被机器明确地判定为「失败」？</strong>
    </p>

    <h2>手写循环解析</h2>
    <p>
      最直接的做法：从 <code>process.argv.slice(2)</code> 拿到用户参数，写一个循环——遇到 <code>--key</code> 就往后看一项，是值就配对，否则当作布尔开关。
    </p>
    <p>
      它做对了一件必须记住的事：<strong>认清了「用户参数从 <code>argv[2]</code> 开始」</strong>。<code>process.argv[0]</code> 是 node 可执行文件路径，<code>argv[1]</code> 是脚本自身路径，这两个都是运行时塞进来的，不是用户输入，必须跳过。这个认知后面无论用哪套方案都不能丢。
    </p>

    <h2>等号短选项解析</h2>
    <ul>
      <li>等号形式失守：<code>--port=8080</code> 被当成一个整体，键名成了 <code>port=8080</code>，值反而没了。</li>
      <li>短选项没处理：<code>-p 8080</code> 直接被忽略，因为循环只认 <code>--</code> 开头。</li>
      <li>规则太粗：布尔开关和带值选项共用一条判断，一旦值本身以 <code>-</code> 开头（比如一个负数的偏移量），就会被误判成新选项。</li>
      <li>错误被吞掉：用户传了非法的 <code>--port abc</code>，程序照样用默认值跑完，退出码还是 0，CI 判不出失败。</li>
      <li>没有 <code>--help</code>：用户只能翻源码猜有哪些参数、各自什么含义。</li>
      <li>不可扩展：每加一个参数就要改一段手写解析，越写越脆，边界情况永远补不完。</li>
    </ul>

    <h2>内置解析工具</h2>
    <p>
      先补<strong>「不要手写解析」</strong>这件事。小工具用内置的 <code>util.parseArgs</code>，它会替你处理 <code>--key=value</code> 与 <code>--key value</code> 两种形态、区分布尔开关、并把未声明的未知参数报出来；功能更复杂的 CLI 再上 <code>commander</code> / <code>yargs</code> / <code>cac</code>，它们额外提供子命令、类型转换与自动生成的帮助信息。之所以先补它：手写解析的每一种形态都是一个坑，而标准库与成熟框架已经把这些形态收敛好了，这是投入产出比最高的一步。
    </p>
    <p>
      再补<strong>帮助与版本</strong>。让工具支持 <code>--help</code> 自动输出用法、每个选项的含义，<code>--version</code> 输出版本号，用户不必读源码就能上手。
    </p>
    <p>
      接着补最关键的一环——<strong>退出码</strong>。参数解析失败时，要打印用法提示（usage），并以<strong>非零退出码</strong>结束进程。退出码 0 表示成功、非零表示失败，这是 shell、CI，以及用 <code>&amp;&amp;</code> 串联的多条命令判断「上一步到底成没成」的唯一依据。一个「静默用默认值继续跑」的 CLI 是最危险的，因为它把错误伪装成了成功，让问题在后面更贵的地方才暴露。
    </p>
    <p>
      最后补<strong>子命令拆分</strong>。复杂 CLI 会像 <code>git remote add</code> 那样有层级结构，把每个子命令拆成独立模块，各自维护自己的选项与帮助文本，既不容易互相干扰，也方便单独测试。
    </p>
    <p>
      收尾时用两类输入各验证一遍：跑 <code>--help</code> 看帮助是否完整清晰；再故意传一个非法参数，确认它输出了 usage 并且以非零退出码结束。
    </p>
    <div class="lesson-box warn">
      <strong>发给自动化脚本用的 CLI，成败信号只认退出码。</strong>人看的是屏幕上的输出，CI 看的是你 <code>process.exit()</code> 传出去的整数。忽略这一点，等于让你的工具在流水线里永远「成功」。
    </div>

    <h2>解析结果观察</h2>
    <figure class="lesson-figure">
      <figcaption>在上方输入框里改参数并观察下方的解析结果：试试 <code>--name 栗子 --age 3 --verbose</code>，再换成 <code>--port=8080</code>——你会看到等号形式被原样当成了键名、值丢了，这正是手写解析的典型漏洞；往下还能对照 commander / yargs / minimist / cac 四个库的定位。</figcaption>
      <D24Cli />
    </figure>

    <h2>类型化参数结构</h2>
    <p>
      命令行参数在运行时永远只是字符串，把它变成「带名字、带类型、能校验」的结构，才是 CLI 的第一层工程化。第一项先认清 <code>argv[2]</code> 这个起点，然后果断把解析交给 <code>util.parseArgs</code> 或成熟框架，最后用退出码把成败明确地告诉调用方——参数解析就不再是脆弱的字符串游戏。
    </p>
    <div class="lesson-term">
      <span class="term-name">「退出码」</span>是进程结束时返回给父进程（shell、CI、调用脚本）的整数，约定 <code>0</code> 表示成功、非零表示失败，是自动化判断一步命令成败的唯一依据。边界：被信号强制终止时，shell 报出的码通常是 <code>128 + 信号编号</code>；调用方只看退出码，并不看你 <code>console.log</code> 了什么，所以「打印了错误却仍然返回 0」对 CI 而言就是成功；参数解析失败属于使用错误，标准做法是输出 usage 并以非零码退出。
    </div>
  </LessonArticle>
</template>
