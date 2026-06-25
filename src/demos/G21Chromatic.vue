<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'diff' | 'workflow' | 'config'>('diff')

const diffMode = ref<'side' | 'swipe' | 'fade'>('side')
const diffIntensity = ref(50)
const showChanges = ref(true)

interface Snapshot {
  id: string
  component: string
  story: string
  status: 'pass' | 'changed' | 'error'
  baseline: string
  latest: string
  changePercent: number
}

const snapshots = ref<Snapshot[]>([
  {
    id: '1',
    component: 'Button',
    story: 'Primary',
    status: 'pass',
    baseline: '基线版本',
    latest: '当前版本',
    changePercent: 0,
  },
  {
    id: '2',
    component: 'Button',
    story: 'Secondary',
    status: 'changed',
    baseline: '基线版本',
    latest: '当前版本',
    changePercent: 3.2,
  },
  {
    id: '3',
    component: 'Card',
    story: 'Default',
    status: 'changed',
    baseline: '基线版本',
    latest: '当前版本',
    changePercent: 15.6,
  },
  {
    id: '4',
    component: 'Modal',
    story: 'Open',
    status: 'pass',
    baseline: '基线版本',
    latest: '当前版本',
    changePercent: 0,
  },
  {
    id: '5',
    component: 'Input',
    story: 'WithError',
    status: 'error',
    baseline: '基线版本',
    latest: '当前版本',
    changePercent: 0,
  },
])

const selectedSnapshot = ref<string>('2')

const selectedSnap = computed(() =>
  snapshots.value.find(s => s.id === selectedSnapshot.value)
)

const buildStatus = ref<'idle' | 'running' | 'passed' | 'review'>('idle')
const progress = ref(0)
const reviewedCount = ref(2)
const totalChanges = ref(4)

const reviewers = [
  { name: '张三', role: '设计师', avatar: '👨‍🎨' },
  { name: '李四', role: '前端开发', avatar: '👨‍💻' },
  { name: '王五', role: '产品经理', avatar: '👨‍💼' },
]

const comments = ref([
  { id: 1, user: '张三', role: '设计师', avatar: '👨‍🎨', content: '按钮颜色比之前深了一点，确认是预期的吗？', time: '10:30', resolved: false },
  { id: 2, user: '李四', role: '前端开发', avatar: '👨‍💻', content: '是的，设计稿更新了主色调，从 #ea6c1a 调整为 #e85d04', time: '10:35', resolved: true },
])

const newComment = ref('')

const chromaticConfigCode = `<span style="color:#8a8a3a"># .github/workflows/chromatic.yml</span>
name: Chromatic

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install
      - run: pnpm build-storybook

      - uses: chromaui/action@v1
        with:
          projectToken: $\{{ secrets.CHROMATIC_PROJECT_TOKEN }}
          storybookBuildDir: storybook-static`

const packageJsonCode = `<span style="color:#8a8a3a">// package.json</span>
{
  <span style="color:#cc997a">"scripts"</span>: {
    <span style="color:#cc997a">"storybook"</span>: <span style="color:#a3b380">"storybook dev -p 6006"</span>,
    <span style="color:#cc997a">"build-storybook"</span>: <span style="color:#a3b380">"storybook build"</span>,
    <span style="color:#cc997a">"chromatic"</span>: <span style="color:#a3b380">"chromatic"</span>,
    <span style="color:#cc997a">"chromatic:build"</span>: <span style="color:#a3b380">"chromatic --build-script-name build-storybook"</span>
  },
  <span style="color:#cc997a">"devDependencies"</span>: {
    <span style="color:#cc997a">"chromatic"</span>: <span style="color:#a3b380">"^10.0.0"</span>,
    <span style="color:#cc997a">"@storybook/vue3-vite"</span>: <span style="color:#a3b380">"^7.0.0"</span>
  }
}`

const workflowSteps = [
  { step: '提交代码', desc: '开发者提交 PR' },
  { step: 'CI 运行', desc: 'GitHub Actions 触发 Chromatic' },
  { step: '快照采集', desc: '为每个 Story 生成截图' },
  { step: '视觉对比', desc: '像素级对比检测差异' },
  { step: '人工审查', desc: '团队确认变更是预期还是 Bug' },
  { step: '合入基线', desc: '通过后更新基线快照' },
]

const currentWorkflowStep = ref(3)

