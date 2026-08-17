<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef, watch } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glState = shallowRef<{
  gl: WebGLRenderingContext
  prog: WebGLProgram
  vbo: WebGLBuffer
  rafId: number
  lastTime: number
  frameCount: number
  fpsTime: number
  fpsHistory: number[]
  drawCallHistory: number[]
  bufferMem: number
  textureMem: number
  triangleCount: number
  drawCalls: number
  instancingOn: boolean
  batchingOn: boolean
  vsyncOn: boolean
} | null>(null)

const useInstancing = ref(true)
const useBatching = ref(true)
const vsyncEnabled = ref(true)
const objectCount = ref(300)
const showOptimizations = ref(true)

const fpsHistory = ref<number[]>([])
const drawCallHistory = ref<number[]>([])
const currentFps = ref(0)
const currentDrawCalls = ref(0)
const avgFrameTime = ref(0)
const gpuMemoryMB = ref(0)
const totalTriangles = ref(0)

const vsSource = `
attribute vec3 a_position;
attribute vec3 a_color;
attribute vec3 a_instance_offset;
uniform mat4 u_proj;
uniform mat4 u_view;
varying vec3 v_color;
void main() {
  vec3 pos = a_position + a_instance_offset;
  v_color = a_color;
  gl_Position = u_proj * u_view * vec4(pos, 1.0);
}
`

const fsSource = `
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`

function createShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram | null {
  const vert = createShader(gl, gl.VERTEX_SHADER, vs)
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fs)
  if (!vert || !frag) return null
  const prog = gl.createProgram()
  if (!prog) return null
  gl.attachShader(prog, vert)
  gl.attachShader(prog, frag)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog))
    return null
  }
  return prog
}

function buildTriangleData(count: number, instanced: boolean) {
  const tris = count
  const perTri = instanced ? 6 : 9
  const data = new Float32Array(tris * perTri)
  for (let i = 0; i < tris; i++) {
    const o = i * perTri
    const x = (Math.random() - 0.5) * 8
    const y = (Math.random() - 0.5) * 6
    const z = (Math.random() - 0.5) * 4
    const s = 0.3 + Math.random() * 0.5
    const r = Math.random(), g = Math.random(), b = Math.random()
    if (instanced) {
      data[o + 0] = -s; data[o + 1] = -s; data[o + 2] = 0
      data[o + 3] = r; data[o + 4] = g; data[o + 5] = b
      data[o + 6] = x; data[o + 7] = y; data[o + 8] = z
      data[o + 9] = s; data[o + 10] = -s; data[o + 11] = 0
      data[o + 12] = r; data[o + 13] = g; data[o + 14] = b
      data[o + 15] = x; data[o + 16] = y; data[o + 17] = z
      data[o + 18] = 0; data[o + 19] = s; data[o + 20] = 0
      data[o + 21] = r; data[o + 22] = g; data[o + 23] = b
      data[o + 24] = x; data[o + 25] = y; data[o + 26] = z
    } else {
      data[o + 0] = -s + x; data[o + 1] = -s + y; data[o + 2] = z
      data[o + 3] = r; data[o + 4] = g; data[o + 5] = b
      data[o + 6] = s + x; data[o + 7] = -s + y; data[o + 8] = z
      data[o + 9] = r; data[o + 10] = g; data[o + 11] = b
      data[o + 12] = x; data[o + 13] = s + y; data[o + 14] = z
      data[o + 15] = r; data[o + 16] = g; data[o + 17] = b
    }
  }
  return data
}

function mat4Perspective(fovy: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ])
}

function mat4LookAt(eye: number[], center: number[], up: number[]): Float32Array {
  const [ex, ey, ez] = eye
  const [cx, cy, cz] = center
  let zx = ex - cx, zy = ey - cy, zz = ez - cz
  let zl = Math.sqrt(zx * zx + zy * zy + zz * zz)
  zx /= zl; zy /= zl; zz /= zl
  let xx = up[1] * zz - up[2] * zy
  let xy = up[2] * zx - up[0] * zz
  let xz = up[0] * zy - up[1] * zx
  let xl = Math.sqrt(xx * xx + xy * xy + xz * xz)
  if (xl > 0) { xx /= xl; xy /= xl; xz /= xl }
  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx
  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * ex + xy * ey + xz * ez),
    -(yx * ex + yy * ey + yz * ez),
    -(zx * ex + zy * ey + zz * ez),
    1,
  ])
}

let lastTime = 0
let frameCount = 0
let fpsTimeAccum = 0
let frameTimes: number[] = []

