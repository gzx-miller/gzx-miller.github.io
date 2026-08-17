<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)
const rafRef = shallowRef<number>(0)

const blendFactor = ref(0.5)
const blendMode = ref<'MIX' | 'ADD' | 'MULTIPLY' | 'ALPHA'>('MIX')
const rotation = ref(0.3)
const autoRotate = ref(true)

const vertexShaderSrc = `
attribute vec3 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
uniform mat4 uMVP;
void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);
  vUV = aUV;
}`

const fragmentShaderSrc = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uBaseTex;
uniform sampler2D uOverlayTex;
uniform float uBlendFactor;
uniform int uBlendMode;
void main() {
  vec4 baseColor = texture2D(uBaseTex, vUV);
  vec4 overlayColor = texture2D(uOverlayTex, vUV);

  if (uBlendMode == 0) {
    gl_FragColor = mix(baseColor, overlayColor, uBlendFactor);
  } else if (uBlendMode == 1) {
    gl_FragColor = baseColor + overlayColor * uBlendFactor;
  } else if (uBlendMode == 2) {
    gl_FragColor = baseColor * mix(1.0, overlayColor.rgb, uBlendFactor);
  } else {
    gl_FragColor = vec4(
      mix(baseColor.r, overlayColor.r, uBlendFactor * overlayColor.a),
      mix(baseColor.g, overlayColor.g, uBlendFactor * overlayColor.a),
      mix(baseColor.b, overlayColor.b, uBlendFactor * overlayColor.a),
      baseColor.a
    );
  }
}`

const glslSnippet = computed(() =>
  `// 多纹理采样与混合
vec4 base = texture2D(uBaseTex, vUV);
vec4 overlay = texture2D(uOverlayTex, vUV);

// 按权重混合
gl_FragColor = mix(base, overlay, uBlendFactor);

// 纹理单元绑定
// gl.activeTexture(gl.TEXTURE0); gl.bindTexture(..., baseTex);
// gl.activeTexture(gl.TEXTURE1); gl.bindTexture(..., overlayTex);
// gl.uniform1i(uBaseTex, 0);
// gl.uniform1i(uOverlayTex, 1);`
)

const blendModes = [
  { value: 'MIX', label: '混合 (Mix)', desc: 'base * (1-t) + overlay * t' },
  { value: 'ADD', label: '叠加 (Add)', desc: 'base + overlay * t' },
  { value: 'MULTIPLY', label: '相乘 (Multiply)', desc: 'base * (1 + overlay * t)' },
  { value: 'ALPHA', label: 'Alpha 混合', desc: '按 overlay.a 进行 alpha 混合' },
] as const

const currentBlendDesc = computed(() => {
  const mode = blendModes.find(m => m.value === blendMode.value)
  return mode?.desc ?? ''
})

type Mat4 = Float32Array

function mat4Identity(): Mat4 {
  const m = new Float32Array(16)
  m[0] = 1; m[5] = 1; m[10] = 1; m[15] = 1
  return m
}

function mat4Perspective(fovy: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  const m = new Float32Array(16)
  m[0] = f / aspect; m[5] = f
  m[10] = (far + near) * nf; m[11] = -1
  m[14] = 2 * far * near * nf
  return m
}

function mat4LookAt(eye: number[], center: number[], up: number[]): Mat4 {
  let zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2]
  let zl = Math.hypot(zx, zy, zz); zx /= zl; zy /= zl; zz /= zl
  let xx = up[1] * zz - up[2] * zy
  let xy = up[2] * zx - up[0] * zz
  let xz = up[0] * zy - up[1] * zx
  let xl = Math.hypot(xx, xy, xz) || 1; xx /= xl; xy /= xl; xz /= xl
  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx
  const m = new Float32Array(16)
  m[0] = xx; m[1] = yx; m[2] = zx
  m[4] = xy; m[5] = yy; m[6] = zy
  m[8] = xz; m[9] = yz; m[10] = zz
  m[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2])
  m[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2])
  m[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2])
  m[15] = 1
  return m
}

function mat4Multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[i * 4 + j] =
        a[i * 4 + 0] * b[0 * 4 + j] +
        a[i * 4 + 1] * b[1 * 4 + j] +
        a[i * 4 + 2] * b[2 * 4 + j] +
        a[i * 4 + 3] * b[3 * 4 + j]
    }
  }
  return out
}

