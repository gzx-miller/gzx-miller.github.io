<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'concepts' | 'install' | 'structure'>('concepts')

const concepts = [
  { 
    term: '容器 (Container)', 
    desc: '封装音视频流、字幕、元数据的文件格式，如 MP4、MKV、AVI、MOV。容器只负责"包装"，不负责压缩。',
    example: 'MP4 容器可以装 H.264 视频 + AAC 音频，也可以装 H.265 视频 + Opus 音频。'
  },
  { 
    term: '编解码器 (Codec)', 
    desc: '用于压缩和解压缩音视频数据的算法。编码器压缩数据，解码器还原数据。常见视频编码：H.264/AVC、H.265/HEVC、VP9、AV1；常见音频编码：AAC、MP3、Opus、FLAC。',
    example: 'H.264 是兼容性最好的视频编码，H.265 同等画质下文件小 50%，但需要更多算力。'
  },
  { 
    term: '流 (Stream)', 
    desc: '容器内的独立数据轨道。一个媒体文件通常包含：1 个视频流、1-多个音频流（不同语言）、0-多个字幕流。使用 ffmpeg -i 可以看到文件中的所有流。',
    example: '流编号从 0 开始：0:0 是第一个视频流，0:1 是第一个音频流，0:2 是第二个音频流（可能是不同语言）。'
  },
  { 
    term: '帧 (Frame)', 
    desc: '视频的最小单位，表示某一时刻的完整画面。帧率（FPS）决定每秒显示多少帧。关键帧（I-frame）可以独立解码，参考帧（P-frame、B-frame）需要依赖其他帧。',
    example: '30 FPS 的视频每秒有 30 帧画面。GOP（Group of Pictures）是一组帧的集合，通常 2-10 秒一个关键帧。'
  },
  { 
    term: '码率 (Bitrate)', 
    desc: '每秒数据量，决定视频质量和文件大小。视频码率通常 1-10 Mbps（1080p），音频码率通常 128-320 Kbps。CBR 恒定码率，VBR 可变码率，CRF 恒定速率因子。',
    example: '一个 10 分钟的 1080p 视频，使用 3 Mbps 码率，文件大小约为 3 × 600 / 8 = 225 MB。'
  },
]

const installMethods = [
  { platform: 'Windows', steps: ['下载 FFmpeg 官方构建版本（https://ffmpeg.org/download.html）', '解压到任意目录（如 C:\\ffmpeg）', '将 bin 目录添加到系统 PATH 环境变量', '打开 CMD 验证：ffmpeg -version'] },
  { platform: 'macOS', steps: ['安装 Homebrew（如未安装）', '运行 brew install ffmpeg', '验证：ffmpeg -version'] },
  { platform: 'Ubuntu/Debian', steps: ['更新软件源：sudo apt update', '安装：sudo apt install ffmpeg', '验证：ffmpeg -version'] },
  { platform: 'CentOS/RHEL', steps: ['安装 EPEL 源：sudo yum install epel-release', '安装：sudo yum install ffmpeg', '验证：ffmpeg -version'] },
]

const commandStructure = {
  basic: 'ffmpeg [全局选项] [输入选项] -i 输入文件 [输出选项] 输出文件',
  examples: [
    { cmd: 'ffmpeg -i input.mp4 output.avi', desc: '最简单：将 MP4 转为 AVI（会重新编码）' },
    { cmd: 'ffmpeg -i input.mp4 -c copy output.mkv', desc: '快速转封装：不重新编码，只改容器格式' },
    { cmd: 'ffmpeg -i input.mp4 -ss 00:01:00 -t 30 output.mp4', desc: '裁剪：从 1 分处开始，截取 30 秒' },
    { cmd: 'ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4', desc: '缩放：将视频调整为 720p' },
  ]
}

const basicCommands = ref(`# 查看 FFmpeg 版本
ffmpeg -version

# 查看媒体文件信息（使用 ffprobe）
ffprobe -v error -show_format -show_streams input.mp4

# 最简单格式转换
ffmpeg -i input.mp4 output.avi

# 快速转封装（不重新编码）
ffmpeg -i input.mp4 -c copy output.mkv

# 查看支持的编码器
ffmpeg -encoders | grep 264

# 查看支持的滤镜
ffmpeg -filters | grep scale`)
</script>

<template>
  <div class="demo-card">
    <h3>🌰 FFmpeg 基础概念与安装</h3>
    <p class="summary">理解容器、编解码器、流等核心概念，掌握 FFmpeg 的安装与基本命令结构。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'concepts' }" @click="activeTab = 'concepts'">核心概念</button>
      <button class="tab-btn" :class="{ active: activeTab === 'install' }" @click="activeTab = 'install'">安装方法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'structure' }" @click="activeTab = 'structure'">命令结构</button>
    </div>

    <div v-if="activeTab === 'concepts'" class="concepts-section">
      <div v-for="c in concepts" :key="c.term" class="concept-card">
        <h4>{{ c.term }}</h4>
        <p>{{ c.desc }}</p>
        <div class="example-box">
          <strong>举例：</strong>{{ c.example }}
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'install'" class="install-section">
      <div v-for="m in installMethods" :key="m.platform" class="install-card">
        <h4>{{ m.platform }}</h4>
        <ol>
          <li v-for="(step, i) in m.steps" :key="i">{{ step }}</li>
        </ol>
      </div>
    </div>

    <div v-if="activeTab === 'structure'" class="structure-section">
      <div class="structure-box">
        <h4>FFmpeg 命令基本结构</h4>
        <code>{{ commandStructure.basic }}</code>
      </div>
      <div class="examples-box">
        <h4>常用命令示例</h4>
        <div v-for="ex in commandStructure.examples" :key="ex.cmd" class="example-item">
          <code>{{ ex.cmd }}</code>
          <p>{{ ex.desc }}</p>
        </div>
      </div>
      <div class="code-preview">
        <h4>基础命令速查</h4>
        <pre><code>{{ basicCommands }}</code></pre>
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
.summary {
  color: #a0a0c0;
  margin-bottom: 16px;
}
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
.concept-card, .install-card {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 3px solid #6a5acd;
}
.concept-card h4, .install-card h4 {
  color: #9f9fff;
  margin: 0 0 8px 0;
}
.example-box {
  background: rgba(106, 90, 205, 0.15);
  border-radius: 6px;
  padding: 10px;
  margin-top: 8px;
  font-size: 0.9em;
  color: #b0b0d0;
}
.structure-box, .examples-box, .code-preview {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}
.structure-box code {
  display: block;
  background: rgba(0,0,0,0.3);
  padding: 10px;
  border-radius: 6px;
  margin-top: 8px;
  color: #7fff7f;
}
.example-item {
  background: rgba(0,0,0,0.2);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
}
.example-item code {
  color: #7fff7f;
  display: block;
  margin-bottom: 4px;
}
.example-item p {
  color: #a0a0c0;
  font-size: 0.9em;
  margin: 0;
}
.code-preview pre {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.85em;
  line-height: 1.6;
}
.code-preview code {
  color: #7fff7f;
}
ol {
  margin: 8px 0;
  padding-left: 20px;
}
li {
  margin-bottom: 6px;
  line-height: 1.6;
}
</style>
