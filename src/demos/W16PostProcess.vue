<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glState = shallowRef<{
  gl: WebGLRenderingContext
  canvas: HTMLCanvasElement
  program: WebGLProgram
  fboProgram: WebGLProgram
  vbo: WebGLBuffer
  fbo: WebGLFramebuffer
  fboTexture: WebGLTexture
  rbo: WebGLRenderbuffer
  rafId: number
  sceneInfo?: any
} | null>(null)

const effectType = ref<'bloom' | 'blur' | 'grayscale' | 'none'>('bloom')
const intensity = ref(0.6)
const chainBlur = ref(true)
const animating = ref(true)
const fps = ref(0)

const effectLabels: Record<string, string> = {
  bloom: 'Bloom 泛光',
  blur: 'Gaussian Blur 高斯模糊',
  grayscale: 'Grayscale 灰度化',
  none: '原始渲染',
}

const postFragShader = `
precision mediump float;
uniform sampler2D u_scene;
uniform int u_effect;
uniform float u_intensity;
uniform float u_time;
varying vec2 v_uv;

void main() {
  vec4 color = texture2D(u_scene, v_uv);

  if (u_effect == 0) {
    vec3 gray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));
    gl_FragColor = vec4(mix(color.rgb, gray, u_intensity), 1.0);
  } else if (u_effect == 1) {
    vec3 bloomSum = vec3(0.0);
    float threshold = 0.8;
    if (length(color.rgb) > threshold) {
      bloomSum = color.rgb * u_intensity;
    }
    float s = sin(u_time) * 0.1 + 1.0;
    gl_FragColor = vec4(color.rgb + bloomSum * s, 1.0);
  } else if (u_effect == 2) {
    vec3 sum = vec3(0.0);
    float step = 0.004 * u_intensity;
    sum += texture2D(u_scene, v_uv + vec2(-step, -step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(-step, 0.0)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(-step, step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(0.0, -step)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv).rgb * 0.38774;
    sum += texture2D(u_scene, v_uv + vec2(0.0, step)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(step, -step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(step, 0.0)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(step, step)).rgb * 0.06136;
    gl_FragColor = vec4(sum, 1.0);
  } else {
    gl_FragColor = color;
  }
}
`

const sceneVertShader = `
attribute vec2 a_position;
attribute vec3 a_color;
uniform float u_time;
varying vec3 v_color;
varying vec2 v_uv;

void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  gl_Position = vec4(pos, 0.0, 1.0);
  v_uv = a_position * 0.5 + 0.5;
}
`

const sceneFragShader = `
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`

const postVertShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram | null {
  const vert = createShader(gl, gl.VERTEX_SHADER, vs)
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fs)
  if (!vert || !frag) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program))
    return null
  }
  return program
}

function initScene(gl: WebGLRenderingContext) {
  const sceneProgram = createProgram(gl, sceneVertShader, sceneFragShader)
  if (!sceneProgram) return null

  const quadData = new Float32Array([
    -0.5, -0.5, 1.0, 0.3, 0.2,
     0.5, -0.5, 0.2, 0.8, 0.4,
    -0.5,  0.5, 0.3, 0.6, 0.9,
     0.5,  0.5, 0.9, 0.4, 0.2,
  ])

  const quadData2 = new Float32Array([
    -0.8, -0.2, 0.9, 0.7, 0.3,
    -0.3,  0.3, 0.2, 0.9, 0.6,
    -0.8,  0.3, 0.5, 0.3, 0.8,
  ])

  const quadData3 = new Float32Array([
    0.2, -0.3, 0.4, 0.2, 0.7,
    0.8, -0.1, 0.8, 0.6, 0.2,
    0.5,  0.4, 0.3, 0.8, 0.5,
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  const totalLen = quadData.length + quadData2.length + quadData3.length
  const merged = new Float32Array(totalLen)
  merged.set(quadData, 0)
  merged.set(quadData2, quadData.length)
  merged.set(quadData3, quadData.length + quadData2.length)
  gl.bufferData(gl.ARRAY_BUFFER, merged, gl.STATIC_DRAW)

  return { program: sceneProgram, buffer, count: 9, stride: 5 }
}

function initFBO(gl: WebGLRenderingContext, width: number, height: number) {
  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)

  const texture = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  const rbo = gl.createRenderbuffer()!
  gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { fbo, texture, rbo }
}

let lastTime = 0
let frameCount = 0
let fpsTime = 0

function render(time: number) {
  const state = glState.value
  if (!state) return

  const dt = time - lastTime
  lastTime = time
  frameCount++
  fpsTime += dt
  if (fpsTime >= 500) {
    fps.value = Math.round((frameCount * 1000) / fpsTime)
    frameCount = 0
    fpsTime = 0
  }

  const gl = state.gl
  const w = state.canvas!.width
  const h = state.canvas!.height

  gl.bindFramebuffer(gl.FRAMEBUFFER, state.fbo)
  gl.viewport(0, 0, w, h)
  gl.clearColor(0.09, 0.07, 0.05, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)

  const sceneInfo = (state as any).sceneInfo
  gl.useProgram(sceneInfo.program)
  gl.bindBuffer(gl.ARRAY_BUFFER, sceneInfo.buffer)

  const posLoc = gl.getAttribLocation(sceneInfo.program, 'a_position')
  const colLoc = gl.getAttribLocation(sceneInfo.program, 'a_color')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 20, 0)
  gl.enableVertexAttribArray(colLoc)
  gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 20, 8)

  gl.uniform1f(gl.getUniformLocation(sceneInfo.program, 'u_time'), time * 0.001)
  gl.drawArrays(gl.TRIANGLES, 0, sceneInfo.count)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, w, h)
  gl.clearColor(0.09, 0.07, 0.05, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.disable(gl.DEPTH_TEST)

  const program = state.fboProgram
  gl.useProgram(program)

  const quadBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1,
  ]), gl.STATIC_DRAW)

  const posLoc2 = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(posLoc2)
  gl.vertexAttribPointer(posLoc2, 2, gl.FLOAT, false, 0, 0)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, state.fboTexture)
  gl.uniform1i(gl.getUniformLocation(program, 'u_scene'), 0)

  const effectMap = { bloom: 1, blur: 2, grayscale: 0, none: -1 }
  gl.uniform1i(gl.getUniformLocation(program, 'u_effect'), effectMap[effectType.value])
  gl.uniform1f(gl.getUniformLocation(program, 'u_intensity'), intensity.value)
  gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time * 0.001)

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  gl.deleteBuffer(quadBuf)

  if (animating.value) {
    state.rafId = requestAnimationFrame(render)
  }
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement!
  const size = Math.min(parent.clientWidth, 480)
  canvas.width = size
  canvas.height = size
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: false }) as WebGLRenderingContext
  if (!gl) {
    console.error('WebGL not supported')
    return
  }

  resizeCanvas()
  const w = canvas.width
  const h = canvas.height

  const sceneInfo = initScene(gl)
  if (!sceneInfo) return

  const postProgram = createProgram(gl, postVertShader, postFragShader)
  if (!postProgram) return

  const { fbo, texture, rbo } = initFBO(gl, w, h)

  const state: any = {
    gl,
    canvas,
    program: sceneInfo.program,
    fboProgram: postProgram,
    fbo,
    fboTexture: texture,
    rbo,
    rafId: 0,
    sceneInfo,
  }

  glState.value = state

  const ro = new ResizeObserver(() => {
    resizeCanvas()
    const w2 = canvas.width
    const h2 = canvas.height
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.deleteTexture(texture)
    gl.deleteFramebuffer(fbo)
    gl.deleteRenderbuffer(rbo)
    const newFbo = initFBO(gl, w2, h2)
    state.fbo = newFbo.fbo
    state.fboTexture = newFbo.texture
    state.rbo = newFbo.rbo
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  })
  ro.observe(canvas.parentElement!)

  state.rafId = requestAnimationFrame(render)
})

