const n=`<script setup lang="ts">
import { defineAsyncComponent, defineComponent, h, type Component } from 'vue'

const AsyncReport = defineAsyncComponent(
  () =>
    new Promise<Component>((resolve) => {
      // 用全局 setTimeout（而非 window.setTimeout）：SSR 预渲染阶段同样可用
      setTimeout(() => {
        resolve(
          defineComponent({
            setup: () => () => h('p', '异步学习报告加载完成：本周完成 6 个知识点。'),
          }),
        )
      }, 600)
    }),
)
<\/script>

<template>
  <div class="demo-card">
    <h3>异步学习报告</h3>
    <Suspense>
      <AsyncReport />
      <template #fallback>
        <p>报告加载中...</p>
      </template>
    </Suspense>
  </div>
</template>
`;export{n as default};
