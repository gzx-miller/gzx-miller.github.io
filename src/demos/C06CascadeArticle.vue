<script setup lang="ts">
import C06Cascade from './C06Cascade.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我给课程标题写了 <code>.title { color: orange }</code>，页面上那个标题却纹丝不动；换成 <code>color: orange !important</code> 才生效——为什么一条样式会「不生效」？
    </div>

    <h2>多来源样式的冲突</h2>
    <p>
      一个页面上的样式常常来自好几处：重置样式、组件库、你自己的组件样式、工具类。它们可能都在改同一个元素的同一个属性。你明明写了规则，却看不到效果，第一反应往往是「是不是被覆盖了」，可到底被谁、按什么规则覆盖，说不清楚。
    </p>
    <p>
      代价是<strong>会滑向「加权重比赛」</strong>：不生效就加 <code>!important</code>，别人再想覆盖又得加更多，最后满屏感叹号，没人敢删。排查一个颜色为什么不对，要翻好几个文件，改一处还怕崩掉别处。要跳出这个循环，得先把「谁说了算」的判定顺序讲明白。
    </p>
    <p>
      先承认一件事：<strong>样式不生效未必是权重不够，也可能是选择器根本没选对人，或者这个值本来就是从别处继承来的</strong>。把判断顺序理清楚，才知道该改哪一层，而不是无差别地加重。
    </p>

    <h2>强制胜出的写法</h2>
    <p>
      最省事的做法：直接加 <code>!important</code>，让它强行胜出。哪条不生效就给哪条加。
    </p>
    <p>
      它确实做对了一件事：<strong>面对第三方样式或内联样式，你能快速拿回控制权</strong>。在不得不兜底的场合，它是有效的应急手段。
    </p>

    <h2>优先级秩序的破坏</h2>
    <ul>
      <li>它会打乱整套优先级，让规则之间不再有可预期的强弱关系。</li>
      <li>下一个想覆盖它的人只能叠更多感叹号，权重一路水涨船高。</li>
      <li>它连内联样式都能越过，调试时你很难从数值上看出真正生效的是哪条。</li>
      <li>它掩盖了根因——样式不生效往往不是「权重不够」，而是选择器选错了人。</li>
    </ul>

    <h2>特异性判定顺序</h2>
    <p>
      先搞清「谁赢」的判定顺序。多条规则命中同一个元素时，第一步比<strong>特异性</strong>。它大致可以写成三元组（ID、类/属性/伪类、类型/伪元素），从高位到低位逐位比较，数字大的一方胜出；如果三元组完全相同，则<strong>后声明的覆盖先声明的</strong>。下面这张表把常见来源的权重摆在一起：
    </p>
    <table>
      <thead>
        <tr><th>权重来源</th><th>示例</th><th>特异性（由高到低）</th></tr>
      </thead>
      <tbody>
        <tr><td>类型选择器</td><td><code>p { color: #333 }</code></td><td>0,0,1</td></tr>
        <tr><td>类 / 属性 / 伪类</td><td><code>.title { color: orange }</code></td><td>0,1,0</td></tr>
        <tr><td>ID 选择器</td><td><code>#title { color: blue }</code></td><td>1,0,0</td></tr>
        <tr><td>组合叠加</td><td><code>.card .title</code></td><td>0,2,0（各位相加）</td></tr>
        <tr><td>内联样式</td><td><code>style="color: green"</code></td><td>高于所有普通声明</td></tr>
        <tr><td><code>!important</code></td><td><code>color: #000 !important</code></td><td>越过以上全部</td></tr>
      </tbody>
    </table>
    <p>
      可以看出，组合选择器是把各自的特异性<strong>叠加</strong>起来的：<code>.card .title</code> 有两个类，就是 0,2,0，能压过单独的 <code>.title</code>。这也是「选择器嵌套越深越难被覆盖」的原因——权重被一层层堆高了。
    </p>
    <p>
      关于 <code>!important</code> 还有个细节：如果两条规则都带了它，胜负并不会因为感叹号而继续升级，而是回到特异性与声明顺序上再比一次。也就是说，感叹号只是把这条声明抬进一个更高的小组，组内仍要按老规矩排座次，它并不是可以无限叠加的万能加成。
    </p>
    <p>
      但优先级只是其中一个维度，还有另一个维度叫<strong>继承</strong>。有些属性天生会向下传递：<code>color</code>、<code>font-*</code>、<code>line-height</code> 这类文本属性默认被子元素继承；而 <code>margin</code>、<code>padding</code>、<code>border</code> 不会继承。所以你看到子元素「有样式」，未必是它被某条规则选中了，也可能只是从父级继承下来的——这解释了为什么有时改了父级、一片子元素跟着变。
    </p>
    <p>
      继承带来的一个典型误解是「我把样式写在父级上，子级就自动有了」。这在文本属性上确实成立，也常被当成省事的写法，但它有个后果：层级越多、继承链越长，某个属性到底从哪一层传下来就越难追。真正需要精确控制时，还是显式写在目标元素上更稳妥。
    </p>
    <p>
      继承还能被显式控制。三种取值要分清：<code>inherit</code> 强制继承父元素的值；<code>initial</code> 取该属性的初始值（注意不是「浏览器的默认外观」，而是规范里的初始值）；<code>unset</code> 是二选一——可继承的属性就当作 inherit，不可继承的就当作 initial。想一次重置一大片属性，可以用 <code>all: initial</code>。
    </p>
    <div class="lesson-box hint">
      <strong>正确的解法不是继续加权重：</strong>与其不断抬高特异性，不如回头<strong>重构选择器</strong>。用类名替代 ID、减少无谓的嵌套、把职责相近的规则合并，让覆盖自然发生。这样代码的强弱关系始终清晰，排查时也能一眼看到真正的来源。
    </div>

    <h2>层叠与继承的验证</h2>
    <figure class="lesson-figure">
      <figcaption>切换层叠、!important 与继承三页，验证每条规则的胜负与继承结果。</figcaption>
      <C06Cascade />
    </figure>

    <h2>胜负判定的两层</h2>
    <p>
      「样式不生效」的答案分两层：先按特异性判定谁赢，ID 高于类、类高于类型，同级时后声明者胜；再看是不是继承在起作用，可继承的属性会从父级传下来。把 <code>!important</code> 当成兜底而不是常规手段，靠降特异性来解决覆盖，样式表才能长期保持可维护。
    </p>
    <div class="lesson-term">
      <span class="term-name">「层叠与优先级」</span>指命中同一元素的多个规则先比较<strong>特异性</strong>——ID &gt; 类/属性/伪类 &gt; 类型/伪元素，同级时后声明的覆盖；<code>!important</code> 能越过所有普通声明。另一个维度是<strong>继承</strong>：<code>color</code>、<code>font-*</code> 等文本属性默认向下继承，<code>margin</code>/<code>padding</code>/<code>border</code> 不继承。显式控制用 <code>inherit</code>（强制继承）、<code>initial</code>（取初始值）、<code>unset</code>（可继承则继承，否则初始值）。
    </div>
  </LessonArticle>
</template>
