<script setup lang="ts">
import { computed, ref } from 'vue'

type Env = 'development' | 'production'

const activeEnv = ref<Env>('development')

// 模拟 .env / 环境变量注入的配置
const configs: Record<Env, { port: number; dbHost: string; dbPort: number; dbName: string; logLevel: string; redisTtl: number }> = {
  development: {
    port: 3000,
    dbHost: 'localhost',
    dbPort: 5432,
    dbName: 'classroom_dev',
    logLevel: 'debug',
    redisTtl: 3600,
  },
  production: {
    port: 8080,
    dbHost: 'db.internal.example.com',
    dbPort: 5432,
    dbName: 'classroom_prod',
    logLevel: 'warn',
    redisTtl: 600,
  },
}

const active = computed(() => configs[activeEnv.value])

const missingVar = ref('')
const validated = ref(false)

function validate() {
  validated.value = true
  // 模拟启动时配置校验（Joi/class-validator）：必填项缺失则快速失败
  missingVar.value = ''
  if (activeEnv.value === 'production' && !active.value.dbHost.includes('internal')) {
    missingVar.value = 'DB_HOST 缺失，应用拒绝启动（快速失败）'
  }
}

const envFiles = [
  { file: '.env', desc: '公共配置，提交到仓库（不含密钥）' },
  { file: '.env.local', desc: '本地覆盖，不提交仓库' },
  { file: '.env.production', desc: '生产环境专用配置' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 配置管理 · ConfigModule 多环境</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      切换环境，查看 <code>ConfigService</code> 读取到的不同配置（配置与代码分离）：
    </p>

    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <button
        v-for="env in ['development', 'production'] as const"
        :key="env"
        class="tab-btn"
        :class="{ active: activeEnv === env }"
        @click="activeEnv = env; missingVar = ''; validated = false"
      >
        {{ env === 'development' ? '开发环境（.env.local）' : '生产环境（环境变量注入）' }}
      </button>
    </div>

    <div class="config-grid">
      <div class="config-item">
        <span class="config-key">port</span>
        <code class="config-value">{{ active.port }}</code>
      </div>
      <div class="config-item">
        <span class="config-key">database.host</span>
        <code class="config-value">{{ active.dbHost }}</code>
      </div>
      <div class="config-item">
        <span class="config-key">database.port</span>
        <code class="config-value">{{ active.dbPort }}</code>
      </div>
      <div class="config-item">
        <span class="config-key">database.name</span>
        <code class="config-value">{{ active.dbName }}</code>
      </div>
      <div class="config-item">
        <span class="config-key">logLevel</span>
        <code class="config-value">{{ active.logLevel }}</code>
      </div>
      <div class="config-item">
        <span class="config-key">redis.ttl</span>
        <code class="config-value">{{ active.redisTtl }}s</code>
      </div>
    </div>

    <div style="display: flex; gap: 8px; margin: 12px 0">
      <button class="tab-btn active" @click="validate">模拟启动校验</button>
    </div>
    <p v-if="missingVar" class="validate-fail">{{ missingVar }}</p>
    <p v-else-if="validated" class="validate-ok">✅ 配置齐全，应用正常启动（ConfigModule.forRoot 加载完成）</p>

    <table>
      <thead><tr><th>配置文件</th><th>用途</th></tr></thead>
      <tbody>
        <tr v-for="file in envFiles" :key="file.file">
          <td><code>{{ file.file }}</code></td>
          <td>{{ file.desc }}</td>
        </tr>
      </tbody>
    </table>

    <p class="note">
      <strong>访问方式：</strong>构造器注入 <code>ConfigService</code>，
      用 <code>this.config.get&lt;number&gt;('database.port')</code> 读取，默认值与类型转换集中在配置工厂。
    </p>
  </div>
</template>

<style scoped>
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.config-key {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
}

.config-value {
  font-size: 13px;
  color: var(--accent-strong);
  word-break: break-all;
}

.validate-ok {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--forest);
}

.validate-fail {
  margin: 0 0 10px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  background: color-mix(in srgb, var(--leaf-red) 10%, var(--bg));
  color: var(--leaf-red);
}

.note {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
