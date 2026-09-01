const n=`<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glState = shallowRef<{
  gl: WebGLRenderingContext
  updateProg: WebGLProgram
  renderProg: WebGLProgram
  quadVBO: WebGLBuffer
  particleVBO: WebGLBuffer
  fboA: WebGLFramebuffer
  fboB: WebGLFramebuffer
  texA: WebGLTexture
  texB: WebGLTexture
  rafId: number
  readTex: WebGLTexture
  writeFBO: WebGLFramebuffer
  fps: number
  frameCount: number
  fpsTime: number
  lastTime: number
} | null>(null)

const particleCount = ref(4096)
const particleSize = ref(4.0)
const forceStrength = ref(1.0)
const animating = ref(true)
const fps = ref(0)
const showForceField = ref(false)

const textureSize = computed(() => {
  const n = particleCount.value
  return Math.ceil(Math.sqrt(n))
})

const updateVS = \`
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
\`

const updateFS = \`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_posTex;
uniform float u_time;
uniform float u_force;
uniform vec2 u_forceCenter;
void main() {
  vec4 posData = texture2D(u_posTex, v_uv);
  vec2 pos = posData.xy;
  vec2 vel = posData.zw;

  vec2 toCenter = u_forceCenter - pos;
  float dist = length(toCenter);
  float force = u_force * 0.5;
  if (dist > 0.01) {
    vel += normalize(toCenter) * force / max(dist, 0.1) * 0.02;
  }

  vel *= 0.98;
  pos += vel * 0.01;

  pos = fract(pos + 1.0);

  gl_FragColor = vec4(pos, vel);
}
\`

const renderVS = \`
attribute float a_index;
uniform sampler2D u_posTex;
uniform float u_texSize;
uniform float u_particleSize;
void main() {
  float x = mod(a_index, u_texSize) / u_texSize;
  float y = floor(a_index / u_texSize) / u_texSize;
  vec2 uv = vec2(x, y);
  vec4 posData = texture2D(u_posTex, uv);
  vec2 pos = posData.xy * 2.0 - 1.0;
  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = u_particleSize * (1.0 + 0.5 * sin(a_index * 0.1));
}
\`

const renderFS = \`
precision mediump float;
uniform float u_time;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float alpha = 1.0 - d * 2.0;
  float hue = 0.08 + 0.06 * sin(u_time + gl_FragCoord.x * 0.01);
  vec3 col = mix(vec3(0.95, 0.55, 0.2), vec3(0.6, 0.85, 0.35), hue);
  gl_FragColor = vec4(col, alpha);
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

function createFloatTexture(gl: WebGLRenderingContext, size: number, data: Float32Array | null, type: number) {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, type, data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  return tex
}

function createFBO(gl: WebGLRenderingContext, tex: WebGLTexture) {
  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return fbo
}

function initParticleData(count: number, texSize: number) {
  const data = new Float32Array(texSize * texSize * 4)
  const actualCount = Math.min(count, texSize * texSize)
  for (let i = 0; i < actualCount; i++) {
    const o = i * 4
    data[o + 0] = Math.random()
    data[o + 1] = Math.random()
    data[o + 2] = (Math.random() - 0.5) * 0.02
    data[o + 3] = (Math.random() - 0.5) * 0.02
  }
  return data
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
  const texSize = textureSize.value

  gl.bindFramebuffer(gl.FRAMEBUFFER, state.writeFBO)
  gl.viewport(0, 0, texSize, texSize)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(state.updateProg)
  gl.bindBuffer(gl.ARRAY_BUFFER, state.quadVBO)
  const posLoc = gl.getAttribLocation(state.updateProg, 'a_position')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, state.readTex)
  gl.uniform1i(gl.getUniformLocation(state.updateProg, 'u_posTex'), 0)
  gl.uniform1f(gl.getUniformLocation(state.updateProg, 'u_time'), time * 0.001)
  gl.uniform1f(gl.getUniformLocation(state.updateProg, 'u_force'), forceStrength.value)

  const fx = showForceField.value ? (Math.sin(time * 0.0005) * 0.3 + 0.5) : 0.5
  const fy = showForceField.value ? (Math.cos(time * 0.0007) * 0.3 + 0.5) : 0.5
  gl.uniform2f(gl.getUniformLocation(state.updateProg, 'u_forceCenter'), fx, fy)

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  const tempTex = state.readTex
  const tempFBO = state.writeFBO
  state.readTex = state.writeFBO === state.fboA ? state.texB : state.texA
  state.writeFBO = state.writeFBO === state.fboA ? state.fboB : state.fboA
  ;(state as any)._tempTex = tempTex
  ;(state as any)._tempFBO = tempFBO

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.09, 0.07, 0.05, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(state.renderProg)
  gl.bindBuffer(gl.ARRAY_BUFFER, state.particleVBO)
  const idxLoc = gl.getAttribLocation(state.renderProg, 'a_index')
  gl.enableVertexAttribArray(idxLoc)
  gl.vertexAttribPointer(idxLoc, 1, gl.FLOAT, false, 0, 0)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, state.readTex)
  gl.uniform1i(gl.getUniformLocation(state.renderProg, 'u_posTex'), 0)
  gl.uniform1f(gl.getUniformLocation(state.renderProg, 'u_texSize'), texSize)
  gl.uniform1f(gl.getUniformLocation(state.renderProg, 'u_particleSize'), particleSize.value)
  gl.uniform1f(gl.getUniformLocation(state.renderProg, 'u_time'), time * 0.001)

  const count = Math.min(particleCount.value, texSize * texSize)
  gl.drawArrays(gl.POINTS, 0, count)

  if (animating.value) {
    state.rafId = requestAnimationFrame(render)
  }
}

function buildParticleIndices(count: number) {
  const indices = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    indices[i] = i
  }
  return indices
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: false }) as WebGLRenderingContext
  if (!gl) {
    console.error('WebGL not supported')
    return
  }

  const floatExt = gl.getExtension('OES_texture_float')
  const type = floatExt ? gl.FLOAT : gl.UNSIGNED_BYTE

  const parent = canvas.parentElement!
  canvas.width = Math.min(parent.clientWidth, 480)
  canvas.height = Math.min(parent.clientWidth, 480)

  const texSize = textureSize.value
  const initData = initParticleData(particleCount.value, texSize)

  const texA = createFloatTexture(gl, texSize, initData, type)
  const texB = createFloatTexture(gl, texSize, null, type)

  const fboA = createFBO(gl, texA)
  const fboB = createFBO(gl, texB)

  const quadVBO = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1,
  ]), gl.STATIC_DRAW)

  const particleVBO = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, particleVBO)
  gl.bufferData(gl.ARRAY_BUFFER, buildParticleIndices(particleCount.value), gl.STATIC_DRAW)

  const updateProg = createProgram(gl, updateVS, updateFS)
  const renderProg = createProgram(gl, renderVS, renderFS)
  if (!updateProg || !renderProg) return

  glState.value = {
    gl,
    updateProg,
    renderProg,
    quadVBO,
    particleVBO,
    fboA,
    fboB,
    texA,
    texB,
    rafId: 0,
    readTex: texA,
    writeFBO: fboB,
    fps: 0,
    frameCount: 0,
    fpsTime: 0,
    lastTime: performance.now(),
  }

  glState.value!.rafId = requestAnimationFrame(render)
})

onUnmounted(() => {
  const state = glState.value
  if (state) {
    cancelAnimationFrame(state.rafId)
    state.gl.deleteProgram(state.updateProg)
    state.gl.deleteProgram(state.renderProg)
    state.gl.deleteBuffer(state.quadVBO)
    state.gl.deleteBuffer(state.particleVBO)
    state.gl.deleteFramebuffer(state.fboA)
    state.gl.deleteFramebuffer(state.fboB)
    state.gl.deleteTexture(state.texA)
    state.gl.deleteTexture(state.texB)
    state.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
})

const gpgpuSteps = [
  { step: '1', desc: '初始化粒子位置到浮点纹理 (RGBA: xy=位置, zw=速度)' },
  { step: '2', desc: '每帧在 FBO 中执行 Update Pass（全屏四边形）' },
  { step: '3', desc: '片段着色器采样位置纹理，计算力场/阻尼，写入新纹理' },
  { step: '4', desc: 'Ping-pong 交换：读/写纹理互换' },
  { step: '5', desc: 'Render Pass：用 gl.POINTS 绘制所有粒子' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 粒子系统与 GPU 计算 (GPGPU)</h3>
    <p class="summary">粒子位置存储在浮点纹理中，每帧通过 Ping-Pong FBO 在 GPU 端完成位置更新，无需 CPU 回读。</p>

    <div class="demo-layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef"></canvas>
        <div class="fps-badge">{{ fps }} FPS</div>
        <div class="count-badge">{{ particleCount }} 粒子</div>
      </div>

      <div class="control-panel">
        <h4>粒子控制</h4>

        <label class="control-item">
          <span>粒子数量：{{ particleCount }}</span>
          <input type="range" min="256" max="16384" step="256" v-model.number="particleCount" />
        </label>

        <label class="control-item">
          <span>粒子大小：{{ particleSize.toFixed(1) }}</span>
          <input type="range" min="1" max="12" step="0.5" v-model.number="particleSize" />
        </label>

        <label class="control-item">
          <span>力场强度：{{ forceStrength.toFixed(1) }}</span>
          <input type="range" min="0" max="5.0" step="0.1" v-model.number="forceStrength" />
        </label>

        <label class="control-item checkbox">
          <input type="checkbox" v-model="showForceField" />
          <span>显示移动力场中心</span>
        </label>

        <div class="code-display">
          <h5>GPGPU 核心: Ping-Pong 技术</h5>
          <pre><code>// Update Pass: 写入新位置
gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO);
gl.drawArrays(gl.TRIANGLES, 0, 6);

// 交换读写纹理
const tmp = readTex;
readTex = writeTex;
writeTex = tmp;</code></pre>
        </div>

        <div class="info-section">
          <h5>📚 GPGPU 流程</h5>
          <ol>
            <li v-for="s in gpgpuSteps" :key="s.step">
              <strong>{{ s.step }}.</strong> {{ s.desc }}
            </li>
          </ol>
        </div>

        <div class="code-display">
          <h5>更新着色器 (GLSL)</h5>
          <pre><code>// 位置 + 速度编码在 RGBA 中
vec4 posData = texture2D(u_posTex, uv);
vec2 pos = posData.xy;
vec2 vel = posData.zw;

// 力场吸引
vel += normalize(toCenter) * force / dist * 0.02;
vel *= 0.98; // 阻尼
pos += vel * 0.01;

gl_FragColor = vec4(pos, vel);</code></pre>
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
.count-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
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
  max-height: 130px;
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
.info-section ol {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
}
.info-section ol li {
  margin-bottom: 4px;
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
</style>`;export{n as default};
