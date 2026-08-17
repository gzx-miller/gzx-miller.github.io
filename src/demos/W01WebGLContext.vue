<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const gl = shallowRef<WebGLRenderingContext | null>(null)
const rafId = shallowRef<number>(0)

const showPipeline = ref(true)
const showVertices = ref(true)
const showFragment = ref(true)
const bgColor = ref('#fff5e6')

const vertexSource = `attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const fragmentSource = `precision mediump float;
uniform vec4 uColor;
void main() {
  gl_FragColor = uColor;
}`

let program: WebGLProgram | null = null
let buffer: WebGLBuffer | null = null
let colorLoc: WebGLUniformLocation | null = null
let positionLoc: number = -1
let triangleAngle = 0

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
  colorLoc = ctx.getUniformLocation(program, 'uColor')

  buffer = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
  const positions = new Float32Array([
    0.0, 0.6,
    -0.6, -0.4,
    0.6, -0.4,
  ])
  ctx.bufferData(ctx.ARRAY_BUFFER, positions, ctx.STATIC_DRAW)
}

function render() {
  const ctx = gl.value
  if (!ctx || !program || !buffer) return

  const hex = bgColor.value
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  ctx.clearColor(r * 0.3, g * 0.3, b * 0.3, 1.0)
  ctx.clear(ctx.COLOR_BUFFER_BIT)

  ctx.useProgram(program)

  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
  ctx.enableVertexAttribArray(positionLoc)
  ctx.vertexAttribPointer(positionLoc, 2, ctx.FLOAT, false, 0, 0)

  triangleAngle += 0.01
  const cr = 0.7 + 0.3 * Math.sin(triangleAngle)
  const cg = 0.3 + 0.4 * Math.cos(triangleAngle * 0.7)
  const cb = 0.2 + 0.3 * Math.sin(triangleAngle * 1.3)

  ctx.uniform4f(colorLoc, cr, cg, cb, 1.0)
  ctx.drawArrays(ctx.TRIANGLES, 0, 3)

  rafId.value = requestAnimationFrame(render)
}

onMounted(() => {
  initGL()
  render()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId.value)
  const ctx = gl.value
  if (ctx && program) ctx.deleteProgram(program)
  if (ctx && buffer) ctx.deleteBuffer(buffer)
})
</script>

<template>
  <div class="demo-card">
    <h3>WebGL 上下文与渲染管线</h3>
    <p class="desc">
      通过一个最简单的彩色三角形，理解 WebGL 从上下文创建到绘制完成的完整管线流程。
    </p>

    <div class="grid">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" width="400" height="300"></canvas>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">🎨 画布背景色</label>
          <input type="color" v-model="bgColor" class="color-input" />
        </div>

        <div class="control-group">
          <label class="control-label">👁 管线阶段可见性</label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="showPipeline" />
            <span>显示管线流程</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="showVertices" />
            <span>显示顶点着色器代码</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="showFragment" />
            <span>显示片段着色器代码</span>
          </label>
        </div>
      </div>
    </div>

    <div v-if="showPipeline" class="pipeline">
      <h4>🔄 渲染管线流程</h4>
      <div class="pipeline-steps">
        <div class="pipeline-step">
          <span class="step-num">1</span>
          <div class="step-content">
            <strong>获取 WebGL 上下文</strong>
            <p>canvas.getContext('webgl') 建立 GPU 与画布的连接</p>
          </div>
        </div>
        <div class="pipeline-arrow">↓</div>
        <div class="pipeline-step">
          <span class="step-num">2</span>
          <div class="step-content">
            <strong>编写着色器 GLSL</strong>
            <p>顶点着色器处理坐标，片段着色器决定颜色</p>
          </div>
        </div>
        <div class="pipeline-arrow">↓</div>
        <div class="pipeline-step">
          <span class="step-num">3</span>
          <div class="step-content">
            <strong>编译 & 链接程序</strong>
            <p>createShader → shaderSource → compileShader → linkProgram</p>
          </div>
        </div>
        <div class="pipeline-arrow">↓</div>
        <div class="pipeline-step">
          <span class="step-num">4</span>
          <div class="step-content">
            <strong>上传顶点数据</strong>
            <p>createBuffer → bindBuffer → bufferData 将数据送入 GPU</p>
          </div>
        </div>
        <div class="pipeline-arrow">↓</div>
        <div class="pipeline-step">
          <span class="step-num">5</span>
          <div class="step-content">
            <strong>绘制 & 交换缓冲</strong>
            <p>useProgram → drawArrays 完成帧渲染</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showVertices" class="code-section">
      <h4>📐 顶点着色器 (Vertex Shader)</h4>
      <pre class="mini-code"><code>{{ vertexSource }}</code></pre>
    </div>

    <div v-if="showFragment" class="code-section">
      <h4>🎨 片段着色器 (Fragment Shader)</h4>
      <pre class="mini-code"><code>{{ fragmentSource }}</code></pre>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li><code>WebGLRenderingContext</code> 是所有 GPU 操作的入口</li>
        <li>着色器必须先编译再链接为 Program 才能使用</li>
        <li>数据通过 Buffer 从 CPU 传输到 GPU 显存</li>
        <li>每帧调用 <code>drawArrays</code> 触发 GPU 执行着色器</li>
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

.color-input {
  width: 60px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  padding: 2px;
  background: transparent;
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

.pipeline {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  background: var(--surface);
  margin-bottom: 16px;
}

.pipeline h4 {
  margin-bottom: 12px;
  color: var(--chestnut);
}

.pipeline-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.pipeline-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(246, 193, 90, 0.12);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.pipeline-step:hover {
  background: rgba(246, 193, 90, 0.2);
  transform: translateX(4px);
}

.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.step-content strong {
  color: var(--chestnut);
  display: block;
  margin-bottom: 2px;
}

.step-content p {
  color: var(--muted);
  margin: 0;
  font-size: 13px;
}

.pipeline-arrow {
  color: var(--accent);
  font-size: 18px;
  line-height: 1;
  margin: 4px 0;
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
}

[data-theme='dark'] .pipeline-step {
  background: rgba(74, 52, 40, 0.4);
}

[data-theme='dark'] .pipeline-step:hover {
  background: rgba(74, 52, 40, 0.6);
}

[data-theme='dark'] .tips-box {
  background: rgba(74, 52, 40, 0.3);
}

[data-theme='dark'] .tips-box code {
  background: rgba(246, 193, 90, 0.15);
  color: var(--chestnut);
}
</style>