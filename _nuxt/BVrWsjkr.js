const o=`<script setup lang="ts">
import J01SyntaxStatements from './J01SyntaxStatements.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>结算弹窗里写了一个小函数，最后两行是 <code>return</code>，换行，再写 <code>order.total * 0.9</code>；本地自测返回值却是 <code>undefined</code>，算好的折扣价凭空消失。同一份文件里，另有一行以 <code>(</code> 开头，上一行的赋值没写分号，两行被悄悄连成了一次函数调用。
    </div>

    <h2>给数据起名字</h2>
    <p>
      写代码的第一步是给数据起个名字，而命名的规则由语言直接规定：<strong>首字符必须是字母、下划线 <code>_</code> 或美元符号 <code>$</code></strong>，之后才能再接数字；名字<strong>区分大小写</strong>，<code>userName</code> 与 <code>username</code> 是两个不同的变量。还有一批被语言征用的<strong>保留字</strong>——<code>if</code>、<code>class</code>、<code>return</code>、<code>const</code>——它们背负着专门语法，不能拿来当名字。
    </p>
    <p>
      这些规则做对了一件事：<strong>让名字可以被稳定地引用</strong>。引擎靠名字找到变量，你也能一眼看懂变量装的是什么。但它只管「名字合不合法」，管不了「这一行在做什么」——程序里除了数据，还需要动作。
    </p>

    <h2>语句与表达式分家</h2>
    <p>
      动作有两种形态。「做一件事」的是<strong>语句</strong>：声明变量、赋值、<code>if</code> 分支、<code>for</code> 循环，它们改变程序状态，本身不产出一个值。「算一个数」的是<strong>表达式</strong>：<code>12 * 3</code>、<code>price - discount</code>、函数调用，它们一定会求出一个值，可以塞进等号右边、塞进函数参数、塞进模板插值。
    </p>
    <p>
      分不清这两种东西，代码就会写出别扭的结构——把只该做副作用的循环硬塞进需要值的位置，或者把本该求值的运算排成一串语句。其实有一个很省事的判据：<strong>把它放到 <code>const x = ___</code> 的右边，放得进去就是表达式，放不进去就是语句。</strong>每次都先想清楚「这一步要的是一个值，还是发生一件事」，位置自然就对了。
    </p>

    <h2>换行处的分号推断</h2>
    <p>
      语句写多了，很多人开始省略分号，靠引擎的<strong>自动分号插入（ASI）</strong>帮忙补。它做对了什么？让代码更干净，也照顾了从其他语言转过来、习惯不写分号的写法。
    </p>
    <p>
      但 ASI 不是「你想省它就补」：<strong>它只在换行处、并且只在补上分号能让语法成立时才补</strong>。于是两处换行变成了坑：
    </p>
    <ul>
      <li><code>return</code> 后面换行，返回值写在下一行——ASI 在 <code>return</code> 后立刻补上分号，函数直接返回 <code>undefined</code>，值那一行成了永远到不了的代码。</li>
      <li>上一行末尾没有分号，而下一行以 <code>(</code> 或 <code>[</code> 开头——ASI 认为这两行能连成一个表达式，于是不补分号：<code>a = b</code> 换行 <code>(c)</code> 被读成 <code>b(c)</code> 调用，<code>list</code> 换行 <code>[0]</code> 被读成 <code>list[0]</code> 取值。</li>
    </ul>
    <p>
      迭代的做法很朴素：<strong>该写的分号就写</strong>。如果坚持省略，至少做到两点——<code>return</code> 的值与它同处一行，以及行首出现 <code>(</code>、<code>[</code>、反引号时，主动给上一行补一个分号。顺带记住：<strong>缩进、空白、换行本身大都并不改变语义</strong>，唯一被换行影响的，就是 ASI 做的这几次判断。
    </p>

    <h2>注释与严格模式</h2>
    <p>
      注释用来解释代码为什么这么写。单行注释 <code>//</code> 管到行尾，多行注释 <code>/* … */</code> 可以跨行——但要注意<strong>块注释不能嵌套</strong>：一段 <code>/* … */</code> 里再出现一个 <code>/*</code>，第一个出现的 <code>*/</code> 就把整段提前闭合了，后半段会变成裸代码。也正因为如此，用注释「临时关掉」一整段含块注释的代码经常会失效。
    </p>
    <p>
      另一半是<strong>严格模式</strong>。默认脚本相当宽容：没声明就给变量赋值，会在全局偷偷建一个变量，代码里根本看不出它从哪来；普通函数被独立调用时，<code>this</code> 会指向全局对象。宽容方便上手，代价是错误被静默吞掉。改成严格模式，只需在脚本或函数体的<strong>第一行</strong>写上指令 <code>'use strict'</code>，而 ES Module 与 <code>class</code> 内部本就默认严格。它带来的变化很直接：<strong>未声明就赋值直接抛 <code>ReferenceError</code></strong>，<strong>独立调用普通函数时 <code>this</code> 是 <code>undefined</code> 而不是全局对象</strong>——把隐藏的假设，变成看得见的错误。
    </p>

    <h2>亲手验证两种东西</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮分别触发「求值表达式」与「执行语句」，看表达式如何产出一个值、语句又如何只产生副作用。</figcaption>
      <J01SyntaxStatements />
    </figure>

    <h2>先分清值还是动作</h2>
    <p>
      语法这层东西看着琐碎，其实都在回答两个问题：这个名字能不能用，这一行是在<strong>求值</strong>还是在<strong>做事</strong>。名字守好首字符与保留字的边界，语句与表达式各归其位，分号在关键换行处显式补上，注释不嵌套，严格模式开启——底层写稳了，上面讲的那些内容才不会替一处笔误背锅。
    </p>
    <div class="lesson-term">
      <span class="term-name">「语句与表达式」</span>表达式一定会求出一个值，能放到等号右侧、函数实参或插值位置；语句执行一个动作（声明、赋值、分支、循环），本身不产出值。最快的判据是把它写进 <code>const x = ___</code> 的右边：放得进去就是表达式，放不进去就是语句。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