function render(time: number) {
  const state = glState.value
  if (!state) return

  const dt = time - state.lastTime
  state.lastTime = time
  state.frameCount++
  state.fpsTime += dt

  frameTimes.push(dt)
  if (frameTimes.length > 60) frameTimes.shift()
  avgFrameTime.value = Math.round(frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length * 100) / 100

  if (state.fpsTime >= 500) {
    const fpsVal = Math.round((state.frameCount * 1000) / state.fpsTime)
    state.frameCount = 0
    state.fpsTime = 0
    currentFps.value = fpsVal
    fpsHistory.value.push(fpsVal)
    if (fpsHistory.value.length > 30) fpsHistory.value.shift()
  }

  const gl = state.gl
  const canvas = canvasRef.value!
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.09, 0.07, 0.05, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)

  const aspect = canvas.width / canvas.height
  const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100)
  const view = mat4LookAt([0, 2, 8], [0, 0, 0], [0, 1, 0])

  const count = objectCount.value
  const instanced = useInstancing.value
  const batched = useBatching.value

  let drawCalls = 0
  let tris = count

  gl.useProgram(state.prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, state.vbo)

  const stride = instanced ? 27 : 18
  const posLoc = gl.getAttribLocation(state.prog, 'a_position')
  const colLoc = gl.getAttribLocation(state.prog, 'a_color')
  const offLoc = gl.getAttribLocation(state.prog, 'a_instance_offset')

  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, stride * 4, 0)
  gl.enableVertexAttribArray(colLoc)
  gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, stride * 4, 12)

  gl.uniformMatrix4fv(gl.getUniformLocation(state.prog, 'u_proj'), false, proj)
  gl.uniformMatrix4fv(gl.getUniformLocation(state.prog, 'u_view'), false, view)

  if (instanced) {
    gl.enableVertexAttribArray(offLoc)
    gl.vertexAttribPointer(offLoc, 3, gl.FLOAT, false, stride * 4, 24)
    const ext = gl.getExtension('ANGLE_instanced_arrays')
    if (ext) {
      ext.vertexAttribDivisorANGLE(offLoc, 1)
      ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 3, count)
      drawCalls = 1
    } else {
      for (let i = 0; i < count; i++) {
        gl.drawArrays(gl.TRIANGLES, i * 3, 3)
        drawCalls++
      }
    }
  } else if (batched) {
    gl.drawArrays(gl.TRIANGLES, 0, count * 3)
    drawCalls = 1
  } else {
    for (let i = 0; i < count; i++) {
      gl.drawArrays(gl.TRIANGLES, i * 3, 3)
      drawCalls++
    }
  }

  currentDrawCalls.value = drawCalls
  drawCallHistory.value.push(drawCalls)
  if (drawCallHistory.value.length > 30) drawCallHistory.value.shift()

  totalTriangles.value = tris
  gpuMemoryMB.value = Math.round(tris * (instanced ? 27 : 18) * 4 / 1024 / 1024 * 100) / 100

  state.rafId = requestAnimationFrame(render)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: false }) as WebGLRenderingContext
  if (!gl) {
    console.error('WebGL not supported')
    return
  }

  const parent = canvas.parentElement!
  canvas.width = Math.min(parent.clientWidth, 480)
  canvas.height = Math.min(parent.clientWidth, 480)

  const prog = createProgram(gl, vsSource, fsSource)
  if (!prog) return

  const vbo = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)

  const state: any = {
    gl,
    prog,
    vbo,
    rafId: 0,
    lastTime: performance.now(),
    frameCount: 0,
    fpsTime: 0,
  }

  glState.value = state
  state.rafId = requestAnimationFrame(render)
})

onUnmounted(() => {
  const state = glState.value
  if (state) {
    cancelAnimationFrame(state.rafId)
    state.gl.deleteProgram(state.prog)
    state.gl.deleteBuffer(state.vbo)
    state.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
})

function rebuildData() {
  const state = glState.value
  if (!state) return
  const instanced = useInstancing.value
  const data = buildTriangleData(objectCount.value, instanced)
  state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.vbo)
  state.gl.bufferData(state.gl.ARRAY_BUFFER, data, state.gl.DYNAMIC_DRAW)
  if (instanced) {
    const ext = state.gl.getExtension('ANGLE_instanced_arrays')
    if (ext) ext.vertexAttribDivisorANGLE(state.gl.getAttribLocation(state.prog, 'a_instance_offset'), 1)
  }
}

watch([useInstancing, objectCount], () => {
  rebuildData()
})

