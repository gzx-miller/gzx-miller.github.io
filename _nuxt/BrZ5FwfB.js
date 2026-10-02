const e=`<!-- 移动优先：基础样式先覆盖小屏，断点逐步增强 -->
<section class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:gap-5">
  <article class="rounded-xl bg-amber-50 p-4">模板语法</article>
  <article class="rounded-xl bg-amber-50 p-4">响应式</article>
  <article class="rounded-xl bg-amber-50 p-4">组件通信</article>
</section>

<!-- 不要把 sm: 理解为“手机”；它表示 min-width: 40rem 及以上。 -->
`;export{e as default};
