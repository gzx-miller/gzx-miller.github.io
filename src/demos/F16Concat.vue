<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'protocol' | 'demuxer' | 'filter'>('protocol')

const protocolExamples = [
  { desc: '拼接两个 TS 文件（要求编码参数完全一致）', cmd: 'ffmpeg -i "concat:input1.ts|input2.ts" -c copy output.ts' },
  { desc: '拼接多个 MP4 文件（要求编码参数完全一致）', cmd: 'ffmpeg -i "concat:input1.mp4|input2.mp4" -c copy output.mp4' },
  { note: '⚠️ 协议拼接要求所有输入文件有相同的编码参数（分辨率、帧率、编码格式等），否则会出现画面异常或音视频不同步。' },
]

const demuxerExamples = [
  { desc: '创建文件列表 list.txt', cmd: 'echo file \'input1.mp4\' > list.txt\necho file \'input2.mp4\' >> list.txt' },
  { desc: '使用 concat demuxer 拼接（要求编码参数一致）', cmd: 'ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4' },
  { desc: '指定每个文件的入点和出点', cmd: 'echo file \'input1.mp4\' inpoint 10 outpoint 20 > list.txt\necho file \'input2.mp4\' inpoint 0 outpoint 30 >> list.txt\nffmpeg -f concat -i list.txt -c copy output.mp4' },
  { note: '⚠️ concat demuxer 同样要求所有输入文件有相同的编码参数。如果参数不同，需要使用 concat 滤镜（需重新编码）。' },
]

const filterExamples = [
  { desc: '使用 concat 滤镜拼接（可以不同编码参数，需重新编码）', cmd: 'ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" output.mp4' },
  { desc: '拼接多个视频（n=3 表示 3 个输入）', cmd: 'ffmpeg -i input1.mp4 -i input2.mp4 -i input3.mp4 -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" output.mp4' },
  { desc: '只拼接视频流（无音频）', cmd: 'ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" -map "[v]" output.mp4' },
  { desc: '先统一参数再拼接（推荐工作流）', cmd: 'ffmpeg -i input1.mp4 -vf scale=1920:1080,fps=30 -c:v libx264 -c:a aac temp1.mp4\nffmpeg -i input2.mp4 -vf scale=1920:1080,fps=30 -c:v libx264 -c:a aac temp2.mp4\nffmpeg -f concat -i <(echo -e "file \'temp1.mp4\'\nfile \'temp2.mp4\'") -c copy output.mp4' },
]

const comparisonData = [
  { method: 'concat 协议', reencode: '❌ 不需要', speed: '⚡ 极快', quality: '✅ 无损', flexibility: '❌ 要求编码参数完全一致', suitable: '同参数片段拼接' },
  { method: 'concat demuxer', reencode: '❌ 不需要', speed: '⚡ 极快', quality: '✅ 无损', flexibility: '❌ 要求编码参数完全一致', suitable: '同参数片段拼接（更灵活）' },
  { method: 'concat 滤镜', reencode: '✅ 需要', speed: '🐢 慢', quality: '⚠️ 有损', flexibility: '✅ 可以不同编码参数', suitable: '不同来源视频拼接' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 视频合并与拼接</h3>
    <p class="summary">掌握三种视频拼接方法：concat 协议（无损）、concat 分离器（需编码一致）和 concat 滤镜（需重编码）。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'protocol' }" @click="activeTab = 'protocol'">协议拼接</button>
      <button class="tab-btn" :class="{ active: activeTab === 'demuxer' }" @click="activeTab = 'demuxer'">分离器拼接</button>
      <button class="tab-btn" :class="{ active: activeTab === 'filter' }" @click="activeTab = 'filter'">滤镜拼接</button>
    </div>

    <div v-if="activeTab === 'protocol'" class="protocol-section">
      <h4>concat 协议拼接</h4>
      <p>使用 <code>concat:</code> 协议拼接文件，要求编码参数完全一致，但速度极快（无损）。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in protocolExamples.filter(e => e.cmd)" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
      <div v-for="ex in protocolExamples.filter(e => e.note)" :key="ex.note" class="note-box">
        <p>{{ ex.note }}</p>
      </div>
    </div>

    <div v-if="activeTab === 'demuxer'" class="demuxer-section">
      <h4>concat 分离器拼接</h4>
      <p>使用 <code>-f concat</code> 和文件列表拼接，比协议方式更灵活，但仍要求编码参数一致。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in demuxerExamples.filter(e => e.cmd)" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
      <div v-for="ex in demuxerExamples.filter(e => e.note)" :key="ex.note" class="note-box">
        <p>{{ ex.note }}</p>
      </div>
    </div>

    <div v-if="activeTab === 'filter'" class="filter-section">
      <h4>concat 滤镜拼接</h4>
      <p>使用 <code>concat</code> 滤镜拼接，可以处理不同编码参数的视频，但需要重新编码。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in filterExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top:24px;">
      <h4>三种拼接方法对比</h4>
      <table>
        <thead><tr><th>方法</th><th>需重编码</th><th>速度</th><th>质量</th><th>灵活性</th><th>适用场景</th></tr></thead>
        <tbody>
          <tr v-for="c in comparisonData" :key="c.method">
            <td><code>{{ c.method }}</code></td>
            <td>{{ c.reencode }}</td>
            <td>{{ c.speed }}</td>
            <td>{{ c.quality }}</td>
            <td>{{ c.flexibility }}</td>
            <td><small>{{ c.suitable }}</small></td>
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
.note-box {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  border-left: 3px solid #ffaa00;
}
</style>
