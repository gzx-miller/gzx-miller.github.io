const t=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'external' | 'embed' | 'burn'>('external')

const externalExamples = [
  { desc: '查看文件中的字幕流', cmd: 'ffprobe -v error -select_streams s -show_streams input.mkv' },
  { desc: '复制外挂字幕流（不重新编码）', cmd: 'ffmpeg -i input.mkv -c copy -c:s copy output.mkv' },
  { desc: '添加外挂 SRT 字幕', cmd: 'ffmpeg -i input.mp4 -i subtitle.srt -c copy -c:s mov_text output.mp4' },
  { desc: '添加外挂 ASS 字幕（MKV 容器）', cmd: 'ffmpeg -i input.mkv -i subtitle.ass -c copy -c:s ass output.mkv' },
  { desc: '选择特定字幕流（多语言场景）', cmd: 'ffmpeg -i input.mkv -map 0:v -map 0:a -map 0:s:0 -c copy output.mkv' },
]

const embedExamples = [
  { desc: '将 SRT 字幕嵌入 MKV 容器', cmd: 'ffmpeg -i input.mkv -i subtitle.srt -c copy -c:s srt output.mkv' },
  { desc: '将 ASS 字幕嵌入 MKV 容器', cmd: 'ffmpeg -i input.mkv -i subtitle.ass -c copy -c:s ass output.mkv' },
  { desc: '嵌入多语言字幕', cmd: 'ffmpeg -i input.mp4 -i zh.srt -i en.srt -map 0 -map 1 -map 2 -c copy -c:s mov_text -metadata:s:s:0 language=chi -metadata:s:s:1 language=eng output.mp4' },
  { desc: '查看嵌入字幕的元数据', cmd: 'ffprobe -v error -show_streams -select_streams s input.mkv' },
]

const burnExamples = [
  { desc: '烧录 SRT 字幕（硬字幕）', cmd: 'ffmpeg -i input.mp4 -vf subtitles=subtitle.srt output.mp4' },
  { desc: '烧录 ASS 字幕（支持样式）', cmd: 'ffmpeg -i input.mp4 -vf subtitles=subtitle.ass output.mp4' },
  { desc: '烧录视频内嵌字幕流（第 0 个字幕流）', cmd: 'ffmpeg -i input.mkv -vf subtitles=input.mkv output.mp4' },
  { desc: '指定字幕编码（中文 SRT 常用）', cmd: 'ffmpeg -i input.mp4 -vf "subtitles=filename=subtitle.srt:charenc=UTF-8" output.mp4' },
  { desc: '调整字幕样式（大小、位置）', cmd: 'ffmpeg -i input.mp4 -vf "subtitles=subtitle.ass:force_style=\\'Fontsize=24,PrimaryColour=&Hffffff&\\'" output.mp4' },
]

const subtitleFormats = [
  { format: 'SRT', ext: '.srt', type: '文本', style: '❌', note: '最简单，时间轴 + 文本，无样式' },
  { format: 'ASS/SSA', ext: '.ass', type: '文本', style: '✅', note: '支持丰富样式、定位、动画效果' },
  { format: 'VobSub', ext: '.idx+.sub', type: '图像', style: '⚠️ 固定', note: 'DVD 字幕格式，图像形式，无法修改样式' },
  { format: 'WebVTT', ext: '.vtt', type: '文本', style: '⚠️ CSS', note: 'Web 字幕格式，支持 CSS 样式' },
  { format: 'TTML', ext: '.ttml', type: 'XML', style: '✅', note: 'XML 格式，支持丰富样式' },
]

const tips = [
  'SRT 文件必须使用 UTF-8 编码，否则中文会乱码。可以使用 Notepad++ 或 iconv 转换编码。',
  '烧录字幕（Hardsub）后无法移除，且需要重新编码，耗时较长。建议保留原始文件和外挂字幕。',
  'MP4 容器对字幕支持有限，通常使用 mov_text 编码。MKV 容器对字幕支持最好。',
  '使用 subtitles 滤镜需要 FFmpeg 编译时启用了 libass 支持。可以通过 ffmpeg -filters | grep subtitles 检查。',
  '对于多语言字幕，建议使用 MKV 容器，可以通过播放器选择字幕轨道。',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 字幕处理与烧录</h3>
    <p class="summary">掌握外挂字幕、内嵌字幕和烧录字幕（Hardsub）三种字幕处理方式。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'external' }" @click="activeTab = 'external'">外挂字幕</button>
      <button class="tab-btn" :class="{ active: activeTab === 'embed' }" @click="activeTab = 'embed'">内嵌字幕</button>
      <button class="tab-btn" :class="{ active: activeTab === 'burn' }" @click="activeTab = 'burn'">烧录字幕</button>
    </div>

    <div v-if="activeTab === 'external'" class="external-section">
      <h4>外挂字幕操作</h4>
      <p>外挂字幕是独立的文件（如 <code>video.mp4</code> + <code>subtitle.srt</code>），播放时加载，可随时开关和切换。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in externalExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'embed'" class="embed-section">
      <h4>内嵌字幕操作</h4>
      <p>内嵌字幕是将字幕流封装进容器（如 MKV、MP4），播放时可以选择开启/关闭，但字幕流是独立的，不会渲染到画面上。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in embedExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'burn'" class="burn-section">
      <h4>烧录字幕（Hardsub）</h4>
      <p>烧录字幕是将字幕渲染到视频画面上，生成的新视频包含字幕，无法关闭。适合上传到不支持外挂字幕的平台（如早期 YouTube）。</p>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in burnExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top:24px;">
      <h4>字幕格式对比</h4>
      <table>
        <thead><tr><th>格式</th><th>扩展名</th><th>类型</th><th>支持样式</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="f in subtitleFormats" :key="f.format">
            <td><code>{{ f.format }}</code></td>
            <td><code>{{ f.ext }}</code></td>
            <td>{{ f.type }}</td>
            <td>{{ f.style }}</td>
            <td><small>{{ f.note }}</small></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">注意事项</h4>
      <div v-for="tip in tips" :key="tip" class="tip-card">
        <p>{{ tip }}</p>
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
  padding: 12px 16px;
  margin-bottom: 8px;
  border-left: 3px solid #6a5acd;
  font-size: 0.9em;
  line-height: 1.6;
}
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
</style>
`;export{t as default};
