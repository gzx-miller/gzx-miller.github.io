<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const glRef = shallowRef<WebGLRenderingContext | null>(null)

const shadowBias = ref(0.005)
const lightAngle = ref(45)
const lightHeight = ref(60)
const showShadowMap = ref(false)
const shadowIntensity = ref(0.7)

const rafId = ref(0)
const sceneRotation = ref(0)

const depthVs = `attribute vec3 aPosition;
uniform mat4 uLightMVP;
void main() {
  gl_Position = uLightMVP * vec4(aPosition, 1.0);
}`

const depthFs = `precision mediump float;
void main() {
  gl_FragColor = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1.0);
}`

const sceneVs = `attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uLightMVP;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
varying vec4 vLightSpacePos;
void main() {
  vec4 wp = uModel * vec4(aPosition, 1.0);
  vWorldPos = wp.xyz;
  vNormalWorld = normalize(mat3(uModel) * aNormal);
  vLightSpacePos = uLightMVP * wp;
  gl_Position = uProjection * uView * wp;
}`

const sceneFs = `precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
varying vec4 vLightSpacePos;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
uniform vec3 uMatColor;
uniform sampler2D uShadowMap;
uniform float uShadowBias;
uniform float uShadowIntensity;

float calcShadow(vec4 lightSpacePos) {
  vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w;
  projCoords = projCoords * 0.5 + 0.5;
  if (projCoords.z > 1.0) return 0.0;
  float currentDepth = projCoords.z;
  vec2 texelSize = 1.0 / vec2(textureSize(uShadowMap, 0));
  float shadow = 0.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      float pcfDepth = texture2D(uShadowMap, projCoords.xy + vec2(x, y) * texelSize).r;
      shadow += currentDepth - uShadowBias > pcfDepth ? 1.0 : 0.0;
    }
  }
  return shadow / 9.0;
}

void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vWorldPos);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  float shadow = calcShadow(vLightSpacePos);
  shadow = shadow * uShadowIntensity;
  vec3 ambient = uAmbient * uMatColor;
  vec3 diffuse = uMatColor * NdotL * (1.0 - shadow);
  vec3 specular = vec3(1.0) * pow(RdotV, 24.0) * 0.4 * (1.0 - shadow);
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}`

