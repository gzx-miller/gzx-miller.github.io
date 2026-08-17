<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)
const rafRef = shallowRef<number>(0)

const radius = ref(5)
const theta = ref(0.8)
const phi = ref(0.6)
const targetX = ref(0)
const targetY = ref(0)
const targetZ = ref(0)
const autoRotate = ref(false)

const vertexShaderSrc = `
attribute vec3 aPosition;
uniform mat4 uMVP;
void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);
}`

const fragmentShaderSrc = `
precision mediump float;
uniform vec3 uColor;
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}`

const glslSnippet = computed(() =>
  `// 球坐标 → 笛卡尔坐标
camera.x = target.x + r * sin(phi) * cos(theta);
camera.y = target.y + r * cos(phi);
camera.z = target.z + r * sin(phi) * sin(theta);

// View 矩阵
view = lookAt(camera, target, up)`
)

const cameraInfo = computed(() => {
  const cx = targetX.value + radius.value * Math.sin(phi.value) * Math.cos(theta.value)
  const cy = targetY.value + radius.value * Math.cos(phi.value)
  const cz = targetZ.value + radius.value * Math.sin(phi.value) * Math.sin(theta.value)
  return {
    pos: `(${cx.toFixed(2)}, ${cy.toFixed(2)}, ${cz.toFixed(2)})`,
    target: `(${targetX.value.toFixed(1)}, ${targetY.value.toFixed(1)}, ${targetZ.value.toFixed(1)})`,
    radius: radius.value.toFixed(2),
    theta: ((theta.value * 180) / Math.PI).toFixed(0) + '°',
    phi: ((phi.value * 180) / Math.PI).toFixed(0) + '°',
  }
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

function computeCameraPos(): [number, number, number] {
  const x = targetX.value + radius.value * Math.sin(phi.value) * Math.cos(theta.value)
  const y = targetY.value + radius.value * Math.cos(phi.value)
  const z = targetZ.value + radius.value * Math.sin(phi.value) * Math.sin(theta.value)
  return [x, y, z]
}

function createSceneVertices(): Float32Array {
  const positions: number[] = []
  const gridSize = 4
  for (let i = -gridSize; i <= gridSize; i++) {
    positions.push(i, 0, -gridSize, i, 0, gridSize)
    positions.push(-gridSize, 0, i, gridSize, 0, i)
  }
  const s = 0.5
  const cube = (cx: number, cy: number, cz: number) => {
    const v = [
      -s, -s,  s,  s, -s,  s,  s,  s,  s, -s, -s,  s,  s,  s,  s, -s,  s,  s,
       s, -s, -s, -s, -s, -s, -s,  s, -s,  s, -s, -s, -s,  s, -s,  s,  s, -s,
      -s,  s,  s,  s,  s,  s,  s,  s, -s, -s,  s,  s,  s,  s, -s, -s,  s, -s,
      -s, -s, -s,  s, -s, -s,  s, -s,  s, -s, -s, -s,  s, -s,  s, -s, -s,  s,
       s, -s,  s,  s, -s, -s,  s,  s, -s,  s, -s,  s,  s,  s, -s,  s,  s,  s,
      -s, -s, -s, -s, -s,  s, -s,  s,  s, -s, -s, -s, -s,  s,  s, -s,  s, -s,
    ]
    for (let k = 0; k < v.length; k += 3) {
      positions.push(v[k] + cx, v[k + 1] + cy, v[k + 2] + cz)
    }
  }
  cube(0, 0.5, 0)
  cube(2, 0.25, -1)
  cube(-1.5, 0.4, 1.5)
  return new Float32Array(positions)
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
let uMVPLoc: WebGLUniformLocation | null = null
let uColorLoc: WebGLUniformLocation | null = null
let sceneBuffer: WebGLBuffer | null = null
let cubeBuffer: WebGLBuffer | null = null
let lastTime = 0
let animTime = 0
let dragging = false
let lastX = 0
let lastY = 0

function render(time: number) {
  if (!gl || !program) return
  const dt = lastTime ? (time - lastTime) / 1000 : 0
  lastTime = time
  if (autoRotate.value && !dragging) {
    animTime += dt
    theta.value = animTime * 0.3
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0.12, 0.09, 0.06, 1)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.useProgram(program)

  const aspect = gl.canvas.width / gl.canvas.height
  const proj = mat4Perspective((60 * Math.PI) / 180, aspect, 0.1, 100)

  const camPos = computeCameraPos()
  const view = mat4LookAt(camPos, [targetX.value, targetY.value, targetZ.value], [0, 1, 0])

  const mv = mat4Multiply(proj, view)

  const model = mat4RotateY(animTime * 0.2)
  const mvp = mat4Multiply(mv, model)
  gl.uniformMatrix4fv(uMVPLoc, false, mvp)

  gl.bindBuffer(gl.ARRAY_BUFFER, sceneBuffer)
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0)

  gl.uniform3f(uColorLoc, 0.45, 0.3, 0.18)
  gl.drawArrays(gl.LINES, 0, 60)

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer)
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0)

  const colors = [
    [0.85, 0.35, 0.15], [0.95, 0.55, 0.2], [0.75, 0.45, 0.25],
    [0.9, 0.65, 0.3], [0.8, 0.4, 0.2], [0.88, 0.48, 0.22],
  ]
  const cubeCount = 3
  for (let c = 0; c < cubeCount; c++) {
    for (let face = 0; face < 6; face++) {
      gl.uniform3f(uColorLoc, colors[face][0], colors[face][1], colors[face][2])
      gl.drawArrays(gl.TRIANGLES, (c * 6 + face) * 6, 6)
    }
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

function onPointerDown(e: PointerEvent) {
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
  canvasRef.value?.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  lastX = e.clientX
  lastY = e.clientY
  theta.value -= dx * 0.01
  phi.value = Math.max(0.1, Math.min(Math.PI - 0.1, phi.value + dy * 0.01))
}

function onPointerUp() {
  dragging = false
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  radius.value = Math.max(1, Math.min(15, radius.value + e.deltaY * 0.005))
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
  uMVPLoc = gl.getUniformLocation(program, 'uMVP')
  uColorLoc = gl.getUniformLocation(program, 'uColor')

  const sceneData = createSceneVertices()
  sceneBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, sceneBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, sceneData, gl.STATIC_DRAW)

  const cubeData = new Float32Array(sceneData.buffer, 0, 324)
  cubeBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, cubeData, gl.STATIC_DRAW)

  const canvas = canvasRef.value
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointerleave', onPointerUp)
  canvas.addEventListener('wheel', onWheel, { passive: false })

  resizeCanvas()
  rafRef.value = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (rafRef.value) cancelAnimationFrame(rafRef.value)
  const canvas = canvasRef.value
  if (canvas) {
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointerleave', onPointerUp)
    canvas.removeEventListener('wheel', onWheel)
  }
  if (gl && program) gl.deleteProgram(program)
  if (gl && sceneBuffer) gl.deleteBuffer(sceneBuffer)
  if (gl && cubeBuffer) gl.deleteBuffer(cubeBuffer)
})
</script>

