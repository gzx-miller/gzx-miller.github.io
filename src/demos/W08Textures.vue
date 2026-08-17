<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)
const rafRef = shallowRef<number>(0)

const uvTileU = ref(1)
const uvTileV = ref(1)
const uvOffsetU = ref(0)
const uvOffsetV = ref(0)
const showUVOverlay = ref(true)
const rotation = ref(0)

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
uniform sampler2D uTexture;
uniform float uTileU;
uniform float uTileV;
uniform float uOffsetU;
uniform float uOffsetV;
uniform float uShowOverlay;
void main() {
  vec2 uv = vec2(vUV.x * uTileU + uOffsetU, vUV.y * uTileV + uOffsetV);
  vec4 texColor = texture2D(uTexture, uv);
  if (uShowOverlay > 0.5) {
    float gridU = abs(fract(vUV.x * 4.0) - 0.5);
    float gridV = abs(fract(vUV.y * 4.0) - 0.5);
    float grid = step(0.45, max(gridU, gridV));
    texColor.rgb = mix(texColor.rgb, vec3(1.0, 0.85, 0.3), grid * 0.5);
  }
  gl_FragColor = texColor;
}`

const glslSnippet = computed(() =>
  `// UV 坐标映射
vec2 uv = vec2(
  vUV.x * tileU + offsetU,
  vUV.y * tileV + offsetV
);
gl_FragColor = texture2D(uTexture, uv);`
)

const uvInfo = computed(() => ({
  u: uvTileU.value.toFixed(1),
  v: uvTileV.value.toFixed(1),
  ou: uvOffsetU.value.toFixed(2),
  ov: uvOffsetV.value.toFixed(2),
}))

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

function createProceduralTexture(gl: WebGLRenderingContext): WebGLTexture | null {
  const size = 128
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const cx = x / size - 0.5
      const cy = y / size - 0.5
      const dist = Math.sqrt(cx * cx + cy * cy)
      const angle = Math.atan2(cy, cx)
      const r = Math.floor(180 + 60 * Math.sin(dist * 20))
      const g = Math.floor(100 + 80 * Math.cos(angle * 4))
      const b = Math.floor(40 + 40 * dist * 10)
      data[i] = Math.min(255, Math.max(0, r))
      data[i + 1] = Math.min(255, Math.max(0, g))
      data[i + 2] = Math.min(255, Math.max(0, b))
      data[i + 3] = 255
    }
  }
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
let uTexLoc: WebGLUniformLocation | null = null
let uTileULoc: WebGLUniformLocation | null = null
let uTileVLoc: WebGLUniformLocation | null = null
let uOffsetULoc: WebGLUniformLocation | null = null
let uOffsetVLoc: WebGLUniformLocation | null = null
let uShowOverlayLoc: WebGLUniformLocation | null = null
let quadBuffer: WebGLBuffer | null = null
let texture: WebGLTexture | null = null
let lastTime = 0
let animTime = 0

function render(time: number) {
  if (!gl || !program) return
  const dt = lastTime ? (time - lastTime) / 1000 : 0
  lastTime = time
  animTime += dt

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0.12, 0.09, 0.06, 1)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.useProgram(program)

  const aspect = gl.canvas.width / gl.canvas.height
  const proj = mat4Perspective((45 * Math.PI) / 180, aspect, 0.1, 100)
  const view = mat4LookAt([0, 0, 3], [0, 0, 0], [0, 1, 0])
  const model = mat4RotateY(rotation.value + animTime * 0.3)
  const mv = mat4Multiply(proj, view)
  const mvp = mat4Multiply(mv, model)
  gl.uniformMatrix4fv(uMVPLoc, false, mvp)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(uTexLoc, 0)

  gl.uniform1f(uTileULoc, uvTileU.value)
  gl.uniform1f(uTileVLoc, uvTileV.value)
  gl.uniform1f(uOffsetULoc, uvOffsetU.value)
  gl.uniform1f(uOffsetVLoc, uvOffsetV.value)
  gl.uniform1f(uShowOverlayLoc, showUVOverlay.value ? 1 : 0)

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
  uMVPLoc = gl.getUniformLocation(program, 'uMVP')
  uTexLoc = gl.getUniformLocation(program, 'uTexture')
  uTileULoc = gl.getUniformLocation(program, 'uTileU')
  uTileVLoc = gl.getUniformLocation(program, 'uTileV')
  uOffsetULoc = gl.getUniformLocation(program, 'uOffsetU')
  uOffsetVLoc = gl.getUniformLocation(program, 'uOffsetV')
  uShowOverlayLoc = gl.getUniformLocation(program, 'uShowOverlay')

  quadBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, createQuadVertices(), gl.STATIC_DRAW)

  texture = createProceduralTexture(gl)

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
    <h3>2D 纹理与 UV 坐标映射</h3>

    <div class="layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" class="gl-canvas" />
      </div>

      <div class="controls">
        <fieldset>
          <legend>UV 平铺</legend>
          <label>U 平铺：{{ uvTileU.toFixed(1) }}
            <input type="range" min="1" max="8" step="0.1" v-model.number="uvTileU" />
          </label>
          <label>V 平铺：{{ uvTileV.toFixed(1) }}
            <input type="range" min="1" max="8" step="0.1" v-model.number="uvTileV" />
          </label>
        </fieldset>

        <fieldset>
          <legend>UV 偏移</legend>
          <label>U 偏移：{{ uvOffsetU.toFixed(2) }}
            <input type="range" min="0" max="1" step="0.01" v-model.number="uvOffsetU" />
          </label>
          <label>V 偏移：{{ uvOffsetV.toFixed(2) }}
            <input type="range" min="0" max="1" step="0.01" v-model.number="uvOffsetV" />
          </label>
        </fieldset>

        <fieldset>
          <legend>显示</legend>
          <label class="toggle">
            <input type="checkbox" v-model="showUVOverlay" />
            显示 UV 网格叠加
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
        <h4>📐 UV 坐标说明</h4>
        <div class="uv-diagram">
          <div class="uv-square">
            <span class="uv-label u0">U=0</span>
            <span class="uv-label u1">U=1</span>
            <span class="uv-label v0">V=0</span>
            <span class="uv-label v1">V=1</span>
            <span class="uv-origin">(0,0)</span>
          </div>
          <p class="uv-desc">UV 原点在左下角，U 向右，V 向上</p>
        </div>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>💡 核心概念：</strong></p>
      <ul>
        <li>UV 坐标范围 (0,0)~(1,1)，对应纹理的左下角到右上角</li>
        <li>顶点存储 UV 坐标，顶点着色器通过 varying 传递给片段着色器</li>
        <li><code>texture2D(sampler, uv)</code> 在片段着色器中采样纹理颜色</li>
        <li>UV 平铺超出 1 时使用 REPEAT 模式重复纹理</li>
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

.uv-diagram {
  display: grid;
  gap: 8px;
}

.uv-square {
  position: relative;
  width: 120px;
  height: 120px;
  border: 2px solid var(--accent);
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(246, 193, 90, 0.3), rgba(217, 75, 38, 0.2));
  margin: 0 auto;
}

.uv-label {
  position: absolute;
  font-size: 10px;
  color: var(--muted);
  font-weight: 600;
}

.uv-label.u0 { bottom: -18px; left: 0; }
.uv-label.u1 { bottom: -18px; right: 0; }
.uv-label.v0 { top: 50%; left: -24px; transform: rotate(-90deg); transform-origin: right center; }
.uv-label.v1 { top: 50%; right: -24px; transform: rotate(90deg); transform-origin: left center; }

.uv-origin {
  position: absolute;
  bottom: 2px;
  left: 2px;
  font-size: 10px;
  color: var(--accent);
  font-weight: 700;
}

.uv-desc {
  text-align: center;
  font-size: 12px;
  color: var(--muted);
  margin: 4px 0 0;
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

[data-theme='dark'] .uv-square {
  border-color: var(--accent);
  background: linear-gradient(135deg, rgba(246, 193, 90, 0.2), rgba(217, 75, 38, 0.15));
}

[data-theme='dark'] .tips-box {
  background: rgba(246, 193, 90, 0.08);
  border-left-color: var(--leaf-orange);
}
</style>