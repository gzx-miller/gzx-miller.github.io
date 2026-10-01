<script setup lang="ts">
import S21PiniaTesting from './S21PiniaTesting.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>为一个 action 补了测试，跑第一次通过，跑整个测试套件时却红了——为什么单跑是对的，一起跑就错？
    </div>

    <h2>任务状态与动作</h2>
    <p>
      你在做一个任务清单：store 里有 <code>tasks</code> 状态，以及 <code>addTask</code>、<code>toggleTask</code>、<code>removeTask</code>、<code>clearCompleted</code> 这几个 action，还配了「已完成数量」「完成率」等派生结果。你打算给这些业务规则补上单元测试。
    </p>
    <p>
      测试的难点往往不在断言本身，而在于<strong>每个用例之间不能互相影响</strong>。如果你想当然地引入同一个 store 就在所有用例里用，前一个用例加进去的任务会留在状态里，后一个用例断言的「初始数量」就已经不是初始值了。测试红或绿，取决于用例的执行顺序——这是最糟糕的一类不确定性。
    </p>

    <h2>用例直接断言</h2>
    <p>
      最直接的做法：在测试文件顶部引入那个 store，之后每个用例都直接调它的 action、读它的状态来断言。
    </p>
    <p>
      它做对了一件根本的事：<strong>业务规则确实可以脱离组件被验证</strong>。Pinia 的 store 本质就是普通的响应式对象，不需要挂载任何界面，直接调用函数、读取结果就能测。麻烦只出在「大家共享了同一个实例」——单例在应用里是优点，在测试里却成了互相传染的病源。
    </p>

    <h2>共用实例隐患</h2>
    <ul>
      <li>所有用例共用一个 store，前一例改过的状态会污染后一例。</li>
      <li>断言结果依赖执行顺序，单跑通过、套件里却失败。</li>
      <li>Setup Store 并没有内建的 <code>$reset</code>，想手动还原初始状态还得自己写。</li>
      <li>异步 action 如果不 <code>await</code> 就断言，结果还没到位，断言时好时坏。</li>
      <li>测试里真的去打了网络请求，慢且不可控。</li>
    </ul>

    <h2>每例独立实例</h2>
    <p>
      不推翻「直接调 store 来断言」，而是<strong>让每个用例拿到一个全新的、干净的 store</strong>。做法是：在每个用例开始时先 <code>setActivePinia(createPinia())</code> 创建并激活一个独立的 Pinia 实例，再调用 <code>useXxxStore()</code>。由于实例是新建的，上一个用例留下的状态不会带过来，污染问题就消失了。
    </p>
    <ol class="lesson-steps">
      <li>每个测试里先 <code>setActivePinia(createPinia())</code>，得到全新实例。</li>
      <li>调用 <code>useTaskStore()</code> 取得 store，必要时先还原到初始状态。</li>
      <li>直接调用 <code>addTask</code>、<code>toggleTask</code> 等 action，再断言 <code>tasks</code> 与派生 getter。</li>
      <li>对异步 action，先 <code>await</code> 它完成，再断言状态已就位。</li>
    </ol>
    <p>
      具体到断言，应该对准<strong>业务结果</strong>而不是内部实现。比如验证「勾选任务」，断言的是「已完成数量从 1 变成 2」，而不是「<code>tasks[0].completed</code> 这个字段被赋了 <code>true</code>」。前者在实现重构后依然成立，后者一改结构就全红——测试应该保护行为，而不是锁死写法。
    </p>
    <p>
      除了隔离实例，还有一个习惯能显著提升测试的价值：<strong>只测「输入到输出」这一层</strong>。同一个 store 里，纯函数式的 action 与 getter 最容易测、也最值得测；而涉及请求与定时器的异步流程，则应该先把外部依赖替换掉再测，让用例不依赖网络与时间的真实流逝。测试跑得快、结果稳定，团队才愿意一直维护它。
    </p>
    <div class="lesson-box hint">
      <strong>一条顺序建议：</strong>先测最容易出错的边界——比如「空标题不该新增」「清除后不应残留已完成」这类；再测主流程。边界用例往往才是真正会出 bug 的地方，也最能在重构时替你守住行为。
    </div>
    <div class="lesson-box warn">
      <strong>三个容易踩的坑：</strong>第一，Setup Store <strong>没有内建的 <code>$reset</code> 来还原初始状态</strong>，要么自己实现一个重置函数，要么就干脆每个用例重建实例，别指望框架替你做。第二，异步 action 请<strong>用 <code>vi.mock</code> 模拟接口并 <code>await</code> 返回值</strong>，否则既慢又不稳，竞态会让断言时对时错。第三，优先给承载业务规则的 action 与 getter 补单测，<strong>低价值的快照测试要控制数量</strong>，别用一堆脆弱快照把测试套件撑得又大又假。
    </div>

    <h2>逐例隔离运行</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行测试」，看每个用例如何在独立实例里一条条完成断言。</figcaption>
      <S21PiniaTesting />
    </figure>

    <h2>测试隔离本质</h2>
    <p>
      测 Pinia store 之所以轻松，是因为它本就是普通对象，不需要框架层的 mock。真正要解决的是「用例之间的状态隔离」：每个用例用 <code>setActivePinia(createPinia())</code> 建一个干净实例，异步先 <code>await</code>，断言对准业务结果。做到这几点，store 的测试就会稳定又可读。当用例与用例之间互不影响、又只盯着行为而非实现时，重构才真正有了安全网——改完跑一遍，就能确认自己没有悄悄改坏别处的规则。
    </p>
    <div class="lesson-term">
      <span class="term-name">「独立 Pinia 实例」</span>指在测试中用 <code>setActivePinia(createPinia())</code> 新建并激活一个干净的 Pinia，再 <code>useXxxStore()</code> 取得 store 进行断言，<strong>从而隔离用例、避免状态污染</strong>。注意 Setup Store 没有内建 <code>$reset</code>，需自行重置或重建实例；异步 action 应 <code>await</code> 并用 <code>vi.mock</code> 模拟接口。
    </div>
  </LessonArticle>
</template>
