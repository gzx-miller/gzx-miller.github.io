const t=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'aspect' | 'examples'>('basic')

const basicExamples = [
  { desc: '添加黑边（16:9 → 4:3 显示）', cmd: 'ffmpeg -i input_16x9.mp4 -vf "pad=1920:1440:(ow-iw)/2:(oh-ih)/2" output_pillarbox.mp4' },
  { desc: '添加黑边（竖屏 → 横屏显示）', cmd: 'ffmpeg -i input_vertical.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black" output.mp4' },
  { desc: '添加白边', cmd: 'ffmpeg -i input.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:white" output.mp4' },
  { desc: '添加模糊背景（需要先缩放再 pad）', cmd: 'ffmpeg -i input_vertical.mp4 -vf "[in]scale=1920:-2,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black[out]" output.mp4' },
  { desc: '右下角留白（用于台标）', cmd: 'ffmpeg -i input.mp4 -vf "pad=iw+20:ih+20:0:0:black" output.mp4' },
]

const aspectExamples = [
  { from: '16:9 横屏', to: '1:1 方形 (1080×1080)', method: '左右黑边', cmd: 'ffmpeg -i input.mp4 -vf "pad=1080:1080:(ow-iw)/2:(oh-ih)/2" output_square.mp4' },
  { from: '16:9 横屏', to: '9:16 竖屏 (1080×1920)', method: '上下黑边（不推荐）', cmd: 'ffmpeg -i input.mp4 -vf "scale=1080:-2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" output_vertical.mp4' },
  { from: '4:3 标清', to: '16:9 高清', method: '左右拉伸或裁剪', cmd: 'ffmpeg -i input_4x3.mp4 -vf "crop=ih*16/9:ih,scale=1920:1080" output_wide.mp4' },
  { from: '随意尺寸', to: '16:9 (1920×1080)', method: 'pad + scale', cmd: 'ffmpeg -i input.mp4 -vf "pad=ih*16/9:ih:(ow-iw)/2:(oh-ih)/2,scale=1920:1080" output_169.mp4' },
]

const practicalExamples = [
  { desc: '创建竖屏视频（9:16）适合 TikTok/Reels', cmd: '# 方法1：裁剪关键区域（推荐）\\nffmpeg -i input.mp4 -vf "crop=ih*9/16:ih:(in_w-ih*9/16)/2:0,scale=-2:1920" output_9x16.mp4\\n\\n# 方法2：添加模糊背景（更好看）\\nffmpeg -i input.mp4 -vf "[0:v]scale=1080:1920:force_original_aspect_ratio=increase:crop=1080:1920[v]" -map "[v]" output_9x16_blur.mp4' },
  { desc: '创建方形视频（1:1）适合 Instagram', cmd: 'ffmpeg -i input.mp4 -vf "crop=ih:ih:(in_w-ih)/2:0,scale=1080:1080" output_square.mp4' },
  { desc: '添加渐变边框', cmd: '# 需要使用复杂的滤镜图，或先生成带渐变的背景图片\\n# 然后将视频叠加到背景上（使用 overlay 滤镜）' },
  { desc: '创建画中画效果（小画面在右下角）', cmd: 'ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=W-w-20:H-h-20" output_pip.mp4' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 画面填充（Pad）与宽高比转换</h3>
    <p class="summary">使用 pad 滤镜为视频添加黑边或自定义颜色边距，将视频适配到不同宽高比的播放区域。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础用法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'aspect' }" @click="activeTab = 'aspect'">宽高比转换</button>
      <button class="tab-btn" :class="{ active: activeTab === 'examples' }" @click="activeTab = 'examples'">实战内容</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>pad 滤镜基础用法</h4>
      <p>语法：<code>pad=w:h:x:y:color</code>，其中 w 和 h 是输出尺寸，x 和 y 是原始画面在新画布上的位置。</p>
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

    <div v-if="activeTab === 'aspect'" class="aspect-section">
      <h4>宽高比转换方案</h4>
      <table>
        <thead><tr><th>源</th><th>目标</th><th>方法</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in aspectExamples" :key="ex.from + ex.to">
            <td><code>{{ ex.from }}</code></td>
            <td><code>{{ ex.to }}</code></td>
            <td>{{ ex.method }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'examples'" class="examples-section">
      <h4>实战内容</h4>
      <table>
        <thead><tr><th>用途</th><th>命令/说明</th></tr></thead>
        <tbody>
          <tr v-for="ex in practicalExamples" :key="ex.desc">
            <td>{{ ex.desc }}</td>
            <td><pre v-if="ex.cmd.includes('#')"><code>{{ ex.cmd }}</code></pre><code v-else class="cmd">{{ ex.cmd }}</code></td>
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
pre {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}
pre code { color: #7fff7f; line-height: 1.6; white-space: pre-wrap; font-size: 0.85em; }
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
</style>
`;export{t as default};