const checklistItems = computed(() => [
  { id: 'instancing', label: '使用 Instanced Rendering 减少 Draw Call', enabled: useInstancing.value, critical: true },
  { id: 'batching', label: '合批渲染 (Batching) 合并小几何体', enabled: useBatching.value, critical: false },
  { id: 'vao', label: '使用 VAO 缓存属性配置', enabled: true, critical: false },
  { id: 'texture', label: '纹理压缩 (ETC2/S3TC) 减少显存', enabled: true, critical: true },
  { id: 'buffer', label: '避免每帧重建 Buffer', enabled: true, critical: true },
  { id: 'viewport', label: '合理设置视口尺寸', enabled: true, critical: false },
  { id: 'depth', label: '合理使用深度测试', enabled: true, critical: false },
  { id: 'culling', label: '背面剔除 (Backface Culling)', enabled: true, critical: false },
])

const fpsBar = computed(() => {
  const max = Math.max(...fpsHistory.value, 60)
  return fpsHistory.value.map(f => ({ value: f, pct: (f / max) * 100 }))
})

const drawCallBar = computed(() => {
  const max = Math.max(...drawCallHistory.value, objectCount.value)
  return drawCallHistory.value.map(d => ({ value: d, pct: (d / max) * 100 }))
})
</script>

<template>
  <div class="demo-card">
    <h3>🌰 性能优化与调试</h3>
    <p class="summary">实时监控 FPS、Draw Call、GPU 显存。开启/关闭优化策略，观察性能指标的动态变化。</p>

    <div class="demo-layout">
      <div class="left-panel">
        <div class="canvas-wrap">
          <canvas ref="canvasRef"></canvas>
          <div class="fps-badge">{{ currentFps }} FPS</div>
        </div>

        <div class="metrics-grid">
          <div class="metric-card fps-metric">
            <span class="metric-label">FPS</span>
            <span class="metric-value" :class="{ low: currentFps < 30, mid: currentFps >= 30 && currentFps < 50 }">
              {{ currentFps }}
            </span>
          </div>
          <div class="metric-card">
            <span class="metric-label">帧时间</span>
            <span class="metric-value">{{ avgFrameTime.toFixed(1) }}ms</span>
          </div>
          <div class="metric-card" :class="{ warn: currentDrawCalls > 50 }">
            <span class="metric-label">Draw Calls</span>
            <span class="metric-value">{{ currentDrawCalls }}</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">GPU 显存</span>
            <span class="metric-value">{{ gpuMemoryMB.toFixed(2) }}MB</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">三角形</span>
            <span class="metric-value">{{ totalTriangles.toLocaleString() }}</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">对象数</span>
            <span class="metric-value">{{ objectCount }}</span>
          </div>
        </div>

        <div class="history-chart">
          <h5>FPS 趋势</h5>
          <div class="bar-chart">
            <div
              v-for="(b, i) in fpsBar"
              :key="'fps-' + i"
              class="bar fps-bar"
              :style="{ height: b.pct + '%' }"
              :title="b.value + ' FPS'"
            ></div>
          </div>
        </div>

        <div class="history-chart">
          <h5>Draw Call 趋势</h5>
          <div class="bar-chart">
            <div
              v-for="(b, i) in drawCallBar"
              :key="'dc-' + i"
              class="bar dc-bar"
              :style="{ height: b.pct + '%' }"
              :title="b.value + ' Draw Calls'"
            ></div>
          </div>
        </div>
      </div>

      <div class="control-panel">
        <h4>优化开关</h4>

        <label class="control-item checkbox">
          <input type="checkbox" v-model="useInstancing" @change="rebuildData" />
          <span>Instanced Rendering (实例化)</span>
          <small class="hint">将 N 次 Draw Call 合并为 1 次</small>
        </label>

        <label class="control-item checkbox" v-if="!useInstancing">
          <input type="checkbox" v-model="useBatching" @change="rebuildData" />
          <span>CPU 端合批 (Batching)</span>
          <small class="hint">将所有几何体合并到一个大 Buffer</small>
        </label>

        <label class="control-item checkbox">
          <input type="checkbox" v-model="vsyncEnabled" />
          <span>VSync (垂直同步)</span>
          <small class="hint">限制帧率到显示器刷新率</small>
        </label>

        <label class="control-item">
          <span>渲染对象数：{{ objectCount }}</span>
          <input type="range" min="10" max="1000" step="10" v-model.number="objectCount" @change="rebuildData" />
        </label>

        <div class="checklist">
          <h5>优化清单</h5>
          <div
            v-for="item in checklistItems"
            :key="item.id"
            class="check-item"
            :class="{ disabled: !item.enabled, critical: item.critical }"
          >
            <span class="check-icon">{{ item.enabled ? '✅' : '⚠️' }}</span>
            <span class="check-label">{{ item.label }}</span>
          </div>
        </div>

        <div class="info-section">
          <h5>📚 性能要点</h5>
          <ul>
            <li><strong>CPU 瓶颈：</strong>过多 Draw Call → 使用 Instancing / Batching</li>
            <li><strong>GPU 瓶颈：</strong>过高分辨率 / 复杂着色器 → 降低分辨率</li>
            <li><strong>显存瓶颈：</strong>大纹理 / 未压缩 → 使用压缩格式</li>
            <li><strong>数据瓶颈：</strong>频繁 Buffer 更新 → 预分配 + 复用</li>
          </ul>
        </div>

        <div class="code-display">
          <h5>Chrome DevTools 分析命令</h5>
          <pre><code>// 查看 GPU 信息
