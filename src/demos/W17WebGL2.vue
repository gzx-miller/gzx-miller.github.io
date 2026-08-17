<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glState = shallowRef<{
  gl: WebGLRenderingContext | WebGL2RenderingContext
  canvas: HTMLCanvasElement
  isWebGL2: boolean
  program: WebGLProgram
  vao: any
  vbo: WebGLBuffer
  ubo: WebGLBuffer | null
  texture3D: WebGLTexture | null
  rafId: number
} | null>(null)

const currentAPI = ref<'webgl1' | 'webgl2'>('webgl2')
const highlightFeature = ref<'ubo' | 'texture3d' | 'vao' | 'integer' | 'transform' | 'multiTarget'>('ubo')
const animating = ref(true)
const fps = ref(0)

const features = [
  { id: 'ubo', name: 'UBO 统一缓冲区', desc: 'Uniform Buffer Objects：多个着色器共享 uniform 数据，减少 CPU→GPU 更新开销。' },
  { id: 'texture3d', name: '3D 纹理', desc: '3D Texture：创建 volume 纹理，可用于体积渲染、颜色查找表 (LUT) 等。' },
  { id: 'vao', name: '原生 VAO', desc: 'Vertex Array Object：WebGL2 原生支持，封装属性配置，减少 draw call 切换开销。' },
  { id: 'integer', name: '整数纹理', desc: 'Integer Texture：支持 R32I 等整数格式，可用于 G-Buffer、ID 渲染等。' },
  { id: 'transform', name: 'Transform Feedback', desc: 'Transform Feedback：GPU 直接捕获顶点变换结果到缓冲区，无需 CPU 回读。' },
  { id: 'multiTarget', name: '多目标渲染', desc: 'Multi-Draw / MRT：一次 draw call 输出多个颜色附件，支持延迟渲染 (Deferred)。' },
]

const featureLabels: Record<string, string> = {}
features.forEach(f => { featureLabels[f.id] = f.name })

const vsSource = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec3 a_color;

layout(std140) uniform SharedData {
  float u_time;
  vec2 u_resolution;
  float u_intensity;
};

out vec3 v_color;
out float v_depth;

void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  v_depth = pos.y * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`

const fsSource = `#version 300 es
precision highp float;
in vec3 v_color;
in float v_depth;

layout(std140) uniform SharedData {
  float u_time;
  vec2 u_resolution;
  float u_intensity;
};

out vec4 fragColor;

uniform sampler3D u_lut;

