const t=`<!-- 图片滤镜效果 -->
<div class="flex flex-wrap gap-4">
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 blur-sm"></div>
    <p class="mt-1 text-xs text-stone-600">blur-sm</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 brightness-125"></div>
    <p class="mt-1 text-xs text-stone-600">brightness-125</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 contrast-75"></div>
    <p class="mt-1 text-xs text-stone-600">contrast-75</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 saturate-200"></div>
    <p class="mt-1 text-xs text-stone-600">saturate-200</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 grayscale"></div>
    <p class="mt-1 text-xs text-stone-600">grayscale</p>
  </div>
  <div class="text-center">
    <div class="h-20 w-20 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 sepia"></div>
    <p class="mt-1 text-xs text-stone-600">sepia</p>
  </div>
</div>

<!-- 毛玻璃效果 backdrop-blur -->
<div class="relative h-32 w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
  <div class="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-white/30 px-4 py-3">
    <p class="text-sm font-medium text-stone-800">backdrop-blur 毛玻璃效果</p>
  </div>
</div>

<!-- 组合滤镜 -->
<img class="rounded-lg transition duration-300 hover:brightness-110 hover:saturate-125 hover:shadow-xl"
  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20orange%20gradient&image_size=square"
  alt="示例图片" style="width: 160px; height: 160px; object-fit: cover;">

<!-- 混合模式 -->
<div class="relative h-24 w-48">
  <div class="absolute inset-0 bg-orange-500 rounded-lg"></div>
  <div class="absolute inset-2 bg-amber-200 rounded-lg mix-blend-multiply flex items-center justify-center">
    <span class="text-xs text-stone-800">mix-blend-multiply</span>
  </div>
</div>`;export{t as default};
