const n=`<!-- 悬停放大效果 -->
<button class="rounded-lg bg-orange-600 px-6 py-3 text-white transition duration-200 ease-out
  hover:scale-105 hover:shadow-lg
  active:scale-95">
  点击放大
</button>

<!-- 旋转与位移 -->
<div class="flex gap-8">
  <div class="transition duration-300 hover:rotate-12 hover:scale-110">
    <div class="h-16 w-16 rounded-lg bg-amber-300"></div>
    <p class="mt-2 text-xs text-stone-600">rotate + scale</p>
  </div>
  <div class="transition duration-300 hover:-translate-y-2 hover:shadow-xl">
    <div class="h-16 w-16 rounded-lg bg-orange-400"></div>
    <p class="mt-2 text-xs text-stone-600">translate-y</p>
  </div>
  <div class="transition duration-300 hover:skew-x-6">
    <div class="h-16 w-16 rounded-lg bg-amber-500"></div>
    <p class="mt-2 text-xs text-stone-600">skew-x</p>
  </div>
</div>

<!-- 过渡曲线控制 -->
<button class="rounded-lg bg-stone-700 px-5 py-2.5 text-white transition duration-500 ease-in-out hover:bg-orange-600">
  ease-in-out 过渡
</button>

<!-- 内置关键帧动画 -->
<div class="flex items-center gap-6">
  <span class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-orange-600"></span>
  <span class="inline-flex h-3 w-3 animate-ping rounded-full bg-orange-500"></span>
  <span class="inline-flex animate-pulse text-orange-600 font-medium">加载中...</span>
  <span class="inline-flex animate-bounce text-2xl">👋</span>
</div>

<!-- 优先动画 transform 与 opacity，性能更好 -->`;export{n as default};
