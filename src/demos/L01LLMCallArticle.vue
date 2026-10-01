<script setup lang="ts">
import L01LLMCall from './L01LLMCall.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给「一键生成文案」按钮接了个模型，点下去以后页面一动不动、转圈转了整整八秒，用户以为卡死了——可实际上模型一直在吐字，只是你的代码非要等到最后一个字到手，才肯把整段贴出来。
    </div>

    <h2>模型调用的最小目标</h2>
    <p>
      你真正想做的事很小：让程序「问模型一句话，拿回一段话」。可模型在远端，它其实就是一个 HTTP 服务。过去你得自己发请求、自己拼出 <code>messages</code> 数组、自己解析返回的 JSON、自己处理超时和重试。这套流程里有三笔必须由人承担的成本。
    </p>
    <ol class="lesson-steps">
      <li>每次调用都要记得请求体的形状：一组带 <code>role</code> 与 <code>content</code> 的消息，而不是一句裸字符串。</li>
      <li>响应回来的不是一段文本，而是一个带 <code>content</code> 字段的大对象，你得自己拆包。</li>
      <li>想换个模型、调个参数，就得去改每一处写好的请求代码。</li>
    </ol>
    <p>
      于是问题落到一句话上：<strong>能不能把「跟模型说话」这件事，收敛成「调用一个对象上的方法」？</strong>
    </p>

    <h2>实例对象方法调用</h2>
    <p>
      最省事的做法是造一个 <code>ChatOpenAI</code> 实例，把模型名和参数交给构造函数，然后直接调它的 <code>invoke</code>：<code>new ChatOpenAI({ model, temperature, maxTokens })</code>，再用 <code>model.invoke([...])</code>，最后从 <code>response.content</code> 里取文本。
    </p>
    <p>
      这个方案做对了一件事：<strong>把远端的 HTTP 细节封进了一个实例</strong>。调用方眼里不再有请求体、不再有 JSON 解析，只剩下「invoke 一个输入，拿回一个结果」这一件事。
    </p>

    <h2>整段等待白屏代价</h2>
    <ul>
      <li>长回答只能整段等：<code>invoke</code> 要等模型把全部内容生成完才返回，界面在生成期间完全空白，就是开场那一幕。</li>
      <li>一次只能问一个：想连着问 10 个问题，只能写 <code>for</code> 循环逐个 <code>await</code>，总耗时是十倍，而这些问题之间明明互不相干。</li>
      <li>返回值不是字符串：<code>invoke</code> 给的是 <code>AIMessage</code>，直接当字符串用会得到 <code>[object Object]</code>，必须走 <code>.content</code> 才能拿到文本。</li>
      <li>参数与密钥散落：模型名、<code>temperature</code> 写在每一处 <code>new</code> 里，API Key 一旦硬编码进代码，就会随仓库一起泄漏出去。</li>
    </ul>

    <h2>多种调用姿态补充</h2>
    <p>
      不推翻「调用一个对象」，而是给它补上不同的调用姿态。先补<strong>流式</strong>：把 <code>invoke</code> 换成 <code>stream</code>，它交回一个异步迭代器，用 <code>for await (const chunk of stream)</code> 逐个分片取 <code>chunk.content</code>，每拿到一块就立刻画到界面上。先补它，是因为它精准修掉了开场最痛的那一幕——第一个字到手就渲染，用户不再干等。
    </p>
    <p>
      再补<strong>批量</strong>：<code>batch([...])</code> 一次提交多个输入，并行拿回一个结果数组，那 10 个问题不必再串行。注意它和 <code>stream</code> 交出的形状并不一样——<code>batch</code> 给你数组，<code>stream</code> 给你迭代器，两者都用 <code>.content</code> 取值。
    </p>
    <p>
      接着补<strong>参数语义</strong>。<code>temperature</code> 控制输出的随机性：代码生成这类要稳定的任务建议 <code>0</code> 到 <code>0.2</code>，创意写作这类要发散的场景建议 <code>0.7</code> 到 <code>1.0</code>。<code>maxTokens</code> 限制输出长度，避免长文白白烧掉 token。这两个值要按任务类型配，不是越大越好。
    </p>
    <p>
      最后补<strong>工程边界</strong>：生产环境的 API Key 一律走环境变量，不要写死在代码里；调用时也可以直接传一个字符串当作快捷写法，但一旦需要带上「你是谁」这类指令，就得改成消息数组来表达。
    </p>
    <div class="lesson-box warn">
      <strong>容易混的一点：</strong><code>stream</code> 改变的是<strong>你什么时候拿到数据</strong>，不是总耗时；它也不保证每个分片都是一句完整的话，别拿分片去做依赖完整语义的判断。
    </div>

    <h2>逐字输出的可见过程</h2>
    <figure class="lesson-figure">
      <figcaption>改模型名、温度和 maxTokens，输入问题后点「发送」，注意回答是一颗字一颗字冒出来的——那正是 stream 在逐 token 交付。</figcaption>
      <L01LLMCall />
    </figure>

    <h2>远端请求对象化</h2>
    <p>
      调用模型这件事，本质是把一个远端请求收敛成「对一个对象的方法调用」。默认用 <code>invoke</code> 拿完整回复，长回答换 <code>stream</code> 拿流，一批问题用 <code>batch</code> 并行，参数按任务类型配，密钥交给环境变量。把力气花在选择调用姿态上，而不是重写请求代码。
    </p>
    <div class="lesson-term">
      <span class="term-name">「流式输出」</span>指模型边生成边把结果切成 token 分片返回，客户端在生成完成前就能拿到并渲染部分内容，也就是 <code>stream</code> 的行为。它的边界是：只改变「何时拿到」，不改变总耗时，也不保证分片边界是完整句子；需要一份完整结果时请用 <code>invoke</code>。
    </div>
  </LessonArticle>
</template>
