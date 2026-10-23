const n=`<script setup lang="ts">
import CPP01ProgramStructure from './CPP01ProgramStructure.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>语法写得挑不出毛病，编译器也从头到尾没报一句错，可最后生成可执行文件那一步却停在 <code>undefined reference to \`add(int, int)'</code> —— 明明定义了 <code>add</code>，为什么编译器「过」了、链接器却「不认」？
    </div>

    <h2>从源代码到可执行文件</h2>
    <p>
      你想要的是一个能跑的程序：双击它，屏幕上出现一行字。这件事听起来一步就能完成，可机器并不认识 <code>int main()</code>，它只认识一串机器码。中间这段翻译过程不是一次跳转，而是<strong>四段接力</strong>——预处理、编译、汇编、链接，每一段只负责把源文件往机器码推进一步。
    </p>
    <p>
      四段接力最容易被当成一步。很多人敲下 <code>g++ main.cpp -o main</code>，看到它直接吐出可执行文件，就以为编译是一个不可分割的动作。于是当错误出现时，也就分不清是「语法写错了」还是「某个定义没接上」，只能凭猜。
    </p>

    <h2>程序的骨架只有三样东西</h2>
    <p>
      先撇开过程，看一个 C++ 源文件里到底写了什么。剥掉全部细节，只剩三类成分：
    </p>
    <ul>
      <li><strong>预处理指令</strong>：以 <code>#</code> 开头，如 <code>#include &lt;iostream&gt;</code> 与 <code>#define</code>。它们在预处理阶段被当成文本处理，编译器真正读到的正文里已经没有它们。</li>
      <li><strong>函数</strong>：程序的执行单位。每个函数有名字、参数、返回类型和一段函数体。</li>
      <li><strong>语句与变量</strong>：函数体内的每一行，声明变量、做运算、调函数，以分号 <code>;</code> 结尾。</li>
    </ul>
    <p>
      这三样东西里，有一个函数是特殊的：<code>main</code>。操作系统启动程序时，<strong>只会去调用 <code>main</code></strong>，别的地方没有入口。也就是说，一个 C++ 程序可以没有别的任何函数，但不能没有 <code>main</code>——它决定了程序从哪一行开始跑。
    </p>

    <h2>main 的约定与返回值</h2>
    <p>
      最简的写法是：
    </p>
    <ul>
      <li><code>int main()</code>：无参版本，绝大多数控制台程序用它。</li>
      <li><code>int main(int argc, char* argv[])</code>：带参版本，<code>argc</code> 是命令行参数个数，<code>argv</code> 是参数字符串数组，供需要接收命令行的程序使用。</li>
    </ul>
    <p>
      返回类型是 <code>int</code> 而不是 <code>void</code>：<strong>这个返回值是「退出码」，交给操作系统</strong>。<code>return 0</code> 表示正常结束，非零表示异常退出。它会被脚本、CI、Shell 的 <code>&amp;&amp;</code> 用来判断上一条命令成功与否，所以别随手省略。
    </p>

    <h2>编译四阶段：每一段各管什么</h2>
    <p>
      现在回到那四段接力。拆开看，<code>g++ main.cpp -o main</code> 其实等于下面四步的合并，而每一步都可以单独执行、单独观察：
    </p>
    <ul>
      <li><strong>预处理</strong>：展开所有宏、把 <code>#include</code> 的头文件内容原地插入、删掉注释。产物是 <code>.i</code> 的纯文本，用 <code>g++ -E main.cpp -o main.i</code> 即可看到。</li>
      <li><strong>编译</strong>：把预处理后的正文翻译成汇编代码，同时做语法检查与类型检查。这一步报的是「语言层面的错」，产物是 <code>.s</code>，用 <code>g++ -S</code> 得到。</li>
      <li><strong>汇编</strong>：把汇编翻译成机器码，得到目标文件 <code>.o</code>（Windows 上是 <code>.obj</code>），用 <code>g++ -c</code> 只编译不链接。</li>
      <li><strong>链接</strong>：把所有目标文件和用到的库合并，解析「谁定义了、谁引用了」的符号关系，最后写出可执行文件。这一步才把 <code>main</code> 里对 <code>add</code> 的调用和别处对 <code>add</code> 的定义接上。</li>
    </ul>
    <p>
      关键在最后一步：编译阶段是<strong>单个源文件为单位</strong>做的，它只要求「用到的名字有声明」；至于这个名字的定义到底在不在、在哪个文件里，编译阶段一概不管——这正是 <code>undefined reference</code> 出现在链接阶段的原因。
    </p>

    <h2>分离「声明」与「定义」</h2>
    <p>
      既然编译只认声明、链接才认定义，工程里就顺势把它们拆到两个地方：
    </p>
    <ul>
      <li><strong>头文件</strong>（<code>.h</code> / <code>.hpp</code>）放声明：函数原型、类定义、常量声明，用 <code>#include</code> 被各处共享。</li>
      <li><strong>源文件</strong>（<code>.cpp</code>）放定义：函数体的具体实现，一个 <code>.cpp</code> 编译成一个 <code>.o</code>。</li>
    </ul>
    <p>
      这样做的直接好处是<strong>分离编译</strong>：改一个 <code>.cpp</code> 只重编这一个文件，其余 <code>.o</code> 直接复用，再一起链接即可。代价是必须遵守两条铁律——头文件里<strong>只放声明</strong>（放定义会因被多处包含而触发重复定义），函数定义<strong>只能出现一次</strong>（否则链接器报 <code>multiple definition</code>）。
    </p>

    <h2>看一遍编译流程与常见报错</h2>
    <figure class="lesson-figure">
      <figcaption>切换「程序结构 / 编译流程 / 代码示例」三个标签，对照每个阶段的命令与产物，分清编译错误和链接错误。</figcaption>
      <CPP01ProgramStructure />
    </figure>

    <h2>把过程当成分诊图</h2>
    <p>
      程序结构、编译流程这两件事，本质上是一张<strong>分诊图</strong>：写 C++ 时把预处理指令、函数、语句三类成分摆对位置，把声明与定义分到该去的文件；报错时按「编译期 / 链接期」先定位是哪一段接力出的问题——语法与类型问题问编译器，符号找不到或重复问链接器。有了这张图，入门阶段的大部分红字就不再是玄学。
    </p>
    <div class="lesson-term">
      <span class="term-name">「编译单元」</span>指一个 <code>.cpp</code> 源文件经预处理后、供编译阶段翻译的整份正文，通常对应一个目标文件 <code>.o</code>；<span class="term-name">「翻译单元」</span>是它的标准叫法。区分<span class="term-name">「声明」</span>（告诉编译器名字与类型存在）与<span class="term-name">「定义」</span>（给出实体本身），是把编译错误与链接错误分开定位的基础。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
