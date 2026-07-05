<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'algorithms' | 'hdr' | 'advanced'>('algorithms')

const algorithms = [
  { name: 'bilinear (默认)', speed: '⚡ 快', quality: '⚠️ 一般', suitable: '缩小', note: '双线性插值，速度最快' },
  { name: 'bicubic', speed: '⚡⚡', quality: '✅ 好', suitable: '缩小/放大', note: '双三次插值，质量与速度平衡' },
  { name: 'lanczos', speed: '🐢 慢', quality: '✅ 最好', suitable: '放大', note: 'Lanczos 插值，放大质量最好' },
  { name: 'spline', speed: '🐢', quality: '✅ 很好', suitable: '放大', note: '样条插值，质量接近 lanczos' },
  { name: 'neighbor', speed: '⚡⚡ 极快', quality: '⚠️ 差', suitable: '像素艺术', note: '最近邻插值，保留像素锐度' },
  { name: 'gaussian', speed: '🐢', quality: '⚠️ 模糊', suitable: '特殊效果', note: '高斯插值，产生模糊效果' },
]

const hdrExamples = [
  { desc: '10-bit 内容缩放（保持位深）', cmd: 'ffmpeg -i input.mkv -vf scale=1920:1080 -pix_fmt yuv420p10le output.mkv' },
  { desc: 'HDR 内容缩放（指定色彩空间）', cmd: 'ffmpeg -i input_hdr.mp4 -vf "scale=1920:1080:flags=lanczos:out_color_matrix=bt2020nc:out_range=tv" -pix_fmt yuv420p10le -color_primaries bt2020 -color_trc smpte2084 output_hdr.mp4' },
  { desc: '使用 zscale 滤镜（专业级）', cmd: 'ffmpeg -i input_hdr.mp4 -vf "zscale=w=1920:h=1080:f=lanczos:m=bt2020:p=bt2020:r=tv,format=yuv420p10le" -color_primaries bt2020 -color_trc smpte2084 output_hdr.mp4' },
  { desc: 'HDR → SDR 转换（需要色调映射）', cmd: 'ffmpeg -i input_hdr.mp4 -vf "zscale=t=linear:npl=203,zscale=p=bt709:tonemap=clip,zscale=m=bt709:r=tv,format=yuv420p" -color_primaries bt709 -color_trc bt709 output_sdr.mp4' },
]

const advancedExamples = [
  { desc: '指定滤镜参数（lanczos + 参数）', cmd: 'ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=lanczos" output.mp4' },
  { desc: '使用 force_original_aspect_ratio（FFmpeg 3.0+）', cmd: 'ffmpeg -i input.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" output.mp4' },
  { desc: '保持宽高比并限制最大尺寸', cmd: 'ffmpeg -i input.mp4 -vf "scale=\'min(1920,iw)\':\'min(1080,ih)\':force_original_aspect_ratio=decrease" output.mp4' },
  { desc: '使用 full_chroma_inp 和 full_chroma_intp（更好的色度处理）', cmd: 'ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=lanczos:full_chroma_inp=1:full_chroma_intp=1" output.mp4' },
  { desc: '加速缩放（使用多线程）', cmd: 'ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=lanczos" -threads 8 output.mp4' },
]

const comparisonExample = `# 对比不同缩放算法的质量
# 原图（4K）→ 720p（缩小）
ffmpeg -i input_4k.mp4 -vf "scale=1280:720:flags=bilinear" bilinear.mp4
ffmpeg -i input_4k.mp4 -vf "scale=1280:720:flags=bicubic" bicubic.mp4
ffmpeg -i input_4k.mp4 -vf "scale=1280:720:flags=lanczos" lanczos.mp4

# 原图（480p）→ 1080p（放大，质量差异更明显）
ffmpeg -i input_480p.mp4 -vf "scale=1920:1080:flags=neighbor" neighbor.mp4  # 像素化
ffmpeg -i input_480p.mp4 -vf "scale=1920:1080:flags=bilinear" bilinear_up.mp4  # 模糊
ffmpeg -i input_480p.mp4 -vf "scale=1920:1080:flags=lanczos" lanczos_up.mp4  # 最好`
</script>

<template>
  <div class="demo-card">
    <h3>🌰 高级缩放与宽高比处理</h3>
    <p class="summary">掌握缩放算法选择、色彩空间感知缩放、HDR 内容缩放等高级缩放技术。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'algorithms' }" @click="activeTab = 'algorithms'">缩放算法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'hdr' }" @click="activeTab = 'hdr'">HDR 缩放</button>
      <button class="tab-btn" :class="{ active: activeTab === 'advanced' }" @click="activeTab = 'advanced'">高级用法</button>
    </div>

    <div v-if="activeTab === 'algorithms'" class="algorithms-section">
      <h4>缩放算法对比</h4>
      <table>
        <thead><tr><th>算法</th><th>速度</th><th>质量</th><th>适用场景</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="a in algorithms" :key="a.name">
            <td><code>{{ a.name }}</code></td>
            <td>{{ a.speed }}</td>
            <td>{{ a.quality }}</td>
            <td>{{ a.suitable }}</td>
            <td><small>{{ a.note }}</small></td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:16px;">
        <h4>算法对比命令</h4>
        <pre><code>{{ comparisonExample }}</code></pre>
      </div>
    </div>

    <div v-if="activeTab === 'hdr'" class="hdr-section">
      <h4>HDR 内容缩放</h4>
      <p>HDR 内容缩放时需要特别注意保持位深和色彩空间参数，否则可能导致色偏或色带。</p>
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

    <div v-if="activeTab === 'advanced'" class="advanced-section">
      <h4>高级缩放命令</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in advancedExamples" :key="ex.cmd">
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
pre {
  background: rgba(0,0,0,0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}
pre code { color: #7fff7f; line-height: 1.6; white-space: pre-wrap; }
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
p { line-height: 1.6; }
</style>
