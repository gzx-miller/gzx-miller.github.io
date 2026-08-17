<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)

const shininess = ref(32)
const specularIntensity = ref(0.8)
const viewAngle = ref(0)
const lightAngle = ref(45)
const lightHeight = ref(45)
const materialColor = ref('#d94b26')
const showComparison = ref(true)

const rafId = ref(0)
const sphereRotation = ref(0)

const shaderVs = `attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
varying vec3 vWorldPos;
varying vec3 vNormalWorld;
void main() {
  vec4 worldPos = uModel * vec4(aPosition, 1.0);
  vWorldPos = worldPos.xyz;
  vNormalWorld = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjection * uView * worldPos;
}`

const shaderFsLambert = `precision mediump float;
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
}`

const shaderFsPhong = `precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
uniform vec3 uMaterialColor;
uniform float uShininess;
uniform float uSpecIntensity;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vWorldPos);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  vec3 ambient = uAmbient * uMaterialColor;
  vec3 diffuse = uMaterialColor * NdotL;
  vec3 specular = vec3(1.0, 1.0, 1.0) * uSpecIntensity * pow(RdotV, uShininess);
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}`

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

function mat4Perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0])
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
  return new Float32Array([xx,yx,zx,0, xy,yy,zy,0, xz,yz,zz,0, -(xx*ex+xy*ey+xz*ez), -(yx*ex+yy*ey+yz*ez), -(zx*ex+zy*ey+zz*ez), 1])
}

function mat4RotateY(angle: number) {
  const c=Math.cos(angle), s=Math.sin(angle)
  return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1])
}

