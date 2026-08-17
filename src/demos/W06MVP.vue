<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)
const rafRef = shallowRef<number>(0)

const rotX = ref(0.5)
const rotY = ref(0.8)
const rotZ = ref(0)
const fov = ref(60)
const usePerspective = ref(true)
const autoRotate = ref(true)

const vertexShaderSrc = `
attribute vec3 aPosition;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}`

const fragmentShaderSrc = `
precision mediump float;
uniform vec3 uColor;
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}`

const glslSnippet = computed(() =>
  `// 顶点着色器核心变换
gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
// 即 MVP 矩阵 = Projection × View × Model`
)

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
  m[0] = f / aspect
  m[5] = f
  m[10] = (far + near) * nf
  m[11] = -1
  m[14] = 2 * far * near * nf
  return m
}

function mat4Ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
  const lr = 1 / (left - right)
  const bt = 1 / (bottom - top)
  const nf = 1 / (near - far)
  const m = new Float32Array(16)
  m[0] = -2 * lr
  m[5] = -2 * bt
  m[10] = 2 * nf
  m[12] = (left + right) * lr
  m[13] = (top + bottom) * bt
  m[14] = (far + near) * nf
  m[15] = 1
  return m
}

function mat4LookAt(eye: [number, number, number], center: [number, number, number], up: [number, number, number]): Mat4 {
  const [ex, ey, ez] = eye
  const [cx, cy, cz] = center
  let zx = ex - cx, zy = ey - cy, zz = ez - cz
  let zl = Math.hypot(zx, zy, zz); zx /= zl; zy /= zl; zz /= zl
  let xx = up[1] * zz - up[2] * zy
  let xy = up[2] * zx - up[0] * zz
  let xz = up[0] * zy - up[1] * zx
  let xl = Math.hypot(xx, xy, xz) || 1; xx /= xl; xy /= xl; xz /= xl
  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx
  const m = new Float32Array(16)
  m[0] = xx; m[1] = yx; m[2] = zx; m[3] = 0
  m[4] = xy; m[5] = yy; m[6] = zy; m[7] = 0
  m[8] = xz; m[9] = yz; m[10] = zz; m[11] = 0
  m[12] = -(xx * ex + xy * ey + xz * ez)
  m[13] = -(yx * ex + yy * ey + yz * ez)
  m[14] = -(zx * ex + zy * ey + zz * ez)
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

function mat4RotateX(angle: number): Mat4 {
  const c = Math.cos(angle), s = Math.sin(angle)
  const m = mat4Identity()
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c
  return m
}

function mat4RotateY(angle: number): Mat4 {
  const c = Math.cos(angle), s = Math.sin(angle)
  const m = mat4Identity()
  m[0] = c; m[2] = -s; m[8] = s; m[10] = c
  return m
}

function mat4RotateZ(angle: number): Mat4 {
  const c = Math.cos(angle), s = Math.sin(angle)
  const m = mat4Identity()
  m[0] = c; m[1] = s; m[4] = -s; m[5] = c
  return m
}

function mat4Translate(x: number, y: number, z: number): Mat4 {
  const m = mat4Identity()
  m[12] = x; m[13] = y; m[14] = z
  return m
}

const matrixDisplay = computed(() => {
  const model = computeModel()
  return formatMatrix(model)
})

function formatMatrix(m: Mat4): string {
  const cols = 4
  let result = ''
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < cols; c++) {
      const val = m[c * 4 + r]
      result += val.toFixed(2).padStart(8)
    }
    result += '\n'
  }
  return result
}

function computeModel(): Mat4 {
  let m = mat4Multiply(mat4RotateX(rotX.value), mat4RotateY(rotY.value))
  m = mat4Multiply(m, mat4RotateZ(rotZ.value))
  m = mat4Multiply(mat4Translate(0, 0, 0), m)
  return m
}

