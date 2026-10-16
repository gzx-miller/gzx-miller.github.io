<script setup lang="ts">
import PY06DictSets from './PY06DictSets.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把列表当成字典的键写下去——<code>"x"</code> 换成 <code>{[1, 2]: "x"}</code>——程序立刻抛 <code>TypeError: unhashable type: 'list'</code>。同样是「往里装东西」，为什么字典偏偏不收这个键？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      字典用键找值：<code>user = {"name": "Ada"}</code>，<code>user["age"] = 23</code> 就能加一项，<code>user["name"]</code> 取出对应值。集合则像一个去了重的袋子：<code>{1, 2, 3}</code> 里重复元素自动消失，判断「在不在」几乎瞬时。
    </p>
    <p>
      它们看起来简单，但有两处高频的意外：访问不存在的键，为什么有时报 <code>KeyError</code>、有时却给 <code>None</code>？以及为什么 <code>{[1, 2]}</code> 会直接被拒绝？把这两点讲清楚，字典和集合的脾气就摸清了。
    </p>

    <h2>字典的键值映射与 in / get</h2>
    <p>字典把<strong>键映射到值</strong>，键唯一。两种取值的区别很关键：</p>
    <ul>
      <li><code>d[key]</code>：键不存在会抛 <code>KeyError</code>，适合「键一定在」的场景。</li>
      <li><code>d.get(key, default)</code>：键不存在时返回默认值（省略则是 <code>None</code>），不抛异常，适合「不确定在不在」的场景。</li>
    </ul>
    <p>
      <code>in</code> 判断的是<strong>键</strong>是否存在，而不是值：<code>"name" in d</code>。删除用 <code>del d[key]</code> 或 <code>d.pop(key)</code>，后者能顺带取回被删的值，键不存在时还能给出默认值。
    </p>

    <h2>setdefault 与 items / keys / values，插入顺序</h2>
    <p>从 3.7 起，字典<strong>保证保持插入顺序</strong>——遍历时按加入的先后进行，这让你可以把它当作有序映射来用。</p>
    <ul>
      <li><code>d.items()</code> 给出「键值对」，供 <code>for k, v in d.items()</code> 遍历；<code>d.keys()</code> / <code>d.values()</code> 分别给出键与值的视图。</li>
      <li><code>d.setdefault(key, default)</code>：键存在就返回已有值，不存在就<strong>写入默认值</strong>再返回。常用于「分组」：<code>groups.setdefault(k, []).append(v)</code>。</li>
    </ul>

    <h2>集合：去重与无序</h2>
    <p>
      集合 <code>set</code> 是一组<strong>唯一、无序</strong>的元素：重复元素被自动去掉，且没有下标，不能按位置访问。它的强项是成员判断和数学运算——<code>x in s</code> 的平均代价接近常数，比在列表里逐个比对快得多。
    </p>
    <p>
      注意空集合要写 <code>set()</code>，因为 <code>{}</code> 是空字典而非空集合。集合本身是可变的（能 <code>add</code> / <code>remove</code>），但元素必须可哈希。
    </p>

    <h2>集合运算与 frozenset</h2>
    <p>集合支持熟悉的数学运算：</p>
    <ul>
      <li><code>a | b</code> 并集、<code>a &amp; b</code> 交集、<code>a - b</code> 差集、<code>a ^ b</code> 对称差（只在其中一个里的元素）。</li>
      <li>对应的方法有 <code>union</code> / <code>intersection</code> / <code>difference</code> / <code>symmetric_difference</code>，也有就地版本如 <code>a.update(b)</code>。</li>
    </ul>
    <p>
      <code>frozenset</code> 是<strong>不可变</strong>的集合，因此它可哈希、能当字典键或放进另一个集合；普通 <code>set</code> 可变，不能这么用。
    </p>

    <h2>键必须可哈希</h2>
    <p>
      字典的键、集合的元素都必须<strong>可哈希</strong>——也就是在生命周期内不可变、且能算出一个稳定的哈希值。数字、字符串、元组（内部元素全不可变）都可以；列表、字典、集合不行，写 <code>{[1, 2]: "x"}</code> 会抛 <code>TypeError: unhashable type: 'list'</code>。
    </p>
    <p>
      原因很直接：字典靠哈希值定位键，如果键能被就地修改，哈希就会变，整个查找结构随之失效。所以「可哈希」和「不可变」是绑在一起的——这也解释了为什么 <code>frozenset</code> 能当键而 <code>set</code> 不能。
    </p>

    <div class="lesson-box warn">
      <strong>常见误区：</strong>用 <code>d[key]</code> 访问可能不存在的键（该用 <code>get</code>）；把 <code>set</code> 当有序容器用（它不保证顺序）；忘掉空集合要写 <code>set()</code>。用集合去重要想保住顺序，应先遍历原序列、用集合仅作「是否见过」的判断。
    </div>

    <h2>看一遍字典与集合的行为</h2>
    <figure class="lesson-figure">
      <figcaption>在上方字典面板里输入键值做添加与删除，看 <code>d.get()</code> 与 <code>in</code> 的结果变化；再切下方集合运算的 <code>|</code> / <code>&amp;</code> / <code>-</code> / <code>^</code> 按钮，观察并、交、差、对称差的结果。</figcaption>
      <PY06DictSets />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      字典是键到值的映射，取值要分清 <code>d[key]</code>（缺键报 <code>KeyError</code>）与 <code>get</code>（缺键给默认值），<code>in</code> 判断的是键，3.7 起保持插入顺序；集合唯一且无序，擅长成员判断与 <code>|</code> / <code>&amp;</code> / <code>-</code> / <code>^</code> 运算，<code>frozenset</code> 不可变因而可哈希；字典的键和集合的元素都必须可哈希，所以可变类型不能充当它们。
    </p>
    <div class="lesson-term">
      <span class="term-name">「可哈希」</span>指对象在生命周期内不可变、并能算出一个稳定哈希值，从而可作为字典键或集合元素。边界与例外：元组只有内部所有元素都可哈希时才可哈希；<code>frozenset</code> 可哈希而 <code>set</code> 不可；列表、字典、集合都不可哈希。
    </div>
  </LessonArticle>
</template>
