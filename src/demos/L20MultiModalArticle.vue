<script setup lang="ts">
import L20MultiModal from './L20MultiModal.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户在对话框里贴了一张报错截图，问「这什么问题」。你的文本模型只能回一句：「我看不到图片，请把报错信息用文字贴出来。」——可那张截图里，堆栈、文件名、行号一应俱全，信息明明就在那儿，只是全被挡在了「模型只认文本」这道墙外面。
    </div>

    <h2>纯文本模型的盲区</h2>
    <p>
      传统 LLM 只吃文本。可真实场景里，信息常常只存在于图片中：报错截图、数据图表、发票、手写笔记。你要让模型看懂它们，它却没有读图的通道。
    </p>
    <p>
      旧办法是先跑一遍 OCR，把图里的字抠出来，再当文本喂给模型。它把三笔成本留给了你：
    </p>
    <ol class="lesson-steps">
      <li><strong>只认字，丢掉图</strong>：OCR 输出的是字符，图片里的趋势、颜色、构图、物体之间的关系全没了。</li>
      <li><strong>结构被打乱</strong>：多栏排版、表格、图表经 OCR 后，阅读顺序常常错成一团。</li>
      <li><strong>答不了「看图」类问题</strong>：像「这张照片是什么氛围」「这两张图有什么区别」，OCR 从原理上就无能为力。</li>
    </ol>
    <p>
      要回答的是：<strong>怎样让模型在同一次调用里，既读到文字、又看到图像，从而完成描述、问答、图表解读和 OCR 这些任务？</strong>
    </p>

    <h2>消息内容块混排</h2>
    <p>
      最朴素的做法：在 <code>HumanMessage</code> 的 <code>content</code> 里混排内容块。不再传一段字符串，而是传一个<strong>数组</strong>——数组里既有 <code>{ type: 'text' }</code> 的文本块，也有 <code>{ type: 'image_url' }</code> 的图片块。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「图片」变成了消息的一部分</strong>。文本和图像进入的是同一次调用、同一段上下文，模型能同时看到两者，也就能回答「图文并茂」的问题——这正是「多模态」的入口。
    </p>

    <h2>图片来源的障碍</h2>
    <ul>
      <li>图片从哪来是个问题：传 URL 会遇到内网、防盗链；本地文件要读成 base64，而大图直接塞进去体积和成本都很高。</li>
      <li>清晰度与提示词质量直接决定效果：糊图配上一句模糊的「描述一下」，只能得到笼统、无用的描述。</li>
      <li>输出还是一段自由文本：程序没法直接消费，想拿到「类型、主色、物体」这样的结构化结果做不到。</li>
      <li>不同任务需要不同问法：多图对比、图表解读、OCR，用同一种「描述一下」覆盖不了。</li>
    </ul>

    <h2>三条支线补全</h2>
    <p>
      不推翻「把图片放进消息」，而是沿着来源、问法、结构化三条线各自补齐。
    </p>
    <p>
      第一步，<strong>解决图片来源</strong>。<code>image_url</code> 既接受一个图片 URL，也接受 <code>data:image/png;base64,...</code> 这样的 data URL——本地文件先读成 Buffer、转成 base64 再拼上前缀即可。要注意的是，<strong>图像较大时先压缩再转 base64</strong>，否则请求体积和 token 消耗都会失控。
    </p>
    <p>
      第二步，<strong>把「怎么问」说清楚</strong>。视觉任务其实是好几类：图像描述、视觉问答（VQA）、图表分析、OCR、多图对比，每一类都要给对应的提示词和角色设定。图片块上的 <code>detail</code> 参数（<code>low</code> / <code>auto</code> / <code>high</code>）控制解析精度，也直接影响成本——简单判断用低精度，需要读清小字才调高。
    </p>
    <p>
      第三步，<strong>让程序能直接消费结果</strong>。把多模态调用和 Zod / 结构化输出解析结合起来，让模型按预定义的 schema 返回：图片类型、主体内容、主要颜色、识别到的物体、图片质量、其中的文字。这样「看图」的产物才从一段话，变成能进下游的字段。
    </p>
    <div class="lesson-box warn">
      <strong>图片是会被计费的：</strong>视觉模型并不会「免费看图」，图像会按尺寸折算成 token，高清大图尤其贵。批量分析之前先估算成本；同时注意图片里可能含有隐私信息，传输与留存都要有明确策略。
    </div>

    <h2>四种分析模式对比</h2>
    <figure class="lesson-figure">
      <figcaption>从三张示例图里选一张、挑一种分析模式（图像描述 / 标签识别 / 详细分析 / 文字检测），点「开始分析」，看模型返回的结果与置信度；再切到「代码示例」，对照多模态消息与提示模板的写法。</figcaption>
      <L20MultiModal />
    </figure>

    <h2>多模态感知能力</h2>
    <p>
      多模态解决的是「让模型看得见」。做法是在 <code>HumanMessage</code> 的 content 数组里混排文本块与图片块，图片用 URL 或 base64 传入；再按任务选好提示词、用 <code>detail</code> 权衡精度与成本、必要时结合 schema 输出结构化结果。这样模型才从「只会读字」变成「看得懂图」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「多模态（Multimodal）模型」</span>指能在同一次调用中同时接收并联合理解文本、图像等不同模态输入的模型；在 LangChain 里表现为 <code>HumanMessage</code> 的 <code>content</code> 数组中混排 <code>{ type: 'text' }</code> 与 <code>{ type: 'image_url' }</code> 内容块。边界：图片既可用 URL 也可用 base64（data URL）传入，<strong>会按尺寸折算 token</strong>，大图需先压缩；理解效果受图像清晰度与提示词质量影响，且要注意图片的隐私与传输体积。
    </div>
  </LessonArticle>
</template>
