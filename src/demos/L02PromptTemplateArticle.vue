<script setup lang="ts">
import L02PromptTemplate from './L02PromptTemplate.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一场促销要改一句文案，同事在活动页、推送、客服机器人里搜出三段几乎一样的长字符串。你改了其中两段，第三段漏了，结果同一场活动在线上出现了两种说法。
    </div>

    <h2>提出问题</h2>
    <p>
      一条提示词其实是两样东西焊在一起的：<strong>固定的骨架</strong>（「请为某人写一段某风格的介绍」）和<strong>每次变化的值</strong>（产品、受众、风格）。用加号拼字符串，等于把骨架和值焊死在同一个表达式里，于是每次调用都要把骨架重抄一遍。
    </p>
    <p>
      这种「拼字符串」的写法有三笔必须由人承担的成本。
    </p>
    <ol class="lesson-steps">
      <li>骨架被复制成好多份，改一次要改好几处，漏掉一处就出现开场那种前后不一致。</li>
      <li>值被直接插进字符串，读代码的人看不出这里原本是一个「变量」，也就不知道该改哪里。</li>
      <li>想「先填一半、后填一半」做不到——比如语言提前定死、主题稍后才知道，拼到一半只能整个推倒重来。</li>
    </ol>
    <p>
      要问的是：<strong>能不能让骨架只写一份，把变化的部分留成一个占位，等到调用时再注入？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法是用 <code>PromptTemplate</code>：把骨架写成一句带占位符的字符串，用单花括号标出可变位置，例如 <code>PromptTemplate.fromTemplate('请为 {product} 撰写一段面向 {audience} 的产品介绍')</code>，再调 <code>.format({ product: '智能手表', audience: '大学生' })</code> 把值交进去。
    </p>
    <p>
      这个方案做对了一件事：<strong>骨架和值分开了</strong>。模板成为一份可复用的常量，值只在调用点出现，改文案时你只需要动那一份骨架。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>整个提示只有一个大字符串：对话场景里模型分不清哪段是「系统指令」、哪段是「用户提问」，把指令混进正文，模型可能拿指令当问题回答。</li>
      <li>占位符不能提前填：语言这类长期固定的变量，在每一处 <code>format</code> 里都还得重复写一遍，又回到复制粘贴。</li>
      <li>变量名写错不会当场报错：把 <code>{product}</code> 敲成 <code>{prodcut}</code>，没有对应值时你得到的是一段原样带着 <code>{prodcut}</code> 字样的文本，被直接发给了模型。</li>
      <li>值来自用户时没有护栏：用户内容过长、或其中带着会打乱模板结构的字符，整条提示的骨架就可能被搅乱。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「模板 + 注入」，而是一层层补上它缺的东西。先补<strong>角色</strong>：改用 <code>ChatPromptTemplate.fromMessages([...])</code>，用 <code>system</code> 放「你是谁、用什么语气」，用 <code>human</code> 放具体问题，最后用 <code>formatMessages</code> 拿到真实的消息数组。先补它，是因为它修的是最直接的出错——模型把指令和提问看成一坨。
    </p>
    <p>
      接着补<strong>分步注入</strong>。<code>baseTemplate.partial({ language: '中文' })</code> 先把长期固定的变量填掉，返回的是一个「还差一个变量」的新模板，之后再用 <code>.format({ topic: '机器学习' })</code> 补上剩下的。为什么第二步才补它：只有当骨架被独立出来之后，这种「先填一半」才有可复用的对象可谈。
    </p>
    <p>
      再往下补<strong>结构约定</strong>：变量名要语义清晰，写 <code>product</code> 而不是 <code>p</code>；复杂提示一律拆成 system 指令加 human 输入，让模型更容易分清上下文与提问。
    </p>
    <p>
      最后补<strong>输入边界</strong>：变量值来自用户时，要限制长度并做转义，防止用户内容破坏模板结构——模板给的是骨架的复用能力，护栏还得你自己加。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>改产品、受众、风格三个输入框：上方 <code>PromptTemplate.format()</code> 的结果会同步变化；往下看 ChatPromptTemplate 的两条消息怎么按 system / human 分开；最下面是 partial 只注入了 product 和 tone、audience 还留成占位的样子。</figcaption>
      <L02PromptTemplate />
    </figure>

    <h2>总结</h2>
    <p>
      提示词模板只做一件事：把「固定骨架」和「变化的值」拆开管理。骨架写一份，值在调用点注入，角色靠消息序列表达，长期不变的变量用 partial 提前填掉。要求里那些边界——变量名、输入长度、用户内容——仍然要在模板之外自己守住。
    </p>
    <div class="lesson-term">
      <span class="term-name">「部分变量」</span>指把一个模板里的一部分变量先固定下来，得到一个新模板，其余变量留待后续 <code>format</code> 补全。边界是：partial 只填补你指定的键，没补的占位符会原样保留；它不会替你校验变量名是否写错，也不会替你限制用户输入的长度。
    </div>
  </LessonArticle>
</template>
