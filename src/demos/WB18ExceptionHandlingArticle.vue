<script setup lang="ts">
import WB18ExceptionHandling from './WB18ExceptionHandling.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 Wasm 里写了个订单金额的计算，除数为 0 时想向上游报一个「DIV_ZERO，字段是 discount」的错误。可选的路只有两条：返回 <code>-1</code>，让调用方自己去背「负数代表什么」的表；或者干脆让它崩掉——一旦崩了，JS 只收到一句干巴巴的 <code>RuntimeError</code>，是哪个订单、哪个字段出的错，全没了。为什么「报错」和「崩溃」在 Wasm 里会是两种完全不同的东西？
    </div>

    <h2>错误码歧义</h2>
    <p>
      先看清两条旧路的隐藏成本。<strong>返回错误码</strong>：错误和正常结果<strong>共用同一个返回值通道</strong>，<code>-1</code> 既可能是「出错」，也可能是一个合法的负结果，语义被重载；想带上「哪张订单、哪个字段」，只能塞进别处或让调用方去拼；一旦调用变深，每一层都要判断、都要向上传，漏掉一层错误就断了。<strong>直接崩（trap）</strong>：粗暴是够粗暴，越界、除零、<code>unreachable</code> 都会让执行<strong>立刻中止</strong>，整个实例很可能就此进入不可用状态，可调用方拿到的信息量却近乎为零。
    </p>
    <p>
      于是问题收敛成一句：<strong>怎么让 Wasm 主动抛出一个能携带结构化数据、又能被 JS 精确识别来源的错误，而且不把实例搞坏？</strong>
    </p>

    <h2>特殊返回值约定</h2>
    <p>
      最省事、也最常见的做法：<strong>返回错误码</strong>。约定若干个特殊返回值（<code>-1</code> 表示除零、<code>-2</code> 表示参数越界……），调用方每次拿到结果先判断是不是这些特殊值。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给了调用方一个「可以继续往下走」的分支</strong>。出错不等于进程结束，上层还能决定重试、降级或提示用户——这层「可恢复」的性质，正是后面要保留的。
    </p>

    <h2>负数结果误判</h2>
    <ul>
      <li>错误码和正常值<strong>共用一条返回通道</strong>，<code>-1</code> 到底是不是错误全凭约定，一旦有合法的负数结果就会误判。</li>
      <li>它<strong>带不了上下文</strong>：出错的具体字段、订单号、原始输入，只能靠额外参数或全局状态传，跨边界时很快乱掉。</li>
      <li>深层调用要<strong>逐层检查、逐层上抛</strong>，每一层都得记得判断，漏掉一层错误就被静默吞掉。</li>
      <li>换成直接 <code>trap</code>（越界、除零、<code>unreachable</code>）虽然够直接，但它<strong>中止执行、实例可能再也不可用</strong>，且 JS 端拿到的只是没有自定义负载的运行时错误，信息同样丢失。</li>
    </ul>

    <h2>陷阱与异常之分</h2>
    <p>
      先把两个一直混在一起的概念<strong>拆开</strong>。<strong>trap</strong> 是运行时的机器级失败——数组越界、非法指令、显式 <code>unreachable</code>、除零等，执行会<strong>立刻中止</strong>，它不可被语言层的 <code>try/catch</code> 拦下，属于「硬失败」。<strong>异常（exception）</strong>是语言层的软失败：可以被 <code>try/catch</code> 捕获，可以携带数据，还能沿着调用栈向上寻找处理者。这一课要造的是后者。
    </p>
    <p>
      先补<strong>异常的类型：<code>tag</code></strong>。用 <code>(tag $e (param i32))</code> 声明一个异常类型，括号里的 <code>param</code> 是它携带负载的签名——这里声明的是「带一个 <code>i32</code>」。<code>tag</code> 像一枚徽章，作用是让捕获端能认出「这是谁抛的」，而不是只看到一条没有出处的错误。
    </p>
    <p>
      再补<strong>抛出：<code>throw</code></strong>。在 <code>div</code> 里，一旦发现除数是 <code>0</code>，就写 <code>throw $e</code>，把负载（演示里是 <code>100</code>，用来代表错误码或上下文）<strong>随异常一起抛出</strong>。抛出之后它就像别的语言一样，沿调用栈向上寻找是否有 <code>catch</code>。
    </p>
    <p>
      再补<strong>JS 侧的捕获与识别</strong>。异常跨越 Wasm/JS 边界后，JS 收到的不是字符串，而是一个 <code>WebAssembly.Exception</code> 对象。你可以用 <code>e.is(tag)</code> 判断它是不是来自你声明的那个 <code>tag</code>，再用 <code>e.getArg(tag, 0)</code> 把第 <code>0</code> 个负载取出来。这样 JS 能<strong>精确分辨异常来源并读到结构化数据</strong>，而不是对着一句 <code>RuntimeError</code> 猜发生了什么。
    </p>
    <ol class="lesson-steps">
      <li>模块里声明 <code>(tag $e (param i32))</code>，定义一种携带 <code>i32</code> 负载的异常类型，并定义 <code>div</code>。</li>
      <li><code>div</code> 检测到除数为 <code>0</code> 时 <code>throw $e</code>，携带负载 <code>100</code>。</li>
      <li>JS 侧 <code>catch</code> 到 <code>WebAssembly.Exception</code>。</li>
      <li>用 <code>e.is(tag)</code> 判定来源、<code>e.getArg(tag, 0)</code> 取出负载并展示。</li>
    </ol>
    <p>
      再补<strong>在 Wasm 内部就地处理</strong>。不是所有错误都得回到 JS：如果本模块内就能兜住，直接在 Wasm 里用 <code>try/catch</code> 处理，可以省掉一次跨界往返。要记住的是，<strong>异常可以跨越 Wasm/JS 边界传递，并且不会破坏调用栈</strong>——这正是它和 trap 最本质的差别：trap 把执行整个掀翻，异常只是把控制权交给上层的处理者。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的边界：</strong>其一，异常处理提案相对较新，旧运行时或某些嵌入式环境下可能不支持，实例化时就会失败，上线前应当做能力检测并准备降级路径；其二，别把异常当流程控制——它只在真正例外时抛出，正常分支该用返回值就用返回值，否则异常会成为新的性能与可读性负担。
    </div>

    <h2>除零异常捕获</h2>
    <figure class="lesson-figure">
      <figcaption>把「被除数」设成 <code>10</code>、「除数」设成 <code>0</code>，点「执行 div」：看它不再是崩溃的红色报错，而是一条能被 JS 接住的异常——界面会显示这是来自 <code>tag "e"</code> 的除零异常，并把它携带的负载 <code>100</code> 一起取出来展示。再把除数改回非零，验证同一份代码在正常路径上照常返回。</figcaption>
      <WB18ExceptionHandling />
    </figure>

    <h2>硬失败与软失败</h2>
    <p>
      「出错」在 Wasm 里有两副面孔：<code>trap</code> 是机器级的硬失败，中止执行、不可拦截；异常是语言级的软失败，可被捕获、可携带数据。用 <code>(tag ...)</code> 声明异常类型、用 <code>throw</code> 带上负载抛出，JS 端用 <code>WebAssembly.Exception</code> 配合 <code>e.is(tag)</code> 与 <code>e.getArg(tag, i)</code> 就能精确识别来源并读出数据，而且不破坏调用栈。它比错误码更有信息量、比 trap 更可控，但需要环境支持，也不该被当作日常流程控制。
    </p>
    <div class="lesson-term">
      <span class="term-name">「trap（陷阱）」</span>指 Wasm 运行时检测到不可继续的错误（数组越界、非法指令、显式 <code>unreachable</code>、除零等）时<strong>立即中止执行</strong>的机制。它属于机器级硬失败，<strong>不能被语言层的 <code>try/catch</code> 拦截</strong>，抛到宿主后表现为一个不带自定义负载的异常，且实例可能进入不可恢复状态。边界与例外：与之相对的是异常处理提案提供的 <code>(tag ...)</code> + <code>throw</code>，那是可捕获、可携带负载、且不破坏调用栈的软失败；判断一个错误能否恢复，先看它是 trap 还是异常。
    </div>
  </LessonArticle>
</template>
