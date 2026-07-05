<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'check' | 'nvenc' | 'qsv'>('check')

const checkCommands = [
  { desc: '查看可用的硬件加速器', cmd: 'ffmpeg -hwaccels' },
  { desc: '查看可用的编码器', cmd: 'ffmpeg -encoders | grep -E "nvenc|qsv|amf|videotoolbox|vaapi"' },
  { desc: '查看可用的解码器', cmd: 'ffmpeg -decoders | grep -E "cuda|qsv|videotoolbox|vaapi"' },
  { desc: '查看 NVIDIA GPU 信息（需要驱动安装）', cmd: 'nvidia-smi' },
  { desc: '测试 NVENC 是否可用', cmd: 'ffmpeg -i input.mp4 -c:v h264_nvenc -f null -' },
]

const nvencExamples = [
  { desc: 'H.264 NVENC 编码（最快）', cmd: 'ffmpeg -i input.mp4 -c:v h264_nvenc -preset p4 -profile:v main output.mp4' },
  { desc: 'H.265/HEVC NVENC 编码（更小文件）', cmd: 'ffmpeg -i input.mp4 -c:v hevc_nvenc -preset p4 -profile:v main output.mp4' },
  { desc: 'NVENC 指定码率（3 Mbps）', cmd: 'ffmpeg -i input.mp4 -c:v h264_nvenc -b:v 3M -maxrate 3M output.mp4' },
  { desc: 'NVENC 使用 CBR 模式', cmd: 'ffmpeg -i input.mp4 -c:v h264_nvenc -rc cbr -b:v 3M output.mp4' },
  { desc: 'NVENC 使用 VBR 模式', cmd: 'ffmpeg -i input.mp4 -c:v h264_nvenc -rc vbr -b:v 3M -maxrate 4M output.mp4' },
  { desc: 'NVENC 指定 GPU 设备（多 GPU）', cmd: 'ffmpeg -i input.mp4 -c:v h264_nvenc -gpu 0 output.mp4' },
]

const qsvExamples = [
  { desc: 'H.264 QSV 编码（Intel 核显）', cmd: 'ffmpeg -i input.mp4 -c:v h264_qsv -preset veryslow output.mp4' },
  { desc: 'H.265/HEVC QSV 编码', cmd: 'ffmpeg -i input.mp4 -c:v hevc_qsv -preset veryslow output.mp4' },
  { desc: 'QSV 指定码率', cmd: 'ffmpeg -i input.mp4 -c:v h264_qsv -b:v 3M output.mp4' },
  { desc: 'QSV 使用硬件解码（完整加速）', cmd: 'ffmpeg -hwaccel qsv -c:v h264_qsv -i input.mp4 -c:v h264_qsv output.mp4' },
]

const videotoolboxExamples = [
  { desc: 'H.264 VideoToolbox 编码（macOS）', cmd: 'ffmpeg -i input.mp4 -c:v h264_videotoolbox -b:v 3M output.mp4' },
  { desc: 'H.265/HEVC VideoToolbox 编码（macOS）', cmd: 'ffmpeg -i input.mp4 -c:v hevc_videotoolbox -b:v 3M output.mp4' },
  { desc: '指定编码质量（0-100，越高越好）', cmd: 'ffmpeg -i input.mp4 -c:v h264_videotoolbox -q:v 65 output.mp4' },
]

const encoderComparison = [
  { encoder: 'libx264 (CPU)', speed: '🐢 慢', quality: '✅ 最好', note: '兼容性最好，质量最高' },
  { encoder: 'h264_nvenc (NVIDIA)', speed: '⚡ 极快', quality: '⚠️ 略逊', note: '需要 NVIDIA GPU（GTX 10+）' },
  { encoder: 'h264_qsv (Intel)', speed: '⚡ 极快', quality: '⚠️ 略逊', note: '需要 Intel 核显（6代+）' },
  { encoder: 'h264_videotoolbox (Apple)', speed: '⚡ 极快', quality: '⚠️ 略逊', note: '需要 macOS 和 Apple Silicon/AMD GPU' },
  { encoder: 'h264_amf (AMD)', speed: '⚡ 极快', quality: '⚠️ 略逊', note: '需要 AMD GPU（RX 400+）' },
]
</script>

<template>
  <div class="demo-card">
    <h3>🌰 硬件加速编码与解码</h3>
    <p class="summary">掌握使用 GPU 进行视频编码和解码的硬件加速技术，包括 NVIDIA NVENC、Intel QSV、AMD VCE 和 Apple VideoToolbox。</p>

    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'check' }" @click="activeTab = 'check'">检测硬件</button>
      <button class="tab-btn" :class="{ active: activeTab === 'nvenc' }" @click="activeTab = 'nvenc'">NVENC</button>
      <button class="tab-btn" :class="{ active: activeTab === 'qsv' }" @click="activeTab = 'qsv'">QSV</button>
    </div>

    <div v-if="activeTab === 'check'" class="check-section">
      <h4>检测可用的硬件加速</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in checkCommands" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'nvenc'" class="nvenc-section">
      <h4>NVIDIA NVENC 编码示例</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in nvencExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">其他硬件编码器</h4>
      <table>
        <thead><tr><th>编码器</th><th>速度</th><th>质量</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="e in encoderComparison" :key="e.encoder">
            <td><code>{{ e.encoder }}</code></td>
            <td>{{ e.speed }}</td>
            <td>{{ e.quality }}</td>
            <td><small>{{ e.note }}</small></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'qsv'" class="qsv-section">
      <h4>Intel QSV 编码示例</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in qsvExamples" :key="ex.cmd">
            <td>{{ ex.desc }}</td>
            <td><code class="cmd">{{ ex.cmd }}</code></td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top:20px;">Apple VideoToolbox 编码示例（macOS）</h4>
      <table>
        <thead><tr><th>用途</th><th>命令</th></tr></thead>
        <tbody>
          <tr v-for="ex in videotoolboxExamples" :key="ex.cmd">
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
h4 { color: #9f9fff; margin: 16px 0 8px 0; }
</style>
