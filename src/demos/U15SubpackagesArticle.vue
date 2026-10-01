<script setup lang="ts">
import U15Subpackages from './U15Subpackages.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你的小程序在开发者工具里点一下秒开，提交审核后在真机上首次打开，却要盯着白屏等三四秒。你把首页的图片压小、无用的代码删掉，启动时间几乎没动——真正拖慢它的，是被打进主包、首页一次都没用到的十几个二级页面。
    </div>

    <h2>提出问题</h2>
    <p>
      小程序的启动是<strong>整包先下载、再执行，然后才渲染首页</strong>。所以主包越大，白屏越久；而且各平台对主包体积有硬上限（微信小程序主包上限 <span class="lesson-kv">2MB</span>），超了直接无法上传。页面一多，主包就不可避免地膨胀。
    </p>
    <p>
      旧办法是所有页面统统写进 <code>pages</code>，代价藏在三处。第一，<strong>启动要下载整包</strong>，首屏白屏时间随着体积线性变长，用户第一次打开体验最差。第二，<strong>体积一旦超过平台上限，构建直接失败</strong>，这时候再想拆分已经来不及。第三，<strong>想瘦身却不知道从哪砍</strong>——代码是按「功能」组织的，而启动快慢取决于「访问频率」，两者不是一回事。
    </p>
    <p>
      问题于是很清楚：<strong>能不能把「启动就必须加载」的页面和「用到才加载」的页面分开打包，让首屏只背它该背的那部分？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：把不常用的页面挪进一个独立目录，在 <code>pages.json</code> 里用 <code>subPackages</code> 声明它。形如 <code>"subPackages": [ { "root": "pages-mine", "pages": [ { "path": "mine" } ] } ]</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「启动必须加载」和「用到才加载」在打包层面拆开了</strong>。这个目录会被单独打成一个分包，不再塞进主包，主包因此变小、启动下载更快。就凭这一点，「我的」「订单」这类低频页面就该被下沉。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>分包页面的路径写错就跳不过去：声明里 <code>path</code> 只写相对 <code>root</code> 的片段，写成绝对路径 <code>/pages-mine/mine</code> 或漏了前缀，都会报「页面不存在」。</li>
      <li>同一个页面同时写进主包 <code>pages</code> 和分包 <code>subPackages</code>，构建报错或行为异常——两处不能重复声明。</li>
      <li>分包只是「按需下载」，用户点进「我的」才触发下载，下载期间照样白屏，体验并没有真的变好。</li>
      <li>分包内引用资源按主包的绝对路径写，图片直接 404，因为分包里的相对位置已经变了。</li>
      <li>把所有低频页塞进同一个分包，首次进入该分包时一次性下载几十个页面，卡顿只是换了个地方发生。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「拆包」，而是先把「谁是主包」这件事划清楚。第一层，主包只保留<strong>启动路径上的页面</strong>：首页，以及从首页一步就能到的高频页。判断标准是「首屏会不会用到」，而不是「重不重要」——重要性高但不进首屏的页面，照样该下沉。
    </p>
    <p>
      第二层，处理「按需下载」带来的等待。<code>subPackages</code> 只是让分包「用到才下」，不等于「提前下」。用户第一次点进分包页面，下载是要花时间的，这段时间仍是白屏。于是有 <code>preloadRule</code>：配置「进入某个主包页面后，由框架在空闲时提前拉取指定分包」，形如 <code>"preloadRule": { "pages/index/index": { "network": "all", "packages": ["pages-mine"] } }</code>。意思是用户一到首页，系统就在后台把这个分包悄悄下好，之后点「我的」就已经就绪。
    </p>
    <p>
      第三层，注意预下载的边界。<code>packages</code> 既能写分包 <code>root</code>，也能写 <code>"all"</code> 表示所有分包；<code>network</code> 还能限制预下载的网络类型（<code>all</code> 不限、<code>wifi</code> 只在 WiFi 下预下载）。这里有个反直觉的点：<strong>预下载消耗的是用户的流量和下载带宽</strong>，所以只对「大概率会去」的分包配置预下载。把所有分包都设成 <code>all</code>，等于把体积压力从主包搬到了用户的网络上，启动该慢还是慢。
    </p>
    <p>
      第四层，把路径与资源引用对上。分包页面的 <code>path</code> 相对 <code>root</code> 声明，跳转时用「<code>/</code> + root + <code>/</code> + path」组成完整路径，即 <code>uni.navigateTo({ url: '/pages-mine/mine' })</code>；分包内引用组件、图片，也要按分包内的相对位置来写。另外，<strong>跨分包跳转前要确保目标分包已被加载</strong>——正确做法是通过 <code>pages.json</code> 里的声明让框架识别并自动下载，或用 <code>uni.preloadSubpackage</code> 主动预下载，而不是硬跳一个框架不认识的路径。
    </p>
    <p>
      第五层，把「启动耗时」收回来整体看。分包的收益体现为两点：<strong>主包体积变小</strong>，启动下载更快、白屏更短；<strong>分包按需加载</strong>，低频页面的代码不占用启动时间。但也要小心一个反效果——如果某个大依赖（比如一个 UI 库）被主包和多个分包<strong>重复引用</strong>，它会被分别打进每一份，体积不降反升。这类公共代码应该放进主包或独立成一个小分包，让多个分包去引用它。
    </p>
    <div class="lesson-box warn">
      <strong>几条必须记住的边界：</strong><code>subPackages</code> 与 <code>subpackages</code> 两种拼写框架都能识别，但团队内要统一；<strong>主包与分包不能重复声明同一个页面</strong>；分包粒度不是越细越好——分包过多会增加管理成本和跨包跳转的下载次数，而且<strong>单个分包也有大小上限</strong>，别把所有低频页堆进一个分包。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>上面是主包（启动即加载），下面是两个分包；点「进入分包」模拟一次按需下载，而标着「已预下载」的分包无需等待——试着对比这两个分包的状态标签，体会 <code>preloadRule</code> 到底省掉了什么。</figcaption>
      <U15Subpackages />
    </figure>

    <h2>总结</h2>
    <p>
      分包要解决的是启动耗时：<strong>主包只留启动路径上的页面，其余下沉到分包按需下载，再用 <code>preloadRule</code> 把「大概率会去」的分包提前下好</strong>。代价是路径要按相对 <code>root</code> 重新声明、资源要重新对位、公共依赖不能重复打包。收益最终体现在一件事上——用户看到首页白屏的时间变短了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「预下载（preloadRule）」</span>在 <code>pages.json</code> 中声明「进入某个页面后，由框架在空闲时提前拉取指定分包」的规则，把分包从「用到才下载」变成「大概率会用到就先下好」。边界：预下载消耗用户流量，要用 <code>network</code> 限制网络类型（<code>all</code> / <code>wifi</code>）；只对高概率访问的分包配置，全量 <code>all</code> 等于把体积压力从主包搬到网络上；预下载发生在用户正在浏览时，别让它抢占首屏资源。
    </div>
  </LessonArticle>
</template>
