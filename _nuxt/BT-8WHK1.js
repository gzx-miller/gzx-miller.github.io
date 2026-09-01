const t=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'batch' | 'quality'>('basic')

const basicExamples = [
  { desc: '截取第 10 秒的画面（快速但可能不精确）', cmd: 'ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 output.jpg' },
  { desc: '精确截取第 10 秒的画面（慢但精确）', cmd: 'ffmpeg -i input.mp4 -ss 00:00:10 -vframes 1 output.jpg' },
  { desc: '截取开头的画面（第 0 秒）', cmd: 'ffmpeg -ss 0 -i input.mp4 -vframes 1 thumbnail.jpg' },
  { desc: '截取 1 分 30 秒处的画面', cmd: 'ffmpeg -ss 00:01:30 -i input.mp4 -vframes 1 frame_90s.jpg' },
  { desc: '使用 PNG 格式（无损）', cmd: 'ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 -q:v 2 output.png' },
  { desc: '使用 WebP 格式（兼顾质量和大小）', cmd: 'ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 output.webp' },
]

const batchExamples = [
  { desc: '每隔 10 秒截取一帧', cmd: 'ffmpeg -i input.mp4 -vf fps=1/10 thumbnail_%04d.jpg' },
  { desc: '每隔 60 秒截取一帧（每分钟一张）', cmd: 'ffmpeg -i input.mp4 -vf fps=1/60 thumbnail_%04d.jpg' },
  { desc: '只截取前 5 分钟，每隔 10 秒一张', cmd: 'ffmpeg -i input.mp4 -t 300 -vf fps=1/10 thumb_%04d.jpg' },
  { desc: '使用 select 滤镜按时间戳截图', cmd: 'ffmpeg -i input.mp4 -vf "select=eq(t\\\\,10)+eq(t\\\\,30)+eq(t\\\\,60)" -vsync vfr thumb_%04d.jpg' },
  { desc: '每隔 100 帧截取一帧', cmd: 'ffmpeg -i input.mp4 -vf "select=not(mod(n\\\\,100))" -vsync vfr frame_%04d.jpg' },
]

const qualitySettings = [
  { format: 'JPEG', param: '-q:v 2', quality: '高质量（文件大）', note: '1-31，值越小质量越高' },
  { format: 'JPEG', param: '-q:v 5', quality: '标准质量', note: '推荐用于大多数场景' },
  { format: 'JPEG', param: '-q:v 10', quality: '可接受质量（文件小）', note: '适合缩略图' },
  { format: 'PNG', param: '-compression_level 0', quality: '最快压缩（文件大）', note: '0-9，值越大压缩率越高' },
  { format: 'PNG', param: '-compression_level 6', quality: '平衡速度和压缩率', note: '推荐用于大多数场景' },
  { format: 'WebP', param: '-quality 90', quality: '高质量', note: '0-100，默认 75' },
]

const tips = [
  '使用 -ss 在 -i 之前可以快速定位但可能不精确（依赖关键帧位置）。',
  '使用 -ss 在 -i 之后可以精确定位但需要从开头解码到指定位置（慢）。',
  '对于精确截图，建议使用 -ss 在 -i 之后，或使用 seek_timestamp 参数。',
  '批量截图时，输出文件名需要使用 printf 风格（如 thumb_%04d.jpg），否则会被覆盖。',
  '使用 -q:v 参数可以控制 JPEG/PNG 的输出质量，不影响 PNG 的无损特性。',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 视频截图与单帧导出</h3>
    <p class="summary">从视频中提取指定时间点的画面，掌握精确截图、批量截图和高质量静态图像导出。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础截图</button>
      <button class="tab-btn" :class="{ active: activeTab === 'batch' }" @click="activeTab = 'batch'">批量截图</button>
      <button class="tab-btn" :class="{ active: activeTab === 'quality' }" @click="activeTab = 'quality'">质量设置</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>基础截图命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in basicExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box" style="margin-top:16px;">
        <h4>💡 截图技巧</h4>
        <ul>
          <li v-for="tip in tips" :key="tip">{{ tip }}</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'batch'" class="batch-section">
      <h4>批量截图命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in batchExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'quality'" class="quality-section">
      <h4>输出质量设置</h4>
      <table>
        <thead><tr><th>格式</th><th>参数</th><th>质量</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="q in qualitySettings" :key="q.param">
            <td><code>{{ q.format }}</code></td>
            <td><code>{{ q.param }}</code></td>
            <td>{{ q.quality }}</td>
            <td><small>{{ q.note }}</small></td>
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
.tips-box {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #6a5acd;
}
.tips-box ul { padding-left: 20px; }
.tips-box li { margin-bottom: 6px; line-height: 1.5; }
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
</style>
`;export{t as default};
