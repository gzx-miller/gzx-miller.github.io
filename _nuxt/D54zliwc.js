const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'normalize' | 'advanced'>('basic')

const basicExamples = [
  { desc: '查看音频音量信息', cmd: 'ffprobe -v error -select_streams a:0 -show_streams -show_entries stream=sample_rate,channels,bit_rate input.mp4' },
  { desc: '调整音量（减半）', cmd: 'ffmpeg -i input.mp4 -af "volume=0.5" -c:v copy output.mp4' },
  { desc: '调整音量（+3 dB）', cmd: 'ffmpeg -i input.mp4 -af "volume=3dB" -c:v copy output.mp4' },
  { desc: '调整音量（-5 dB）', cmd: 'ffmpeg -i input.mp4 -af "volume=-5dB" -c:v copy output.mp4' },
  { desc: '调整音量（翻倍）', cmd: 'ffmpeg -i input.mp4 -af "volume=2.0" -c:v copy output.mp4' },
  { desc: '精确设置音量电平（防止削波）', cmd: 'ffmpeg -i input.mp4 -af "volume=volume=0.5:precision=fixed" -c:v copy output.mp4' },
]

const normalizeExamples = [
  { desc: '使用 loudnorm 响度标准化（EBU R128）', cmd: 'ffmpeg -i input.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:v copy output.mp4' },
  { desc: '响度标准化（适合网络视频，-16 LUFS）', cmd: 'ffmpeg -i input.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=-22:measured_TP=-2:measured_LRA=12:linear=true" -c:v copy output.mp4' },
  { desc: '响度标准化（适合广播，-24 LUFS）', cmd: 'ffmpeg -i input.mp4 -af "loudnorm=I=-24:TP=-2:LRA=7" -c:v copy output_broadcast.mp4' },
  { desc: '使用 dynaudnorm 动态范围压缩（较轻量）', cmd: 'ffmpeg -i input.mp4 -af "dynaudnorm=g=5" -c:v copy output.mp4' },
  { desc: '查看 loudnorm 帮助', cmd: 'ffmpeg -h filter=loudnorm' },
]

const advancedExamples = [
  { desc: '音频淡入（前 3 秒）', cmd: 'ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=3" -c:v copy output.mp4' },
  { desc: '音频淡出（最后 3 秒）', cmd: 'ffmpeg -i input.mp4 -af "afade=t=out:st=57:d=3" -c:v copy output.mp4' },
  { desc: '使用 compressor 压缩动态范围', cmd: 'ffmpeg -i input.mp4 -af "compand=0|0|0.02:-70/-70|-60/-40|-40/-30|-20/-20|0/0" -c:v copy output.mp4' },
  { desc: '降低噪音（使用 afftdenoise）', cmd: 'ffmpeg -i input.mp4 -af "afftdenoise=nr=10:nf=-10" -c:v copy output_denoised.mp4' },
  { desc: '增强语音（使用 equalizer）', cmd: 'ffmpeg -i input.mp4 -af "equalizer=f=1000:t=q:w=1:g=6" -c:v copy output_enhanced.mp4' },
  { desc: '多音频流处理（选择特定流）', cmd: 'ffmpeg -i input.mkv -af "volume=1.5" -map 0:v -map 0:a:0 -c:v copy output_single_audio.mp4' },
]

const loudnessInfo = [
  { platform: 'YouTube', standard: '-13 至 -15 LUFS', note: '推荐 -14 LUFS' },
  { platform: 'Netflix', standard: '-27 LUFS（立体声）/ -24 LUFS（5.1）', note: '严格标准' },
  { platform: '广播（欧盟）', standard: '-24 LUFS', note: 'EBU R128 标准' },
  { platform: 'Apple Music', standard: '-16 LUFS', note: 'Apple 推荐' },
  { platform: 'Spotify', standard: '-14 LUFS', note: 'Spotify 目标' },
]

const volumeTips = [
  '使用 volume 滤镜时，如果增益过高可能导致削波失真（Clipping）。建议先使用 volumedetect 检测峰值。',
  'loudnorm 滤镜的 measured_* 参数需要先从第一次处理中获取，然后进行二次处理以获得最佳效果。',
  '对于语音内容（播客、教学视频），建议使用 dynaudnorm 或 compressor 压缩动态范围，使音量更一致。',
  '处理多语言视频时，不同语言的音量可能不同，需要分别调整或使用响度标准化。',
  '削波失真不可逆，建议在调整音量前先检测峰值：ffprobe -f lavfi -i "amovie=input.mp4,volumedetect" -f null -',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 音量调整与音频滤镜</h3>
    <p class="summary">使用 volume 滤镜调整音量，掌握标准化、动态范围压缩、静音检测等音频处理技术。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础调整</button>
      <button class="tab-btn" :class="{ active: activeTab === 'normalize' }" @click="activeTab = 'normalize'">响度标准化</button>
      <button class="tab-btn" :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">高级处理</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>volume 滤镜基础用法</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in basicExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'normalize'" class="normalize-section">
      <h4>响度标准化（loudnorm）</h4>
      <p>loudnorm 滤镜实现 EBU R128 标准的响度标准化，使不同视频的音量保持一致。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in normalizeExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">不同平台的响度标准</h4>
      <table>
        <thead><tr><th>平台</th><th>标准</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="l in loudnessInfo" :key="l.platform">
            <td>{{ l.platform }}</td>
            <td><code>{{ l.standard }}</code></td>
            <td><small>{{ l.note }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'advanced'" class="advanced-section">
      <h4>高级音频处理</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in advancedExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">注意事项</h4>
      <div v-for="tip in volumeTips" :key="tip" class="tip-card">
        <p>{{ tip }}</p>
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
code.cmd { font-size: 0.85em; word-break: break-all; }
.tip-card {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-left: 3px solid #6a5acd;
  font-size: 0.9em;
  line-height: 1.6;
}
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
</style>
`;export{n as default};
