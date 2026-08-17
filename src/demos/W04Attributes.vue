<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const gl = shallowRef<WebGLRenderingContext | null>(null)
const rafId = shallowRef<number>(0)

const uniformTime = ref(1.0)
const showAttributeColors = ref(true)
const autoAnimate = ref(true)

const vertexSource = `attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform float uTime;
void main() {
  vec2 pos = aPosition;
  pos.x += sin(uTime + aPosition.y * 3.0) * 0.05;
  pos.y += cos(uTime + aPosition.x * 3.0) * 0.05;
  gl_Position = vec4(pos, 0.0, 1.0);
  vColor = aColor;
}`

const fragmentSource = `precision mediump float;
varying vec3 vColor;
uniform float uTime;
uniform float uUseAttributeColor;
void main() {
  vec3 attrColor = vColor;
  vec3 dynamicColor = vec3(
    0.5 + 0.5 * sin(uTime * 0.7 + vColor.r * 6.28),
    0.5 + 0.5 * sin(uTime * 0.5 + vColor.g * 6.28 + 2.09),
    0.5 + 0.5 * sin(uTime * 0.3 + vColor.b * 6.28 + 4.18)
  );
  vec3 finalColor = mix(dynamicColor, attrColor, uUseAttributeColor);
  gl_FragColor = vec4(finalColor, 1.0);
}`

let program: WebGLProgram | null = null
let buffer: WebGLBuffer | null = null
let positionLoc: number = -1
let colorLoc: number = -1
let timeLoc: WebGLUniformLocation | null = null
let useColorLoc: WebGLUniformLocation | null = null

const segments = 64
const shapeVertices: number[] = []

for (let i = 0; i <= segments; i++) {
  const t = i / segments
  const angle = t * Math.PI * 2
  const wobble = 0.15 * Math.sin(angle * 3)
  const r = 0.5 + wobble
  const x = Math.cos(angle) * r
  const y = Math.sin(angle) * r
  const cr = 0.5 + 0.5 * Math.sin(angle * 2 + 0.3)
  const cg = 0.4 + 0.4 * Math.cos(angle * 3 + 1.2)
  const cb = 0.3 + 0.3 * Math.sin(angle * 1.5 + 2.1)
  shapeVertices.push(x, y, cr, cg, cb)
}

for (let i = segments; i >= 0; i--) {
  shapeVertices.push(0, 0, 0.6, 0.3, 0.2)
}

const vertexData = new Float32Array(shapeVertices)
const drawCount = segments * 2

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
  colorLoc = ctx.getAttribLocation(program, 'aColor')
  timeLoc = ctx.getUniformLocation(program, 'uTime')
  useColorLoc = ctx.getUniformLocation(program, 'uUseAttributeColor')

  buffer = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
  ctx.bufferData(ctx.ARRAY_BUFFER, vertexData, ctx.STATIC_DRAW)
}

let internalTime = 0

function render() {
  const ctx = gl.value
  if (!ctx || !program || !buffer) return

  ctx.clearColor(0.12, 0.08, 0.04, 1.0)
  ctx.clear(ctx.COLOR_BUFFER_BIT)

  ctx.useProgram(program)

  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
  const stride = 5 * 4
  ctx.enableVertexAttribArray(positionLoc)
  ctx.vertexAttribPointer(positionLoc, 2, ctx.FLOAT, false, stride, 0)
  ctx.enableVertexAttribArray(colorLoc)
  ctx.vertexAttribPointer(colorLoc, 3, ctx.FLOAT, false, stride, 2 * 4)

  const t = autoAnimate.value ? internalTime : uniformTime.value
  if (timeLoc) ctx.uniform1f(timeLoc, t)
  if (useColorLoc) ctx.uniform1f(useColorLoc, showAttributeColors.value ? 1.0 : 0.0)

  ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, drawCount)

  if (autoAnimate.value) {
    internalTime += 0.02
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
  if (ctx && program) ctx.deleteProgram(program)
  if (ctx && buffer) ctx.deleteBuffer(buffer)
})
</script>