void main() {
  vec3 lutCoord = vec3(v_depth, 0.5, 0.5);
  vec3 lutColor = texture(u_lut, lutCoord).rgb;
  vec3 finalColor = mix(v_color, lutColor, u_intensity);
  fragColor = vec4(finalColor, 1.0);
}
`

const vsSource1 = `
attribute vec2 a_position;
attribute vec3 a_color;
uniform float u_time;
uniform float u_intensity;
varying vec3 v_color;
varying float v_depth;
void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  v_depth = pos.y * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`

const fsSource1 = `
precision mediump float;
varying vec3 v_color;
varying float v_depth;
uniform float u_intensity;
void main() {
  vec3 finalColor = mix(v_color, vec3(v_depth, v_depth * 0.8, 1.0 - v_depth), u_intensity);
  gl_FragColor = vec4(finalColor, 1.0);
}
`

function createShader(gl: any, type: number, source: string): WebGLShader | null {
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

function createProgram(gl: any, vs: string, fs: string): WebGLProgram | null {
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

function create3DLUT(gl3: WebGL2RenderingContext): WebGLTexture | null {
  const size = 16
  const data = new Uint8Array(size * size * size * 4)
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        const idx = (x * size * size + y * size + z) * 4
        const t = z / (size - 1)
        data[idx] = Math.floor(180 + t * 60)
        data[idx + 1] = Math.floor(80 + t * 40)
        data[idx + 2] = Math.floor(30 + (1 - t) * 50)
        data[idx + 3] = 255
      }
    }
  }
  const tex = gl3.createTexture()!
  gl3.bindTexture(gl3.TEXTURE_3D, tex)
  gl3.texImage3D(gl3.TEXTURE_3D, 0, gl3.RGBA, size, size, size, 0, gl3.RGBA, gl3.UNSIGNED_BYTE, data)
  gl3.texParameteri(gl3.TEXTURE_3D, gl3.TEXTURE_MIN_FILTER, gl3.LINEAR)
  gl3.texParameteri(gl3.TEXTURE_3D, gl3.TEXTURE_MAG_FILTER, gl3.LINEAR)
  gl3.texParameteri(gl3.TEXTURE_3D, gl3.TEXTURE_WRAP_S, gl3.CLAMP_TO_EDGE)
  gl3.texParameteri(gl3.TEXTURE_3D, gl3.TEXTURE_WRAP_T, gl3.CLAMP_TO_EDGE)
  gl3.texParameteri(gl3.TEXTURE_3D, gl3.TEXTURE_WRAP_R, gl3.CLAMP_TO_EDGE)
  return tex
}

function createUBO(gl3: WebGL2RenderingContext): WebGLBuffer {
  const ubo = gl3.createBuffer()!
  gl3.bindBuffer(gl3.UNIFORM_BUFFER, ubo)
  const data = new Float32Array([
    0, 0,
    0, 0,
    0.6,
    0, 0, 0,
  ])
  gl3.bufferData(gl3.UNIFORM_BUFFER, data, gl3.DYNAMIC_DRAW)
  gl3.bindBuffer(gl3.UNIFORM_BUFFER, null)
  return ubo
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
  const canvas = state.canvas!
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.09, 0.07, 0.05, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const quadData = new Float32Array([
    -0.5, -0.5, 0.9, 0.4, 0.2,
     0.5, -0.5, 0.2, 0.8, 0.4,
    -0.5,  0.5, 0.3, 0.6, 0.9,
     0.5,  0.5, 0.9, 0.4, 0.2,
  ])

  gl.bindBuffer(gl.ARRAY_BUFFER, state.vbo)
  gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.DYNAMIC_DRAW)

  gl.useProgram(state.program)

  if (state.isWebGL2) {
    const gl3 = gl as WebGL2RenderingContext
    gl3.bindVertexArray(state.vao)

    const uboData = new Float32Array([
      time * 0.001, 0,
      canvas.width, canvas.height,
      0.6,
      0, 0, 0,
    ])
    gl3.bindBuffer(gl3.UNIFORM_BUFFER, state.ubo)
    gl3.bufferSubData(gl3.UNIFORM_BUFFER, 0, uboData)
    gl3.bindBufferBase(gl3.UNIFORM_BUFFER, 0, state.ubo)

    gl3.activeTexture(gl3.TEXTURE0)
    gl3.bindTexture(gl3.TEXTURE_3D, state.texture3D)
    gl3.uniform1i(gl3.getUniformLocation(state.program, 'u_lut'), 0)

    gl3.drawArrays(gl3.TRIANGLE_STRIP, 0, 4)
  } else {
    const gl1 = gl as WebGLRenderingContext
    const posLoc = gl1.getAttribLocation(state.program, 'a_position')
    const colLoc = gl1.getAttribLocation(state.program, 'a_color')
    gl1.enableVertexAttribArray(posLoc)
    gl1.vertexAttribPointer(posLoc, 2, gl1.FLOAT, false, 20, 0)
    gl1.enableVertexAttribArray(colLoc)
    gl1.vertexAttribPointer(colLoc, 3, gl1.FLOAT, false, 20, 8)

    gl1.uniform1f(gl1.getUniformLocation(state.program, 'u_time'), time * 0.001)
    gl1.uniform1f(gl1.getUniformLocation(state.program, 'u_intensity'), 0.6)
    gl1.drawArrays(gl1.TRIANGLE_STRIP, 0, 4)
  }

  if (animating.value) {
    state.rafId = requestAnimationFrame(render)
  }
}

function destroyState() {
  const state = glState.value
  if (state) {
    cancelAnimationFrame(state.rafId)
    state.gl.deleteProgram(state.program)
    state.gl.deleteBuffer(state.vbo)
    if (state.isWebGL2) {
      const gl3 = state.gl as WebGL2RenderingContext
      if (state.vao) gl3.deleteVertexArray(state.vao)
      if (state.ubo) gl3.deleteBuffer(state.ubo)
      if (state.texture3D) gl3.deleteTexture(state.texture3D)
    }
    state.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}

function initAPI(api: 'webgl1' | 'webgl2') {
  destroyState()
  const canvas = canvasRef.value
  if (!canvas) return

  const isWebGL2 = api === 'webgl2'
  const gl = isWebGL2
    ? canvas.getContext('webgl2', { antialias: true }) as WebGL2RenderingContext
    : canvas.getContext('webgl', { antialias: true }) as WebGLRenderingContext

  if (!gl) {
    console.error(`Cannot get ${api} context`)
    return
  }

  const w = canvas.clientWidth || 400
  const h = canvas.clientHeight || 300
  canvas.width = w
  canvas.height = h

  const source = isWebGL2 ? vsSource : vsSource1
  const fs = isWebGL2 ? fsSource : fsSource1
  const program = createProgram(gl, source, fs)
  if (!program) return

  const vbo = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)

  let vao: any = null
  let ubo: WebGLBuffer | null = null
  let texture3D: WebGLTexture | null = null

  if (isWebGL2) {
    const gl3 = gl as WebGL2RenderingContext
    vao = gl3.createVertexArray()
    gl3.bindVertexArray(vao)

    const posLoc = 0
    const colLoc = 1
    gl3.enableVertexAttribArray(posLoc)
    gl3.vertexAttribPointer(posLoc, 2, gl3.FLOAT, false, 20, 0)
    gl3.enableVertexAttribArray(colLoc)
    gl3.vertexAttribPointer(colLoc, 3, gl3.FLOAT, false, 20, 8)

    ubo = createUBO(gl3)

    const uboIndex = gl3.getUniformBlockIndex(program, 'SharedData')
    gl3.uniformBlockBinding(program, uboIndex, 0)

    texture3D = create3DLUT(gl3)
  }

  glState.value = {
    gl,
    canvas,
    isWebGL2,
    program,
    vao,
    vbo,
    ubo,
    texture3D,
    rafId: 0,
  }

  glState.value!.rafId = requestAnimationFrame(render)
}

onMounted(() => {
  initAPI(currentAPI.value)
})

onUnmounted(() => {
  destroyState()
})

function switchAPI(api: 'webgl1' | 'webgl2') {
  currentAPI.value = api
  initAPI(api)
}

const selectedFeatureInfo = computed(() => {
  return features.find(f => f.id === highlightFeature.value) || features[0]
})

const codeSnippets = computed(() => ({
  ubo: `// WebGL2 UBO 声明与绑定
