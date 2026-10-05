const n=`<!-- 基础按钮交互状态 -->
<button class="rounded-lg bg-orange-600 px-5 py-2.5 text-white transition
  hover:bg-orange-700
  active:bg-orange-800
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed">
  提交
</button>

<!-- Group：父元素悬停触发子元素变化 -->
<article class="group cursor-pointer rounded-xl bg-amber-50 p-5 transition hover:bg-amber-100">
  <h3 class="font-bold text-stone-900 transition group-hover:text-orange-700">
    Vue 性能优化实战
  </h3>
  <p class="mt-2 text-sm text-stone-600">深入理解响应式原理与渲染优化</p>
  <span class="mt-3 inline-block text-orange-600 transition group-hover:translate-x-1">
    查看详情 →
  </span>
</article>

<!-- Peer：兄弟元素状态联动 -->
<label class="flex items-center gap-2">
  <input type="checkbox" class="peer rounded border-stone-300">
  <span class="text-stone-700 peer-checked:text-orange-700 peer-checked:font-medium">
    同意服务条款
  </span>
</label>

<!-- Focus 与表单验证 -->
<input type="email" placeholder="输入邮箱"
  class="w-full rounded-lg border border-stone-300 px-4 py-2 transition
  focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200
  invalid:border-red-500 invalid:focus:ring-red-200">

<!-- 光标与用户选择 -->
<p class="select-all cursor-pointer rounded bg-stone-100 p-3 text-stone-700">
  点击可选中整段文字
</p>`;export{n as default};
