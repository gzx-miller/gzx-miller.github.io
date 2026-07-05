<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'view' | 'edit' | 'chapter'>('view')

const viewExamples = [
  { desc: '查看所有元数据', cmd: 'ffprobe -v error -show_format -show_streams -show_chapters input.mkv' },
  { desc: '查看容器元数据', cmd: 'ffprobe -v error -show_format -print_format json input.mp4' },
  { desc: '查看元数据标签', cmd: 'ffprobe -v error -show_entries format_tags input.mp4' },
  { desc: '使用 exiftool 查看元数据（更详细）', cmd: 'exiftool input.mp4' },
]

const editExamples = [
  { desc: '添加标题元数据', cmd: 'ffmpeg -i input.mp4 -metadata title="My Video" -c copy output.mp4' },
  { desc: '添加作者元数据', cmd: 'ffmpeg -i input.mp4 -metadata artist="Director Name" -c copy output.mp4' },
  { desc: '添加多个元数据', cmd: 'ffmpeg -i input.mp4 -metadata title="My Video" -metadata artist="Director" -metadata year="2024" -c copy output.mp4' },
  { desc: '复制所有元数据', cmd: 'ffmpeg -i input.mp4 -map_metadata 0 -c copy output.mp4' },
  { desc: '不复制元数据（匿名化）', cmd: 'ffmpeg -i input.mp4 -map_metadata -1 -c copy output.mp4' },
  { desc: '修改语言标签（音频流）', cmd: 'ffmpeg -i input.mp4 -metadata:s:a:0 language=chi -c copy output.mp4' },
]

const chapterExamples = [
  { desc: '创建章节文件（XML 格式）', cmd: '<?xml version="1.0" encoding="UTF-8"?>\n<Chapters>\n  <EditionEntry>\n    <ChapterAtom>\n      <ChapterTimeStart>00:00:00.000</ChapterTimeStart>\n      <ChapterDisplay>\n        <ChapterString>介绍</ChapterString>\n      </ChapterDisplay>\n    </ChapterAtom>\n    <ChapterAtom>\n      <ChapterTimeStart>00:01:30.000</ChapterTimeStart>\n      <ChapterDisplay>\n        <ChapterString>正文</ChapterString>\n      </ChapterDisplay>\n    </ChapterAtom>\n  </EditionEntry>\n</Chapters>' },
  { desc: '将章节嵌入 MKV 文件', cmd: 'mkvmerge -o output.mkv --chapters chapters.xml input.mkv' },
  { desc: '使用 FFmpeg 添加章节（MKV）', cmd: 'ffmpeg -i input.mp4 -i chapters.txt -map_chapters 1 -c copy output.mkv' },
  { desc: '查看 MKV 文件章节', cmd: 'mkvextract chapters input.mkv' },
]

const commonMetadata = [
  { tag: 'title', desc: '标题', container: 'MP4, MKV' },
  { tag: 'artist', desc: '艺术家/导演', container: 'MP4, MKV' },
  { tag: 'album', desc: '专辑/系列', container: 'MP4, MKV' },
  { tag: 'year', desc: '年份', container: 'MP4, MKV' },
  { tag: 'comment', desc: '备注', container: 'MP4, MKV' },
  { tag: 'genre', desc: '类型', container: 'MP4, MKV' },
  { tag: 'language', desc: '语言', container: 'MKV, MP4' },
  { tag: 'encoder', desc: '编码器信息', container: 'MP4, MKV' },
]

const tips = [
  'MP4 容器的元数据存储在 moov atom 中，MKV 容器的元数据存储在 Tags 元素中。',
  '使用 -metadata 添加的元数据在转封装（copy mode）时也会被复制，除非使用 -map_metadata -1 禁用。',
  '章节（Chapters）功能在 MKV 容器中支持最好，MP4 容器支持有限。',
  '对于教学视频，建议添加章节标记，方便观众快速导航到感兴趣的部分。',
  '使用 exiftool 可以查看和编辑更多元数据信息，但需要单独安装。',
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 元数据编辑与章节标记</h3>
    <p class="summary">查看和编辑媒体文件的元数据（标题、作者、版权等），以及添加章节标记实现快速导航。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'view' }" @click="activeTab = 'view'">查看元数据</button>
      <button class="tab-btn" :class="{ active: activeTab === 'edit' }" @click="activeTab = 'edit'">编辑元数据</button>
      <button class="tab-btn" :class="{ active: activeTab === 'chapter' }" @click="activeTab = 'chapter'">章节标记</button>
    </div>

    <div v-if="activeTab === 'view'" class="view-section">
      <h4>查看元数据命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in viewExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'edit'" class="edit-section">
      <h4>编辑元数据命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in editExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">常用元数据标签</h4>
      <table>
        <thead><tr><th>标签</th><th>说明</th><th>支持容器</th></tr></thead>
        <tbody>
          <tr v-for="m in commonMetadata" :key="m.tag">
            <td><code>{{ m.tag }}</code></td>
            <td>{{ m.desc }}</td>
            <td><small>{{ m.container }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'chapter'" class="chapter-section">
      <h4>章节标记处理</h4>
      <table>
        <thead><tr><th>用途</th><th>命令/说明</th></tr></thead>
        <tbody>
          <tr v-for="ex in chapterExamples" :key="ex.desc">
            <td>{{ ex.desc }}</td>
            <td><pre v-if="ex.cmd.includes('<?xml')"><code>{{ ex.cmd }}</code></pre><code v-else class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top:24px;">
      <h4>注意事项</h4>
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
pre {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
  font-size: 0.85em;
}
pre code { color: #7fff7f; line-height: 1.6; white-space: pre-wrap; }
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
</style>
