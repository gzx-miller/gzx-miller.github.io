const e=`<!-- Flex：一维导航栏 -->
<nav class="flex items-center justify-between gap-4 rounded-lg bg-amber-100 px-4 py-3">
  <span class="font-bold text-amber-900">Logo</span>
  <div class="flex gap-3">
    <a href="#" class="text-amber-800 hover:text-amber-950">首页</a>
    <a href="#" class="text-amber-800 hover:text-amber-950">课程</a>
    <a href="#" class="text-amber-800 hover:text-amber-950">关于</a>
  </div>
</nav>

<!-- Grid：二维卡片网格 -->
<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
  <article class="rounded-xl bg-orange-100 p-4">卡片 1</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 2</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 3</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 4</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 5</article>
  <article class="rounded-xl bg-orange-100 p-4">卡片 6</article>
</div>

<!-- Flex + Grid 组合：Grid 骨架，Flex 内容对齐 -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
  <article class="flex flex-col justify-between rounded-xl bg-amber-50 p-5">
    <div>
      <h3 class="font-bold text-stone-900">Vue 入门</h3>
      <p class="mt-2 text-sm text-stone-600">基础语法与响应式原理</p>
    </div>
    <button class="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm text-white">开始学习</button>
  </article>
</div>

<!-- Flex：居中对齐 -->
<div class="flex h-24 items-center justify-center rounded-lg bg-stone-100">
  <span class="text-stone-700">Flex 水平垂直居中</span>
</div>

<!-- 选择参考：一维内容流用 Flex，二维轨道布局用 Grid -->`;export{e as default};