layout(std140) uniform SharedData {
  float u_time;
  vec2 u_resolution;
  float u_intensity;
};

// 绑定到 uniform 绑定点 0
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);
gl.uniformBlockBinding(program, blockIndex, 0);`,
  texture3d: `// 创建 3D 纹理 (体积纹理 / LUT)
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_3D, tex);
gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA,
  size, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

// 着色器中采样
vec3 lutColor = texture(u_lut, vec3(u, v, w)).rgb;`,
  vao: `// WebGL2 原生 VAO
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// 配置属性
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 20, 0);
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 20, 8);

// 一次绑定，切换时直接使用
gl.bindVertexArray(vao);`,
  integer: `// 整数纹理用于 ID 渲染 / G-Buffer
gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32I,
  width, height, 0, gl.RED_INTEGER, gl.INT, null);

// 着色器中读写
layout(binding = 0, r32i) uniform readonly highp isampler2D idTex;
int objectId = texture(idTex, uv).r;`,
  transform: `// Transform Feedback 捕获顶点输出
const tf = gl.createTransformFeedback();
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

// 将 varying 绑定到缓冲区
gl.transformFeedbackVaryings(program,
  ['v_position', 'v_velocity'], gl.INTERLEAVED_ATTRIBS);

gl.beginTransformFeedback(gl.POINTS);
gl.drawArrays(gl.POINTS, 0, count);
gl.endTransformFeedback();`,
  multiTarget: `// 多目标渲染 (MRT)