const shadowMapVs = `attribute vec2 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  vUV = aUV;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const shadowMapFs = `precision mediump float;
varying vec2 vUV;
uniform sampler2D uShadowMap;
void main() {
  float depth = texture2D(uShadowMap, vUV).r;
  float gray = depth;
  gl_FragColor = vec4(gray, gray, gray, 1.0);
}`

function createBox(w: number, h: number, d: number) {
  const v: number[] = [], n: number[] = [], idx: number[] = []
  const hw=w/2, hh=h/2, hd=d/2
  const faces = [
    { n:[0,0,1], verts:[[-hw,-hh,hd],[hw,-hh,hd],[hw,hh,hd],[-hw,hh,hd]] },
    { n:[0,0,-1], verts:[[hw,-hh,-hd],[-hw,-hh,-hd],[-hw,hh,-hd],[hw,hh,-hd]] },
    { n:[1,0,0], verts:[[hw,-hh,hd],[hw,-hh,-hd],[hw,hh,-hd],[hw,hh,hd]] },
    { n:[-1,0,0], verts:[[-hw,-hh,-hd],[-hw,-hh,hd],[-hw,hh,hd],[-hw,hh,-hd]] },
    { n:[0,1,0], verts:[[-hw,hh,hd],[hw,hh,hd],[hw,hh,-hd],[-hw,hh,-hd]] },
    { n:[0,-1,0], verts:[[-hw,-hh,-hd],[hw,-hh,-hd],[hw,-hh,hd],[-hw,-hh,hd]] },
  ]
  for (const f of faces) {
    for (const vert of f.verts) { v.push(vert[0],vert[1],vert[2]); n.push(f.n[0],f.n[1],f.n[2]) }
    const base = v.length / 3 - 4
    idx.push(base,base+1,base+2, base,base+2,base+3)
  }
  return { vertices: new Float32Array(v), normals: new Float32Array(n), indices: new Uint16Array(idx) }
}

function createSphere(latBands: number, longBands: number, radius: number) {
  const v: number[] = [], n: number[] = [], idx: number[] = []
  for (let lat = 0; lat <= latBands; lat++) {
    const theta = (lat * Math.PI) / latBands
    const sT = Math.sin(theta), cT = Math.cos(theta)
    for (let lon = 0; lon <= longBands; lon++) {
      const phi = (lon * 2 * Math.PI) / longBands
      const sP = Math.sin(phi), cP = Math.cos(phi)
      const x = cP*sT, y = cT, z = sP*sT
      n.push(x,y,z); v.push(radius*x, radius*y, radius*z)
    }
  }
  for (let lat=0; lat<latBands; lat++)
    for (let lon=0; lon<longBands; lon++) {
      const first = lat*(longBands+1)+lon, second = first+longBands+1
      idx.push(first,second,first+1, second,second+1,first+1)
    }
  return { vertices: new Float32Array(v), normals: new Float32Array(n), indices: new Uint16Array(idx) }
}

function createGround() {
  const s = 5
  const v = new Float32Array([-s,0,-s, s,0,-s, s,0,s, -s,0,-s, s,0,s, -s,0,s])
  const n = new Float32Array([0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0])
  const idx = new Uint16Array([0,1,2, 0,2,3])
  return { vertices: v, normals: n, indices: idx }
}

function mat4Perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1/Math.tan(fovy/2), nf = 1/(near-far)
  return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0])
}

function mat4Ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
  const lr = 1/(left-right), bt = 1/(bottom-top), nf = 1/(near-far)
  return new Float32Array([-2*lr,0,0,0, 0,2*bt,0,0, 0,0,nf,0, (left+right)*lr, (top+bottom)*bt, (far+near)*nf,1])
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

function mat4Multiply(a: Float32Array, b: Float32Array) {
  const r = new Float32Array(16)
  for (let i=0; i<4; i++) for (let j=0; j<4; j++)
    r[i*4+j] = a[i*4+0]*b[0*4+j] + a[i*4+1]*b[1*4+j] + a[i*4+2]*b[2*4+j] + a[i*4+3]*b[3*4+j]
  return r
}

function mat4Translate(x: number, y: number, z: number) {
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1])
}

function mat4RotateY(a: number) {
  const c=Math.cos(a), s=Math.sin(a)
  return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1])
}

function mat3FromMat4(m: Float32Array) {
  return new Float32Array([m[0],m[1],m[2], m[4],m[5],m[6], m[8],m[9],m[10]])
}

function mat3Inverse(m: Float32Array) {
  const a=m[0],b=m[1],c=m[2], d=m[3],e=m[4],f=m[5], g=m[6],h=m[7],i=m[8]
  const A = e*i-f*h, B = -(d*i-f*g), C = d*h-e*g
  const D = -(b*i-c*h), E = a*i-c*g, F = -(a*h-b*g)
  const G = b*f-c*e, H = -(a*f-c*d), I = a*e-b*d
  const det = a*A+b*B+c*C
  const invDet = det !== 0 ? 1/det : 0
  return new Float32Array([A*invDet,B*invDet,C*invDet, D*invDet,E*invDet,F*invDet, G*invDet,H*invDet,I*invDet])
}

function mat3Transpose(m: Float32Array) {
  return new Float32Array([m[0],m[3],m[6], m[1],m[4],m[7], m[2],m[5],m[8]])
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

  const sphere = createSphere(30, 30, 0.4)
  const box = createBox(0.8, 0.8, 0.8)
  const ground = createGround()

  function makeProgram(vsSrc: string, fsSrc: string) {
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, vsSrc); gl.compileShader(vs)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, fsSrc); gl.compileShader(fs)
    const p = gl.createProgram()!
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p)
    return p
  }

  const progDepth = makeProgram(depthVs, depthFs)
  const progScene = makeProgram(sceneVs, sceneFs)
  const progShadowVis = makeProgram(shadowMapVs, shadowMapFs)

  const depthPosLoc = gl.getAttribLocation(progDepth, 'aPosition')
  const scenePosLoc = gl.getAttribLocation(progScene, 'aPosition')
  const sceneNormLoc = gl.getAttribLocation(progScene, 'aNormal')
  const svPosLoc = gl.getAttribLocation(progShadowVis, 'aPosition')
  const svUVLoc = gl.getAttribLocation(progShadowVis, 'aUV')

  const depthLMVP = gl.getUniformLocation(progDepth, 'uLightMVP')
  const sceneLocs = {
    uModel: gl.getUniformLocation(progScene, 'uModel'),
    uView: gl.getUniformLocation(progScene, 'uView'),
    uProj: gl.getUniformLocation(progScene, 'uProjection'),
    uLightMVP: gl.getUniformLocation(progScene, 'uLightMVP'),
    uAmbient: gl.getUniformLocation(progScene, 'uAmbient'),
    uLightDir: gl.getUniformLocation(progScene, 'uLightDir'),
    uViewPos: gl.getUniformLocation(progScene, 'uViewPos'),
    uMatColor: gl.getUniformLocation(progScene, 'uMatColor'),
    uShadowMap: gl.getUniformLocation(progScene, 'uShadowMap'),
    uShadowBias: gl.getUniformLocation(progScene, 'uShadowBias'),
    uShadowIntensity: gl.getUniformLocation(progScene, 'uShadowIntensity'),
  }
  const svSceneLoc = gl.getUniformLocation(progShadowVis, 'uShadowMap')

  const scenePosBuf = gl.createBuffer()
  const sceneNormBuf = gl.createBuffer()
  const sceneIdxBuf = gl.createBuffer()

  const depthPosBuf = gl.createBuffer()

  const quadPosBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, 1,1, -1,-1, 1,1, -1,1]), gl.STATIC_DRAW)
  const quadUVBuf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadUVBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,0, 1,1, 0,1]), gl.STATIC_DRAW)

  const SHADOW_MAP_SIZE = 1024
  let shadowFBO: WebGLFramebuffer | null = null
  let shadowTexture: WebGLTexture | null = null

  function createShadowFBO() {
    if (shadowFBO) { gl.deleteFramebuffer(shadowFBO!) }
    if (shadowTexture) { gl.deleteTexture(shadowTexture!) }

    shadowFBO = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFBO)

    shadowTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, shadowTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowTexture, 0)

    const depthRB = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRB)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, SHADOW_MAP_SIZE, SHADOW_MAP_SIZE)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRB)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)

  function setupMesh(mesh: { vertices: Float32Array; normals: Float32Array; indices: Uint16Array }, posLoc: number, normLoc: number | null) {
    gl.bindBuffer(gl.ARRAY_BUFFER, scenePosBuf)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0)
    if (normLoc !== null) {
      gl.bindBuffer(gl.ARRAY_BUFFER, sceneNormBuf)
      gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(normLoc)
      gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0)
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sceneIdxBuf)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)
    return mesh.indices.length
  }

  function setupDepthMesh(mesh: { vertices: Float32Array }) {
    gl.bindBuffer(gl.ARRAY_BUFFER, depthPosBuf)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(depthPosLoc)
    gl.vertexAttribPointer(depthPosLoc, 3, gl.FLOAT, false, 0, 0)
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

    const la = lightAngle.value * Math.PI / 180
    const lh = lightHeight.value * Math.PI / 180
    const lightDist = 6
    const lightX = Math.sin(la) * Math.cos(lh) * lightDist
    const lightY = Math.sin(lh) * lightDist
    const lightZ = Math.cos(la) * Math.cos(lh) * lightDist
    const lightDir = [-lightX, -lightY, -lightZ]
    const lLen = Math.hypot(lightDir[0], lightDir[1], lightDir[2])
    lightDir[0]/=lLen; lightDir[1]/=lLen; lightDir[2]/=lLen

    const la2 = lightAngle.value * Math.PI / 180
    const lh2 = lightHeight.value * Math.PI / 180
    const le = [Math.sin(la2)*Math.cos(lh2)*8, Math.sin(lh2)*8+2, Math.cos(la2)*Math.cos(lh2)*8]

    const lightView = mat4LookAt(le, [0, 0, 0], [0, 1, 0])
    const lightProj = mat4Ortho(-6, 6, -6, 6, 0.5, 30)
    const lightMVP = mat4Multiply(lightProj, mat4Multiply(lightView, mat4Identity()))

    function mat4Identity() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]) }

    const sphereModel = mat4Multiply(mat4Translate(-0.8, 0.4, 0), mat4RotateY(sceneRotation.value * 0.01))
    const boxModel = mat4Multiply(mat4Translate(0.8, 0.4, 0), mat4RotateY(-sceneRotation.value * 0.008))
    const groundModel = mat4Identity()

    // Pass 1: Render shadow map from light's view
    g.bindFramebuffer(g.FRAMEBUFFER, shadowFBO!)
    g.viewport(0, 0, SHADOW_MAP_SIZE, SHADOW_MAP_SIZE)
    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
    g.useProgram(progDepth)

    const smSphere = { vertices: sphere.vertices, normals: sphere.normals, indices: sphere.indices }
    const smBox = { vertices: box.vertices, normals: box.normals, indices: box.indices }
    const smGround = { vertices: ground.vertices, normals: ground.normals, indices: ground.indices }

    setupDepthMesh(smSphere)
    const lmvpSphere = mat4Multiply(lightMVP, sphereModel)
    g.uniformMatrix4fv(depthLMVP, false, lmvpSphere)
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, sceneIdxBuf)
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW)
    g.drawElements(g.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0)

    setupDepthMesh(smBox)
    const lmvpBox = mat4Multiply(lightMVP, boxModel)
    g.uniformMatrix4fv(depthLMVP, false, lmvpBox)
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, sceneIdxBuf)
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, box.indices, gl.STATIC_DRAW)
    g.drawElements(g.TRIANGLES, box.indices.length, gl.UNSIGNED_SHORT, 0)

    setupDepthMesh(smGround)
    const lmvpGround = mat4Multiply(lightMVP, groundModel)
    g.uniformMatrix4fv(depthLMVP, false, lmvpGround)
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, sceneIdxBuf)
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, ground.indices, gl.STATIC_DRAW)
    g.drawElements(g.TRIANGLES, ground.indices.length, gl.UNSIGNED_SHORT, 0)

    g.bindFramebuffer(g.FRAMEBUFFER, null)

    // Pass 2: Render scene with shadow
    g.viewport(0, 0, canvas.width, canvas.height)
    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)

    const aspect = canvas.width / canvas.height
    const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100)
    const view = mat4LookAt([0, 2.5, 5], [0, 0, 0], [0, 1, 0])

    const sceneLMVP = lightMVP

    g.useProgram(progScene)
    g.uniform3f(sceneLocs.uAmbient, 0.3, 0.3, 0.3)
    g.uniform3f(sceneLocs.uLightDir, lightDir[0], lightDir[1], lightDir[2])
    g.uniform3f(sceneLocs.uViewPos, 0, 2.5, 5)
    g.uniform3f(sceneLocs.uMatColor, 0.82, 0.54, 0.26)
    g.uniformMatrix4fv(sceneLocs.uProj, false, proj)
    g.uniformMatrix4fv(sceneLocs.uView, false, view)
    g.uniformMatrix4fv(sceneLocs.uLightMVP, false, sceneLMVP)
    g.uniform1f(sceneLocs.uShadowBias, shadowBias.value)
    g.uniform1f(sceneLocs.uShadowIntensity, shadowIntensity.value)

    g.activeTexture(g.TEXTURE0)
    g.bindTexture(g.TEXTURE_2D, shadowTexture!)
    g.uniform1i(sceneLocs.uShadowMap, 0)

    // Sphere
    let count = setupMesh(sphere, scenePosLoc, sceneNormLoc)
    g.uniformMatrix4fv(sceneLocs.uModel, false, sphereModel)
    g.drawElements(g.TRIANGLES, count, g.UNSIGNED_SHORT, 0)

    // Box
    count = setupMesh(box, scenePosLoc, sceneNormLoc)
    g.uniformMatrix4fv(sceneLocs.uModel, false, boxModel)
    g.drawElements(g.TRIANGLES, count, g.UNSIGNED_SHORT, 0)

    // Ground
    count = setupMesh(ground, scenePosLoc, sceneNormLoc)
    g.uniformMatrix4fv(sceneLocs.uModel, false, groundModel)
    g.drawElements(g.TRIANGLES, count, g.UNSIGNED_SHORT, 0)

    if (showShadowMap.value && shadowTexture) {
      g.useProgram(progShadowVis)
      g.bindBuffer(g.ARRAY_BUFFER, quadPosBuf)
      g.enableVertexAttribArray(svPosLoc)
      g.vertexAttribPointer(svPosLoc, 2, g.FLOAT, false, 0, 0)
      g.bindBuffer(g.ARRAY_BUFFER, quadUVBuf)
      g.enableVertexAttribArray(svUVLoc)
      g.vertexAttribPointer(svUVLoc, 2, g.FLOAT, false, 0, 0)
      g.activeTexture(g.TEXTURE0)
      g.bindTexture(g.TEXTURE_2D, shadowTexture)
      g.uniform1i(svSceneLoc, 0)

      const smSize = Math.min(canvas.width, canvas.height) * 0.25
      const smX = canvas.width - smSize - 10
      const smY = canvas.height - smSize - 10
      g.viewport(smX, smY, smSize, smSize)
      g.drawArrays(g.TRIANGLES, 0, 6)
      g.viewport(0, 0, canvas.width, canvas.height)
    }

    sceneRotation.value += 0.3
    rafId.value = requestAnimationFrame(render)
  }

  createShadowFBO()
  render()
}

onMounted(() => { initGL() })
onUnmounted(() => { if (rafId.value) cancelAnimationFrame(rafId.value) })

const twoPassInfo = computed(() => {
  return `Pass 1 - 深度渲染:
  从光源视角 (${lightAngle.value}°, ${lightHeight.value}°) 渲染场景
  输出: 1024×1024 深度纹理

