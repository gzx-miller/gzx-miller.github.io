<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef, watch } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)
const rafRef = shallowRef<number>(0)

const zoom = ref(1.5)
const filterMode = ref<'NEAREST' | 'LINEAR'>('NEAREST')
const mipmapLevel = ref(0)
const showMipmapChain = ref(true)

const vertexShaderSrc = `
attribute vec3 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUV = aUV;
}`

const fragmentShaderSrc = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;
uniform float uZoom;
uniform int uMipLevel;
uniform int uShowChain;
void main() {
  vec2 centered = (vUV - 0.5) / uZoom + 0.5;
  vec2 clamped = clamp(centered, 0.0, 1.0);
  if (uShowChain > 0 && uZoom > 1.2) {
    float mipFloat = float(uMipLevel);
    vec2 mipUV = vec2(clamped.x, clamped.y);
    gl_FragColor = texture2D(uTexture, mipUV);
    float levelIntensity = 0.15 + 0.05 * mipFloat;
    gl_FragColor.rgb += vec3(levelIntensity, levelIntensity * 0.5, 0.0);
  } else {
    gl_FragColor = texture2D(uTexture, clamped);
  }
}`

const glslSnippet = computed(() =>
  `// 过滤模式对比
// NEAREST: 取最近像素，像素质感
// gl_FragColor = texelFetch(sampler, ivec2(uv * size), 0);

// LINEAR: 双线性插值，平滑
gl_FragColor = texture2D(sampler, uv);

// Mipmap 自动选层 (GPU 根据屏幕纹理尺寸)`
)

type Mat4 = Float32Array

function createQuadVertices(): Float32Array {
  return new Float32Array([
    -1, -1, 0, 0, 0,
     1, -1, 0, 1, 0,
     1,  1, 0, 1, 1,
    -1, -1, 0, 0, 0,
     1,  1, 0, 1, 1,
    -1,  1, 0, 0, 1,
  ])
}

function createMipmapTexture(gl: WebGLRenderingContext, size: number): WebGLTexture | null {
  const tex = gl.createTexture()
  if (!tex) return null
  gl.bindTexture(gl.TEXTURE_2D, tex)

  const levelCount = Math.log2(size) + 1
  for (let level = 0; level < levelCount; level++) {
    const levelSize = size / Math.pow(2, level)
    const data = new Uint8Array(levelSize * levelSize * 4)
    for (let y = 0; y < levelSize; y++) {
      for (let x = 0; x < levelSize; x++) {
        const i = (y * levelSize + x) * 4
        const cx = x / levelSize
        const cy = y / levelSize
        data[i] = Math.floor(255 * cx)
        data[i + 1] = Math.floor(255 * cy)
        data[i + 2] = Math.floor(180 + 75 * Math.sin(level * 0.7))
        data[i + 3] = 255
      }
    }
    gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, levelSize, levelSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
  }

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  if (filterMode.value === 'NEAREST') {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  }

  return tex
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let positionLoc: number = -1
let uvLoc: number = -1
let uTexLoc: WebGLUniformLocation | null = null
let uZoomLoc: WebGLUniformLocation | null = null
let uMipLevelLoc: WebGLUniformLocation | null = null
let uShowChainLoc: WebGLUniformLocation | null = null
let quadBuffer: WebGLBuffer | null = null
let texture: WebGLTexture | null = null

function applyFilterMode() {
  if (!gl || !texture) return
  gl.bindTexture(gl.TEXTURE_2D, texture)
  if (filterMode.value === 'NEAREST') {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  }
}

watch(filterMode, () => applyFilterMode())

function render() {
  if (!gl || !program) return

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0.12, 0.09, 0.06, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(uTexLoc, 0)
  gl.uniform1f(uZoomLoc, zoom.value)
  gl.uniform1i(uMipLevelLoc, mipmapLevel.value)
  gl.uniform1i(uShowChainLoc, showMipmapChain.value ? 1 : 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 20, 0)
  gl.enableVertexAttribArray(uvLoc)
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 20, 12)

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  rafRef.value = requestAnimationFrame(render)
}

function resizeCanvas() {
  if (!canvasRef.value || !gl) return
  const rect = canvasRef.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvasRef.value.width = rect.width * dpr
  canvasRef.value.height = rect.height * dpr
}

onMounted(() => {
  if (!canvasRef.value) return
  gl = canvasRef.value.getContext('webgl') as WebGLRenderingContext
  glRef.value = gl
  if (!gl) {
    console.error('WebGL not supported')
    return
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)
  if (!vs || !fs) return

  program = gl.createProgram()
  if (!program) return
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

  positionLoc = gl.getAttribLocation(program, 'aPosition')
  uvLoc = gl.getAttribLocation(program, 'aUV')
  uTexLoc = gl.getUniformLocation(program, 'uTexture')
  uZoomLoc = gl.getUniformLocation(program, 'uZoom')
  uMipLevelLoc = gl.getUniformLocation(program, 'uMipLevel')
  uShowChainLoc = gl.getUniformLocation(program, 'uShowChain')

  quadBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, createQuadVertices(), gl.STATIC_DRAW)

  texture = createMipmapTexture(gl, 256)

  resizeCanvas()
  rafRef.value = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (rafRef.value) cancelAnimationFrame(rafRef.value)
  if (gl && program) gl.deleteProgram(program)
  if (gl && quadBuffer) gl.deleteBuffer(quadBuffer)
  if (gl && texture) gl.deleteTexture(texture)
})
</script>

