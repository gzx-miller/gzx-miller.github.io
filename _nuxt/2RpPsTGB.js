const o=`<script setup lang="ts">
import CPP19LambdaExpressions from './CPP19LambdaExpressions.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只是想让一串数字从大到小排，需要告诉 <code>std::sort</code>「谁该排在前面」。为了这一个判断，你不得不在文件另一头另外起一个命名函数 <code>bool cmp(int a, int b) { return a &gt; b; }</code>，再回到调用处把函数名填进去——参数和实现隔了半个文件，只为一个只用一次的小逻辑，为什么要写一个如此「正式」的函数？
    </div>

    <h2>行为参数化引入</h2>
    <p>
      你要做的是把一段「行为」——比如「怎么比大小」「收到数据后干什么」——当成参数交给别人：交给算法做谓词，交给回调稍后调用，交给线程让它在另一边执行。最朴素的老办法是写命名函数，或者写一个函数对象（重载了 <code>operator()</code> 的类）。它能跑，但成本都落在你身上：
    </p>
    <ul>
      <li><strong>样板太多</strong>：一个只用一次的比较逻辑，要郑重其事地写成一个函数或一整个类，代码主体被这层壳包住。</li>
      <li><strong>够不着现场变量</strong>：命名函数看不见调用点的局部变量，想用只能靠额外传参，或干脆开个全局变量去藏。</li>
      <li><strong>污染名字</strong>：一堆「只活一个调用点」的小函数占着文件里的正式名字，读代码时很难分辨谁重要。</li>
      <li><strong>调用点与定义点分离</strong>：想改这段行为，得先想起它在哪儿定义，再跳过去改，来回折腾。</li>
    </ul>
    <p>
      所以要问的是：<strong>能不能就在使用的地方，把这段「行为」直接写出来、连同它要用到的现场变量一起交给别人？</strong>
    </p>

    <h2>命名函数充当谓词</h2>
    <p>
      先照老办法来：写一个命名函数或函数对象传进去，比如 <code>std::sort(v.begin(), v.end(), cmp)</code>。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它承认「行为」本身也是一种可以传递的值</strong>——算法不关心你给的是一个函数、一个对象还是别的什么，只要它能被「调用」，就能拿来用。这一步是后面一切的前提；缺的只是「写的成本太高」和「看不见现场变量」这两点。
    </p>

    <h2>局部变量访问缺口</h2>
    <ul>
      <li>要为一个表达式级的逻辑写一整段函数定义，读的时候眼睛得在两个地方来回跳。</li>
      <li>命名函数够不到调用点的局部变量，像「按当前这个 <code>factor</code> 去乘」这种需求，只能靠传参曲线救国。</li>
      <li>函数对象虽然能通过成员变量带上状态，但你得先写一个类、定义构造、重载运算符，样板更长。</li>
      <li>散落的小函数挤占了命名空间，越写越难分辨哪些才是真正的业务接口。</li>
    </ul>

    <h2>就地定义匿名函数</h2>
    <p>
      先补最核心的一步：<strong>把行为就地写出来</strong>。这就是 lambda：<code>[](int a, int b) { return a &gt; b; }</code> 可以直接塞进 <code>std::sort</code> 的第三个参数，不用再另起名字。它的完整语法是 <code>[capture](params) -&gt; ret { body }</code>——中括号里是捕获列表，圆括号是参数，箭头后面是返回类型，最后是函数体。
    </p>
    <p>
      这里要先认清一个事实，它解释了后面所有细节：<strong>lambda 根本不是「函数」，而是编译器替你生成的一个匿名函数对象的语法糖</strong>。每写一个 lambda，编译器就生成一个带 <code>operator()</code> 的类，并给它一个<strong>独一无二的类型</strong>。所以两个长得一模一样的 lambda 也是两种不同类型——你要用它，通常就用 <code>auto</code> 接住；要是想把它存进容器或当统一接口，才用 <code>std::function</code> 把类型擦掉。
    </p>
    <p>
      接着补「怎么够到外面的现场变量」——这正是命名函数做不到的，靠<strong>捕获列表</strong>解决。它要回答两个问题：捕获哪些变量、以什么方式捕获。
    </p>
    <ol class="lesson-steps">
      <li><strong>值捕获</strong> <code>[factor]</code>：把变量<strong>创建 lambda 那一刻的副本</strong>拷进去，之后外部怎么改都不影响它。</li>
      <li><strong>引用捕获</strong> <code>[&amp;total]</code>：只记一个引用，lambda 里改的就是外部那个变量本身（所以它常用来「累加进外部结果」）。</li>
      <li><strong>默认捕获</strong> <code>[=]</code> 值捕获、<code>[&amp;]</code> 引用捕获，把用到的自动存储期变量统统收进来。</li>
    </ol>
    <p>
      这里有个容易绊住人的边界：<strong>值捕获进来的变量，在 lambda 里默认是 <code>const</code> 的，不能改</strong>。想让 lambda 内的副本可变，要加 <code>mutable</code>——但要记住，改的始终是那份<strong>副本</strong>，外部的原变量纹丝不动。
    </p>
    <p>
      再补上第一个真正危险的坑：<strong>引用捕获不延长被捕获变量的寿命</strong>。如果你把一个引用捕获的 lambda 存起来、当回调注册、或作为返回值带出作用域，那么等原变量销毁之后再调用它，访问的就是已经不存在的东西——悬垂引用，未定义行为。判断标准只有一条：<strong>被引用捕获的变量，生命周期必须长于 lambda 本身</strong>。要让它「逃出」当前作用域，就改用值捕获，或下面要说的初始化捕获。
    </p>
    <div class="lesson-box warn">
      <strong>默认捕获别懒得写：</strong><code>[=]</code> 和 <code>[&amp;]</code> 看起来最省事，但它会把你<strong>实际用到</strong>的所有自动变量都捕获进来。这既可能悄悄捕获一个大对象（白白拷贝一遍、性能受损），也可能在成员函数里把 <code>this</code> 一起带进 lambda，埋下同一个生命周期隐患。工程上更稳妥的做法是<strong>显式列出真正需要的捕获项</strong>，让「这个 lambda 依赖了什么」一眼可见。
    </div>
    <p>
      再补「把资源搬进去」的需求。有些东西（比如 <code>unique_ptr</code>）只能移动、不能拷贝，普通的 <code>[x]</code> 值捕获拷不动它。C++14 的<strong>初始化捕获</strong>解决了这个问题：<code>[vec = std::move(oldVec)]() { ... }</code>，在捕获的同时用一个新名字接住它，正好把所有权一次性转移进 lambda——这也是「把资源安全交出去」的标准写法。
    </p>
    <p>
      最后补「一个 lambda 服务多种类型」。C++14 的<strong>泛型 lambda</strong> 允许参数写 <code>auto</code>：<code>[](auto a, auto b) { return a + b; }</code>，同一个 lambda 拿 <code>int</code> 调、拿 <code>double</code> 调都行。C++20 更进一步给了<strong>模板 lambda</strong>，可以用显式模板参数列表 <code>[]&lt;typename T&gt;(T x) { ... }</code> 来写，比单纯用 <code>auto</code> 更能做精确的类型约束与推导。
    </p>

    <h2>捕获列表与可见范围</h2>
    <figure class="lesson-figure">
      <figcaption>对着代码和捕获列表看：<code>[]</code>、<code>[factor]</code>、<code>[&amp;total]</code>、<code>[=]</code>、<code>[&amp;]</code>、<code>[this]</code> 各能看见什么、改得动什么——重点看值捕获的那份副本与外部变量如何互不影响。</figcaption>
      <CPP19LambdaExpressions />
    </figure>

    <h2>匿名可调用对象</h2>
    <p>
      lambda 把一段行为变成「就地可写、随手可传、还能带上现场变量」的匿名可调用物，它的真身是编译器生成的一个函数对象类型。写捕获时先问自己一句：<strong>这份数据要不要陪着 lambda 一起活下去？</strong>要，就用值捕获或初始化捕获；不要、且确定它的寿命足够长，才用引用捕获。默认捕获能少写几个字，但也顺手藏起了你真正依赖的东西。
    </p>
    <div class="lesson-term">
      <span class="term-name">「捕获列表」</span>是 lambda 开头的那个中括号，规定它能访问哪些外部局部变量、以何种方式访问：值捕获 <code>[x]</code> 取的是创建时的<strong>副本</strong>，引用捕获 <code>[&amp;x]</code> 取的是<strong>引用</strong>，<code>[=]</code> 与 <code>[&amp;]</code> 则是分别按值、按引用捕获所有用到的自动变量。边界：值捕获的变量在 lambda 内默认为 <code>const</code>，要修改得加 <code>mutable</code>，且改的只是副本；引用捕获<strong>不延长</strong>被捕获变量的生命周期，lambda 若活得比变量久，调用它就是悬垂引用与未定义行为——此时应改用值捕获或 <code>[obj = std::move(src)]</code> 这样的初始化捕获。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
