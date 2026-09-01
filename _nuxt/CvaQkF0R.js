const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'basics' | 'hdr' | 'conversion'>('basics')

const colorSpaces = [
  { name: 'BT.601 (SD)', standard: '标清', range: '有限/全', usage: '标清电视 (480p/576p)', note: '较旧标准' },
  { name: 'BT.709 (HD)', standard: '高清', range: '有限', usage: '高清电视 (720p/1080p)', note: '最常用' },
  { name: 'BT.2020 (UHD)', standard: '超高清', range: '有限', usage: '4K/8K 电视', note: 'HDR 基础' },
  { name: 'sRGB', standard: '网络标准', range: '全', usage: '网页、PC 显示', note: '与 BT.709 类似' },
  { name: 'DCI-P3', standard: '数字影院', range: '全', usage: '影院投影、高端显示器', note: '色域更广' },
  { name: 'SMPTE 2084 (PQ)', standard: 'HDR', range: '有限', usage: 'HDR10', note: '感知量化' },
  { name: 'ARIB STD-B67 (HLG)', standard: 'HDR', range: '有限', usage: 'HDR 广播', note: '混合对数伽马' },
]

const bitDepthInfo = [
  { depth: '8-bit', pixels: 'yuv420p', colors: '16,777,216', banding: '可能出现', note: '最常见，SDR 标准' },
  { depth: '10-bit', pixels: 'yuv420p10le', colors: '1,073,741,824', banding: '极少', note: '高端 SDR、HDR 标准' },
  { depth: '12-bit', pixels: 'yuv420p12le', colors: '68,719,476,736', banding: '几乎无', note: '专业制作' },
]

const hdrExamples = [
  { desc: '查看视频是否为 HDR', cmd: 'ffprobe -v error -select_streams v:0 -show_entries stream=color_space,color_transfer,color_primaries -of default=noprint_wrappers=1 input.mp4' },
  { desc: '编码 10-bit HDR 视频 (HDR10)', cmd: 'ffmpeg -i input.mp4 -c:v libx265 -crf 22 -pix_fmt yuv420p10le -color_primaries bt2020 -color_trc smpte2084 -colorspace 9 output_hdr.mp4' },
  { desc: '将 HDR 转为 SDR (色调映射)', cmd: 'ffmpeg -i input_hdr.mp4 -vf zscale=t=linear:npl=203,zscale=p=bt709,tonemap=clip,zscale=m=bt709:r=tv,format=yuv420p -c:v libx264 -crf 23 output_sdr.mp4' },
  { desc: '将 SDR 转为 HDR (需要色调映射逆向)', cmd: '# 注意：SDR 转 HDR 会损失质量，不建议\\nffmpeg -i input_sdr.mp4 -c:v libx265 -crf 22 -pix_fmt yuv420p10le -color_primaries bt2020 -color_trc smpte2084 -colorspace 9 output_fake_hdr.mp4' },
  { desc: '使用 zscale 滤镜转换色彩空间', cmd: 'ffmpeg -i input.mp4 -vf "zscale=p=bt709:t=bt709:m=bt709:r=tv,format=yuv420p" -c:v libx264 output.mp4' },
]

const conversionExamples = [
  { desc: 'BT.601 → BT.709 (标清转高清)', cmd: 'ffmpeg -i input_601.mp4 -vf "colorspace=all=bt709:range=tv:ispace=bt601:irange=tv" -c:v libx264 output_709.mp4' },
  { desc: 'BT.709 → BT.2020 (高清转 4K)', cmd: 'ffmpeg -i input_709.mp4 -vf "colorspace=all=bt2020:range=tv:ispace=bt709:irange=tv" -c:v libx265 -pix_fmt yuv420p10le output_2020.mp4' },
  { desc: '标记颜色元数据 (BT.709)', cmd: 'ffmpeg -i input.mp4 -color_primaries bt709 -color_trc bt709 -colorspace 1 -c:v libx264 output.mp4' },
  { desc: '标记颜色元数据 (BT.2020 + PQ)', cmd: 'ffmpeg -i input.mp4 -color_primaries bt2020 -color_trc smpte2084 -colorspace 9 -c:v libx265 -pix_fmt yuv420p10le output.mp4' },
  { desc: '限制范围 (TV) vs 全范围 (PC)', cmd: 'ffmpeg -i input.mp4 -vf "colorspace=range=tv:irange=pc" -c:v libx264 output.mp4' },
]

const tips = [
  'HDR 内容必须使用 10-bit 或更高色深编码，否则会出现严重色带。',
  '将 HDR 转为 SDR 需要色调映射（Tone Mapping），直接使用 colorspace 滤镜可能导致色偏。',
  '使用 zscale 滤镜（基于 zimg 库）可以提供更专业的色彩空间转换，需要编译时启用。',
  'HDR10 使用静态元数据（MaxCLL、MaxFALL），HDR10+ 和 Dolby Vision 使用动态元数据。',
  '播放 HDR 内容需要支持 HDR 的显示器和播放器，否则画面会过曝或颜色异常。',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 色彩空间与 HDR 处理</h3>
    <p class="summary">理解色彩空间（BT.601、BT.709、BT.2020）和色深（8-bit、10-bit）的概念，掌握 SDR 与 HDR 内容的处理和转换。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'basics' }" @click="activeTab = 'basics'">基础概念</button>
      <button class="tab-btn" :class="{ active: activeTab === 'hdr' }" @click="activeTab = 'hdr'">HDR 处理</button>
      <button class="tab-btn" :class="{ active: activeTab === 'conversion' }" @click="activeTab = 'conversion'">色彩转换</button>
    </div>

    <div v-if="activeTab === 'basics'" class="basics-section">
      <h4>色彩空间标准</h4>
      <table>
        <thead><tr><th>标准</th><th>类型</th><th>范围</th><th>用途</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="c in colorSpaces" :key="c.name">
            <td><code>{{ c.name }}</code></td>
            <td>{{ c.standard }}</td>
            <td>{{ c.range }}</td>
            <td>{{ c.usage }}</td>
            <td><small>{{ c.note }}</small></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">色深对比</h4>
      <table>
        <thead><tr><th>色深</th><th>像素格式</th><th>颜色数</th><th>色带</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="b in bitDepthInfo" :key="b.depth">
            <td><code>{{ b.depth }}</code></td>
            <td><code>{{ b.pixels }}</code></td>
            <td>{{ b.colors }}</td>
            <td>{{ b.banding }}</td>
            <td><small>{{ b.note }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'hdr'" class="hdr-section">
      <h4>HDR 处理命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in hdrExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'conversion'" class="conversion-section">
      <h4>色彩空间转换命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in conversionExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
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
`;export{n as default};
