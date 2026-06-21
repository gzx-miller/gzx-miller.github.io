<script setup lang="ts">
const active = ref('will-change')
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">CSS 性能优化</h3>
    <p class="demo-desc">理解渲染阻塞、图层提升、动画性能与 content-visibility 等优化手段。</p>
    <div class="controls">
      <button :class="['btn', { active: active === 'will-change' }]" @click="active='will-change'">will-change</button>
      <button :class="['btn', { active: active === 'layer' }]" @click="active='layer'">图层提升</button>
      <button :class="['btn', { active: active === 'content-visibility' }]" @click="active='content-visibility'">content-visibility</button>
      <button :class="['btn', { active: active === 'best-practice' }]" @click="active='best-practice'">最佳实践</button>
    </div>

    <div v-if="active === 'will-change'" class="perf-demo">
      <div class="perf-box bad">未优化：动画导致整页重绘</div>
      <div class="perf-box good">优化后：will-change 提前创建图层</div>
      <pre class="code-block">/* ❌ 避免滥用 */
.will-change-everything { will-change: transform, opacity, scroll-position; }

/* ✅ 只在需要前设置，用完后移除 */
.animated { will-change: transform; transition: transform 0.3s; }</pre>
    </div>

    <div v-if="active === 'layer'" class="perf-demo">
      <div class="layer-demo">
        <div class="box layer-promoted">已提升图层（transform: translateZ(0)）</div>
        <div class="box no-layer">未提升（可能触发重绘）</div>
      </div>
      <pre class="code-block">/* 提升为独立合成层（常用技巧）*/
.promote { transform: translateZ(0); }
/* 或 */
.promote { will-change: transform; }</pre>
      <p class="note">⚠️ 图层过多会占用大量 GPU 内存，反而降低性能。</p>
    </div>

    <div v-if="active === 'content-visibility'" class="perf-demo">
      <pre class="code-block">/* 跳过屏幕外内容的渲染工作 */
.lazy-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px; /* 预留高度，避免滚动跳变 */
}

/* contain 属性：限制渲染范围 */
.contained {
  contain: layout style paint;
}</pre>
      <div class="prop-table">
        <div class="prop-row header"><span>属性</span><span>作用</span></div>
        <div class="prop-row"><span>content-visibility</span><span>跳过离屏元素的渲染</span></div>
        <div class="prop-row"><span>contain</span><span>限制渲染/布局边界</span></div>
        <div class="prop-row"><span>contain-intrinsic-size</span><span>为 content-visibility 预留尺寸</span></div>
      </div>
    </div>

    <div v-if="active === 'best-practice'" class="perf-demo">
      <div class="tips">
        <div class="tip">🚀 <strong>动画优先用 transform / opacity</strong>：这两个属性可由 GPU 合成，不触发重排重绘。</div>
        <div class="tip">📦 <strong>减少选择器嵌套深度</strong>：浏览器从右向左解析，深度过大影响匹配速度。</div>
        <div class="tip">🔽 <strong>避免 @import</strong>：阻塞渲染，改用 &lt;link&gt; 或打包工具合并。</div>
        <div class="tip">🎯 <strong>避免频繁读写布局属性</strong>：会强制同步布局（layout thrashing），应批量读取/写入。</div>
        <div class="tip">🧹 <strong>移除未使用的 CSS</strong>：使用 PurgeCSS 或构建工具按需保留。</div>
      </div>
      <pre class="code-block">/* ✅ 高性能动画属性 */
.animate-good { transition: transform 0.3s, opacity 0.3s; }

/* ❌ 触发重排的属性 */
.animate-bad { transition: width 0.3s, height 0.3s, margin 0.3s; }</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.perf-demo { margin-bottom: 16px; }
.perf-box { padding: 10px 14px; border-radius: 6px; font-size: 12px; margin-bottom: 8px; }
.perf-box.bad { background: #fff5f5; border: 1px solid #fa5252; color: #c92a2a; }
.perf-box.good { background: var(--primary-light); border: 1px solid var(--border); color: var(--primary); }

.layer-demo { display: flex; gap: 12px; margin-bottom: 12px; }
.box { padding: 12px; border-radius: 6px; font-size: 12px; background: var(--primary-light); border: 1px solid var(--border); }
.box.layer-promoted { transform: translateZ(0); background: var(--primary); color: #fff; }

.code-block { background: #1e1e2e; color: #cdd6f4; padding: 10px 12px; border-radius: 6px; font-size: 11px; line-height: 1.6; margin-bottom: 12px; overflow-x: auto; white-space: pre; }
.note { font-size: 12px; color: #666; background: #fff3bf; padding: 6px 10px; border-radius: 4px; }

.tips { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.tip { font-size: 12px; line-height: 1.6; background: var(--primary-light); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
