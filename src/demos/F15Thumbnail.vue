<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'tile' | 'sprite'>('basic')

const basicExamples = [
  { desc: '每隔 60 秒截图一帧', cmd: 'ffmpeg -i input.mp4 -vf fps=1/60 thumbnail_%04d.jpg' },
  { desc: '每隔 10 秒截图一帧', cmd: 'ffmpeg -i input.mp4 -vf fps=1/10 thumbnail_%04d.jpg' },
  { desc: '每隔 300 帧截图一帧', cmd: 'ffmpeg -i input.mp4 -vf "select=not(mod(n\\,300))" -vsync vfr thumbnail_%04d.jpg' },
  { desc: '限制最多截图 20 张', cmd: 'ffmpeg -i input.mp4 -vf fps=1/10 -vframes 20 thumbnail_%04d.jpg' },
  { desc: '指定输出尺寸（缩小）', cmd: 'ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1" thumbnail_%04d_%04d.jpg' },
  { desc: '使用高质量 JPEG 输出', cmd: 'ffmpeg -i input.mp4 -vf fps=1/10 -q:v 2 thumbnail_%04d.jpg' },
]

const tileExamples = [
  { desc: '创建 5×4 缩略图网格（20 张）', cmd: 'ffmpeg -i input.mp4 -vf "fps=1/60,scale=320:-1,tile=5x4" -vframes 1 thumbnail_sheet.jpg' },
  { desc: '创建 4×3 缩略图网格（12 张）', cmd: 'ffmpeg -i input.mp4 -vf "select=not(mod(n\\,150)),scale=320:-1,tile=4x3" -vsync vfr thumbnail_sheet.jpg' },
  { desc: '缩略图网格 + 时间戳标注', cmd: 'ffmpeg -i input.mp4 -vf "fps=1/60,scale=320:-1,drawtext=text=\'%{pts\\:hms}\':x=10:y=H-30:fontsize=16:fontcolor=white,tile=5x4" -vframes 1 sheet.jpg' },
  { desc: '创建横向长图（1 列 N 行）', cmd: 'ffmpeg -i input.mp4 -vf "fps=1/30,scale=640:-1,tile=1x10" -vframes 1 vertical_sheet.jpg' },
  { desc: '创建纵向长图（N 列 1 行）', cmd: 'ffmpeg -i input.mp4 -vf "fps=1/30,scale=320:-1,tile=10x1" -vframes 1 horizontal_sheet.jpg' },
]

const spriteInfo = {
  title: '雪碧图（Sprite）与 WebVTT',
  desc: '雪碧图是将多个缩略图合并为一张大图，配合 WebVTT 索引文件，可以实现类似 YouTube 的悬停预览效果。生成步骤：1) 生成缩略图；2) 合并为雪碧图；3) 生成 WebVTT 文件。',
  steps: [
    '生成缩略图：ffmpeg -i input.mp4 -vf fps=1/10 -q:v 5 thumb_%04d.jpg',
    '合并为雪碧图（使用 ImageMagick 或 Python 脚本）',
    '生成 WebVTT 索引文件，指定每个缩略图的时间范围和坐标',
    '在 HTML5 <video> 中使用 <track> 标签加载 WebVTT 文件',
  ],
  vttExample: `WEBVTT

00:00:00.000 --> 00:00:10.000
/thumbs_sprite.jpg#xywh=0,0,320,180

00:00:10.000 --> 00:00:20.000
/thumbs_sprite.jpg#xywh=320,0,320,180

00:00:20.000 --> 00:00:30.000
/thumbs_sprite.jpg#xywh=640,0,320,180`
}

const layoutExamples = [
  { layout: '5×4 (20张)', cmd: 'tile=5x4', note: '适合 20-30 分钟视频' },
  { layout: '8×6 (48张)', cmd: 'tile=8x6', note: '适合 1 小时视频' },
  { layout: '4×3 (12张)', cmd: 'tile=4x3', note: '适合短视频' },
  { layout: '10×1 (横向)', cmd: 'tile=10x1', note: '适合对比查看' },
  { layout: '1×10 (纵向)', cmd: 'tile=1x10', note: '适合移动端查看' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 缩略图与预览图生成</h3>
    <p class="summary">生成视频缩略图网格（Contact Sheet）和 HLS 风格预览图，提升视频管理和用户体验。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">批量截图</button>
      <button class="tab-btn" :class="{ active: activeTab === 'tile' }" @click="activeTab = 'tile'">缩略图网格</button>
      <button class="tab-btn" :class="{ active: activeTab === 'sprite' }" @click="activeTab = 'sprite'">雪碧图</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>批量截图命令</h4>
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

    <div v-if="activeTab === 'tile'" class="tile-section">
      <h4>缩略图网格（Contact Sheet）</h4>
      <p>使用 <code>tile</code> 滤镜将多帧排列为网格，生成一张预览图。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in tileExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">常用网格布局</h4>
      <table>
        <thead><tr><th>布局</th><th>tile 参数</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="l in layoutExamples" :key="l.layout">
            <td>{{ l.layout }}</td>
            <td><code>{{ l.cmd }}</code></td>
            <td><small>{{ l.note }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'sprite'" class="sprite-section">
      <div class="info-card">
        <h4>{{ spriteInfo.title }}</h4>
        <p>{{ spriteInfo.desc }}</p>
        <ol style="margin-top:12px;">
          <li v-for="(step, i) in spriteInfo.steps" :key="i">{{ step }}</li>
        </ol>
      </div>
      <div style="margin-top:16px;">
        <h4>WebVTT 索引文件示例</h4>
        <pre><code>{{ spriteInfo.vttExample }}</code></pre>
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
.info-card {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #6a5acd;
}
pre {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}
pre code { color: #7fff7f; line-height: 1.6; white-space: pre-wrap; }
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
ol { padding-left: 20px; }
li { margin-bottom: 6px; line-height: 1.5; }
</style>
