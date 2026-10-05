const e=`<script setup lang="ts">
import J14MapSetWeakRef from './J14MapSetWeakRef.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用普通对象给每个 DOM 节点存一份元数据，页面上的节点早就移除了，为什么内存占用不降反升？
    </div>

    <h2>去重集合与元数据字典</h2>
    <p>
      你手头有两件事：一是收集「不能重复」的标签集合，二是建一本「字典」，用某个对象当键、把它的附加数据存起来——典型场景就是给每个 DOM 节点挂一份自己的元数据。用最常见的数组和普通对象就能先跑起来，但这里埋着两颗雷：<strong>语义不对</strong>和<strong>内存漏</strong>。
    </p>
    <p>
      这两颗雷都不是「写错了代码」，而是「用了不匹配的工具」。容器的默认规则和你的真实意图不一致时，程序往往能跑，却在长期运行里慢慢出问题——数据被悄悄覆盖，或者内存一点点涨上去。
    </p>

    <h2>数组与对象存储</h2>
    <p>
      最省事的做法：标签用数组存，字典用普通对象 <code>{}</code> 当，键取节点的某个 <code>id</code>，值放数据。
    </p>
    <p>
      它背后还藏着一个隐含假设：键是字符串。<code>id</code> 确实是字符串，所以拿对象当字典看起来毫无问题。可一旦你想直接用节点对象本身做键——比如节点根本没有稳定的 <code>id</code>——这个假设就会立刻崩塌。
    </p>
    <p>
      这个方案做对了一件事：<strong>零学习成本、随手能写</strong>，数组能装、对象能查，小规模下确实够用。先用它把功能跑通、再回头换更合适的容器，这个顺序本身并没有错。真正的问题不在「能不能存」，而在它默认的规则和你想要的行为并不一致。
    </p>

    <h2>对象键字符串化</h2>
    <ul>
      <li>对象键会被字符串化：一旦直接拿对象当键，它会被转成 <code>"[object Object]"</code>，所有对象键撞成同一个，互相覆盖。</li>
      <li>数组不会去重：同一个标签加两次，你得自己每次遍历检查一遍 <code>has</code>，麻烦且容易漏。</li>
      <li>内存泄漏：普通对象、数组对键是<strong>强引用</strong>。节点从页面移除后，字典仍拽着它，垃圾回收无法释放——元数据本该随节点一起消失。</li>
      <li>顺序与污染：普通对象的键顺序不保证，还会把原型链上的属性一起带进来。</li>
    </ul>

    <h2>Map键类型与保序</h2>
    <p>
      <strong>第一层，用 Map 和 Set 换掉对象和数组。</strong><code>Map</code> 允许任意类型做键——包括对象、函数——用<strong>引用相等</strong>命中，不会像普通对象那样把键字符串化，因此不同对象不会互相覆盖；它还保持插入顺序，<code>size</code> 直接可读，需要按插入顺序遍历、或频繁增删键时，比普通对象更合适。<code>Set</code> 一句话保证值唯一，<code>add</code> 自动去重，省掉手写的 <code>has</code> 检查。
    </p>
    <p>
      <strong>第二层，解决引用导致的泄漏。</strong>把字典换成 <code>WeakMap</code>：它的键是<strong>弱引用</strong>，当键没有其他强引用时，条目会随键一起被垃圾回收自动消失，不会阻止回收。这正是给 DOM 节点或实例挂临时元数据的正确姿势——节点被移除、无人引用后，元数据自然跟着走。<code>WeakSet</code> 同理。
    </p>
    <p>
      代价是：<code>WeakMap</code> 与 <code>WeakSet</code> 不支持遍历，也没有 <code>size</code>，键不可枚举。它们只适合「顺着键找值」的临时关联，不能当需要枚举的字典用。
    </p>
    <p>
      这里有个容易误解的细节：弱引用说的是「不会被字典单方面拽住」，而不是「立刻消失」。只要你的代码里还留着那个节点对象，它就依然是强引用，元数据也照常存在；只有当它再没有任何其他引用时，垃圾回收才会连同条目一起清走。所以用 WeakMap 存元数据是安全的——你拿得到的对象，数据就一定还在。
    </p>
    <table>
      <thead>
        <tr><th>想做的事</th><th>选择</th></tr>
      </thead>
      <tbody>
        <tr><td>去重、判断是否存在</td><td><code>Set</code></td></tr>
        <tr><td>任意类型键、保持插入顺序、需要 <code>size</code></td><td><code>Map</code></td></tr>
        <tr><td>给 DOM 节点 / 实例挂临时元数据、不阻止回收</td><td><code>WeakMap</code> / <code>WeakSet</code></td></tr>
        <tr><td>需要枚举全部键或值</td><td>只能用 <code>Map</code>，弱引用集合做不到</td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <code>WeakRef</code> 与 <code>FinalizationRegistry</code> 能拿到对象的弱引用、并在回收时收到通知，但<strong>垃圾回收的时机不可预测</strong>，绝不能把关键业务逻辑压在这上面。
    </div>

    <h2>自动去重与任意键</h2>
    <figure class="lesson-figure">
      <figcaption>点标签试试：<code>Set</code> 自动去重，<code>Map</code> 用任意类型做键。</figcaption>
      <J14MapSetWeakRef />
    </figure>

    <h2>弱引用与生命周期</h2>
    <p>
      Map 与 Set 提供的是对象、数组不具备的<strong>明确语义</strong>（任意键、保序、唯一）；弱引用集合解决的则是生命周期——让附加数据跟着被附加的对象一起消失。选型时先问自己一句：我要的到底是语义，还是生命周期？
    </p>
    <div class="lesson-term">
      <span class="term-name">「Map / Set / WeakMap」</span><code>Map</code> 允许任意类型作键并保持插入顺序，<code>Set</code> 保证值唯一；<code>WeakMap</code> / <code>WeakSet</code> 的键是弱引用，键被回收时条目自动消失、不阻止垃圾回收，适合关联临时元数据，但不支持遍历与 <code>size</code>。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
