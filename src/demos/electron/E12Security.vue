<script setup lang="ts">
import { ref } from 'vue'

const securityChecks = ref([
  { name: 'nodeIntegration: false', passed: true, desc: '渲染进程不能直接使用 Node.js API' },
  { name: 'contextIsolation: true', passed: true, desc: '预加载脚本与渲染进程上下文隔离' },
  { name: 'webSecurity: true', passed: true, desc: '不允许跨域请求和禁用安全特性' },
  { name: 'CSP 已配置', passed: false, desc: 'Content-Security-Policy 限制资源加载' },
  { name: '依赖无已知漏洞', passed: false, desc: '定期运行 npm audit' },
  { name: '不允许加载远程代码', passed: true, desc: '避免从远程 URL 加载脚本' }
])
</script>

<template>
  <div class="demo-container">
    <h2>🌰 安全最佳实践</h2>
    <p class="desc">Electron 安全核心原则：最小权限、上下文隔离、内容安全策略。</p>

    <div class="security-check">
      <h3>安全检查清单</h3>
      <div v-for="check in securityChecks" :key="check.name" class="check-item" :class="{ passed: check.passed, failed: !check.passed }">
        <span class="icon">{{ check.passed ? '✅' : '❌' }}</span>
        <div class="check-info">
          <strong>{{ check.name }}</strong>
          <p>{{ check.desc }}</p>
        </div>
      </div>
    </div>

    <div class="code-block">
      <h3>安全配置示例</h3>
      <pre>
// 主进程 - 正确的 BrowserWindow 配置
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,      // ✅ 必须关闭
    contextIsolation: true,       // ✅ 必须开启
    webSecurity: true,            // ✅ 必须开启
    preload: path.join(__dirname, 'preload.js')
  }
})

// HTML - CSP 配置（必须放在 &lt;head&gt; 最顶部）
&lt;meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;"&gt;</pre>
    </div>

    <div class="tips">
      <h3>安全原则</h3>
      <ul>
        <li><strong>最小权限</strong>: 只给渲染进程需要的 API</li>
        <li><strong>上下文隔离</strong>: 防止渲染进程访问 Node.js</li>
        <li><strong>CSP</strong>: 防止 XSS 攻击升级为 RCE</li>
        <li><strong>依赖审计</strong>: 定期检查依赖漏洞</li>
        <li><strong>代码签名</strong>: 确保应用完整性</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 900px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.security-check { margin-bottom: 20px; }
.security-check h3 { margin: 0 0 12px 0; }
.check-item { display: flex; align-items: flex-start; gap: 12px; padding: 16px; border-radius: 8px; margin-bottom: 8px; }
.check-item.passed { background: #e8f5e9; }
.check-item.failed { background: #ffebee; }
.icon { font-size: 24px; }
.check-info strong { display: block; margin-bottom: 4px; }
.check-info p { margin: 0; color: #666; font-size: 13px; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
.tips { background: #fff3e0; padding: 20px; border-radius: 12px; }
.tips ul { margin: 0; padding-left: 20px; }
.tips li { margin-bottom: 8px; line-height: 1.6; }
</style>
