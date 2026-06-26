<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('config')

const contents = {
  config: `// vite.config.ts
export default defineConfig({
  // Vite 使用 esbuild 转译 TS（很快，但不做类型检查）
  esbuild: {
    loader: 'ts',       // 处理 .ts
    target: 'es2020',   // 目标 ES 版本
  },
})

// TypeScript 类型检查由 IDE 或单独运行 tsc --noEmit 完成
// Vite 不负责类型检查（保证开发服务器速度）`,
  vue: `<span class="cm">&lt;!-- Vue SFC 中使用 TypeScript --&gt;</span>
<span class="tag">&lt;script</span> <span class="attr">lang</span>=<span class="str">"ts"</span> <span class="attr">setup</span><span class="tag">&gt;</span>
<span class="keyword">import</span> { ref } <span class="keyword">from</span> <span class="str">'vue'</span>

<span class="keyword">interface</span> <span class="type">User</span> {
  name: string
  age: number
}

<span class="keyword">const</span> user = ref(<span class="type">User</span>)({ name: <span class="str">'张三'</span>, age: 25 })
<span class="tag">&lt;/script&gt;</span>

<span class="cm">&lt;!-- 如果需要类型推导，建议使用 &lt;script setup lang="ts"&gt; --&gt;</span>
<span class="tag">&lt;script</span> <span class="attr">lang</span>=<span class="str">"ts"</span> <span class="attr">setup</span><span class="tag">&gt;</span>
<span class="cm">// 更好的类型推导和 IDE 支持</span>
<span class="keyword">const</span> count = ref(<span class="num">0</span>) <span class="cm">// 自动推导为 Ref&lt;number&gt;</span>
<span class="tag">&lt;/script&gt;</span>`,
  check: `// 类型检查方案
// 1. IDE 实时检查（推荐）
// VS Code + Volar 扩展

// 2. 构建时检查（慢但安全）
export default defineConfig({
  typescript: {
    enabled: true,  // 默认 false，启用后构建会做类型检查
  },
})

// 3. 单独运行（最灵活）
// package.json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "npm run type-check && vite build"
  }
}`,
}
</script>

<template>
  <div class="v13">
    <p class="intro">Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 <code>vue-tsc</code> 单独完成。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v13 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: var(--muted); }
.intro code { background: rgba(246, 193, 90, 0.2); padding: 1px 5px; border-radius: 3px; font-size: 12px; }
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
