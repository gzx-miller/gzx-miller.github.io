<script setup lang="ts">
import J05ThisBinding from './J05ThisBinding.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个方法，写成 <code>teacher.introduce()</code> 能正确打印讲师姓名，可把它取出来存进变量再调用、或者交给定时器延后执行，<code>this.name</code> 就变成了 <code>undefined</code>——this 到底听谁的？
    </div>

    <h2>提出问题</h2>
    <p>
      你有一个讲师对象，身上有名字和一个自我介绍的 <code>introduce</code> 方法，方法体里用 <code>this.name</code> 取当前讲师的名字。现在需求来了：点击按钮时显示这句话，或者延迟一秒后显示。
    </p>
    <p>
      你很自然地就把这个方法交给了别人去调用——传给定时器、传给事件监听、传进数组的遍历方法。结果输出里 <code>this.name</code> 读出来是 <code>undefined</code>，名字丢了。代价是：方法一旦离开它所属的对象就失去上下文，你只能靠把对象整体包一层来绕开，而每次绕开都意味着多写一层嵌套函数；更麻烦的是，这类错误不会在写代码时暴露，只在运行时某一个分支下出现，排查时错误位置还常常指向方法内部某一行，让人以为是数据的问题。这里真正需要的，是搞清楚<strong>「this 是什么」到底由谁决定</strong>。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：干脆不用 <code>this</code>，把需要的数据当参数显式传进去。写成 <code>function introduce(teacher) { ... }</code>，函数内部一律用 <code>teacher.name</code> 取值。
    </p>
    <p>
      这个方案做对了一件很重要的事：<strong>它把「操作哪个对象」变成了显式信息</strong>，没有任何隐式上下文，读代码的人一眼就能看出这句话描述的是谁，行为完全可预测。这份确定性应该保留。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>每次调用都要把整个对象当参数传进去，方法用到几个字段就得准备几个参数，调用点会越写越长。</li>
      <li>函数拿不到「是谁在调用我」这层信息，一份通用实现没法直接被不同对象复用，每个调用点都得自己声明身份。</li>
      <li>面向对象的写法里，方法本来就应该知道自己挂在哪个对象上，用参数传等于把这份责任推给了每一个调用者。</li>
      <li>只要有一个调用点忘了传参，方法内部立刻读到 <code>undefined</code>，而报错位置在方法里面，排查方向容易被带偏。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先接受一条规则：<strong>普通函数的 <code>this</code> 不在定义时决定，而在调用时根据调用表达式的形式决定</strong>。判断方法就是回头看调用处。以「对象.方法()」的形式调用时，<code>this</code> 就是点号左边那个东西；写成独立的 <code>函数()</code> 形式调用时，严格模式下 <code>this</code> 是 <code>undefined</code>，非严格模式下退化成全局对象。换句话说，函数定义在哪个对象里面完全不影响 <code>this</code>，它并不指向所谓的「父对象」——这个误传的直觉，是绝大多数 this 问题的根源。
    </p>
    <p>
      有了这条规则，「把方法传出去为什么会坏」就一目了然了。写 <code>const detached = teacher.introduce</code> 取到的只是函数本身，之后 <code>detached()</code> 是一次独立调用，点号消失了，<code>this</code> 也就跟着没了。定时器回调、事件监听、<code>map</code> / <code>filter</code> 里传入的方法，全部属于这种「脱离对象」的调用，问题自然集中出现在这些地方。
    </p>
    <p>
      需要显式指定接收者时，用 <code>call</code> 与 <code>apply</code>：两者都是「立即调用，并把第一个参数当作 <code>this</code>」，区别只是其余参数一个逐个传、一个用数组传。如果希望先造出一个函数、以后再调用，就用 <code>bind</code>——它把 <code>this</code> 永久锁在给定的值上，之后无论怎么调用都不变。类方法单独作为回调传参时同样会丢失绑定，正是靠 <code>bind</code> 或换个写法修正。
    </p>
    <p>
      另一条路是箭头函数：它<strong>没有自己的 <code>this</code></strong>，而是捕获定义时所在函数作用域的 <code>this</code>，并且这个值在定义的那一刻就锁定，之后用 <code>call</code> / <code>apply</code> 也改不动它。所以在「某个方法内部定义回调」的场景里，箭头函数最省事——它天然继承这个方法被调用时的 <code>this</code>，正好是我们想要的那个对象。反过来说，箭头函数不适合直接写成对象上的方法字面量，因为那时它捕获的是外层作用域，通常并不是这个对象本身。
    </p>
    <p>
      把判断顺序固定下来，这类问题基本就不再靠猜：先找调用表达式，看它长什么样。用 <code>new</code> 调用，<code>this</code> 是新建出来的那个对象；用 <code>call</code> / <code>apply</code> / <code>bind</code> 调用，<code>this</code> 是指定的值；以「对象.方法()」形式调用，<code>this</code> 是点号左边；什么修饰都没有的独立调用，严格模式下是 <code>undefined</code>。而箭头函数忽略以上全部，永远使用定义时捕获的外层 <code>this</code>。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>先点「作为方法调用」，再点「显式绑定调用」，对比两次结果里的 this.name 分别来自哪个对象。</figcaption>
      <J05ThisBinding />
    </figure>

    <h2>总结</h2>
    <p>
      this 绑定要解决的，是让方法在调用时知道该为哪个对象工作；它的值由调用方式决定而非定义位置，箭头函数则是唯一在定义时就把它锁定下来的例外。
    </p>
    <div class="lesson-term">
      <span class="term-name">「this 绑定」</span>指普通函数的 <code>this</code> 在调用时才确定，取决于调用表达式本身：<code>new</code> 调用指向新建的对象；<code>call</code> / <code>apply</code> / <code>bind</code> 指向显式指定的值；以「对象.方法()」形式调用指向该对象；独立调用在严格模式下为 <code>undefined</code>。箭头函数没有自己的 <code>this</code>，捕获定义时外层作用域的值且之后无法被改变。
    </div>
  </LessonArticle>
</template>
