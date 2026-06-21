<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'env' | 'config' | 'pipeline'>('env')

const envVars = [
  { key: 'NODE_ENV', dev: 'development', prod: 'production', client: '✅', note: '框架自动读取，决定开发/生产行为' },
  { key: 'VITE_API_URL', dev: 'http://localhost:3001', prod: 'https://api.example.com', client: '✅', note: 'Vite 前缀 VITE_ 的变量暴露给客户端' },
  { key: 'NUXT_PUBLIC_API_BASE', dev: 'http://localhost:3001', prod: 'https://api.example.com', client: '✅', note: 'Nuxt runtimeConfig.public 暴露客户端' },
  { key: 'DATABASE_URL', dev: 'postgresql://localhost:5432/dev', prod: 'postgresql://prod-db:5432/app', client: '❌', note: '仅服务端，绝不进入前端 bundle' },
  { key: 'JWT_SECRET', dev: 'dev-secret-change-me', prod: '（长随机字符串）', client: '❌', note: '密钥只服务端可用' },
  { key: 'STRIPE_SECRET_KEY', dev: 'sk_test_...', prod: 'sk_live_...', client: '❌', note: '第三方密钥，仅服务端' },
]

const configFiles = [
  { file: '.env', scope: '所有环境', priority: '最低', gitignore: '提交', note: '默认值，团队共享' },
  { file: '.env.local', scope: '本地开发', priority: '覆盖 .env', gitignore: '不提交', note: '个人本地覆盖' },
  { file: '.env.development', scope: '开发环境', priority: '高于 .env', gitignore: '提交', note: 'npm run dev 时加载' },
  { file: '.env.production', scope: '生产环境', priority: '高于 .env', gitignore: '提交', note: 'npm run build 时加载' },
]

const pipeline = [
  { stage: '开发', tools: 'ESLint + Prettier + TypeScript', check: '代码规范、类型检查' },
  { stage: '提交', tools: 'Husky + lint-staged', check: 'pre-commit 钩子拦截不规范代码' },
  { stage: 'CI', tools: 'GitHub Actions / GitLab CI', check: '自动化测试 + 类型检查 + 构建' },
  { stage: '部署', tools: 'Vercel / Docker / Nginx', check: '生产环境变量 + CDN + 健康检查' },
  { stage: '监控', tools: 'Sentry / LogRocket', check: '错误上报 + 性能监控' },
]

const codeExample = `<span style="color:#8a8a3a">// .env.development</span>
NODE_ENV=development
VITE_API_URL=http://localhost:3001
DATABASE_URL=postgresql://localhost:5432/dev

<span style="color:#8a8a3a">// .env.production</span>
NODE_ENV=production
VITE_API_URL=https://api.example.com
DATABASE_URL=postgresql://prod-db:5432/app

<span style="color:#8a8a3a">// 读取环境变量</span>
<span style="color:#7c7c99">// Vite 客户端</span>
const apiUrl = import.meta.env.VITE_API_URL

<span style="color:#7c7c99">// Nuxt 客户端 + 服务端</span>
const config = useRuntimeConfig()
config.public.apiBase    <span style="color:#7c7c99">// 客户端可见</span>
config.databaseUrl       <span style="color:#7c7c99">// 仅服务端</span>

<span style="color:#7c7c99">// Node 服务端</span>
const dbUrl = process.env.DATABASE_URL`
</script>

<template>
  <div class="demo-card">
    <h3>环境配置与多环境管理</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeTab === 'env' }" @click="activeTab = 'env'">环境变量</button>
      <button :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置文件</button>
      <button :class="{ active: activeTab === 'pipeline' }" @click="activeTab = 'pipeline'">交付流程</button>
    </div>

    <div v-if="activeTab === 'env'">
      <table>
        <thead><tr><th>变量</th><th>开发</th><th>生产</th><th>客户端</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="v in envVars" :key="v.key">
            <td><code>{{ v.key }}</code></td>
            <td><small>{{ v.dev }}</small></td>
            <td><small>{{ v.prod }}</small></td>
            <td><span :class="v.client === '✅' ? 'ok' : 'no'">{{ v.client }}</span></td>
            <td><small>{{ v.note }}</small></td>
          </tr>
        </tbody>
      </table>
      <pre class="mini-code" v-html="codeExample" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'config'">
      <table>
        <thead><tr><th>文件</th><th>范围</th><th>优先级</th><th>Git</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="f in configFiles" :key="f.file">
            <td><code>{{ f.file }}</code></td>
            <td>{{ f.scope }}</td>
            <td><small>{{ f.priority }}</small></td>
            <td><span :class="f.gitignore === '不提交' ? 'no' : 'ok'">{{ f.gitignore }}</span></td>
            <td><small>{{ f.note }}</small></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>加载优先级（高 → 低）：</strong></p>
        <p><code>.env.local</code> > <code>.env.[环境]</code> > <code>.env</code></p>
        <p><strong>安全原则：</strong>密钥放 <code>.env.local</code>（不提交），公开配置放 <code>.env.[环境]</code>（提交）</p>
      </div>
    </div>

    <div v-if="activeTab === 'pipeline'">
      <div class="pipeline-flow">
        <div v-for="(p, i) in pipeline" :key="i" class="pipeline-stage">
          <div class="stage-num">{{ i + 1 }}</div>
          <strong>{{ p.stage }}</strong>
          <p><small>{{ p.tools }}</small></p>
          <p><small>检查：{{ p.check }}</small></p>
          <span v-if="i < pipeline.length - 1" class="arrow">→</span>
        </div>
      </div>
      <div class="tips-box">
        <p><strong>核心理念：</strong>把"人肉检查"变成"自动化拦截"，让代码质量在每个阶段都有保障。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
button { padding: 5px 14px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
button.active { background: #e85d04; color: #fff; border-color: #e85d04; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
.ok { color: #65a30d; font-weight: bold; }
.no { color: #dc2626; font-weight: bold; }
.pipeline-flow { display: flex; flex-direction: column; gap: 8px; }
.pipeline-stage { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; position: relative; }
.stage-num { display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; background: #e85d04; color: #fff; border-radius: 50%; font-size: 12px; margin-right: 8px; }
.arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #e85d04; font-size: 18px; }
</style>
