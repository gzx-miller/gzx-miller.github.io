<script setup>
import { ref, computed } from 'vue'

const approach = ref('federation')
const approaches = {
  federation: {
    name: 'Module Federation',
    desc: 'Webpack 5 原生支持，构建时暴露/消费远程模块，共享依赖自动协商版本。',
    pros: ['无运行时框架开销', '共享依赖自动去重', '独立构建部署'],
    cons: ['强依赖 Webpack 生态', '版本协商可能冲突'],
  },
  qiankun: {
    name: 'qiankun',
    desc: '基于 single-spa 封装，通过 JS 沙箱和样式隔离实现子应用接入。',
    pros: ['框架无关', 'JS 沙箱隔离', '预加载策略'],
    cons: ['沙箱有性能开销', 'CSS 隔离不完美'],
  },
  iframe: {
    name: 'iframe 方案',
    desc: '天然隔离，通过 postMessage 通信，最简单也最重。',
    pros: ['完全隔离', '接入成本最低', '兼容性好'],
    cons: ['白屏与加载慢', '通信较复杂', 'SEO 不友好'],
  }
}

const sharedDeps = [
  { name: 'react', host: '18.2.0', remote: '18.2.0', strategy: 'singleton' },
  { name: 'lodash', host: '4.17.21', remote: '4.17.21', strategy: 'singleton' },
  { name: 'axios', host: '1.6.0', remote: '1.5.0', strategy: '版本取高' },
]
</script>

<template><div class="demo-card">
  <p>微前端将大型应用拆分为独立开发、独立部署的子应用，由主应用统一调度。</p>
  <div class="toggle-row">
    <button v-for="(v, k) in approaches" :key="k" :class="{ active: approach === k }" @click="approach = k">{{ v.name }}</button>
  </div>
  <p>{{ approaches[approach].desc }}</p>
  <div class="arch-diagram">
    <div class="host-box">主应用 (Host)
      <div v-for="v in Object.keys(approaches).filter(k => k !== approach)" :key="v" class="remote-box">子应用 {{ v }}</div>
    </div>
  </div>
  <div class="pros-cons">
    <div><strong>优势</strong><ul><li v-for="p in approaches[approach].pros" :key="p">{{ p }}</li></ul></div>
    <div><strong>局限</strong><ul><li v-for="c in approaches[approach].cons" :key="c">{{ c }}</li></ul></div>
  </div>
  <strong>共享依赖策略</strong>
  <table class="route-table">
    <thead><tr><th>包名</th><th>Host</th><th>Remote</th><th>策略</th></tr></thead>
    <tbody>
      <tr v-for="d in sharedDeps" :key="d.name"><td>{{ d.name }}</td><td>{{ d.host }}</td><td>{{ d.remote }}</td><td>{{ d.strategy }}</td></tr>
    </tbody>
  </table>
  <small>选择方案时需权衡隔离程度、集成成本与团队自治需求。</small>
</div></template>

<style scoped>
.arch-diagram { margin: 0.8rem 0; }
.host-box { padding: 0.8rem; border: 2px solid #e8713a; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; font-weight: bold; }
.remote-box { padding: 0.4rem 0.8rem; border: 1px solid var(--border, #ddd); border-radius: 6px; font-weight: normal; font-size: 0.85rem; background: rgba(0,0,0,0.03); }
.pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin: 0.6rem 0; font-size: 0.9rem; }
.pros-cons ul { margin: 0.3rem 0; padding-left: 1.2rem; }
.pros-cons li { margin: 0.15rem 0; }
.route-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 10px;
}
.route-table th,
.route-table td {
  padding: 6px 8px;
  border: 1px solid #ddd;
  text-align: left;
}
.route-table th {
  background: #fff3e0;
}
.toggle-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.toggle-row button {
  padding: 5px 14px;
  border: 1px solid #e0a06a;
  border-radius: 4px;
  background: #fff;
  color: var(--text);
  cursor: pointer;
  font-size: 13px;
}
.toggle-row button.active {
  background: #e85d04;
  color: #fff;
  border-color: #e85d04;
}
</style>
