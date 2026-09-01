const n=`<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const gl = shallowRef<WebGLRenderingContext | null>(null)
const rafId = shallowRef<number>(0)

type DrawMode = 'POINTS' | 'LINES' | 'LINE_STRIP' | 'TRIANGLES' | 'TRIANGLE_FAN'
const drawMode = ref<DrawMode>('TRIANGLES')
const useEBO = ref(true)

const drawModes: { value: DrawMode; label: string; desc: string }[] = [
  { value: 'POINTS', label: 'POINTS', desc: '独立点列表' },
  { value: 'LINES', label: 'LINES', desc: '成对线段' },
  { value: 'LINE_STRIP', label: 'LINE_STRIP', desc: '折线带' },
  { value: 'TRIANGLES', label: 'TRIANGLES', desc: '独立三角形' },
  { value: 'TRIANGLE_FAN', label: 'TRIANGLE_FAN', desc: '三角扇形' },
]

const vertexSource = \`attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  gl_PointSize = 6.0;
  vColor = aColor;
}\`

const fragmentSource = \`precision mediump float;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}\`

const vertexCount = 8
let vbo: WebGLBuffer | null = null
let ebo: WebGLBuffer | null = null
let vao: WebGLVertexArrayObject | null = null
let vaoExt: OES_vertex_array_object | null = null
let program: WebGLProgram | null = null
let positionLoc: number = -1
let colorLoc: number = -1

const ringRadius = 0.65
const ringVertices: number[] = []
const ringIndices: number[] = []

for (let i = 0; i < vertexCount; i++) {
  const angle = (i / vertexCount) * Math.PI * 2 - Math.PI / 2
  const x = Math.cos(angle) * ringRadius
  const y = Math.sin(angle) * ringRadius
  const r = 0.6 + 0.4 * Math.sin(angle * 2)
  const g = 0.4 + 0.4 * Math.cos(angle * 3)
  const b = 0.2 + 0.3 * Math.sin(angle * 1.5)
  ringVertices.push(x, y, r, g, b)
}

for (let i = 0; i < vertexCount; i++) {
  ringIndices.push(i)
}

const fullVertices = new Float32Array(ringVertices)
const fullIndices = new Uint16Array(ringIndices)

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

function initGL() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext
  if (!ctx) {
    console.error('WebGL not supported')
    return
  }
  gl.value = ctx as WebGLRenderingContext

  vaoExt = ctx.getExtension('OES_vertex_array_object')
  if (!vaoExt) {
    console.error('OES_vertex_array_object not supported')
    return
  }

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

  vbo = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo)
  ctx.bufferData(ctx.ARRAY_BUFFER, fullVertices, ctx.STATIC_DRAW)

  ebo = ctx.createBuffer()
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, ebo)
  ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, fullIndices, ctx.STATIC_DRAW)

  vao = vaoExt!.createVertexArrayOES()
  if (vao) {
    vaoExt!.bindVertexArrayOES(vao)
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo)
    ctx.enableVertexAttribArray(positionLoc)
    ctx.vertexAttribPointer(positionLoc, 2, ctx.FLOAT, false, 5 * 4, 0)
    ctx.enableVertexAttribArray(colorLoc)
    ctx.vertexAttribPointer(colorLoc, 3, ctx.FLOAT, false, 5 * 4, 2 * 4)
    if (useEBO.value) {
      ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, ebo)
    }
    vaoExt!.bindVertexArrayOES(null)
  }
}

watch([drawMode, useEBO], () => {
  const ctx = gl.value
  if (!ctx || !vao) return
  vaoExt!.bindVertexArrayOES(vao)
  if (useEBO.value) {
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, ebo)
  } else {
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null)
  }
  vaoExt!.bindVertexArrayOES(null)
})

function render() {
  const ctx = gl.value
  if (!ctx || !program) return

  ctx.clearColor(0.12, 0.08, 0.04, 1.0)
  ctx.clear(ctx.COLOR_BUFFER_BIT)

  ctx.useProgram(program)

  if (vao) {
    vaoExt!.bindVertexArrayOES(vao)
  } else {
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo)
    ctx.enableVertexAttribArray(positionLoc)
    ctx.vertexAttribPointer(positionLoc, 2, ctx.FLOAT, false, 5 * 4, 0)
    ctx.enableVertexAttribArray(colorLoc)
    ctx.vertexAttribPointer(colorLoc, 3, ctx.FLOAT, false, 5 * 4, 2 * 4)
    if (useEBO.value) {
      ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, ebo)
    }
  }

  const modeMap: Record<DrawMode, number> = {
    POINTS: ctx.POINTS,
    LINES: ctx.LINES,
    LINE_STRIP: ctx.LINE_STRIP,
    TRIANGLES: ctx.TRIANGLES,
    TRIANGLE_FAN: ctx.TRIANGLE_FAN,
  }

  const glMode = modeMap[drawMode.value]

  if (useEBO.value) {
    ctx.drawElements(glMode, vertexCount, ctx.UNSIGNED_SHORT, 0)
  } else {
    ctx.drawArrays(glMode, 0, vertexCount)
  }

  if (vao) {
    vaoExt!.bindVertexArrayOES(null)
  }

  rafId.value = requestAnimationFrame(render)
}

onMounted(() => {
  initGL()
  render()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId.value)
  const ctx = gl.value
  if (ctx && vao) vaoExt!.deleteVertexArrayOES(vao)
  if (ctx && vbo) ctx.deleteBuffer(vbo)
  if (ctx && ebo) ctx.deleteBuffer(ebo)
  if (ctx && program) ctx.deleteProgram(program)
})
<\/script>

<template>
  <div class="demo-card">
    <h3>缓冲区对象与绘制调用</h3>
    <p class="desc">
      通过环形点阵演示 VBO（顶点缓冲）、EBO（索引缓冲）和 VAO（顶点数组对象）的协作关系，以及不同绘制模式的效果。
    </p>

    <div class="grid">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" width="400" height="300"></canvas>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">📐 绘制模式</label>
          <div class="mode-buttons">
            <button
              v-for="m in drawModes"
              :key="m.value"
              class="mode-btn"
              :class="{ active: drawMode === m.value }"
              @click="drawMode = m.value"
            >
              <strong>{{ m.label }}</strong>
              <small>{{ m.desc }}</small>
            </button>
          </div>
        </div>

        <div class="control-group">
          <label class="checkbox-item">
            <input type="checkbox" v-model="useEBO" />
            <span>启用 EBO 索引缓冲</span>
          </label>
          <p class="hint">
            开启：使用 drawElements + 索引<br/>
            关闭：使用 drawArrays 直接绘制
          </p>
        </div>
      </div>
    </div>

    <div class="concept-grid">
      <div class="concept-card">
        <div class="concept-icon">📦</div>
        <h4>VBO</h4>
        <p>Vertex Buffer Object — 存储顶点属性数据（位置、颜色等），从 CPU 传输到 GPU 显存</p>
        <code>createBuffer → bindBuffer → bufferData</code>
      </div>
      <div class="concept-card">
        <div class="concept-icon">🔢</div>
        <h4>EBO</h4>
        <p>Element Buffer Object — 存储索引数据，告诉 GPU 按什么顺序取顶点，避免重复</p>
        <code>drawElements(mode, count, type, offset)</code>
      </div>
      <div class="concept-card">
        <div class="concept-icon">📋</div>
        <h4>VAO</h4>
        <p>Vertex Array Object — 封装所有顶点属性配置，一次设置多处使用</p>
        <code>createVertexArray → bindVertexArray</code>
      </div>
    </div>

    <div class="code-section">
      <h4>🔄 当前绘制调用</h4>
      <pre class="mini-code"><code>// 当前模式: {{ drawMode }}
// {{ useEBO ? '使用 EBO 索引绘制' : '直接数组绘制' }}

// {{ useEBO ? 'drawElements' : 'drawArrays' }} 调用
// 参数: {{ useEBO ? \`gl.\${drawMode}, \${vertexCount}, gl.UNSIGNED_SHORT, 0\` : \`gl.\${drawMode}, 0, \${vertexCount}\` }}

// 顶点属性配置
// aPosition: vec2 (offset=0)
// aColor:   vec3 (offset=2*4, stride=5*4)</code></pre>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>VBO 存什么：顶点的位置、颜色、法线等属性数据</li>
        <li>EBO 存什么：顶点索引，复用顶点减少数据量</li>
        <li>VAO 存什么：属性索引配置，简化切换过程</li>
        <li>drawArrays 顺序绘制，drawElements 按索引绘制</li>
        <li>POINTS 用 gl_PointSize 控制点大小</li>
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
  gap: 16px;
}

.control-group {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  background: var(--surface);
}

.control-label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text);
}

.mode-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.mode-btn:hover {
  border-color: var(--leaf-orange);
  transform: translateY(-1px);
}

.mode-btn.active {
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  color: #fff;
  border-color: transparent;
}

.mode-btn strong {
  font-size: 12px;
}

.mode-btn small {
  font-size: 10px;
  opacity: 0.8;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  color: var(--text);
  font-size: 14px;
}

.checkbox-item input {
  accent-color: var(--accent);
}

.hint {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.6;
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.concept-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  background: var(--surface);
  text-align: center;
  transition: transform 0.2s ease;
}

.concept-card:hover {
  transform: translateY(-3px);
  border-color: var(--leaf-orange);
}

.concept-icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.concept-card h4 {
  margin: 0 0 6px;
  color: var(--chestnut);
  font-size: 16px;
}

.concept-card p {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.6;
}

.concept-card code {
  display: block;
  font-size: 10px;
  background: rgba(255, 218, 159, 0.5);
  padding: 4px 6px;
  border-radius: 4px;
  color: var(--accent-strong);
  word-break: break-all;
}

.code-section {
  margin-bottom: 16px;
}

.code-section h4 {
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
  .concept-grid {
    grid-template-columns: 1fr;
  }
}

[data-theme='dark'] .mode-btn.active {
  background: linear-gradient(135deg, #e8623a, #f5a040);
}

[data-theme='dark'] .concept-card code {
  background: rgba(246, 193, 90, 0.15);
  color: var(--chestnut);
}

[data-theme='dark'] .tips-box {
  background: rgba(74, 52, 40, 0.3);
}

[data-theme='dark'] .tips-box code {
  background: rgba(246, 193, 90, 0.15);
  color: var(--chestnut);
}
</style>`;export{n as default};
