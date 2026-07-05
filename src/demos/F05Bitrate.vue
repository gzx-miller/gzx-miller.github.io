<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'crf' | 'cbr' | 'vbr'>('crf')

const crfInfo = {
  title: 'CRF（恒定速率因子）模式',
  desc: 'CRF 是 x264/x265 的默认码率控制模式，通过指定质量级别而非固定码率来实现最佳的质量/大小比。CRF 值范围 0-51，默认 23（x264）或 28（x265）。值越小质量越高文件越大。',
  range: '0-51（x264/x265）',
  recommended: '18-28（18 接近视觉无损，23 默认，28 可接受质量）',
  examples: [
    { desc: '高质量（接近视觉无损）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 18 output.mp4' },
    { desc: '默认质量', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 23 output.mp4' },
    { desc: '可接受质量（文件更小）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 28 output.mp4' },
    { desc: '使用 H.265 编码（更小文件）', cmd: 'ffmpeg -i input.mp4 -c:v libx265 -crf 28 output.mp4' },
    { desc: '限制最大码率（防止偶尔出现极高码率）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 23 -maxrate 3M -bufsize 6M output.mp4' },
  ]
}

const cbrInfo = {
  title: 'CBR（恒定码率）模式',
  desc: 'CBR 模式强制编码器使用固定的码率，适合流媒体传输（避免网络波动），但文件大小相同的情况下质量不如 CRF/VBR。需要通过 -b:v 指定目标码率，并通过 -maxrate 和 -minrate 强制恒定。',
  examples: [
    { desc: '1 Mbps CBR（适合低清流媒体）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -b:v 1M -maxrate 1M -minrate 1M -bufsize 2M output.mp4' },
    { desc: '3 Mbps CBR（适合 720p 流媒体）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -b:v 3M -maxrate 3M -minrate 3M -bufsize 6M output.mp4' },
    { desc: '5 Mbps CBR（适合 1080p 流媒体）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -b:v 5M -maxrate 5M -minrate 5M -bufsize 10M output.mp4' },
  ]
}

const vbrInfo = {
  title: 'VBR（可变码率）模式',
  desc: 'VBR 模式允许码率在一定范围内变化，复杂场景使用更高码率，简单场景使用更低码率，在指定文件大小或平均码率约束下获得更好质量。使用 -b:v 指定目标平均码率，-maxrate 指定最大码率。',
  examples: [
    { desc: '目标 2 Mbps VBR，最大 3 Mbps', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -maxrate 3M -bufsize 4M output.mp4' },
    { desc: '目标 5 Mbps VBR，最大 8 Mbps（适合 1080p）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -b:v 5M -maxrate 8M -bufsize 10M output.mp4' },
    { desc: '使用 2-pass 编码（更精确控制文件大小）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -b:v 3M -maxrate 4M -bufsize 6M -pass 1 -f null /dev/null && ffmpeg -i input.mp4 -c:v libx264 -b:v 3M -maxrate 4M -bufsize 6M -pass 2 output.mp4' },
  ]
}

const bitrateGuide = [
  { resolution: '480p (854×480)', crf: '23-28', cbr: '1-1.5 Mbps', vbr: '0.8-1.5 Mbps', note: '适合移动网络' },
  { resolution: '720p (1280×720)', crf: '20-26', cbr: '2-3 Mbps', vbr: '1.5-3 Mbps', note: '适合标清流媒体' },
  { resolution: '1080p (1920×1080)', crf: '18-26', cbr: '3-5 Mbps', vbr: '2.5-5 Mbps', note: '适合高清流媒体' },
  { resolution: '1440p (2560×1440)', crf: '18-26', cbr: '6-10 Mbps', vbr: '5-10 Mbps', note: '适合 2K 视频' },
  { resolution: '2160p 4K (3840×2160)', crf: '18-28', cbr: '15-25 Mbps', vbr: '12-25 Mbps', note: '适合 4K 流媒体' },
]

const audioBitrateGuide = [
  { quality: '低质量（语音）', bitrate: '64-96 Kbps', format: 'AAC' },
  { quality: '标准质量', bitrate: '128 Kbps', format: 'AAC' },
  { quality: '高质量', bitrate: '192 Kbps', format: 'AAC' },
  { quality: '无损（存档）', bitrate: 'FLAC 或无损', format: 'FLAC/ALAC' },
  { quality: 'WebRTC/语音通话', bitrate: '32-64 Kbps', format: 'Opus' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 码率控制与视频质量</h3>
    <p class="summary">理解码率（Bitrate）对视频质量和文件大小的影响，掌握 CBR、CRF、VBR 等码率控制模式。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'crf' }" @click="activeTab = 'crf'">CRF 模式</button>
      <button class="tab-btn" :class="{ active: activeTab === 'cbr' }" @click="activeTab = 'cbr'">CBR 模式</button>
      <button class="tab-btn" :class="{ active: activeTab === 'vbr' }" @click="activeTab = 'vbr'">VBR 模式</button>
    </div>

    <div v-if="activeTab === 'crf'" class="crf-section">
      <div class="info-card">
        <h4>{{ crfInfo.title }}</h4>
        <p>{{ crfInfo.desc }}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px;">
          <div>
            <strong>取值范围：</strong><code>{{ crfInfo.range }}</code>
          </div>
          <div>
            <strong>推荐范围：</strong><code>{{ crfInfo.recommended }}</code>
          </div>
        </div>
      </div>
      <h4 style="margin-top:16px;">CRF 命令示例</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in crfInfo.examples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'cbr'" class="cbr-section">
      <div class="info-card">
        <h4>{{ cbrInfo.title }}</h4>
        <p>{{ cbrInfo.desc }}</p>
      </div>
      <h4 style="margin-top:16px;">CBR 命令示例</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in cbrInfo.examples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'vbr'" class="vbr-section">
      <div class="info-card">
        <h4>{{ vbrInfo.title }}</h4>
        <p>{{ vbrInfo.desc }}</p>
      </div>
      <h4 style="margin-top:16px;">VBR 命令示例</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in vbrInfo.examples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top:24px;">
      <h4>视频码率参考指南</h4>
      <table>
        <thead><tr><th>分辨率</th><th>CRF</th><th>CBR</th><th>VBR</th><th>备注</th></tr></thead>
        <tbody>
          <tr v-for="g in bitrateGuide" :key="g.resolution">
            <td>{{ g.resolution }}</td>
            <td><code>{{ g.crf }}</code></td>
            <td><code>{{ g.cbr }}</code></td>
            <td><code>{{ g.vbr }}</code></td>
            <td><small>{{ g.note }}</small></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">音频码率参考指南</h4>
      <table>
        <thead><tr><th>质量</th><th>码率</th><th>格式</th></tr></thead>
        <tbody>
          <tr v-for="a in audioBitrateGuide" :key="a.quality">
            <td>{{ a.quality }}</td>
            <td><code>{{ a.bitrate }}</code></td>
            <td><code>{{ a.format }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  color: #e0e0e0;
}
.summary { color: #a0a0c0; margin-bottom: 16px; }
.tab-btn {
  padding: 8px 16px;
  border: 1px solid #4a4a6a;
  background: transparent;
  color: #c0c0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active, .tab-btn:hover {
  background: #6a5acd;
  color: white;
  border-color: #6a5acd;
}
.info-card {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #6a5acd;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 0.9em;
}
th, td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
th { color: #9f9fff; }
code { color: #7fff7f; }
code.cmd { font-size: 0.85em; word-break: break-all; }
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
</style>
