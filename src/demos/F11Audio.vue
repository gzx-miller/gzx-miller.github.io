<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'encoder' | 'advanced'>('basic')

const basicExamples = [
  { desc: '查看音频信息', cmd: 'ffprobe -v error -select_streams a:0 -show_streams input.mp4' },
  { desc: '修改音频采样率（输出 44100 Hz）', cmd: 'ffmpeg -i input.mp4 -ar 44100 -c:v copy output.mp4' },
  { desc: '修改声道数（转为单声道）', cmd: 'ffmpeg -i input.mp4 -ac 1 -c:v copy output.mp4' },
  { desc: '修改音频码率（128 Kbps AAC）', cmd: 'ffmpeg -i input.mp4 -b:a 128k -c:v copy output.mp4' },
  { desc: '转换音频编码为 AAC', cmd: 'ffmpeg -i input.mp4 -c:a aac -b:a 128k -c:v copy output.mp4' },
  { desc: '转换音频编码为 MP3', cmd: 'ffmpeg -i input.mp4 -c:a libmp3lame -b:a 192k -c:v copy output.mp4' },
  { desc: '转换音频编码为 Opus', cmd: 'ffmpeg -i input.mp4 -c:a libopus -b:a 96k -c:v copy output.mkv' },
  { desc: '提取音频（保留编码）', cmd: 'ffmpeg -i input.mp4 -c:a copy -vn output.aac' },
  { desc: '提取音频（转为 MP3）', cmd: 'ffmpeg -i input.mp4 -c:a libmp3lame -b:a 192k -vn output.mp3' },
]

const audioEncoders = [
  { name: 'aac', type: '内置', quality: '好', speed: '快', note: 'FFmpeg 内置 AAC 编码器，推荐用于大多数场景' },
  { name: 'libfdk_aac', type: '外部', quality: '最好', speed: '中', note: '需要单独编译，音质最好的 AAC 编码器' },
  { name: 'libmp3lame', type: '外部', quality: '好', speed: '快', note: 'MP3 编码，兼容性最好' },
  { name: 'libopus', type: '外部', quality: '很好', speed: '中', note: 'Opus 编码，低码率下优于 AAC' },
  { name: 'flac', type: '内置', quality: '无损', speed: '中', note: '无损音频编码，文件大' },
  { name: 'pcm_s16le', type: '内置', quality: '无损', speed: '最快', note: '未压缩 PCM，WAV 格式常用' },
]

const advancedExamples = [
  { desc: '音频延迟（同步音视频）', cmd: 'ffmpeg -i input.mp4 -itsoffset 0.5 -i input.mp4 -map 1:v -map 0:a -c copy output.mp4' },
  { desc: '音量标准化（EBU R128）', cmd: 'ffmpeg -i input.mp4 -af loudnorm -c:v copy output.mp4' },
  { desc: '调整音量（+3 dB）', cmd: 'ffmpeg -i input.mp4 -af "volume=3dB" -c:v copy output.mp4' },
  { desc: '降低音量（一半）', cmd: 'ffmpeg -i input.mp4 -af "volume=0.5" -c:v copy output.mp4' },
  { desc: '静音检测', cmd: 'ffmpeg -i input.mp4 -af silencedetect=noise=-30dB:d=0.5 -f null -' },
  { desc: '合并多个音频流', cmd: 'ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:a][1:a]amix=inputs=2:duration=first" -c:v copy output.mp4' },
  { desc: '音频淡入（前 3 秒）', cmd: 'ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=3" -c:v copy output.mp4' },
  { desc: '音频淡出（最后 3 秒）', cmd: 'ffmpeg -i input.mp4 -af "afade=t=out:st=57:d=3" -c:v copy output.mp4' },
]

const channelLayouts = [
  { layout: '单声道', channels: 1, ffmpeg: '-ac 1', note: 'mono' },
  { layout: '立体声', channels: 2, ffmpeg: '-ac 2', note: 'stereo' },
  { layout: '3.0', channels: 3, ffmpeg: '-ac 3', note: '左、右、中置' },
  { layout: '4.0', channels: 4, ffmpeg: '-ac 4', note: '左、右、左后、右后' },
  { layout: '5.1 环绕声', channels: 6, ffmpeg: '-ac 6', note: '左、右、中置、低音、左后、右后' },
  { layout: '7.1 环绕声', channels: 8, ffmpeg: '-ac 8', note: '5.1 + 左侧、右侧' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 音频处理基础</h3>
    <p class="summary">掌握音频采样率、声道数、编码格式、码率等核心参数的调整方法。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础操作</button>
      <button class="tab-btn" :class="{ active: activeTab === 'encoder' }" @click="activeTab = 'encoder'">编码格式</button>
      <button class="tab-btn" :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">高级处理</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>基础音频参数调整</h4>
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

    <div v-if="activeTab === 'encoder'" class="encoder-section">
      <h4>音频编码格式对比</h4>
      <table>
        <thead><tr><th>编码器</th><th>类型</th><th>质量</th><th>速度</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="e in audioEncoders" :key="e.name">
            <td><code>{{ e.name }}</code></td>
            <td>{{ e.type }}</td>
            <td>{{ e.quality }}</td>
            <td>{{ e.speed }}</td>
            <td><small>{{ e.note }}</small></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">声道布局</h4>
      <table>
        <thead><tr><th>布局</th><th>声道数</th><th>FFmpeg 参数</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="c in channelLayouts" :key="c.layout">
            <td>{{ c.layout }}</td>
            <td>{{ c.channels }}</td>
            <td><code>{{ c.ffmpeg }}</code></td>
            <td><small>{{ c.note }}</small></td>
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
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
</style>
