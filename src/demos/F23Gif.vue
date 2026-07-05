<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'palette' | 'optimize'>('basic')

const basicExamples = [
  { desc: '最简单：视频转 GIF（色彩效果差）', cmd: 'ffmpeg -i input.mp4 output.gif' },
  { desc: '指定尺寸和帧率（推荐）', cmd: 'ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" output.gif' },
  { desc: '从指定时间开始，持续 5 秒', cmd: 'ffmpeg -ss 00:00:10 -t 5 -i input.mp4 -vf "fps=10,scale=320:-1" output.gif' },
  { desc: '使用 lanczos 缩放算法（质量更好）', cmd: 'ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos" output.gif' },
  { desc: '生成循环 GIF', cmd: 'ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" -loop 0 output.gif' },
  { desc: '生成不循环 GIF', cmd: 'ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" -loop 1 output.gif' },
]

const paletteExamples = [
  { desc: '两步法：生成调色板 + 使用调色板（推荐）', cmd: '# 第一步：生成调色板\nffmpeg -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos,palettegen=stats_mode=diff" palette.png\n\n# 第二步：使用调色板生成 GIF\nffmpeg -i input.mp4 -i palette.png -lavfi "[0:v]fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" output.gif' },
  { desc: '简化版两步法', cmd: 'ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos,palettegen" palette.png && ffmpeg -i input.mp4 -i palette.png -filter_complex "[0:v]fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse" output.gif' },
  { desc: '使用 FloydSteinberg 抖动（默认）', cmd: 'ffmpeg -i input.mp4 -i palette.png -filter_complex "[0:v]fps=10,scale=320:-1[x];[x][1:v]paletteuse=dither=floyd_steinberg" output.gif' },
  { desc: '使用 Bayer 抖动（更快）', cmd: 'ffmpeg -i input.mp4 -i palette.png -filter_complex "[0:v]fps=10,scale=320:-1[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" output.gif' },
]

const optimizeTips = [
  { tip: '降低帧率', detail: 'GIF 不需要高帧率，10-15 FPS 通常足够。使用 fps=10 或 fps=15 滤镜。' },
  { tip: '缩小尺寸', detail: 'GIF 尺寸越大文件越大。使用 scale=320:-1 或 scale=480:-1 缩小到合适尺寸。' },
  { tip: '减少颜色数', detail: '使用 palettegen=max_colors=128 可以减少颜色数（默认 256），进一步减小文件大小。' },
  { tip: '使用调色板', detail: '永远使用两步法（palettegen + paletteuse），否则 GIF 色彩效果会很差。' },
  { tip: '考虑替代格式', detail: 'WebP 动画或 MP4 短视频在同等质量下文件更小，且支持更多颜色。考虑使用 <video> 标签替代 <img> 显示 GIF。' },
]

const gifParams = {
  fps: ref(10),
  width: ref(320),
  maxColors: ref(256),
  dither: ref('bayer')
}
</script>

<template>
  <div class="demo-card">
    <h3>🌰 GIF 动图生成与优化</h3>
    <p class="summary">从视频生成高质量 GIF 动图，掌握调色板生成、尺寸优化和播放控制。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础生成</button>
      <button class="tab-btn" :class="{ active: activeTab === 'palette' }" @click="activeTab = 'palette'">调色板</button>
      <button class="tab-btn" :class="{ active: activeTab === 'optimize' }" @click="activeTab = 'optimize'">优化技巧</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>基础 GIF 生成命令</h4>
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

    <div v-if="activeTab === 'palette'" class="palette-section">
      <h4>调色板两步法（推荐）</h4>
      <p>GIF 格式只支持 256 色，直接从视频生成会导致严重色偏。正确方法是先生成调色板（palettegen），然后使用调色板进行二次编码（paletteuse）。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in paletteExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><pre><code>{{ ex.cmd }}</code></pre></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'optimize'" class="optimize-section">
      <h4>GIF 优化技巧</h4>
      <div v-for="t in optimizeTips" :key="t.tip" class="tip-card">
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
pre {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}
pre code { color: #7fff7f; line-height: 1.6; white-space: pre-wrap; }
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
p { line-height: 1.6; }
</style>
