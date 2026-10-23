const o=`<script setup lang="ts">
import PY01Variables from './PY01Variables.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>写了 <code>a = [1, 2, 3]</code>，又写了 <code>b = a</code>，接着 <code>b.append(4)</code>——回头看 <code>a</code>，它居然也变成了 <code>[1, 2, 3, 4]</code>。你明明只动了 <code>b</code>，为什么 <code>a</code> 跟着变？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      Python 最让人放松的地方，是不用写类型：<code>x = 42</code> 一行就能开始干活，不需要像 C++ 那样先声明 <code>int x;</code>。写个小脚本、算个数、拼个字符串，直接上手就写，读起来也几乎没有噪音。
    </p>
    <p>
      这份便利也埋下了第一个疑问。在 <code>a = [1, 2, 3]</code>、<code>b = a</code> 这两行里，多数人按其他语言的直觉理解为「把 a 的值复制一份给 b」。可 Python 里 <code>b = a</code> <strong>没有复制</strong>——它只是让 <code>b</code> 这个名字指向了 <code>a</code> 已经指向的那个列表对象。于是 <code>b.append(4)</code> 改的就是同一个列表，<code>a</code> 自然跟着变。
    </p>

    <h2>变量是名字，不是盒子</h2>
    <p>
      要理解上面那件事，得先换一个模型。很多语言里，变量像一个<strong>盒子</strong>，赋值是把值放进盒子里，读出来就是盒子里那份值。Python 的模型不同：变量是一个<strong>名字</strong>，赋值是把名字<strong>绑定</strong>到一个已经存在的对象上。
    </p>
    <ul>
      <li><code>a = [1, 2, 3]</code>：创建一个列表对象，让名字 <code>a</code> 指向它。</li>
      <li><code>b = a</code>：让名字 <code>b</code> 指向<strong>同一个对象</strong>，没有新对象产生。</li>
      <li><code>a = [9]</code>：让名字 <code>a</code> 改指向一个新列表，而 <code>b</code> 仍然指向原来那个。</li>
    </ul>
    <p>
      这套「名字绑定到对象」的模型叫<strong>对象引用语义</strong>。函数传参、容器嵌套、共享状态出问题，十有八九是把它错当成「值拷贝」来推理了。想拿到独立副本，必须显式调用 <code>copy()</code> 或切片 <code>a[:]</code>。
    </p>

    <h2>动态类型：便利与代价并存</h2>
    <p>
      既然名字只是绑定，它自然不必一辈子指向同一种类型的对象。<code>x = 42</code> 之后写 <code>x = '42'</code> 完全合法，类型在运行时随对象变化——这就是<strong>动态类型</strong>。它让原型写起来极快，也让「一份代码处理多种输入」变得自然。
    </p>
    <p>
      代价出现在出错的时候。类型不匹配不会在写代码时被拦下，只能等到那一行真的执行：<code>'42' + 1</code> 会抛出 <code>TypeError: can only concatenate str (not "int") to str</code>。凡是「编辑器不报错、运行时才炸」的问题，根子常常就在这里：名字背后的类型没有被写清楚。
    </p>

    <h2>不可变与可变：修改行为的分水岭</h2>
    <p>
      为什么整数、字符串改起来没感觉，列表却会「牵一发而动全身」？区别在于对象<strong>可变还是不可变</strong>：
    </p>
    <ul>
      <li><strong>不可变</strong>（<code>int</code>、<code>float</code>、<code>str</code>、<code>tuple</code>）：对象一旦创建内容就不能变。所谓「修改」其实是<strong>新建</strong>一个对象，再让名字改绑过去；原对象原封不动，其他指向它的名字看不到任何变化。</li>
      <li><strong>可变</strong>（<code>list</code>、<code>dict</code>、<code>set</code>）：<code>append</code>、<code>pop</code>、<code>update</code> 这类操作<strong>就地修改</strong>对象本身。只要还有别的名字指向它，变化立刻对所有名字可见。</li>
    </ul>
    <p>
      「不可变对象可以安全共享」是一条重要直觉：默认参数用 <code>None</code> 而不是 <code>[]</code>、把元组当作字典键、用 <code>frozenset</code> 放进集合，都建立在这条性质上。
    </p>

    <h2>类型转换：把外部输入变成数字</h2>
    <p>
      程序读进来的文字永远是字符串，<code>input()</code> 也好、配置文件也好、HTTP 请求体也好。要用它做算术，就得显式转换：<code>int('42')</code> 得到 <code>42</code>，<code>float('3.14')</code> 得到 <code>3.14</code>，<code>str(42)</code> 再变回文本。
    </p>
    <p>
      转换会在失败时抛出 <code>ValueError</code>，这恰恰是它的价值——它把「不可用的输入」挡在了边界上。两个容易被忽略的点：<code>int('3.14')</code> 会失败（要先用 <code>float()</code>）；<code>bool('')</code> 是 <code>False</code>，但 <code>bool('0')</code> 是 <code>True</code>，因为判断依据是「字符串是否为空」而不是它的内容像不像零。
    </p>

    <h2>把意图写进注解与校验</h2>
    <p>
      动态类型不是要放弃约束，而是把约束挪到你该负责的地方。两个实用手法：
    </p>
    <ol class="lesson-steps">
      <li>用类型注解表达意图：<code>def add(a: int, b: int) -&gt; int</code>。注解默认<strong>不做运行期强制</strong>，它的价值在于让编辑器和静态检查工具（如 mypy）替你发现类型不一致。</li>
      <li>在系统边界做显式校验：对不可信输入用 <code>isinstance()</code> 或转换函数把类型「钉死」，失败就给出清晰错误，而不是让错误渗进业务流程深处。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>常见误区：</strong>把 <code>b = a</code> 当成复制，是新手最贵的教训之一。需要独立副本时，可变对象要用 <code>copy.copy()</code>（浅拷贝）或 <code>copy.deepcopy()</code>（嵌套结构深拷贝）；不可变对象无需拷贝，共享本来就是安全的。
    </div>

    <h2>看一遍变量与类型的行为</h2>
    <figure class="lesson-figure">
      <figcaption>切到「动态类型」点几行代码看同一个名字如何改绑类型；再翻到「可变与不可变」看共享列表的连锁修改，最后在「类型转换」里改输入试 <code>int</code> / <code>float</code> / <code>bool</code> 的成败。</figcaption>
      <PY01Variables />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      Python 的变量是<strong>名字到对象的绑定</strong>，类型属于对象而不属于名字，所以同一个名字可以先后指向不同类型；对象又分<strong>可变</strong>与<strong>不可变</strong>，后者「修改」即新建、可安全共享，前者就地修改会对所有引用者生效。把这三句话记住，变量共享、参数传递、容器嵌套里的大半迷惑都能自己解释清楚。
    </p>
    <div class="lesson-term">
      <span class="term-name">「对象引用语义」</span>指变量保存的是指向对象的引用（名字绑定），赋值只改绑定、不复制对象。边界与例外：不可变对象因为无法就地修改，共享时看起来和「值拷贝」无异；一旦对象可变，任何一处就地修改都会通过共享引用影响所有名字，需用 <code>copy</code> / <code>deepcopy</code> 主动切断共享。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