const stats = computed(() => ({
  total: snapshots.value.length,
  passed: snapshots.value.filter(s => s.status === 'pass').length,
  changed: snapshots.value.filter(s => s.status === 'changed').length,
  errors: snapshots.value.filter(s => s.status === 'error').length,
}))

async function runBuild() {
  if (buildStatus.value === 'running') return
  
  buildStatus.value = 'running'
  progress.value = 0
  
  for (let i = 0; i <= 100; i += 5) {
    progress.value = i
    await new Promise(r => setTimeout(r, 80))
  }
  
  buildStatus.value = 'review'
}

function approveAll() {
  buildStatus.value = 'passed'
  snapshots.value.forEach(s => {
    if (s.status === 'changed') s.status = 'pass'
  })
}

function resetBuild() {
  buildStatus.value = 'idle'
  progress.value = 0
  snapshots.value = [
    { id: '1', component: 'Button', story: 'Primary', status: 'pass', baseline: '基线版本', latest: '当前版本', changePercent: 0 },
    { id: '2', component: 'Button', story: 'Secondary', status: 'changed', baseline: '基线版本', latest: '当前版本', changePercent: 3.2 },
    { id: '3', component: 'Card', story: 'Default', status: 'changed', baseline: '基线版本', latest: '当前版本', changePercent: 15.6 },
    { id: '4', component: 'Modal', story: 'Open', status: 'pass', baseline: '基线版本', latest: '当前版本', changePercent: 0 },
    { id: '5', component: 'Input', story: 'WithError', status: 'error', baseline: '基线版本', latest: '当前版本', changePercent: 0 },
  ]
}

function addComment() {
  if (!newComment.value.trim()) return
  comments.value.push({
    id: Date.now(),
    user: '你',
    role: '当前用户',
    avatar: '🧑',
    content: newComment.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    resolved: false,
  })
  newComment.value = ''
}

function resolveComment(id: number) {
  const c = comments.value.find(c => c.id === id)
  if (c) c.resolved = !c.resolved
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pass': return '#65a30d'
    case 'changed': return '#e85d04'
    case 'error': return '#dc2626'
    default: return '#888'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'pass': return '通过'
    case 'changed': return '有变化'
    case 'error': return '错误'
    default: return '未知'
  }
}
</script>

