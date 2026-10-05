const e=`<script setup lang="ts">
import J01TypesEquality from './J01TypesEquality.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>表单校验里写了 <code>if (value == 0)</code> 拦截「数量为 0」，结果用户什么都没填也弹出了提示——空字符串究竟是怎么混进来的？
    </div>

    <h2>动态类型相等判断</h2>
    <p>
      你想做一件很小的事：判断两个值是不是「一样」。在静态类型语言里，这几乎是废话——两个变量类型不同，编译器根本不让你比较。但在 JavaScript 里，同一个变量今天装字符串、明天装对象，比较两个「长得像」的值时，语言必须自己拿主意：<strong>是先转换再比，还是类型不同直接判不等？</strong>
    </p>
    <p>
      JavaScript 给的两个答案就是 <code>==</code> 和 <code>===</code>。先说清它们的差别在哪：<code>===</code> 先看类型，类型不同立刻返回 <code>false</code>；<code>==</code> 先按一套规则把两边转成同一类型，再比数值。麻烦全部出在「转成同一类型」这一步上——它不是随机的，但规则足够反直觉，反直觉到会悄悄吃掉你的业务判断。
    </p>

    <h2>宽松相等隐式转换</h2>
    <p>
      最省事的做法：统一用 <code>==</code>，反正它「聪明」，会自动帮我们把字符串和数字对齐。于是 <code>'0' == 0</code> 得到 <code>true</code>，表单里那个空字符串也就能冒充数字 0 通过校验。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>比较这件事必须能跨越类型边界完成</strong>，否则用户从输入框拿到的永远只是字符串，业务里全是 <code>Number()</code> 噪音。问题在于，把「转换」藏进比较运算符里，等于把一步显式的数据处理偷偷塞进了判断表达式——你看代码时看到的是「相等」，运行时发生的却是「先转换再相等」。
    </p>

    <h2>隐式转换反常结果</h2>
    <ul>
      <li><code>'0' == 0</code> 是 <code>true</code>，<code>'' == 0</code> 也是 <code>true</code>——空字符串被当成 0，校验直接失效。</li>
      <li><code>null == undefined</code> 是 <code>true</code>，而这两个值跟别的任何值比都是 <code>false</code>，是一对只跟彼此相等的特例。</li>
      <li><code>[] == ''</code> 是 <code>true</code>，空数组 <code>toString()</code> 之后成了空字符串，两边就「相等」了。</li>
      <li><code>NaN == NaN</code> 是 <code>false</code>，一个值连自己都不等于，用相等判断来识别 NaN 天然做不到。</li>
      <li><code>0 === -0</code> 是 <code>true</code>，但这两者做除数会得到完全不同的结果，严格相等在这里又不够严格。</li>
    </ul>

    <h2>转换与比较分离</h2>
    <p>
      不推翻「比较」，而是把「转换」和「比较」拆成两步：<strong>转换显式做，比较一律用严格相等</strong>。需要数字就在输入边界上调用 <code>Number()</code>，需要字符串调用 <code>String()</code>，需要布尔调用 <code>Boolean()</code>；判断里只留 <code>===</code> 与 <code>!==</code>。这样一来，「相等」在代码里就是字面意思。
    </p>
    <p>
      接着补上类型识别这一步。运行时要判断值的类型，用 <code>typeof</code>，但要记住两个例外：
    </p>
    <ul>
      <li><code>typeof null</code> 返回 <code>'object'</code>，这是语言最早实现的遗留问题，判断 <code>null</code> 请直接写 <code>x === null</code>。</li>
      <li>除函数外，所有引用类型的 <code>typeof</code> 都是 <code>'object'</code>，数组要用 <code>Array.isArray()</code> 单独判断。</li>
    </ul>
    <p>
      再往下走，会发现还有两个边界必须单独处理。第一是 <code>NaN</code>：全局 <code>isNaN()</code> 会先把参数转成数字再判断，传字符串进去也可能为真，所以要用 <code>Number.isNaN()</code>。第二是 <code>+0</code> 与 <code>-0</code>：如果业务要区分它们，用 <code>Object.is()</code>——它认为 <code>NaN</code> 与自身相等，同时能区分正负零。
    </p>
    <p>
      最后一个容易被忽略的事实是 <strong>falsy 值清单是固定且很短的</strong>：<code>false</code>、<code>0</code>、<code>-0</code>、<code>0n</code>、<code>''</code>、<code>null</code>、<code>undefined</code>、<code>NaN</code>，就这八种。除此之外全是 truthy——<strong>空数组 <code>[]</code> 和空对象 <code>{}</code> 都是 truthy</strong>，所以用「非空判断」兜底数组和对象时，真正该看的是 <code>length</code> 或 <code>Object.keys()</code>，而不是真假值。
    </p>

    <h2>反常相等逐条验证</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮切换对比项，亲手验证上面每一条反直觉的相等结果。</figcaption>
      <J01TypesEquality />
    </figure>

    <h2>严格相等判定原则</h2>
    <p>
      类型与相等这两件事，本质上是把「隐式转换」从表达式里请出来，放到你能看见的地方。判断一律用 <code>===</code>，转换在输入边界显式完成，类型识别绕开 <code>typeof null</code>、数组和 <code>NaN</code> 这三个坑——反直觉的 bug 就少了一大半。
    </p>
    <div class="lesson-term">
      <span class="term-name">「严格相等」</span>指 <code>===</code>，要求类型与值同时一致，不做任何隐式转换；与之相对的 <code>==</code> 会先转换再比较。判断 <code>null</code> 用 <code>x === null</code>，判断数组用 <code>Array.isArray()</code>，判断 <code>NaN</code> 用 <code>Number.isNaN()</code>，需要区分 <code>+0</code> / <code>-0</code> 时用 <code>Object.is()</code>。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
