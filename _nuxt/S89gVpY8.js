const n=`<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)

const showNormals = ref(true)
const shadingMode = ref<'smooth' | 'flat'>('smooth')
const lightAngle = ref(45)
const lightHeight = ref(45)
const scaleX = ref(1.0)
const scaleY = ref(1.0)
const scaleZ = ref(1.0)

const rafId = ref(0)
const meshRotation = ref(0)

const shaderVs = \`attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
void main() {
  vec4 worldPos = uModel * vec4(aPosition, 1.0);
  vPositionWorld = worldPos.xyz;
  vNormalWorld = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjection * uView * worldPos;
}\`

const shaderFsSmooth = \`precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
uniform vec3 uMatColor;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vPositionWorld);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  vec3 ambient = uAmbient * uMatColor;
  vec3 diffuse = uMatColor * NdotL;
  vec3 specular = vec3(1.0) * pow(RdotV, 32.0) * 0.5;
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}\`

const shaderFsFlat = \`precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
uniform vec3 uMatColor;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vPositionWorld);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  vec3 ambient = uAmbient * uMatColor;
  vec3 diffuse = uMatColor * NdotL;
  vec3 specular = vec3(1.0) * pow(RdotV, 16.0) * 0.4;
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}\`

const shaderNormVs = \`attribute vec3 aPosition;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}\`

const shaderNormFs = \`precision mediump float;
void main() {
  gl_FragColor = vec4(0.96, 0.76, 0.36, 1.0);
}\`

function createBoxSmooth() {
  const v: number[] = []
  const n: number[] = []
  const idx: number[] = []
  const s = 1.0
  const faces = [
    { n: [0,0,1], verts: [[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]] },
    { n: [0,0,-1], verts: [[s,-s,-s],[-s,-s,-s],[-s,s,-s],[s,s,-s]] },
    { n: [1,0,0], verts: [[s,-s,s],[s,-s,-s],[s,s,-s],[s,s,s]] },
    { n: [-1,0,0], verts: [[-s,-s,-s],[-s,-s,s],[-s,s,s],[-s,s,-s]] },
    { n: [0,1,0], verts: [[-s,s,s],[s,s,s],[s,s,-s],[-s,s,-s]] },
    { n: [0,-1,0], verts: [[-s,-s,-s],[s,-s,-s],[s,-s,s],[-s,-s,s]] },
  ]
  let vi = 0
  for (const f of faces) {
    for (const vert of f.verts) {
      v.push(vert[0], vert[1], vert[2])
      n.push(f.n[0], f.n[1], f.n[2])
    }
    idx.push(vi, vi+1, vi+2, vi, vi+2, vi+3)
    vi += 4
  }
  return { vertices: new Float32Array(v), normals: new Float32Array(n), indices: new Uint16Array(idx) }
}

function createBoxFlat() {
  const v: number[] = []
  const n: number[] = []
  const idx: number[] = []
  const s = 1.0
  const faces = [
    { n: [0,0,1], verts: [[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]] },
    { n: [0,0,-1], verts: [[s,-s,-s],[-s,-s,-s],[-s,s,-s],[s,s,-s]] },
    { n: [1,0,0], verts: [[s,-s,s],[s,-s,-s],[s,s,-s],[s,s,s]] },
    { n: [-1,0,0], verts: [[-s,-s,-s],[-s,-s,s],[-s,s,s],[-s,s,-s]] },
    { n: [0,1,0], verts: [[-s,s,s],[s,s,s],[s,s,-s],[-s,s,-s]] },
    { n: [0,-1,0], verts: [[-s,-s,-s],[s,-s,-s],[s,-s,s],[-s,-s,s]] },
  ]
  for (const f of faces) {
    for (let i = 0; i < 4; i++) {
      v.push(f.verts[i][0], f.verts[i][1], f.verts[i][2])
      n.push(f.n[0], f.n[1], f.n[2])
    }
    idx.push(idx.length, idx.length+1, idx.length+2, idx.length, idx.length+2, idx.length+3)
  }
  return { vertices: new Float32Array(v), normals: new Float32Array(n), indices: new Uint16Array(idx) }
}

function createNormalLines(vertices: Float32Array, normals: Float32Array, scale: number) {
  const lines: number[] = []
  for (let i = 0; i < vertices.length; i += 3) {
    const vx = vertices[i], vy = vertices[i+1], vz = vertices[i+2]
    const nx = normals[i], ny = normals[i+1], nz = normals[i+2]
    lines.push(vx, vy, vz)
    lines.push(vx + nx*scale, vy + ny*scale, vz + nz*scale)
  }
  return new Float32Array(lines)
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

function mat4Scale(sx: number, sy: number, sz: number) {
  return new Float32Array([sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1])
}

function mat4Multiply(a: Float32Array, b: Float32Array) {
  const r = new Float32Array(16)
  for (let i=0; i<4; i++)
    for (let j=0; j<4; j++)
      r[i*4+j] = a[i*4+0]*b[0*4+j] + a[i*4+1]*b[1*4+j] + a[i*4+2]*b[2*4+j] + a[i*4+3]*b[3*4+j]
  return r
}

function mat3FromMat4(m: Float32Array) {
  return new Float32Array([m[0],m[1],m[2], m[4],m[5],m[6], m[8],m[9],m[10]])
}

function transposeMat3(m: Float32Array) {
  return new Float32Array([m[0],m[3],m[6], m[1],m[4],m[7], m[2],m[5],m[8]])
}

function invertMat3(m: Float32Array) {
  const a=m[0],b=m[1],c=m[2], d=m[3],e=m[4],f=m[5], g=m[6],h=m[7],i=m[8]
  const A = e*i - f*h
  const B = -(d*i - f*g)
  const C = d*h - e*g
  const D = -(b*i - c*h)
  const E = a*i - c*g
  const F = -(a*h - b*g)
  const G = b*f - c*e
  const H = -(a*f - c*d)
  const I = a*e - b*d
  const det = a*A + b*B + c*C
  const invDet = det !== 0 ? 1/det : 0
  return new Float32Array([A*invDet,B*invDet,C*invDet, D*invDet,E*invDet,F*invDet, G*invDet,H*invDet,I*invDet])
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

  const smoothMesh = createBoxSmooth()
  const flatMesh = createBoxFlat()

  const normLines = createNormalLines(smoothMesh.vertices, smoothMesh.normals, 1.4)

  function makeProgram(vsSrc: string, fsSrc: string) {
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, vsSrc); gl.compileShader(vs)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, fsSrc); gl.compileShader(fs)
    const p = gl.createProgram()!
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p)
    return p
  }

  const progSmooth = makeProgram(shaderVs, shaderFsSmooth)
  const progFlat = makeProgram(shaderVs, shaderFsFlat)
  const progNorm = makeProgram(shaderNormVs, shaderNormFs)

  const posLocS = gl.getAttribLocation(progSmooth, 'aPosition')
  const normLocS = gl.getAttribLocation(progSmooth, 'aNormal')
  const posLocF = gl.getAttribLocation(progFlat, 'aPosition')
  const normLocF = gl.getAttribLocation(progFlat, 'aNormal')
  const posLocN = gl.getAttribLocation(progNorm, 'aPosition')

  const posBuf = gl.createBuffer()
  const normBuf = gl.createBuffer()
  const idxBuf = gl.createBuffer()
  const normLineBuf = gl.createBuffer()

  const locsS = {
    uModel: gl.getUniformLocation(progSmooth, 'uModel'),
    uView: gl.getUniformLocation(progSmooth, 'uView'),
    uProj: gl.getUniformLocation(progSmooth, 'uProjection'),
    uNormMat: gl.getUniformLocation(progSmooth, 'uNormalMatrix'),
    uAmbient: gl.getUniformLocation(progSmooth, 'uAmbient'),
    uLightDir: gl.getUniformLocation(progSmooth, 'uLightDir'),
    uViewPos: gl.getUniformLocation(progSmooth, 'uViewPos'),
    uMatColor: gl.getUniformLocation(progSmooth, 'uMaterialColor'),
  }

  const locsF = {
    uModel: gl.getUniformLocation(progFlat, 'uModel'),
    uView: gl.getUniformLocation(progFlat, 'uView'),
    uProj: gl.getUniformLocation(progFlat, 'uProjection'),
    uNormMat: gl.getUniformLocation(progFlat, 'uNormalMatrix'),
    uAmbient: gl.getUniformLocation(progFlat, 'uAmbient'),
    uLightDir: gl.getUniformLocation(progFlat, 'uLightDir'),
    uViewPos: gl.getUniformLocation(progFlat, 'uViewPos'),
    uMatColor: gl.getUniformLocation(progFlat, 'uMaterialColor'),
  }

  const locsN = {
    uModel: gl.getUniformLocation(progNorm, 'uModel'),
    uView: gl.getUniformLocation(progNorm, 'uView'),
    uProj: gl.getUniformLocation(progNorm, 'uProjection'),
  }

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)

  function setupMesh(mesh: { vertices: Float32Array; normals: Float32Array; indices: Uint16Array }, posLoc: number, normLoc: number) {
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(normLoc)
    gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)
    return mesh.indices.length
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

    const la = lightAngle.value * Math.PI / 180
    const lh = lightHeight.value * Math.PI / 180
    const lx = Math.sin(la) * Math.cos(lh)
    const ly = Math.sin(lh)
    const lz = Math.cos(la) * Math.cos(lh)

    const rotY = mat4RotateY(meshRotation.value * 0.01)
    const scl = mat4Scale(scaleX.value, scaleY.value, scaleZ.value)
    const model = mat4Multiply(rotY, scl)

    const normalMat = invertMat3(transposeMat3(mat3FromMat4(model)))

    const currentMesh = shadingMode.value === 'smooth' ? smoothMesh : flatMesh
    const count = setupMesh(currentMesh, posLocS, normLocS)

    g.uniformMatrix4fv(locsS.uModel, false, model)
    g.uniformMatrix4fv(locsS.uView, false, view)
    g.uniformMatrix4fv(locsS.uProj, false, proj)
    g.uniformMatrix3fv(locsS.uNormMat, false, normalMat)
    g.uniform3f(locsS.uAmbient, 0.25, 0.25, 0.25)
    g.uniform3f(locsS.uLightDir, lx, ly, lz)
    g.uniform3f(locsS.uViewPos, 0, 0, 4)
    g.uniform3f(locsS.uMatColor, 0.85, 0.52, 0.24)

    g.useProgram(shadingMode.value === 'smooth' ? progSmooth : progFlat)
    if (shadingMode.value === 'flat') {
      const countF = setupMesh(flatMesh, posLocF, normLocF)
      g.uniformMatrix4fv(locsF.uModel, false, model)
      g.uniformMatrix4fv(locsF.uView, false, view)
      g.uniformMatrix4fv(locsF.uProj, false, proj)
      g.uniformMatrix3fv(locsF.uNormMat, false, normalMat)
      g.uniform3f(locsF.uAmbient, 0.25, 0.25, 0.25)
      g.uniform3f(locsF.uLightDir, lx, ly, lz)
      g.uniform3f(locsF.uViewPos, 0, 0, 4)
      g.uniform3f(locsF.uMatColor, 0.85, 0.52, 0.24)
      g.drawElements(g.TRIANGLES, countF, g.UNSIGNED_SHORT, 0)
    } else {
      g.drawElements(g.TRIANGLES, count, g.UNSIGNED_SHORT, 0)
    }

    if (showNormals.value) {
      g.useProgram(progNorm)
      g.bindBuffer(g.ARRAY_BUFFER, normLineBuf)
      g.bufferData(g.ARRAY_BUFFER, normLines, g.STATIC_DRAW)
      g.enableVertexAttribArray(posLocN)
      g.vertexAttribPointer(posLocN, 3, g.FLOAT, false, 0, 0)
      g.uniformMatrix4fv(locsN.uModel, false, model)
      g.uniformMatrix4fv(locsN.uView, false, view)
      g.uniformMatrix4fv(locsN.uProj, false, proj)
      g.drawArrays(g.LINES, 0, normLines.length / 3)
    }

    meshRotation.value += 0.3
    rafId.value = requestAnimationFrame(render)
  }

  render()
}

onMounted(() => { initGL() })
onUnmounted(() => { if (rafId.value) cancelAnimationFrame(rafId.value) })

const normalMatrixFormula = computed(() => {
  const sx = scaleX.value, sy = scaleY.value, sz = scaleZ.value
  const isNonUniform = sx !== sy || sy !== sz
  return \`法线矩阵 = transpose(inverse(模型矩阵左上3×3))
当前缩放: (\${sx.toFixed(1)}, \${sy.toFixed(1)}, \${sz.toFixed(1)})
\${isNonUniform ? '⚠️ 非等比缩放，法线矩阵 ≠ 模型矩阵旋转部分' : '✓ 等比缩放，法线矩阵可简化'}
平滑着色: 顶点法线 = 相邻面法线的平均值
平面着色: 每个三角面使用相同的面法线\`
})
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 法线计算与光照方向</h3>
    <p class="summary">
      展示顶点法线在光照计算中的作用。切换平滑/平面着色模式，观察法线插值如何影响光照效果，以及非等比缩放时法线矩阵的重要性。
    </p>

    <div class="demo-layout">
      <div class="canvas-wrapper">
        <canvas ref="canvasRef" class="gl-canvas"></canvas>
        <div class="glsl-snippet">
          <strong>法线矩阵关键代码：</strong>
          <pre>normalMatrix = transpose(inverse(mat3(model)));
N_world = normalize(normalMatrix * N_local);
// 等比缩放时可简化为：
// N_world = normalize(mat3(model) * N_local);</pre>
        </div>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label>着色模式:</label>
          <div class="btn-group">
            <button
              :class="{ active: shadingMode === 'smooth' }"
              @click="shadingMode = 'smooth'"
            >平滑着色</button>
            <button
              :class="{ active: shadingMode === 'flat' }"
              @click="shadingMode = 'flat'"
            >平面着色</button>
          </div>
        </div>

        <div class="control-group checkbox-group">
          <label>
            <input type="checkbox" v-model="showNormals">
            显示法线向量
          </label>
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
          <label>X 缩放: {{ scaleX.toFixed(1) }}</label>
          <input type="range" min="0.5" max="2" step="0.1" v-model.number="scaleX">
        </div>

        <div class="control-group">
          <label>Y 缩放: {{ scaleY.toFixed(1) }}</label>
          <input type="range" min="0.5" max="2" step="0.1" v-model.number="scaleY">
        </div>

        <div class="control-group">
          <label>Z 缩放: {{ scaleZ.toFixed(1) }}</label>
          <input type="range" min="0.5" max="2" step="0.1" v-model.number="scaleZ">
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>💡 法线矩阵与着色模式</h4>
      <pre class="info-text">{{ normalMatrixFormula }}</pre>
      <p class="info-note">
        当模型存在非等比缩放时（X、Y、Z 缩放不同），简单用法线矩阵等于模型矩阵的旋转部分会导致法线方向错误。
        正确做法是使用模型矩阵左上 3×3 子矩阵的逆转置矩阵。平滑着色通过法线插值实现渐变光照，平面着色每个三角面使用统一法线，产生硬边效果。
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

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-group button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--muted);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-group button.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.btn-group button:hover {
  border-color: var(--accent);
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

[data-theme='dark'] .btn-group button {
  background: rgba(55, 40, 32, 0.9);
}

[data-theme='dark'] .btn-group button.active {
  background: var(--accent);
  color: #fff;
}
</style>`;export{n as default};
