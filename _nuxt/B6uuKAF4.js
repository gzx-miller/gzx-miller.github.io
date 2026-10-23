const e=`<script setup lang="ts">
import D10NodeTest from './D10NodeTest.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给 <code>add</code> 函数写了个随手自检：<code>if (add(2, 3) !== 5) console.log('错了')</code>。后来有人把实现改坏，这行确实打印了「错了」，CI 却依旧是绿的、坏代码照常合进了主干——出了错也报了错，为什么还是拦不住这次提交？
    </div>

    <h2>自检脚本的三个缺口</h2>
    <p>
      你想确认一段代码「现在是对的、以后被改了也不会悄悄跑偏」。最直接的办法，是在源文件里临时 <code>console.log</code> 一下，或者写个小脚本手动比一比。
    </p>
    <p>
      成本就藏在「手动」这两个字里：判定对错<strong>靠你的眼睛</strong>，没人替你守；检查不成立时只打印一行、进程仍以退出码 <code>0</code> 结束，<strong>CI 拿不到任何信号</strong>，自然照常放行；随手写的检查随手就删，<strong>攒不成一份能长期回归的资产</strong>。想换成第三方框架，又是一堆依赖、配置与版本冲突要处理。
    </p>
    <p>
      问题落到一句话：能不能用 Node 自带的能力，写出「<strong>失败会明确报错、并且能被 CI 识别</strong>」的测试？
    </p>

    <h2>内置的测试运行器与断言库</h2>
    <p>
      Node 自带了两件东西：<code>node:test</code> 提供测试运行器，<code>node:assert/strict</code> 提供断言接口。写一条 <code>test('adds values', () =&gt; assert.equal(add(2, 3), 5))</code>，用 <code>node --test</code> 把它跑起来即可，不必再引入任何第三方依赖。
    </p>
    <p>
      它做对的关键一件事，是<strong>把「我看着对」变成了「机器判定对错」</strong>：断言不成立会抛出错误，运行器记为失败，并让进程以<strong>非零退出码</strong>结束。CI 正是靠这个退出码，决定放行还是拦下——开场那个自检脚本缺的就是这一步。
    </p>

    <h2>按行为组织用例</h2>
    <p>
      把断言交给 <code>node:assert/strict</code> 之后，接着该想的是「一条测试验几件事」。用 <code>describe</code> 分组、<code>test</code>（或 <code>it</code>）写单个用例，再用<strong>子测试 subtest</strong> 把一件事拆成几小步：这样失败发生时，能一眼看出是哪个行为坏了，而不是一堆断言混在一起只报一个笼统的失败。
    </p>
    <p>
      断言本身也有更严格的形式——<code>assert.equal</code> 比相等、<code>assert.deepEqual</code> 比深层结构、<code>assert.throws</code> 验「确实抛了错」。用它们的意义，是让不符合预期直接抛错，而不是打印一行了事。
    </p>

    <h2>异步与 mock</h2>
    <p>
      异步用例有个隐蔽的坑：async 的测试函数必须把返回的 Promise <code>await</code> 或 <code>return</code> 掉，否则断言还没跑，运行器就认为测试已经结束，于是<strong>永远显示通过</strong>——这是最不容易发现的假阳性。
    </p>
    <p>
      需要隔离外部依赖时用 <code>mock</code>：<code>mock.fn()</code> 造一个可记录的假函数，替换掉真实的网络或数据库调用，还能断言它被调了几次、参数是什么。但有一条纪律——<strong>用完要清理</strong>，每个用例自己收尾，否则残留的假实现会污染后面的用例，制造出「单独跑通过、全量跑失败」的假象。这也呼应了前面反复提到的那条底线：测试必须<strong>独立</strong>，不依赖别的用例留下的状态和执行顺序。
    </p>

    <h2>并行、入口与报告</h2>
    <p>
      <code>node --test</code> 默认把多个测试文件<strong>并行</strong>运行，以缩短总时长；而同一个文件内的用例默认顺序执行，确实需要并发时再显式设置 <code>concurrency</code>。把测试入口统一收敛到 <code>--test</code>，机器可读的输出也可以按需切换成 TAP 或 JUnit 报告，方便接入 CI 与流水线看板。
    </p>
    <p>
      想看看哪些分支压根没被走到，可以用 <code>node --test --experimental-test-coverage</code> 加一层覆盖率视角。但要记住：<strong>覆盖率只说明「这些行被跑到过」，不等于断言真的检验了行为</strong>，别把它当目标，它只是找漏网分支的辅助。
    </p>
    <p>
      最后一步是<strong>验证「测试本身有效」</strong>：故意改坏一处实现，比如把 <code>a + b</code> 改成 <code>a - b</code>，确认测试套件立刻变红。测试的全部价值，就在于坏代码进来时它拦得住——这也是判断一份测试是否可信的最终标准。
    </p>
    <div class="lesson-box warn">
      <strong>两类「假测试」：</strong>一是只 <code>console.log</code> 不 assert，失败不抛出、退出码仍为 <code>0</code>，CI 拦不住；二是异步测试忘了 <code>await</code> 或 <code>return</code>，断言根本执行不到，测试永远显示通过。
    </div>

    <h2>断言逐条给出结论</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行 node:test 用例」，看两条断言逐条给出通过或失败——它验的不只是「跑过了」，而是「结果等于预期」，一旦不符就会以非零退出码让 CI 拦下。</figcaption>
      <D10NodeTest />
    </figure>

    <h2>让 CI 替你守回归</h2>
    <p>
      测试的价值不在于「跑一次看了输出」，而在于把预期写成断言、失败时以非零退出码明确报错，让 CI 替你守住回归。起步不必先上第三方框架——<strong>Node 自带的 <code>node:test</code> 加 <code>node:assert/strict</code> 就够了</strong>，把入口收敛到 <code>node --test</code>，还能少一层工具链依赖与版本冲突。
    </p>
    <div class="lesson-term">
      <span class="term-name">「断言（assertion）」</span>是一段「实际值与预期不符就主动抛错」的检查，它把主观的「看着对」变成机器可判定的通过或失败；在 Node 里由 <code>node:assert/strict</code> 提供。边界与例外：只 <code>console.log</code> 不抛错不构成断言，失败也不会让进程以非零码退出；异步断言必须 <code>await</code> 或 <code>return</code>，否则测试会在断言执行前结束、得到假阳性；断言数量多也不等于覆盖全，仍需补边界用例与独立、可清理的 mock。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
