<script setup lang="ts">
import J15RegExp from './J15RegExp.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>手机号校验如果靠一串手写的下标判断，为什么一行 <code>/^1[3-9]\d{9}$/</code> 就能把同一件事说得更清楚？
    </div>

    <h2>字符串形态的描述</h2>
    <p>
      你需要在文本框里校验手机号、邮箱、身份证，还想从一段日志里把日期抠出来。这类工作的本质其实是一句话：<strong>先描述一个字符串长什么样，再拿去匹配。</strong>用 <code>for</code> 循环逐字符判断当然能做，可规则一旦复杂起来，代码就会失控。
    </p>
    <p>
      不做模式化描述，代价是：判断「像不像」和「取出其中一段」这两件事，都得靠你手工维护下标，长度、位置、前后文限制全要自己照顾。
    </p>
    <p>
      说白了，你真正需要的是一种「描述能力」：把一条规则老老实实写下来，然后反复使用；而不是每换一个字段、每换一个页面，就把同一套循环重写一遍。
    </p>

    <h2>逐位下标的判断</h2>
    <p>
      最省事的做法：写一个循环，按下标逐位判断——第一位是不是 <code>1</code>，第二位是不是 <code>3</code> 到 <code>9</code>，后面九位是不是数字。
    </p>
    <p>
      这个方案做对了一件事：<strong>完全可控、逻辑透明</strong>，每一步都在你眼皮底下，不依赖任何额外语法。规则简单且短时，它是可靠的。
    </p>

    <h2>索引判断的维护成本</h2>
    <ul>
      <li>冗长：身份证、邮箱这类规则写出来是几十行索引判断，可读性差、难以通读。</li>
      <li>难改：规则一变（比如放宽第二位范围），要回去改一串条件分支。</li>
      <li>提取难：光判断「像不像」还不够，往往要取出其中的年、月、日，手写 <code>slice</code> 的下标极易算错。</li>
      <li>边界多：长度、位置、以及「不能是更大数字串的一部分」这类前后文限制，统统要手动补。</li>
    </ul>

    <h2>声明式模式描述</h2>
    <p>
      不推翻「描述规则」，而是把描述方式换成声明式的<strong>正则表达式</strong>：用字符类、量词和锚点，把「长什么样」直接写出来。
    </p>
    <p>
      比如手机号就是 <code>/^1[3-9]\d{9}$/</code>——<code>^</code> 锚定开头、<code>$</code> 锚定结尾、<code>[3-9]</code> 是第二位允许的字符集合、<code>\d{9}</code> 表示后面恰好九个数字。规则一目了然，也不必再关心下标。
    </p>
    <p>
      拿到模式后，按用途选方法：<code>test()</code> 只回答「匹配不匹配」，适合做校验；<code>exec()</code> 返回单次匹配的详细信息（含捕获内容）；<code>matchAll()</code> 与 <code>replace()</code> 负责处理<strong>全部</strong>匹配和替换。
    </p>
    <p>
      要提取子串，用<strong>捕获组</strong>：普通括号是匿名组，按位置取值；<strong>命名组</strong> <code>(?&lt;name&gt;...)</code> 更清晰，匹配后可以从结果的 <code>groups</code> 对象里按名字取值，不必去数第几个括号。
    </p>
    <p>
      想限定「前面 / 后面必须有或没有某段文字」，又不想把这部分算进匹配结果，就用<strong>前后断言</strong>：前瞻 <code>(?=...)</code> 要求后面紧跟，负前瞻 <code>(?!...)</code> 要求后面不能出现；后行断言同理。它们只作为条件，<strong>不消耗字符</strong>。
    </p>
    <p>
      断言真正的价值在于「上下文限定」。比如只想匹配后面跟着「元」字的数字，把 <code>元</code> 放进前瞻即可，匹配结果里只留数字、不留这个字；想排除「原价」里的数字，用负后行断言要求前面不是那两个字就行。一句话：需要「看」，但不需要「吃掉」的内容，都交给断言。
    </p>
    <p>
      最后是修饰符，控制匹配范围：<code>g</code> 全局、<code>i</code> 忽略大小写、<code>m</code> 多行、<code>s</code> 让点号也匹配换行、<code>u</code> 启用 Unicode 模式。
    </p>
    <table>
      <thead>
        <tr><th>需求</th><th>方法</th></tr>
      </thead>
      <tbody>
        <tr><td>只要「匹配 / 不匹配」</td><td><code>test()</code></td></tr>
        <tr><td>取单次匹配的细节与捕获内容</td><td><code>exec()</code></td></tr>
        <tr><td>遍历所有匹配</td><td><code>matchAll()</code>（需带 <code>g</code>）</td></tr>
        <tr><td>批量替换</td><td><code>replace()</code></td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      三个坑必须记住：第一，带 <code>g</code> 标志的正则，多次 <code>exec()</code> / <code>test()</code> 会因 <code>lastIndex</code> 前进而给出不同结果，状态挂在正则对象上，复用时尤其危险。第二，把用户输入拼进正则模式之前<strong>必须转义特殊字符</strong>，否则会改变匹配语义，甚至引发性能灾难。第三，量词尽量写具体，比如用 <code>[0-9]{4}</code> 而不是 <code>.*</code>，避免在大文本上<strong>回溯爆炸</strong>；复杂校验建议拆成多个边界清晰的正则分别判断。
    </div>

    <h2>输入框的实时校验</h2>
    <figure class="lesson-figure">
      <figcaption>在三个输入框里试错，看 <code>test()</code> 如何按模式实时给出校验结果。</figcaption>
      <J15RegExp />
    </figure>

    <h2>可复用模式的收益</h2>
    <p>
      正则表达式把「字符串长什么样」变成一段可复用的声明式模式。校验、提取、替换这些原本要手写下标的工作，被压缩成一行模式加一次调用——代价是要清楚它的状态与性能边界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「正则表达式」</span>用模式描述字符串的形状，由字符类、量词、捕获组与前后断言组合而成。<code>test()</code> 用于校验，<code>exec()</code> 提取单次匹配（含命名组），<code>matchAll()</code> 与 <code>replace()</code> 处理全部匹配；修饰符 <code>g</code>、<code>i</code>、<code>m</code>、<code>s</code>、<code>u</code> 控制匹配范围，其中带 <code>g</code> 的正则会通过 <code>lastIndex</code> 记住上次匹配位置。
    </div>
  </LessonArticle>
</template>
