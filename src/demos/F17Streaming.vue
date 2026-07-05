<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'rtmp' | 'hls' | 'dash'>('rtmp')

const rtmpExamples = [
  { desc: '基础 RTMP 推流（从文件）', cmd: 'ffmpeg -re -i input.mp4 -c copy -f flv rtmp://server/live/stream' },
  { desc: 'RTMP 推流（重新编码）', cmd: 'ffmpeg -re -i input.mp4 -c:v libx264 -preset ultrafast -c:a aac -f flv rtmp://server/live/stream' },
  { desc: '从摄像头和麦克风推流（Linux）', cmd: 'ffmpeg -f v4l2 -i /dev/video0 -f alsa -i default -c:v libx264 -preset ultrafast -c:a aac -f flv rtmp://server/live/stream' },
  { desc: '从摄像头和麦克风推流（Windows）', cmd: 'ffmpeg -f dshow -i video="Integrated Camera":audio="Microphone" -c:v libx264 -preset ultrafast -c:a aac -f flv rtmp://server/live/stream' },
  { desc: '推流到 YouTube Live', cmd: 'ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -b:v 3000k -c:a aac -b:a 128k -f flv rtmp://a.rtmp.youtube.com/live2/STREAM_KEY' },
  { desc: '多码率 RTMP 推流', cmd: 'ffmpeg -re -i input.mp4 -c:v libx264 -b:v 2000k -c:a aac -f flv rtmp://server/live/stream_2000 -c:v libx264 -b:v 5000k -c:a aac -f flv rtmp://server/live/stream_5000' },
]

const hlsExamples = [
  { desc: '基础 HLS 切片（10 秒片段）', cmd: 'ffmpeg -i input.mp4 -c copy -hls_time 10 -hls_list_size 0 -f hls output.m3u8' },
  { desc: 'HLS 切片（重新编码，5 秒片段）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -hls_time 5 -hls_list_size 0 -f hls output.m3u8' },
  { desc: '多码率 HLS（需要 master playlist）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -b:v 1000k -c:a aac -hls_time 10 -hls_playlist_type vod -f hls output_1000.m3u8 -c:v libx264 -b:v 3000k -c:a aac -hls_time 10 -hls_playlist_type vod -f hls output_3000.m3u8' },
  { desc: 'HLS 直播流（持续生成）', cmd: 'ffmpeg -re -i input.mp4 -c copy -hls_time 6 -hls_list_size 6 -hls_flags delete_segments -f hls live.m3u8' },
  { desc: '生成 HLS 并输出到 HTTP 服务器目录', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -c:a aac -hls_time 10 -hls_list_size 0 -f hls /var/www/html/live/output.m3u8' },
]

const dashExamples = [
  { desc: '基础 DASH 切片', cmd: 'ffmpeg -i input.mp4 -c copy -f dash output.mpd' },
  { desc: 'DASH 切片（重新编码）', cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -f dash output.mpd' },
  { desc: 'DASH 多码率切片', cmd: 'ffmpeg -i input.mp4 -map 0:v -b:v:0 1000k -map 0:v -b:v:1 3000k -map 0:a -c:a aac -f dash output.mpd' },
]

const streamingParams = [
  { param: '-re', desc: '按原始帧率读取输入（推流时必需，否则会过快）' },
  { param: '-f flv', desc: '指定输出格式为 FLV（RTMP 使用）' },
  { param: '-hls_time 10', desc: 'HLS 片段时长（秒）' },
  { param: '-hls_list_size 0', desc: 'HLS 播放列表保留所有片段（点播）；设为正数则只保留最近 N 个片段（直播）' },
  { param: '-hls_flags delete_segments', desc: '直播时删除已不在播放列表中的旧片段' },
  { param: '-hls_playlist_type vod', desc: '生成点播 HLS（添加 #EXT-X-ENDLIST 标签）' },
  { param: '-preset ultrafast', desc: '编码预设（ultrafast 最快但文件大，veryslow 最慢但文件小）' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 流媒体与 RTMP 推流</h3>
    <p class="summary">使用 FFmpeg 进行 RTMP 推流、HLS 切片和 DASH 流式传输，掌握直播和点播的流媒体技术。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'rtmp' }" @click="activeTab = 'rtmp'">RTMP 推流</button>
      <button class="tab-btn" :class="{ active: activeTab === 'hls' }" @click="activeTab = 'hls'">HLS 切片</button>
      <button class="tab-btn" :class="{ active: activeTab === 'dash' }" @click="activeTab = 'dash'">DASH 切片</button>
    </div>

    <div v-if="activeTab === 'rtmp'" class="rtmp-section">
      <h4>RTMP 推流命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in rtmpExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'hls'" class="hls-section">
      <h4>HLS 切片命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in hlsExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'dash'" class="dash-section">
      <h4>DASH 切片命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in dashExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top:24px;">
      <h4>流媒体关键参数说明</h4>
      <table>
        <thead><tr><th>参数</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="p in streamingParams" :key="p.param">
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
</style>
