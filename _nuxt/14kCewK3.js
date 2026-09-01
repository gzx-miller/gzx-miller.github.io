const n=`<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)

const useFBO = ref(true)
const postEffect = ref<'none' | 'invert' | 'grayscale' | 'sepia'>('invert')
const showSplit = ref(true)

const rafId = ref(0)
const sceneRotation = ref(0)

const sceneVs = \`attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
void main() {
  vec4 wp = uModel * vec4(aPosition, 1.0);
  vWorldPos = wp.xyz;
  vNormalWorld = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjection * uView * wp;
}\`

const sceneFs = \`precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vWorldPos);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  vec3 baseColor = vec3(0.82, 0.54, 0.26);
  vec3 ambient = uAmbient * baseColor;
  vec3 diffuse = baseColor * NdotL;
  vec3 specular = vec3(1.0) * pow(RdotV, 24.0) * 0.5;
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}\`

const quadVs = \`attribute vec2 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  vUV = aUV;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}\`

const quadFsBase = \`precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  gl_FragColor = texture2D(uScene, vUV);
}\`

const quadFsInvert = \`precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  gl_FragColor = vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a);
}\`

const quadFsGray = \`precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(vec3(g), c.a);
}\`

const quadFsSepia = \`precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  float r = dot(c.rgb, vec3(0.393, 0.769, 0.189));
  float g = dot(c.rgb, vec3(0.349, 0.686, 0.168));
  float b = dot(c.rgb, vec3(0.272, 0.534, 0.131));
  gl_FragColor = vec4(r, g, b, c.a);
}\`

function createCube() {
  const s = 1
  const v = [
    -s,-s,-s,  s,-s,-s,  s, s,-s, -s, s,-s,
    -s,-s, s,  s,-s, s,  s, s, s, -s, s, s,
    -s,-s,-s, -s, s,-s, -s, s, s, -s,-s, s,
     s,-s,-s,  s, s,-s,  s, s, s,  s,-s, s,
    -s, s,-s,  s, s,-s,  s, s, s, -s, s, s,
    -s,-s,-s, -s,-s, s,  s,-s, s,  s,-s,-s,
  ]
  const n = [
    0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
    0,0,1, 0,0,1, 0,0,1, 0,0,1,
    -1,0,0, -1,0,0, -1,0,0, -1,0,0,
    1,0,0, 1,0,0, 1,0,0, 1,0,0,
    0,1,0, 0,1,0, 0,1,0, 0,1,0,
    0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
  ]
  const idx = [
    0,1,2, 0,2,3, 4,6,5, 4,7,6,
    8,9,10, 8,10,11, 12,14,13, 12,15,14,
    16,17,18, 16,18,19, 20,21,22, 20,22,23,
  ]
  return { vertices: new Float32Array(v), normals: new Float32Array(n), indices: new Uint16Array(idx) }
}

function createSphere(latBands: number, longBands: number, radius: number) {
  const v: number[] = [], n: number[] = [], idx: number[] = []
  for (let lat = 0; lat <= latBands; lat++) {
    const theta = (lat * Math.PI) / latBands
    const sinT = Math.sin(theta), cosT = Math.cos(theta)
    for (let lon = 0; lon <= longBands; lon++) {
      const phi = (lon * 2 * Math.PI) / longBands
      const sinP = Math.sin(phi), cosP = Math.cos(phi)
      const x = cosP * sinT, y = cosT, z = sinP * sinT
      n.push(x, y, z); v.push(radius * x, radius * y, radius * z)
    }
  }
  for (let lat = 0; lat < latBands; lat++)
    for (let lon = 0; lon < longBands; lon++) {
      const first = lat * (longBands + 1) + lon
      const second = first + longBands + 1
      idx.push(first, second, first + 1, second, second + 1, first + 1)
    }
  return { vertices: new Float32Array(v), normals: new Float32Array(n), indices: new Uint16Array(idx) }
}

function mat4Perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far)
  return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0])
}

function mat4LookAt(eye: number[], center: number[], up: number[]) {
  const [ex,ey,ez]=eye, [cx,cy,cz]=center, [ux,uy,uz]=up
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

  const sphere = createSphere(30, 30, 0.8)
  const cube = createCube()

  function makeProgram(vsSrc: string, fsSrc: string) {
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, vsSrc); gl.compileShader(vs)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, fsSrc); gl.compileShader(fs)
    const p = gl.createProgram()!
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p)
    return p
  }

  const progScene = makeProgram(sceneVs, sceneFs)
  const progBase = makeProgram(quadVs, quadFsBase)
  const progInvert = makeProgram(quadVs, quadFsInvert)
  const progGray = makeProgram(quadVs, quadFsGray)
  const progSepia = makeProgram(quadVs, quadFsSepia)

  const scenePosLoc = gl.getAttribLocation(progScene, 'aPosition')
  const sceneNormLoc = gl.getAttribLocation(progScene, 'aNormal')

  const sceneLocs = {
    uModel: gl.getUniformLocation(progScene, 'uModel'),
    uView: gl.getUniformLocation(progScene, 'uView'),
    uProj: gl.getUniformLocation(progScene, 'uProjection'),
    uNormMat: gl.getUniformLocation(progScene, 'uNormalMatrix'),
    uAmbient: gl.getUniformLocation(progScene, 'uAmbient'),
    uLightDir: gl.getUniformLocation(progScene, 'uLightDir'),
    uViewPos: gl.getUniformLocation(progScene, 'uViewPos'),
  }

  const quadProgs = { none: progBase, invert: progInvert, grayscale: progGray, sepia: progSepia }

  const quadPositions = new Float32Array([
    -1,-1, 1,-1, 1, 1, -1,-1, 1, 1, -1, 1
  ])
  const quadUVs = new Float32Array([
    0,0, 1,0, 1,1, 0,0, 1,1, 0,1
  ])

  const quadPosLoc = gl.getAttribLocation(progBase, 'aPosition')
  const quadUVLoc = gl.getAttribLocation(progBase, 'aUV')
  const quadSceneLocs = {
    none: gl.getUniformLocation(progBase, 'uScene'),
    invert: gl.getUniformLocation(progInvert, 'uScene'),
    grayscale: gl.getUniformLocation(progGray, 'uScene'),
    sepia: gl.getUniformLocation(progSepia, 'uScene'),
  }

  const scenePosBuf = gl.createBuffer()
  const sceneNormBuf = gl.createBuffer()
  const sceneIdxBuf = gl.createBuffer()

  const quadPosBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuf)
  gl.bufferData(gl.ARRAY_BUFFER, quadPositions, gl.STATIC_DRAW)
  const quadUVBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadUVBuf)
  gl.bufferData(gl.ARRAY_BUFFER, quadUVs, gl.STATIC_DRAW)

  let fbo: WebGLFramebuffer | null = null
  let fboTexture: WebGLTexture | null = null
  let fboDepthRB: WebGLRenderbuffer | null = null
  let fboWidth = 512
  let fboHeight = 512

  function createFBO(w: number, h: number) {
    if (fbo) { gl.deleteFramebuffer(fbo); fbo = null }
    if (fboTexture) { gl.deleteTexture(fboTexture); fboTexture = null }
    if (fboDepthRB) { gl.deleteRenderbuffer(fboDepthRB); fboDepthRB = null }

    fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)

    fboTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, fboTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTexture, 0)

    fboDepthRB = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, fboDepthRB)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fboDepthRB)

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.warn('FBO incomplete:', status)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    fboWidth = w
    fboHeight = h
  }

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)

  function setupSceneMesh(mesh: { vertices: Float32Array; normals: Float32Array; indices: Uint16Array }) {
    gl.bindBuffer(gl.ARRAY_BUFFER, scenePosBuf)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(scenePosLoc)
    gl.vertexAttribPointer(scenePosLoc, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, sceneNormBuf)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(sceneNormLoc)
    gl.vertexAttribPointer(sceneNormLoc, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sceneIdxBuf)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)
  }

  function render() {
    if (!glRef.value) return
    const g = glRef.value
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth * dpr
    const h = canvas.clientHeight * dpr
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h
      createFBO(Math.min(w, 1024), Math.min(h, 1024))
    }

    const aspect = canvas.width / canvas.height
    const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100)
    const view = mat4LookAt([0, 0.5, 3.5], [0, 0, 0], [0, 1, 0])
    const angle = sceneRotation.value * 0.008
    const sphereModel = mat4RotateY(angle)
    const cubeModel = (() => {
      const t = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 1.5,0,0,1])
      const r = mat4RotateY(-angle * 1.5)
      const m = new Float32Array(16)
      for (let i=0; i<4; i++) for (let j=0; j<4; j++)
        m[i*4+j] = r[i*4+0]*t[0*4+j] + r[i*4+1]*t[1*4+j] + r[i*4+2]*t[2*4+j] + r[i*4+3]*t[3*4+j]
      return m
    })()

    if (useFBO.value && fbo) {
      g.bindFramebuffer(g.FRAMEBUFFER, fbo)
      g.viewport(0, 0, fboWidth, fboHeight)
      g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)

      g.useProgram(progScene)
      g.uniform3f(sceneLocs.uAmbient, 0.25, 0.25, 0.25)
      g.uniform3f(sceneLocs.uLightDir, 0.5, 0.7, 0.3)
      g.uniform3f(sceneLocs.uViewPos, 0, 0, 3.5)

      g.uniformMatrix4fv(sceneLocs.uProj, false, proj)
      g.uniformMatrix4fv(sceneLocs.uView, false, view)

      setupSceneMesh(sphere)
      g.uniformMatrix4fv(sceneLocs.uModel, false, sphereModel)
      g.uniformMatrix3fv(sceneLocs.uNormMat, false, mat3FromMat4(sphereModel))
      g.drawElements(g.TRIANGLES, sphere.indices.length, g.UNSIGNED_SHORT, 0)

      setupSceneMesh(cube)
      g.uniformMatrix4fv(sceneLocs.uModel, false, cubeModel)
      g.uniformMatrix3fv(sceneLocs.uNormMat, false, mat3FromMat4(cubeModel))
      g.drawElements(g.TRIANGLES, cube.indices.length, g.UNSIGNED_SHORT, 0)

      g.bindFramebuffer(g.FRAMEBUFFER, null)

      g.viewport(0, 0, canvas.width, canvas.height)
      g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)

      if (showSplit.value) {
        g.enable(g.SCISSOR_TEST)
        const halfW = canvas.width / 2

        g.scissor(0, 0, halfW, canvas.height)
        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
        g.useProgram(progBase)
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuf)
        gl.enableVertexAttribArray(quadPosLoc)
        gl.vertexAttribPointer(quadPosLoc, 2, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, quadUVBuf)
        gl.enableVertexAttribArray(quadUVLoc)
        gl.vertexAttribPointer(quadUVLoc, 2, gl.FLOAT, false, 0, 0)
        g.activeTexture(g.TEXTURE0)
        g.bindTexture(g.TEXTURE_2D, fboTexture)
        g.uniform1i(quadSceneLocs.none, 0)
        g.drawArrays(g.TRIANGLES, 0, 6)

        g.scissor(halfW, 0, halfW, canvas.height)
        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
        const prog = quadProgs[postEffect.value]
        g.useProgram(prog)
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuf)
        g.enableVertexAttribArray(quadPosLoc)
        g.vertexAttribPointer(quadPosLoc, 2, gl.FLOAT, false, 0, 0)
        g.bindBuffer(gl.ARRAY_BUFFER, quadUVBuf)
        g.enableVertexAttribArray(quadUVLoc)
        g.vertexAttribPointer(quadUVLoc, 2, gl.FLOAT, false, 0, 0)
        g.activeTexture(g.TEXTURE0)
        g.bindTexture(g.TEXTURE_2D, fboTexture)
        g.uniform1i(quadSceneLocs[postEffect.value], 0)
        g.drawArrays(g.TRIANGLES, 0, 6)

        g.disable(g.SCISSOR_TEST)
      } else {
        const prog = quadProgs[postEffect.value]
        g.useProgram(prog)
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuf)
        g.enableVertexAttribArray(quadPosLoc)
        g.vertexAttribPointer(quadPosLoc, 2, gl.FLOAT, false, 0, 0)
        g.bindBuffer(gl.ARRAY_BUFFER, quadUVBuf)
        g.enableVertexAttribArray(quadUVLoc)
        g.vertexAttribPointer(quadUVLoc, 2, gl.FLOAT, false, 0, 0)
        g.activeTexture(g.TEXTURE0)
        g.bindTexture(g.TEXTURE_2D, fboTexture)
        g.uniform1i(quadSceneLocs[postEffect.value], 0)
        g.drawArrays(g.TRIANGLES, 0, 6)
      }
    } else {
      g.viewport(0, 0, canvas.width, canvas.height)
      g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
      g.useProgram(progScene)
      g.uniform3f(sceneLocs.uAmbient, 0.25, 0.25, 0.25)
      g.uniform3f(sceneLocs.uLightDir, 0.5, 0.7, 0.3)
      g.uniform3f(sceneLocs.uViewPos, 0, 0, 3.5)
      g.uniformMatrix4fv(sceneLocs.uProj, false, proj)
      g.uniformMatrix4fv(sceneLocs.uView, false, view)

      setupSceneMesh(sphere)
      g.uniformMatrix4fv(sceneLocs.uModel, false, sphereModel)
      g.uniformMatrix3fv(sceneLocs.uNormMat, false, mat3FromMat4(sphereModel))
      g.drawElements(g.TRIANGLES, sphere.indices.length, g.UNSIGNED_SHORT, 0)

      setupSceneMesh(cube)
      g.uniformMatrix4fv(sceneLocs.uModel, false, cubeModel)
      g.uniformMatrix3fv(sceneLocs.uNormMat, false, mat3FromMat4(cubeModel))
      g.drawElements(g.TRIANGLES, cube.indices.length, g.UNSIGNED_SHORT, 0)
    }

    sceneRotation.value += 0.3
    rafId.value = requestAnimationFrame(render)
  }

  createFBO(512, 512)
  render()
}

onMounted(() => { initGL() })
onUnmounted(() => { if (rafId.value) cancelAnimationFrame(rafId.value) })

const fboInfo = computed(() => {
  const effects: Record<string, string> = {
    none: '无后处理（原样显示）',
    invert: '颜色反相',
    grayscale: '灰度转换（Luminance）',
    sepia: '棕褐色调',
  }
  return \`FBO 配置：
  颜色附件: COLOR_ATTACHMENT0 (RGBA 纹理)
  深度附件: DEPTH_ATTACHMENT (RENDERBUFFER)
  尺寸: \${512} × \${512} px
  当前后处理: \${effects[postEffect.value]}\`
})
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 帧缓冲与离屏渲染（FBO）</h3>
    <p class="summary">
      演示帧缓冲对象（FBO）的使用：将场景渲染到离屏 FBO 纹理，再通过全屏四边形进行后处理。左侧为原始渲染，右侧为后处理效果。
    </p>

    <div class="demo-layout">
      <div class="canvas-wrapper">
        <canvas ref="canvasRef" class="gl-canvas"></canvas>
        <div class="glsl-snippet">
          <strong>FBO 创建与绑定：</strong>
          <pre>gl.bindFramebuffer(FRAMEBUFFER, fbo);
gl.framebufferTexture2D(
  FRAMEBUFFER, COLOR_ATTACHMENT0,
  TEXTURE_2D, colorTexture, 0
);
gl.framebufferRenderbuffer(
  FRAMEBUFFER, DEPTH_ATTACHMENT,
  RENDERBUFFER, depthRB
);</pre>
        </div>
      </div>

      <div class="control-panel">
        <div class="control-group checkbox-group">
          <label>
            <input type="checkbox" v-model="useFBO">
            启用 FBO 离屏渲染
          </label>
        </div>

        <div class="control-group checkbox-group">
          <label>
            <input type="checkbox" v-model="showSplit">
            分屏对比（前/后处理）
          </label>
        </div>

        <div class="control-group">
          <label>后处理效果:</label>
          <div class="btn-group">
            <button :class="{ active: postEffect === 'none' }" @click="postEffect = 'none'">原样</button>
            <button :class="{ active: postEffect === 'invert' }" @click="postEffect = 'invert'">反相</button>
            <button :class="{ active: postEffect === 'grayscale' }" @click="postEffect = 'grayscale'">灰度</button>
            <button :class="{ active: postEffect === 'sepia' }" @click="postEffect = 'sepia'">复古</button>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>💡 FBO 附件配置</h4>
      <pre class="info-text">{{ fboInfo }}</pre>
      <p class="info-note">
        FBO（Framebuffer Object）允许渲染到离屏目标而非屏幕。核心流程：1) 创建 FBO 并绑定；
        2) 附加颜色纹理（COLOR_ATTACHMENT0）和深度缓冲（DEPTH_ATTACHMENT）；
        3) 检查 FBO 完整性；4) 在 FBO 中执行渲染；5) 绑定默认帧缓冲并使用 FBO 纹理进行二次渲染。
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
  grid-template-columns: 1fr 240px;
  gap: 16px;
}

.canvas-wrapper {
  display: grid;
  gap: 10px;
}

.gl-canvas {
  width: 100%;
  aspect-ratio: 2 / 1;
  max-width: 520px;
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
  align-content: start;
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

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.btn-group button {
  flex: 1;
  min-width: 60px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
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
