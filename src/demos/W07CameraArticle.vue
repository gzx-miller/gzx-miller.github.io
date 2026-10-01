<script setup lang="ts">
import W07Camera from './W07Camera.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你做了个 3D 零件展示页，想让人绕到背面看看。你把<strong>模型本身</strong>转了过去，结果背是转过来了，可原本朝上的顶面跟着歪到了侧面——连从上方打来的光都好像跟着太阳一起转了。用户想动的是眼睛，你却动了物体。
    </div>

    <h2>视角切换的实现</h2>
    <p>
      你已经有了 View 矩阵，它负责把世界坐标变换到相机空间，本质就是把相机搬到原点、视线对齐轴。于是「换视角」这件事，最后都归结为一个问题：<strong>相机该放在哪、看向哪？</strong>
    </p>
    <p>
      手里只有最原始的做法——直接给相机一个位置 <code>eye</code> 和一个目标点 <code>target</code>，那你就得为用户的每一次操作手动算数：
    </p>
    <ul>
      <li>用户想「往左转 30 度」，你得自己推出 <code>eye</code> 的 x、y、z 各该改成多少，三角函数在脑子里绕三圈还容易错。</li>
      <li>用户想「拉近一点」，你得把 <code>eye</code> 沿着朝向目标的方向缩，方向向量也得现算。</li>
      <li>转和缩放同时发生时，三个坐标互相牵连，改一个不动另一个，相机就飘。</li>
    </ul>
    <p>
      问题于是收束成一句：<strong>有没有一组参数，让「绕圈」和「缩放」各只改一个数，而且互不干扰？</strong>
    </p>

    <h2>观察点与相机位</h2>
    <p>
      最朴素也真能跑的做法：维护 <code>eye</code> 和 <code>target</code>，用 <code>lookAt(eye, target, up)</code> 生成 View 矩阵。想换视角就改 <code>eye</code>，把相机沿一个圆圈挪动，就能绕着物体转。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「观察」和「被观察」分开了</strong>。改 View 矩阵不会碰模型数据，物体该在哪还在哪，视角变化只是换个机位。
    </p>

    <h2>参数耦合与误差累积</h2>
    <ul>
      <li>「转 30 度」这种对用户最自然的说法，落到 <code>eye</code> 上却变成三个坐标的联立修改，转久了还会累积误差。</li>
      <li>缩放和旋转共用同一组 x、y、z，想单独调一个，另外两个就会跟着漂。</li>
      <li>观察点固定在原点：想让相机绕着零件某个偏离原点的部位转，你只能整个场景平移。</li>
      <li>相机走到目标点正上方或正下方时，视线方向与 <code>up</code> 共线，<code>lookAt</code> 求出的坐标系退化，画面会突然翻转甚至整体消失。</li>
    </ul>

    <h2>球坐标的引入</h2>
    <p>
      看清了病根——「相机在哪」用笛卡尔坐标描述不合适，于是换一组更贴合「看着一个东西绕圈」的参数：<strong>球坐标</strong>。用半径 <code>radius</code>、方位角 <code>theta</code>、仰角 <code>phi</code> 加上目标点 <code>target</code>，就能完整描述相机相对目标的位置。整个流程是：
    </p>
    <ol class="lesson-steps">
      <li>维护半径 <code>radius</code>、方位角 <code>theta</code>、仰角 <code>phi</code> 与目标点 <code>target</code>。</li>
      <li>由球坐标换算相机位置：<code>eye = target + r * (sin(phi)·cos(theta), cos(phi), sin(phi)·sin(theta))</code>。</li>
      <li>用 <code>lookAt(eye, target, up)</code> 生成 View 矩阵。</li>
      <li>把 View 与 Projection 相乘得到 VP（本课再合并为 <code>uMVP</code>），传入顶点着色器。</li>
    </ol>
    <p>
      换参数的好处立刻显现：<strong>每个交互只动一个数</strong>——滚轮改 <code>radius</code> 就是拉近拉远，水平拖动改 <code>theta</code> 就是绕目标左右转，垂直拖动改 <code>phi</code> 就是上下转。三者独立，互不牵连，也不再需要你在脑子里解三元方程。
    </p>
    <p>
      <code>lookAt</code> 本身也值得说清：它拿视线向量（<code>eye - target</code>）与 <code>up</code> 做叉积，重建出<strong>右、上、前</strong>三个互相正交的基向量，组成旋转部分；再配上把 <code>eye</code> 平移到原点的平移，合起来就是 View 矩阵。
    </p>
    <div class="lesson-box warn">
      <strong>必须记住的边界：</strong>仰角 <code>phi</code> 要约束在 <span class="lesson-kv">(0, π)</span> 的开区间内，也就是不要贴到 0 或 180 度。一旦越过天顶或天底，<code>up</code> 与视线共线，<code>lookAt</code> 的基退化，画面会瞬间翻转。演示里滑杆范围是 <code>0.1</code> 到 <code>3.04</code> 而不是 <code>0</code> 到 π，正是为了避开这两个奇点。
    </div>
    <p>
      还有一点要分清：View 矩阵只决定「从哪看」，<strong>不会修改模型数据本身</strong>。轨道相机适合围绕单个物体观察；如果你要做的是第一人称漫游，通常直接累加 yaw / pitch 与位移，而不是套用这套绕目标的球坐标。
    </p>

    <h2>滑杆联动相机状态</h2>
    <figure class="lesson-figure">
      <figcaption>分别拖动半径、方位角、仰角三个滑杆绕模型转圈与缩放，再移动观察点滑杆，看相机状态里 <code>eye</code> 的实时坐标怎么跟着变。</figcaption>
      <W07Camera />
    </figure>

    <h2>相机与模型解耦</h2>
    <p>
      轨道相机把「相机在哪」翻译成三个互相独立的旋钮——半径管远近、方位角管左右、仰角管上下，再用 <code>lookAt</code> 把它们收成一个 View 矩阵。<strong>换视角就是改参数，永远不用碰模型数据。</strong>
    </p>
    <div class="lesson-term">
      <span class="term-name">「轨道相机」</span>用球坐标 <code>(radius, theta, phi)</code> 加目标点描述相机相对目标的位置，再由 <code>lookAt</code> 生成 View 矩阵，从而围绕目标旋转与缩放。必须记住：<code>phi</code> 要限定在 <code>(0, π)</code> 内，否则 <code>up</code> 与视线共线会导致画面翻转；View 只改变观看方式，不改变模型数据。
    </div>
  </LessonArticle>
</template>
