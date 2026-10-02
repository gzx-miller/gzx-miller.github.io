const e=`<script setup lang="ts">
import J04ObjectOperations from './J04ObjectOperations.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>资料卡上只把姓名从一个对象里读出来、换了个新名字，结果交回去的对象里 <code>role</code> 和 <code>city</code> 全没了——我只想改一个字段，其余的字段去哪了？
    </div>

    <h2>资料卡字段更新</h2>
    <p>
      你在做一张用户资料卡，上面三个字段：姓名、城市、角色。用户改了姓名，你要把新的资料交给组件重新渲染，同时希望表单上「取消」按钮还能回到改之前的样子。
    </p>
    <p>
      如果直接在原对象上赋值——也就是写 <code>profile.name = 新值</code>——改动看起来最省事，代价却立刻出现：旧的那份数据已经不存在了，「取消」无处可回；如果这个对象被两个组件共享，一次编辑会让另一个组件也重组；框架层面也无法判断「这次的数据和上次是不是同一份」，因为引用没变，变化就藏在了对象内部。所以这里需要的是一件明确的事：<strong>在不修改原对象的前提下，得到一份更新后的新对象</strong>。
    </p>

    <h2>逐字段手动复制</h2>
    <p>
      最朴素的做法是手动逐字段复制：声明一个新对象，把 <code>name</code>、<code>city</code>、<code>role</code> 一个个抄进去，最后把要改的那个字段写成新值。
    </p>
    <p>
      这个方案做对了一件事：<strong>它确实产生了一个新对象</strong>，原对象原封不动，这样一来「取消」有据可依、框架也能看到引用变化。方向是对的，麻烦出在写法上。
    </p>

    <h2>漏抄字段隐患</h2>
    <ul>
      <li>字段一多就要写十几行赋值，将来给对象新增一个字段时最容易漏抄，而漏抄不会报错，只会让这个字段悄悄变成 <code>undefined</code>。</li>
      <li>读取时满屏都是 <code>profile.name</code>、<code>profile.city</code>，模板里带上前缀之后越写越长，深层字段还要逐层判断中间对象是否存在。</li>
      <li>「除 <code>name</code> 之外的其他字段全都保留」这种需求，手动写就等于把剩下的字段名再列一遍，结构一改就要改两处。</li>
      <li>嵌套结构更棘手：想更新 <code>address.city</code> 时直接赋值，改到的其实是原对象里那个内层对象，原数据还是被污染了。</li>
    </ul>

    <h2>解构与展开语法</h2>
    <p>
      第一处改进针对「读」：用解构赋值按属性名一次性把需要的字段取成局部变量。写 <code>const { name, city } = profile</code>，左边靠名字与右边对齐，与写在哪个位置无关；数组则按位置解构，写成 <code>const [first, second] = list</code>。解构还支持默认值：属性不存在或为 <code>undefined</code> 时给一个兜底，省掉一整行判断。
    </p>
    <p>
      第二处针对「其余全都要」：用剩余语法把没被显式取走的字段一次性收进一个新对象，写成 <code>const { name, ...details } = profile</code>。这样以后给对象增加字段，剩余部分会自动带上它，不需要回来改第二处。
    </p>
    <p>
      第三处针对「合并且覆盖」：用展开语法把原对象的可枚举自有属性逐一复制进新对象，随后写的同名属性覆盖前面的。于是「保留其他字段 + 覆盖一个字段」可以一行完成，例如 <code>{ ...details, name: 新值 }</code>，原对象保持不变；要确认这次确实产生了新引用，可以用 <code>Object.is(新对象, 原对象)</code> 比对，结果为 <code>false</code> 才说明真的换了一份。要留意覆盖顺序完全由展开的位置决定——写在前面的先铺，写在后面的替换掉它。
    </p>
    <p>
      但这三样都只做<strong>浅层操作</strong>：只有第一层是新的，嵌套对象仍与原对象共享同一个引用。因此更新 <code>address.city</code> 时，必须沿着更新路径逐层展开：先展开最外层，再展开 <code>address</code>，最后覆盖 <code>city</code>，保证从外到内每一层都是新对象。只展开一层就以为万事大吉，是这段代码里最容易踩的坑——外层看是新对象，内层却已经被就地改掉了。
    </p>
    <p>
      最后是边界的取舍：需要一份彻底独立、连嵌套结构和 <code>Date</code>、<code>Map</code> 都复制出来的副本时，用 <code>structuredClone</code>；如果只是想让新对象的第一层与原来互不影响，展开语法就够，而且更快。判断标准很简单：<strong>我接下来会不会去改嵌套结构？不会的话，浅拷贝就够了；会的话，就沿路径逐层展开。</strong>
    </p>

    <h2>姓名字段更新验证</h2>
    <figure class="lesson-figure">
      <figcaption>在姓名输入框里改几个字，看名字被解构出来、转成大写，而城市与角色仍原样保留在新对象里。</figcaption>
      <J04ObjectOperations />
    </figure>

    <h2>构造新对象原则</h2>
    <p>
      解构、剩余与展开解决的其实是同一件事：用「构造一个新对象」来表达一次更新，而不是在旧对象上就地改写，于是旧数据永远有据可查。
    </p>
    <div class="lesson-term">
      <span class="term-name">「浅拷贝」</span>指只复制对象的第一层，嵌套对象仍与被复制对象共享同一个引用；展开语法、剩余语法与 <code>Object.assign</code> 都是浅拷贝。局部更新嵌套字段时要沿更新路径逐层展开，保证每一层都是新对象；需要完整深拷贝时再用 <code>structuredClone</code>。同名属性的覆盖顺序由展开位置决定，后展开的替换先展开的。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
