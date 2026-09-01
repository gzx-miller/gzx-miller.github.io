const n=`<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const gl = shallowRef<WebGLRenderingContext | null>(null)
const rafId = shallowRef<number>(0)

const rotationSpeed = ref(1.0)
const useInterpolation = ref(true)

const vertexSource = \`attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform float uRotation;
void main() {
  float c = cos(uRotation);
  float s = sin(uRotation);
  vec2 rotated = vec2(
    aPosition.x * c - aPosition.y * s,
    aPosition.x * s + aPosition.y * c
  );
  gl_Position = vec4(rotated, 0.0, 1.0);
  vColor = aColor;
}\`

const fragmentSource = \`precision mediump float;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}\`

const flatFragmentSource = \`precision mediump float;
uniform vec3 uFlatColor;
void main() {
  gl_FragColor = vec4(uFlatColor, 1.0);
}\`

let program: WebGLProgram | null = null
let buffer: WebGLBuffer | null = null
let positionLoc: number = -1
let colorLoc: number = -1
let rotationLoc: WebGLUniformLocation | null = null
let flatColorLoc: WebGLUniformLocation | null = null
let currentRotation = 0

const vertices = new Float32Array([
  0.0, 0.7,   1.0, 0.3, 0.0,
  -0.6, -0.5, 0.0, 0.8, 0.2,
  0.6, -0.5,   0.2, 0.4, 0.9,
])

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

function buildProgram(vertSrc: string, fragSrc: string): WebGLProgram | null {
  const ctx = gl.value
  if (!ctx) return null
  const vs = compile(ctx.VERTEX_SHADER, vertSrc)
  const fs = compile(ctx.FRAGMENT_SHADER, fragSrc)
  if (!vs || !fs) return null
  const prog = ctx.createProgram()!
  ctx.attachShader(prog, vs)
  ctx.attachShader(prog, fs)
  ctx.linkProgram(prog)
  if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
    console.error(ctx.getProgramInfoLog(prog))
    return null
  }
  return prog
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

  program = buildProgram(vertexSource, useInterpolation.value ? fragmentSource : flatFragmentSource)
  if (!program) return

  positionLoc = ctx.getAttribLocation(program, 'aPosition')
  colorLoc = ctx.getAttribLocation(program, 'aColor')
  rotationLoc = ctx.getUniformLocation(program, 'uRotation')
  flatColorLoc = ctx.getUniformLocation(program, 'uFlatColor')

  buffer = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
  ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW)
}

function rebuildProgram() {
  const ctx = gl.value
  if (!ctx) return
  if (program) ctx.deleteProgram(program)
  program = buildProgram(vertexSource, useInterpolation.value ? fragmentSource : flatFragmentSource)
  if (!program) return
  positionLoc = ctx.getAttribLocation(program, 'aPosition')
  colorLoc = ctx.getAttribLocation(program, 'aColor')
  rotationLoc = ctx.getUniformLocation(program, 'uRotation')
  flatColorLoc = ctx.getUniformLocation(program, 'uFlatColor')
}

watch(useInterpolation, () => {
  rebuildProgram()
})

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

  if (useInterpolation.value && colorLoc >= 0) {
    ctx.enableVertexAttribArray(colorLoc)
    ctx.vertexAttribPointer(colorLoc, 3, ctx.FLOAT, false, stride, 2 * 4)
  }

  currentRotation += 0.015 * rotationSpeed.value
  if (rotationLoc) {
    ctx.uniform1f(rotationLoc, currentRotation)
  }

  if (!useInterpolation.value && flatColorLoc) {
    ctx.uniform3f(flatColorLoc, 0.85, 0.55, 0.25)
  }

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
<\/script>

<template>
  <div class="demo-card">
    <h3>GLSL 着色器编程基础</h3>
    <p class="desc">
      旋转的彩色三角形演示顶点着色器和片段着色器的协作，通过 varying 实现颜色在光栅化阶段的平滑插值。
    </p>

    <div class="grid">
      <div class="canvas-wrap">
        <canvas ref="canvasRef" width="400" height="300"></canvas>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">⚙️ 旋转速度: {{ rotationSpeed.toFixed(1) }}</label>
          <input type="range" min="0" max="5" step="0.1" v-model.number="rotationSpeed" />
        </div>

        <div class="control-group">
          <label class="control-label">🎨 颜色模式</label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="useInterpolation" />
            <span>启用颜色插值 (varying)</span>
          </label>
          <p class="hint">
            勾选：三个顶点各自传颜色，GPU 在三角形内部平滑过渡<br/>
            取消：整个三角形使用 uniform 传入的单一颜色
          </p>
        </div>
      </div>
    </div>

    <div class="shader-section">
      <h4>📐 顶点着色器 (Vertex Shader)</h4>
      <pre class="mini-code"><code>{{ vertexSource }}</code></pre>
    </div>

    <div class="shader-section">
      <h4>🎨 片段着色器 (Fragment Shader) — {{ useInterpolation ? '插值模式' : '单色模式' }}</h4>
      <pre class="mini-code"><code>{{ useInterpolation ? fragmentSource : flatFragmentSource }}</code></pre>
    </div>

    <div class="flow-diagram">
      <h4>🔄 数据流：varying 的传递过程</h4>
      <div class="flow-nodes">
        <div class="flow-node vertex-node">
          <span class="node-icon">📐</span>
          <strong>顶点着色器</strong>
          <code>vColor = aColor</code>
          <small>每个顶点输出颜色值</small>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-node raster-node">
          <span class="node-icon">🔲</span>
          <strong>光栅化</strong>
          <code>插值 vColor</code>
          <small>GPU 在三角形内部线性插值</small>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-node fragment-node">
          <span class="node-icon">🎨</span>
          <strong>片段着色器</strong>
          <code>gl_FragColor = vec4(vColor, 1.0)</code>
          <small>每个像素获得平滑颜色</small>
        </div>
      </div>
    </div>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li><code>attribute</code> 从 CPU 传到每个顶点（顶点独有）</li>
        <li><code>varying</code> 顶点→片段，GPU 自动插值</li>
        <li><code>uniform</code> 单次设置，所有顶点/片段共享</li>
        <li>顶点着色器做变换，片段着色器定颜色</li>
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

.shader-section {
  margin-bottom: 16px;
}

.shader-section h4 {
  margin-bottom: 8px;
  color: var(--chestnut);
}

.flow-diagram {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  background: var(--surface);
  margin-bottom: 16px;
}

.flow-diagram h4 {
  margin-bottom: 14px;
  color: var(--chestnut);
}

.flow-nodes {
  display: flex;
  align-items: stretch;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.flow-node {
  flex: 1;
  min-width: 140px;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.2s ease;
}

.flow-node:hover {
  transform: translateY(-2px);
}

.vertex-node {
  background: rgba(217, 75, 38, 0.1);
  border: 2px solid var(--leaf-red);
}

.raster-node {
  background: rgba(240, 138, 36, 0.1);
  border: 2px solid var(--leaf-orange);
}

.fragment-node {
  background: rgba(123, 53, 29, 0.1);
  border: 2px solid var(--chestnut);
}

.node-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 4px;
}

.flow-node strong {
  display: block;
  color: var(--chestnut);
  margin-bottom: 4px;
}

.flow-node code {
  display: block;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.5);
  padding: 3px 6px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.flow-node small {
  color: var(--muted);
  font-size: 11px;
}

.flow-arrow {
  display: flex;
  align-items: center;
  color: var(--accent);
  font-size: 24px;
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
  .flow-nodes {
    flex-direction: column;
  }
  .flow-arrow {
    transform: rotate(90deg);
    justify-content: center;
  }
}

[data-theme='dark'] .vertex-node {
  background: rgba(232, 98, 58, 0.15);
}

[data-theme='dark'] .raster-node {
  background: rgba(245, 160, 64, 0.15);
}

[data-theme='dark'] .fragment-node {
  background: rgba(240, 192, 144, 0.1);
}

[data-theme='dark'] .flow-node code {
  background: rgba(0, 0, 0, 0.25);
}

[data-theme='dark'] .tips-box {
  background: rgba(74, 52, 40, 0.3);
}

[data-theme='dark'] .tips-box code {
  background: rgba(246, 193, 90, 0.15);
  color: var(--chestnut);
}
</style>`;export{n as default};
