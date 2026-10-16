<script setup lang="ts">
import PY13Dataclasses from './PY13Dataclasses.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>定义了一个课程类，只声明了 <code>title: str = '未命名'</code> 和 <code>hours: int = 12</code> 两行字段，却在上方加了一行 <code>@dataclass</code>。之后 <code>repr(course)</code> 能打出完整内容、<code>course == other</code> 也能按字段相等——可你从没写过 <code>__init__</code>、<code>__repr__</code>、<code>__eq__</code>。这些方法是谁替你写的？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      要存一门课程的数据，手写一个类是最直接的：在 <code>__init__</code> 里把每个字段逐一赋值，再顺手写个 <code>__repr__</code> 方便调试打印。字段就两三个时，抄一遍也就过去了。
    </p>
    <p>
      但字段一多，这份「样板」就显出笨重：<code>__init__</code> 里十几行赋值几乎是把字段名重复三遍（参数、属性、值），<code>__repr__</code> 又是类似的一长串，想按内容比较还得再写 <code>__eq__</code>。更糟的是，加一个字段就得同步改这几处，漏掉一个就出 bug。这些代码毫无技术含量，却占据了类的绝大部分篇幅。
    </p>

    <h2>@dataclass：自动生成 __init__/__repr__/__eq__</h2>
    <p>
      <code>@dataclass</code> 专门用来消除这份样板。只要在类上标一行装饰器，并把字段写成<strong>带类型注解的类属性</strong>，装饰器就会在幕后替你生成三件套：
    </p>
    <ul>
      <li><code>__init__</code>：按字段声明顺序接收参数并赋值。</li>
      <li><code>__repr__</code>：形如 <code>Course(title='...', hours=12)</code>，调试时一目了然。</li>
      <li><code>__eq__</code>：按字段内容逐一比较，两个字段相同的对象就相等。</li>
    </ul>
    <p>
      于是类体里只剩下「有哪些字段」这一件事，意图被表达得干净利落。源码变短了，可读性反而变高了。
    </p>

    <h2>字段默认值与 field(default_factory=...)</h2>
    <p>
      字段可以直接给默认值，写法就是普通的赋值：<code>hours: int = 12</code>，省略该参数时用它。注意顺序规则：<strong>有默认值的字段必须排在没有默认值的字段之后</strong>，否则会有「后面的必填参数无法跳过」的矛盾，装饰器会直接报错。
    </p>
    <p>
      当默认值是<strong>可变对象</strong>（列表、字典）时，不能写成 <code>tags: list = []</code>。回顾函数默认参数那一课：可变默认值会在定义时创建一次、被所有实例共享。正确做法是改用 <code>field(default_factory=list)</code>，让每次构造对象时<strong>当场调用这个工厂</strong>生成一份新对象，从而彼此独立。
    </p>

    <h2>frozen：让实例不可变</h2>
    <p>
      数据类常常用来表示「不该被随意改动」的取值对象，比如坐标、配置、金额。给装饰器加上参数 <code>@dataclass(frozen=True)</code>，生成的实例就变成<strong>只读</strong>：构造完成后任何 <code>course.title = ...</code> 的赋值都会抛 <code>FrozenInstanceError</code>。
    </p>
    <p>
      不可变带来的好处是可预测：对象一旦建好就不会被篡改，可以放心地当字典键、放进集合，也便于在并发场景里共享。代价是「修改」得换成「构造一个新对象」，这在不少数据流风格里反倒更清晰。
    </p>

    <h2>字段顺序规则与类型注解</h2>
    <p>
      数据类的字段靠<strong>类体里的变量注解</strong>识别：只要写了 <code>name: str</code> 这样的注解，它就被认作一个字段。这带来几条实用规则：
    </p>
    <ol class="lesson-steps">
      <li>没有默认值的字段写在前，有默认值的写在后。</li>
      <li>不写注解的普通类属性不会被当作字段，因此不会进 <code>__init__</code>。</li>
      <li>顺序即 <code>__init__</code> 的位置参数顺序，也即 <code>__repr__</code> 的展示顺序。</li>
    </ol>
    <p>
      顺带一提，注解本身在运行期<strong>不做强制校验</strong>，它的价值在于配合编辑器和静态检查工具，在写代码阶段就发现字段类型不一致。数据类恰好把「声明式的字段定义」和「类型注解」这两件事捆在了一起。
    </p>

    <h2>典型使用场景</h2>
    <p>
      数据类适合表达「主要用来装数据、少有复杂行为」的东西：
    </p>
    <ul>
      <li>配置项、数据模型、传输对象——字段多、样板多，收益最大。</li>
      <li>函数返回值用一个小对象承载，比裸元组更可读。</li>
      <li>配合 <code>asdict()</code> 快速转成字典，便于序列化或打印。</li>
      <li>需要不可变语义时，用 <code>frozen=True</code> 一档搞定。</li>
    </ul>
    <p>
      反之，若一个类有大量自定义行为、复杂的状态转换，手写类往往更合适——数据类不是万能模板，它擅长的是把「数据形状」表达清楚。
    </p>

    <h2>看一遍手写类与数据类的对照</h2>
    <figure class="lesson-figure">
      <figcaption>改一改 <code>title</code> 的取值，看两侧 <code>repr</code> 的输出；再切换「使用默认值」和「frozen」，观察默认值如何生效、以及 frozen 打开后赋值为何会报错。</figcaption>
      <PY13Dataclasses />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      数据类用一行 <code>@dataclass</code> 换掉了手写的 <code>__init__</code>、<code>__repr__</code>、<code>__eq__</code> 样板，字段以带注解的类属性声明。默认值要留意顺序规则，可变的默认值改用 <code>field(default_factory=...)</code>。<code>frozen=True</code> 提供不可变语义，<code>asdict()</code> 便于转字典。它最擅长表达「以装数据为主」的对象，让字段形状一目了然。
    </p>
    <div class="lesson-term">
      <span class="term-name">「数据类」</span>指用 <code>@dataclass</code> 装饰、以带类型注解的类属性声明字段，并由装饰器自动生成 <code>__init__</code>、<code>__repr__</code>、<code>__eq__</code> 等方法的类。边界与例外：可变字段的默认值必须用 <code>field(default_factory=...)</code> 提供；字段顺序受「有默认值的字段须在后」约束，违反会直接报错。
    </div>
  </LessonArticle>
</template>