function mat3FromMat4(m: Float32Array) {
  return new Float32Array([m[0],m[1],m[2], m[4],m[5],m[6], m[8],m[9],m[10]])
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

  const sphere = createSphere(40, 40, 1.0)

  function makeProgram(vsSrc: string, fsSrc: string) {
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, vsSrc); gl.compileShader(vs)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, fsSrc); gl.compileShader(fs)
    const p = gl.createProgram()!
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p)
    return p
  }

  const progLambert = makeProgram(shaderVs, shaderFsLambert)
  const progPhong = makeProgram(shaderVs, shaderFsPhong)

  const posLocL = gl.getAttribLocation(progLambert, 'aPosition')
  const normLocL = gl.getAttribLocation(progLambert, 'aNormal')
  const posLocP = gl.getAttribLocation(progPhong, 'aPosition')
  const normLocP = gl.getAttribLocation(progPhong, 'aNormal')

  const posBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
  gl.bufferData(gl.ARRAY_BUFFER, sphere.vertices, gl.STATIC_DRAW)

  const normBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuf)
  gl.bufferData(gl.ARRAY_BUFFER, sphere.normals, gl.STATIC_DRAW)

  const idxBuf = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW)

  const locsL = {
    uModel: gl.getUniformLocation(progLambert, 'uModel'),
    uView: gl.getUniformLocation(progLambert, 'uView'),
    uProj: gl.getUniformLocation(progLambert, 'uProjection'),
    uNormMat: gl.getUniformLocation(progLambert, 'uNormalMatrix'),
    uAmbient: gl.getUniformLocation(progLambert, 'uAmbient'),
    uLightDir: gl.getUniformLocation(progLambert, 'uLightDir'),
    uMatColor: gl.getUniformLocation(progLambert, 'uMaterialColor'),
  }

  const locsP = {
    uModel: gl.getUniformLocation(progPhong, 'uModel'),
    uView: gl.getUniformLocation(progPhong, 'uView'),
    uProj: gl.getUniformLocation(progPhong, 'uProjection'),
    uNormMat: gl.getUniformLocation(progPhong, 'uNormalMatrix'),
    uAmbient: gl.getUniformLocation(progPhong, 'uAmbient'),
    uLightDir: gl.getUniformLocation(progPhong, 'uLightDir'),
    uViewPos: gl.getUniformLocation(progPhong, 'uViewPos'),
    uMatColor: gl.getUniformLocation(progPhong, 'uMaterialColor'),
    uShininess: gl.getUniformLocation(progPhong, 'uShininess'),
    uSpecIntensity: gl.getUniformLocation(progPhong, 'uSpecIntensity'),
  }

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255]
  }

  function setupAttribs(posLoc: number, normLoc: number) {
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf)
    gl.enableVertexAttribArray(normLoc)
    gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf)
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

    const la = lightAngle.value * Math.PI / 180
    const lh = lightHeight.value * Math.PI / 180
    const lx = Math.sin(la) * Math.cos(lh)
    const ly = Math.sin(lh)
    const lz = Math.cos(la) * Math.cos(lh)

    const va = viewAngle.value * Math.PI / 180
    const vx = Math.sin(va) * 3
    const vy = 0
    const vz = Math.cos(va) * 3

    const rgb = hexToRgb(materialColor.value)

    const angle = sphereRotation.value * 0.008

    if (showComparison.value) {
      g.enable(g.SCISSOR_TEST)
      const halfW = canvas.width / 2

      g.scissor(0, 0, halfW, canvas.height)
      g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
      g.useProgram(progLambert)
      setupAttribs(posLocL, normLocL)
      const modelL = mat4RotateY(angle)
      const normMatL = mat3FromMat4(modelL)
      g.uniformMatrix4fv(locsL.uModel, false, modelL)
      g.uniformMatrix4fv(locsL.uView, false, mat4LookAt([vx, vy, vz], [0, 0, 0], [0, 1, 0]))
      g.uniformMatrix4fv(locsL.uProj, false, proj)
      g.uniformMatrix3fv(locsL.uNormMat, false, normMatL)
      g.uniform3f(locsL.uAmbient, 0.2, 0.2, 0.2)
      g.uniform3f(locsL.uLightDir, lx, ly, lz)
      g.uniform3f(locsL.uMatColor, rgb[0], rgb[1], rgb[2])
      g.drawElements(g.TRIANGLES, sphere.indices.length, g.UNSIGNED_SHORT, 0)

      g.scissor(halfW, 0, halfW, canvas.height)
      g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
      g.useProgram(progPhong)
      setupAttribs(posLocP, normLocP)
      const modelP = mat4RotateY(angle)
      const normMatP = mat3FromMat4(modelP)
      g.uniformMatrix4fv(locsP.uModel, false, modelP)
      g.uniformMatrix4fv(locsP.uView, false, mat4LookAt([vx, vy, vz], [0, 0, 0], [0, 1, 0]))
      g.uniformMatrix4fv(locsP.uProj, false, proj)
      g.uniformMatrix3fv(locsP.uNormMat, false, normMatP)
      g.uniform3f(locsP.uAmbient, 0.2, 0.2, 0.2)
      g.uniform3f(locsP.uLightDir, lx, ly, lz)
      g.uniform3f(locsP.uViewPos, vx, vy, vz)
      g.uniform3f(locsP.uMatColor, rgb[0], rgb[1], rgb[2])
      g.uniform1f(locsP.uShininess, shininess.value)
      g.uniform1f(locsP.uSpecIntensity, specularIntensity.value)
      g.drawElements(g.TRIANGLES, sphere.indices.length, g.UNSIGNED_SHORT, 0)

      g.disable(g.SCISSOR_TEST)
    } else {
      g.useProgram(progPhong)
      setupAttribs(posLocP, normLocP)
      const model = mat4RotateY(angle)
      const normMat = mat3FromMat4(model)
      g.uniformMatrix4fv(locsP.uModel, false, model)
      g.uniformMatrix4fv(locsP.uView, false, mat4LookAt([vx, vy, vz], [0, 0, 0], [0, 1, 0]))
      g.uniformMatrix4fv(locsP.uProj, false, proj)
      g.uniformMatrix3fv(locsP.uNormMat, false, normMat)
      g.uniform3f(locsP.uAmbient, 0.2, 0.2, 0.2)
      g.uniform3f(locsP.uLightDir, lx, ly, lz)
      g.uniform3f(locsP.uViewPos, vx, vy, vz)
      g.uniform3f(locsP.uMatColor, rgb[0], rgb[1], rgb[2])
      g.uniform1f(locsP.uShininess, shininess.value)
      g.uniform1f(locsP.uSpecIntensity, specularIntensity.value)
      g.drawElements(g.TRIANGLES, sphere.indices.length, g.UNSIGNED_SHORT, 0)
    }

    sphereRotation.value += 0.5
    rafId.value = requestAnimationFrame(render)
  }

  render()
}

