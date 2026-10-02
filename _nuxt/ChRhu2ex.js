const n=`<script setup lang="ts">
import SC05Collections from './SC05Collections.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>通知组件有成功、警告、危险三种状态，我照着第一份把另外两份复制了一遍；产品说再加一个「信息」态，改完发现三处里只有两处改对了——有没有办法只维护一份「状态清单」，让样式自己长出来？
    </div>

    <h2>变体增多引发重复</h2>
    <p>
      你在做一套通知提示：成功是绿色、警告是橙色、危险是红色。每个状态的规则骨架完全一样，都是「边框和文字换成这个状态的颜色」，区别只在类名后缀和那个色值。
    </p>
    <p>
      只写三个状态时，手抄两遍也能忍。可一旦状态增加到五六个，或者项目里还有徽标、标签、进度条各自一套状态色，重复就会不断放大：<strong>新增一个状态，要记得在每一个地方补一遍；同一个「危险红」还会在不同文件里各写一次。</strong>信息一多，漏改和写错只是时间问题。
    </p>

    <h2>逐状态手写规则</h2>
    <p>
      最朴素的写法就是原生 CSS：一个状态一条规则，手写到底。
    </p>
    <p>
      <code>.notice-success { border-color: #397a45; color: #397a45; }</code>
    </p>
    <p>
      <code>.notice-warning { border-color: #d17b24; color: #d17b24; }</code>
    </p>
    <p>
      这个做法对在哪？它最直白：打开文件看到的就是最终样式，浏览器里怎么显示、代码里就怎么写，没有任何构建工具参与，搜一个类名就能定位。两三个状态时，它就是最省事的答案。
    </p>

    <h2>硬编码与清单缺失</h2>
    <ul>
      <li>三条规则的骨架完全一样，重复的其实是「同一件事」，只是数据不同。</li>
      <li>新增状态必须手动补一条完整规则，遗漏或命名不统一，全靠人眼发现。</li>
      <li>色值硬编码在规则里，同一个「危险红」换个地方又写一遍，改品牌色要全局搜索替换。</li>
      <li>没有任何地方能回答「我们一共定义了哪些状态」——这份清单只存在于你脑子里。</li>
    </ul>

    <h2>清单驱动规则生成</h2>
    <p>
      症结不在「重复」，而在我们把<strong>数据</strong>和<strong>规则</strong>写死在了一起。换个思路：先把「状态名 → 颜色」这份清单本身表达出来，再让规则从清单里推出来。Sass 里表达键值清单的结构叫 <strong>Map</strong>，一对花括号里写着一项项键值对：
    </p>
    <p>
      <code>$status-colors: ("success": #397a45, "warning": #d17b24, "danger": #b93f35,);</code>
    </p>
    <p>
      有了清单，就用 <code>@each</code> 遍历它。Sass 会逐项取出键与值，交给循环体使用：
    </p>
    <p>
      <code>@each $name, $color in $status-colors { .notice-#{$name} { border-color: $color; color: $color; } }</code>
    </p>
    <p>
      这里出现了 <code>#{}</code> <strong>插值</strong>：类名的一部分要由变量拼出来，<code>.notice-#{$name}</code> 在编译时就变成 <code>.notice-success</code>、<code>.notice-warning</code>……于是三条规则（以及未来所有状态）都从同一份清单生成，<strong>新增状态只要往 Map 里加一行</strong>，规则会自动同步。
    </p>
    <p>
      当只需要单独取清单里的某一项时，不要另写一个色值，而是用 <code>sass:map</code> 模块读取：先 <code>@use "sass:map";</code>，再用 <code>map.get($status-colors, "warning")</code> 拿到那个橙色。这样「警告色」在整个项目里只有一个来源。
    </p>
    <p>
      顺带把 Map 与 <strong>List</strong> 分清楚：Map 是<strong>键值对</strong>，适合「名字对应的配置」；List 是<strong>有序的一串值</strong>，适合「一排队列」。查询与转换交给 <code>sass:map</code>、<code>sass:list</code> 模块，不要依赖已经过时的旧式全局函数。
    </p>
    <div class="lesson-box warn">
      <strong>四个容易踩的坑：</strong>一，不要用循环去生成现实中根本不会出现的组合，那只会让产物体积白白膨胀；二，业务数据（用户名单、接口返回值）不该进 Sass，只有<strong>样式配置</strong>才适合做成集合；三，<code>map.merge</code>、<code>map.set</code> 返回的是<strong>新的 Map</strong>，不会改动源 Map，更新配置时必须接收返回值，否则改了等于没改；四，嵌套较深的配置用 <code>map.get</code> 逐层取值，或者干脆拆成几个浅 Map，可读性更好。
    </div>

    <h2>类名与色值联动</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮切换状态，看插值生成的类名与 <code>map.get</code> 取到的色值一起变化。</figcaption>
      <SC05Collections />
    </figure>

    <h2>单一配置源与遍历</h2>
    <p>
      集合类能力要解决的是「一份数据、多处使用」。把状态色收进一个 Map，让它成为唯一配置源，规则用 <code>@each</code> 遍历生成、用 <code>map.get</code> 定点读取——新增变体只改一行数据，而不是在几个文件里同步复制。这样样式才跟得上设计的变化。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Map 与 List」</span><strong>Map</strong> 是键值对集合（如 <code>$status-colors</code>），适合表达配置；<strong>List</strong> 是有序值序列。两者配合 <code>@each</code> 遍历与 <code>#{}</code> 插值，可从单一配置源批量生成类名与声明。查询转换用 <code>sass:map</code>、<code>sass:list</code>；注意 <code>map.merge</code>／<code>map.set</code> 返回新 Map，需接收返回值。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
