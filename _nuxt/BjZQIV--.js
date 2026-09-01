const n=`<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, shallowRef, watch } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const gl = shallowRef<WebGLRenderingContext | null>(null)
const rafId = shallowRef<number>(0)

const tx = ref(0)
const ty = ref(0)
const rotation = ref(0)
const scaleX = ref(1)
const scaleY = ref(1)

const vertexSource = \`attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform mat3 uMatrix;
void main() {
  vec3 transformed = uMatrix * vec3(aPosition, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
  vColor = aColor;
}\`

const fragmentSource = \`precision mediump float;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}\`

function createTranslationMatrix(tx: number, ty: number): Float32Array {
  return new Float32Array([
    1, 0, tx,
    0, 1, ty,
    0, 0, 1,
  ])
}

function createRotationMatrix(angle: number): Float32Array {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return new Float32Array([
    c, -s, 0,
    s, c, 0,
    0, 0, 1,
  ])
}

function createScaleMatrix(sx: number, sy: number): Float32Array {
  return new Float32Array([
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1,
  ])
}

function multiplyMatrices(a: Float32Array, b: Float32Array): Float32Array {
  const result = new Float32Array(9)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let sum = 0
      for (let k = 0; k < 3; k++) {
        sum += a[row * 3 + k] * b[k * 3 + col]
      }
      result[row * 3 + col] = sum
    }
  }
  return result
}

const currentMatrix = computed(() => {
  const t = createTranslationMatrix(tx.value, ty.value)
  const r = createRotationMatrix(rotation.value)
  const s = createScaleMatrix(scaleX.value, scaleY.value)
  return multiplyMatrices(multiplyMatrices(t, r), s)
})

const matrixDisplay = computed(() => {
  const m = currentMatrix.value
  return [
    [m[0].toFixed(3), m[1].toFixed(3), m[2].toFixed(3)],
    [m[3].toFixed(3), m[4].toFixed(3), m[5].toFixed(3)],
    [m[6].toFixed(3), m[7].toFixed(3), m[8].toFixed(3)],
  ]
})

const rotationDeg = computed({
  get: () => rotation.value * 180 / Math.PI,
  set: (v: number) => { rotation.value = v * Math.PI / 180 }
})

const shapeType = ref<'quad' | 'triangle' | 'pentagon'>('quad')

const shapes: Record<string, { vertices: number[]; indices: number[] }> = {
  quad: {
    vertices: [
      -0.35, -0.35, 1.0, 0.3, 0.1,
       0.35, -0.35, 0.2, 0.8, 0.3,
       0.35,  0.35, 0.3, 0.5, 0.9,
      -0.35,  0.35, 0.9, 0.6, 0.2,
    ],
    indices: [0, 1, 2, 0, 2, 3],
  },
  triangle: {
    vertices: [
       0.0,  0.4, 1.0, 0.4, 0.1,
      -0.4, -0.3, 0.2, 0.9, 0.3,
       0.4, -0.3, 0.3, 0.5, 0.9,
    ],
    indices: [0, 1, 2],
  },
  pentagon: {
    vertices: (() => {
      const verts: number[] = []
      const count = 5
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * 0.4
        const y = Math.sin(angle) * 0.4
        const cr = 0.6 + 0.4 * Math.sin(angle * 2)
        const cg = 0.3 + 0.4 * Math.cos(angle * 3)
        const cb = 0.2 + 0.4 * Math.sin(angle * 1.5)
        verts.push(x, y, cr, cg, cb)
      }
      return verts
    })(),
    indices: [0, 1, 2, 0, 2, 3, 0, 3, 4],
  },
}

let vbo: WebGLBuffer | null = null
let ebo: WebGLBuffer | null = null
let program: WebGLProgram | null = null
let positionLoc: number = -1
let colorLoc: number = -1
let matrixLoc: WebGLUniformLocation | null = null

function compile(type: number, src: string): WebGLShader | null {
  const ctx = gl.value
  if (!ctx) return null
  const s = ctx.createShader(type)!
  ctx.shaderSource(s, src)
  ctx.compileShader(s)
  if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) {
    console.error(ctx.getShaderInfoLog(s))
    return null
  }
  return s
}

function uploadShape() {
  const ctx = gl.value
  if (!ctx || !vbo || !ebo) return
  const shape = shapes[shapeType.value]
  ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo)
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(shape.vertices), ctx.STATIC_DRAW)
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, ebo)
  ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), ctx.STATIC_DRAW)
}

watch(shapeType, () => {
  uploadShape()
})

function initGL() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext
  if (!ctx) {
    console.error('WebGL not supported')
    return
  }
  gl.value = ctx as WebGLRenderingContext

  const vs = compile(ctx.VERTEX_SHADER, vertexSource)
  const fs = compile(ctx.FRAGMENT_SHADER, fragmentSource)
  if (!vs || !fs) return

  program = ctx.createProgram()!
  ctx.attachShader(program, vs)
  ctx.attachShader(program, fs)
  ctx.linkProgram(program)
  if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
    console.error(ctx.getProgramInfoLog(program))
    return
  }

  positionLoc = ctx.getAttribLocation(program, 'aPosition')
  colorLoc = ctx.getAttribLocation(program, 'aColor')
  matrixLoc = ctx.getUniformLocation(program, 'uMatrix')

  vbo = ctx.createBuffer()
  ebo = ctx.createBuffer()
  uploadShape()
}

function render() {
  const ctx = gl.value
  if (!ctx || !program || !vbo || !ebo) return

  ctx.clearColor(0.12, 0.08, 0.04, 1.0)
  ctx.clear(ctx.COLOR_BUFFER_BIT)

  ctx.useProgram(program)

  ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo)
  ctx.enableVertexAttribArray(positionLoc)
  ctx.vertexAttribPointer(positionLoc, 2, ctx.FLOAT, false, 5 * 4, 0)
  ctx.enableVertexAttribArray(colorLoc)
  ctx.vertexAttribPointer(colorLoc, 3, ctx.FLOAT, false, 5 * 4, 2 * 4)

  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, ebo)

  if (matrixLoc) {
    ctx.uniformMatrix3fv(matrixLoc, false, currentMatrix.value)
  }

  const shape = shapes[shapeType.value]
  ctx.drawElements(ctx.TRIANGLES, shape.indices.length, ctx.UNSIGNED_SHORT, 0)

  rafId.value = requestAnimationFrame(render)
}

function resetTransform() {
  tx.value = 0
  ty.value = 0
  rotation.value = 0
  scaleX.value = 1
  scaleY.value = 1
}

onMounted(() => {
  initGL()
  render()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId.value)
  const ctx = gl.value
  if (ctx && vbo) ctx.deleteBuffer(vbo)
  if (ctx && ebo) ctx.deleteBuffer(ebo)
  if (ctx && program) ctx.deleteProgram(program)
})
<\/script>

<template>
  <div class="demo-card">
    <h3>二维变换矩阵</h3>
    <p class="desc">
      通过 3×3 矩阵实现平移、旋转和缩放，实时查看矩阵值变化，理解 GPU 如何用矩阵变换顶点坐标。
    </p>

    <div class="grid">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" width="400" height="300"></canvas>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">📐 形状选择</label>
          <div class="shape-buttons">
            <button
              class="shape-btn"
              :class="{ active: shapeType === 'quad' }"
              @click="shapeType = 'quad'"
            >四边形</button>
            <button
              class="shape-btn"
              :class="{ active: shapeType === 'triangle' }"
              @click="shapeType = 'triangle'"
            >三角形</button>
            <button
              class="shape-btn"
              :class="{ active: shapeType === 'pentagon' }"
              @click="shapeType = 'pentagon'"
            >五边形</button>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">↔ X 平移: {{ tx.toFixed(2) }}</label>
          <input type="range" min="-0.8" max="0.8" step="0.01" v-model.number="tx" />

          <label class="control-label">↕ Y 平移: {{ ty.toFixed(2) }}</label>
          <input type="range" min="-0.6" max="0.6" step="0.01" v-model.number="ty" />
        </div>

        <div class="control-group">
          <label class="control-label">🔄 旋转角度: {{ rotationDeg.toFixed(0) }}°</label>
          <input type="range" min="-180" max="180" step="1" v-model.number="rotationDeg" />
        </div>

        <div class="control-group">
          <label class="control-label">📏 X 缩放: {{ scaleX.toFixed(2) }}</label>
          <input type="range" min="0.1" max="2.5" step="0.01" v-model.number="scaleX" />

          <label class="control-label">📏 Y 缩放: {{ scaleY.toFixed(2) }}</label>
          <input type="range" min="0.1" max="2.5" step="0.01" v-model.number="scaleY" />
        </div>

        <button class="reset-btn" @click="resetTransform">🔄 重置变换</button>
      </div>
    </div>

    <div class="matrix-section">
      <h4>🧮 变换矩阵 (3×3, 行主序)</h4>
      <div class="matrix-display">
        <table class="matrix-table">
          <tr v-for="(row, ri) in matrixDisplay" :key="ri">
            <td v-for="(val, ci) in row" :key="ci" class="matrix-cell">{{ val }}</td>
          </tr>
        </table>
        <div class="matrix-latex">
          <code>M = T(tx,ty) × R(θ) × S(sx,sy)</code>
        </div>
      </div>
    </div>

    <div class="matrix-components">
      <div class="component-card">
        <h4>平移矩阵 T</h4>
        <table>
          <tr><td>1</td><td>0</td><td>{{ tx.toFixed(2) }}</td></tr>
          <tr><td>0</td><td>1</td><td>{{ ty.toFixed(2) }}</td></tr>
          <tr><td>0</td><td>0</td><td>1.00</td></tr>
        </table>
      </div>
      <div class="component-card">
        <h4>旋转矩阵 R</h4>
        <table>
          <tr>
            <td>{{ Math.cos(rotation).toFixed(3) }}</td>
            <td>{{ (-Math.sin(rotation)).toFixed(3) }}</td>
            <td>0</td>
          </tr>
          <tr>
            <td>{{ Math.sin(rotation).toFixed(3) }}</td>
            <td>{{ Math.cos(rotation).toFixed(3) }}</td>
            <td>0</td>
          </tr>
          <tr><td>0</td><td>0</td><td>1</td></tr>
        </table>
      </div>
      <div class="component-card">
        <h4>缩放矩阵 S</h4>
        <table>
          <tr><td>{{ scaleX.toFixed(2) }}</td><td>0</td><td>0</td></tr>
          <tr><td>0</td><td>{{ scaleY.toFixed(2) }}</td><td>0</td></tr>
          <tr><td>0</td><td>0</td><td>1.00</td></tr>
        </table>
      </div>
    </div>

    <div class="shader-section">
      <h4>📐 顶点着色器中的矩阵变换</h4>
      <pre class="mini-code"><code>// 使用 3×3 矩阵变换 2D 顶点
attribute vec2 aPosition;
uniform mat3 uMatrix;
void main() {
  // 扩展为齐次坐标 (x, y, 1)
  vec3 transformed = uMatrix * vec3(aPosition, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
}</code></pre>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>2D 变换使用 3×3 矩阵（齐次坐标）</li>
        <li>变换顺序：M = T × R × S（矩阵乘法从右到左应用）</li>
        <li>gl.uniformMatrix3fv 将矩阵传入着色器</li>
        <li>矩阵在 CPU 端预计算，GPU 只做一次乘法</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.desc {
  color: var(--muted);
  margin-bottom: 16px;
  line-height: 1.7;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.canvas-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg);
}

.canvas-wrap canvas {
  display: block;
  max-width: 100%;
  height: auto;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-group {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  background: var(--surface);
}

.control-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text);
  font-size: 13px;
}

.control-group input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
  margin-bottom: 8px;
}

.shape-buttons {
  display: flex;
  gap: 6px;
}

.shape-btn {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.shape-btn:hover {
  border-color: var(--leaf-orange);
}

.shape-btn.active {
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  color: #fff;
  border-color: transparent;
}

.reset-btn {
  padding: 8px 16px;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: var(--accent-strong);
}

.matrix-section {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  background: var(--surface);
  margin-bottom: 16px;
}

.matrix-section h4 {
  margin-bottom: 12px;
  color: var(--chestnut);
}

.matrix-display {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.matrix-table {
  border-collapse: collapse;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 14px;
}

.matrix-table td {
  border: 1px solid var(--border);
  padding: 6px 12px;
  text-align: center;
  min-width: 70px;
  background: rgba(246, 193, 90, 0.1);
  color: var(--chestnut);
}

.matrix-latex code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  color: var(--muted);
  font-size: 13px;
}

.matrix-components {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.component-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  background: var(--surface);
}

.component-card h4 {
  margin: 0 0 8px;
  color: var(--chestnut);
  font-size: 14px;
}

.component-card table {
  border-collapse: collapse;
  width: 100%;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 11px;
}

.component-card table td {
  border: 1px solid var(--border);
  padding: 3px 5px;
  text-align: center;
  background: rgba(246, 193, 90, 0.08);
  color: var(--muted);
}

.shader-section {
  margin-bottom: 16px;
}

.shader-section h4 {
  margin-bottom: 8px;
  color: var(--chestnut);
}

.tips-box {
  background: rgba(246, 193, 90, 0.12);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
}

.tips-box p {
  margin: 0 0 8px;
  color: var(--chestnut);
}

.tips-box ul {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.8;
}

.tips-box code {
  background: rgba(255, 218, 159, 0.5);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .matrix-components {
    grid-template-columns: 1fr;
  }
}

[data-theme='dark'] .shape-btn.active {
  background: linear-gradient(135deg, #e8623a, #f5a040);
}

[data-theme='dark'] .matrix-table td {
  background: rgba(74, 52, 40, 0.5);
}

[data-theme='dark'] .component-card table td {
  background: rgba(74, 52, 40, 0.3);
}

[data-theme='dark'] .tips-box {
  background: rgba(74, 52, 40, 0.3);
}

[data-theme='dark'] .tips-box code {
  background: rgba(246, 193, 90, 0.15);
  color: var(--chestnut);
}
</style>`;export{n as default};