function mat4RotateY(angle: number): Mat4 {
  const c = Math.cos(angle), s = Math.sin(angle)
  const m = mat4Identity()
  m[0] = c; m[2] = -s; m[8] = s; m[10] = c
  return m
}

function createCubeVertices(): Float32Array {
  const s = 0.7
  const positions: number[] = []
  const faces = [
    { n: [0, 0, 1], idx: [[-s,-s,s],[s,-s,s],[s,s,s],[-s,-s,s],[s,s,s],[-s,s,s]] },
    { n: [0, 0, -1], idx: [[s,-s,-s],[-s,-s,-s],[-s,s,-s],[s,-s,-s],[-s,s,-s],[s,s,-s]] },
    { n: [0, 1, 0], idx: [[-s,s,s],[s,s,s],[s,s,-s],[-s,s,s],[s,s,-s],[-s,s,-s]] },
    { n: [0, -1, 0], idx: [[-s,-s,-s],[s,-s,-s],[s,-s,s],[-s,-s,-s],[s,-s,s],[-s,-s,s]] },
    { n: [1, 0, 0], idx: [[s,-s,s],[s,-s,-s],[s,s,-s],[s,-s,s],[s,s,-s],[s,s,s]] },
    { n: [-1, 0, 0], idx: [[-s,-s,-s],[-s,-s,s],[-s,s,s],[-s,-s,-s],[-s,s,s],[-s,s,-s]] },
  ]
  const uvs = [[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]]
  for (const face of faces) {
    for (let i = 0; i < 6; i++) {
      const v = face.idx[i]
      const uv = uvs[i]
      positions.push(v[0], v[1], v[2], uv[0], uv[1])
    }
  }
  return new Float32Array(positions)
}

function createBaseTexture(gl: WebGLRenderingContext): WebGLTexture | null {
  const size = 128
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const cx = (x / size) * 4
      const cy = (y / size) * 4
      const checker = (Math.floor(cx) + Math.floor(cy)) % 2 === 0
      data[i] = checker ? 200 : 140
      data[i + 1] = checker ? 130 : 90
      data[i + 2] = checker ? 60 : 50
      data[i + 3] = 255
    }
  }
  return createTextureFromData(gl, data, size)
}

function createOverlayTexture(gl: WebGLRenderingContext): WebGLTexture | null {
  const size = 128
  const data = new Uint8Array(size * size * 4)
  const cx = size / 2
  const cy = size / 2
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const dx = (x - cx) / (size / 2)
      const dy = (y - cy) / (size / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      const alpha = Math.max(0, 1 - dist)
      data[i] = 240
      data[i + 1] = 160
      data[i + 2] = 60
      data[i + 3] = Math.floor(alpha * 255)
    }
  }
  return createTextureFromData(gl, data, size)
}

function createTextureFromData(gl: WebGLRenderingContext, data: Uint8Array, size: number): WebGLTexture | null {
  const tex = gl.createTexture()
  if (!tex) return null
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
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
let uMVPLoc: WebGLUniformLocation | null = null
let uBaseTexLoc: WebGLUniformLocation | null = null
let uOverlayTexLoc: WebGLUniformLocation | null = null
let uBlendFactorLoc: WebGLUniformLocation | null = null
let uBlendModeLoc: WebGLUniformLocation | null = null
let cubeBuffer: WebGLBuffer | null = null
let baseTexture: WebGLTexture | null = null
let overlayTexture: WebGLTexture | null = null
let lastTime = 0
let animTime = 0

const blendModeMap: Record<string, number> = { MIX: 0, ADD: 1, MULTIPLY: 2, ALPHA: 3 }

function render(time: number) {
  if (!gl || !program) return
  const dt = lastTime ? (time - lastTime) / 1000 : 0
  lastTime = time
  if (autoRotate.value) {
    animTime += dt
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0.12, 0.09, 0.06, 1)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.useProgram(program)

  const aspect = gl.canvas.width / gl.canvas.height
  const proj = mat4Perspective((45 * Math.PI) / 180, aspect, 0.1, 100)
  const view = mat4LookAt([0, 0, 3.5], [0, 0, 0], [0, 1, 0])
  const model = mat4RotateY(rotation.value + animTime * 0.4)
  const mv = mat4Multiply(proj, view)
  const mvp = mat4Multiply(mv, model)
  gl.uniformMatrix4fv(uMVPLoc, false, mvp)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, baseTexture)
  gl.uniform1i(uBaseTexLoc, 0)

  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, overlayTexture)
  gl.uniform1i(uOverlayTexLoc, 1)

  gl.uniform1f(uBlendFactorLoc, blendFactor.value)
  gl.uniform1i(uBlendModeLoc, blendModeMap[blendMode.value])

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer)
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 20, 0)
  gl.enableVertexAttribArray(uvLoc)
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 20, 12)

  gl.drawArrays(gl.TRIANGLES, 0, 36)

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
  uMVPLoc = gl.getUniformLocation(program, 'uMVP')
  uBaseTexLoc = gl.getUniformLocation(program, 'uBaseTex')
  uOverlayTexLoc = gl.getUniformLocation(program, 'uOverlayTex')
  uBlendFactorLoc = gl.getUniformLocation(program, 'uBlendFactor')
  uBlendModeLoc = gl.getUniformLocation(program, 'uBlendMode')

  cubeBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, createCubeVertices(), gl.STATIC_DRAW)

  baseTexture = createBaseTexture(gl)
  overlayTexture = createOverlayTexture(gl)

  resizeCanvas()
  rafRef.value = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (rafRef.value) cancelAnimationFrame(rafRef.value)
  if (gl && program) gl.deleteProgram(program)
  if (gl && cubeBuffer) gl.deleteBuffer(cubeBuffer)
  if (gl && baseTexture) gl.deleteTexture(baseTexture)
  if (gl && overlayTexture) gl.deleteTexture(overlayTexture)
})
</script>

