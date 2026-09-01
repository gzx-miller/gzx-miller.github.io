const e=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'bash' | 'powershell' | 'parallel'>('bash')

const bashExamples = [
  { desc: '批量转换当前目录所有 MP4 为 MKV', cmd: 'for f in *.mp4; do ffmpeg -i "$f" -c copy "\${f%.mp4}.mkv"; done' },
  { desc: '批量转换 MP4 为 H.264 + AAC（指定 CRF）', cmd: 'for f in *.mp4; do ffmpeg -i "$f" -c:v libx264 -crf 23 -c:a aac "\${f%.mp4}_converted.mp4"; done' },
  { desc: '批量压缩视频（720p + CRF 28）', cmd: 'for f in *.mp4; do ffmpeg -i "$f" -vf scale=-2:720 -c:v libx264 -crf 28 -c:a copy "\${f%.mp4}_720p.mp4"; done' },
  { desc: '批量提取音频', cmd: 'for f in *.mp4; do ffmpeg -i "$f" -c:a copy -vn "\${f%.mp4}.aac"; done' },
  { desc: '批量生成缩略图（每视频 1 张）', cmd: 'for f in *.mp4; do ffmpeg -ss 00:00:10 -i "$f" -vframes 1 "\${f%.mp4}.jpg"; done' },
  { desc: '批量处理（保持目录结构）', cmd: 'find . -name "*.mp4" -exec bash -c \\'ffmpeg -i "$0" -c:v libx264 -crf 23 "\${0%.mp4}_converted.mp4"\\' {} \\;' },
]

const powershellExamples = [
  { desc: '批量转换当前目录所有 MP4 为 MKV', cmd: 'Get-ChildItem *.mp4 | ForEach-Object { ffmpeg -i $_.Name -c copy ($_.BaseName + ".mkv") }' },
  { desc: '批量转换 MP4 为 H.264 + AAC', cmd: 'Get-ChildItem *.mp4 | ForEach-Object { ffmpeg -i $_.Name -c:v libx264 -crf 23 -c:a aac ($_.BaseName + "_converted.mp4") }' },
  { desc: '批量压缩视频（720p + CRF 28）', cmd: 'Get-ChildItem *.mp4 | ForEach-Object { ffmpeg -i $_.Name -vf "scale=-2:720" -c:v libx264 -crf 28 -c:a copy ($_.BaseName + "_720p.mp4") }' },
  { desc: '批量提取音频', cmd: 'Get-ChildItem *.mp4 | ForEach-Object { ffmpeg -i $_.Name -c:a copy -vn ($_.BaseName + ".aac") }' },
  { desc: '批量生成缩略图', cmd: 'Get-ChildItem *.mp4 | ForEach-Object { ffmpeg -ss 00:00:10 -i $_.Name -vframes 1 ($_.BaseName + ".jpg") }' },
]

const parallelExamples = [
  { desc: '使用 GNU parallel 并行处理（4 个并行）', cmd: 'parallel -j 4 ffmpeg -i {} -c:v libx264 -crf 23 -c:a aac {.}_converted.mp4 ::: *.mp4' },
  { desc: '使用 xargs 并行处理', cmd: 'ls *.mp4 | xargs -P 4 -I {} bash -c \\'ffmpeg -i "{}" -c:v libx264 -crf 23 -c:a aac "{}.mp4_converted.mp4"\\'' },
  { desc: '使用 background 任务并行（Bash）', cmd: 'for f in *.mp4; do (ffmpeg -i "$f" -c:v libx264 -crf 23 "\${f%.mp4}_converted.mp4" &) ; done; wait' },
]

const batchTips = [
  { tip: '使用 -nostdin 防止 FFmpeg 读取标准输入', detail: '批量处理时，FFmpeg 可能会意外读取标准输入导致脚本卡住。添加 -nostdin 参数可以避免此问题。' },
  { tip: '并行数不宜过高', detail: '并行处理时，并行数应根据 CPU 核心数和磁盘 I/O 能力调整。通常 2-4 个并行即可，过高可能导致系统卡顿。' },
  { tip: '先测试再批量', detail: '批量处理前，先对 1-2 个文件测试命令正确性，确认无误后再执行全量处理。' },
  { tip: '保留原始文件', detail: '批量处理时，建议输出到新文件或新目录，不要直接覆盖原始文件。' },
  { tip: '使用日志记录', detail: '批量处理时，将输出重定向到日志文件，便于排查错误。例如：ffmpeg -i input.mp4 ... > output.log 2>&1' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 批量处理与 Shell 脚本</h3>
    <p class="summary">编写 Shell/PowerShell 脚本批量处理视频文件，掌握遍历、并行处理、错误处理和进度监控。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'bash' }" @click="activeTab = 'bash'">Bash 脚本</button>
      <button class="tab-btn" :class="{ active: activeTab === 'powershell' }" @click="activeTab = 'powershell'">PowerShell</button>
      <button class="tab-btn" :class="{ active: activeTab === 'parallel' }" @click="activeTab = 'parallel'">并行处理</button>
    </div>

    <div v-if="activeTab === 'bash'" class="bash-section">
      <h4>Bash 批量处理脚本</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in bashExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'powershell'" class="powershell-section">
      <h4>PowerShell 批量处理脚本</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in powershellExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'parallel'" class="parallel-section">
      <h4>并行处理示例</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in parallelExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top:24px;">
      <h4>批量处理注意事项</h4>
      <div v-for="t in batchTips" :key="t.tip" class="tip-card">
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
`;export{e as default};
