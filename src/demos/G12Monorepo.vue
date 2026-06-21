<script setup lang="ts">
import { ref, computed } from 'vue'

interface Package {
  name: string
  version: string
  deps: string[]
  built: boolean
  building: boolean
}

const packages = ref<Package[]>([
  { name: 'core', version: '1.0.0', deps: [], built: false, building: false },
  { name: 'ui', version: '1.0.0', deps: ['core'], built: false, building: false },
  { name: 'app', version: '1.0.0', deps: ['core', 'ui'], built: false, building: false },
  { name: 'docs', version: '1.0.0', deps: ['core', 'ui'], built: false, building: false },
])

const selectedPkg = ref<string | null>(null)

const buildOrder = computed(() => {
  const order: string[] = []
  const visited = new Set<string>()

  function visit(name: string) {
    if (visited.has(name)) return
    visited.add(name)
    const pkg = packages.value.find((p) => p.name === name)
    if (pkg) {
      for (const dep of pkg.deps) visit(dep)
      order.push(name)
    }
  }

  packages.value.forEach((p) => visit(p.name))
  return order
})

const highlightDeps = computed(() => {
  if (!selectedPkg.value) return new Set<string>()
  const result = new Set<string>([selectedPkg.value])
  const pkg = packages.value.find((p) => p.name === selectedPkg.value)
  if (pkg) pkg.deps.forEach((d) => result.add(d))
  return result
})

const highlightDependents = computed(() => {
  if (!selectedPkg.value) return new Set<string>()
  const result = new Set<string>([selectedPkg.value])
  packages.value.forEach((p) => {
    if (p.deps.includes(selectedPkg.value!)) result.add(p.name)
  })
  return result
})

const allBuilt = computed(() => packages.value.every((p) => p.built))

async function runBuild() {
  packages.value.forEach((p) => { p.built = false; p.building = false })

  for (const name of buildOrder.value) {
    const pkg = packages.value.find((p) => p.name === name)
    if (!pkg) continue
    pkg.building = true
    selectedPkg.value = name
    await new Promise((r) => setTimeout(r, 250))
    pkg.building = false
    pkg.built = true
  }
}

function selectPkg(name: string) {
  selectedPkg.value = selectedPkg.value === name ? null : name
}

function bumpVersion(name: string) {
  const pkg = packages.value.find((p) => p.name === name)
  if (!pkg) return
  const parts = pkg.version.split('.').map(Number)
  parts[2]++
  pkg.version = parts.join('.')
  pkg.built = false
}
</script>

<template>
  <div class="demo-card">
    <p class="demo-hint">Monorepo 用 pnpm workspace 管理多包项目。点击包查看依赖关系，观察构建按拓扑顺序执行。</p>

    <div class="topo-graph">
      <div
        v-for="pkg in packages"
        :key="pkg.name"
        class="pkg-node"
        :class="{
          selected: selectedPkg === pkg.name,
          'dep-highlight': highlightDeps.has(pkg.name),
          'dependent-highlight': highlightDependents.has(pkg.name),
          built: pkg.built,
          building: pkg.building,
        }"
        @click="selectPkg(pkg.name)"
      >
        <strong>{{ pkg.name }}</strong>
        <span class="pkg-version">v{{ pkg.version }}</span>
        <span class="pkg-status">{{ pkg.built ? '✓' : pkg.building ? '…' : '○' }}</span>
      </div>
    </div>

    <div v-if="selectedPkg" class="pkg-detail">
      <p>
        <strong>{{ selectedPkg }}</strong> 依赖：
        {{ packages.find(p => p.name === selectedPkg)?.deps.length
          ? packages.find(p => p.name === selectedPkg)?.deps.join(', ')
          : '无（基础包）' }}
      </p>
      <p>被依赖：{{
        packages.filter(p => p.deps.includes(selectedPkg!)).map(p => p.name).join(', ') || '无'
      }}</p>
      <button class="bump-btn" @click="bumpVersion(selectedPkg!)">模拟修改（patch +1）</button>
    </div>

    <p class="build-order">
      构建顺序：<code>{{ buildOrder.join(' → ') }}</code>
    </p>

    <button
      :disabled="packages.some((p) => p.building)"
      @click="runBuild"
    >
      {{ allBuilt ? '重新构建' : '按拓扑顺序构建' }}
    </button>
  </div>
</template>

<style scoped>
.topo-graph {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 1rem 0;
}

.pkg-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 2px solid var(--border, #ddd);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  min-width: 5rem;
}

.pkg-node:hover { border-color: #bbb; }
.pkg-node.selected { border-color: #e8713a; background: rgba(232, 113, 58, 0.06); }
.pkg-node.dep-highlight { border-color: #2196f3; background: rgba(33, 150, 243, 0.06); }
.pkg-node.dependent-highlight { border-color: #9c27b0; background: rgba(156, 39, 176, 0.06); }
.pkg-node.built { border-color: #4caf50; }
.pkg-node.building { border-color: #e8713a; background: rgba(232, 113, 58, 0.1); }

.pkg-version {
  font-size: 0.75rem;
  color: #888;
}

.pkg-status {
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.pkg-detail {
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.04);
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
}

.pkg-detail p {
  margin: 0.2rem 0;
}

.bump-btn {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  background: none;
  border: 1px solid var(--border, #ddd);
  border-radius: 4px;
  cursor: pointer;
}

.bump-btn:hover { background: rgba(0, 0, 0, 0.04); }

.build-order {
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
}

.build-order code {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1em 0.4em;
  border-radius: 3px;
}
</style>