onMounted(() => { initGL() })
onUnmounted(() => { if (rafId.value) cancelAnimationFrame(rafId.value) })

const phongFormula = computed(() => {
  return `反射向量 R = reflect(-L, N)
高光强度 = pow(max(R·V, 0), shininess)
最终颜色 = ambient + diffuse + specular
shininess = ${shininess.value}  (值越大高光越集中)
specIntensity = ${specularIntensity.value.toFixed(2)}`
})
</script>

<template>
  <div class="demo-card">
    <h3>🌰 镜面高光与 Phong 光照</h3>
    <p class="summary">
      展示环境光 + 漫反射 + 镜面高光的完整 Phong 光照模型。左侧为 Lambert 模型（仅环境光+漫反射），右侧为 Phong 模型（多了镜面高光）。
    </p>

    <div class="demo-layout">
      <div class="canvas-wrapper">
        <canvas ref="canvasRef" class="gl-canvas"></canvas>
        <div class="canvas-labels">
          <span v-if="showComparison" class="label-left">Lambert</span>
          <span v-if="showComparison" class="label-right">Phong</span>
        </div>
        <div class="glsl-snippet">
          <strong>Phong 关键代码：</strong>
          <pre>R = reflect(-L, N);
spec = pow(max(dot(R, V), 0), shininess);
color = ambient + diffuse + spec * specIntensity;</pre>
        </div>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label>高光范围 (shininess): {{ shininess }}</label>
          <input type="range" min="1" max="128" step="1" v-model.number="shininess">
        </div>

        <div class="control-group">
          <label>高光强度: {{ specularIntensity.toFixed(2) }}</label>
          <input type="range" min="0" max="2" step="0.01" v-model.number="specularIntensity">
        </div>

        <div class="control-group">
          <label>光源方位角: {{ lightAngle }}°</label>
          <input type="range" min="0" max="360" step="1" v-model.number="lightAngle">
        </div>

        <div class="control-group">
          <label>光源仰角: {{ lightHeight }}°</label>
          <input type="range" min="0" max="90" step="1" v-model.number="lightHeight">
        </div>

        <div class="control-group">
          <label>观察方向: {{ viewAngle }}°</label>
          <input type="range" min="-60" max="60" step="1" v-model.number="viewAngle">
        </div>

        <div class="control-group">
          <label>材质颜色:</label>
          <input type="color" v-model="materialColor">
        </div>

        <div class="control-group checkbox-group">
          <label>
            <input type="checkbox" v-model="showComparison">
            左右对比（Lambert vs Phong）
          </label>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>💡 Phong 公式分析</h4>
      <pre class="info-text">{{ phongFormula }}</pre>
      <p class="info-note">
        Phong 模型通过计算反射向量 R 与视线 V 的点积来模拟镜面高光。shininess 值越大，高光越集中在镜面反射方向附近；
        值越小高光越分散。实际工程中常用 Blinn-Phong 模型（使用半向量 H = L + V），性能更好且效果相近。
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
  position: relative;
}

.gl-canvas {
  width: 100%;
  aspect-ratio: 2 / 1;
  max-width: 480px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: radial-gradient(circle at 40% 35%, #2a1a0f 0%, #1a0f08 100%);
  display: block;
}

.canvas-labels {
  position: absolute;
  top: 8px;
  left: 0;
  right: 0;
  display: flex;
  pointer-events: none;
}

.canvas-labels span {
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--leaf-gold);
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
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

[data-theme='dark'] .glsl-snippet,
[data-theme='dark'] .info-text {
  background: rgba(42, 30, 24, 0.6);
}
</style>