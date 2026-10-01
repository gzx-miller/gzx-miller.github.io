<script setup lang="ts">
import J17OptionalNullish from './J17OptionalNullish.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>接口在大部分用户身上都会返回 <code>address</code>，于是 <code>res.data.user.address.city</code> 这一行长期平安无事；直到某个用户没填地址，同一行代码抛出 <code>Cannot read properties of undefined</code>，整页白屏——为什么「读一个字段」会把页面读崩？
    </div>

    <h2>深层属性访问</h2>
    <p>
      你在做一张用户信息卡：头像来自 <code>res.data.user.profile.avatar.url</code>，城市来自 <code>res.data.user.address.city</code>，简介来自 <code>res.data.user.profile.bio</code>。这些字段全都来自接口，而接口给出的是一个<strong>形状不确定的对象</strong>：用户没填地址，<code>address</code> 这个键干脆不存在；权限不同，<code>profile</code> 可能整个都没返回。
    </p>
    <p>
      问题就出在这里：JavaScript 读取一个深层字段时，是<strong>逐级取值</strong>的。它会先取 <code>res.data</code>，再取 <code>.user</code>，再取 <code>.address</code>，每一级都是在「上一个结果」上继续读属性。只要中间任何一级是 <code>undefined</code>，在它上面继续读属性就会抛 <code>TypeError</code>。也就是说，你要的其实是最后那一个字符串，却必须让前面每一级都真实存在——而接口并不保证这件事。
    </p>

    <h2>逻辑与逐层守卫</h2>
    <p>
      最朴素的做法是用逻辑与 <code>&amp;&amp;</code> 逐层守卫：每一级都为真才继续往下，否则整个表达式的值就是那个「假」的中间结果。
    </p>
    <p>
      <code>const city = res.data &amp;&amp; res.data.user &amp;&amp; res.data.user.address &amp;&amp; res.data.user.address.city</code>
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它在每一级读取之前都先确认这一级存在</strong>，把「可能为空的路径」显式挡在了读取之前。方向完全正确，问题在于它的表达方式和判定标准都很粗糙。
    </p>

    <h2>路径重复与假值</h2>
    <ul>
      <li>路径要抄一遍又一遍，<code>res.data.user.address</code> 在这一行里出现了四次；接口字段改名，你得把整条链从头对齐一次。</li>
      <li>守卫用的是<strong>真假值</strong>，不是「是否存在」。当 <code>city</code> 是一个合法的空字符串、或者某个计数值正好是 <code>0</code> 时，它会被 <code>&amp;&amp;</code> 当成「没有」，后面的读取被短路掉，你拿到的结果变成了上一级的对象本身。</li>
      <li>想顺手给个默认值，通常接一个 <code>|| '未设置城市'</code>，可 <code>||</code> 对空字符串和 <code>0</code> 同样会取右侧——一个「用户故意清空了城市」的正常数据，会被你替换成「未设置城市」。</li>
      <li>如果链末端是要调用的方法，守卫即使通过了，也不代表这个函数一定存在，直接调用照样抛错。</li>
    </ul>

    <h2>可选链短路语义</h2>
    <p>
      先解决「读取本身可能失败」。语言给出的答案是<strong>可选链</strong> <code>?.</code>：它在左侧为 <code>null</code> 或 <code>undefined</code> 时立即短路，整条表达式求值为 <code>undefined</code>；否则照常继续往下读。上面的长链于是变成 <code>res.data?.user?.address?.city</code>，路径只写一遍，每一级的判定也从「是不是真值」收紧成了<strong>「是不是空值」</strong>——这正是关键差别：<code>?.</code> 只对 <code>null</code> 和 <code>undefined</code> 短路，<code>0</code>、空字符串、<code>false</code> 都会继续往下访问。
    </p>
    <p>
      <code>?.</code> 不止用于属性，还有两个配套写法：可选索引 <code>list?.[0]</code> 用于数组或字典可能为空的场景，可选调用 <code>fn?.()</code> 用于函数可能不存在的场景。这里有一条最容易踩的坑：<strong>可选链只保证「读取」这一步是安全的</strong>。写 <code>obj.method?.()</code> 才是「如果函数存在就调用」，而写成 <code>obj.method?.value</code> 只是安全读了一个属性；链末端是方法时，务必带上调用括号。
    </p>
    <p>
      读取安全了，但读出来是 <code>undefined</code> 还是没解决问题——你总得有个能显示的城市。这时需要的是<strong>空值合并</strong> <code>??</code>：它只在左侧为 <code>null</code> 或 <code>undefined</code> 时取右侧，其余一切值（包括 <code>0</code> 和空字符串）都原样返回。把它接在可选链后面，一行就能同时完成「安全读取」和「只在真正空值时兜底」：<code>res.data?.user?.address?.city ?? '未设置城市'</code>。
    </p>
    <p>
      把 <code>??</code> 与老朋友 <code>||</code> 对着看，差别一目了然：
    </p>
    <table>
      <thead>
        <tr>
          <th>左侧的值</th>
          <th><code>a || '默认'</code></th>
          <th><code>a ?? '默认'</code></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>0</code></td>
          <td>'默认'</td>
          <td><code>0</code></td>
        </tr>
        <tr>
          <td>空字符串</td>
          <td>'默认'</td>
          <td>空字符串</td>
        </tr>
        <tr>
          <td><code>null</code> 或 <code>undefined</code></td>
          <td>'默认'</td>
          <td>'默认'</td>
        </tr>
      </tbody>
    </table>
    <p>
      最后一步是把「判断有没有值，再决定要不要赋值」这条常见套路合并成一句话。<strong>逻辑赋值运算符</strong>正是为此而生：<code>??=</code> 只在左侧为空值时写入右侧，<code>||=</code> 在左侧为假值时写入，<code>&amp;&amp;=</code> 在左侧为真值时写入。初始化配置对象时，<code>config.title ||= '默认标题'</code>、<code>config.theme ??= '秋日暖色'</code> 一行一个字段，比写完整的 if 清爽得多。
    </p>
    <div class="lesson-box warn">
      逻辑赋值同样要选对运算符。用 <code>count ||= 10</code> 想要兜底时，一个合法的 <code>0</code> 会被替换成 10；想要「数为 0 也算有值」，就必须写 <code>count ??= 10</code>。判断标准始终是同一个：你要防的是「空值」，还是「假值」。
    </div>

    <h2>兜底赋值运算符</h2>
    <figure class="lesson-figure">
      <figcaption>依次点击按钮，看可选链如何安全穿过缺失字段，再对比 <code>||=</code> 与 <code>??=</code> 的取值差异。</figcaption>
      <J17OptionalNullish />
    </figure>

    <h2>空值安全与默认值</h2>
    <p>
      可选链、空值合并与逻辑赋值这三件事，共同把「字段可能不存在」这件接口常态收进了一行表达式：<code>?.</code> 负责让读取不崩，<code>??</code> 负责只在空值时兜底，<code>??=</code> 这一族负责把判断与赋值合并。它们的统一准则是<strong>只认 <code>null</code> 与 <code>undefined</code></strong>，而不是「假值」——记住这一点，就能同时避开崩溃和被误吞的 <code>0</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「可选链 ?.」</span>指在左侧为 <code>null</code> 或 <code>undefined</code> 时短路并返回 <code>undefined</code> 的访问语法，覆盖属性 <code>a?.b</code>、索引 <code>a?.[i]</code> 与调用 <code>a?.()</code> 三种形式，只对空值短路，<code>0</code>、空字符串、<code>false</code> 会继续访问。<span class="term-name">「空值合并 ??」</span>只在左侧为空值时取右侧，与会对所有假值取右侧的 <code>||</code> 不同；<code>??=</code>、<code>||=</code>、<code>&amp;&amp;=</code> 则把这类判断与赋值合并成一步。
    </div>
  </LessonArticle>
</template>
