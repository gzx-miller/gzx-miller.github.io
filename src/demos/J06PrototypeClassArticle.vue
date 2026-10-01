<script setup lang="ts">
import J06PrototypeClass from './J06PrototypeClass.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>三个课程实例都能调用同一个 <code>summary()</code>，可你从来没有在任何一份实例对象上写过这个方法——它到底存放在哪里？
    </div>

    <h2>实例方法共享需求</h2>
    <p>
      你在写一个课程模型：每节课都有标题、课时，以及一段「标题 · 课时」形式的简介。页面上一千节课就是一千个实例，而这段简介的逻辑对每一节课都完全一样。
    </p>
    <p>
      如果每个实例都自带一份简介函数，就等于把同一段函数体复制了一千遍，内存被白白占掉，而且每改一次格式，都要重新创建所有实例才能生效。还有一种更常见的麻烦：这节课和「直播课」唯一的差别是简介前面多一个前缀，如果靠复制构造函数里的初始化代码来实现，两边会从此各自演化，改一处忘一处。所以这里需要一种结构，能<strong>让多个对象共享同一份行为，同时各自持有自己的数据</strong>。
    </p>

    <h2>构造函数挂载方法</h2>
    <p>
      最直接的做法：用构造函数初始化实例，并在构造函数里给每个实例挂上方法。写 <code>function Course(title, hours) { this.title = title; this.summary = function () { ... } }</code>，然后用 <code>new</code> 创建对象。
    </p>
    <p>
      这个方案做对了一件事：<strong>每个实例都能调用自己的 <code>summary()</code>，行为确实跟着实例走</strong>，调用形状也和后来 class 的写法一致。方向没问题，问题在于「把方法挂在实例上」这个选择。
    </p>

    <h2>内存随实例线性上涨</h2>
    <ul>
      <li>方法体是每个实例各自一份副本，实例越多重复的函数越多，内存占用随实例数量线性上涨。</li>
      <li>数据字段和行为混在同一层，从对象上打印出来分不清哪些是状态、哪些是能力。</li>
      <li>想给所有实例统一增加一个能力，就得回头改构造函数并重新创建全部实例，已经在页面里运行着的实例拿不到。</li>
      <li>想做「直播课 = 课程 + 额外简介方式」这种分层，只能靠把父级构造函数里的初始化代码复制一遍。</li>
    </ul>

    <h2>原型挂载共享行为</h2>
    <p>
      改进的第一步是分工：<strong>把实例自己该有的字段留在构造函数里，把行为搬到 <code>prototype</code> 上</strong>。当对象在自身找不到某个属性时，会顺着内部的 <code>[[Prototype]]</code> 链接去它的原型上继续找，还找不到就再往上找一层，直到链的尽头。整条链上的方法被所有实例共享——一份代码谁都调得到，第一条不足就此解决。
    </p>
    <p>
      这同时解释了一个很直观的现象：往原型上后加一个方法，所有已经存在的实例马上就能用。因为查找发生在调用的时候，走的是同一条链，实例并不需要被重建。而「数据和能力混在一起」的问题也有了明确答案：实例自身的属性用 <code>hasOwnProperty</code> 就能判断出来，能调用的方法则都在原型上，「数据放实例、方法放原型」就是这套分工。
    </p>
    <p>
      <code>class</code> 语法的出现，是给这套机制换一层更清楚的写法。<code>class Course</code> 里的 <code>constructor</code> 负责初始化实例字段，写在 <code>constructor</code> 之外的方法其实就落在 <code>prototype</code> 上，<code>new</code> 负责创建对象并调用构造函数。<code>extends</code> 把子类的原型链接到父类，子类实例查不到的东西会继续往父类原型上找；<code>super</code> 用来调用父类的构造函数，或者调用同名的父类方法——「直播课在父类简介前面加个前缀」正是这种用法。底层机制一点没变，<code>class</code> 只是让声明与继承的意图更清楚，顺手省掉几行样板代码。
    </p>
    <p>
      顺带就能说清 <code>instanceof</code>：它沿着原型链一路向上找，只要在链上遇到某个构造函数的 <code>prototype</code>，就返回真。所以子类实例同时「是」子类也是父类的实例。调试时想知道某个方法究竟定义在哪一层，可以用 <code>Object.getPrototypeOf()</code> 沿链向上确认。这里还藏着<strong>属性遮蔽</strong>：给实例写一个与原型同名的属性，之后查到的会是实例自己那一份，原型上的并没有消失，只是被挡住了。
    </p>
    <p>
      实践中还有两条边界值得记住。第一，<strong>优先组合而不是把继承拉得很深</strong>：继承层数一多，一个属性从哪儿来要靠翻好几层，行为也容易被某一层悄悄覆盖，把能力拆成独立对象再组合进来通常更灵活、副作用更少。第二，需要真正私有、外部完全访问不到的字段时，用 <code>#name</code> 语法，它不参与原型共享，每个实例各自一份。此外 <code>Object.create</code> 能按指定原型直接创建对象、<code>Object.setPrototypeOf</code> 能事后改写原型，它们让这条链可以被手动操控，但改写已有对象的原型会影响后续所有查找路径，用的时候要格外谨慎。
    </p>

    <h2>继承链方法调用</h2>
    <figure class="lesson-figure">
      <figcaption>看实例调用的简介方法其实来自父类原型，而子类用 super 在它前面又追加了「直播课」前缀。</figcaption>
      <J06PrototypeClass />
    </figure>

    <h2>行为共享委托机制</h2>
    <p>
      原型链解决的，是多个对象如何共享同一份行为：数据各自持有、方法挂在链上共享，而 class 与 extends 只是这套委托机制更好看的外衣。
    </p>
    <div class="lesson-term">
      <span class="term-name">「原型链」</span>指对象通过内部 <code>[[Prototype]]</code> 链接逐层向上查找属性的机制：自身没有的属性会去原型上找，链上的方法被所有实例共享。<code>class</code> 与 <code>extends</code> 是基于原型委托的语法封装，方法定义在 <code>prototype</code> 上；<code>instanceof</code> 沿链判断，属性遮蔽指实例自身属性优先于原型上的同名属性。实践中应优先组合而非过深的继承。
    </div>
  </LessonArticle>
</template>
