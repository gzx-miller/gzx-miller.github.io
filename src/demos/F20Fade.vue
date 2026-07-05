<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'video' | 'audio' | 'xfade'>('video')

const videoFadeExamples = [
  { desc: '视频淡入（前 2 秒）', cmd: 'ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=2" -c:a copy output.mp4' },
  { desc: '视频淡出（最后 2 秒）', cmd: 'ffmpeg -i input.mp4 -vf "fade=t=out:st=58:d=2" -c:a copy output.mp4' },
  { desc: '视频淡入 + 淡出', cmd: 'ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=2,fade=t=out:st=58:d=2" -c:a copy output.mp4' },
  { desc: '淡入淡出 + 黑场颜色', cmd: 'ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=2:color=black,fade=t=out:st=58:d=2:color=black" -c:a copy output.mp4' },
  { desc: '淡入淡出到白色（闪白效果）', cmd: 'ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=1:color=white" -c:a copy output.mp4' },
]

const audioFadeExamples = [
  { desc: '音频淡入（前 3 秒）', cmd: 'ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=3" -c:v copy output.mp4' },
  { desc: '音频淡出（最后 3 秒）', cmd: 'ffmpeg -i input.mp4 -af "afade=t=out:st=57:d=3" -c:v copy output.mp4' },
  { desc: '音频淡入 + 淡出', cmd: 'ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=3,afade=t=out:st=57:d=3" -c:v copy output.mp4' },
  { desc: '使用 volume 滤镜实现淡入', cmd: 'ffmpeg -i input.mp4 -af "volume=enable=\'lte(t,3)\':volume=\'t/3\'" -c:v copy output.mp4' },
  { desc: '音频淡出到指定电平', cmd: 'ffmpeg -i input.mp4 -af "afade=t=out:st=55:d=5:curve=quarter_sine" -c:v copy output.mp4' },
]

const xfadeExamples = [
  { desc: '两个视频之间的淡入淡出转场', cmd: 'ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]xfade=transition=fade:duration=1:offset=5[v]" -map "[v]" -map "[0:a]" output.mp4' },
  { desc: '使用擦除转场（从左向右）', cmd: 'ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]xfade=transition=wipeleft:duration=1:offset=5[v]" -map "[v]" output.mp4' },
  { desc: '使用圆形展开转场', cmd: 'ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]xfade=transition=circleopen:duration=1:offset=5[v]" -map "[v]" output.mp4' },
  { desc: '多个视频连续转场', cmd: 'ffmpeg -i input1.mp4 -i input2.mp4 -i input3.mp4 -filter_complex "[0:v][1:v]xfade=transition=fade:duration=1:offset=5[v1];[v1][2:v]xfade=transition=fade:duration=1:offset=10[v]" -map "[v]" output.mp4' },
]

const fadeCurves = [
  { name: 'tri', desc: '线性（默认）' },
  { name: 'qsin', desc: '四分之一正弦' },
  { name: 'hsin', desc: '半正弦' },
  { name: 'esin', desc: '指数正弦' },
  { name: 'hthr', desc: '双曲三次方' },
  { name: 'qu5', desc: '五次' },
  { name: 'iqsin', desc: '反四分之一正弦' },
]

const xfadeTransitions = [
  'fade', 'wipeleft', 'wiperight', 'wipeup', 'wipedown', 'slideleft', 'slideright', 'slideup', 'slidedown',
  'circleopen', 'circleclose', 'rectcrop', 'dissolve', 'pixelize', 'radial', 'hrslice', 'vtslice',
  'hblur', 'fadeblack', 'fadewhite', 'cubestrip', 'zoomin', 'fadefast', 'fadeslow',
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 淡入淡出与转场效果</h3>
    <p class="summary">使用 fade 滤镜实现视频和音频的淡入淡出效果，掌握基础转场和多轨道淡入淡出协调。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'video' }" @click="activeTab = 'video'">视频淡入淡出</button>
      <button class="tab-btn" :class="{ active: activeTab === 'audio' }" @click="activeTab = 'audio'">音频淡入淡出</button>
      <button class="tab-btn" :class="{ active: activeTab === 'xfade' }" @click="activeTab = 'xfade'">xfade 转场</button>
    </div>

    <div v-if="activeTab === 'video'" class="video-section">
      <h4>视频淡入淡出（fade 滤镜）</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in videoFadeExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'audio'" class="audio-section">
      <h4>音频淡入淡出（afade 滤镜）</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in audioFadeExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">淡入淡出曲线（curve 参数）</h4>
      <table>
        <thead><tr><th>曲线名称</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="c in fadeCurves" :key="c.name">
            <td><code>{{ c.name }}</code></td>
            <td>{{ c.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'xfade'" class="xfade-section">
      <h4>xfade 转场滤镜（需要相同编码参数）</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in xfadeExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">可用转场效果（transition 参数）</h4>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
        <code v-for="t in xfadeTransitions" :key="t" style="background:rgba(255,255,255,0.05);padding:4px 8px;border-radius:4px;font-size:0.85em;">{{ t }}</code>
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
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
</style>
