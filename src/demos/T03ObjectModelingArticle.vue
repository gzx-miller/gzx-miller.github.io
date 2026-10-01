<script setup lang="ts">
import T03ObjectModeling from './T03ObjectModeling.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>会员卡面板要算出「还差多少分升级」，可接口返回的字段叫 <code>member_level</code>、组件里写的却是 <code>level</code>，两边到底以谁为准——怎么保证它们不会悄悄错开？
    </div>

    <h2>对象属性访问</h2>
    <p>
      会员资料里有姓名、等级、成长值三样东西：<code>name</code>、<code>level</code>、<code>points</code>。你在组件里直接读 <code>member.name</code>、用 <code>1000 - member.points</code> 算还差多少分，看上去很顺。
    </p>
    <p>
      但这些数据其实来自三个地方：后端接口响应、组件接收的 Props、以及本地状态。每一处都各自描述了「一个会员长什么样」。代价就在这份重复里：<strong>字段一旦改名或增删，你只能靠人肉搜索</strong>；某个地方多写了一个不存在的字段，代码照常运行，只是读到 <code>undefined</code>，界面空白却一声不吭。所以问题不是「要不要描述对象」，而是<strong>如何把接口返回与业务对象建模成一份可维护的类型，避免字段漂移</strong>。
    </p>

    <h2>接口声明对象形状</h2>
    <p>
      最直接的做法，是给对象写一张「形状清单」——把字段名与类型集中声明一次，用它约束所有用到会员的地方。这就是 <code>interface</code>：
    </p>
    <p>
      <code>interface MemberProfile { name: string; level: string; points: number }</code>
    </p>
    <p>
      它做对的事很关键：<strong>用一组字段刻画了领域对象的形状，任何满足它的对象都成为合法值</strong>。组件拿到 <code>member</code> 时，编辑器知道它一定有 <code>name</code> 和 <code>points</code>，于是能顺着统一契约计算衍生值，比如 <code>1000 - member.points</code>。
    </p>

    <h2>字段类型标注过宽</h2>
    <ul>
      <li>字段类型给得太宽：<code>level: string</code> 时，界面传入 <code>'gold'</code> 这种不存在的等级也照样通过。</li>
      <li>可选字段被滥用：把必然存在的 <code>points</code> 写成 <code>points?</code>，衍生计算立刻变成 <code>number | undefined</code>，到处要判空。</li>
      <li>拿数据库或接口字段名（如 <code>member_level</code>）当业务模型名，业务代码读起来像在念表结构。</li>
      <li>以为多写一个字段一定会报错，其实并非所有赋值都会检查——规则有区别。</li>
    </ul>

    <h2>结构化类型系统</h2>
    <p>
      关键前提是：TypeScript 采用<strong>结构化类型系统</strong>，它只比较类型之间的形状，而不关心这个类型来自哪次声明。所以只要字段对得上，一个对象就能当作 <code>MemberProfile</code> 使用——这正是 Props、接口响应与业务函数可以复用同一份契约的根据。
    </p>
    <p>
      顺着这个前提做三处收紧。第一，把等级收成字面量联合：<code>level: '普通' | '银卡' | '金卡'</code>，非法等级在编译期即被拦下。第二，<strong>可选字段只用于数据确实可能缺失的场景</strong>，<code>points</code> 这种始终存在的放进必填区，衍生计算就不会被 <code>undefined</code> 污染。第三，<strong>公共模型用业务语言命名</strong>，避免与数据库或接口字段名混用，让契约和业务说法保持一致地演化。
    </p>
    <div class="lesson-box warn">
      <strong>两条赋值规则并不相同：</strong>把对象字面量直接赋给接口变量时，会执行<strong>多余属性检查</strong>，多出一个字段就报错；而先把对象赋给一个变量、再在变量之间互赋，则只比较形状，多余的字段会被放行。接口本身只描述形状，需要精确拒绝额外字段时，要靠多余属性检查或运行时校验。
    </div>
    <ol class="lesson-steps">
      <li>识别领域对象的稳定字段与可变字段，用 <code>interface</code> 定义它的形状。</li>
      <li>对象字面量必须同时满足必填字段与字段类型，缺漏或多出的字段由编译器拦截。</li>
      <li>让组件 Props、接口响应与业务函数都复用同一份接口契约，并基于它计算衍生值。</li>
      <li>给接口变量赋一个多出字段的字面量，观察多余属性检查的报错。</li>
    </ol>
    <p>
      当领域模型被收敛为单一来源之后，改动一个字段，编译器会指出所有受影响的位置。契约不再靠记忆维护，而是由类型系统替你守着。
    </p>

    <h2>衍生值联动变化</h2>
    <figure class="lesson-figure">
      <figcaption>改一改会员名与成长值，看统一契约下的衍生值如何跟随变化。</figcaption>
      <T03ObjectModeling />
    </figure>

    <h2>契约与类型兼容</h2>
    <p>
      <code>interface</code> 的价值不在「写了一个类型」，而在于把散落在接口、Props 与业务代码里的对象形状收拢成一份契约。结构化类型让形状相同的对象互通，多余属性检查在字面量赋值处兜底，而模型改名时编译器会替你找出所有调用点。
    </p>
    <div class="lesson-term">
      <span class="term-name">「interface 与结构化类型」</span>指用一组字段刻画领域对象的形状，满足它即成为该类型的合法值。<code>interface</code> 只描述形状、不关心声明来源，因此 Props、接口响应与业务函数可复用同一份契约。可选字段只留给确实可能缺失的数据；对象字面量直接赋值会执行多余属性检查，变量间赋值只比较形状，两者规则不同。
    </div>
  </LessonArticle>
</template>