chrome://gpu

// WebGL 面板
chrome://inspect/#devices

// FPS 监控
performance.now() 差值计算</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  padding: 24px;
}
.summary {
  color: var(--muted);
  margin-bottom: 16px;
  line-height: 1.6;
}
.demo-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 720px) {
  .demo-layout { grid-template-columns: 1fr; }
}
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.canvas-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-soft);
  border-radius: var(--radius);
  overflow: hidden;
}
.canvas-wrap canvas {
  display: block;
  max-width: 100%;
  height: auto;
}
.fps-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--chestnut);
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.metric-card {
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.metric-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
}
.metric-value.low {
  color: #d94b26;
}
.metric-value.mid {
  color: #f08a24;
}
.metric-card.warn {
  border-color: var(--leaf-red);
}
.history-chart {
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
}
.history-chart h5 {
  margin: 0 0 6px;
  font-size: 12px;
  color: var(--muted);
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 40px;
}
.bar {
  flex: 1;
  min-width: 4px;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
}
.bar.fps-bar {
  background: linear-gradient(to top, var(--leaf-red), var(--leaf-orange));
}
.bar.dc-bar {
  background: linear-gradient(to top, var(--chestnut), var(--accent));
}
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.control-panel h4 {
  margin: 0;
  color: var(--accent);
}
.control-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
}
.control-item.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.control-item.checkbox input {
  width: auto;
}
.control-item input[type="range"] {
  width: 100%;
  accent-color: var(--leaf-red);
}
.control-item .hint {
  font-size: 12px;
  color: var(--muted);
}
.checklist {
  background: rgba(246, 193, 90, 0.1);
  border: 1px solid rgba(246, 193, 90, 0.3);
  border-radius: 8px;
  padding: 12px;
}
.checklist h5 {
  margin: 0 0 8px;
  color: var(--chestnut);
}
.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 13px;
}
.check-item.disabled {
  opacity: 0.5;
}
.check-item.critical {
  font-weight: 600;
}
.check-icon {
  font-size: 14px;
}
.info-section {
  background: rgba(123, 53, 29, 0.06);
  border: 1px solid rgba(123, 53, 29, 0.15);
  border-radius: 8px;
  padding: 12px;
}
.info-section h5 {
  margin: 0 0 8px;
  color: var(--leaf-orange);
}
.info-section ul {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text);
}
.code-display {
  background: rgba(123, 53, 29, 0.06);
  border: 1px solid rgba(123, 53, 29, 0.15);
  border-radius: 8px;
  padding: 12px;
}
.code-display h5 {
  margin: 0 0 8px;
  color: var(--leaf-orange);
}
.code-display pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 100px;
}
.code-display code {
  color: var(--forest);
  font-family: ui-monospace, monospace;
}
[data-theme='dark'] .metric-card {
  background: rgba(42, 30, 24, 0.9);
  border-color: rgba(74, 52, 40, 0.5);
}
[data-theme='dark'] .bar.fps-bar {
  background: linear-gradient(to top, var(--leaf-red), var(--leaf-orange));
}
[data-theme='dark'] .bar.dc-bar {
  background: linear-gradient(to top, var(--chestnut), var(--accent));
}
[data-theme='dark'] .checklist {
  background: rgba(246, 193, 90, 0.08);
  border-color: rgba(246, 193, 90, 0.2);
}
[data-theme='dark'] .info-section {
  background: rgba(246, 193, 90, 0.08);
  border-color: rgba(246, 193, 90, 0.2);
}
[data-theme='dark'] .code-display {
  background: rgba(246, 193, 90, 0.08);
  border-color: rgba(246, 193, 90, 0.2);
}
[data-theme='dark'] .code-display code {
  color: var(--leaf-gold);
}
[data-theme='dark'] .history-chart {
  background: rgba(42, 30, 24, 0.9);
  border-color: rgba(74, 52, 40, 0.5);
}
</style>