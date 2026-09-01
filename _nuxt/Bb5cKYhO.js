const n=`<script setup lang="ts">
const tab = ref<'bem' | 'oocss' | 'smacss'>('bem')
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">CSS 架构方法论</h3>
    <p class="demo-desc">用课程卡片组件理解 BEM / OOCSS / SMACSS 的命名与组织思路。</p>
    <div class="controls">
      <button :class="['btn', { active: tab === 'bem' }]" @click="tab='bem'">BEM</button>
      <button :class="['btn', { active: tab === 'oocss' }]" @click="tab='oocss'">OOCSS</button>
      <button :class="['btn', { active: tab === 'smacss' }]" @click="tab='smacss'">SMACSS</button>
    </div>

    <div v-if="tab === 'bem'" class="method-demo">
      <div class="card card--hot">
        <div class="card__header">Vue3 组合式 API</div>
        <div class="card__body">深入理解 setup 与响应式原理。</div>
        <span class="card__badge">热门</span>
      </div>
      <pre class="code-block">/* BEM：Block__Element--Modifier */
.card { /* 块 */ }
.card__header { /* 元素 */ }
.card--hot { /* 修饰符 */ }
.card__badge { /* 子元素 */ }</pre>
      <div class="rules">
        <p>✅ 优点：类名语义清晰、无嵌套、可预测</p>
        <p>⚠️ 缺点：类名较长、HTML 较重</p>
      </div>
    </div>

    <div v-if="tab === 'oocss'" class="method-demo">
      <div class="media flex-row bg-white">
        <img class="media__img rounded" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23e8590c' width='48' height='48' rx='8'/%3E%3C/svg%3E" />
        <div class="media__body">
          <div class="text-bold">课程标题</div>
          <div class="text-muted">描述文字</div>
        </div>
      </div>
      <pre class="code-block">/* OOCSS：结构与皮肤分离 */
.flex-row { display: flex; gap: 8px; }  /* 结构 */
.bg-white { background: #fff; }        /* 皮肤 */
.text-bold { font-weight: 700; }        /* 修饰 */
.text-muted { color: #868e96; }       /* 修饰 */</pre>
    </div>

    <div v-if="tab === 'smacss'" class="method-demo">
      <pre class="code-block">/* SMACSS：按角色分 5 类 */
/* l- 布局 */
.l-sidebar { grid-area: sidebar; }

/* m- 模块 */
.m-course-card { border: 1px solid #ffd8a8; }

/* s- 状态 */
.s-is-active { background: #e8590c; color: #fff; }

/* t- 主题 */
.t-dark .m-course-card { background: #333; }

/* 基础样式 */
h3, p { margin: 0 0 8px; }</pre>
      <div class="prop-table">
        <div class="prop-row header"><span>方法</span><span>核心思想</span><span>适用场景</span></div>
        <div class="prop-row"><span>BEM</span><span>块 / 元素 / 修饰符</span><span>组件化项目</span></div>
        <div class="prop-row"><span>OOCSS</span><span>结构与皮肤分离</span><span>可复用 UI 库</span></div>
        <div class="prop-row"><span>SMACSS</span><span>按角色分类选择器</span><span>大型遗留项目</span></div>
        <div class="prop-row"><span>CSS Modules</span><span>局部作用域（哈希）</span><span>现代工程化项目</span></div>
      </div>
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

.method-demo { margin-bottom: 16px; }
.card { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 16px; position: relative; margin-bottom: 12px; }
.card--hot { border-color: var(--primary); }
.card__header { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.card__body { font-size: 12px; color: #666; }
.card__badge { position: absolute; top: 8px; right: 8px; background: var(--primary); color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 4px; }

.code-block { background: #1e1e2e; color: #cdd6f4; padding: 10px 12px; border-radius: 6px; font-size: 11px; line-height: 1.6; margin-bottom: 12px; overflow-x: auto; white-space: pre; }
.rules p { font-size: 12px; line-height: 1.8; }

.media { display: flex; gap: 12px; background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.media__img { width: 48px; height: 48px; }
.rounded { border-radius: 8px; }
.flex-row { display: flex; gap: 8px; }
.bg-white { background: #fff; }
.text-bold { font-weight: 700; }
.text-muted { color: #868e96; font-size: 12px; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr 1fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
`;export{n as default};
