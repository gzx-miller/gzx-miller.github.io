const e=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'pip' | 'watermark'>('basic')

const basicExamples = [
  { desc: '基础画中画（右上角）', cmd: 'ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=W-w-20:H-h-20" output.mp4' },
  { desc: '画中画（左下角）', cmd: 'ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=20:H-h-20" output.mp4' },
  { desc: '画中画（居中）', cmd: 'ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=640:360[pipsmall];[0:v][pipsmall]overlay=(W-w)/2:(H-h)/2" output.mp4' },
  { desc: '带透明度的画中画（0.5 = 50% 透明）', cmd: 'ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180,format=rgba,colorchannelmixer=aa=0.5[pipsmall];[0:v][pipsmall]overlay" output.mp4' },
  { desc: '画中画指定显示时间段', cmd: 'ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=W-w-20:H-h-20:enable=\\'between(t,10,20)\\'" output.mp4' },
]

const pipExamples = [
  { desc: '动态画中画（画中画从右向左移入）', cmd: 'ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=x=\\'if(lt(t,5),W-w-(t*60),W-w-300)\\':y=H-h-20" output.mp4' },
  { desc: '多个画中画', cmd: 'ffmpeg -i main.mp4 -i pip1.mp4 -i pip2.mp4 -filter_complex "[1:v]scale=320:180[pip1];[2:v]scale=320:180[pip2];[0:v][pip1]overlay=W-w-20:H-h-20[tmp];[tmp][pip2]overlay=20:H-h-20" output.mp4' },
  { desc: '画中画 + 边框', cmd: 'ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180,pad=324:184:2:2:red[pipsmall];[0:v][pipsmall]overlay=W-w-20:H-h-20" output.mp4' },
  { desc: '画中画 + 圆角（需要复杂滤镜）', cmd: '# 圆角效果需要使用geq滤镜或预先处理画中画视频\\n# 建议使用其他工具预处理画中画视频' },
]

const watermarkExamples = [
  { desc: '添加静态图片水印（右上角）', cmd: 'ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=W-w-20:20" output.mp4' },
  { desc: '添加图片水印（居中）', cmd: 'ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=(W-w)/2:(H-h)/2" output.mp4' },
  { desc: '透明 PNG 水印', cmd: 'ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=W-w-20:20" output.mp4' },
  { desc: '水印淡入淡出', cmd: 'ffmpeg -i input.mp4 -i logo.png -filter_complex "[1:v]format=rgba,colorchannelmixer=aa=0.7[watermark];[0:v][watermark]overlay=W-w-20:20:enable=\\'between(t,0,3)+between(t,57,60)\\'" output.mp4' },
  { desc: '滚动水印（从右向左）', cmd: 'ffmpeg -i input.mp4 -i logo.png -filter_complex "[1:v]loop=loop=-1:size=1[watermark];[0:v][watermark]overlay=x=W-t*50:y=H-h-20" output.mp4' },
]

const overlayParams = [
  { param: 'x, y', desc: '水印/画中画位置（可以使用表达式）' },
  { param: 'enable', desc: '控制水印显示时间段（如 between(t,10,20)）' },
  { param: 'eof_action', desc: '当辅助输入结束时的行为（repeat, pass, endall）' },
  { param: 'shortest', desc: '当设为 1 时，输出在较短的输入结束时停止' },
  { param: 'format', desc: '输出像素格式（yuv420p, rgba 等）' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 画面叠加与画中画（Overlay）</h3>
    <p class="summary">使用 overlay 滤镜实现画中画、水印添加、多画面拼接等叠加效果。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础叠加</button>
      <button class="tab-btn" :class="{ active: activeTab === 'pip' }" @click="activeTab = 'pip'">画中画</button>
      <button class="tab-btn" :class="{ active: activeTab === 'watermark' }" @click="activeTab = 'watermark'">水印添加</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>overlay 滤镜基础用法</h4>
      <p>overlay 滤镜需要配合复杂的滤镜图（Filter Complex）使用，语法：<code>[背景][前景]overlay=x:y</code>。</p>
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

    <div v-if="activeTab === 'pip'" class="pip-section">
      <h4>画中画（PiP）效果</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in pipExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'watermark'" class="watermark-section">
      <h4>水印添加</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in watermarkExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">overlay 参数说明</h4>
      <table>
        <thead><tr><th>参数</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="p in overlayParams" :key="p.param">
            <td><code>{{ p.param }}</code></td>
            <td>{{ p.desc }}</td>
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
p { line-height: 1.6; }
</style>
`;export{e as default};