<template>
  <div class="demo-card">
    <h3>纹理过滤与 Mipmap</h3>

    <div class="layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" class="gl-canvas" />
      </div>

      <div class="controls">
        <fieldset>
          <legend>缩放控制</legend>
          <label>缩放：{{ zoom.toFixed(2) }}x
            <input type="range" min="0.5" max="6" step="0.05" v-model.number="zoom" />
          </label>
          <p class="hint">放大查看像素级过滤差异</p>
        </fieldset>

        <fieldset>
          <legend>过滤模式</legend>
          <div class="btn-group">
            <button
              :class="{ active: filterMode === 'NEAREST' }"
              @click="filterMode = 'NEAREST'">NEAREST</button>
            <button
              :class="{ active: filterMode === 'LINEAR' }"
              @click="filterMode = 'LINEAR'">LINEAR</button>
          </div>
        </fieldset>

        <fieldset>
          <legend>Mipmap</legend>
          <label>手动层级：{{ mipmapLevel }}
            <input type="range" min="0" max="8" step="1" v-model.number="mipmapLevel" />
          </label>
          <label class="toggle">
            <input type="checkbox" v-model="showMipmapChain" />
            高亮 Mipmap 链
          </label>
        </fieldset>
      </div>
    </div>

    <div class="info-section">
      <div class="info-block">
        <h4>🎓 GLSL 核心代码</h4>
        <pre class="mini-code">{{ glslSnippet }}</pre>
      </div>
      <div class="info-block">
        <h4>📊 Mipmap 链</h4>
        <div class="mipmap-chain">
          <div
            v-for="level in 6"
            :key="level"
            class="mip-level"
            :class="{ active: mipmapLevel >= level - 1 }"
            :style="{ width: (100 - (level - 1) * 16) + '%' }">
            <span>Level {{ level - 1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>💡 核心概念：</strong></p>
      <ul>
        <li><code>NEAREST</code>：取最近像素，像素质感，性能高</li>
        <li><code>LINEAR</code>：双线性插值，边缘平滑</li>
        <li>Mipmap 是预计算的缩小版本，纹理缩小时自动选用</li>
        <li><code>LINEAR_MIPMAP_LINEAR</code>：三线性过滤，质量最佳</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 16px;
}

@media (max-width: 720px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.canvas-wrap {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #1a1210;
}

.gl-canvas {
  display: block;
  width: 100%;
  height: 340px;
}

.controls {
  display: grid;
  gap: 12px;
  align-content: start;
}

fieldset {
  padding: 12px;
  gap: 8px;
}

legend {
  color: var(--chestnut);
  font-weight: 700;
  font-size: 13px;
  padding: 0 6px;
}

label {
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: var(--muted);
}

input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
}

.hint {
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--muted);
}

.btn-group {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.btn-group button {
  flex: 1;
  padding: 6px 10px;
  font-size: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-group button.active {
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  color: #fff;
  border-color: transparent;
}

.toggle {
  display: flex !important;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text) !important;
}

.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 720px) {
  .info-section {
    grid-template-columns: 1fr;
  }
}

.info-block {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  background: var(--surface-soft);
}

.info-block h4 {
  margin: 0 0 8px;
  color: var(--chestnut);
  font-size: 13px;
}

.mini-code {
  margin: 0;
  padding: 10px;
  border-radius: 6px;
  background: rgba(123, 53, 29, 0.08);
  color: var(--chestnut);
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
}

.mipmap-chain {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 0;
}

.mip-level {
  height: 18px;
  border-radius: 4px;
  background: rgba(123, 53, 29, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--muted);
  transition: all 0.3s ease;
}

.mip-level.active {
  background: linear-gradient(90deg, var(--leaf-red), var(--leaf-orange));
  color: #fff;
}

.tips-box {
  border-left: 3px solid var(--leaf-orange);
  padding: 12px 14px;
  border-radius: 6px;
  background: rgba(246, 193, 90, 0.12);
}

.tips-box p {
  margin: 0 0 6px;
  color: var(--chestnut);
}

.tips-box ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.7;
}

.tips-box code {
  background: rgba(123, 53, 29, 0.1);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
}

[data-theme='dark'] .canvas-wrap {
  background: #1a1210;
  border-color: var(--border);
}

[data-theme='dark'] .info-block {
  background: rgba(42, 30, 24, 0.6);
  border-color: var(--border);
}

[data-theme='dark'] .mini-code {
  background: rgba(246, 193, 90, 0.08);
  color: var(--chestnut);
}

[data-theme='dark'] .btn-group button {
  background: rgba(55, 40, 32, 0.9);
  color: var(--muted);
  border-color: rgba(246, 193, 90, 0.2);
}

[data-theme='dark'] .btn-group button:hover {
  background: rgba(74, 52, 40, 0.95);
  color: var(--chestnut);
}

[data-theme='dark'] .mip-level {
  background: rgba(246, 193, 90, 0.1);
}

[data-theme='dark'] .tips-box {
  background: rgba(246, 193, 90, 0.08);
  border-left-color: var(--leaf-orange);
}
</style>