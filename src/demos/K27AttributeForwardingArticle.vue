<script setup lang="ts">
import K27AttributeForwarding from './K27AttributeForwarding.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>给封装好的发布按钮传了 <code>disabled</code> 和 <code>aria-label</code>，按钮却没被禁用、读屏也念不出名字——这些属性到底跑到哪去了？
    </div>

    <h2>包装组件属性落点</h2>
    <p>
      团队里做了一个按钮包装组件，把图标、间距和主题样式统一封装起来，各页面直接用就好。于是父组件这样写：传一个 <code>class</code> 调颜色，传 <code>data-track</code> 给埋点，传 <code>aria-label</code> 给无障碍，传 <code>disabled</code> 控制可用性，再挂一个 <code>@click</code> 处理点击。
    </p>
    <p>
      结果一半能用、一半不能用：埋点属性查得到，但按钮没被禁用，读屏软件也读不出名字。原因是这个包装组件的最外层套了一个布局用的 <code>div</code>，而默认情况下<strong>属性会落到组件的根节点上</strong>——落到那个 <code>div</code> 上，语义自然全错了。要让封装组件既增强功能、又不阉掉原生能力，就必须先弄清楚属性是怎么流动的。
    </p>

    <h2>原生属性逐项声明</h2>
    <p>
      最省事的做法：在包装组件里把可能用到的原生属性一个个声明成 <code>props</code>，再逐个绑到内部真正的 <code>button</code> 上。<code>class</code> 一个 prop、<code>disabled</code> 一个 prop、标题一个 prop，需要什么加什么。
    </p>
    <p>
      这个方案做对了一件事：<strong>转发这件事变成了显式的、看得见的</strong>。哪条属性去了哪里，读代码时清清楚楚，不会出现「悄悄落到错误节点」的情况。
    </p>

    <h2>属性集合的开放性</h2>
    <ul>
      <li>平台的原生属性是开放集合，包装组件永远追不上：今天补了 <code>disabled</code>，明天要用 <code>tabindex</code>、<code>autofocus</code>、<code>form</code>，又得再声明一轮。</li>
      <li>被声明成 <code>props</code> 的属性会从透传集合里被「消费」掉，一旦漏了一个，父组件传的值既不生效、也拿不到，排查起来只能靠猜。</li>
      <li>多根节点的组件不会自动透传，属性不知道该落到哪个节点上，往往直接丢失。</li>
      <li>在 <code>emits</code> 里声明过的事件，对应的监听器就不再出现在透传集合里；没声明的反而会留下——这个差异很容易让人误判。</li>
    </ul>

    <h2>未声明属性自动透传</h2>
    <p>
      换一个思路：不要逐个搬运，而是先认识「哪些东西本来就会自动流动」。凡是没有被 <code>props</code> 或 <code>emits</code> 声明的属性——<code>class</code>、<code>style</code>、<code>id</code>、<code>disabled</code>、<code>aria-*</code>、<code>data-*</code>，以及各种事件监听器——都会成为<strong>透传属性</strong>，统一进入 <code>$attrs</code>。
    </p>
    <p>
      接下来只需要决定它们落在哪个节点。单根组件默认把 <code>$attrs</code> 自动绑到根节点上（也就是 <code>inheritAttrs</code> 默认为 <code>true</code>）；当根节点不是真正想要的目标元素时，设置 <code>inheritAttrs: false</code> 关掉默认行为，再用 <code>useAttrs</code>（或 <code>$attrs</code>）把它精确转发到内部的真实元素上。
    </p>
    <table>
      <thead>
        <tr>
          <th>属性类别</th>
          <th>是否进入 $attrs</th>
          <th>常见落点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>class</code> / <code>style</code></td>
          <td>是，且会与目标节点自身的值合并</td>
          <td>内部真实元素，保留调用方样式</td>
        </tr>
        <tr>
          <td>未声明的原生属性</td>
          <td>是</td>
          <td>如 <code>disabled</code>、<code>aria-label</code>、<code>data-*</code></td>
        </tr>
        <tr>
          <td>未声明的事件监听</td>
          <td>是</td>
          <td>随属性一起转发到内部元素</td>
        </tr>
        <tr>
          <td>已声明的 <code>props</code> / <code>emits</code></td>
          <td>否，已被消费</td>
          <td>由组件自己按业务逻辑使用</td>
        </tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>两个转发时的坑：</strong>其一，<code>v-bind=&quot;$attrs&quot;</code> 的顺序会影响覆盖——写在后面的同名属性会盖掉前面的，标签里已经写死的属性别被顺手冲掉。其二，透传集合里本来就包含事件监听，如果一边 <code>v-bind=&quot;$attrs&quot;</code>、一边又手动再绑一次同样的点击事件，就会重复触发。
    </div>
    <p>
      还有一层判断容易被忽略：<strong>不是所有属性都该被转发</strong>。如果一条属性是组件自己要解读的业务语义，就应该老老实实声明成 <code>props</code>，由组件决定怎么用；只有那些「组件完全不关心、只是替原生元素保管」的属性，才适合走透传。判断标准很简单：这条属性会不会改变组件的行为？会，就声明成 prop；不会，就让它透传过去。一旦把语义属性也随手透传到内部节点上，反而会让组件内部元素被外部意外控制。
    </p>
    <p>
      最后收一下边界：多根节点组件必须明确把 <code>$attrs</code> 绑到某个节点上，否则属性会被丢掉；而 <code>$attrs</code> <strong>不是深层响应式的业务状态</strong>，不要监听它去驱动复杂逻辑，它只是在父与子之间搬运「组件没打算自己处理的那部分属性」。这样封装组件才能在加壳的同时，把原生能力完整地交还给调用方。
    </p>

    <h2>禁用态与事件回传</h2>
    <figure class="lesson-figure">
      <figcaption>勾选「禁止发布」看 disabled 是否真的生效，再点按钮确认父组件的点击事件仍能收到。</figcaption>
      <K27AttributeForwarding />
    </figure>

    <h2>消费与转交边界</h2>
    <p>
      属性透传解决的是封装带来的副作用：一旦给原始元素套上外壳，属性的默认落点就变了。做法是先把「组件自己消费的」和「应该转交给原生元素的」分开，再决定 <code>$attrs</code> 的去向——默认落到根节点是最省事的，根节点不对就关掉继承、显式转发。封装增强什么都可以，唯独不该悄悄吃掉原生能力。
    </p>
    <div class="lesson-term">
      <span class="term-name">「透传属性」</span>指未被 <code>props</code> 或 <code>emits</code> 声明的属性（<code>class</code>、<code>style</code>、<code>disabled</code>、<code>aria-*</code>、<code>data-*</code>、事件监听等），它们会进入 <code>$attrs</code>。单根组件默认自动把它们落到根节点；设置 <code>inheritAttrs: false</code> 后可用 <code>useAttrs</code> 或 <code>$attrs</code> 精确转发到内部目标元素，多根节点组件必须手动绑定 <code>$attrs</code>。
    </div>
  </LessonArticle>
</template>