<template>
  <div class="demo-card">
    <h3>Chromatic 视觉回归测试与 UI 审查</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'diff' }" @click="activeTab = 'diff'">差异对比</button>
      <button class="tab-btn" :class="{ active: activeTab === 'workflow' }" @click="activeTab = 'workflow'">审查流程</button>
      <button class="tab-btn" :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置集成</button>
    </div>

    <div v-if="activeTab === 'diff'">
      <p class="demo-hint">Chromatic 自动对比组件快照，像素级检测视觉变化。</p>

      <div class="snapshot-list">
        <div class="snapshot-stats">
          <div class="stat-chip pass">✓ {{ stats.passed }} 通过</div>
          <div class="stat-chip changed">⚠ {{ stats.changed }} 变化</div>
          <div class="stat-chip error">✕ {{ stats.errors }} 错误</div>
        </div>

        <div class="snapshot-grid">
          <div
            v-for="snap in snapshots"
            :key="snap.id"
            class="snapshot-card"
            :class="{ active: selectedSnapshot === snap.id, [snap.status]: true }"
            @click="selectedSnapshot = snap.id"
          >
            <div class="snap-preview" :class="snap.status">
              <span v-if="snap.status === 'pass'" class="snap-check">✓</span>
              <span v-else-if="snap.status === 'changed'" class="snap-diff">
                <div class="diff-box baseline"></div>
                <div class="diff-box latest"></div>
              </span>
              <span v-else class="snap-error">✕</span>
            </div>
            <div class="snap-info">
              <div class="snap-component">{{ snap.component }}</div>
              <div class="snap-story">{{ snap.story }}</div>
            </div>
            <div class="snap-status-badge" :style="{ backgroundColor: getStatusColor(snap.status) }">
              {{ getStatusText(snap.status) }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedSnap" class="diff-viewer">
        <div class="diff-toolbar">
          <span class="diff-title">{{ selectedSnap.component }} - {{ selectedSnap.story }}</span>
          <div class="diff-modes">
            <button
              v-for="mode in ['side', 'swipe', 'fade'] as const"
              :key="mode"
              :class="['mode-btn', { active: diffMode === mode }]"
              @click="diffMode = mode"
            >
              {{ mode === 'side' ? '并排' : mode === 'swipe' ? '滑动' : '淡出' }}
            </button>
          </div>
          <div class="diff-controls" v-if="selectedSnap.status === 'changed'">
            <label class="toggle-label">
              <input type="checkbox" v-model="showChanges" />
              高亮差异
            </label>
            <label class="intensity-label">
              强度
              <input type="range" v-model.number="diffIntensity" min="10" max="100" />
              {{ diffIntensity }}%
            </label>
          </div>
        </div>

        <div class="diff-container">
          <div v-if="diffMode === 'side'" class="side-by-side">
            <div class="diff-pane">
              <div class="pane-label">基线</div>
              <div class="mock-component baseline-version">
                <div class="mock-header">
                  <div class="mock-avatar"></div>
                  <div>
                    <div class="mock-title">产品卡片</div>
                    <div class="mock-subtitle">¥99.00</div>
                  </div>
                </div>
                <button class="mock-btn baseline-btn">立即购买</button>
              </div>
            </div>
            <div class="diff-divider" v-if="showChanges && selectedSnap.status === 'changed'">
              <span>{{ selectedSnap.changePercent }}%</span>
            </div>
            <div class="diff-pane">
              <div class="pane-label latest">最新</div>
              <div class="mock-component latest-version" :class="{ 'show-changes': showChanges }">
                <div class="mock-header">
                  <div class="mock-avatar new-avatar"></div>
                  <div>
                    <div class="mock-title new-title">产品卡片</div>
                    <div class="mock-subtitle new-subtitle">¥99.00 <span class="discount">立省20%</span></div>
                  </div>
                </div>
                <button class="mock-btn latest-btn">立即购买</button>
                <div class="new-badge">HOT</div>
              </div>
            </div>
          </div>

          <div v-else-if="diffMode === 'swipe'" class="swipe-container">
            <div class="swipe-baseline">
              <div class="mock-component baseline-version">
                <div class="mock-header">
                  <div class="mock-avatar"></div>
                  <div>
                    <div class="mock-title">产品卡片</div>
                    <div class="mock-subtitle">¥99.00</div>
                  </div>
                </div>
                <button class="mock-btn baseline-btn">立即购买</button>
              </div>
            </div>
            <div class="swipe-handle">
              <div class="handle-line"></div>
              <div class="handle-knob">⇔</div>
            </div>
            <div class="swipe-latest">
              <div class="mock-component latest-version">
                <div class="mock-header">
                  <div class="mock-avatar new-avatar"></div>
                  <div>
                    <div class="mock-title new-title">产品卡片</div>
                    <div class="mock-subtitle new-subtitle">¥99.00</div>
                  </div>
                </div>
                <button class="mock-btn latest-btn">立即购买</button>
                <div class="new-badge">HOT</div>
              </div>
            </div>
          </div>

          <div v-else class="fade-container">
            <div class="fade-baseline">
              <div class="mock-component baseline-version">
                <div class="mock-header">
                  <div class="mock-avatar"></div>
                  <div>
                    <div class="mock-title">产品卡片</div>
                    <div class="mock-subtitle">¥99.00</div>
                  </div>
                </div>
                <button class="mock-btn baseline-btn">立即购买</button>
              </div>
            </div>
            <div class="fade-latest" :style="{ opacity: diffIntensity / 100 }">
              <div class="mock-component latest-version">
                <div class="mock-header">
                  <div class="mock-avatar new-avatar"></div>
                  <div>
                    <div class="mock-title new-title">产品卡片</div>
                    <div class="mock-subtitle new-subtitle">¥99.00 <span class="discount">立省20%</span></div>
                  </div>
                </div>
                <button class="mock-btn latest-btn">立即购买</button>
                <div class="new-badge">HOT</div>
              </div>
            </div>
            <div class="fade-slider">
              <input type="range" v-model.number="diffIntensity" min="0" max="100" />
              <span>不透明度: {{ diffIntensity }}%</span>
            </div>
          </div>
        </div>

        <div class="comment-section">
          <h4>💬 审查评论</h4>
          <div class="comment-list">
            <div v-for="c in comments" :key="c.id" class="comment-item" :class="{ resolved: c.resolved }">
              <div class="comment-avatar">{{ c.avatar }}</div>
              <div class="comment-body">
                <div class="comment-header">
                  <strong>{{ c.user }}</strong>
                  <span class="comment-role">{{ c.role }}</span>
                  <span class="comment-time">{{ c.time }}</span>
                  <button class="resolve-btn" @click="resolveComment(c.id)">
                    {{ c.resolved ? '重新打开' : '标记解决' }}
                  </button>
                </div>
                <p class="comment-content">{{ c.content }}</p>
              </div>
            </div>
          </div>
          <div class="comment-input">
            <input v-model="newComment" type="text" placeholder="添加评论..." @keyup.enter="addComment" />
            <button @click="addComment">发送</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'workflow'">
      <p class="demo-hint">Chromatic 将视觉测试融入 CI/CD 流程，实现自动化 UI 审查。</p>

      <div class="workflow-timeline">
        <div
          v-for="(step, i) in workflowSteps"
          :key="i"
          class="timeline-item"
          :class="{ active: currentWorkflowStep === i, done: currentWorkflowStep > i }"
        >
          <div class="timeline-dot">{{ i + 1 }}</div>
          <div class="timeline-content">
            <strong>{{ step.step }}</strong>
            <p><small>{{ step.desc }}</small></p>
          </div>
        </div>
      </div>

      <div class="build-panel">
        <h4>构建 #248</h4>
        
        <div v-if="buildStatus === 'idle'" class="build-actions">
          <button @click="runBuild">触发构建</button>
        </div>

        <div v-else-if="buildStatus === 'running'" class="build-running">
          <div class="progress-bar-container">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p>正在采集快照... {{ progress }}%</p>
        </div>

        <div v-else-if="buildStatus === 'review'" class="build-review">
          <div class="review-summary">
            <div class="review-stat">
              <span class="big-number">{{ stats.changed }}</span>
              <span>待审查</span>
            </div>
            <div class="review-stat">
              <span class="big-number">{{ reviewedCount }}</span>
              <span>已审查</span>
            </div>
            <div class="review-stat">
              <span class="big-number">{{ reviewers.length }}</span>
              <span>审查者</span>
            </div>
          </div>

          <div class="reviewers">
            <span v-for="r in reviewers" :key="r.name" class="reviewer-chip">
              {{ r.avatar }} {{ r.name }}
            </span>
          </div>

          <div class="review-actions">
            <button @click="approveAll">✅ 全部通过并更新基线</button>
            <button @click="resetBuild" class="btn-secondary">重新构建</button>
          </div>
        </div>

        <div v-else-if="buildStatus === 'passed'" class="build-passed">
          <div class="passed-icon">✓</div>
          <p>所有检查已通过，基线已更新！</p>
          <button @click="resetBuild" class="btn-secondary">重新开始</button>
        </div>
      </div>

      <div class="tips-box">
        <p><strong>核心优势：</strong></p>
        <ul>
          <li>像素级精度：精确捕捉每一个视觉变化</li>
          <li>自动化：融入 CI 流程，无需人工截图对比</li>
          <li>协作审查：设计师、产品、开发共同参与 UI 验收</li>
          <li>历史追溯：保留所有版本快照，随时回溯对比</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'config'">
      <p class="demo-hint">Chromatic 与 Storybook 深度集成，支持主流 CI 平台。</p>
      
      <pre class="mini-code" v-html="chromaticConfigCode"></pre>
      <pre class="mini-code" v-html="packageJsonCode" style="margin-top:8px;"></pre>

      <div class="feature-grid">
        <div class="feature-item">
          <div class="feature-icon">🔄</div>
          <div>
            <strong>自动快照</strong>
            <p><small>每个 Story 自动生成快照</small></p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <div>
            <strong>像素对比</strong>
            <p><small>智能差异检测算法</small></p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">👥</div>
          <div>
            <strong>协作审查</strong>
            <p><small>团队可视化 UI Review</small></p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📱</div>
          <div>
            <strong>多视口</strong>
            <p><small>支持不同断点测试</small></p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <div>
            <strong>TurboSnap</strong>
            <p><small>只重新构建变更的组件</small></p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔐</div>
          <div>
            <strong>安全私有</strong>
            <p><small>SSO、权限管理</small></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tips-box ul { margin: 4px 0 0 16px; padding: 0; }
.tips-box li { font-size: 12px; margin: 2px 0; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
.demo-hint { font-size: 13px; color: #8a6d42; margin-bottom: 10px; }

.snapshot-list { margin-bottom: 16px; }
.snapshot-stats { display: flex; gap: 8px; margin-bottom: 12px; }
.stat-chip { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; color: #fff; }
.stat-chip.pass { background: #65a30d; }
.stat-chip.changed { background: #e85d04; }
.stat-chip.error { background: #dc2626; }

.snapshot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
.snapshot-card { border: 2px solid #ddd; border-radius: 6px; overflow: hidden; cursor: pointer; transition: all 0.2s; background: #fff; }
.snapshot-card:hover { border-color: #e0a06a; }
.snapshot-card.active { border-color: #e85d04; box-shadow: 0 2px 8px rgba(232,93,4,0.2); }
.snap-preview { height: 60px; display: flex; align-items: center; justify-content: center; background: #fafafa; position: relative; }
.snapshot-card.pass .snap-preview { background: #f0fdf4; }
.snapshot-card.changed .snap-preview { background: #fff7ed; }
.snapshot-card.error .snap-preview { background: #fef2f2; }
.snap-check { color: #65a30d; font-size: 24px; font-weight: bold; }
.snap-error { color: #dc2626; font-size: 24px; font-weight: bold; }
.snap-diff { display: flex; gap: 2px; }
.diff-box { width: 24px; height: 32px; border-radius: 3px; }
.diff-box.baseline { background: #ddd; }
.diff-box.latest { background: #e85d04; opacity: 0.7; }

.snap-info { padding: 6px 8px; }
.snap-component { font-size: 12px; font-weight: 500; }
.snap-story { font-size: 11px; color: #888; }
.snap-status-badge { position: absolute; top: 4px; right: 4px; color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 3px; }
.snapshot-card { position: relative; }

.diff-viewer { border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
.diff-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #fafafa; border-bottom: 1px solid #eee; flex-wrap: wrap; gap: 8px; }
.diff-title { font-weight: 500; font-size: 13px; }
.diff-modes { display: flex; gap: 4px; }
.mode-btn { padding: 4px 10px; border: 1px solid #ddd; background: #fff; border-radius: 4px; cursor: pointer; font-size: 12px; }
.mode-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.diff-controls { display: flex; align-items: center; gap: 12px; font-size: 12px; }
.toggle-label { display: flex; align-items: center; gap: 4px; cursor: pointer; }
.intensity-label { display: flex; align-items: center; gap: 6px; }
.intensity-label input[type="range"] { width: 80px; }

.diff-container { padding: 20px; background: #f5f5f5; }

.side-by-side { display: flex; gap: 12px; align-items: center; justify-content: center; }
.diff-pane { flex: 1; max-width: 280px; }
.pane-label { text-align: center; font-size: 12px; font-weight: 500; margin-bottom: 8px; color: #666; }
.pane-label.latest { color: #e85d04; }
.diff-divider { display: flex; flex-direction: column; align-items: center; color: #dc2626; font-weight: bold; font-size: 14px; }

.mock-component { background: #fff; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: relative; transition: all 0.3s; }
.mock-header { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
.mock-avatar { width: 48px; height: 48px; border-radius: 8px; background: linear-gradient(135deg, #f0a06a, #e85d04); }
.mock-avatar.new-avatar { background: linear-gradient(135deg, #e85d04, #dc2626); border-radius: 50%; }
.mock-title { font-weight: 600; font-size: 14px; }
.mock-title.new-title { color: #e85d04; }
.mock-subtitle { font-size: 12px; color: #888; }
.mock-subtitle.new-subtitle { color: #65a30d; font-weight: 500; }
.discount { background: #fef2f2; color: #dc2626; padding: 1px 6px; border-radius: 3px; font-size: 10px; margin-left: 4px; }
.mock-btn { width: 100%; padding: 8px; border: none; border-radius: 6px; color: #fff; font-weight: 500; cursor: pointer; }
.mock-btn.baseline-btn { background: #f0a06a; }
.mock-btn.latest-btn { background: #e85d04; }
.new-badge { position: absolute; top: -8px; right: -8px; background: #dc2626; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 10px; }

.show-changes .new-avatar { box-shadow: 0 0 0 2px #dc2626; }
.show-changes .new-title { text-decoration: underline; text-decoration-color: #dc2626; }
.show-changes .latest-btn { box-shadow: 0 0 0 2px #dc2626; }

.swipe-container { position: relative; max-width: 280px; margin: 0 auto; height: 180px; overflow: hidden; border-radius: 8px; }
.swipe-baseline { position: absolute; inset: 0; }
.swipe-latest { position: absolute; inset: 0; clip-path: inset(0 0 0 50%); }
.swipe-handle { position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; }
.handle-line { width: 2px; flex: 1; background: #e85d04; }
.handle-knob { width: 32px; height: 32px; background: #e85d04; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }

.fade-container { position: relative; max-width: 280px; margin: 0 auto; }
.fade-baseline { position: relative; }
.fade-latest { position: absolute; inset: 0; transition: opacity 0.3s; }
.fade-slider { margin-top: 12px; text-align: center; font-size: 12px; color: #666; }
.fade-slider input { width: 100%; margin-bottom: 4px; }

.comment-section { border-top: 1px solid #eee; padding: 12px; background: #fff; }
.comment-section h4 { margin: 0 0 10px 0; font-size: 13px; color: #e85d04; }
.comment-list { max-height: 160px; overflow-y: auto; margin-bottom: 10px; }
.comment-item { display: flex; gap: 8px; padding: 8px; border-radius: 6px; margin-bottom: 8px; background: #fafafa; }
.comment-item.resolved { opacity: 0.6; }
.comment-avatar { font-size: 20px; flex-shrink: 0; }
.comment-body { flex: 1; }
.comment-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap; }
.comment-header strong { font-size: 12px; }
.comment-role { font-size: 10px; background: #fff3e0; color: #e85d04; padding: 1px 6px; border-radius: 3px; }
.comment-time { font-size: 10px; color: #999; margin-left: auto; }
.resolve-btn { font-size: 10px; padding: 2px 6px; border: 1px solid #ddd; background: #fff; border-radius: 3px; cursor: pointer; }
.comment-content { margin: 0; font-size: 12px; }
.comment-input { display: flex; gap: 6px; }
.comment-input input { flex: 1; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; }
.comment-input button { padding: 6px 14px; border: none; background: #e85d04; color: #fff; border-radius: 4px; cursor: pointer; font-size: 12px; }

.workflow-timeline { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; }
.timeline-item { display: flex; gap: 12px; position: relative; padding-bottom: 16px; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-dot { width: 28px; height: 28px; border-radius: 50%; background: #ddd; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0; z-index: 1; }
.timeline-item.active .timeline-dot { background: #e85d04; }
.timeline-item.done .timeline-dot { background: #65a30d; }
.timeline-content { flex: 1; padding-top: 2px; }
.timeline-content strong { font-size: 13px; }
.timeline-content p { margin: 2px 0 0 0; }
.timeline-item::after { content: ''; position: absolute; left: 13px; top: 28px; width: 2px; height: calc(100% - 12px); background: #ddd; }
.timeline-item:last-child::after { display: none; }
.timeline-item.done::after { background: #65a30d; }

.build-panel { background: #fff8f0; border-radius: 6px; padding: 16px; border: 1px solid #f4e0c8; }
.build-panel h4 { margin: 0 0 12px 0; color: #e85d04; font-size: 14px; }
.build-actions { text-align: center; }
.build-running { text-align: center; }
.progress-bar-container { height: 8px; background: #f0e0d0; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #e85d04, #f4a261); transition: width 0.3s; }
.build-running p { margin: 0; font-size: 13px; color: #8a6d42; }

.build-review .review-summary { display: flex; justify-content: space-around; margin-bottom: 12px; }
.review-stat { text-align: center; }
.big-number { display: block; font-size: 28px; font-weight: bold; color: #e85d04; }
.review-stat span:last-child { font-size: 12px; color: #8a6d42; }

.reviewers { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; justify-content: center; }
.reviewer-chip { background: #fff; border: 1px solid #e0a06a; padding: 4px 10px; border-radius: 16px; font-size: 12px; }

.review-actions { display: flex; gap: 8px; justify-content: center; }
.btn-secondary { background: #fff !important; border: 1px solid #e0a06a !important; color: #e85d04 !important; }

.build-passed { text-align: center; }
.passed-icon { width: 64px; height: 64px; margin: 0 auto 12px; background: #65a30d; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; }
.build-passed p { margin: 0 0 12px 0; font-weight: 500; color: #65a30d; }

.feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; }
.feature-item { display: flex; gap: 10px; padding: 10px 12px; background: #fff8f0; border-radius: 6px; border: 1px solid #f4e0c8; }
.feature-icon { font-size: 20px; flex-shrink: 0; }
.feature-item strong { display: block; font-size: 13px; margin-bottom: 2px; }
.feature-item p { margin: 0; }
</style>
