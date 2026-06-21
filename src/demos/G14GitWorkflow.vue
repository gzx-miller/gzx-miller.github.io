<script setup>
import { ref, computed } from 'vue'

const workflow = ref('github')
const workflows = {
  gitflow: { name: 'Git Flow', desc: '严格的分支模型：main / develop / feature / release / hotfix，适合版本发布周期较长的项目。', branches: ['main', 'develop', 'feature/*', 'release/*', 'hotfix/*'] },
  github: { name: 'GitHub Flow', desc: '轻量级：只有 main 和 feature 分支，通过 PR 合入 main 后自动部署，适合持续部署团队。', branches: ['main', 'feature/*'] },
  trunk: { name: 'Trunk-Based', desc: '所有人直接在 main 上开发，用 Feature Flag 控制功能上线，适合高成熟度团队。', branches: ['main'] }
}

const commitType = ref('feat')
const commitScope = ref('')
const commitDesc = ref('添加用户注册接口')
const types = [
  { val: 'feat', label: 'feat — 新功能' },
  { val: 'fix', label: 'fix — 修复缺陷' },
  { val: 'docs', label: 'docs — 文档变更' },
  { val: 'refactor', label: 'refactor — 重构' },
  { val: 'test', label: 'test — 测试相关' },
  { val: 'chore', label: 'chore — 构建/工具' },
]
const commitMsg = computed(() => {
  const scope = commitScope.value ? `(${commitScope.value})` : ''
  return `${commitType.value}${scope}: ${commitDesc.value}`
})
</script>

<template><div class="demo-card">
  <p>选择合适的 Git 工作流与提交规范是团队协作的基础。</p>
  <div class="toggle-row">
    <button v-for="(v, k) in workflows" :key="k" :class="{ active: workflow === k }" @click="workflow = k">{{ v.name }}</button>
  </div>
  <p>{{ workflows[workflow].desc }}</p>
  <div class="branch-list">
    <span v-for="b in workflows[workflow].branches" :key="b" class="branch-tag">{{ b }}</span>
  </div>
  <hr />
  <strong>Conventional Commits 规范</strong>
  <div class="commit-builder">
    <select v-model="commitType"><option v-for="t in types" :key="t.val" :value="t.val">{{ t.label }}</option></select>
    <input v-model="commitScope" placeholder="scope（可选）" />
    <input v-model="commitDesc" placeholder="简要描述" />
  </div>
  <pre class="mini-code"><code>{{ commitMsg }}</code></pre>
  <small>配合 <code>husky</code> + <code>lint-staged</code> + <code>commitlint</code> 在 pre-commit / commit-msg 钩子中自动校验。</small>
</div></template>

<style scoped>
.branch-list { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.5rem 0; }
.branch-tag { background: rgba(0,0,0,0.06); padding: 0.15rem 0.5rem; border-radius: 4px; font-family: monospace; font-size: 0.85rem; }
.commit-builder { display: flex; gap: 0.5rem; margin: 0.5rem 0; flex-wrap: wrap; }
.commit-builder select, .commit-builder input { padding: 0.3rem 0.5rem; border: 1px solid var(--border, #ddd); border-radius: 4px; font-size: 0.9rem; }
</style>
