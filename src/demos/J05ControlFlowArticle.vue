<script setup lang="ts">
import J05ControlFlow from './J05ControlFlow.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>报名审核页用 <code>for...in</code> 遍历报名者数组，页面上打印出来的却是 <code>'0'</code>、<code>'1'</code> 这样的下标；同一份名单里用 <code>switch</code> 处理审核状态时漏写了 <code>break</code>，一条「已通过」的记录，把下面「已拒绝」的逻辑也一并执行了。
    </div>

    <h2>条件分支与真假值</h2>
    <p>
      <code>if / else if / else</code> 自上而下检查条件，命中第一个为真的分支，其余整段跳过。最省事的写法是把值直接丢进条件：<code>if (score)</code>，短，而且大部分时候看起来没错。
    </p>
    <p>
      问题藏在「真假值」里：<code>0</code>、空字符串、<code>null</code>、<code>undefined</code>、<code>NaN</code>、<code>false</code> 全被判为假，用户明明填了 0 分，却和「什么都没填」走进同一个分支；顺带一提，用弱相等写条件同样危险，<code>if (value == '')</code> 会把 <code>0</code> 也判成真。它做对的是让条件短，不够的是把「值是 0」和「值不存在」压成了同一个结论。
    </p>
    <p>
      迭代成两条习惯：<strong>条件尽量写成显式比较</strong>，如 <code>if (score !== undefined &amp;&amp; score &gt;= 60)</code>；<strong>用提前返回（guard clause）压平嵌套</strong>——先逐条挡掉不合法输入，再让主路径一路平铺下去：
    </p>
    <ul>
      <li><code>if (!name) return '请填写姓名'</code></li>
      <li><code>if (score &lt; 60) return '未通过'</code></li>
      <li><code>return '通过'</code></li>
    </ul>

    <h2>三元与多路分支</h2>
    <p>
      需要「二选一取个值」时，三元表达式最顺手：<code>条件 ? 真值 : 假值</code>，结果可直接塞进赋值或插值。<code>88 &gt;= 60 ? '合格' : '待定'</code> 一行就能定档。但嵌套两三层之后，括号和冒号会迅速失去可读性，超过一层就该换回 <code>if</code>。
    </p>
    <p>
      分支多于两条、且都在判断同一个值时，<code>switch</code> 比一串 <code>else if</code> 更清楚。要记住它的一条硬规则：<strong><code>switch</code> 用严格相等（<code>===</code>）逐个比较 <code>case</code></strong>，所以字符串 <code>'1'</code> 不会命中 <code>case 1</code>。另一条是<strong>穿透</strong>：每个 <code>case</code> 末尾若不写 <code>break</code>（或 <code>return</code>），执行会继续往下灌进下一个分支——开头那条「已通过」把「已拒绝」也跑了，正是漏了 <code>break</code>。穿透偶尔是故意为之（多个值共用同一段逻辑，写成 <code>case 1: case 2:</code>），但绝大多数情况它都是 bug。
    </p>

    <h2>三种循环的选择</h2>
    <p>
      循环有三种写法，选哪种取决于你能回答「循环什么时候停」。
    </p>
    <ul>
      <li><code>for</code>：次数或索引已知——初始值、条件、步进都集中在头部，最适合按下标推进的遍历。</li>
      <li><code>while</code>：只知道「条件成立就继续」，次数不确定，例如等一个队列清空。</li>
      <li><code>do...while</code>：<strong>先执行一次再判断</strong>，保证循环体至少跑一次——重试请求、输入校验这类「至少做一次」的场景才用它。</li>
    </ul>
    <p>
      换句话说，结束条件要么是「数得清的次数」，要么是「一直成立的条件」，要么是「不管怎样先来一次」。挑中对应的那一种，循环就不容易写成死循环。
    </p>

    <h2>遍历值还是遍历键</h2>
    <p>
      两个遍历写法名字很像，取出的东西却完全不同。<code>for...of</code> 遍历的是<strong>可迭代对象的值</strong>——数组元素、字符串字符、Map 的 <code>[key, value]</code>、Set 的成员，循环变量拿到的就是值本身。它做对了「遍历和取到的内容是一回事」，正是日常最想要的效果。
    </p>
    <p>
      而 <code>for...in</code> 遍历的是对象的<strong>可枚举字符串键</strong>，并且<strong>会沿原型链把继承来的可枚举属性也算进去</strong>。数组用 <code>for...in</code>，拿到的是 <code>'0'</code>、<code>'1'</code> 这样的字符串下标，还会带上挂在原型上的自定义属性——这就是开头打印出下标的原因。结论很干脆：<strong>要值就用 <code>for...of</code>；确实要看键名才用 <code>for...in</code>，并且最好配合 <code>Object.hasOwn()</code> 过滤掉继承属性；数组遍历一律用 <code>for...of</code>。</strong>
    </p>

    <h2>亲手跑一遍循环</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮用循环与跳转筛选报名名单，观察条件分支、<code>continue</code> 与 <code>break</code> 各自的效果。</figcaption>
      <J05ControlFlow />
    </figure>

    <h2>循环控制收尾</h2>
    <p>
      循环体里有两把开门的钥匙：<code>continue</code> 结束<strong>本轮</strong>、直接进入下一次迭代；<code>break</code> 结束<strong>整个循环</strong>。要注意 <code>break</code> 放在 <code>switch</code> 里时，它只跳出 <code>switch</code>，并不会跳出外层循环——若想一次跳出多层，可以用<strong>带标签的跳转</strong>：给外层循环起个名字 <code>outer:</code>，内层写 <code>break outer</code>。它能解决嵌套里「一次跳两层」的麻烦，但可读性差，能提前 <code>return</code>、或者把内外两层拆成两个函数，就别用标签。
    </p>
    <div class="lesson-term">
      <span class="term-name">「循环控制」</span><code>continue</code> 只跳过当前这一轮、继续下一次迭代；<code>break</code> 直接终止整个循环（在 <code>switch</code> 里则只跳出该分支）。想从嵌套循环中一次跳出指定外层，可用带标签的 <code>break outer</code>；能提前返回或拆分函数时，优先不用标签。
    </div>
  </LessonArticle>
</template>
