const n=`<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)

const ambientIntensity = ref(0.25)
const lightAngle = ref(45)
const lightHeight = ref(60)
const materialColor = ref('#f08a24')
const showNormalDot = ref(true)

const rafId = ref(0)
const sphereRotation = ref(0)

const shaderVs = \`attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
varying vec3 vNormalWorld;
void main() {
  vec4 worldPos = uModel * vec4(aPosition, 1.0);
  vNormalWorld = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjection * uView * worldPos;
}\`

const shaderFs = \`precision mediump float;
varying vec3 vNormalWorld;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uMaterialColor;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  float NdotL = max(dot(N, L), 0.0);
  vec3 ambient = uAmbient * uMaterialColor;
  vec3 diffuse = uMaterialColor * NdotL;
  gl_FragColor = vec4(ambient + diffuse, 1.0);
}\`

function createSphere(latBands: number, longBands: number, radius: number) {
  const vertices: number[] = []
  const normals: number[] = []
  const indices: number[] = []
  for (let lat = 0; lat <= latBands; lat++) {
    const theta = (lat * Math.PI) / latBands
    const sinT = Math.sin(theta)
    const cosT = Math.cos(theta)
    for (let lon = 0; lon <= longBands; lon++) {
      const phi = (lon * 2 * Math.PI) / longBands
      const sinP = Math.sin(phi)
      const cosP = Math.cos(phi)
      const x = cosP * sinT
      const y = cosT
      const z = sinP * sinT
      normals.push(x, y, z)
      vertices.push(radius * x, radius * y, radius * z)
    }
  }
  for (let lat = 0; lat < latBands; lat++) {
    for (let lon = 0; lon < longBands; lon++) {
      const first = lat * (longBands + 1) + lon
      const second = first + longBands + 1
      indices.push(first, second, first + 1)
      indices.push(second, second + 1, first + 1)
    }
  }
  return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) }
}

function mat4Identity() {
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])
}

function mat4Perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  return new Float32Array([
    f/aspect,0,0,0,
    0,f,0,0,
    0,0,(far+near)*nf,-1,
    0,0,2*far*near*nf,0
  ])
}

function mat4LookAt(eye: number[], center: number[], up: number[]) {
  const [ex,ey,ez] = eye
  const [cx,cy,cz] = center
  const [ux,uy,uz] = up
  let zx=ex-cx, zy=ey-cy, zz=ez-cz
  let zl=Math.hypot(zx,zy,zz); zx/=zl; zy/=zl; zz/=zl
  let xx=uy*zz-uz*zy, xy=uz*zx-ux*zz, xz=ux*zy-uy*zx
  let xl=Math.hypot(xx,xy,xz); xx/=xl; xy/=xl; xz/=xl
  const yx=zy*xz-zz*xy, yy=zz*xx-zx*xz, yz=zx*xy-zy*xx
  return new Float32Array([
    xx,yx,zx,0,
    xy,yy,zy,0,
    xz,yz,zz,0,
    -(xx*ex+xy*ey+xz*ez), -(yx*ex+yy*ey+yz*ez), -(zx*ex+zy*ey+zz*ez), 1
  ])
}

function mat4RotateY(angle: number) {
  const c=Math.cos(angle), s=Math.sin(angle)
  return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1])
}

function mat4Multiply(a: Float32Array, b: Float32Array) {
  const r = new Float32Array(16)
  for (let i=0; i<4; i++)
    for (let j=0; j<4; j++)
      r[i*4+j] = a[i*4+0]*b[0*4+j] + a[i*4+1]*b[1*4+j] + a[i*4+2]*b[2*4+j] + a[i*4+3]*b[3*4+j]
  return r
}

function mat3FromMat4(m: Float32Array) {
  return new Float32Array([
    m[0],m[1],m[2],
    m[4],m[5],m[6],
    m[8],m[9],m[10]
  ])
}

function initGL() {
  const canvas = canvasRef.value!
  const glOrNull = canvas.getContext('webgl') as WebGLRenderingContext | null
  if (!glOrNull) {
    console.error('WebGL not supported')
    return
  }
  const gl: WebGLRenderingContext = glOrNull
  glRef.value = gl

  const sphere = createSphere(40, 40, 1.2)

  const vs = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vs, shaderVs)
  gl.compileShader(vs)
  const fs = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(fs, shaderFs)
  gl.compileShader(fs)
  const program = gl.createProgram()!
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.useProgram(program)

  const posLoc = gl.getAttribLocation(program, 'aPosition')
  const normLoc = gl.getAttribLocation(program, 'aNormal')
  const posBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
  gl.bufferData(gl.ARRAY_BUFFER, sphere.vertices, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)

  const normBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuf)
  gl.bufferData(gl.ARRAY_BUFFER, sphere.normals, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(normLoc)
  gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0)

  const idxBuf = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW)

  const uModel = gl.getUniformLocation(program, 'uModel')
  const uView = gl.getUniformLocation(program, 'uView')
  const uProj = gl.getUniformLocation(program, 'uProjection')
  const uNormMat = gl.getUniformLocation(program, 'uNormalMatrix')
  const uAmbient = gl.getUniformLocation(program, 'uAmbient')
  const uLightDir = gl.getUniformLocation(program, 'uLightDir')
  const uMatColor = gl.getUniformLocation(program, 'uMaterialColor')

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255]
  }

  function render() {
    if (!glRef.value) return
    const g = glRef.value
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth * dpr
    const h = canvas.clientHeight * dpr
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h
    }
    g.viewport(0, 0, canvas.width, canvas.height)
    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)

    const aspect = canvas.width / canvas.height
    const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100)
    const view = mat4LookAt([0, 0, 4], [0, 0, 0], [0, 1, 0])
    const angle = sphereRotation.value * 0.01
    const model = mat4RotateY(angle)
    const normMat = mat3FromMat4(model)

    const la = lightAngle.value * Math.PI / 180
    const lh = lightHeight.value * Math.PI / 180
    const lx = Math.sin(la) * Math.cos(lh)
    const ly = Math.sin(lh)
    const lz = Math.cos(la) * Math.cos(lh)

    const rgb = hexToRgb(materialColor.value)

    g.uniformMatrix4fv(uModel, false, model)
    g.uniformMatrix4fv(uView, false, view)
    g.uniformMatrix4fv(uProj, false, proj)
    g.uniformMatrix3fv(uNormMat, false, normMat)
    g.uniform3f(uAmbient, ambientIntensity.value, ambientIntensity.value, ambientIntensity.value)
    g.uniform3f(uLightDir, lx, ly, lz)
    g.uniform3f(uMatColor, rgb[0], rgb[1], rgb[2])

    g.drawElements(g.TRIANGLES, sphere.indices.length, g.UNSIGNED_SHORT, 0)

    sphereRotation.value += 0.5
    rafId.value = requestAnimationFrame(render)
  }

  render()
}

onMounted(() => {
  initGL()
})

onUnmounted(() => {
  if (rafId.value) cancelAnimationFrame(rafId.value)
})

const NdotLVisualization = computed(() => {
  const intensity = ambientIntensity.value
  const la = lightAngle.value * Math.PI / 180
  const lh = lightHeight.value * Math.PI / 180
  const lx = Math.sin(la) * Math.cos(lh)
  const ly = Math.sin(lh)
  const lz = Math.cos(la) * Math.cos(lh)
  return \`光照方向 L = (\${lx.toFixed(2)}, \${ly.toFixed(2)}, \${lz.toFixed(2)})
环境光强度 Ia = \${intensity.toFixed(2)}
最终颜色 = Ia × 材质色 + 材质色 × max(N·L, 0)\`
})
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 环境光与漫反射光照（Lambert 模型）</h3>
    <p class="summary">
      3D 球体展示环境光 + Lambert 漫反射光照模型。环境光模拟整体环境照射，漫反射基于 N·L 点积计算表面亮度。
    </p>

    <div class="demo-layout">
      <div class="canvas-wrapper">
        <canvas ref="canvasRef" class="gl-canvas"></canvas>
        <div v-if="showNormalDot" class="glsl-snippet">
          <strong>GLSL 关键代码：</strong>
          <pre>NdotL = max(dot(N, L), 0.0);
diffuse = materialColor * NdotL;
color = ambient * materialColor + diffuse;</pre>
        </div>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label>环境光强度: {{ ambientIntensity.toFixed(2) }}</label>
          <input type="range" min="0" max="1" step="0.01" v-model.number="ambientIntensity">
        </div>

        <div class="control-group">
          <label>光源方向（方位角）: {{ lightAngle }}°</label>
          <input type="range" min="0" max="360" step="1" v-model.number="lightAngle">
        </div>

        <div class="control-group">
          <label>光源方向（仰角）: {{ lightHeight }}°</label>
          <input type="range" min="0" max="90" step="1" v-model.number="lightHeight">
        </div>

        <div class="control-group">
          <label>材质颜色:</label>
          <input type="color" v-model="materialColor">
        </div>

        <div class="control-group checkbox-group">
          <label>
            <input type="checkbox" v-model="showNormalDot">
            显示 N·L 可视化
          </label>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>💡 N·L 点积分析</h4>
      <pre class="info-text">{{ NdotLVisualization }}</pre>
      <p class="info-note">
        Lambert 定律：表面越正对光源越亮。N·L = 1 时最亮（法线正对光源），N·L = 0 时最暗（法线垂直于光源）。
        当 N·L 为负时截断为 0，表示背光面完全不受光照。
      </p>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  padding: 20px;
  display: grid;
  gap: 16px;
}

.summary {
  color: var(--muted);
  line-height: 1.7;
}

.demo-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 16px;
}

.canvas-wrapper {
  display: grid;
  gap: 10px;
}

.gl-canvas {
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 480px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: radial-gradient(circle at 40% 35%, #2a1a0f 0%, #1a0f08 100%);
  display: block;
}

.glsl-snippet {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--surface);
  font-size: 12px;
}

.glsl-snippet strong {
  color: var(--chestnut);
  display: block;
  margin-bottom: 6px;
}

.glsl-snippet pre {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text);
  white-space: pre-wrap;
}

.control-panel {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}

.control-group {
  display: grid;
  gap: 6px;
}

.control-group label {
  font-size: 13px;
  color: var(--muted);
  font-weight: 600;
}

.control-group input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
}

.control-group input[type='color'] {
  width: 100%;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text);
  font-weight: 500;
}

.checkbox-group input[type='checkbox'] {
  accent-color: var(--accent);
}

.info-section {
  border-top: 1px solid var(--border);
  padding-top: 16px;
}

.info-section h4 {
  margin: 0 0 8px;
  color: var(--chestnut);
}

.info-text {
  margin: 0 0 10px;
  padding: 12px;
  border-radius: 8px;
  background: var(--surface);
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--text);
}

.info-note {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 720px) {
  .demo-layout {
    grid-template-columns: 1fr;
  }
}

[data-theme='dark'] .gl-canvas {
  background: radial-gradient(circle at 40% 35%, #1a0f08 0%, #0d0804 100%);
}

[data-theme='dark'] .glsl-snippet {
  background: rgba(42, 30, 24, 0.6);
}

[data-theme='dark'] .info-text {
  background: rgba(42, 30, 24, 0.6);
}
</style>`;export{n as default};
