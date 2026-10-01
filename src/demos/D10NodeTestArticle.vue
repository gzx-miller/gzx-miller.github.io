<script setup lang="ts">
import D10NodeTest from './D10NodeTest.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给 <code>add</code> 函数写了个随手检查：<code>if (add(2, 3) !== 5) console.log('错了')</code>。后来有人把它改坏，这条检查确实打印了「错了」，CI 却依然是绿色的、坏代码照常合进了主干——测试明明报错了，CI 为什么说通过？
    </div>

    <h2>回归拦截需求</h2>
    <p>
      你想确认一段代码「现在是对的，以后改了也不会悄悄跑偏」。最省事的办法，是在源文件里临时 <code>console.log</code> 一下，或者写个小脚本手动比一比。
    </p>
    <p>
      这种做法的成本在于：<strong>对错靠你的眼睛判断</strong>，没人替你守；<strong>检查失败时进程仍以退出码 0 结束</strong>，CI 无法据此拦下这次提交；随手写的、随手就删，<strong>攒不成一份能长期回归的资产</strong>；而想换成 Jest / Vitest 这类框架，又要多装一堆依赖、处理配置与版本冲突。
    </p>
    <p>
      问题落到一句话：能不能用 Node 自带的能力，写出「<strong>失败会明确报错、能被 CI 识别</strong>」的测试？
    </p>

    <h2>Node测试运行器</h2>
    <p>
      Node 内置了 <code>node:test</code> 测试运行器与 <code>node:assert</code> 断言库。写一条 <code>test('adds values', () =&gt; assert.equal(add(2, 3), 5))</code>，用 <code>node --test</code> 运行它。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它把「看着对」变成了「机器判定对错」</strong>。断言不成立时会抛出错误，运行器记为失败，并让进程以非零退出码结束——CI 正是靠这个退出码，决定放行还是拦截。
    </p>

    <h2>退出码与假通过</h2>
    <ul>
      <li>只用 <code>console.log</code> 比较、不写断言：错误只被打印出来、没有被抛出，退出码仍是 0，CI 会绿灯放行。</li>
      <li>测试之间共享全局状态、依赖执行顺序：单独跑这个文件能过，全量一起跑就挂——说明它根本不独立。</li>
      <li>用了 mock 却不清理，污染后续用例，出现「单独跑通过、全量跑失败」的假象。</li>
      <li>异步测试里忘记 <code>await</code>：断言还没执行，运行器就判定测试已经结束，于是永远通过——这是最隐蔽的假阳性。</li>
      <li>只测正常路径：负数、0、非法输入这些边界没有覆盖，回归防线其实有洞。</li>
      <li>把覆盖率当成目标：高覆盖率只说明「这些行被跑到过」，不代表断言真的检验了行为。</li>
    </ul>

    <h2>严格断言接口</h2>
    <p>
      先把断言交给 <code>node:assert/strict</code>：用 <code>assert.equal</code>、<code>assert.deepEqual</code>、<code>assert.throws</code> 之类的接口，让「不符合预期」直接抛错，而不是打印一行了事。这是从「看过」到「测过」的分水岭。
    </p>
    <p>
      再按<strong>行为</strong>组织用例，并用子测试（subtest）把它们拆开：一个测试只验证一件事，失败时能一眼看出是哪个行为坏了，而不是一堆断言混在一起、只报一个笼统的失败。
    </p>
    <p>
      再保证测试的<strong>独立性</strong>：每个用例自己准备数据、自己清理，不依赖别的用例留下的状态和执行顺序。独立性是「单独跑和全量跑结果一致」的前提。
    </p>
    <p>
      再处理<strong>异步</strong>：async 的测试函数要把返回的 Promise <code>return</code> 或 <code>await</code> 掉，否则运行器会在断言真正执行之前就认为测试结束了，得到一个假阳性——这条比看起来更容易踩。
    </p>
    <p>
      再补<strong>边界用例</strong>：在正常值之外加上负数、0、非法输入，测试才真正守住了行为边界，而不是只证明「顺路那一次能跑」。
    </p>
    <p>
      再<strong>接入 CI</strong>：<code>node --test</code> 默认会并行运行多个测试文件；同一个文件内的测试默认顺序执行，需要并发时可以显式设置 concurrency。用 TAP、JUnit 这类机器可读的报告格式输出结果，再配合 <code>node --test --experimental-test-coverage</code> 看哪些分支没被走到。
    </p>
    <p>
      最后一步是<strong>验证「测试本身有效」</strong>：故意改坏一处实现，比如把 <code>a + b</code> 改成 <code>a - b</code>，确认测试套件立刻变红。测试的全部价值，就在于坏代码进来时它能拦得住。
    </p>
    <div class="lesson-box warn">
      <strong>两类「假测试」：</strong>只 <code>console.log</code> 不 assert，失败不会抛出、退出码仍为 0，CI 拦不住；异步测试忘记 <code>await</code> 或 <code>return</code>，断言根本不会执行到，测试永远显示通过。判断一份测试是否可信，先看它「坏掉时会不会变红」。
    </div>

    <h2>断言结果逐条判定</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行 node:test 用例」，看两条断言逐条给出通过或失败——它验的不只是「跑过了」，而是「结果等于预期」，失败时会以非零退出码让 CI 拦下。</figcaption>
      <D10NodeTest />
    </figure>

    <h2>测试回归防线</h2>
    <p>
      测试的价值不在于「跑过一次看了输出」，而在于把预期写成断言、失败时以非零退出码明确报错，让 CI 替你守住回归。起步不必先引入第三方框架——<strong>Node 自带的 <code>node:test</code> 加 <code>node:assert/strict</code> 就够了</strong>，把测试入口收敛到 <code>node --test</code>，还能少一层工具链依赖与版本冲突。
    </p>
    <div class="lesson-term">
      <span class="term-name">「断言（assertion）」</span>是一段「实际值与预期不符就主动抛错」的检查，它把主观的「看着对」变成机器可判定的通过或失败；在 Node 里由 <code>node:assert/strict</code> 提供。边界与例外：只 <code>console.log</code> 不抛错不构成断言，失败也不会让进程以非零码退出；异步断言必须 <code>await</code> 或 <code>return</code>，否则测试会在断言执行前结束、得到假阳性；断言数量多不等于覆盖全，仍需补边界用例。
    </div>
  </LessonArticle>
</template>
