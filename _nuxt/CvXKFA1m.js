const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'ffprobe' | 'format' | 'streams'>('ffprobe')

const ffprobeBasic = \`# 查看媒体文件完整信息
ffprobe -v error -show_format -show_streams input.mp4

# 只显示容器信息
ffprobe -v error -show_format input.mp4

# 只显示第一个视频流信息
ffprobe -v error -select_streams v:0 -show_streams input.mp4

# JSON 格式输出（适合程序解析）
ffprobe -v error -show_format -show_streams -print_format json input.mp4

# 显示所有帧信息（输出量巨大，慎用）
ffprobe -v error -show_frames input.mp4

# 显示数据包信息
ffprobe -v error -show_packets input.mp4\`

const formatInfo = {
  title: '容器信息（-show_format）',
  fields: [
    { name: 'format_name', desc: '容器格式（如 mov,mp4,m4a,3gp,3g2,mj2）' },
    { name: 'duration', desc: '总时长（秒）' },
    { name: 'size', desc: '文件大小（字节）' },
    { name: 'bit_rate', desc: '总码率（bps）' },
    { name: 'nb_streams', desc: '流的数量' },
    { name: 'tags.title', desc: '标题元数据' },
    { name: 'tags.artist', desc: '艺术家元数据' },
    { name: 'tags.encoder', desc: '编码软件信息' },
  ]
}

const videoStreamInfo = {
  title: '视频流信息',
  fields: [
    { name: 'codec_name', desc: '编码格式（h264, hevc, vp9 等）' },
    { name: 'width / height', desc: '分辨率' },
    { name: 'r_frame_rate', desc: '帧率（如 30/1 表示 30 FPS）' },
    { name: 'bit_rate', desc: '视频码率（bps）' },
    { name: 'pix_fmt', desc: '像素格式（yuv420p, yuv422p 等）' },
    { name: 'color_space', desc: '色彩空间（bt709, bt2020nc 等）' },
    { name: 'color_transfer', desc: '传输函数（bt709, smpte2084 等）' },
    { name: 'has_b_frames', desc: '是否有 B 帧' },
    { name: 'profile', desc: '编码档次（High, Main, Baseline 等）' },
    { name: 'level', desc: '编码级别' },
  ]
}

const audioStreamInfo = {
  title: '音频流信息',
  fields: [
    { name: 'codec_name', desc: '编码格式（aac, mp3, opus 等）' },
    { name: 'sample_rate', desc: '采样率（Hz）' },
    { name: 'channels', desc: '声道数' },
    { name: 'channel_layout', desc: '声道布局（stereo, 5.1 等）' },
    { name: 'bit_rate', desc: '音频码率（bps）' },
    { name: 'sample_fmt', desc: '采样格式（fltp, s16p 等）' },
  ]
}

const sampleJsonOutput = \`{
  "format": {
    "filename": "input.mp4",
    "nb_streams": 2,
    "duration": "180.5",
    "size": "135000000",
    "bit_rate": "6000000",
    "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
    "tags": {
      "major_brand": "isom",
      "minor_version": "512",
      "compatible_brands": "isomiso2avc1mp41"
    }
  },
  "streams": [
    {
      "index": 0,
      "codec_name": "h264",
      "codec_type": "video",
      "width": 1920,
      "height": 1080,
      "r_frame_rate": "30/1",
      "bit_rate": "5500000",
      "pix_fmt": "yuv420p"
    },
    {
      "index": 1,
      "codec_name": "aac",
      "codec_type": "audio",
      "sample_rate": "48000",
      "channels": 2,
      "bit_rate": "128000"
    }
  ]
}\`

const practicalCommands = [
  { desc: '获取视频时长（秒）', cmd: 'ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4' },
  { desc: '获取视频分辨率', cmd: 'ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 input.mp4' },
  { desc: '获取视频帧率', cmd: 'ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4' },
  { desc: '获取音频采样率', cmd: 'ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of default=noprint_wrappers=1:nokey=1 input.mp4' },
  { desc: '列出所有流', cmd: 'ffprobe -v error -show_entries stream=index,codec_type,codec_name -of csv=p=0 input.mp4' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 媒体信息分析与 ffprobe</h3>
    <p class="summary">使用 ffprobe 和 FFmpeg 内置分析选项，获取视频/音频的详细信息。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'ffprobe' }" @click="activeTab = 'ffprobe'">ffprobe 基础</button>
      <button class="tab-btn" :class="{ active: activeTab === 'format' }" @click="activeTab = 'format'">容器信息</button>
      <button class="tab-btn" :class="{ active: activeTab === 'streams' }" @click="activeTab = 'streams'">流信息</button>
    </div>

    <div v-if="activeTab === 'ffprobe'" class="ffprobe-section">
      <h4>ffprobe 常用命令</h4>
      <pre><code>{{ ffprobeBasic }}</code></pre>

      <h4 style="margin-top:20px;">实用单行命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="c in practicalCommands" :key="c.desc">
            <td>{{ c.desc }}</td>
            <td><code class="cmd">{{ c.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'format'" class="format-section">
      <h4>{{ formatInfo.title }}</h4>
      <p>使用 <code>-show_format</code> 获取容器层面的信息：</p>
      <table>
        <thead><tr><th>字段</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="f in formatInfo.fields" :key="f.name">
            <td><code>{{ f.name }}</code></td>
            <td>{{ f.desc }}</td>
          </tr>
        </tbody>
      </table>

      <div class="json-preview" style="margin-top:16px;">
        <h4>JSON 输出示例（格式信息部分）</h4>
        <pre><code>{{ sampleJsonOutput }}</code></pre>
      </div>
    </div>

    <div v-if="activeTab === 'streams'" class="streams-section">
      <h4>{{ videoStreamInfo.title }}</h4>
      <table>
        <thead><tr><th>字段</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="f in videoStreamInfo.fields" :key="f.name">
            <td><code>{{ f.name }}</code></td>
            <td>{{ f.desc }}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">{{ audioStreamInfo.title }}</h4>
      <table>
        <thead><tr><th>字段</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="f in audioStreamInfo.fields" :key="f.name">
            <td><code>{{ f.name }}</code></td>
            <td>{{ f.desc }}</td>
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
.json-preview pre {
  font-size: 0.85em;
}
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
</style>
`;export{n as default};
