const o=`<script setup lang="ts">
import PY08Functions from './PY08Functions.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>写了一个 <code>def add_item(item, box=[])</code>，接着连续调用 <code>add_item('栗子')</code> 两次。本以为每次都拿到只装一个元素的新列表，第二次返回的列表里却躺着两个 <code>'栗子'</code>。明明没传 <code>box</code>，这个元素是从哪冒出来的？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      一段逻辑要被用上好几次时，最省事的办法是把它抄成 <code>def</code>：把重复的几行收进一个名字，调用处只写一行 <code>greet('小明')</code>。这样改动集中在定义里一处，调用处干净，读起来也像在念一句自然语言。
    </p>
    <p>
      函数一旦变多，新的问题紧跟着出现：调用时到底该按顺序塞几个值？哪些可以省略？想额外塞点别的东西怎么办？这些都要落到<strong>参数与返回值</strong>的设计上。先弄清楚返回值，再往参数上叠能力。
    </p>

    <h2>返回值：没写 return 就返回 None</h2>
    <p>
      Python 不要求函数声明返回类型，<code>return</code> 本身也是可选的。理解返回值只需记住三条规则：
    </p>
    <ul>
      <li>函数体里一次 <code>return</code> 都没执行到，调用结果就是 <code>None</code>。</li>
      <li>只写 <code>return</code>（后面没表达式），返回的同样是 <code>None</code>，常用于提前结束。</li>
      <li><code>return a, b</code> 看着像返回两个值，其实返回的是<strong>一个元组</strong> <code>(a, b)</code>，正好可以用 <code>low, high = min_max(data)</code> 解包。</li>
    </ul>
    <p>
      把「多返回值」理解成「返回一个元组」，很多困惑就消散了：它和单个值没有本质区别，只是元组可以被解包而已。
    </p>

    <h2>参数的四层写法</h2>
    <p>
      一个形参列表可以从左到右叠出四种能力，顺序基本固定：
    </p>
    <ol class="lesson-steps">
      <li><strong>位置参数</strong>：最普通的形式，实参按先后顺序一一对应。</li>
      <li><strong>默认参数</strong>：写作 <code>def f(x=1)</code>，调用时省略就取默认值，必须排在不带默认值的位置参数之后。</li>
      <li><strong>关键字参数</strong>：调用时写作 <code>f(x=5)</code>，按名字赋值，顺序随意、可读性更好。</li>
      <li><strong>变参</strong>：<code>*args</code> 把多余的位置实参收进一个元组，<code>**kwargs</code> 把多余的关键字实参收进一个字典。</li>
    </ol>
    <p>
      <code>*args</code> 与 <code>**kwargs</code> 里的名字（<code>args</code>、<code>kwargs</code>）只是习惯叫法，写作 <code>*hobbies</code>、<code>**extra</code> 完全等价，真正起作用的是那两个星号。函数签名里，带 <code>*</code> 的参数之后还允许出现<strong>仅限关键字</strong>的参数，调用时只能按名字传入。
    </p>

    <h2>调用处解包：星号的反向用法</h2>
    <p>
      星号在函数<strong>定义处</strong>是「收集」，在<strong>调用处</strong>则是「拆开」。手里已经有一个列表或字典时，不想一个个手动写出来，就直接解包：
    </p>
    <ul>
      <li><code>f(*items)</code>：把列表或元组里的每个元素当成一个位置实参依次传入。</li>
      <li><code>f(**options)</code>：把字典里的每个键值对当成一个关键字实参传入。</li>
    </ul>
    <p>
      两个方向合起来看就清楚了：定义处让函数<strong>接住不定数量的实参</strong>，调用处让容器<strong>展开成一份实参清单</strong>，两者是同一枚硬币的两面。
    </p>

    <h2>作用域与名字查找的 LEGB 顺序</h2>
    <p>
      函数体里用到一个名字时，Python 按<strong>LEGB</strong>四层依次查找：先 <code>Local</code>（当前函数的局部变量），再 <code>Enclosing</code>（外层嵌套函数的局部变量），然后 <code>Global</code>（模块级全局变量），最后 <code>Builtins</code>（内置名字，如 <code>len</code>、<code>print</code>）。找到就停下，全找不到才抛 <code>NameError</code>。
    </p>
    <p>
      默认情况下，函数体里对名字赋值只影响局部作用域。想把结果写回外层，要用 <code>global</code> 声明绑定到模块级名字，用 <code>nonlocal</code> 声明绑定到外层嵌套函数的名字。二者要注意：声明只是「把赋值指向已有名字」，并不会凭空创建。
    </p>

    <h2>可变默认参数陷阱与一等对象</h2>
    <p>
      回到开场那个诡异现象。默认值 <code>[]</code> 属于<strong>参数对象本身</strong>，在函数定义时就被创建了<strong>一次</strong>，于是所有没传 <code>box</code> 的调用都在往同一个列表里追加——它当然会跨调用累积。修复方式是用不可变的 <code>None</code> 作占位，进入函数后再按需新建列表。
    </p>
    <p>
      另一件事值得早点建立：在 Python 里函数是<strong>一等对象</strong>。它能被赋给名字、放进列表、当作实参传给别的函数，也能作为返回值。正因为如此，才可能出现「接收函数、返回新函数」的装饰器，才有无名的小函数 <code>lambda x: x * 2</code>。把它当普通对象看待，后面闭包、装饰器、回调会顺很多。
    </p>
    <div class="lesson-box warn">
      <strong>常见误区：</strong>把可变对象（<code>[]</code>、<code>{}</code>、<code>set()</code>）直接写成默认值，是新手最常踩的坑之一。只要默认值可被就地修改，就优先写成 <code>None</code> 再在函数体内初始化。
    </div>

    <h2>看一遍参数绑定与默认值陷阱</h2>
    <figure class="lesson-figure">
      <figcaption>在「位置 / 默认 / 关键字」几个页签间切换，观察同一个名字如何落到不同的形参上；再连点「再调用一次」按钮，亲眼看到共享默认列表被逐次填满。</figcaption>
      <PY08Functions />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      <code>def</code> 把逻辑收进一个名字，返回值默认是 <code>None</code>、多个值其实是元组；参数从左到右可叠位置、默认、关键字与 <code>*args</code>/<code>**kwargs</code>，调用处再用星号反向解包。函数体里的名字按 LEGB 查找，用 <code>global</code>/<code>nonlocal</code> 才能写回外层。最后，函数本身是一等对象——这一条是理解装饰器与闭包的起点。
    </p>
    <div class="lesson-term">
      <span class="term-name">「一等对象」</span>指函数与整数、字符串一样是普通对象：可赋值、可作参数、可作返回值、可存放在容器里。边界与例外：把函数当作对象传递时要留意闭包捕获的是变量引用而非当时的取值；可变默认参数属于定义时共享的对象，不是每次调用新建的。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
