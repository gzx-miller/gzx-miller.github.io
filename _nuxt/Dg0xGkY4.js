const e=`<script setup lang="ts">
import J13ProxyReflect from './J13ProxyReflect.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>表单要求「改一个字段就校验一次」，可给对象赋值的地方散落在十几个函数里，你能保证每一处都记得手动补一句校验吗？
    </div>

    <h2>对象行为增强</h2>
    <p>
      你想给一个普通对象附加行为：写入时校验、读取时记日志、改值后通知界面刷新。业务里最简单粗暴的办法，是每写一次就跟一句处理逻辑：<code>form.name = v</code> 之后立刻调一次校验。
    </p>
    <p>
      问题是，赋值的点会越来越多，而且有些偏偏发生在别人写的函数里。你没法在库内部的每一行 <code>target.x = y</code> 后面插一句自己的代码。于是想「给对象的读写统一加一层」这件事，靠调用点的自觉是做不到的——<strong>漏一处，行为就不完整</strong>。
    </p>
    <p>
      换句话说，你要表达的其实是「这个对象身上的某些操作，应该被统一改写」。而语言里能承载这种「统一改写」的位置，只有对象本身，不是那一个个调用点。
    </p>

    <h2>手动校验与约定</h2>
    <p>
      最省事的做法：在每个赋值点后面手动调用一次校验，或者把校验抽成函数、要求所有人改值时都走它。
    </p>
    <p>
      它甚至有个名字——「约定优于拦截」：只要团队都遵守「改属性前先调校验」的约定，行为就是完整的。问题在于，约定靠人执行，而人会忘、代码会有新人接手、第三方库更不会替你遵守。
    </p>
    <p>
      这个方案做对了一件事：<strong>逻辑是显式的、直白的</strong>，不依赖任何新语法，调试时一眼就能看清发生了什么。它适合字段很少、写入点集中、且都归你控制的小场景。
    </p>

    <h2>校验覆盖与漏检</h2>
    <ul>
      <li>不透明：新增一个赋值点就得记得补一次调用，漏一个校验就整体失效。</li>
      <li>覆盖不全：只想拦「写」，可「读」「删除」「判断属性是否存在」等操作也想统一加逻辑时无处安放。</li>
      <li>插不进第三方代码：别人在库里直接改对象属性时，你没有位置插入自己的处理。</li>
      <li>做不了响应式：依赖追踪必须在「读」的时候记录，靠普通赋值根本拿不到这个时机。</li>
    </ul>

    <h2>Proxy包装与陷阱</h2>
    <p>
      不推翻「给对象加行为」，而是把这层行为从调用点搬进对象本身，让访问自动经过它。
    </p>
    <p>
      核心是 <code>new Proxy(target, handler)</code>：用 <code>Proxy</code> 包装目标对象，<code>handler</code> 里针对 <code>get</code>、<code>set</code>、<code>has</code>、<code>deleteProperty</code> 等每一个基本操作放置一个陷阱（trap）。之后无论谁、从哪里、以哪种写法访问这个代理，都会先经过陷阱——这才是真正意义上的<strong>透明拦截</strong>。
    </p>
    <p>
      陷阱里要执行默认行为时，交给 <code>Reflect</code>：它提供与陷阱一一对应的方法（<code>Reflect.get</code>、<code>Reflect.set</code>、<code>Reflect.has</code> 等），能正确处理原型链查找、<code>this</code> 绑定和返回值语义。所以推荐的写法是：先在陷阱里做自定义逻辑，再 <code>return Reflect.set(target, prop, value)</code> 把默认行为<strong>原样转发</strong>出去。
    </p>
    <p>
      这套原语正是响应式的底座：Vue 3 的响应式系统就借助 <code>Proxy</code>，在 <code>get</code> 陷阱里收集依赖、在 <code>set</code> 陷阱里触发更新。同理，ORM、校验库也用它把对象操作统一管起来。
    </p>
    <p>
      具体到不同需求，选的陷阱也不一样：要在赋值时校验，用 <code>set</code> 陷阱；要统计某个属性「有没有被访问过」，用 <code>has</code> 陷阱；要防止关键字段被悄悄删除，用 <code>deleteProperty</code> 陷阱。原本散落在各个调用点的横切逻辑，如今都集中进了 <code>handler</code>，一处配置、全局生效。
    </p>
    <div class="lesson-box warn">
      三个容易踩的点：第一，<code>Proxy</code> 不能代理对象的内部槽位，比如 <code>Date</code> 的时间戳，代理它拿不到真实的时间；第二，陷阱里忘记转发对应操作（只做自定义逻辑就返回），目标对象的默认行为会直接失效；第三，深层代理需要递归包装，回收时也要逐层释放。
    </div>

    <h2>写入拦截与转发</h2>
    <figure class="lesson-figure">
      <figcaption>在输入框里改值，看 <code>set</code> 陷阱如何在校验通过前先拦下一手，再由 <code>Reflect</code> 转发写入。</figcaption>
      <J13ProxyReflect />
    </figure>

    <h2>透明拦截与追踪</h2>
    <p>
      Proxy 把「对对象的访问」变成可插入的一层管道，Reflect 则保证这层管道不会破坏语言原本的默认语义。透明拦截与响应式追踪，都是从这对原语长出来的。
    </p>
    <p>
      记住那条铁律：陷阱里做完全部自定义逻辑之后，务必用 <code>Reflect</code> 把默认行为原样转发出去，否则你拦住的就不只是「想拦的那部分」了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Proxy 与 Reflect」</span><code>Proxy</code> 用 <code>new Proxy(target, handler)</code> 包装目标对象，<code>handler</code> 中的 <code>get</code>、<code>set</code>、<code>has</code>、<code>deleteProperty</code> 等陷阱拦截对目标的基本操作；<code>Reflect</code> 提供与陷阱一一对应的默认行为方法，转发时能正确处理原型链、<code>this</code> 绑定与返回值，二者是实现响应式、ORM、校验库的核心原语。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
