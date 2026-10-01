<script setup lang="ts">
import CPP26ModernCppCore from './CPP26ModernCppCore.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了一个「把容器里每个数翻倍」的循环：<code>for (auto x : nums) x *= 2;</code>。循环跑完，你打印 <code>nums</code>，里面一个数都没变——<code>auto</code> 明明推断了类型，为什么改不动原数组？
    </div>

    <h2>提出问题</h2>
    <p>
      问题出在「让编译器替你写类型」这件事上。C++ 的类型名经常又长又难写：想遍历一个 <code>map</code> 要找 <code>std::map&lt;std::string, int&gt;::iterator</code>，lambda 的类型根本没法写出来；而且手写类型时几乎必然踩到别的坑——比如 <code>for (int i = 0; i &lt; v.size(); ++i)</code>，<code>size()</code> 返回的是无符号的 <code>size_t</code>，和 <code>int</code> 一比就弹出有符号/无符号比较的警告。
    </p>
    <p>
      于是现代 C++ 给了一条出路：<strong>让编译器从初始化表达式里把类型推出来</strong>。可一旦类型由编译器决定，「它到底推出了什么」就成了你必须知道的事——你写出来的只是 <code>auto x</code>，实际得到的可能是一个副本、一个 <code>const</code> 值，或者一个引用。推导规则不透明，代码就会背着你变味。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的用法：需要类型名的地方一律写 <code>auto</code>。<code>auto i = v.size();</code> 让 <code>i</code> 直接拿到 <code>size_t</code>，比较警告消失；<code>auto it = m.find(k);</code> 省掉了那串迭代器全名。
    </p>
    <p>
      这个方案做对了一件事：<strong>让变量类型和初始化它的表达式保持一致</strong>。你不再手抄一个可能抄错的类型名，而是让编译器照着右边推导——类型不会写反，将来改容器类型时左边也不用跟着改。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>for (auto x : nums) x *= 2;</code> 里的 <code>x</code> 是元素的<strong>副本</strong>，改的是副本，原数组纹丝不动——这正是开场那个「改不动」的根源。</li>
      <li><code>auto x = i;</code> 如果 <code>i</code> 是 <code>const int&amp;</code>，推导出的 <code>x</code> 却是普通的 <code>int</code>：<strong>顶层 <code>const</code> 和引用会被 <code>auto</code> 剥掉</strong>，你以为拿到了引用，其实做了一次拷贝。</li>
      <li><code>auto s = vec[0];</code> 当元素是昂贵的对象时，这一行会悄悄触发一次完整拷贝，代价被藏进了「看起来只是取个值」里。</li>
      <li><code>auto</code> 只能靠初始化表达式推导，所以<strong>不能声明「待会儿再赋值」的变量</strong>：<code>auto x;</code> 直接编译错误。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻 <code>auto</code>，而是承认「推导默认丢掉引用和 <code>const</code>」这个事实，然后按<strong>你想对元素做什么</strong>补上修饰符。你要修改元素，就写 <code>auto&amp;</code>；只读遍历，就写 <code>const auto&amp;</code> 免得拷贝；确实要一份独立副本，才写裸的 <code>auto</code>。这样「是拷贝还是引用」就在代码里明说了，而不是靠 <code>auto</code> 的默认行为替你决定。
    </p>
    <p>
      范围 <code>for</code> 本身也是这套思路的受益者：它底层调用 <code>begin()</code> 和 <code>end()</code>，所以<strong>任何提供这两个函数的对象都能遍历</strong>——普通数组、初始化列表、标准容器一视同仁。写法从「用下标加边界」变成「对每个元素做点什么」，边界算错的可能性顺势消失。
    </p>
    <p>
      接着补上 C++17 的<strong>结构化绑定</strong>：<code>for (const auto&amp; [key, value] : scores)</code> 直接把 <code>pair</code> 拆成两个有名字的变量，<code>auto&amp; [k, v] = *it;</code> 也一样。它和 <code>auto</code> 的引用规则是一回事——加不加 <code>&amp;</code>，决定你拿到的是视图还是副本。
    </p>
    <p>
      同一时期还有两处「让编译器在编译期替你把关」的特性，值得一起记。第一是<strong>统一初始化花括号 <code>{}</code></strong>：<code>int i{3.14};</code> 会直接编译报错，因为它<strong>禁止窄化转换</strong>，而 <code>int i = 3.14;</code> 只会静默把小数部分砍掉；花括号还能顺手初始化容器和动态数组。但要小心一个陷阱——<strong>如果类型有 <code>initializer_list</code> 构造函数，花括号会优先匹配它</strong>：<code>std::vector&lt;int&gt; v(10, 20)</code> 是十个值都为 20 的元素，<code>std::vector&lt;int&gt; v{10, 20}</code> 却是两个元素 10 和 20，只差一对括号，含义天差地别。第二是 <code>nullptr</code>：它有自己的类型 <code>std::nullptr_t</code>，取代 <code>NULL</code> 这种本质上是 <code>0</code> 的宏，避免了 <code>f(NULL)</code> 在 <code>f(int)</code> 和 <code>f(int*)</code> 之间选不出重载的二义性。另外，类型别名用 <code>using</code> 代替 <code>typedef</code>，语法更清晰，还能定义模板别名（<code>template &lt;typename T&gt; using Vec = std::vector&lt;T&gt;;</code>）。
    </p>
    <div class="lesson-box warn">
      <strong>两条最容易踩的线：</strong><code>auto</code> 推导时<strong>会剥掉顶层 <code>const</code> 和引用，但不会剥掉指针所指向对象的 <code>const</code></strong>（<code>const int* p</code> 用 <code>auto*</code> 推出后仍指向 <code>const int</code>）；另外范围 <code>for</code> 遍历时若在循环体里增删容器元素，会让 <code>begin()/end()</code> 持有的迭代器失效，这是另一类崩溃来源。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>对照看几种写法的实际效果：<code>for (auto&amp; elem : vec) elem *= 2;</code> 带着 <code>&amp;</code> 才真正改到原容器，<code>auto</code> 推成的迭代器省掉了冗长类型名，结构化绑定一次拆出 <code>name</code> 与 <code>score</code>，<code>nullptr</code> 则替代了 <code>NULL</code>。</figcaption>
      <CPP26ModernCppCore />
    </figure>

    <h2>总结</h2>
    <p>
      <code>auto</code> 的价值是「类型跟着初始化表达式走」，代价是它默认<strong>把引用和顶层 <code>const</code> 丢掉</strong>。于是用法只剩一条判断：你想要的是视图还是副本——要改就 <code>auto&amp;</code>，只读就 <code>const auto&amp;</code>，真要副本才写 <code>auto</code>。范围 <code>for</code>、结构化绑定、统一初始化和 <code>nullptr</code> 都朝同一方向：把类型与转换的判断，从「人手抄」挪到「编译器查」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「auto 类型推导」</span>用初始化表达式推导变量类型，规则与模板参数推导一致，默认<strong>按值推导，会剥掉引用与顶层 <code>const</code></strong>。要引用写 <code>auto&amp;</code>，要只读引用写 <code>const auto&amp;</code>，要保留 <code>const</code> 的值写 <code>const auto</code>。边界：<code>auto</code> 必须有初始化表达式，不能单独声明；它也不会替你补上所有权语义，<code>auto</code> 与 <code>auto&amp;</code> 仅差一个字符，效果却完全不同。
    </div>
  </LessonArticle>
</template>
