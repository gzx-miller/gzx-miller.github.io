const a=`<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('hmr')

const contents = {
  hmr: \`// Vite HMR API（手动处理边界情况）
if (import.meta.hot) {
  // 模块热更新
  import.meta.hot.accept((mod) => {
    console.log('模块更新:', mod)
  })

  // 模块销毁时清理
  import.meta.hot.dispose(() => {
    console.log('模块即将被替换')
  })
}\`,
  vue: \`<span class="cm">&lt;!-- Vue SFC 的 HMR 是开箱即用的 --&gt;</span>
<span class="cm">&lt;!-- @vitejs/plugin-vue 会自动处理： --&gt;</span>
<span class="cm">&lt;!-- - template 更新 → 不丢失状态 --&gt;</span>
<span class="cm">&lt;!-- - script 更新 → 保留组件状态 --&gt;</span>
<span class="cm">&lt;!-- - style 更新 → 样式热替换 --&gt;</span>

<span class="tag">&lt;script</span> <span class="attr">setup</span> <span class="attr">lang</span>=<span class="str">"ts"</span><span class="tag">&gt;</span>
<span class="keyword">import</span> { ref } <span class="keyword">from</span> <span class="str">'vue'</span>
<span class="keyword">const</span> count = ref(<span class="num">0</span>) <span class="cm">// HMR 时这个值会被保留</span>
<span class="tag">&lt;/script&gt;</span>\`,
  react: \`// React Fast Refresh（@vitejs/plugin-react）
// 自动支持：
// - 函数组件更新 → 保留 React 状态
// - Hook 顺序不变 → 状态不丢失
// - 导出组件 → 精准更新

// 需要在组件顶部添加（某些版本需要）：
// @refresh reset  // 强制重置状态\`,
}
<\/script>

<template>
  <div class="v04">
    <p class="intro">Vite 的 HMR 基于原生 ESM，只更新变化的模块，速度极快。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v04 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: var(--muted); }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tabs button { padding: 4px 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); cursor: pointer; font-size: 13px; }
.tabs .active { background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange)); color: #fff; border-color: transparent; }
.code-block { background: linear-gradient(180deg, #2a1e18, #231a16); color: #e0c8a8; padding: 14px; border-radius: 8px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; line-height: 1.6; }
.code-block .tag { color: #e8784a; }
.code-block .attr { color: #f5a040; }
.code-block .str { color: #7ab556; }
.code-block .keyword { color: #e8623a; }
.code-block .type { color: #f09060; }
.code-block .num { color: #f6c15a; }
.code-block .cm { color: #8a7060; }
</style>
`;export{a as default};
