const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'basic' | 'auto' | 'aspect'>('basic')

const basicExamples = [
  { desc: '裁剪 specified 区域（x, y 是起始坐标）', cmd: 'ffmpeg -i input.mp4 -vf crop=1280:720:0:0 output.mp4' },
  { desc: '自动居中裁剪（使用表达式）', cmd: 'ffmpeg -i input.mp4 -vf crop=ih*9/16:ih:(in_w-ih*9/16)/2:0 output.mp4' },
  { desc: '裁剪掉上下各 60 像素的黑边', cmd: 'ffmpeg -i input.mp4 -vf crop=iw:ih-120:0:60 output.mp4' },
  { desc: '裁剪掉左右各 100 像素', cmd: 'ffmpeg -i input.mp4 -vf crop=iw-200:ih:100:0 output.mp4' },
  { desc: '裁剪并缩放（两步合并）', cmd: 'ffmpeg -i input.mp4 -vf "crop=1920:800:0:140,scale=1280:720" output.mp4' },
]

const cropDetectInfo = {
  title: '使用 cropdetect 自动检测黑边',
  desc: 'cropdetect 滤镜可以自动扫描视频，检测黑边或纯色边缘，并返回建议的裁剪参数。使用 -vf cropdetect 运行一次，查看控制台输出的 crop 参数，然后使用该参数进行实际裁剪。',
  steps: [
    '运行：ffmpeg -i input.mp4 -vf cropdetect -f null -',
    '查看输出中的 crop=w:h:x:y 参数（取出现最多次的数值）',
    '使用检测到的参数进行裁剪：ffmpeg -i input.mp4 -vf crop=w:h:x:y output.mp4',
  ],
  example: \`# 第一步：检测黑边
ffmpeg -i input.mp4 -vf cropdetect -f null -

# 输出示例：
# [Parsed_cropdetect_0 @ 0x...] x1:0 x2:1919 y1:60 y2:1019 w:1920 h:960 x:0 y:60 pts:... crop=1920:960:0:60

# 第二步：使用检测到的参数裁剪
ffmpeg -i input.mp4 -vf crop=1920:960:0:60 output.mp4\`
}

const aspectConversion = [
  { from: '16:9 横屏', to: '9:16 竖屏', method: '居中裁剪', cmd: 'ffmpeg -i input.mp4 -vf "crop=ih*9/16:ih:(in_w-ih*9/16)/2:0,scale=-2:1920" output.mp4' },
  { from: '16:9 横屏', to: '1:1 方形', method: '居中裁剪', cmd: 'ffmpeg -i input.mp4 -vf "crop=ih:ih:(in_w-ih)/2:0,scale=1080:1080" output.mp4' },
  { from: '9:16 竖屏', to: '16:9 横屏', method: '添加黑边', cmd: 'ffmpeg -i input.mp4 -vf "scale=1920:-2,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" output.mp4' },
  { from: '随意尺寸', to: '16:9', method: '裁剪+缩放', cmd: 'ffmpeg -i input.mp4 -vf "scale=1920:-2,crop=1920:1080" output.mp4' },
]

const cropParams = {
  w: ref(1280),
  h: ref(720),
  x: ref(0),
  y: ref(0)
}

const generatedCommand = computed(() => {
  return \`ffmpeg -i input.mp4 -vf crop=\${cropParams.w.value}:\${cropParams.h.value}:\${cropParams.x.value}:\${cropParams.y.value} output.mp4\`
})
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 视频裁剪（Crop）</h3>
    <p class="summary">使用 crop 滤镜裁剪视频画面，去除黑边、聚焦特定区域或调整为不同宽高比。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础裁剪</button>
      <button class="tab-btn" :class="{ active: activeTab === 'auto' }" @click="activeTab = 'auto'">自动检测</button>
      <button class="tab-btn" :class="{ active: activeTab === 'aspect' }" @click="activeTab = 'aspect'">宽高比转换</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>crop 滤镜基础用法</h4>
      <p>语法：<code>crop=w:h:x:y</code>，其中 w 和 h 是输出尺寸，x 和 y 是裁剪起始坐标（相对于原始画面左上角）。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in basicExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <div class="command-builder" style="margin-top:16px;">
        <h4>裁剪参数生成器</h4>
        <div style="display:grid;grid-template-columns:repeat(4,auto);gap:12px;align-items:center;margin:12px 0;">
          <label>宽度 w：<input type="number" v-model="cropParams.w" style="width:70px;" /></label>
          <label>高度 h：<input type="number" v-model="cropParams.h" style="width:70px;" /></label>
          <label>x：<input type="number" v-model="cropParams.x" style="width:70px;" /></label>
          <label>y：<input type="number" v-model="cropParams.y" style="width:70px;" /></label>
        </div>
        <pre><code>{{ generatedCommand }}</code></pre>
      </div>
    </div>

    <div v-if="activeTab === 'auto'" class="auto-section">
      <div class="info-card">
        <h4>{{ cropDetectInfo.title }}</h4>
        <p>{{ cropDetectInfo.desc }}</p>
        <ol style="margin-top:12px;">
          <li v-for="(step, i) in cropDetectInfo.steps" :key="i">{{ step }}</li>
        </ol>
      </div>
      <pre style="margin-top:16px;"><code>{{ cropDetectInfo.example }}</code></pre>
    </div>

    <div v-if="activeTab === 'aspect'" class="aspect-section">
      <h4>宽高比转换裁剪方案</h4>
      <table>
        <thead><tr><th>源</th><th>目标</th><th>方法</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="c in aspectConversion" :key="c.from + c.to">
            <td><code>{{ c.from }}</code></td>
            <td><code>{{ c.to }}</code></td>
            <td>{{ c.method }}</td>
            <td><code class="cmd">{{ c.cmd }}</code></td>
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
pre code { color: #7fff7f; line-height: 1.6; }
input[type="number"] {
  background: #2a2a4a;
  color: #e0e0e0;
  border: 1px solid #4a4a6a;
  border-radius: 4px;
  padding: 4px 8px;
}
label { display: flex; align-items: center; gap: 6px; }
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
ol { padding-left: 20px; }
li { margin-bottom: 6px; line-height: 1.5; }
</style>
`;export{n as default};
