<script setup lang="ts">
import T12TemplateLiteral from './T12TemplateLiteral.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>组件约定的事件名是 <code>onClick</code>、<code>onFocus</code>，可为什么把 <code>'onClik'</code> 传进去，TypeScript 一声不吭？
    </div>

    <h2>事件名的拼接</h2>
    <p>
      你在封装一个按钮组件，对外约定四个基础事件 <code>click</code>、<code>focus</code>、<code>submit</code>、<code>change</code>，内部统一用 <code>onXxx</code> 的写法挂载监听。问题在于，这些名字全都是普通字符串：<code>'onClick'</code> 与 <code>'onClik'</code> 在类型上毫无分别，后者只会在用户点了按钮却没有反应时才暴露出来。
    </p>
    <p>
      同类问题还会出现在路由路径与 CSS 类名上——凡是用「前缀 + 后缀」拼出来的字符串，只要拼接规则存在，就一定有写错的空间。<strong>把约定只写在文档或代码评审里，等于把校验推迟到了运行时，甚至是线上。</strong>
    </p>

    <h2>枚举合法取值</h2>
    <p>
      最直接的做法是枚举式地把合法值全列出来：<code>type OnEvent = 'onClick' | 'onFocus' | 'onSubmit' | 'onChange'</code>。写错任何一个成员，编译器都会在赋值处立刻标红。
    </p>
    <p>
      这个方向是对的，<strong>用字面量联合把「合法取值」显式列举出来，是类型约束的基本功</strong>。它至少把错误从运行时提前到了编译期。
    </p>

    <h2>手工穷举的代价</h2>
    <ul>
      <li>合法值是「手工穷举」的：基础事件从四个涨到十个，这份联合就得跟着一个个手改。</li>
      <li>四个事件配四个 <code>onXxx</code>，再叠上四种样式状态，组合数量会翻倍增长，枚举写法很快失控。</li>
      <li>一旦拼接规则变化（比如前缀从 <code>on</code> 改成 <code>handle</code>），所有枚举值都要重写——规则本身从未被表达出来。</li>
      <li>前缀与后缀两两组合时，手写极易漏掉某些本该合法的组合。</li>
    </ul>

    <h2>模板字面量拼接</h2>
    <p>
      与其列举「结果」，不如描述「规则」。模板字面量类型允许你在类型层面写一对反引号，把字符串拼接搬进类型里：<code>type OnEvent = `on${Capitalize&lt;BaseEvent&gt;}`</code>。其中 <code>BaseEvent</code> 是一个联合，编译器会把反引号里的每个占位符依次替换成联合的成员，<strong>自动展开出所有合法形态</strong>——你只写了规则，成员却一个不少。
    </p>
    <p>
      当占位符是<strong>多个联合</strong>时，它做的是笛卡尔积：<code>type CssClass = `${Prefix}-${State}`</code>，三个前缀乘以四种状态，十二个类名被自动生成，一个不漏也一个不多。这就是模板字面量最实用的地方：把「组合出所有可能」交给编译器。
    </p>
    <p>
      它还能配合内置的字符串工具统一大小写：<code>Uppercase</code> 全大写、<code>Lowercase</code> 全小写、<code>Capitalize</code> 首字母大写。这正是先写 <code>click</code>、再派生出 <code>onClick</code> 的依据——基础数据保持小写，展示形态由类型规则生成，命名规范从此只在一处定义。
    </p>
    <p>
      再走一步，模板字面量类型可以<strong>反过来从字符串里提取片段</strong>，配合 <code>infer</code> 与条件类型一起用。比如从 <code>`on${E}`</code> 里把事件名取回来，或者把 <code>camelCase</code> 转成 <code>snake_case</code>。于是同一套规则既能生成、又能解析，事件总线、API 路由与状态机的 key 都能收敛到一份定义上。
    </p>
    <p>
      把这些能力串起来，封装一个类型安全的事件总线大致分四步：
    </p>
    <ol class="lesson-steps">
      <li>先定义一份「基础事件名 → 负载参数」的映射，键写成 <code>click</code>、<code>submit</code> 这样的小写名字。</li>
      <li>用模板字面量类型 <code>`on${Capitalize&lt;K&gt;}`</code> 从基础名派生出对外的事件名，命名规范只在一处定义。</li>
      <li>把监听与触发函数的参数约束到派生出来的名字上，触发时负载类型随事件名一起收窄。</li>
      <li>新增一个基础事件，只改键定义即可，派生的名字与负载校验会一起更新。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>需要留意类型膨胀：</strong>模板字面量与联合组合时是笛卡尔展开，两个十成员的联合一拼就是一百个键，编译器的推导次数会成倍上升。如果一个字面量能被规则完整描述，就不要把它提前展开成具体成员。
    </div>

    <h2>合法取值的展开</h2>
    <figure class="lesson-figure">
      <figcaption>切换事件与样式类，会发现下拉里的合法取值列表，本身就是模板字面量类型展开的结果。</figcaption>
      <T12TemplateLiteral />
    </figure>

    <h2>命名规范的编码</h2>
    <p>
      模板字面量类型把「前缀 + 后缀」这类字符串约定从注释里搬进了类型系统：它由规则生成合法取值，能调用大小写工具规范化，还能用 <code>infer</code> 反向解析。事件名、路由路径、CSS 类名这些曾经只靠约定维持的东西，如今在编辑阶段就会被拦住。
    </p>
    <div class="lesson-term">
      <span class="term-name">「模板字面量类型」</span>用反引号在类型层面拼接字符串，形如 <code>`${Prefix}${Suffix}`</code>；占位符遇到联合会自动展开，多个联合则做笛卡尔组合。它常配合 <code>Uppercase</code>、<code>Capitalize</code> 等内置工具统一命名规范，也能借助条件类型与 <code>infer</code> 反向提取片段。适合事件名、路由、CSS 类名等强约束场景，但组合爆炸时必须警惕类型膨胀。
    </div>
  </LessonArticle>
</template>
