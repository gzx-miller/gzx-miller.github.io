const t=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'fps-filter' | 'tips'>('basic')

const basicExamples = [
  { desc: '查看视频帧率', cmd: 'ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4' },
  { desc: '修改输出帧率为 30 FPS', cmd: 'ffmpeg -i input.mp4 -r 30 output.mp4' },
  { desc: '使用 fps 滤镜精确控制（推荐）', cmd: 'ffmpeg -i input.mp4 -vf fps=30 output.mp4' },
  { desc: '修改帧率为 24 FPS（电影帧率）', cmd: 'ffmpeg -i input.mp4 -vf fps=24 output.mp4' },
  { desc: '修改帧率为 60 FPS', cmd: 'ffmpeg -i input.mp4 -vf fps=60 output.mp4' },
  { desc: '从特定时间开始，持续 10 秒，输出 30 FPS', cmd: 'ffmpeg -ss 00:01:00 -t 10 -i input.mp4 -vf fps=30 output.mp4' },
]

const fpsFilterExamples = [
  { desc: '将 60 FPS 转为 30 FPS（抽帧）', cmd: 'ffmpeg -i input_60fps.mp4 -vf fps=30 output_30fps.mp4' },
  { desc: '将 24 FPS 转为 30 FPS（补帧，可能不流畅）', cmd: 'ffmpeg -i input_24fps.mp4 -vf fps=30 output_30fps.mp4' },
  { desc: '使用 minterpolate 插值补帧（24→60 FPS）', cmd: 'ffmpeg -i input_24fps.mp4 -vf minterpolate=fps=60 output_60fps.mp4' },
  { desc: '提取关键帧（只保留 I-frame）', cmd: 'ffmpeg -i input.mp4 -vf "select=eq(pict_type\\\\,I)" -vsync vfr output_keyframes.mp4' },
  { desc: '限制最大帧率为 30 FPS', cmd: 'ffmpeg -i input.mp4 -vf "fps=30,setpts=PTS-STARTPTS" output.mp4' },
]

const framerateStandards = [
  { name: '23.976 FPS', standard: 'NTSC 电影', usage: '电影、美剧', note: '等同于 24000/1001' },
  { name: '24 FPS', standard: '电影标准', usage: '电影拍摄', note: '经典电影帧率' },
  { name: '25 FPS', standard: 'PAL', usage: '欧洲电视、中国电视', note: '50Hz 电力标准' },
  { name: '29.97 FPS', standard: 'NTSC', usage: '北美电视、日剧', note: '等同于 30000/1001' },
  { name: '30 FPS', standard: 'NTSC 简化', usage: '网络视频、游戏录制', note: 'Drop-frame 简化版' },
  { name: '50 FPS', standard: 'PAL 逐行', usage: '欧洲高清电视', note: '更流畅的运动画面' },
  { name: '60 FPS', standard: '高帧率', usage: '游戏、体育、VR', note: '更流畅，文件更大' },
]

const tips = [
  { tip: '抽帧不可逆', detail: '将高帧率视频转为低帧率会丢弃帧，无法恢复。建议保留原始高帧率文件。' },
  { tip: '补帧效果有限', detail: '使用 minterpolate 插值生成的帧是"猜测"出来的，可能产生伪影和异常。对于动作片或快速移动场景效果较差。' },
  { tip: '帧率与码率的关系', detail: '相同编码参数下，帧率越高需要越高码率保持相同质量。60 FPS 视频通常需要 30 FPS 视频 1.5-2 倍的码率。' },
  { tip: 'async 和 vsync 参数', detail: '当输入和输出帧率不同时，可能需要调整 -async 和 -vsync 参数来控制音视频同步行为。' },
  { tip: 'Fraction 帧率表示', detail: 'FFmpeg 内部使用分数表示帧率，如 30000/1001 表示 29.97 FPS。使用 -r 或 fps 滤镜时可以直接使用小数。' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 帧率修改与抽帧补帧</h3>
    <p class="summary">理解帧率（FPS）的概念，掌握修改帧率、抽帧、补帧（插值）的操作方法。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础操作</button>
      <button class="tab-btn" :class="{ active: activeTab === 'fps-filter' }" @click="activeTab = 'fps-filter'">fps 滤镜</button>
      <button class="tab-btn" :class="{ active: activeTab === 'tips' }" @click="activeTab = 'tips'">注意事项</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>基础帧率操作</h4>
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

    <div v-if="activeTab === 'fps-filter'" class="fps-filter-section">
      <h4>fps 滤镜高级用法</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in fpsFilterExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">常用帧率标准</h4>
      <table>
        <thead><tr><th>帧率</th><th>标准</th><th>用途</th><th>备注</th></tr></thead>
        <tbody>
          <tr v-for="s in framerateStandards" :key="s.name">
            <td><code>{{ s.name }}</code></td>
            <td>{{ s.standard }}</td>
            <td>{{ s.usage }}</td>
            <td><small>{{ s.note }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'tips'" class="tips-section">
      <h4>帧率处理注意事项</h4>
      <div v-for="t in tips" :key="t.tip" class="tip-card">
        <h5>{{ t.tip }}</h5>
        <p>{{ t.detail }}</p>
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
  padding: 16px;
  margin-bottom: 12px;
  border-left: 3px solid #6a5acd;
}
.tip-card h5 { color: #9f9fff; margin: 0 0 8px 0; }
.tip-card p { margin: 0; line-height: 1.6; }
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
</style>
`;export{t as default};