<template>
  <div class="demo-card">
    <h3>attribute / uniform / varying</h3>
    <p class="desc">
      通过一个动态变形的彩色图形，同时演示 attribute（逐顶点属性）、uniform（全局变量）和 varying（插值传递）三种变量类型。
    </p>

    <div class="grid">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" width="400" height="300"></canvas>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">⏱ Uniform 时间: {{ uniformTime.toFixed(2) }}</label>
          <input type="range" min="0" max="12.57" step="0.05" v-model.number="uniformTime" :disabled="autoAnimate" />
          <label class="checkbox-item">
            <input type="checkbox" v-model="autoAnimate" />
            <span>自动动画时间</span>
          </label>
        </div>

        <div class="control-group">
          <label class="control-label">🎨 属性颜色模式</label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="showAttributeColors" />
            <span>使用 attribute 顶点颜色</span>
          </label>
          <p class="hint">
            勾选：每个顶点自带颜色（attribute），varying 插值<br/>
            取消：使用 uniform 时间动态计算颜色
          </p>
        </div>
      </div>
    </div>

    <div class="compare-section">
      <h4>📊 三种变量类型对比</h4>
      <div class="compare-grid">
        <div class="compare-card attribute-card">
          <div class="compare-header">
            <span class="var-badge attribute">attribute</span>
            <span class="var-scope">每个顶点独立</span>
          </div>
          <p class="var-desc">从 CPU 缓冲传入，每个顶点可拥有不同值</p>
          <pre class="var-code"><code>// 声明
attribute vec3 aColor;
// 绑定
gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, stride, offset);</code></pre>
          <div class="var-example">本案例中：<strong>每个顶点的颜色</strong></div>
        </div>

        <div class="compare-card uniform-card">
          <div class="compare-header">
            <span class="var-badge uniform">uniform</span>
            <span class="var-scope">全局共享</span>
          </div>
          <p class="var-desc">一次设置，所有顶点/片段共用同一值</p>
          <pre class="var-code"><code>// 声明
uniform float uTime;
uniform float uUseAttributeColor;
// 设置
gl.uniform1f(timeLoc, value);</code></pre>
          <div class="var-example">本案例中：<strong>uTime 控制波形变形</strong></div>
        </div>

        <div class="compare-card varying-card">
          <div class="compare-header">
            <span class="var-badge varying">varying</span>
            <span class="var-scope">顶点→片段</span>
          </div>
          <p class="var-desc">顶点着色器输出，片段着色器接收，GPU 自动插值</p>
          <pre class="var-code"><code>// 声明（两端各一次）
varying vec3 vColor;
// 顶点着色器赋值
vColor = aColor;
// 片段着色器读取
gl_FragColor = vec4(vColor, 1.0);</code></pre>
          <div class="var-example">本案例中：<strong>颜色在三角形内平滑过渡</strong></div>
        </div>
      </div>
    </div>

    <div class="data-flow">
      <h4>🔄 数据流向图</h4>
      <div class="flow-chart">
        <div class="flow-level cpu-level">
          <span class="flow-label">CPU 端</span>
          <div class="flow-items">
            <span class="flow-tag attribute">attribute → aPosition, aColor</span>
            <span class="flow-tag uniform">uniform → uTime, uUseAttributeColor</span>
          </div>
        </div>
        <div class="flow-arrow-down">↓ 上传到 GPU</div>
        <div class="flow-level vs-level">
          <span class="flow-label">顶点着色器</span>
          <div class="flow-items">
            <span class="flow-tag attribute">读取 aPosition, aColor</span>
            <span class="flow-tag uniform">读取 uTime</span>
            <span class="flow-tag varying">输出 vColor = aColor</span>
          </div>
        </div>
        <div class="flow-arrow-down">↓ 光栅化插值</div>
        <div class="flow-level fs-level">
          <span class="flow-label">片段着色器</span>
          <div class="flow-items">
            <span class="flow-tag varying">读取插值后的 vColor</span>
            <span class="flow-tag uniform">读取 uTime, uUseAttributeColor</span>
            <span class="flow-tag output">输出 gl_FragColor</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>attribute 是逐顶点数据，通过 VBO 上传</li>
        <li>uniform 是全局数据，通过 uniform 函数设置</li>
        <li>varying 是顶点→片段的桥梁，GPU 自动插值</li>
        <li>gl.uniform* 函数必须在 useProgram 之后调用</li>
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

