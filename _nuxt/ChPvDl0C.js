const o=`<script setup lang="ts">
import PY11Classes from './PY11Classes.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>有三个课程对象，都想共享同一个 <code>school</code> 名字。于是把 <code>school = '小松鼠学院'</code> 写进了类里，又在某个实例上调了一次 <code>course.school = '新名字'</code>。奇怪的是，另外两个实例身上的 <code>school</code> 却纹丝不动。同一个名字，怎么在两处表现不一样？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      要表示一门课程，最直接的办法是用字典：<code>{'name': 'Python 入门', 'hours': 12}</code>。几个字段、一下就能拼出来，读也行、改也行，小脚本里够用。
    </p>
    <p>
      数据一多就露出破绽：字典只是松散的一组键值，它不知道「课程」意味着什么，也无法把「加一学时」这类动作固定下来。于是每处都用 <code>course['hours'] += 1</code> 这样的裸操作，字段名写错、结构不一致全要到运行时才发现。数据和行为被拆散了，缺少一个把两者捆在一起的东西。
    </p>

    <h2>class 与 __init__、self</h2>
    <p>
      <code>class</code> 就是那个把<strong>数据</strong>和<strong>行为</strong>捆在一起的东西。类里定义一个特殊方法 <code>__init__</code>，它会在创建对象时自动被调用，用来把初始值放进对象：<code>Course('Python 入门', 12)</code> 一执行，<code>__init__</code> 就拿到这两个参数。
    </p>
    <p>
      <code>__init__</code> 的第一个参数是 <code>self</code>，代表<strong>正在被创建的那个对象</strong>。Python 调用时会自动把对象传进来，你只需写方法定义、不必在调用处手动传。<code>self.name = name</code> 的含义是「把这个对象自己的 <code>name</code> 设成传入的 <code>name</code>」。
    </p>

    <h2>实例属性与类属性</h2>
    <p>
      同样是写在类里的名字，位置不同，归属就不同：
    </p>
    <ul>
      <li><strong>实例属性</strong>：写在方法里、以 <code>self.x = ...</code> 的形式赋值，属于<strong>每个对象各自一份</strong>。改一个实例的属性，不影响别的实例。</li>
      <li><strong>类属性</strong>：直接写在类体里、不在任何方法内，属于<strong>类本身</strong>，被所有实例共享。读取时，各实例看到的是同一份。</li>
    </ul>
    <p>
      回到开场的怪事：当 <code>school</code> 是类属性时，<code>course.school = '新名字'</code> 这句赋值并<strong>不是</strong>去改类上那份，而是<strong>在实例自己身上新建了一个同名属性</strong>，把它盖住。别的实例没有这个新属性，读取时依旧落到类属性上，于是看起来「纹丝不动」。这也正是「读共享、写独占」这条微妙规则的由来。
    </p>

    <h2>实例方法，以及为什么方法要 self</h2>
    <p>
      定义在类里、第一个参数是 <code>self</code> 的函数就是<strong>实例方法</strong>。它通过 <code>obj.method()</code> 调用时，Python 会悄悄把 <code>obj</code> 绑到 <code>self</code> 上。所以方法体里能直接读写 <code>self</code> 上的属性，把「操作」和「数据」自然连起来。写方法时忘了 <code>self</code>，调用时就会因为参数对不上而报错。
    </p>

    <h2>@classmethod 与 @staticmethod</h2>
    <p>
      除了实例方法，还有两种常见的变体，靠装饰器区分：
    </p>
    <ol class="lesson-steps">
      <li><code>@classmethod</code>：第一个参数是 <code>cls</code>（类本身），常用来写「替代构造器」，例如 <code>Course.from_dict(data)</code> 从字典造对象。</li>
      <li><code>@staticmethod</code>：没有 <code>self</code> 也没有 <code>cls</code>，纯粹是挂在类命名空间下的普通函数，tools 类的辅助方法适合这样放，与具体对象无关。</li>
    </ol>
    <p>
      何时用哪个也有直觉：需要访问或创建该类的实例时用 <code>classmethod</code>；只借用类的名字做归类、逻辑与对象无关时用 <code>staticmethod</code>；要读写某个对象自己的数据时用普通实例方法。
    </p>

    <h2>属性查找顺序与可变类属性陷阱</h2>
    <p>
      访问 <code>obj.attr</code> 时，查找顺序是：<strong>先实例的 <code>__dict__</code>，找不到再查类的属性，再找不到才顺着继承链往上找</strong>。这解释了很多现象：实例没设过就落到类属性上；一旦实例自己设过同名的，就挡住类的版本。
    </p>
    <p>
      由此要警惕一个著名陷阱：<strong>可变的类属性会被所有实例共享</strong>。比如把 <code>tags = []</code> 写在类体里，任意实例 <code>tags.append(...)</code> 改的都是同一份列表，所有实例都跟着变。想让每个对象各自拥有一份，就应在 <code>__init__</code> 里创建它，而不是依赖类属性。
    </p>
    <div class="lesson-box warn">
      <strong>常见误区：</strong>以为「实例上读到某个类属性」就等于「这个属性属于实例」。读到的值虽是共享的，但一旦在实例上赋值，就会新建实例属性、与类属性脱钩，之后二者各走各的路。
    </div>

    <h2>看一遍实例属性与类属性的差别</h2>
    <figure class="lesson-figure">
      <figcaption>在「实例属性」页签里给选中的课程加学时，注意其他课程岿然不动；切到「类属性」，改 <code>school</code> 或往共享的 <code>tags</code> 追加，观察所有实例同步变化。</figcaption>
      <PY11Classes />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      <code>class</code> 把数据与行为捆在一起，<code>__init__</code> 负责初始化、<code>self</code> 指向当前对象。写在 <code>self</code> 上的实例属性每个对象一份，写在类体里的类属性全体共享；属性查找先实例后类。用 <code>@classmethod</code> 访问类、用 <code>@staticmethod</code> 放无关工具、用普通方法读写自身数据。最后记牢：可变的类属性会被共享，每实例该独有的，请在 <code>__init__</code> 里创建。
    </p>
    <div class="lesson-term">
      <span class="term-name">「实例属性」</span>指绑定在某个具体对象上的属性，通常由 <code>__init__</code> 中以 <code>self.x = ...</code> 的形式建立，各实例互不影响。边界与例外：读取属性时会先查实例再查类，因此类属性在未被实例覆盖时可被共享读取；一旦在实例上对同名属性赋值，便新建实例属性而与类属性脱钩。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