function createCubeVertices(): Float32Array {
  const s = 0.6
  return new Float32Array([
    // front
    -s, -s,  s,  s, -s,  s,  s,  s,  s, -s, -s,  s,  s,  s,  s, -s,  s,  s,
    // back
     s, -s, -s, -s, -s, -s, -s,  s, -s,  s, -s, -s, -s,  s, -s,  s,  s, -s,
    // top
    -s,  s,  s,  s,  s,  s,  s,  s, -s, -s,  s,  s,  s,  s, -s, -s,  s, -s,
    // bottom
    -s, -s, -s,  s, -s, -s,  s, -s,  s, -s, -s, -s,  s, -s,  s, -s, -s,  s,
    // right
     s, -s,  s,  s, -s, -s,  s,  s, -s,  s, -s,  s,  s,  s, -s,  s,  s,  s,
    // left
    -s, -s, -s, -s, -s,  s, -s,  s,  s, -s, -s, -s, -s,  s,  s, -s,  s, -s,
  ])
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let positionLoc: number = -1
let uModelLoc: WebGLUniformLocation | null = null
let uViewLoc: WebGLUniformLocation | null = null
let uProjLoc: WebGLUniformLocation | null = null
let uColorLoc: WebGLUniformLocation | null = null
let buffer: WebGLBuffer | null = null
let lastTime = 0
let animTime = 0

function render(time: number) {
  if (!gl || !program) return
  const dt = lastTime ? (time - lastTime) / 1000 : 0
  lastTime = time
  if (autoRotate.value) {
    animTime += dt
    rotY.value = animTime * 0.5
    rotX.value = Math.sin(animTime * 0.3) * 0.5
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0.12, 0.09, 0.06, 1)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.useProgram(program)

  const model = computeModel()
  gl.uniformMatrix4fv(uModelLoc, false, model)

  const view = mat4LookAt([0, 0, 3], [0, 0, 0], [0, 1, 0])
  gl.uniformMatrix4fv(uViewLoc, false, view)

  const aspect = gl.canvas.width / gl.canvas.height
  const fovy = (fov.value * Math.PI) / 180
  const proj = usePerspective.value
    ? mat4Perspective(fovy, aspect, 0.1, 100)
    : mat4Ortho(-2, 2, -2, 2, 0.1, 100)
  gl.uniformMatrix4fv(uProjLoc, false, proj)

  const colors = [
    [0.85, 0.35, 0.15],
    [0.95, 0.55, 0.2],
    [0.75, 0.45, 0.25],
    [0.9, 0.65, 0.3],
    [0.8, 0.4, 0.2],
    [0.88, 0.48, 0.22],
  ]

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0)

  for (let face = 0; face < 6; face++) {
    gl.uniform3f(uColorLoc, colors[face][0], colors[face][1], colors[face][2])
    gl.drawArrays(gl.TRIANGLES, face * 6, 6)
  }

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
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    return
  }

  positionLoc = gl.getAttribLocation(program, 'aPosition')
  uModelLoc = gl.getUniformLocation(program, 'uModel')
  uViewLoc = gl.getUniformLocation(program, 'uView')
  uProjLoc = gl.getUniformLocation(program, 'uProjection')
  uColorLoc = gl.getUniformLocation(program, 'uColor')

  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, createCubeVertices(), gl.STATIC_DRAW)

  resizeCanvas()
  rafRef.value = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (rafRef.value) cancelAnimationFrame(rafRef.value)
  if (gl && program) gl.deleteProgram(program)
  if (gl && buffer) gl.deleteBuffer(buffer)
})
</script>

<template>
  <div class="demo-card">
    <h3>MVP 矩阵与 3D 空间</h3>

    <div class="layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" class="gl-canvas" />
      </div>

      <div class="controls">
        <fieldset>
          <legend>模型旋转</legend>
          <label>X 轴：{{ rotX.toFixed(2) }}
            <input type="range" min="-3.14" max="3.14" step="0.05" v-model.number="rotX" />
          </label>
          <label>Y 轴：{{ rotY.toFixed(2) }}
            <input type="range" min="-3.14" max="3.14" step="0.05" v-model.number="rotY" />
          </label>
          <label>Z 轴：{{ rotZ.toFixed(2) }}
            <input type="range" min="-3.14" max="3.14" step="0.05" v-model.number="rotZ" />
          </label>
        </fieldset>

        <fieldset>
          <legend>投影设置</legend>
          <label>FOV：{{ fov }}°
            <input type="range" min="20" max="120" step="1" v-model.number="fov" />
          </label>
          <div class="btn-group">
            <button
              :class="{ active: usePerspective }"
              @click="usePerspective = true">透视投影</button>
            <button
              :class="{ active: !usePerspective }"
              @click="usePerspective = false">正交投影</button>
          </div>
        </fieldset>

        <fieldset>
          <legend>动画</legend>
          <label class="toggle">
            <input type="checkbox" v-model="autoRotate" />
            自动旋转
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
        <h4>📐 Model 矩阵实时值</h4>
        <pre class="mini-code matrix">{{ matrixDisplay }}</pre>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>💡 核心概念：</strong></p>
      <ul>
        <li><code>Model</code> 矩阵：物体自身坐标 → 世界坐标（旋转、平移、缩放）</li>
        <li><code>View</code> 矩阵：世界坐标 → 相机坐标（相当于把相机移到原点）</li>
        <li><code>Projection</code> 矩阵：相机坐标 → 裁剪坐标（透视/正交投影）</li>
        <li>三者相乘 MVP = Projection × View × Model，是顶点着色器的核心运算</li>
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

.mini-code.matrix {
  font-size: 11px;
  line-height: 1.4;
  letter-spacing: 0;
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

[data-theme='dark'] .tips-box {
  background: rgba(246, 193, 90, 0.08);
  border-left-color: var(--leaf-orange);
}
</style>