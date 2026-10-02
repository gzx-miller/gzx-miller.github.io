const t=`<!-- class 策略：在祖先元素切换 .dark；主题脚本应在首屏渲染前执行 -->
<html class="dark">
  <article class="bg-amber-50 text-stone-900 dark:bg-stone-900 dark:text-amber-50">
    <h3>今日进度</h3>
    <p class="text-stone-600 dark:text-stone-300">已完成 6 / 8 栗子</p>
  </article>
</html>

<style type="text/tailwindcss">
  @custom-variant dark (&:where(.dark, .dark *));
</style>
`;export{t as default};
