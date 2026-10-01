<script setup lang="ts">
import L04LCEL from './L04LCEL.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在三个页面里都写了同样的三步——先格式化提示词、再调用模型、最后解析结果。现在想给整个流程加上「逐字返回」，你却发现没有一处能改：得在三个地方分别把 <code>invoke</code> 换成 <code>stream</code>，还要把解析逻辑跟着改三遍。
    </div>

    <h2>连接逻辑手写</h2>
    <p>
      组件本身其实没问题：提示模板、模型、解析器各司其职，每一个都很清楚。问题出在<strong>它们之间的「连接」是用手写代码表达的</strong>——格式化完赋给一个变量，再把它传给模型，再把模型的输出传给解析器。
    </p>
    <p>
      连接方式散落在每一段调用里，于是三笔成本都落到你身上。
    </p>
    <ol class="lesson-steps">
      <li>想整体换调用模式（<code>invoke</code> 换成 <code>stream</code> 或 <code>batch</code>），要逐个组件改，而且每一步交出的形状还都不一样。</li>
      <li>想在中间插一步（打条日志、转个格式），得钻进这段调用代码内部去动。</li>
      <li>想并行跑两条支路、再把结果合起来，得自己写 <code>Promise.all</code>，还要手工拼装返回结构。</li>
    </ol>
    <p>
      要问的是：<strong>能不能让「连接」本身成为一种可复用的对象，而不是散落在每段调用里的调用代码？</strong>
    </p>

    <h2>三步流程封装</h2>
    <p>
      最朴素的做法是把三步封进一个函数：<code>const p = await prompt.format(input)</code>，接着 <code>const r = await model.invoke(p)</code>，最后 <code>return parser.parse(r)</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>多步流程被固定成了一个可重复调用的单元</strong>。你不再每次都从头拼一遍，调用方只看到「给输入、拿输出」。
    </p>

    <h2>函数与模型耦合</h2>
    <ul>
      <li>想换模型只能进函数体去改，函数写一次就和某个模型绑死了。</li>
      <li>想整体跑流式做不到：函数里写死了 <code>invoke</code>，你没法从外部说「这条流程改用 <code>stream</code> 跑一遍」。</li>
      <li>想并行两条支路要自己写 <code>Promise.all</code>，合并出来的对象结构也得手动拼。</li>
      <li>想加一步就得改函数签名和内部逻辑，链越长越没人敢动。</li>
    </ul>

    <h2>统一接口约定</h2>
    <p>
      不推翻「把流程收成一个单元」，而是先统一接口。第一步补<strong>共同的方法约定</strong>：让每个组件都实现 <code>invoke</code>、<code>stream</code>、<code>batch</code> 三个方法。这样「调用模式」就从组件内部被抽出来，变成对所有组件都成立的一件事。先补它，是因为只有接口统一了，下一步的「串联」才有共同的语言。
    </p>
    <p>
      第二步补<strong>串联</strong>：用 <code>.pipe()</code> 把上游的输出直接接到下游的输入——<code>const chain = prompt.pipe(model).pipe(parser)</code>。管道不再关心每一步叫什么方法，只关心「上一步的输出能不能当下一步的输入」。
    </p>
    <p>
      关键的一步在这里：<code>pipe</code> 出来的 <code>chain</code> <strong>本身也是一个 Runnable</strong>，同样带 <code>invoke</code>、<code>stream</code>、<code>batch</code>。于是你可以对整条链整体换模式（<code>chain.stream(...)</code>），也可以把 <code>chain</code> 再 <code>.pipe</code> 接到别的组件后面。开场想改的那种「三处都要改」，现在只剩一个地方。
    </p>
    <p>
      第三步补<strong>等价写法</strong>：<code>RunnableSequence.from([prompt, model, parser])</code> 与连续 <code>.pipe()</code> 完全等价，步骤多的时候数组形式更好读，也更容易增删。
    </p>
    <p>
      最后补两个处理「形状」的工具：需要在不改动数据的前提下把原始输入顺手往下传，用 <code>RunnablePassthrough</code>；需要让同一份输入同时跑好几条支路，用 <code>RunnableParallel</code>，它的输出是一个以分支名命名成员的对象。调试时把链拆成两截，先验证上游输出再拼回去，能快速定位是哪一步出了问题。
    </p>

    <h2>管道数据流转</h2>
    <figure class="lesson-figure">
      <figcaption>点「执行管道」，看数据依次流过 ChatPromptTemplate、ChatOpenAI、StringOutputParser，中间用 <code>.pipe()</code> 相连，每一步都列出它收到的输入和交出的输出；跑完再对照下方的等价写法。</figcaption>
      <L04LCEL />
    </figure>

    <h2>组合关系复用</h2>
    <p>
      LCEL 把「组件怎么连」从手写调用提升成一种可复用的对象。接口统一（invoke / stream / batch）让调用模式可以整体切换，<code>.pipe()</code> 让数据按顺序流过，而整条链自己又是一个 Runnable——所以拆分、拼接、换模式都只动一处。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Runnable」</span>是 LCEL 里所有可组合组件的统一接口：只要一个对象实现了 <code>invoke</code>、<code>stream</code>、<code>batch</code>，它就能接收上游输出当输入，也能作为管道的一环，甚至整条管道本身也是 Runnable。边界是：只有遵守这套接口的对象才能进管道，一个普通函数要先包装成 Runnable（例如 <code>RunnableLambda</code>）才能参与组合。
    </div>
  </LessonArticle>
</template>
