const n=`<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glState = shallowRef<{
  gl: WebGLRenderingContext
  progInst: WebGLProgram
  progNonInst: WebGLProgram
  cubeVBO: WebGLBuffer
  cubeIndex: WebGLBuffer
  instVBO: WebGLBuffer
  rafId: number
  instCount: number
  useInstancing: boolean
  lastTime: number
  frameCount: number
  fpsTime: number
  fps: number
} | null>(null)

const instanceCount = ref(200)
const spacing = ref(1.0)
const rotationSpeed = ref(1.0)
const useInstancing = ref(true)
const fps = ref(0)
const drawCalls = ref(0)

const cubeVS = \`
attribute vec3 a_position;
attribute vec3 a_color;
attribute vec3 a_instance_pos;
attribute float a_instance_rot;
uniform mat4 u_proj;
uniform mat4 u_view;
varying vec3 v_color;
void main() {
  float c = cos(a_instance_rot);
  float s = sin(a_instance_rot);
  vec3 rotated = vec3(
    a_position.x * c - a_position.z * s,
    a_position.y,
    a_position.x * s + a_position.z * c
  );
  vec3 worldPos = rotated + a_instance_pos;
  v_color = a_color;
  gl_Position = u_proj * u_view * vec4(worldPos, 1.0);
}
\`

const cubeFS = \`
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
\`

const cubeVSNonInst = \`
attribute vec3 a_position;
attribute vec3 a_color;
uniform mat4 u_proj;
uniform mat4 u_view;
uniform vec3 u_offset;
uniform float u_rot;
varying vec3 v_color;
void main() {
  float c = cos(u_rot);
  float s = sin(u_rot);
  vec3 rotated = vec3(
    a_position.x * c - a_position.z * s,
    a_position.y,
    a_position.x * s + a_position.z * c
  );
  v_color = a_color;
  gl_Position = u_proj * u_view * vec4(rotated + u_offset, 1.0);
}
\`

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

function buildCubeGeometry() {
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []

  const faces = [
    { n: [0, 0, 1], v: [[-0.3, -0.3, 0.3], [0.3, -0.3, 0.3], [0.3, 0.3, 0.3], [-0.3, 0.3, 0.3]], c: [0.9, 0.5, 0.3] },
    { n: [0, 0, -1], v: [[0.3, -0.3, -0.3], [-0.3, -0.3, -0.3], [-0.3, 0.3, -0.3], [0.3, 0.3, -0.3]], c: [0.8, 0.4, 0.6] },
    { n: [1, 0, 0], v: [[0.3, -0.3, 0.3], [0.3, -0.3, -0.3], [0.3, 0.3, -0.3], [0.3, 0.3, 0.3]], c: [0.7, 0.6, 0.2] },
    { n: [-1, 0, 0], v: [[-0.3, -0.3, -0.3], [-0.3, -0.3, 0.3], [-0.3, 0.3, 0.3], [-0.3, 0.3, -0.3]], c: [0.5, 0.7, 0.3] },
    { n: [0, 1, 0], v: [[-0.3, 0.3, 0.3], [0.3, 0.3, 0.3], [0.3, 0.3, -0.3], [-0.3, 0.3, -0.3]], c: [0.6, 0.3, 0.7] },
    { n: [0, -1, 0], v: [[-0.3, -0.3, -0.3], [0.3, -0.3, -0.3], [0.3, -0.3, 0.3], [-0.3, -0.3, 0.3]], c: [0.9, 0.7, 0.4] },
  ]

  faces.forEach(f => {
    const startIdx = positions.length / 3
    f.v.forEach((p, i) => {
      positions.push(p[0], p[1], p[2])
      const shade = i % 2 === 0 ? 1.0 : 0.85
      colors.push(f.c[0] * shade, f.c[1] * shade, f.c[2] * shade)
    })
    indices.push(startIdx, startIdx + 1, startIdx + 2, startIdx, startIdx + 2, startIdx + 3)
  })

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    indices: new Uint16Array(indices),
    vertexCount: positions.length / 3,
    indexCount: indices.length,
  }
}

function generateInstanceData(count: number, spacing: number) {
  const data = new Float32Array(count * 16)
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 10)
    const col = i % 10
    const x = (col - 5) * spacing + (Math.random() - 0.5) * 0.2
    const z = (row - Math.floor(count / 10) / 2) * spacing + (Math.random() - 0.5) * 0.2
    const y = (Math.random() - 0.5) * 0.5
    data[i * 16 + 0] = x
    data[i * 16 + 1] = y
    data[i * 16 + 2] = z
    data[i * 16 + 3] = Math.random() * Math.PI * 2
    data[i * 16 + 4] = 0.6 + Math.random() * 0.4
    data[i * 16 + 5] = 0.4 + Math.random() * 0.4
    data[i * 16 + 6] = 0.3 + Math.random() * 0.3
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

function render(time: number) {
  const state = glState.value
  if (!state) return

  const dt = time - state.lastTime
  state.lastTime = time
  state.frameCount++
  state.fpsTime += dt
  if (state.fpsTime >= 500) {
    state.fps = Math.round((state.frameCount * 1000) / state.fpsTime)
    state.frameCount = 0
    state.fpsTime = 0
    fps.value = state.fps
  }

  const gl = state.gl
  const canvas = canvasRef.value!
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.09, 0.07, 0.05, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)

  const aspect = canvas.width / canvas.height
  const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100)
  const view = mat4LookAt([0, 3, 6], [0, 0, 0], [0, 1, 0])

  const geom = (state as any).geom
  const count = instanceCount.value
  const spacingVal = spacing.value
  const rotSpeed = rotationSpeed.value
  const useInst = useInstancing.value

  drawCalls.value = 0

  if (useInst) {
    gl.useProgram(state.progInst)
    gl.bindBuffer(gl.ARRAY_BUFFER, state.cubeVBO)

    const stride = 24
    const posLoc = gl.getAttribLocation(state.progInst, 'a_position')
    const colLoc = gl.getAttribLocation(state.progInst, 'a_color')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, stride, 0)
    gl.enableVertexAttribArray(colLoc)
    gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, stride, 12)

    gl.bindBuffer(gl.ARRAY_BUFFER, state.instVBO)
    const instPosLoc = gl.getAttribLocation(state.progInst, 'a_instance_pos')
    const instRotLoc = gl.getAttribLocation(state.progInst, 'a_instance_rot')

    if (instPosLoc >= 0) {
      gl.enableVertexAttribArray(instPosLoc)
      gl.vertexAttribPointer(instPosLoc, 3, gl.FLOAT, false, 64, 0)
      const ext = gl.getExtension('ANGLE_instanced_arrays')
      if (ext) ext.vertexAttribDivisorANGLE(instPosLoc, 1)
    }
    if (instRotLoc >= 0) {
      gl.enableVertexAttribArray(instRotLoc)
      gl.vertexAttribPointer(instRotLoc, 1, gl.FLOAT, false, 64, 12)
      const ext = gl.getExtension('ANGLE_instanced_arrays')
      if (ext) ext.vertexAttribDivisorANGLE(instRotLoc, 1)
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.cubeIndex)

    gl.uniformMatrix4fv(gl.getUniformLocation(state.progInst, 'u_proj'), false, proj)
    gl.uniformMatrix4fv(gl.getUniformLocation(state.progInst, 'u_view'), false, view)

    const ext = gl.getExtension('ANGLE_instanced_arrays')
    if (ext) {
      ext.drawElementsInstancedANGLE(gl.TRIANGLES, geom.indexCount, gl.UNSIGNED_SHORT, 0, count)
      drawCalls.value = 1
    } else {
      gl.drawElements(gl.TRIANGLES, geom.indexCount, gl.UNSIGNED_SHORT, 0)
      drawCalls.value = 1
    }
  } else {
    gl.useProgram(state.progNonInst)
    gl.bindBuffer(gl.ARRAY_BUFFER, state.cubeVBO)

    const posLoc = gl.getAttribLocation(state.progNonInst, 'a_position')
    const colLoc = gl.getAttribLocation(state.progNonInst, 'a_color')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, 0)
    gl.enableVertexAttribArray(colLoc)
    gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 24, 12)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.cubeIndex)

    gl.uniformMatrix4fv(gl.getUniformLocation(state.progNonInst, 'u_proj'), false, proj)
    gl.uniformMatrix4fv(gl.getUniformLocation(state.progNonInst, 'u_view'), false, view)

    const instData = generateInstanceData(count, spacingVal)
    const angle = time * 0.001 * rotSpeed

    for (let i = 0; i < count; i++) {
      const ox = instData[i * 16 + 0]
      const oy = instData[i * 16 + 1] + Math.sin(angle + i * 0.1) * 0.15
      const oz = instData[i * 16 + 2]
      const rot = angle + instData[i * 16 + 3]

      gl.uniform3f(gl.getUniformLocation(state.progNonInst, 'u_offset'), ox, oy, oz)
      gl.uniform1f(gl.getUniformLocation(state.progNonInst, 'u_rot'), rot)
      gl.drawElements(gl.TRIANGLES, geom.indexCount, gl.UNSIGNED_SHORT, 0)
      drawCalls.value++
    }
  }

  if (animating.value) {
    state.rafId = requestAnimationFrame(render)
  }
}

const animating = ref(true)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const gl = canvas.getContext('webgl', { antialias: true }) as WebGLRenderingContext
  if (!gl) {
    console.error('WebGL not supported')
    return
  }

  const ext = gl.getExtension('ANGLE_instanced_arrays')
  if (!ext) {
    console.warn('ANGLE_instanced_arrays not supported')
  }

  const parent = canvas.parentElement!
  canvas.width = Math.min(parent.clientWidth, 480)
  canvas.height = Math.min(parent.clientWidth, 480)

  const geom = buildCubeGeometry()
  const stride = 24
  const cubeData = new Float32Array(geom.vertexCount * stride / 4)
  for (let i = 0; i < geom.vertexCount; i++) {
    cubeData[i * 6 + 0] = geom.positions[i * 3 + 0]
    cubeData[i * 6 + 1] = geom.positions[i * 3 + 1]
    cubeData[i * 6 + 2] = geom.positions[i * 3 + 2]
    cubeData[i * 6 + 3] = geom.colors[i * 3 + 0]
    cubeData[i * 6 + 4] = geom.colors[i * 3 + 1]
    cubeData[i * 6 + 5] = geom.colors[i * 3 + 2]
  }

  const cubeVBO = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO)
  gl.bufferData(gl.ARRAY_BUFFER, cubeData, gl.STATIC_DRAW)

  const cubeIndex = gl.createBuffer()!
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndex)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geom.indices, gl.STATIC_DRAW)

  const instData = generateInstanceData(instanceCount.value, spacing.value)
  const instVBO = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, instVBO)
  gl.bufferData(gl.ARRAY_BUFFER, instData, gl.DYNAMIC_DRAW)

  const progInst = createProgram(gl, cubeVS, cubeFS)
  const progNonInst = createProgram(gl, cubeVSNonInst, cubeFS)
  if (!progInst || !progNonInst) return

  const state: any = {
    gl,
    progInst,
    progNonInst,
    cubeVBO,
    cubeIndex,
    instVBO,
    rafId: 0,
    lastTime: performance.now(),
    frameCount: 0,
    fpsTime: 0,
    fps: 0,
    geom,
  }

  glState.value = state
  state.rafId = requestAnimationFrame(render)
})

onUnmounted(() => {
  const state = glState.value
  if (state) {
    cancelAnimationFrame(state.rafId)
    state.gl.deleteProgram(state.progInst)
    state.gl.deleteProgram(state.progNonInst)
    state.gl.deleteBuffer(state.cubeVBO)
    state.gl.deleteBuffer(state.cubeIndex)
    state.gl.deleteBuffer(state.instVBO)
    state.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
})

const perfComparison = computed(() => {
  const instTime = 1
  const nonInstTime = instanceCount.value
  return {
    instTime: instTime.toFixed(0),
    nonInstTime: nonInstTime.toFixed(0),
    speedup: (nonInstTime / instTime).toFixed(0),
  }
})
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 实例化渲染 (Instanced Rendering)</h3>
    <p class="summary">数百个小立方体通过 Instancing 一次 draw call 绘制完成。对比传统逐个绘制方式的性能差距。</p>

    <div class="demo-layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef"></canvas>
        <div class="fps-badge">{{ fps }} FPS</div>
        <div class="drawcalls-badge">Draw Calls: {{ drawCalls }}</div>
      </div>

      <div class="control-panel">
        <h4>渲染模式</h4>
        <div class="mode-switch">
          <button :class="{ active: useInstancing }" @click="useInstancing = true">
            ✨ 实例化渲染
          </button>
          <button :class="{ active: !useInstancing }" @click="useInstancing = false">
            🔄 逐个绘制
          </button>
        </div>

        <label class="control-item">
          <span>实例数量：{{ instanceCount }}</span>
          <input type="range" min="10" max="500" step="10" v-model.number="instanceCount" />
        </label>

        <label class="control-item">
          <span>间距：{{ spacing.toFixed(1) }}</span>
          <input type="range" min="0.3" max="3.0" step="0.1" v-model.number="spacing" />
        </label>

        <label class="control-item">
          <span>旋转速度：{{ rotationSpeed.toFixed(1) }}x</span>
          <input type="range" min="0" max="3.0" step="0.1" v-model.number="rotationSpeed" />
        </label>

        <div class="perf-stats">
          <div class="stat-row">
            <span>Draw Calls</span>
            <strong :class="{ highlight: useInstancing }">{{ drawCalls }}</strong>
          </div>
          <div class="stat-row">
            <span>渲染模式</span>
            <strong>{{ useInstancing ? 'Instanced' : 'Non-Instanced' }}</strong>
          </div>
        </div>

        <div class="code-display">
          <h5>Instancing 关键代码</h5>
          <pre><code>// 实例属性设置
gl.vertexAttribPointer(
  instPosLoc, 3, gl.FLOAT,
  false, 64, 0
);
ext.vertexAttribDivisorANGLE(instPosLoc, 1);

// 一次绘制所有实例
ext.drawElementsInstancedANGLE(
  gl.TRIANGLES, indexCount,
  gl.UNSIGNED_SHORT, 0, count
);</code></pre>
        </div>

        <div class="info-section">
          <h5>📚 性能对比</h5>
          <div class="comparison">
            <div class="comp-item">
              <strong>实例化</strong>
              <span>1 次 Draw Call</span>
            </div>
            <div class="vs">VS</div>
            <div class="comp-item">
              <strong>逐个绘制</strong>
              <span>{{ instanceCount }} 次 Draw Call</span>
            </div>
          </div>
          <p class="tip">切换渲染模式观察 FPS 和 Draw Call 的显著差异。</p>
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
.drawcalls-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: var(--accent);
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
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
.mode-switch {
  display: flex;
  gap: 8px;
}
.mode-switch button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}
.mode-switch button.active {
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  color: #fff;
  border-color: transparent;
}
.control-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}
.control-item input[type="range"] {
  width: 100%;
  accent-color: var(--leaf-red);
}
.perf-stats {
  background: rgba(123, 53, 29, 0.06);
  border: 1px solid rgba(123, 53, 29, 0.15);
  border-radius: 8px;
  padding: 12px;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}
.stat-row strong.highlight {
  color: var(--leaf-red);
  font-size: 16px;
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
  max-height: 120px;
}
.code-display code {
  color: var(--forest);
  font-family: ui-monospace, monospace;
}
.info-section {
  background: rgba(246, 193, 90, 0.1);
  border: 1px solid rgba(246, 193, 90, 0.3);
  border-radius: 8px;
  padding: 12px;
}
.info-section h5 {
  margin: 0 0 8px;
  color: var(--chestnut);
}
.comparison {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.comp-item {
  flex: 1;
  text-align: center;
  background: var(--surface);
  border-radius: 6px;
  padding: 8px;
  border: 1px solid var(--border);
}
.comp-item strong {
  display: block;
  color: var(--accent);
  font-size: 13px;
}
.comp-item span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}
.vs {
  font-weight: 700;
  color: var(--muted);
}
.tip {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}
[data-theme='dark'] .code-display {
  background: rgba(246, 193, 90, 0.08);
  border-color: rgba(246, 193, 90, 0.2);
}
[data-theme='dark'] .code-display code {
  color: var(--leaf-gold);
}
[data-theme='dark'] .info-section {
  background: rgba(246, 193, 90, 0.08);
  border-color: rgba(246, 193, 90, 0.2);
}
[data-theme='dark'] .perf-stats {
  background: rgba(246, 193, 90, 0.08);
  border-color: rgba(246, 193, 90, 0.2);
}
</style>`;export{n as default};