onUnmounted(() => {
  const state = glState.value
  if (state) {
    cancelAnimationFrame(state.rafId)
    state.gl.deleteProgram(state.program)
    state.gl.deleteProgram(state.fboProgram)
    state.gl.deleteFramebuffer(state.fbo)
    state.gl.deleteTexture(state.fboTexture)
    state.gl.deleteRenderbuffer(state.rbo)
    state.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
})

const codeSnippets = computed(() => ({
  bloom: `// Bloom 提取高亮 + 叠加
if (u_effect == 1) {
  vec3 bloomSum = vec3(0.0);
  float threshold = 0.8;
  if (length(color.rgb) > threshold) {
    bloomSum = color.rgb * u_intensity;
  }
  gl_FragColor = vec4(color.rgb + bloomSum, 1.0);
}`,
  blur: `// Gaussian 3x3 采样
vec3 sum = vec3(0.0);
float step = 0.004 * u_intensity;
sum += texture2D(u_scene, v_uv + vec2(-step, -step)).rgb * 0.06136;
sum += texture2D(u_scene, v_uv + vec2(0.0, -step)).rgb * 0.24477;
// ... 9 tap Gaussian
gl_FragColor = vec4(sum, 1.0);`,
  grayscale: `// 亮度加权灰度化
vec3 gray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));
gl_FragColor = vec4(mix(color.rgb, gray, u_intensity), 1.0);`,
  none: `// 直接输出场景颜色
gl_FragColor = color;`,
}))
</script>

<template>
  <div class="demo-card">
    <h3>🌰 后处理效果</h3>
    <p class="summary">场景渲染到 FBO 后，通过全屏四边形在片段着色器中实现 Bloom / 高斯模糊 / 灰度化。</p>

    <div class="demo-layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef"></canvas>
        <div class="fps-badge">{{ fps }} FPS</div>
      </div>

      <div class="control-panel">
        <h4>效果控制</h4>
        <label class="control-item">
          <span>后处理效果</span>
          <select v-model="effectType">
            <option value="none">原始渲染</option>
            <option value="bloom">Bloom 泛光</option>
            <option value="blur">高斯模糊</option>
            <option value="grayscale">灰度化</option>
          </select>
        </label>

        <label class="control-item">
          <span>强度：{{ (intensity * 100).toFixed(0) }}%</span>
          <input type="range" min="0" max="1" step="0.01" v-model.number="intensity" />
        </label>

        <label class="control-item checkbox">
          <input type="checkbox" v-model="animating" />
          <span>播放动画</span>
        </label>

        <div class="code-display">
          <h5>片段着色器关键代码</h5>
          <pre><code>{{ codeSnippets[effectType] }}</code></pre>
        </div>

        <div class="info-section">
          <h5>📚 全屏四边形技术</h5>
          <ul>
            <li>场景渲染到 FBO 纹理</li>
            <li>创建覆盖全屏的四边形 (Fullscreen Quad)</li>
            <li>片段着色器对纹理采样实现效果</li>
            <li>多个 Pass 串联为后处理管线</li>
          </ul>
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
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.control-panel h4 {
  margin: 0 0 4px;
  color: var(--accent);
}
.control-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}
.control-item.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.control-item input[type="range"] {
  width: 100%;
  accent-color: var(--leaf-red);
}
.control-item select {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
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
.info-section ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
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
</style>