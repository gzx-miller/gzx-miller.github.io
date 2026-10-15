<script setup lang="ts">
import J06PrototypeClass from './J06PrototypeClass.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>要是每门课程实例都自带一份自己的 <code>summary</code> 方法，创建一千门课，内存里就多了一千份一模一样的函数；同事说方法该定义在原型上共享，可实例代码里明明没有这个方法，调用时却能找得到，究竟是谁在背后兜着？
    </div>

    <h2>方法放在原型上</h2>
    <p>
      构造函数里给每个实例都挂一份方法，是最容易想到的写法：<code>function Course(title) { this.title = title; this.summary = function () {} }</code>。它做对了一件事——每个实例都能拿到自己的 <code>summary</code>，互不干扰。
    </p>
    <p>
      可代价是每个实例都存了一份独立的函数。方法的行为对所有实例都一样，没必要一人一份。于是把它挪到 <code>Course.prototype</code> 上：所有实例<strong>共享同一个函数</strong>，却仍然能通过 <code>this</code> 读到各自的 <code>title</code>。这就是「实例属性各自持有、方法定义在原型上共享」的分工。
    </p>

    <h2>顺着原型链查找</h2>
    <p>
      共享带来了新疑问：实例自己没存 <code>summary</code>，为什么 <code>course.summary()</code> 还能调到？因为每个对象都藏着一个内部原型链接，读取属性时，引擎先查对象自身，没有就顺着这条链接去它的原型上找，再没有就继续往上，直到链条尽头。这条路径就是<strong>原型链</strong>。
    </p>
    <p>
      查找<strong>找到就停</strong>，所以近处的属性会<strong>遮蔽</strong>远处的：给某个实例单独设一个同名属性，它就会盖住原型上的那一份，而不影响别的实例。判断一个属性是自身的还是继承来的，用 <code>Object.hasOwn</code>；查看原型用 <code>Object.getPrototypeOf</code>。
    </p>

    <h2>new 到底做了什么</h2>
    <p>
      那 <code>new Course('异步')</code> 又做了哪些事？一共四步：
    </p>
    <ul>
      <li>创建一个新的空对象。</li>
      <li>把它的内部原型指向构造函数的 <code>prototype</code>。</li>
      <li>把 <code>this</code> 指向这个新对象并执行构造函数体，于是 <code>this.title</code> 落到了实例上。</li>
      <li>如果构造函数显式返回一个对象，就用那个对象；否则返回这个新对象。</li>
    </ul>
    <p>
      <code>instanceof</code> 的判断依据也在这里：它检查右侧的 <code>prototype</code> 是否出现在左侧对象的原型链上。所以 <code>p instanceof Point</code> 为真，是因为 <code>Point.prototype</code> 真的在 <code>p</code> 的原型链里。
    </p>

    <h2>class 语法的封装</h2>
    <p>
      逐个往 <code>prototype</code> 上挂方法很啰嗦，<code>class</code> 把这一套包成了更整洁的写法，本质仍是原型继承。<code>constructor</code> 负责初始化；类里写的方法会自动放到 <code>prototype</code> 上共享。
    </p>
    <p>
      继承用 <code>extends</code>：它把子类的原型链接到父类上，于是 <code>live instanceof Course</code> 成立。子类构造函数里<strong>必须先调用 <code>super()</code></strong> 才能用 <code>this</code>，因为父类那部分初始化得先跑完；子类方法里也可以用 <code>super.方法()</code> 复用父类实现。加 <code>static</code> 的成员则挂在<strong>类本身</strong>上，属于「类」而不是「实例」。
    </p>
    <p>
      此外，<code>class</code> 还有几样 <code>prototype</code> 写法没有的便利：<strong>实例字段</strong>直接写在类体里；以 <code>#</code> 开头的<strong>私有字段</strong>只有类内部能访问，外部读写都会报错；<code>get</code> 与 <code>set</code> 访问器能让「读一个属性」和「写一个属性」背后各跑一段逻辑。
    </p>

    <h2>组合优于深继承</h2>
    <p>
      继承很顺手，但也容易过头：为了复用几个方法，一层层往下派生出 <code>A → B → C → D</code>，改一处父类，所有后代都跟着震。判断该不该继承，看的其实是关系——「是一个」才继承，「有一个」该组合。
    </p>
    <p>
      组合的做法是把能力拆成独立的函数或对象，按需拼装：<code>Object.assign(Object.create(null), canSwim, canFly)</code>，谁需要什么就装配什么，不必为了拿到一个能力而背上整条继承链。层级变浅，改动范围也就变得可控。
    </p>

    <h2>看实例共享方法</h2>
    <figure class="lesson-figure">
      <figcaption>观察方法定义在 prototype 上被所有实例共享，以及 class 继承如何复用父类的实现。</figcaption>
      <J06PrototypeClass />
    </figure>

    <h2>原型链的尽头</h2>
    <p>
      从构造函数到 class，JavaScript 的对象模型一直是同一套：属性先找自身，再顺原型链往上；方法放原型上共享，数据留实例上各自持有；<code>new</code> 负责把新对象接进这条链，<code>class</code> 只是它更好看的写法。想清楚这条链，继承与共享就不再神秘，也能在需要时果断改用组合。
    </p>
    <div class="lesson-term">
      <span class="term-name">「原型链」</span>指对象之间通过内部原型链接（<code>[[Prototype]]</code>）串联起来的查找路径。读取属性时先查对象自身，未命中则沿链向上查找，最近者遮蔽远处者；<code>new</code> 会把新对象的原型指向构造函数的 <code>prototype</code>，<code>instanceof</code> 也正是检查 <code>prototype</code> 是否在该对象的原型链上。
    </div>
  </LessonArticle>
</template>