.control-group input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
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

.compare-section {
  margin-bottom: 16px;
}

.compare-section h4 {
  margin-bottom: 12px;
  color: var(--chestnut);
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.compare-card {
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
  background: var(--surface);
  transition: transform 0.2s ease;
}

.compare-card:hover {
  transform: translateY(-3px);
}

.attribute-card { border-color: var(--leaf-red); }
.uniform-card { border-color: var(--leaf-orange); }
.varying-card { border-color: var(--forest); }

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.var-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  color: #fff;
}

.var-badge.attribute { background: var(--leaf-red); }
.var-badge.uniform { background: var(--leaf-orange); }
.var-badge.varying { background: var(--forest); }

.var-scope {
  font-size: 11px;
  color: var(--muted);
}

.var-desc {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.6;
}

.var-code {
  margin: 0 0 8px;
  background: rgba(255, 218, 159, 0.5);
  border-radius: 6px;
  padding: 8px;
  font-size: 11px;
  overflow-x: auto;
}

.var-code code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}

.var-example {
  font-size: 11px;
  color: var(--muted);
}

.var-example strong {
  color: var(--chestnut);
}

.data-flow {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  background: var(--surface);
  margin-bottom: 16px;
}

.data-flow h4 {
  margin-bottom: 12px;
  color: var(--chestnut);
}

.flow-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flow-level {
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.cpu-level {
  background: rgba(217, 75, 38, 0.1);
  border: 1px solid var(--leaf-red);
}

.vs-level {
  background: rgba(240, 138, 36, 0.1);
  border: 1px solid var(--leaf-orange);
}

.fs-level {
  background: rgba(75, 109, 51, 0.1);
  border: 1px solid var(--forest);
}

.flow-label {
  font-weight: 700;
  color: var(--chestnut);
  min-width: 80px;
}

.flow-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.flow-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--border);
}

.flow-tag.attribute { border-color: var(--leaf-red); color: var(--leaf-red); }
.flow-tag.uniform { border-color: var(--leaf-orange); color: var(--leaf-orange); }
.flow-tag.varying { border-color: var(--forest); color: var(--forest); }
.flow-tag.output { border-color: var(--chestnut); color: var(--chestnut); }

.flow-arrow-down {
  text-align: center;
  color: var(--accent);
  font-size: 16px;
  font-weight: 700;
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
  .compare-grid {
    grid-template-columns: 1fr;
  }
}

[data-theme='dark'] .var-code {
  background: rgba(0, 0, 0, 0.25);
}

[data-theme='dark'] .flow-tag {
  background: rgba(0, 0, 0, 0.2);
}

[data-theme='dark'] .cpu-level {
  background: rgba(232, 98, 58, 0.12);
}

[data-theme='dark'] .vs-level {
  background: rgba(245, 160, 64, 0.12);
}

[data-theme='dark'] .fs-level {
  background: rgba(122, 181, 86, 0.12);
}

[data-theme='dark'] .tips-box {
  background: rgba(74, 52, 40, 0.3);
}

[data-theme='dark'] .tips-box code {
  background: rgba(246, 193, 90, 0.15);
  color: var(--chestnut);
}
</style>