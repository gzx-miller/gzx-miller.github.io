const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'basic' | 'copy' | 'encoder'>('basic')

const conversionTypes = [
  { from: 'MP4', to: 'MKV', method: '转封装', cmd: 'ffmpeg -i input.mp4 -c copy output.mkv', note: '快速，不重新编码' },
  { from: 'MP4', to: 'AVI', method: '转码', cmd: 'ffmpeg -i input.mp4 -c:v mpeg4 -c:a mp3 output.avi', note: '需要重新编码' },
  { from: 'MKV', to: 'MP4', method: '转封装', cmd: 'ffmpeg -i input.mkv -c copy output.mp4', note: '如果编码兼容 MP4 容器' },
  { from: 'MOV', to: 'MP4', method: '转封装/转码', cmd: 'ffmpeg -i input.mov -c:v copy -c:a aac output.mp4', note: '视频不重编码，音频转 AAC' },
  { from: 'WebM', to: 'MP4', method: '转码', cmd: 'ffmpeg -i input.webm -c:v libx264 -c:a aac output.mp4', note: 'VP8/VP9 转 H.264' },
  { from: 'TS', to: 'MP4', method: '转封装', cmd: 'ffmpeg -i input.ts -c copy output.mp4', note: 'HLS 片段转单文件' },
]

const copyModeInfo = {
  title: '转封装（Copy Mode）',
  desc: '使用 -c copy 参数，FFmpeg 只修改容器格式，不重新编码音视频流。速度极快（通常 10-50 倍速），无质量损失，但受限于目标容器对编码格式的兼容性。',
  pros: ['速度极快', '无质量损失', '保留所有流（多音轨、字幕）'],
  cons: ['受容器格式兼容性限制', '无法调整分辨率/码率等参数', '时间戳问题可能导致播放异常'],
  example: '# 快速将 MP4 转为 MKV（保留原始编码）\\nffmpeg -i input.mp4 -c copy output.mkv\\n\\n# 同时处理多个文件\\nfor f in *.mp4; do ffmpeg -i "$f" -c copy "\${f%.mp4}.mkv"; done'
}

const transcodeInfo = {
  title: '转码（Transcoding）',
  desc: '不使用 -c copy，FFmpeg 会重新编码音视频流。可以更换编码格式、调整质量参数，但耗时较长，且可能有质量损失（有损编码）。',
  pros: ['可以选择任意编码格式', '可以调整分辨率、码率等参数', '解决兼容性问题和时间戳问题'],
  cons: ['速度慢（依赖编码复杂度和硬件）', '有损编码会有质量损失', '需要正确配置编码参数'],
  example: '# 将视频转为 H.264 + AAC（兼容性最好）\\nffmpeg -i input.mkv -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4\\n\\n# 指定编码器预设（速度 vs 压缩率）\\nffmpeg -i input.mkv -c:v libx264 -preset medium -crf 23 output.mp4'
}

const containerCompatibility = [
  { container: 'MP4', video: 'H.264, H.265, VP9*', audio: 'AAC, MP3, AC3', subtitle: '不支持（需烧录）', note: '*VP9 需要 ISOBMFF 规范支持' },
  { container: 'MKV', video: '几乎所有格式', audio: '几乎所有格式', subtitle: 'SRT, ASS, VobSub', note: '最灵活的容器格式' },
  { container: 'AVI', video: 'DivX, Xvid, H.264*', audio: 'MP3, AC3', subtitle: '不支持', note: '*H.264 需要额外处理' },
  { container: 'MOV', video: 'H.264, ProRes, DNxHD', audio: 'AAC, PCM', subtitle: '不支持', note: 'Apple 专业格式' },
  { container: 'M4A', video: '不适用', audio: 'AAC, ALAC', subtitle: '不支持', note: '纯音频容器' },
  { container: 'WebM', video: 'VP8, VP9, AV1', audio: 'Opus, Vorbis', subtitle: 'WebVTT', note: 'Google 开放格式' },
]

const selectedFrom = ref('MP4')
const selectedTo = ref('MKV')
const useCopyMode = ref(true)

