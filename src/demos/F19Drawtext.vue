<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basic' | 'style' | 'dynamic'>('basic')

const basicExamples = [
  { desc: '添加静态文字（默认样式）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'Hello World\':x=10:y=10" output.mp4' },
  { desc: '指定字体文件（Windows）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=fontfile=/Windows/Fonts/msyh.ttc:text=\'你好\':x=10:y=10:fontsize=24:fontcolor=white" output.mp4' },
  { desc: '指定字体文件（macOS）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text=\'Hello\':x=10:y=10:fontsize=24:fontcolor=white" output.mp4' },
  { desc: '设置文字位置（右下角）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'Watermark\':x=w-tw-10:y=h-th-10:fontsize=20:fontcolor=white" output.mp4' },
  { desc: '设置文字阴影', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'Title\':x=10:y=10:fontsize=32:fontcolor=white:shadowcolor=black:shadowx=2:shadowy=2" output.mp4' },
  { desc: '设置文字边框', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'Title\':x=10:y=10:fontsize=32:fontcolor=white:bordercolor=black:borderw=2" output.mp4' },
]

const styleParams = [
  { param: 'fontfile', desc: '字体文件路径（必需，否则可能乱码）' },
  { param: 'fontsize', desc: '字体大小（默认 16）' },
  { param: 'fontcolor', desc: '字体颜色（颜色名称或十六进制）' },
  { param: 'alpha', desc: '透明度（0.0=透明，1.0=不透明）' },
  { param: 'x, y', desc: '文字位置（可以使用表达式，如 x=(w-tw)/2 居中）' },
  { param: 'shadowcolor, shadowx, shadowy', desc: '阴影颜色和偏移' },
  { param: 'bordercolor, borderw', desc: '边框颜色和宽度' },
  { param: 'boxcolor, boxborderw', desc: '文字背景框颜色和边框宽度' },
]

const dynamicExamples = [
  { desc: '显示当前时间码（秒）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'%{pts\\:sek}\':x=10:y=10:fontsize=20:fontcolor=white" output.mp4' },
  { desc: '显示当前时间码（HH:MM:SS）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'%{pts\\:hms}\':x=10:y=10:fontsize=20:fontcolor=white" output.mp4' },
  { desc: '显示当前帧号', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'Frame: %{n}\':x=10:y=10:fontsize=20:fontcolor=white" output.mp4' },
  { desc: '文字从右向左滚动（跑马灯）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'Breaking News\':x=w-t*20:y=H/2:fontsize=32:fontcolor=white" output.mp4' },
  { desc: '文字淡入（前 3 秒）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=text=\'Title\':x=10:y=10:fontsize=32:fontcolor=white:alpha=\'if(lt(t,3),t/3,1)\'" output.mp4' },
  { desc: '使用系统自带字体（Linux）', cmd: 'ffmpeg -i input.mp4 -vf "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text=\'Hello\':x=10:y=10" output.mp4' },
]

const useCases = [
  { use: '台标/Logo', example: 'drawtext=text=\'CCTV\':x=w-tw-10:y=10:fontsize=24:fontcolor=white:alpha=0.8' },
  { use: '时间码显示', example: 'drawtext=text=\'%{pts\\:hms}\':x=10:y=10:fontsize=20:fontcolor=white:boxcolor=black@0.5:boxborderw=5' },
  { use: '滚动新闻', example: 'drawtext=text=\'Breaking News\':x=w-t*30:y=H/2:fontsize=32:fontcolor=yellow' },
  { use: '视频标题', example: 'drawtext=text=\'My Video\':x=(w-tw)/2:y=50:fontsize=40:fontcolor=white:shadowcolor=black:shadowx=2:shadowy=2' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 文字叠加与动态字幕（Drawtext）</h3>
    <p class="summary">使用 drawtext 滤镜在视频上添加动态文字，实现标题、台标、跑马灯、时间码显示等效果。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础用法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'style' }" @click="activeTab = 'style'">样式参数</button>
      <button class="tab-btn" :class="{ active: activeTab === 'dynamic' }" @click="activeTab = 'dynamic'">动态效果</button>
    </div>

    <div v-if="activeTab === 'basic'" class="basic-section">
      <h4>drawtext 基础命令</h4>
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

    <div v-if="activeTab === 'style'" class="style-section">
      <h4>drawtext 样式参数</h4>
      <table>
        <thead><tr><th>参数</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="p in styleParams" :key="p.param">
            <td><code>{{ p.param }}</code></td>
            <td>{{ p.desc }}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">常见应用场景</h4>
      <table>
        <thead><tr><th>用途</th><th>drawtext 参数示例</th></tr></thead>
        <tbody>
          <tr v-for="u in useCases" :key="u.use">
            <td>{{ u.use }}</td>
            <td><code class="cmd">{{ u.example }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'dynamic'" class="dynamic-section">
      <h4>动态文字效果</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in dynamicExamples" :key="ex.cmd">
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
