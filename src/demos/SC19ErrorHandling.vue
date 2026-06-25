<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'debug' | 'warn' | 'error'>('debug')
const logLevel = ref<'info' | 'warning' | 'error'>('info')
const logs = ref<{ type: string; message: string; time: string }[]>([
  { type: 'info', message: '编译开始：app.scss', time: '10:24:01' },
  { type: 'debug', message: '@debug: 主题色值 = #e85d04', time: '10:24:01' },
  { type: 'debug', message: '@debug: 断点列表 = 480px, 768px, 1024px', time: '10:24:02' },
  { type: 'warning', message: '@warn: 间距值 28px 不在 8px 网格系统上', time: '10:24:02' },
  { type: 'warning', message: '@warn: 颜色 #ffcc00 对比度不足', time: '10:24:03' },
  { type: 'info', message: '编译完成：app.css (24KB)', time: '10:24:04' }
])

const filteredLogs = computed(() => {
  if (logLevel.value === 'info') return logs.value
  if (logLevel.value === 'warning') return logs.value.filter(l => l.type !== 'debug')
  return logs.value.filter(l => l.type === 'error' || l.type === 'warning')
})

const addLog = (type: string) => {
  const messages = {
    debug: [
      '@debug: 当前断点值 = 768px',
      '@debug: 计算结果 = 192px',
      '@debug: 变量 $spacing = 16px'
    ],
    warn: [
      '@warn: 弃用警告：$old-var 将在下版本移除',
      '@warn: 字体大小 11px 可能影响可读性',
      '@warn: z-index 9999 值过高'
    ],
    error: [
      '@error: 未定义的变量 $primary-color',
      '@error: 无效的颜色值：#ggg',
      '@error: mix() 函数参数类型不匹配'
    ]
  }
  const msgList = messages[type as keyof typeof messages]
  const msg = msgList[Math.floor(Math.random() * msgList.length)]
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  logs.value.push({ type, message: msg, time })
}

const debugCode = `<span style="color:#7c7c99">// @debug — 输出变量值到控制台（开发调试）</span>
@mixin fluid-type($min, $max) {
  $diff: $max - $min;
  @debug "差值计算: #{$diff}";
  font-size: clamp(#{$min}px, 1rem + #{$diff}vw, #{$max}px);
}

.title {
  @include fluid-type(16, 24);
}

<span style="color:#7c7c99">// 控制台输出：</span>
<span style="color:#60a5fa">Debug: 差值计算: 8</span>

<span style="color:#7c7c99">// 调试复杂计算</span>
@function calculate-gutter($cols) {
  $result: (100% / $cols) * 0.1;
  @debug "Gutter for #{$cols} cols: #{$result}";
  @return $result;
}`

const warnCode = `<span style="color:#7c7c99">// @warn — 发出警告但继续编译</span>
@mixin spacing($value) {
  @if $value % 8 != 0 {
    @warn "间距 #{$value}px 不在 8px 网格系统上";
  }
  margin-bottom: $value + px;
}

.card {
  @include spacing(20); <span style="color:#8a8a3a">// 触发警告</span>
}

<span style="color:#7c7c99">// 常见使用场景：</span>
• 弃用 API 提示
• 设计系统规范校验
• 性能问题预警
• 可访问性问题提醒

<span style="color:#7c7c99">// 命令行输出：</span>
<span style="color:#fbbf24">Warning: 间距 20px 不在 8px 网格系统上</span>
<span style="color:#8a8a3a">    ╷
  3 │   @warn "间距 #{$value}px 不在 8px 网格系统上";
    │   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ╵</span>`

