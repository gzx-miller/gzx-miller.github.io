<script setup lang="ts">
import C24AspectRatio from './C24AspectRatio.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>列表里的图片还没加载完时页面是好好的，图片一到，下面的内容「啪」地往下跳了一截——用户刚想点的按钮瞬间被推走了，这该怎么治？
    </div>

    <h2>提出问题</h2>
    <p>
      设想你在做课程列表：每条课程都配一张封面图，图片地址由接口返回，尺寸并不固定——有的 16:9，有的 4:3，有的干脆是方图。你按设计稿给图片容器写了一个固定高度，以为这样就能先把位置占好。
    </p>
    <p>
      上线后冒出两个问题。第一，图片还没下载完时容器的高度不对，<strong>图一加载出来，下面的内容整体往下跳，用户刚要点的地方被推走，甚至误触</strong>——这就是布局偏移。第二，为了消掉跳动你改用固定宽高，结果<strong>比例不同的图片被强行拉伸，人物都变形了</strong>。<strong>要跳出这个两难，得先意识到：「元素占多大地方」和「图片在盒子里怎么放」其实是两件事。</strong>把它们混在一起来解决，才会两头都做不好。
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法是把尺寸写死：给图片 <code>width: 300px; height: 200px</code>。
    </p>
    <p>
      它做对了一件重要的事：<strong>布局在图片到达之前就已经确定</strong>，浏览器不必等图片下载完才决定页面长什么样，跳动消失了。承认这一点很关键——避免布局偏移的正解，本来就是「提前把空间留出来」；我们可以保留这份功劳，只把「写死的数字」换成「比例」。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>写死宽高会让比例不同的图片被拉伸变形，因为 <code>img</code> 默认的填充方式就是 <code>object-fit: fill</code>。</li>
      <li>固定像素宽度在响应式下不成立：容器变窄时，图片不会跟着变。</li>
      <li>每种比例都要手算一遍高度，新增一种比例就得改一次样式。</li>
      <li>容器尺寸变化时，高度不会跟着宽度推导，于是产生留白或溢出。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      历史上最常见的绕法是「padding 撑比例」：在外层容器上写 <code>padding-top: 56.25%</code>，让高度等于宽度的 56.25%（也就是 16:9），再把真正的内容绝对定位铺满其中。
    </p>
    <p>
      它做对了：<strong>用百分比 padding 撑出一个随宽度变化的高度</strong>，比例稳定、兼容性好。问题是它需要一个额外的定位包裹层，子元素必须全部改成绝对定位，<code>56.25%</code> 这种数字也看不出对应哪个比例，维护起来并不直观。
    </p>
    <p>
      后来 CSS 把这件事变成了一条声明：<code>aspect-ratio</code>。它直接表达「宽高比」，由宽度推导高度：
    </p>
    <p>
      <code>.cover { width: 100%; aspect-ratio: 16 / 9; }</code>
    </p>
    <p>
      浏览器在<strong>布局阶段</strong>就能算出元素高度，图片有没有到位都不影响，跳动从根上消失。想让宽度有上限、超过就停下，可以叠加 <code>max-width</code>。比例也不限于宽屏：<code>1 / 1</code> 是正方，<code>4 / 3</code> 是传统比例，<code>21 / 9</code> 是超宽幅——写成分数形式，比记忆那串百分比清楚得多。
    </p>
    <p>
      但 <code>aspect-ratio</code> 只解决了「占多大地方」，没解决「图片怎么放进去」。图片本身的原始比例如果和盒子不一致，就会出现拉伸或留白。这时交给 <code>object-fit</code>——它决定替换元素（如 <code>img</code>、<code>video</code>）在给定盒子里的填充方式。
    </p>
    <table>
      <thead>
        <tr>
          <th>取值</th>
          <th>效果</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>fill</code>（默认）</td>
          <td>拉伸填满整个盒子，可能改变原始比例、出现变形</td>
        </tr>
        <tr>
          <td><code>contain</code></td>
          <td>保持比例完整显示，装不满的方向留白</td>
        </tr>
        <tr>
          <td><code>cover</code></td>
          <td>保持比例放大到填满盒子，超出部分被裁掉</td>
        </tr>
        <tr>
          <td><code>none</code></td>
          <td>完全不缩放，保持原始尺寸，可能溢出或被裁</td>
        </tr>
        <tr>
          <td><code>scale-down</code></td>
          <td>在 <code>none</code> 与 <code>contain</code> 中取较小的那个，即「只在需要缩小时才缩」</td>
        </tr>
      </tbody>
    </table>
    <p>
      实践中最常用的是 <code>cover</code>：无论原图是什么比例，它都能铺满容器且不变形，代价是边缘会被裁掉一点。裁掉哪一部分可以用 <code>object-position</code> 调整，例如人像常写 <code>object-position: center top</code>，把视觉重心留在上方。
    </p>
    <div class="lesson-box warn">
      两个必须记住的点。<strong>第一，<code>object-fit</code> 只有在图片盒子有明确尺寸时才看得出效果</strong>——通常要写 <code>width: 100%; height: 100%</code>，否则盒子跟着图片走，自然无从「填充」。<strong>第二，<code>cover</code> 只是「显示时裁掉」，图片文件本身并没有被裁切</strong>，它的体积与流量一分没少；需要真正裁剪请另做处理。
    </div>
    <p>
      把两者合起来，就是防布局偏移的标准写法：
    </p>
    <p>
      <code>.cover { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; object-position: center; }</code>
    </p>
    <p>
      <code>aspect-ratio</code> 负责在图片下载前就把空间占好，<code>object-fit: cover</code> 负责图片到位后铺满且不变形。<strong>两张拼图各管一段，缺一条都会退回开场的那个问题</strong>：只留 <code>aspect-ratio</code>，图片会被拉伸；只留 <code>object-fit</code>，加载时照样跳。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>先展开「比值演示」看不同宽高比如何由宽度推导高度，再逐个切换 object-fit 观察图片在盒子里的填充差异。</figcaption>
      <C24AspectRatio />
    </figure>

    <h2>总结</h2>
    <p>
      <code>aspect-ratio</code> 与 <code>object-fit</code> 解决的是两件相邻但不同的事。前者回答「这个盒子该占多大」——在布局阶段就由宽度推出高度，把位置提前留好，从而消掉布局偏移；后者回答「图片该怎么装进这个盒子」——<code>cover</code> 裁剪铺满、<code>contain</code> 完整留白、<code>fill</code> 拉伸变形、<code>none</code> 不缩放、<code>scale-down</code> 取较小者。两者配合，才是「加载前不跳、加载后不变形」的完整答案。
    </p>
    <div class="lesson-term">
      <span class="term-name">「aspect-ratio 与 object-fit」</span>前者用比值（如 <code>16 / 9</code>、<code>1 / 1</code>）固定元素的宽高比，浏览器在布局阶段即可由宽度推导高度，常用于给图片、视频提前预留空间以消除布局偏移；后者决定替换元素在其盒子内的填充方式：<code>fill</code> 拉伸填满（默认）、<code>contain</code> 完整显示可能留白、<code>cover</code> 保持比例裁剪铺满、<code>none</code> 保持原始尺寸、<code>scale-down</code> 取 <code>none</code> 与 <code>contain</code> 中较小者。两者结合通常写作 <code>width: 100%; aspect-ratio: 16 / 9; object-fit: cover;</code>。
    </div>
  </LessonArticle>
</template>