<template>
  <div class="demo-card">
    <h3>多纹理与混合</h3>

    <div class="layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" class="gl-canvas" />
      </div>

      <div class="controls">
        <fieldset>
          <legend>混合控制</legend>
          <label>混合因子：{{ blendFactor.toFixed(2) }}
            <input type="range" min="0" max="1" step="0.01" v-model.number="blendFactor" />
          </label>
          <p class="hint">0 = 纯底层纹理，1 = 纯叠加纹理</p>
        </fieldset>

        <fieldset>
          <legend>混合模式</legend>
          <div class="btn-group">
            <button
              v-for="mode in blendModes"
              :key="mode.value"
              :class="{ active: blendMode === mode.value }"
              @click="blendMode = mode.value">
              {{ mode.label }}
            </button>
          </div>
          <p class="hint">{{ currentBlendDesc }}</p>
        </fieldset>

        <fieldset>
          <legend>显示</legend>
          <label class="toggle">
            <input type="checkbox" v-model="autoRotate" />
            自动旋转
          </label>
          <label>旋转：{{ rotation.toFixed(2) }}
            <input type="range" min="-3.14" max="3.14" step="0.05" v-model.number="rotation" />
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
        <h4>📊 纹理单元绑定</h4>
        <table class="unit-table">
          <thead>
            <tr><th>单元</th><th>纹理</th><th>Sampler</th></tr>
          </thead>
          <tbody>
            <tr><td>TEXTURE0</td><td>棋盘底色</td><td>uBaseTex</td></tr>
            <tr><td>TEXTURE1</td><td>圆形叠加</td><td>uOverlayTex</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>💡 核心概念：</strong></p>
      <ul>
        <li>多张纹理绑定到不同的纹理单元 (TEXTURE0, TEXTURE1, ...)</li>
        <li>着色器中每个 sampler 对应一个独立的纹理单元</li>
        <li>混合因子控制两张纹理的权重比例</li>
        <li>Alpha 混合需要启用 <code>gl.BLEND</code> 并设置混合函数</li>
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
  line-height: 1.5;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.btn-group button {
  flex: 1;
  min-width: 45%;
  padding: 6px 8px;
  font-size: 11px;
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

.unit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.unit-table th {
  background: rgba(123, 53, 29, 0.1);
  color: var(--chestnut);
  padding: 6px 8px;
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.unit-table td {
  padding: 6px 8px;
  border-bottom: 1px solid rgba(123, 53, 29, 0.1);
  color: var(--text);
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

[data-theme='dark'] .unit-table th {
  background: rgba(246, 193, 90, 0.1);
}

[data-theme='dark'] .unit-table td {
  border-bottom-color: rgba(246, 193, 90, 0.1);
}

[data-theme='dark'] .tips-box {
  background: rgba(246, 193, 90, 0.08);
  border-left-color: var(--leaf-orange);
}
</style>