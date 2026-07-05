<script setup lang="ts">
import { ref } from 'vue'

const platform = ref<'mac' | 'win' | 'linux'>('win')
const buildConfig = ref({
  appId: 'com.example.app',
  productName: 'My Electron App',
  directories: {
    output: 'dist'
  }
})
</script>

<template>
  <div class="demo-container">
    <h2>🌰 打包与分发</h2>
    <p class="desc">使用 electron-builder 打包跨平台应用。</p>

    <div class="platform-selector">
      <label><input type="radio" v-model="platform" value="mac" /> macOS</label>
      <label><input type="radio" v-model="platform" value="win" /> Windows</label>
      <label><input type="radio" v-model="platform" value="linux" /> Linux</label>
    </div>

    <div class="config-panel">
      <h3>electron-builder 配置</h3>
      <pre class="code-block">
{
  "appId": "{{ buildConfig.appId }}",
  "productName": "{{ buildConfig.productName }}",
  "directories": {
    "output": "{{ buildConfig.directories.output }}"
  },
  "mac": {
    "category": "public.app-category.productivity",
    "icon": "build/icon.icns",
    "hardenedRuntime": true,
    "gatekeeperAssess": false
  },
  "win": {
    "target": "nsis",
    "icon": "build/icon.ico",
    "publisherName": "Example Inc."
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm"],
    "category": "Utility"
  }
}</pre>
    </div>

    <div class="tips">
      <h3>打包要点</h3>
      <ul>
        <li><strong>macOS</strong>: 需要在 macOS 机器上打包，需要开发者证书和公证</li>
        <li><strong>Windows</strong>: 需要代码签名证书（Authenticode），推荐使用 NSIS 安装包</li>
        <li><strong>Linux</strong>: 推荐同时提供 AppImage、deb、rpm 三种格式</li>
        <li><strong>CI/CD</strong>: 使用 GitHub Actions 或 Jenkins 自动化打包流程</li>
      </ul>
    </div>

    <div class="code-block">
      <h3>package.json 配置</h3>
      <pre>
{
  "scripts": {
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "dist:mac": "electron-builder --mac",
    "dist:win": "electron-builder --win",
    "dist:linux": "electron-builder --linux"
  },
  "build": {
    "extends": null,
    // 上面配置...
  }
}</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 900px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.platform-selector { display: flex; gap: 20px; margin-bottom: 20px; }
.platform-selector label { cursor: pointer; }
.config-panel { margin-bottom: 20px; }
.config-panel h3 { margin: 0 0 12px 0; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; margin-bottom: 20px; }
.tips { background: #e8f5e9; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.tips ul { margin: 0; padding-left: 20px; }
.tips li { margin-bottom: 8px; line-height: 1.6; }
</style>
