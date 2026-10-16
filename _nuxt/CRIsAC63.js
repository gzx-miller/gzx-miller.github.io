const e=`<script setup lang="ts">
import J10EventDelegation from './J10EventDelegation.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表里的按钮是动态渲染出来的，新加一门课就多一个按钮。给每个按钮都挂 <code>click</code> 监听，代码越写越乱，删掉课程时还得记住把监听器摘掉；后来改成只在外面那层容器上挂一个 <code>click</code>，新增、删除的按钮照样能点。一个监听器，凭什么能管住一整片会变的元素？
    </div>

    <h2>事件要经过三站</h2>
    <p>
      一次点击，并不是在目标元素上「啪」一下就结束。事件从窗口一路传下来，经过捕获阶段到达目标，再沿着原路冒泡回去——这条完整路径就是<strong>事件流</strong>。
    </p>
    <ul>
      <li><strong>捕获阶段</strong>：从根节点向下，途经的每个元素依次收到事件，只有以 <code>capture: true</code> 注册的监听器才会在这里触发。</li>
      <li><strong>目标阶段</strong>：事件到达真正触发的那个元素。</li>
      <li><strong>冒泡阶段</strong>：从目标向上回到根，默认注册的监听器都在这一阶段触发。</li>
    </ul>
    <p>
      冒泡这一步是后面「事件委托」得以成立的前提——正因为事件会自己向上走，父节点才有机会收到子节点的事件。
    </p>

    <h2>监听器的三个开关</h2>
    <p>
      注册监听器最常用的写法是 <code>addEventListener(type, handler)</code>，它的第三个参数（或 <code>options</code> 对象）能改变触发行为：
    </p>
    <ul>
      <li><code>capture</code>：在捕获阶段触发，默认 <code>false</code> 走冒泡。</li>
      <li><code>once</code>：触发一次后自动移除，适合只做一次的初始化。</li>
      <li><code>passive</code>：承诺这个监听器不会调用 <code>preventDefault</code>，常用于 <code>scroll</code>、<code>touchstart</code>，让滚动更顺。</li>
    </ul>
    <p>
      还要把 <code>preventDefault</code> 与 <code>stopPropagation</code> 分清楚：
    </p>
    <ul>
      <li><code>preventDefault</code> 阻止的是<strong>默认行为</strong>（链接跳转、表单提交），事件本身仍然继续传播。</li>
      <li><code>stopPropagation</code> 阻止的是<strong>继续传播</strong>，默认行为该发生的还会发生。</li>
    </ul>
    <p>
      两者管的是完全不同的两件事，混用就会漏掉一半效果。
    </p>

    <h2>两个不同的目标</h2>
    <p>
      监听器里最常被读错的是 <code>e.target</code> 与 <code>e.currentTarget</code>。前者是<strong>真正被点中的元素</strong>——可能是列表项里的一层 <code>span</code> 或图标；后者是<strong>挂着这个监听器的元素</strong>，无论点了内部哪个子元素，它都不变。
    </p>
    <p>
      正因为 <code>currentTarget</code> 是稳定的，事件委托才有可能：你在一个不动的父容器上挂一次监听，事件里 <code>currentTarget</code> 永远是它，而 <code>target</code> 才是那个每次都在变的子元素。
    </p>

    <h2>一个监听器管一片</h2>
    <p>
      把上面两点合起来，就是<strong>事件委托</strong>：不再给每个子元素单独挂监听，而是在<strong>稳定的父节点上挂一个 handler</strong>，触发时用 <code>e.target</code> 判断究竟是哪一项。
    </p>
    <p>
      判断通常分两步——先用 <code>closest()</code> 向上找带特征的祖先，再用 <code>dataset</code> 读出数据：
    </p>
    <ul>
      <li><code>const btn = e.target.closest('button[data-id]')</code>，找不到就 <code>return</code>，避免点到空隙时误判。</li>
      <li>读 <code>btn.dataset.id</code> 拿到这一项的标识，据此分派业务。</li>
      <li>动态增删子节点自动受益：新按钮不需要重新绑定，删掉的元素也不会留下悬空的监听器。</li>
    </ul>
    <p>
      这正好回答了开头的问题：监听器挂在稳定的父节点上，里面的元素怎么变都不影响它。
    </p>

    <h2>不冒泡的那些事件</h2>
    <p>
      委托依赖冒泡，可偏偏有几个事件天生不冒泡：<code>focus</code>、<code>blur</code>、<code>scroll</code>。它们在目标上触发后不会向上传递，父节点上的冒泡监听器收不到。
    </p>
    <p>
      办法是改用<strong>捕获阶段</strong>：把父级监听器注册成 <code>capture: true</code>，事件在向下传递的捕获阶段就会经过父节点，委托照样成立。
    </p>
    <p>
      最后是关于移除：<code>removeEventListener</code> 必须传入与注册时<strong>同一个函数引用</strong>，匿名函数是摘不掉的。委托的额外好处正是监听器数量骤减，需要移除的也就少了；如果监听器是在 <code>setup</code> 或挂载时加的，记得在卸载的生命周期里用同一个引用把它摘掉。
    </p>

    <h2>动态列表的委托验证</h2>
    <figure class="lesson-figure">
      <figcaption>在父容器上挂一个 <code>click</code>，用 <code>closest('button[data-course]')</code> 找到被点的按钮、再从 <code>dataset</code> 读出课程名。注意按钮是动态渲染的，父级监听器却一个都不用改。</figcaption>
      <J10EventDelegation />
    </figure>

    <h2>把监听器提到父节点</h2>
    <p>
      事件流是「捕获 → 目标 → 冒泡」的一条路径，<code>addEventListener</code> 的 <code>options</code> 决定监听器落在哪一段、触发几次；<code>preventDefault</code> 与 <code>stopPropagation</code> 分别管默认行为与传播；<code>target</code> 是真正触发的元素，<code>currentTarget</code> 是挂监听器的元素。把监听器集中到稳定的父节点、用 <code>closest</code> 与 <code>dataset</code> 分派，就是事件委托——它用一个监听器接住一整片会变的子元素，代价小、维护成本低；遇到 <code>focus</code>、<code>blur</code>、<code>scroll</code> 这类不冒泡的事件，改走捕获阶段即可。
    </p>
    <div class="lesson-term">
      <span class="term-name">「事件委托」</span>指不在每个子元素上分别注册监听器，而是利用<strong>事件冒泡</strong>，在稳定的父节点上注册<strong>一个</strong>监听器，触发时用 <code>event.target</code> 配合 <code>closest()</code> 找到真正被操作的子元素，再用 <code>dataset</code> 读出它的数据来分派。它天然适配动态增删的子节点，也大幅减少监听器数量；对 <code>focus</code>、<code>blur</code>、<code>scroll</code> 等不冒泡的事件，则需改在<strong>捕获阶段</strong>监听。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
