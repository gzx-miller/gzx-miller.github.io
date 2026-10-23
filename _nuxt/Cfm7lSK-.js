const e=`<script setup lang="ts">
import J04ObjectOperations from './J04ObjectOperations.vue'
import J17OptionalNullish from './J17OptionalNullish.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>编辑表单时想保留原始数据，写了 <code>const draft = original</code>，改完 <code>draft.name</code>，提交时却发现 <code>original</code> 也被改了；有人提醒要「复制一份」，可换成 <code>{ ...original }</code> 后，改一个深层字段，原对象还是跟着变。到底复制到第几层才算安全？
    </div>

    <h2>取值与属性简写</h2>
    <p>
      拿对象里的值，第一反应是点访问 <code>user.name</code>：直观、能被编辑器补全。可它有个前提——键名在写代码时就得定下来。要取的键来自变量时，比如循环里的 <code>user[key]</code>，就必须换成<strong>方括号访问</strong>，把「哪个键」当作运行时的值算出来。
    </p>
    <p>
      顺着这个思路，创建对象时也可以用变量当键：<code>{ [key]: value }</code> 叫<strong>计算属性名</strong>。而当变量名和键名刚好相同时，可以省掉一半：<code>{ name, role }</code> 就是<strong>属性简写</strong>，等价于 <code>{ name: name, role: role }</code>。
    </p>

    <h2>遍历对象的属性</h2>
    <p>
      要列出所有属性，最直觉的是 <code>for...in</code>。但它会把原型链上可枚举的属性也一并带出来，结果里混进不属于自己的键。
    </p>
    <p>
      更稳的做法是用 <code>Object.keys</code>、<code>Object.values</code>、<code>Object.entries</code>，它们只取对象<strong>自身</strong>的可枚举属性，分别给出键数组、值数组、以及键值对数组。<code>entries</code> 配合解构写循环，键和值一次都拿到。
    </p>

    <h2>解构与展开语法</h2>
    <p>
      解构让取值更直接：<code>const { name, city } = user</code>，一行把需要的字段拎出来。它还有三样进阶用法：
    </p>
    <ul>
      <li><strong>默认值</strong>：<code>const { city = '未知' } = user</code>，字段缺失或为 <code>undefined</code> 时兜底。</li>
      <li><strong>重命名</strong>：<code>const { name: userName } = user</code>，取出后换个新名字，避开外层同名变量。</li>
      <li><strong>嵌套</strong>：<code>const { address: { city } } = user</code>，直接深入到内层，但要注意 <code>address</code> 若不存在会报错。</li>
    </ul>
    <p>
      对应的展开语法 <code>{ ...user }</code> 则把所有属性摊开。它常用于合并，同名键<strong>后面的覆盖前面的</strong>，顺序本身就是语义。
    </p>

    <h2>浅拷贝的边界</h2>
    <p>
      回到开头的 bug。<code>const draft = original</code> 只是给同一个对象又起了一个名字，改谁都是改它。换成 <code>{ ...original }</code> 确实生成了新对象，可它只复制了<strong>第一层</strong>——嵌套的对象、数组依旧指向原来那一个，你改 <code>draft.address.city</code>，<code>original.address.city</code> 照样变。
    </p>
    <p>
      这种「只复制表层」的行为，就叫<strong>浅拷贝</strong>。想在改动时不碰到原数据，得把要改动的那条路径<strong>逐层展开</strong>：<code>{ ...original, address: { ...original.address, city } }</code>。只重建被改的层级，其余引用原样带过来，既做到不可变更新，又不必整棵对象深挖一遍。
    </p>

    <h2>安全读取深层字段</h2>
    <p>
      取深层字段时，中途任何一层是 <code>null</code> 或 <code>undefined</code>，点访问都会直接抛错。旧办法是写一长串 <code>user &amp;&amp; user.address &amp;&amp; user.address.city</code>，嵌套一深就没法看。
    </p>
    <p>
      <strong>可选链 <code>?.</code></strong> 把这件事收进语法：<code>user.address?.city</code>，一旦 <code>address</code> 为空，整条链<strong>就地短路</strong>，返回 <code>undefined</code>，后面不再求值，也不会报错。
    </p>
    <p>
      兜底值则交给<strong>空值合并 <code>??</code></strong>：<code>user.address?.city ?? '未设置'</code>。注意它和 <code>||</code> 的区别——<code>||</code> 把 <code>0</code>、<code>''</code> 也当作空值换掉，而 <code>??</code> <strong>只在 <code>null</code> 与 <code>undefined</code> 时</strong>取默认值。
    </p>

    <h2>亲手改一份副本</h2>
    <figure class="lesson-figure">
      <figcaption>在表单里编辑字段，观察解构、剩余与展开如何创建新对象，而原数据保持不变。</figcaption>
      <J04ObjectOperations />
    </figure>
    <figure class="lesson-figure">
      <figcaption>逐个点按钮，观察字段缺失时 <code>?.</code> 短路、<code>??</code> 兜底的效果。</figcaption>
      <J17OptionalNullish />
    </figure>

    <h2>复制时想清楚深浅</h2>
    <p>
      对象是引用类型，赋值传递的是同一份数据，展开只复制表层——把这两点放在心上，就能想明白为什么「改副本却动了原数据」。取值交给点访问和方括号，遍历交给 <code>Object.keys</code> 系列，不可变更新靠逐层展开，读取深层字段靠 <code>?.</code> 与 <code>??</code>——对象的每一处操作，都有了明确的位置。
    </p>
    <div class="lesson-term">
      <span class="term-name">「浅拷贝」</span>指只复制对象第一层属性的复制方式，如 <code>{ ...obj }</code> 与 <code>Object.assign({}, obj)</code>；嵌套的对象、数组仍与原来共享同一引用，改动它们会波及原对象。要做到不可变更新，需沿被改动的路径逐层展开（如 <code>{ ...obj, address: { ...obj.address, city } }</code>）以重建每一层。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