Pass 2 - 阴影计算:
  每个像素: 投影到光空间 → 采样深度纹理 → 比较
  偏移 (bias): ${shadowBias.value}
  阴影强度: ${shadowIntensity.value}`
})
</script>

<template>
  <div class="demo-card">
    <h3>🌰 阴影映射（Shadow Mapping）</h3>
    <p class="summary">
      实时阴影映射演示。第一遍从光源视角渲染深度到 Shadow FBO，第二遍将像素投影到光空间与深度纹理对比，使用 3×3 PCF 采样实现软阴影。
    </p>

    <div class="demo-layout">
      <div class="canvas-wrapper">
        <canvas ref="canvasRef" class="gl-canvas"></canvas>
        <div class="glsl-snippet">
          <strong>阴影计算核心代码：</strong>
          <pre>projCoords = lightSpacePos.xyz / w * 0.5 + 0.5;
currentDepth = projCoords.z;
for (x=-1..1, y=-1..1) {
  pcfDepth = texture(shadowMap, uv+offset).r;
  shadow += currentDepth - bias > pcfDepth ? 1 : 0;
}
shadow /= 9.0; // PCF 3×3 平均</pre>
        </div>
      </div>

      <div class="control-panel">
        <div class="control-group">
          <label>阴影偏移 (bias): {{ shadowBias.toFixed(3) }}</label>
          <input type="range" min="0.001" max="0.05" step="0.001" v-model.number="shadowBias">
        </div>

        <div class="control-group">
          <label>阴影强度: {{ shadowIntensity.toFixed(2) }}</label>
          <input type="range" min="0" max="1" step="0.01" v-model.number="shadowIntensity">
        </div>

        <div class="control-group">
          <label>光源方位角: {{ lightAngle }}°</label>
          <input type="range" min="0" max="360" step="1" v-model.number="lightAngle">
        </div>

        <div class="control-group">
          <label>光源仰角: {{ lightHeight }}°</label>
          <input type="range" min="10" max="89" step="1" v-model.number="lightHeight">
        </div>

        <div class="control-group checkbox-group">
          <label>
            <input type="checkbox" v-model="showShadowMap">
            显示 Shadow Map（右下角）
          </label>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>💡 两遍渲染流程</h4>
      <pre class="info-text">{{ twoPassInfo }}</pre>
      <p class="info-note">
        阴影映射分两步：1) 从光源视角渲染场景深度到 Shadow Map 纹理；2) 从相机视角正常渲染场景，将每个像素的光空间坐标与深度纹理进行 PCF 3×3 采样对比。
        偏移 (bias) 用于消除阴影粉刺（shadow acne），过大会导致阴影悬浮（peter-panning）。
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
  aspect-ratio: 4 / 3;
  max-width: 560px;
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