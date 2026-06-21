<script setup>
import { ref, computed } from 'vue'

const baseImage = ref('node:20-alpine')
const layers = ref([
  { cmd: 'WORKDIR', arg: '/app', on: true },
  { cmd: 'COPY', arg: 'package*.json ./', on: true },
  { cmd: 'RUN', arg: 'npm ci --only=production', on: true },
  { cmd: 'COPY', arg: '. .', on: true },
  { cmd: 'EXPOSE', arg: '3000', on: true },
  { cmd: 'CMD', arg: '["node", "server.js"]', on: true },
])

const baseImages = ['node:20-alpine', 'node:20-slim', 'node:20']
const explanations = {
  WORKDIR: '设置容器内工作目录，后续命令在此目录执行',
  COPY: '将宿主机文件复制到容器，分两次 COPY 利用构建缓存',
  RUN: '执行命令并缓存结果层，安装依赖放在前面可利用缓存',
  EXPOSE: '声明容器监听端口（实际映射在 docker run 时指定）',
  CMD: '容器启动时执行的默认命令，可被 docker run 参数覆盖',
}

const dockerfile = computed(() => {
  const lines = [`FROM ${baseImage.value}`]
  layers.value.filter(l => l.on).forEach(l => lines.push(`${l.cmd} ${l.arg}`))
  return lines.join('\n')
})
</script>

<template><div class="demo-card">
  <p>交互式 Dockerfile 构建器：选择基础镜像，配置构建层，生成 Dockerfile。</p>
  <label>基础镜像 <select v-model="baseImage"><option v-for="img in baseImages" :key="img" :value="img">{{ img }}</option></select></label>
  <div class="layer-list">
    <label v-for="(l, i) in layers" :key="i" class="layer-item">
      <input type="checkbox" v-model="l.on" />
      <code>{{ l.cmd }}</code> <span>{{ l.arg }}</span>
    </label>
  </div>
  <pre class="mini-code"><code>{{ dockerfile }}</code></pre>
  <div v-if="layers.find(l => l.on)" class="explain">
    <p v-for="l in layers.filter(l => l.on)" :key="l.cmd"><strong>{{ l.cmd }}</strong>：{{ explanations[l.cmd] }}</p>
  </div>
  <small>Alpine 镜像体积最小（~50MB），适合生产部署；两次 COPY 分离依赖文件可加速后续构建。</small>
</div></template>

<style scoped>
.layer-list { margin: 0.6rem 0; display: flex; flex-direction: column; gap: 0.3rem; }
.layer-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
.layer-item code { min-width: 4rem; }
.explain { font-size: 0.85rem; margin-top: 0.6rem; padding: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 6px; }
.explain p { margin: 0.2rem 0; }
</style>