const errorCode = `<span style="color:#7c7c99">// @error — 抛出错误并终止编译</span>
@function get-color($name) {
  $colors: (
    primary: #e85d04,
    secondary: #f4a261,
    danger: #dc2626
  );
  
  @if not map-has-key($colors, $name) {
    @error "颜色 '#{$name}' 不存在。可用值：#{map-keys($colors)}";
  }
  
  @return map-get($colors, $name);
}

.btn {
  background: get-color(prinary); <span style="color:#e85d04">// 拼写错误，编译终止</span>
}

<span style="color:#7c7c99">// 编译错误输出：</span>
<span style="color:#f87171">Error: 颜色 'prinary' 不存在。可用值：primary, secondary, danger</span>
<span style="color:#8a8a3a">  ╷
5 │     @error "颜色 '#{$name}' 不存在...";
  │     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ╵</span>

<span style="color:#7c7c99">// 适用场景：</span>
• 参数必填校验
• 枚举值合法性检查
• 关键配置缺失`
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>错误处理与 @debug/@warn/@error</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'debug' }" @click="activeTab = 'debug'">@debug</button>
      <button class="tab-btn" :class="{ active: activeTab === 'warn' }" @click="activeTab = 'warn'">@warn</button>
      <button class="tab-btn" :class="{ active: activeTab === 'error' }" @click="activeTab = 'error'">@error</button>
    </div>

    <div style="display:flex;gap:16px;align-items:flex-start;">
      <div style="flex:1;">
        <div v-if="activeTab === 'debug'">
          <h4>@debug — 调试输出</h4>
          <pre class="mini-code" v-html="debugCode"></pre>
        </div>
        <div v-if="activeTab === 'warn'">
          <h4>@warn — 警告提示</h4>
          <pre class="mini-code" v-html="warnCode"></pre>
        </div>
        <div v-if="activeTab === 'error'">
          <h4>@error — 错误终止</h4>
          <pre class="mini-code" v-html="errorCode"></pre>
        </div>
      </div>

      <div class="console-panel" style="width:300px;">
        <div class="console-header">
          <span>编译控制台</span>
          <div style="display:flex;gap:4px;">
            <select v-model="logLevel" class="log-filter">
              <option value="info">全部</option>
              <option value="warning">警告及以上</option>
              <option value="error">仅错误</option>
            </select>
          </div>
        </div>
        <div class="console-body">
          <div v-for="(log, i) in filteredLogs" :key="i" class="log-item" :class="log.type">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
        </div>
        <div class="console-actions">
          <button class="action-btn debug" @click="addLog('debug')">+ Debug</button>
          <button class="action-btn warn" @click="addLog('warn')">+ Warn</button>
          <button class="action-btn error" @click="addLog('error')">+ Error</button>
        </div>
      </div>
    </div>

    <div class="tips-box" style="margin-top:12px;">
      <p><strong>三者对比：</strong></p>
      <ul>
        <li><strong>@debug</strong>：开发调试用，输出变量值和计算结果，不影响编译</li>
        <li><strong>@warn</strong>：警告用户潜在问题，编译继续，可通过 <code>--quiet</code> 抑制</li>
        <li><strong>@error</strong>：严重错误，立即终止编译，必须修复后才能继续</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.console-panel { border: 1px solid #e0a06a; border-radius: 8px; overflow: hidden; background: #1e1e2e; }
.console-header { padding: 8px 12px; background: #2d241e; color: #ffe5c4; font-size: 12px; display: flex; justify-content: space-between; align-items: center; }
.log-filter { padding: 2px 6px; font-size: 11px; border-radius: 4px; border: 1px solid #e0a06a; background: #2d241e; color: #ffe5c4; }
.console-body { height: 240px; overflow-y: auto; padding: 8px; font-family: monospace; font-size: 11px; }
.log-item { padding: 4px 0; display: flex; gap: 8px; }
.log-time { color: #6b6b7b; flex-shrink: 0; }
.log-msg { word-break: break-all; }
.log-item.info .log-msg { color: #a0a0b0; }
.log-item.debug .log-msg { color: #60a5fa; }
.log-item.warning .log-msg { color: #fbbf24; }
.log-item.error .log-msg { color: #f87171; }
.console-actions { padding: 8px; display: flex; gap: 6px; background: #2d241e; }
.action-btn { padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; }
.action-btn.debug { background: #1e3a5f; color: #60a5fa; }
.action-btn.warn { background: #5c4a1f; color: #fbbf24; }
.action-btn.error { background: #5c1f1f; color: #f87171; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5e6; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
h4 { margin: 12px 0 8px 0; font-size: 14px; color: #8b4513; }
</style>
