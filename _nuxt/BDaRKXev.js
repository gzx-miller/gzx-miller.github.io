const e=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'basic' | 'aspect' | 'advanced'>('basic')

const scaleExamples = [
  { desc: '指定目标分辨率（可能变形）', cmd: 'ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4' },
  { desc: '只指定宽度，高度自动（保持宽高比）', cmd: 'ffmpeg -i input.mp4 -vf scale=1280:-1 output.mp4' },
  { desc: '只指定高度，宽度自动（保持宽高比）', cmd: 'ffmpeg -i input.mp4 -vf scale=-1:720 output.mp4' },
  { desc: '使用 -2 确保尺寸为偶数（推荐）', cmd: 'ffmpeg -i input.mp4 -vf scale=-2:720 output.mp4' },
  { desc: '缩放到 720p（保持宽高比）', cmd: 'ffmpeg -i input.mp4 -vf scale=-2:720 output.mp4' },
  { desc: '缩放到 1080p', cmd: 'ffmpeg -i input.mp4 -vf scale=-2:1080 output.mp4' },
  { desc: '缩放到 4K', cmd: 'ffmpeg -i input.mp4 -vf scale=-2:2160 output.mp4' },
]

const aspectRatioMethods = [
  { method: '拉伸（可能变形）', cmd: 'scale=1280:720', note: '不保持原始宽高比，画面可能变形' },
  { method: '适应（添加黑边/Pillarbox）', cmd: 'scale=min(iw*720/ih\\\\,1280):min(ih*1280/iw\\\\,720),pad=1280:720:(1280-iw*720/ih)/2:(720-ih*1280/iw)/2', note: '保持完整画面，但添加黑边' },
  { method: '裁剪（Crop）', cmd: 'scale=max(iw*720/ih\\\\,1280):max(ih*1280/iw\\\\,720),crop=1280:720', note: '填满目标区域，但裁剪掉部分画面' },
  { method: '使用 force_original_aspect_ratio', cmd: 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2', note: 'FFmpeg 3.0+ 支持，更简洁' },
]

const advancedScale = {
  algorithms: [
    { name: 'bilinear（默认）', desc: '速度快，质量一般，适合缩小' },
    { name: 'bicubic', desc: '质量优于 bilinear，速度适中' },
    { name: 'lanczos', desc: '质量最好，速度较慢，适合放大' },
    { name: 'spline', desc: '质量好，速度介于 lanczos 和 bicubic 之间' },
    { name: 'neighbor', desc: '最近邻，质量差但保留像素锐度' },
  ],
  examples: [
    { desc: '使用 lanczos 算法缩放（推荐用于放大）', cmd: 'ffmpeg -i input.mp4 -vf scale=1920:1080:flags=lanczos output.mp4' },
    { desc: '使用 bicubic 算法（质量与速度平衡）', cmd: 'ffmpeg -i input.mp4 -vf scale=1280:720:flags=bicubic output.mp4' },
    { desc: '保持位深（10-bit 内容）', cmd: 'ffmpeg -i input.mkv -vf scale=1920:1080 -pix_fmt yuv420p10le output.mkv' },
  ]
}

const inputWidth = ref(1920)
const inputHeight = ref(1080)
const targetWidth = ref(1280)
const targetHeight = ref(720)
const keepAspect = ref(true)

const previewCommand = computed(() => {
  if (keepAspect.value) {
    return \`ffmpeg -i input.mp4 -vf scale=-2:\${targetHeight.value} output.mp4\`
  } else {
    return \`ffmpeg -i input.mp4 -vf scale=\${targetWidth.value}:\${targetHeight.value} output.mp4\`
  }
})
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 分辨率调整与缩放滤镜</h3>
    <p class="summary">使用 scale 滤镜调整视频分辨率，掌握等比缩放、指定缩放、填充与裁剪等常见场景。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础缩放</button>
      <button class="tab-btn" :class="{ active: activeTab === 'aspect' }" @click="activeTab = 'aspect'">宽高比处理</button>
      <button class="tab-btn" :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">高级缩放</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>scale 滤镜基础用法</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in scaleExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <div class="command-preview" style="margin-top:16px;">
        <h4>命令预览</h4>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:12px 0;">
          <label>原始分辨率：<input type="number" v-model="inputWidth" style="width:70px;" /> × <input type="number" v-model="inputHeight" style="width:70px;" /></label>
          <label><input type="checkbox" v-model="keepAspect" /> 保持宽高比</label>
        </div>
        <div v-if="!keepAspect" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:8px 0;">
          <label>目标宽度：<input type="number" v-model="targetWidth" style="width:70px;" /></label>
          <label>目标高度：<input type="number" v-model="targetHeight" style="width:70px;" /></label>
        </div>
        <div v-else style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:8px 0;">
          <label>目标高度：<input type="number" v-model="targetHeight" style="width:70px;" /></label>
        </div>
        <pre><code>{{ previewCommand }}</code></pre>
      </div>
    </div>

    <div v-if="activeTab === 'aspect'" class="aspect-section">
      <h4>宽高比转换方法</h4>
      <p>当源视频和目标区域的宽高比不同时，有三种处理方式：</p>
      <table>
        <thead><tr><th>方法</th><th>命令片段</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="m in aspectRatioMethods" :key="m.method">
            <td>{{ m.method }}</td>
            <td><code class="cmd">{{ m.cmd }}</code></td>
            <td><small>{{ m.note }}</small></td>
          </tr>
        </tbody>
      </table>

      <div class="tip-box" style="margin-top:16px;">
        <h4>💡 推荐用法</h4>
        <ul>
          <li>优先使用 <code>scale=-2:高度</code> 或 <code>scale=宽度:-2</code>，让 FFmpeg 自动计算对应维度并确保为偶数。</li>
          <li>使用 <code>force_original_aspect_ratio=decrease</code> 可以在不放大原始视频的情况下适配目标尺寸。</li>
          <li>对于竖屏视频（9:16）转横屏（16:9），建议先裁剪关键区域再缩放，或添加上下黑边。</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'advanced'" class="advanced-section">
      <h4>缩放算法对比</h4>
      <table>
        <thead><tr><th>算法</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="a in advancedScale.algorithms" :key="a.name">
            <td><code>{{ a.name }}</code></td>
            <td>{{ a.desc }}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">高级缩放命令示例</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in advancedScale.examples" :key="ex.cmd">
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
pre {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}
pre code { color: #7fff7f; line-height: 1.6; }
.tip-box {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #6a5acd;
}
.tip-box ul { padding-left: 20px; }
.tip-box li { margin-bottom: 6px; line-height: 1.5; }
input[type="number"] {
  background: #2a2a4a;
  color: #e0e0e0;
  border: 1px solid #4a4a6a;
  border-radius: 4px;
  padding: 4px 8px;
}
label { display: flex; align-items: center; gap: 6px; }
input[type="checkbox"] { accent-color: #6a5acd; }
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
</style>
`;export{e as default};
