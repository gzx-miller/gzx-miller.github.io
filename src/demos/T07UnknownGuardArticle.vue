<script setup lang="ts">
import T07UnknownGuard from './T07UnknownGuard.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把接口返回的 JSON 用 <code>as Course</code> 断言成业务类型，本地一切正常，上线后某天字段少了半个，页面直接白屏——断言明明过了，怎么会崩？
    </div>

    <h2>不可信外部数据</h2>
    <p>
      你的数据来源几乎都不在自己手里：接口响应、用户导入的文件、<code>localStorage</code> 里存的上一次状态。这些数据在到达你的业务代码之前，类型标注对它们<strong>没有任何约束力</strong>——类型只在编译期存在，编译器看不到运行时收到的究竟是一串合法 JSON 还是一段被改坏的字符串。
    </p>
    <p>
      真正的代价出在信任的时机上。只要在拿到数据的第一行就把它当成业务类型使用，那么往后每一次取值、每一次调用都建立在「它一定是对的」这个未经检验的假设上。假设一旦不成立，错误不会停在你写下断言的地方，而是飘到很远的地方才炸开——报错的行号离真正的原因十万八千里。
    </p>

    <h2>解析后类型断言</h2>
    <p>
      最省事的做法：直接断言。解析之后写一句 <code>const data = JSON.parse(text) as Course</code>，剩下的代码就把 <code>data</code> 当 <code>Course</code> 用。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它让编辑器能给出字段提示</strong>。在这之后写 <code>data.title</code> 不会再被标红，补全也能列出来，开发体验立刻顺畅。如果数据来源可信，这样做毫无问题。
    </p>

    <h2>断言放行代价</h2>
    <ul>
      <li><code>as</code> 只是给编译器「我说它是」的承诺，<strong>运行时一次检查都不会做</strong>，字段缺失时它照样放行。</li>
      <li>用 <code>any</code> 接收更糟，等于主动关掉这条数据链路上所有的类型检查。</li>
      <li>字段类型对不上（该是数字却收到字符串）在断言处毫无提示，直到参与计算时才出错。</li>
      <li>嵌套结构用一次断言整片跳过，里层哪个字段坏掉根本无从定位。</li>
      <li>崩溃时堆栈落在使用数据的地方，而不是它被引入的地方，排查方向被打乱。</li>
    </ul>

    <h2>未知类型接收</h2>
    <p>
      不推翻「我要用这份数据」，而是先承认它<strong>暂时还不能被相信</strong>。第一步是把外部输入一律接收为 <code>unknown</code>——它意味着「这里有个值，但我们对它一无所知」，任何直接取值都会被编译器拦下，逼你先做检查。
    </p>
    <p>
      第二步是写一个<strong>自定义类型守卫</strong>。它既是一段真正的运行时校验，又通过返回类型里的 <code>is</code> 谓词向编译器承诺：一旦这个函数返回真，参数就是那个精确类型。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>typeof value !== 'object'</code> 配合 <code>value === null</code> 排除掉非对象与 <code>null</code>。</li>
      <li>把它收成一个 <code>Record&lt;string, unknown&gt;</code>，再逐字段用 <code>typeof</code>、<code>in</code> 验证结构与类型。</li>
      <li>函数签名写成 <code>value is Course</code>，让校验与类型收窄一步到位。</li>
      <li>守卫通过后，数据被自动收窄为业务类型，再交给后续逻辑。</li>
    </ol>
    <p>
      拿到这套写法，开场那个例子就安全了：解析结果先留在 <code>unknown</code>，只有 <code>isCourseData</code> 返回真，才把它当成业务对象使用；返回假时给出「字段结构不合法」的明确回退。
    </p>
    <p>
      再深一层，嵌套结构不要指望一次断言扫过。把校验拆成若干细粒度谓词——先判断是不是对象，再判断某个字段是不是数组，再判断数组元素的形状——逐层组合。结构复杂到一定程度时，可以引入 schema 工具（如 zod、valibot），让校验规则直接推导出类型，省去手写谓词。最后补一条工程习惯：<strong>为关键接口写一批非法输入的测试用例</strong>，用损坏的数据构造场景，确认守卫返回假而不是放行。
    </p>

    <h2>校验失败拦截</h2>
    <figure class="lesson-figure">
      <figcaption>改一改输入框里的 JSON，看守卫在校验失败时如何拒绝放行。</figcaption>
      <T07UnknownGuard />
    </figure>

    <h2>显式校验与守卫</h2>
    <p>
      处理不可信数据的关键，是让「相信」这一步显式发生。外部输入先收成 <code>unknown</code>，用类型守卫在运行时真正检查结构与类型，检查通过后再交给业务逻辑——断言换不来安全，只有真实执行过的校验才能。
    </p>
    <div class="lesson-term">
      <span class="term-name">「类型守卫」</span>是返回 <code>value is T</code> 谓词的函数：它既在运行时执行真实检查（<code>typeof</code>、<code>in</code> 等），又向编译器证明检查通过后参数的精确类型，使 <code>unknown</code> 被自动收窄。类型断言 <code>as</code> 不产生任何运行时校验，不能替代它。
    </div>
  </LessonArticle>
</template>
