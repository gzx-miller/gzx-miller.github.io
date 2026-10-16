<script setup lang="ts">
import PY14Exceptions from './PY14Exceptions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>在 <code>try</code> 里写了三步，其中第二步抛出了 <code>KeyError</code>，而 <code>except</code> 里只写了 <code>ValueError</code>。按理说这个异常没人接，程序应该直接崩掉，可写在 <code>finally</code> 里的清理代码竟然<strong>照样执行了</strong>。莫非 <code>finally</code> 有办法「绕过」错误？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      一开始，代码里满是「先判断再动手」的写法：<code>if key in data: value = data[key] else: value = None</code>，读取文件前先 <code>if os.path.exists(...)</code>。这类检查能挡住一部分意外，写起来也直白，对简单场景够用。
    </p>
    <p>
      但判断和实际动作之间始终存在一个缝隙：检查通过、真正执行的那一刻，情况可能已经变了（文件刚被删、键刚被清）。于是每个操作都得配一圈判断，主流程被大量「防御代码」淹没，真正想做的事反而看不清。更麻烦的是，很多错误无法预先判断，只能等它真的发生。
    </p>

    <h2>try/except/else/finally 的执行顺序</h2>
    <p>
      用 <code>try</code> 把「可能出错的正常流程」圈起来，用 <code>except</code> 接住特定错误，主流程就能保持干净。这四个关键字各司其职，执行顺序也有明确规则：
    </p>
    <ol class="lesson-steps">
      <li><strong>try</strong>：正常执行的代码块。没有异常时，一路执行到底。</li>
      <li><strong>except</strong>：只有 <code>try</code> 块抛出了<strong>匹配的异常</strong>时才执行，用于处理错误。</li>
      <li><strong>else</strong>：只有 <code>try</code> 块<strong>没有</strong>抛异常时才执行，放「成功之后」的后续动作。</li>
      <li><strong>finally</strong>：<strong>无论是否发生异常、无论异常是否被处理，都必定执行</strong>，用来做清理，比如关闭文件、释放连接。</li>
    </ol>
    <p>
      开场那个疑问的答案就在第四条：<code>finally</code> 的定位是「善后」，它不关心异常有没有被接住，只保证清理一定会跑。因此哪怕 <code>KeyError</code> 无人处理、正准备向上抛出，<code>finally</code> 里的代码也照样执行完，然后异常才继续往外传播。
    </p>

    <h2>异常类型匹配与 except 顺序</h2>
    <p>
      <code>except</code> 后面跟的是<strong>异常类型</strong>，而不是随便一个名字。它会拿 <code>try</code> 块抛出的异常去逐个比对：类型相同（或属于其子类）才算匹配，匹配上就执行对应分支，其余的继续往后面的 <code>except</code> 找。
    </p>
    <p>
      由此有一条重要规则：<strong>子类要排在父类之前</strong>。如果把宽泛的 <code>except Exception</code> 写在前面，后面针对具体子类的分支就永远轮不到——因为所有异常都被前面那个先接走了。顺序从上到下、先具体后宽泛，才能让每种错误都落到该去的地方。想一次接住多种类型，可以写成元组 <code>except (ValueError, TypeError)</code>。
    </p>

    <h2>raise 抛出与自定义异常</h2>
    <p>
      <code>raise</code> 用来主动抛出异常：<code>raise ValueError('数量必须为正')</code>。相比返回一个含糊的 <code>None</code> 或错误码，抛出异常的好处是<strong>无法被忽略</strong>——调用方要么接住处理，要么让它一路暴露出去，不会被悄悄漏掉。
    </p>
    <p>
      当内建异常不够精确时，可以<strong>自定义异常</strong>：继承 <code>Exception</code>（或其子类）定义一个新类型，例如 <code>class InsufficientBalance(Exception): pass</code>。这样一来，调用方既能用 <code>except InsufficientBalance</code> 精准接住这一种情形，也能借异常类型名把业务语义表达清楚。自定义异常通常应继承 <code>Exception</code>，而不是笼统的 <code>BaseException</code>。
    </p>

    <h2>异常链 raise ... from 与裸 except 的危害</h2>
    <p>
      在 <code>except</code> 块里再 <code>raise</code> 另一个异常时，直接抛会把原始错误信息冲淡。加上 <code>from</code> 就能把两者串起来：<code>raise RuntimeError('保存失败') from error</code>，既抛出新的业务异常，又保留了「它由谁引起」这条线索，排查时不会丢失现场。
    </p>
    <p>
      另一件要提防的是<strong>裸 <code>except:</code></strong>——不写任何类型，它会连 <code>KeyboardInterrupt</code>、系统退出这类不该被吞的信号一并接走，把程序拖进异常状态却看不出原因。真要兜底，至少写成 <code>except Exception:</code>，并且别只写一个 <code>pass</code> 把错误悄悄吞掉：接住之后要么处理、要么记录、要么重新抛出，否则问题只是被藏起来了。
    </p>
    <div class="lesson-box warn">
      <strong>常见误区：</strong>用 <code>except Exception: pass</code> 让所有错误「静默」通过，短期看似不报错，长期却让真正的缺陷极难定位。捕获范围要尽量小，且每次捕获都该有明确的应对逻辑。
    </div>

    <h2>EAFP 风格：先做，出错再说</h2>
    <p>
      前面的「先判断再动手」是 <strong>LBYL</strong>（先看后跳）。Python 更推崇的反而是 <strong>EAFP</strong>（先求原谅）——直接去做，万一出错再接住异常。例如不先判断键是否存在，而是直接取值，捕获 <code>KeyError</code>；不先检查文件，而是直接打开，捕获 <code>FileNotFoundError</code>。
    </p>
    <p>
      EAFP 的好处是主流程只写「正常情况」，异常路径集中在 <code>except</code> 里，代码更紧凑；也避免了「检查通过后条件又变化」的竞态缝隙。当然它并非绝对更好：若「出错」其实是<strong>常见且可预期</strong>的分支，用判断反而更清晰。判断标准是——出错的概率低就用 EAFP，出错属于常态就用 LBYL。
    </p>

    <h2>看一遍异常流程与类型匹配</h2>
    <figure class="lesson-figure">
      <figcaption>在「try/except/else/finally」里切换无异常、抛 <code>ValueError</code>、抛 <code>KeyError</code> 三种情形，逐步点「下一步」看四个块的走向；再切到「异常类型匹配」，换一种异常看它是否被 <code>(ValueError, TypeError)</code> 接住。</figcaption>
      <PY14Exceptions />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      <code>try</code> 圈住正常流程，<code>except</code> 只接匹配的异常，<code>else</code> 只在无异常时走，<code>finally</code> 无论如何都执行——这正是它能在异常未处理时依然完成清理的原因。<code>except</code> 匹配的是类型，子类须排在父类之前；用 <code>raise</code> 主动抛出、用自定义异常表达业务错误、用 <code>raise ... from</code> 保住异常链。捕获范围要小而具体，别用裸 <code>except</code> 或 <code>pass</code> 吞掉错误。最后，出错概率低时用 EAFP 让主流程更干净。
    </p>
    <div class="lesson-term">
      <span class="term-name">「EAFP」</span>是「先求原谅，再谈许可」的缩写：直接执行操作、用异常处理错误，而非先做一堆前置检查（LBYL）。边界与例外：当某种错误属于可预期的高频分支时，显式判断更清晰；此外捕获范围应尽量具体，笼统接住所有异常会掩盖真正的缺陷。
    </div>
  </LessonArticle>
</template>
