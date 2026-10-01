<script setup lang="ts">
import T19BrandedTypes from './T19BrandedTypes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>转账函数的两个参数类型都是 <code>string</code>，某天有人把收款方和付款方传反了，编译通过、测试也过了，钱却转进了错误的账户——编译器为什么一点都没拦住？
    </div>

    <h2>结构相同混淆</h2>
    <p>
      你写了一个转账函数，收付款账户的类型都是 <code>string</code>。类型检查毫无怨言，可一旦调用时两个参数顺序写反，或者把一张订单号传进了本该是用户 ID 的位置，编译器什么都不会说。因为从类型系统的角度看，它们<strong>本来就是同一个类型</strong>。
    </p>
    <p>
      这不是 TypeScript 的疏漏，而是它的设计取向。TypeScript 采用<strong>结构化类型系统</strong>：两个类型只要形状一致，就被视为兼容，来源和名字都不重要。这带来了极大的灵活性——对象字段对得上就能传，不必显式声明继承关系——代价则是「同样是字符串、含义却完全不同」的语义差异，编译器根本看不见。
    </p>

    <h2>命名与注释提醒</h2>
    <p>
      最省事的做法：把两个参数命名清楚，比如 <code>fromAccountId</code>、<code>toAccountId</code>，再在注释里郑重提醒「注意别传反」。代码规范、命名清晰，问题看上去就解决了。
    </p>
    <p>
      这个做法承认了一件重要的事：<strong>语义差异需要被表达出来</strong>，命名是最便宜的表达方式。在单个函数、单个文件里，它往往确实够用，也几乎零成本。
    </p>

    <h2>人为提醒局限</h2>
    <ul>
      <li>命名只是给人看的，给不了编译器任何约束，参数传反照样通过检查。</li>
      <li>函数一多、调用链一长，靠命名和注释兜底基本失效。</li>
      <li>用 <code>type UserId = string</code> 也不行——它只是别名，仍能和任意字符串互换。</li>
      <li>这类错误通常只在运行时以「数据对不上」的形式暴露，排查成本极高。</li>
    </ul>

    <h2>编译期品牌标记</h2>
    <p>
      不推翻「表达语义差异」这个诉求，而是让这种差异<strong>进入类型系统</strong>。办法是给类型打上一个只存在于类型层面的标记——也就是品牌类型。
    </p>
    <p>
      用交叉类型在原始类型上追加一个唯一的品牌字段：
      <code>type Brand&lt;T, B extends string&gt; = T &amp; { readonly __brand: B }</code>。
      于是 <code>type UserId = Brand&lt;string, 'UserId'&gt;</code> 与 <code>type OrderId = Brand&lt;string, 'OrderId'&gt;</code> 就成了两个互不兼容的类型。底层都是 <code>string</code>，可在编译器眼里，把 <code>OrderId</code> 传给需要 <code>UserId</code> 的位置就是类型错误。
    </p>
    <p>
      关键的一步是<strong>把「打标记」这个动作收敛起来</strong>：不要在每个使用点到处写类型断言，而是提供构造函数或带校验的守卫。
    </p>
    <ul>
      <li>简单场景用工厂函数 <code>createUserId(id: string): UserId</code>，把断言关在函数内部。</li>
      <li>需要真实校验时结合类型守卫，例如 <code>isPositiveNumber(n): n is PositiveNumber</code>、邮箱正则、URL 前缀判断，校验通过才返回品牌类型。</li>
      <li>如此一来，「合法性」就在创建处被集中验证，类型只是把「已校验」这件事一路带到下游。</li>
    </ul>
    <div class="lesson-box warn">
      <strong>品牌键优先用 <code>unique symbol</code>。</strong>用字符串字面量 <code>__brand</code> 作键，容易和真实业务属性撞名；声明一个 <code>declare const __brand: unique symbol</code> 再做 <code>T &amp; { [__brand]: B }</code>，就能避免冲突。同时要记住：<strong>品牌只存在于编译期，运行时零开销</strong>，它买到的是编译期安全，而不是运行时保护。
    </div>
    <p>
      这套手艺特别适合那些有业务语义、又被当作原始类型使用的场景：各类 ID、金额（用来区分 <code>USD</code> 与 <code>CNY</code>）、邮箱、绝对与相对 URL。需要留意的风险是<strong>绕过工厂的构造</strong>——只要有人直接断言成 <code>UserId</code>，校验就被跳过了，所以这类写法要在代码评审里重点拦截。
    </p>
    <p>
      反过来，当确实需要拿回原始值时，也别偷偷去掉标记：用断言或 <code>Unbrand</code> 这类工具类型显式转换，让「脱掉品牌」这件事在代码里同样看得见。可加可减都摆到明面上，这套机制才不会自己漏气。
    </p>

    <h2>互斥类型赋值</h2>
    <figure class="lesson-figure">
      <figcaption>切换基础概念、业务场景与优势总结，看 <code>UserId</code> 与 <code>OrderId</code> 为何不能互相赋值。</figcaption>
      <T19BrandedTypes />
    </figure>

    <h2>名义类型补足</h2>
    <p>
      品牌类型的价值，是在结构化类型系统里补上缺失的「名义感」。它给原始类型加一个编译期标记，让结构相同、语义不同的类型无法互串；把创建逻辑收进工厂或守卫，合法性就有了唯一入口；运行时不留任何痕迹，成本几乎为零。
    </p>
    <div class="lesson-term">
      <span class="term-name">「品牌类型」</span>指用交叉类型给底层类型追加唯一标记、从而模拟名义类型的写法，如 <code>Brand&lt;T, B&gt; = T &amp; { readonly [__brand]: B }</code>。它让 <code>UserId</code> 与 <code>OrderId</code> 这类底层同为 <code>string</code> 的类型无法互相赋值，适合 ID、金额、邮箱、URL 等<strong>有语义的原始类型</strong>。品牌建议用 <code>unique symbol</code> 作键，创建逻辑集中在工厂函数或类型守卫里，运行时零开销。
    </div>
  </LessonArticle>
</template>
