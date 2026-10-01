<script setup lang="ts">
import W09TextureFilter from './W09TextureFilter.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一张棋盘纹理，铺满整屏时看着挺干净，可当相机一拉远、整块棋盘缩成指甲盖大小，画面开始「沙沙」抖动——你稍微动一下鼠标，纹理就闪成一片噪点，像信号不好。放大回去又恢复正常。
    </div>

    <h2>最近邻采样失真</h2>
    <p>
      你已经能把纹理贴到网格上，也知道每个屏幕像素会按插值出来的 UV 去采样。但采样时到底该「取哪一个纹素」这件事，你还没做决定。默认地，显卡取离 UV 最近的那一个纹素。
    </p>
    <p>
      只取一个最近纹素，会在两个方向上同时出问题：
    </p>
    <ul>
      <li><strong>放大时出马赛克。</strong>一个纹素被铺到很多屏幕像素上，边缘是一个个清楚的方块。</li>
      <li><strong>缩小时出噪点。</strong>一个屏幕像素盖住了好几十个纹素，只取其中一个，等于随机丢掉了其余绝大部分信息，结果就是跳动的摩尔纹与闪烁。</li>
      <li><strong>没法靠换图解决。</strong>想为每个缩放级别各准备一张缩小版图片，内存会成倍增长。</li>
      <li><strong>顾此失彼。</strong>在某个距离调好的参数，换个距离又失效。</li>
    </ul>
    <p>
      所以真正的问题是：<strong>一次采样到底该取几个纹素、按什么权重合并？放大和缩小能分开处理吗？</strong>
    </p>

    <h2>双线性插值采样</h2>
    <p>
      先解决放大。把采样方式从「取最近一个纹素」换成 <strong>LINEAR</strong>：取该点周围 <code>2 x 2</code> 的四个邻近纹素，按距离做双线性插值加权平均。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认了「一个屏幕像素往往落在几个纹素中间」这个事实</strong>。放大时不再是一块块硬邦邦的方块，而是平滑过渡，边缘也不再锯齿分明。
    </p>

    <h2>缩小采样摩尔纹</h2>
    <ul>
      <li>缩小时 LINEAR 依然不够：当屏幕一个像素覆盖了 <code>4 x 4</code> 甚至更大的一片纹素时，只平均邻近 <code>2 x 2</code> 个，仍会漏掉大量信息，摩尔纹照旧。</li>
      <li>它预平均的范围是固定的 <code>2 x 2</code>，与「这个像素实际覆盖多大面积」无关，缩放比例一变就顾此失彼。</li>
      <li>只用一张原图，缩得越小信息密度越高，硬件再怎么插值也压不住高频细节的冲突。</li>
      <li>放大与缩小被迫共用一套规则，而两者的需求其实正好相反。</li>
    </ul>

    <h2>多级渐远纹理</h2>
    <p>
      既然缩小的病根是「像素覆盖的面积远大于采样窗口」，那就从源头降低信息密度：给纹理预先准备一组逐级缩小的副本，也就是 <strong>Mipmap</strong>。缩小时硬件根据屏幕像素覆盖的纹素面积，自动挑一个大小合适的层级去采样。
    </p>
    <p>
      于是流程变成：
    </p>
    <ol class="lesson-steps">
      <li>按 2 的幂，用 <code>texImage2D</code> 的 <code>level</code> 参数逐级生成并上传各 mip 层。</li>
      <li>把 <code>MIN_FILTER</code> 设为 <code>NEAREST_MIPMAP_NEAREST</code> 或 <code>LINEAR_MIPMAP_LINEAR</code>，<code>MAG_FILTER</code> 单独设置。</li>
      <li>用缩放参数改变屏幕上纹素的覆盖比例，观察不同过滤下的清晰度差异。</li>
      <li>用层级滑杆单独查看某一 mip 层，直观对比各层的清晰度。</li>
    </ol>
    <p>
      光有层级还不够：如果只在单一层里取色，缩放连续变化时会在层与层之间<strong>跳变</strong>。所以再补上跨层与层内的插值——<code>LINEAR_MIPMAP_LINEAR</code>，也就是常说的<strong>三线性过滤</strong>：既在相邻两层各自做线性插值，又在这两层的结果之间再插一次。它质量最高，开销也最大。
    </p>
    <p>
      走到这里，放大与缩小终于可以分开配置了。<code>MAG_FILTER</code> 只管放大；<code>MIN_FILTER</code> 只管缩小，而且它既可以是普通的 <code>NEAREST</code> / <code>LINEAR</code>，也可以是带 <code>MIPMAP_</code> 的组合。
    </p>
    <div class="lesson-box warn">
      <strong>三条边界：</strong>其一，<code>MAG_FILTER</code> <strong>只能</strong>设 <code>NEAREST</code> 或 <code>LINEAR</code>，不能带 <code>MIPMAP_</code> 后缀——放大时根本用不到更小的层。其二，WebGL1 里一条完整的 mip 链通常要求纹理尺寸为 2 的幂，否则过滤不完整；WebGL2 或 NPOT 扩展才允许非 2 次幂纹理带 mip。其三，斜视角下纹理仍会发糊，可用各向异性过滤（<code>EXT_texture_filter_anisotropic</code>）改善，属于进阶优化。
    </div>

    <h2>锯齿与平滑对比</h2>
    <figure class="lesson-figure">
      <figcaption>拖动缩放滑杆把纹理放大缩小，切换 NEAREST 与 LINEAR 对比方块锯齿和平滑边缘，再用层级滑杆单独查看某一 mip 层的清晰度。</figcaption>
      <W09TextureFilter />
    </figure>

    <h2>放大缩小过滤</h2>
    <p>
      纹理过滤回答的是「一次采样取几个纹素、怎么加权」。<strong>放大靠 NEAREST 与 LINEAR 二选一，缩小则必须靠 Mipmap 逐级降采样，再加上跨层插值，才能压住摩尔纹与闪烁。</strong>两者需求相反，所以要分开配置。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Mipmap」</span>是一组按 2 的幂逐级缩小的预生成纹理副本，用于纹理缩小时由硬件按屏幕覆盖面积自动选层、必要时跨层混合，以减轻摩尔纹与闪烁。记住边界：<code>MIN_FILTER</code> 可用带 <code>MIPMAP_</code> 的过滤，<code>MAG_FILTER</code> 只能用 <code>NEAREST</code> / <code>LINEAR</code>；三线性 <code>LINEAR_MIPMAP_LINEAR</code> 质量最好但开销最大；WebGL1 完整 mip 链通常要求纹理为 2 的幂。
    </div>
  </LessonArticle>
</template>
