<script setup lang="ts">
import K02TemplateSyntax from './K02TemplateSyntax.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>输入框里改了关键词，下面的订单列表就自己少了几条，可我一行操作 DOM 的代码都没写——列表到底是被谁改的？
    </div>

    <h2>状态驱动视图</h2>
    <p>
      做一个很常见的订单搜索：一个输入框，用户在其中输入「拿铁」；下方列表实时只剩下名字里带「拿铁」的订单；如果一条都没匹配上，就显示一句「暂无匹配订单」。此外还要有一个清空按钮，关键词为空时按钮应当置灰不可点。
    </p>
    <p>
      用最熟悉的方式描述这件事，你会说：「输入变化 → 过滤数据 → 列表重新显示」。注意这三个动作里，只有中间那步是<strong>数据计算</strong>，前后两步都是<strong>页面表现</strong>。麻烦恰恰在于，只要在页面表现上动手，就免不了去关心「哪个节点、什么时候、改哪一部分」。
    </p>

    <h2>列表整体重拼</h2>
    <p>
      最朴素的做法：给输入框绑一个监听，回调里读当前值、过滤一遍数组，再找到列表容器，把 <code>innerHTML</code> 整个重新拼一遍。按钮的禁用状态也手动加上去或去掉。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它承认「页面是由数据算出来的」</strong>。列表内容本质上是原始订单经过过滤后的结果，这个思路必须保留。要丢掉的只是「手动把结果搬进 DOM」这一步。
    </p>

    <h2>重建开销与状态同步</h2>
    <ul>
      <li>每次输入都整体重建列表，输入框的焦点、光标位置和浏览器原生状态会被一并抹掉。</li>
      <li>同一份事实被存了两份：一份在变量里，一份在 DOM 里，两边随时可能不一致。</li>
      <li>「有结果」和「无结果」两条分支要靠 <code>if</code> 拼字符串，分支一多就极容易漏掉情况。</li>
      <li>按钮禁用、列表项、提示文案各自手写，逻辑散落在多处，删掉一个功能要改好几个地方。</li>
      <li>没有办法表达「只更新变化的那一部分」，全量重建在大列表上代价很高。</li>
    </ul>

    <h2>声明式模板编译</h2>
    <p>
      换一个思路：不再告诉浏览器「怎么改」，而是<strong>声明「状态是什么、页面应该长什么样」</strong>。这就是 Vue 模板。它是一层声明式的视图描述：模板编译器把它转换成渲染函数，响应式系统在状态变化时精确更新对应的 DOM，不需要你手动碰节点。前面那几个缺陷，全部在这里被化解。
    </p>
    <p>
      先解决「把状态显示出来」——这叫<strong>插值</strong>。把状态直接渲染成文本有两种写法：一是双大括号包住表达式，二是 <code>v-text</code> 指令。它对应的正是原来那句「把值拼进字符串」。
    </p>
    <p>
      接着解决两类反复出现的行为，它们被统一抽象成<strong>指令</strong>：
    </p>
    <ul>
      <li><strong>条件</strong>：<code>v-if</code> 与 <code>v-else</code> 负责「显示哪一种结果」，模板里两条分支都写得明明白白，不再需要手写字符串拼接。</li>
      <li><strong>循环</strong>：<code>v-for</code> 负责「把一组数据铺开成一组节点」，列表由数据长度自动决定。</li>
      <li><strong>属性绑定</strong>：冒号开头的写法（如 <code>:disabled</code>）把表达式的结果绑到属性上，按钮置灰这件事变成一句声明。</li>
      <li><strong>事件绑定</strong>：<code>@click</code>、<code>@input</code> 这类写法把用户动作交回组件逻辑。</li>
    </ul>
    <p>
      三者的分工就此清晰：<strong>插值负责显示文本，指令负责常见 DOM 行为，事件绑定把用户动作送回逻辑</strong>。回到订单搜索这个例子里：输入框用 <code>v-model</code> 把关键词同步进响应式状态；过滤结果用 <code>computed</code> 算出来，而不是把过滤逻辑塞进模板；模板再根据结果用 <code>v-if</code> / <code>v-else</code> 给出反馈、用 <code>v-for</code> 渲染列表。改关键词之后，只有依赖它的那一小块 DOM 被更新。
    </p>
    <div class="lesson-box warn">
      <strong>三个高频坑：</strong>模板里确实可以写表达式，但<strong>复杂判断应移到 <code>computed</code> 或函数中</strong>，让模板保持可读；<code>v-for</code> 的 <code>key</code> 要稳定且能代表数据身份，<strong>不要使用随机数</strong>；事件处理函数只处理本次交互，不要在模板里堆叠过多内联逻辑。
    </div>
    <p>
      最后记住一个事实：<strong>模板最终会编译为渲染函数</strong>。你写的是声明，跑起来的是函数——调试版本中可以通过组件面板对照查看，理解了这一点，后面遇到「为什么这里会重新渲染」就不会再困惑。
    </p>
    <ol class="lesson-steps">
      <li>输入框通过 <code>v-model</code> 把关键词同步到响应式状态。</li>
      <li><code>computed</code> 根据关键词过滤订单列表，避免在模板中写复杂表达式。</li>
      <li>模板根据过滤结果使用条件指令显示反馈，并通过 <code>v-for</code> 渲染列表。</li>
      <li>修改关键词后观察只有依赖它的 DOM 区域被精确更新。</li>
    </ol>

    <h2>多处视图联动演示</h2>
    <figure class="lesson-figure">
      <figcaption>在输入框里改关键词，观察列表、计数提示与清空按钮如何一起跟着变。</figcaption>
      <K02TemplateSyntax />
    </figure>

    <h2>插值指令与事件绑定</h2>
    <p>
      模板语法的价值，是把「改 DOM」换成「声明状态与视图的对应关系」。插值负责显示，条件与循环指令负责结构，属性与事件绑定负责交互，三者协作之后，页面就由数据自动推出来。需要做的只剩一件：把状态算清楚，把复杂逻辑从模板里搬进 <code>computed</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「声明式模板」</span>指开发者只声明状态是什么、页面应该长什么样，模板编译器再把它转成渲染函数，由响应式系统在状态变化时精确更新对应 DOM。插值显示文本，条件与循环指令负责结构，属性与事件绑定负责交互；<code>v-for</code> 的 <code>key</code> 必须稳定，复杂表达式应放进 <code>computed</code>。
    </div>
  </LessonArticle>
</template>