const generatedCommand = computed(() => {
  if (useCopyMode.value) {
    return \`ffmpeg -i input.\${selectedFrom.value.toLowerCase()} -c copy output.\${selectedTo.value.toLowerCase()}\`
  } else {
    return \`ffmpeg -i input.\${selectedFrom.value.toLowerCase()} -c:v libx264 -crf 23 -c:a aac output.\${selectedTo.value.toLowerCase()}\`
  }
})
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 格式转换与转封装</h3>
    <p class="summary">掌握不同容器格式之间的转换，理解转封装（不重新编码）与转码（重新编码）的区别。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">转换示例</button>
      <button class="tab-btn" :class="{ active: activeTab === 'copy' }" @click="activeTab = 'copy'">转封装</button>
      <button class="tab-btn" :class="{ active: activeTab === 'encoder' }" @click="activeTab = 'encoder'">转码</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>常见格式转换</h4>
      <table>
        <thead>
          <tr><th>源格式</th><th>目标格式</th><th>方法</th><th>命令示例</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr v-for="c in conversionTypes" :key="c.from + c.to">
            <td><code>{{ c.from }}</code></td>
            <td><code>{{ c.to }}</code></td>
            <td>{{ c.method }}</td>
            <td><code class="cmd">{{ c.cmd }}</code></td>
            <td><small>{{ c.note }}</small></td>
          </tr>
        </tbody>
      </table>

      <div class="command-builder" style="margin-top:20px;">
        <h4>命令生成器</h4>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:12px 0;">
          <label>源格式：<select v-model="selectedFrom"><option>MP4</option><option>MKV</option><option>AVI</option><option>MOV</option></select></label>
          <span>→</span>
          <label>目标格式：<select v-model="selectedTo"><option>MKV</option><option>MP4</option><option>AVI</option><option>MOV</option></select></label>
          <label><input type="checkbox" v-model="useCopyMode" /> 使用转封装（快速）</label>
        </div>
        <div class="generated-cmd">
          <code>{{ generatedCommand }}</code>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'copy'" class="copy-section">
      <div class="info-card">
        <h4>{{ copyModeInfo.title }}</h4>
        <p>{{ copyModeInfo.desc }}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px;">
          <div>
            <h5>优点</h5>
            <ul>
              <li v-for="p in copyModeInfo.pros" :key="p">{{ p }}</li>
            </ul>
          </div>
          <div>
            <h5>限制</h5>
            <ul>
              <li v-for="c in copyModeInfo.cons" :key="c">{{ c }}</li>
            </ul>
          </div>
        </div>
        <pre style="margin-top:12px;"><code>{{ copyModeInfo.example }}</code></pre>
      </div>
    </div>

    <div v-if="activeTab === 'encoder'" class="encoder-section">
      <div class="info-card">
        <h4>{{ transcodeInfo.title }}</h4>
        <p>{{ transcodeInfo.desc }}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px;">
          <div>
            <h5>优点</h5>
            <ul>
              <li v-for="p in transcodeInfo.pros" :key="p">{{ p }}</li>
            </ul>
          </div>
          <div>
            <h5>限制</h5>
            <ul>
              <li v-for="c in transcodeInfo.cons" :key="c">{{ c }}</li>
            </ul>
          </div>
        </div>
        <pre style="margin-top:12px;"><code>{{ transcodeInfo.example }}</code></pre>
      </div>

      <div style="margin-top:20px;">
        <h4>容器格式兼容性</h4>
        <table>
          <thead>
            <tr><th>容器</th><th>视频编码</th><th>音频编码</th><th>字幕</th><th>备注</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in containerCompatibility" :key="c.container">
              <td><code>{{ c.container }}</code></td>
              <td><small>{{ c.video }}</small></td>
              <td><small>{{ c.audio }}</small></td>
              <td><small>{{ c.subtitle }}</small></td>
              <td><small>{{ c.note }}</small></td>
            </tr>
          </tbody>
        </table>
      </div>
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
code.cmd { font-size: 0.85em; }
.info-card {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #6a5acd;
}
.info-card h5 { color: #9f9fff; margin: 8px 0 4px 0; }
ul { padding-left: 20px; }
li { margin-bottom: 4px; line-height: 1.5; }
pre {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
}
pre code { color: #7fff7f; }
.generated-cmd {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  margin-top: 8px;
}
.generated-cmd code { color: #7fff7f; font-size: 1.1em; }
select {
  background: #2a2a4a;
  color: #e0e0e0;
  border: 1px solid #4a4a6a;
  border-radius: 4px;
  padding: 4px 8px;
}
label { display: flex; align-items: center; gap: 6px; }
input[type="checkbox"] { accent-color: #6a5acd; }
</style>
`;export{n as default};
