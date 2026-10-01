<script setup lang="ts">
import W12Phong from './W12Phong.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你用上一课的模型把球做好了，明暗过渡很顺，像一颗哑光的陶球。可你对着「喷漆金属球」的参考图怎么看都不对——参考图上球的一侧有一个又小又亮的高光点，而你的球无论怎么转，整块表面都是均匀的哑光。光明明照在上面，那个高光点到底从哪来？
    </div>

    <h2>漫反射的视角无关</h2>
    <p>
      上一课的 Lambert 漫反射只回答了一件事：表面朝不朝着光。它有个特性你也许没注意——<strong>漫反射与观察方向无关</strong>。你把相机绕到物体背面，只要光照不变，同一块表面的亮度也不变。
    </p>
    <p>
      可现实里的漆面、金属、水面不是这样：反光是「随你走到哪、看的角度变」的，你只有站在特定角度才会看到那一抹刺眼的亮。这就是 Lambert 缺的一整类项——<strong>与视角相关的反射</strong>。只靠漫反射的代价很清楚：所有材质都像陶土或粉笔，分不出金属和水；材质差异只能靠颜色硬凑；转动相机时画面毫无变化，丢掉了「光滑表面」最关键的动态线索。于是问题落到：<strong>怎么算出一个只在特定视线角度出现、而且越光滑越集中的高光？</strong>
    </p>

    <h2>反射向量与视线</h2>
    <p>
      引入「反射向量」。光打到表面上会像照镜子一样弹开，反射方向记作 <code>R = reflect(-L, N)</code>（传入的是 <code>-L</code>，因为 <code>L</code> 是「从表面指向光源」的方向，而 <code>reflect</code> 要的是「从光源射向表面」的入射方向）。你看到的高光，其实就是<strong>反射光正好射进了相机</strong>——反射方向 <code>R</code> 与视线方向 <code>V</code> 越接近，就越亮。视线 <code>V = normalize(uViewPos - vWorldPos)</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把高光的位置和镜面反射方向绑定了</strong>。于是「往哪看才亮」第一次变成了可计算的东西。
    </p>

    <h2>光斑过大的问题</h2>
    <ul>
      <li><strong>高光太大。</strong>直接用 <code>max(dot(R, V), 0)</code>，高光会盖住小半个球面，像糊了一层蜡，完全不像金属上那种小而锐的亮点。</li>
      <li><strong>没法控制光滑程度。</strong>镜面感强的材质高光集中，粗糙材质高光发散，而这个公式里根本没有这样一个自由度。</li>
      <li><strong>强度无法单独调节。</strong>高光的大小和亮度绑在一起，想「亮一点但不扩散」就做不到。</li>
      <li><strong>高光色没分家。</strong>若把材质色直接乘进高光，有色漆面的高光会跟着变暗，白色反光点就出不来。</li>
    </ul>

    <h2>幂函数收束高光</h2>
    <p>
      先治「高光太大」这个最直观的问题：给点积套一个<strong>幂函数</strong>。把 <code>max(dot(R, V), 0)</code> 取 <code>shininess</code> 次方，写成 <code>pow(max(dot(R, V), 0), shininess)</code>。为什么先补它、又为什么用幂函数？因为点积的底数落在 <code>[0, 1]</code>，指数越大，只有非常接近 1（也就是 <code>R</code> 和 <code>V</code> 几乎重合）的值才留得下显著亮度，其余都被压到接近 0——高光于是自然收窄、变锐。
    </p>
    <p>
      <code>shininess</code> 就是<strong>镜面指数</strong>，常用范围 <code>1</code> 到 <code>128</code>：值越大，高光越小而集中，越像打磨过的金属；值越小，高光越散，越像粗糙表面。补完这一步，高光的「形状」就随你调了。
    </p>
    <p>
      接着补第二处：让高光<strong>强度独立可控</strong>，再把它和高光色分开。给高光乘一个单独的 <code>uSpecIntensity</code>，并让高光用白色而不是材质色——金属、漆面那种「白点」才立得住。整段流程是：
    </p>
    <ol class="lesson-steps">
      <li>顶点着色器输出世界坐标 <code>vWorldPos</code> 与法线（经法线矩阵变换并归一化）。</li>
      <li>片段中求视线 <code>V = normalize(uViewPos - vWorldPos)</code> 与反射向量 <code>R = reflect(-L, N)</code>。</li>
      <li>高光 <code>specular = 强度 × pow(max(dot(R, V), 0), shininess)</code>。</li>
      <li><code>ambient + diffuse + specular</code> 三者相加输出。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个值得记住的细节：</strong>其一，Phong 高光与视角强相关——视线方向越接近反射方向，高光越亮，所以转相机会明显看到高光在表面上游走。其二，工程里更常用的改进是 <strong>Blinn-Phong</strong>：改用半向量 <code>H = normalize(L + V)</code>，比较 <code>N·H</code> 而不是 <code>R·V</code>。它少算一次 <code>reflect</code>，速度更快，而且在掠射角下高光形状更柔和、更正确。
    </div>
    <p>
      本课为突出高光的位置与形状，特意用了固定强度的白色高光，没有把光源颜色和材质颜色乘进去——真实工程里高光色通常还要再乘材质的高光色与光源色，那是材质系统要做的事。
    </p>

    <h2>高光点收敛过程</h2>
    <figure class="lesson-figure">
      <figcaption>勾选左右对比，左侧 Lambert、右侧 Phong；再拖动 shininess 与高光强度，看右侧那个亮点如何从一大片蜡光收成一个锐利白点，并随观察方向移动。</figcaption>
      <W12Phong />
    </figure>

    <h2>视角驱动的高光</h2>
    <p>
      Phong 就是在漫反射之上，加了一个<strong>随视角移动的高光点</strong>。它由反射方向 <code>R</code> 与视线 <code>V</code> 的接近程度决定，用 <code>shininess</code> 控制这个点有多集中、用高光强度控制它有多亮。有了它，光滑表面才第一次有了「反光」这件事。
    </p>
    <div class="lesson-term">
      <span class="term-name">「镜面指数（shininess）」</span>是 Phong 高光里控制高光集中程度的指数，出现在 <code>pow(max(dot(R, V), 0), shininess)</code> 中。取值越大，高光越小而集中（越像光滑金属），越小则越散（越像粗糙表面），常用范围 <code>1</code> 到 <code>128</code>。边界与例外：它是「集中度」而非「亮度」，亮度要靠单独的强度项；在 Blinn-Phong 里对应的量是 <code>N·H</code>（<code>H = normalize(L + V)</code>），此时同一个数值的高光会比原版更宽一些。
    </div>
  </LessonArticle>
</template>
