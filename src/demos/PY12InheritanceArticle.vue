<script setup lang="ts">
import PY12Inheritance from './PY12Inheritance.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>给 <code>Dog</code> 和 <code>Cat</code> 都写了各自的 <code>speak</code> 方法，然后用一个循环 <code>for a in animals: a.speak()</code> 统一调用。代码里没有任何 <code>if</code> 判断 <code>a</code> 到底是狗还是猫，可每个对象偏偏都叫出了正确的声音。是谁替这段循环做了分类？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      一开始，每种动物各写一个类，各自实现自己的 <code>speak</code>，互不相干。能跑，但共同的部分没法复用：名字、觅食、休息这些逻辑，狗、猫、鸟身上几乎一模一样，却要被各抄一份。改动一处，得记得改所有类。
    </p>
    <p>
      也可以反过来，用一个类加一大堆 <code>if</code>：<code>if type == 'dog': ... elif type == 'cat': ...</code>。这正是要摆脱的老路——每加一种新动物，就得回来改这个类的判断分支，类越写越臃肿，牵一发而动全身。
    </p>

    <h2>继承与 super()</h2>
    <p>
      继承把「共有的部分」提到父类，把「各自的差异」留在子类。写法是 <code>class Dog(Animal)</code>，表示 <code>Dog</code> 继承 <code>Animal</code>。父类里定义一次 <code>speak</code> 的通用版本，子类按需<strong>重写</strong>。没有重写的方法，子类对象可以直接沿用父类的实现。
    </p>
    <p>
      <code>super()</code> 的作用是「拿到父类的方法」，常用来在重写时<strong>先复用父类原版、再补充差异</strong>。比如狗在通用叫声之上补一声「汪汪」，写成 <code>return super().speak() + "汪汪"</code>，就避免了把父类的逻辑再抄一遍。
    </p>

    <h2>方法解析顺序 MRO</h2>
    <p>
      一个类可能同时继承多个父类，属性或方法该去哪找？Python 用<strong>方法解析顺序（MRO）</strong>定下一条固定的查找链。对多数情况，记住直觉就够：<strong>先子类自己，再按 MRO 依次往上找父类</strong>，沿途遇到第一个定义就采用。
    </p>
    <p>
      MRO 之所以存在，是为了在多继承下仍保证查找不重复、不歧义。想亲眼确认顺序，可以对类调用 <code>SomeClass.__mro__</code> 或 <code>SomeClass.mro()</code>，它会把查找链依次列出来。理解它的意义不在于背规则，而在于遇到多继承的怪行为时，能用它去解释。
    </p>

    <h2>多态与鸭子类型</h2>
    <p>
      <strong>多态</strong>说的是：不管对象的真实类型是什么，只要它们提供了同名的方法，调用方就能用同一句代码统一处理。这正解释了开场那个循环——它不关心 <code>a</code> 是谁，只管对它喊 <code>speak()</code>，各对象用自己的实现响应。
    </p>
    <p>
      更松弛的说法叫<strong>鸭子类型</strong>：「像鸭子一样叫、像鸭子一样走，那它就可以当鸭子用」。Python 不看对象的类是谁，只看它<strong>有没有需要的方法</strong>。于是两个毫无继承关系的类，只要都实现了 <code>speak</code>，也能被同一段代码平等对待。
    </p>

    <h2>魔术方法：让对象贴合语言习惯</h2>
    <p>
      <strong>魔术方法</strong>是名字被双下划线包住、由解释器在特定时机自动调用的方法。它们让自定义对象看起来像内建类型：
    </p>
    <ul>
      <li><code>__init__</code>：创建对象时初始化。</li>
      <li><code>__str__</code>：<code>print</code> 或 <code>str()</code> 时调用，面向使用者。</li>
      <li><code>__repr__</code>：<code>repr()</code> 时调用，面向开发者，理想情况下能用来重建对象。</li>
      <li><code>__eq__</code>：<code>==</code> 比较时调用，默认按身份比较，重写后可按内容比较。</li>
      <li><code>__len__</code>：<code>len()</code> 时调用，让对象具备「长度」。</li>
      <li><code>__add__</code>：<code>+</code> 运算时调用，让对象支持相加。</li>
    </ul>
    <p>
      重写好这几个，自定义对象就能自然地融入 <code>print</code>、比较、求和这些惯用写法，而不用额外记住一堆自定义方法名。
    </p>

    <h2>何时避免继承滥用</h2>
    <p>
      继承很顺手，但并非越多越好。它把子类<strong>永久绑</strong>在父类上：父类一改，所有子类都受牵连。若两个类只是「用到对方的一部分能力」而非「是一种」，用<strong>组合</strong>（把另一个对象作为属性持有）往往更稳。判断标准很朴素：真的是「is-a」关系才继承，只是「has-a」或「用得到」就组合。
    </p>
    <div class="lesson-box warn">
      <strong>常见误区：</strong>为了复用几行代码而强行造继承，会把无关的类捆在一起。层级一深，方法到底从哪来就变得难追；优先用组合，只在确属类型关系时才继承。
    </div>

    <h2>看一遍继承、多态与魔法方法</h2>
    <figure class="lesson-figure">
      <figcaption>在「继承与多态」里逐步点「下一步」，看 <code>super()</code> 如何复用父类行为、同一条调用如何落到不同对象；切到「魔法方法」，依次切换 <code>__str__</code> / <code>__repr__</code> / <code>__len__</code> / <code>__eq__</code> 看效果。</figcaption>
      <PY12Inheritance />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      继承把共性上提、差异下放，<code>super()</code> 让重写能复用父类原版，MRO 决定多继承下的查找顺序。多态与鸭子类型让同一句调用由不同对象各自响应，调用方无需判断类型。魔术方法则让自定义对象贴合 <code>print</code>、比较、长度、相加这些语言习惯。最后，继承只用在真正的「是一种」关系上，其余场合优先组合。
    </p>
    <div class="lesson-term">
      <span class="term-name">「多态」</span>指不同类的对象对同一方法调用作出各自的响应，调用方只依赖方法名、不依赖具体类型。边界与例外：Python 靠鸭子类型实现多态，只要对象具备所需方法即可参与；这也意味着方法名或签名不匹配时，错误要到运行时才会暴露。
    </div>
  </LessonArticle>
</template>