<template>
  <div class="demo-card">
    <h3>相机控制与视角</h3>

    <div class="layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" class="gl-canvas" />
        <div class="canvas-hint">拖拽旋转 · 滚轮缩放</div>
      </div>

      <div class="controls">
        <fieldset>
          <legend>球坐标</legend>
          <label>半径 r：{{ radius.toFixed(1) }}
            <input type="range" min="1" max="15" step="0.1" v-model.number="radius" />
          </label>
          <label>方位角 θ：{{ ((theta * 180) / Math.PI).toFixed(0) }}°
            <input type="range" min="-3.14" max="3.14" step="0.05" v-model.number="theta" />
          </label>
          <label>仰角 φ：{{ ((phi * 180) / Math.PI).toFixed(0) }}°
            <input type="range" min="0.1" max="3.04" step="0.05" v-model.number="phi" />
          </label>
        </fieldset>

        <fieldset>
          <legend>观察点</legend>
          <label>目标 X：{{ targetX.toFixed(1) }}
            <input type="range" min="-3" max="3" step="0.1" v-model.number="targetX" />
          </label>
          <label>目标 Y：{{ targetY.toFixed(1) }}
            <input type="range" min="-2" max="3" step="0.1" v-model.number="targetY" />
          </label>
          <label>目标 Z：{{ targetZ.toFixed(1) }}
            <input type="range" min="-3" max="3" step="0.1" v-model.number="targetZ" />
          </label>
        </fieldset>

        <fieldset>
          <legend>动画</legend>
          <label class="toggle">
            <input type="checkbox" v-model="autoRotate" />
            自动环绕
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
        <h4>📐 相机状态</h4>
        <ul class="info-list">
          <li><code>eye</code>: {{ cameraInfo.pos }}</li>
          <li><code>target</code>: {{ cameraInfo.target }}</li>
          <li><code>r</code>: {{ cameraInfo.radius }}</li>
          <li><code>θ</code>: {{ cameraInfo.theta }}</li>
          <li><code>φ</code>: {{ cameraInfo.phi }}</li>
        </ul>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>💡 核心概念：</strong></p>
      <ul>
        <li>轨道相机使用球坐标 (r, θ, φ) 描述相机位置</li>
        <li><code>lookAt(eye, center, up)</code> 构建 View 矩阵</li>
        <li>拖拽旋转：更新 θ 和 φ；滚轮缩放：更新半径 r</li>
        <li>φ 限制在 (0, π) 避免相机翻转</li>
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
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #1a1210;
  cursor: grab;
}

.canvas-wrap:active {
  cursor: grabbing;
}

.gl-canvas {
  display: block;
  width: 100%;
  height: 340px;
}

.canvas-hint {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: rgba(255, 200, 150, 0.7);
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 12px;
  border-radius: 12px;
  pointer-events: none;
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

.info-list {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  line-height: 1.8;
}

.info-list code {
  background: rgba(123, 53, 29, 0.1);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
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

[data-theme='dark'] .info-list code {
  background: rgba(246, 193, 90, 0.1);
}

[data-theme='dark'] .tips-box {
  background: rgba(246, 193, 90, 0.08);
  border-left-color: var(--leaf-orange);
}
</style>