const attachments = [
  gl.COLOR_ATTACHMENT0, // 颜色
  gl.COLOR_ATTACHMENT1, // 法线
  gl.COLOR_ATTACHMENT2, // 深度
];
gl.drawBuffers(attachments);

// 一次 draw call 输出多个 G-Buffer
// 用于延迟渲染 (Deferred Shading)`,
}))
</script>

<template>
  <div class="demo-card">
    <h3>🌰 WebGL2 新特性</h3>
    <p class="summary">对比 WebGL1 与 WebGL2 的 API 差异，展示 UBO、3D 纹理、VAO 原生支持等核心新特性。</p>

    <div class="demo-layout">
      <div class="canvas-wrap">
        <canvas ref="canvasRef"></canvas>
        <div class="fps-badge">{{ fps }} FPS</div>
        <div class="api-badge" :class="currentAPI">
          {{ currentAPI === 'webgl2' ? 'WebGL2' : 'WebGL1' }}
        </div>
      </div>

      <div class="control-panel">
        <h4>API 切换</h4>
        <div class="api-switch">
          <button
            :class="{ active: currentAPI === 'webgl1' }"
            @click="switchAPI('webgl1')"
          >WebGL1</button>
          <button
            :class="{ active: currentAPI === 'webgl2' }"
            @click="switchAPI('webgl2')"
          >WebGL2</button>
        </div>

        <h4>特性亮点</h4>
        <div class="feature-list">
          <button
            v-for="f in features"
            :key="f.id"
            :class="['feature-btn', { active: highlightFeature === f.id, disabled: currentAPI === 'webgl1' }]"
            :disabled="currentAPI === 'webgl1'"
            @click="highlightFeature = f.id as any"
          >{{ f.name }}</button>
        </div>

        <div class="feature-info" v-if="currentAPI === 'webgl2'">
          <h5>{{ selectedFeatureInfo.name }}</h5>
          <p>{{ selectedFeatureInfo.desc }}</p>
        </div>
        <div class="feature-info webgl1-hint" v-else>
          <h5>💡 切换到 WebGL2 查看特性演示</h5>
          <p>选择 WebGL2 后可体验 UBO、3D 纹理、原生 VAO 等 ES3.0 新特性。</p>
        </div>

        <div class="code-display">
          <h5>关键 GLSL / API 代码</h5>
          <pre><code>{{ codeSnippets[highlightFeature] }}</code></pre>
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
.api-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}
.api-badge.webgl1 { background: var(--muted); }
.api-badge.webgl2 { background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange)); }
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.control-panel h4 {
  margin: 0;
  color: var(--accent);
}
.api-switch {
  display: flex;
  gap: 8px;
}
.api-switch button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.api-switch button.active {
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  color: #fff;
  border-color: transparent;
}
.feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.feature-btn {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.feature-btn:hover:not(.disabled) {
  border-color: var(--leaf-orange);
}
.feature-btn.active {
  background: rgba(240, 138, 36, 0.2);
  border-color: var(--leaf-orange);
  color: var(--chestnut);
}
.feature-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.feature-info {
  background: rgba(246, 193, 90, 0.1);
  border: 1px solid rgba(246, 193, 90, 0.3);
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  line-height: 1.6;
}
.feature-info h5 {
  margin: 0 0 6px;
  color: var(--chestnut);
}
.feature-info p {
  margin: 0;
  color: var(--text);
}
.feature-info.webgl1-hint {
  background: rgba(124, 86, 63, 0.1);
  border-color: rgba(124, 86, 63, 0.3);
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
  max-height: 180px;
}
.code-display code {
  color: var(--forest);
  font-family: ui-monospace, monospace;
}
[data-theme='dark'] .code-display {
  background: rgba(246, 193, 90, 0.08);
  border-color: rgba(246, 193, 90, 0.2);
}
[data-theme='dark'] .code-display code {
  color: var(--leaf-gold);
}
[data-theme='dark'] .feature-info {
  background: rgba(246, 193, 90, 0.08);
  border-color: rgba(246, 193, 90, 0.2);
}
</style>