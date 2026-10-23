const o=`<script setup lang="ts">
import PY02Operators from './PY02Operators.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同样写除法，<code>7 / 2</code> 得到 <code>3.5</code>，可 <code>7 // 2</code> 得到 <code>3</code>；更意外的是 <code>-7 // 2</code> 不是 <code>-3</code> 而是 <code>-4</code>，<code>-7 % 2</code> 又得到 <code>1</code>。这些「看起来该整除」的地方，符号到底藏到哪里去了？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      Python 的算术几乎没有门槛：<code>7 + 2</code>、<code>7 / 2</code>、<code>2 ** 10</code> 直接就能得到答案，不用包一层函数，也不用声明类型。正是这种随手可写，让人容易忽略「同一族运算符其实各守各的规则」。
    </p>
    <p>
      最典型的疑问来自除法家族：<code>7 / 2</code> 是 <code>3.5</code>，<code>7 // 2</code> 是 <code>3</code>，看起来一个是真除、一个是整除。可换成负数就变了味：<code>-7 // 2</code> 不是 <code>-3</code> 而是 <code>-4</code>，<code>-7 % 2</code> 也不是 <code>-1</code> 而是 <code>1</code>。要解释这两个「意外」，得先弄清每个运算符各自的求值规则。
    </p>

    <h2>优先级与括号</h2>
    <p>一个表达式里混了多个运算符时，Python 按固定的优先级决定谁先算，阶梯大致是：</p>
    <ul>
      <li>最高：<code>**</code>（幂），而且<strong>右结合</strong>，<code>2 ** 3 ** 2</code> 等价于 <code>2 ** (3 ** 2)</code>。</li>
      <li>其次：一元 <code>+</code> / <code>-</code>。</li>
      <li>再次：<code>*</code>、<code>/</code>、<code>//</code>、<code>%</code>。</li>
      <li>然后：二元 <code>+</code>、<code>-</code>。</li>
      <li>接着：比较运算，如 <code>&lt;</code>、<code>==</code>、<code>in</code>。</li>
      <li>再低：<code>not</code>，然后是 <code>and</code>，最低的是 <code>or</code>。</li>
    </ul>
    <p>
      记不住整张表也没关系：拿不准就加括号。括号既能固定求值顺序，也能让读代码的人一眼看懂意图。<code>(a + b) * c</code> 永远比依赖记忆去猜可靠。
    </p>

    <h2>除法家族：真除法、地板除、取余</h2>
    <p>三个符号常被混为一谈，其实分工明确：</p>
    <ul>
      <li><code>/</code> 是真除法，<strong>结果恒为 float</strong>，哪怕能整除：<code>4 / 2</code> 得到 <code>2.0</code> 而不是 <code>2</code>。</li>
      <li><code>//</code> 是地板除，把结果<strong>向下取整</strong>到最接近的整数（朝负无穷方向）：<code>-7 // 2</code> 得到 <code>-4</code>。它是向下取整，不是向零截断——这一点在负数上最容易踩坑。</li>
      <li><code>%</code> 是取余，余数的<strong>符号跟随除数</strong>。正因为 <code>//</code> 向下取整，才保证了恒等式 <code>a == (a // b) * b + (a % b)</code> 成立，于是 <code>-7 % 2</code> 必须是 <code>1</code> 而不是 <code>-1</code>。</li>
    </ul>
    <p>
      想一次拿到商和余数，可以用 <code>divmod(7, 2)</code>，它返回 <code>(3, 1)</code> 这样的元组。类型上，两个整数做 <code>//</code> 或 <code>%</code> 得到 <code>int</code>，只要任一方是 <code>float</code>，结果就变成 <code>float</code>。
    </p>

    <h2>幂运算与链式比较</h2>
    <p>
      <code>**</code> 计算幂：<code>2 ** 10</code> 是 <code>1024</code>。若指数为负，结果自动变 <code>float</code>，<code>2 ** -1</code> 是 <code>0.5</code>。它右结合，<code>2 ** 3 ** 2</code> 先算 <code>3 ** 2 = 9</code>，再算 <code>2 ** 9 = 512</code>。
    </p>
    <p>
      比较运算有个其他语言少见的能力——<strong>链式比较</strong>：<code>0 &lt; x &lt; 10</code> 直接合法，等价于 <code>0 &lt; x and x &lt; 10</code>，并且 <code>x</code> 只求值一次。写范围判断时不必再重复写变量名。
    </p>

    <h2>布尔运算与短路</h2>
    <p>
      <code>and</code> / <code>or</code> / <code>not</code> 不只是返回真假，<code>and</code>、<code>or</code> 返回的是<strong>参与运算的对象本身</strong>，并遵循短路求值：
    </p>
    <ul>
      <li><code>a and b</code>：<code>a</code> 为假就返回 <code>a</code>，否则返回 <code>b</code>。若 <code>a</code> 为假，<code>b</code> 根本不会被求值。</li>
      <li><code>a or b</code>：<code>a</code> 为真就返回 <code>a</code>，否则返回 <code>b</code>。若 <code>a</code> 为真，<code>b</code> 根本不会被求值。</li>
    </ul>
    <p>
      短路让「先判断再取值」成为惯用法：<code>name or "匿名"</code> 在 <code>name</code> 为空时给出兜底值。假值包括 <code>0</code>、<code>0.0</code>、<code>''</code>、<code>[]</code>、<code>{}</code>、<code>None</code>，其余多为真。
    </p>

    <h2>值相等、身份相等与增强赋值</h2>
    <p>两个容易混淆的运算符：</p>
    <ul>
      <li><code>==</code> 比较<strong>值是否相等</strong>：<code>[1, 2] == [1, 2]</code> 是 <code>True</code>。</li>
      <li><code>is</code> 比较<strong>是否为同一个对象</strong>（身份）：<code>[1, 2] is [1, 2]</code> 是 <code>False</code>。判断「是不是 None」应当写成 <code>is None</code>，而不是 <code>== None</code>。</li>
    </ul>
    <p>
      <strong>增强赋值</strong>把运算和赋值合成一步：<code>count += 4</code> 相当于 <code>count = count + 4</code>。对不可变对象它只是重新绑定名字；对可变对象（列表的 <code>+=</code> 走 <code>extend</code>）它可能<strong>就地修改</strong>原对象，从而影响所有指向它的名字。
    </p>

    <div class="lesson-box warn">
      <strong>常见误区：</strong>把 <code>//</code> 当成「向零取整」的整除。负数下 <code>-7 // 2 == -4</code>、<code>-7 % 2 == 1</code>，与「截断」的直觉相反；只要记住它朝负无穷取整、余数符号跟随除数，这些结果就能自己推导出来。
    </div>

    <h2>看一遍运算符的行为</h2>
    <figure class="lesson-figure">
      <figcaption>改一改 <code>a</code>、<code>b</code> 两个数字，点不同运算符按钮，看表达式的值与它推断出的类型；再用下方对照表体会 <code>/</code> 与 <code>//</code> 的差别，把 <code>b</code> 设成负数试试。</figcaption>
      <PY02Operators />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      运算符的坑几乎都集中在两处：求值的顺序，和不同类型对同一符号的不同解读。优先级决定谁先算，括号能随时把它讲清楚；<code>/</code> 恒为 <code>float</code>、<code>//</code> 朝负无穷取整、<code>%</code> 跟随除数的符号，把这三条记住，负数上的「意外」就不再意外。再加上 <code>==</code> 比的是值、<code>is</code> 比的是身份，以及短路逻辑的返回规则，表达式求值就没有暗角了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「地板除」</span>指用 <code>//</code> 做除法并把结果向下取整到负无穷的整数；余数 <code>%</code> 的符号跟随除数，二者满足 <code>a == (a // b) * b + (a % b)</code>。边界与例外：当任一方是 <code>float</code> 时结果也是 <code>float</code>；除数为 0 会抛 <code>ZeroDivisionError</code>。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
