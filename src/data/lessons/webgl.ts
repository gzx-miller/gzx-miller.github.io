import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const glslCodeModules = import.meta.glob<string>('../../demos/glsl-code/*.glsl', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(async () => loader())
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('glsl-code/')
    ? glslCodeModules
    : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return loader
}

const W01WebGLContext = createDemo('W01WebGLContext')
const W01Code = createCodeLoader('glsl-code/W01WebGLContext.glsl')
const W02Shaders = createDemo('W02Shaders')
const W02Code = createCodeLoader('glsl-code/W02Shaders.glsl')
const W03Buffers = createDemo('W03Buffers')
const W03Code = createCodeLoader('glsl-code/W03Buffers.glsl')
const W04Attributes = createDemo('W04Attributes')
const W04Code = createCodeLoader('glsl-code/W04Attributes.glsl')
const W05Matrices = createDemo('W05Matrices')
const W05Code = createCodeLoader('glsl-code/W05Matrices.glsl')
const W06MVP = createDemo('W06MVP')
const W06Code = createCodeLoader('glsl-code/W06MVP.glsl')
const W07Camera = createDemo('W07Camera')
const W07Code = createCodeLoader('glsl-code/W07Camera.glsl')
const W08Textures = createDemo('W08Textures')
const W08Code = createCodeLoader('glsl-code/W08Textures.glsl')
const W09TextureFilter = createDemo('W09TextureFilter')
const W09Code = createCodeLoader('glsl-code/W09TextureFilter.glsl')
const W10MultiTexture = createDemo('W10MultiTexture')
const W10Code = createCodeLoader('glsl-code/W10MultiTexture.glsl')
const W11Lighting = createDemo('W11Lighting')
const W11Code = createCodeLoader('glsl-code/W11Lighting.glsl')
const W12Phong = createDemo('W12Phong')
const W12Code = createCodeLoader('glsl-code/W12Phong.glsl')
const W13Normals = createDemo('W13Normals')
const W13Code = createCodeLoader('glsl-code/W13Normals.glsl')
const W14FBO = createDemo('W14FBO')
const W14Code = createCodeLoader('glsl-code/W14FBO.glsl')
const W15Shadows = createDemo('W15Shadows')
const W15Code = createCodeLoader('glsl-code/W15Shadows.glsl')
const W16PostProcess = createDemo('W16PostProcess')
const W16Code = createCodeLoader('glsl-code/W16PostProcess.glsl')
const W17WebGL2 = createDemo('W17WebGL2')
const W17Code = createCodeLoader('glsl-code/W17WebGL2.glsl')
const W18Instancing = createDemo('W18Instancing')
const W18Code = createCodeLoader('glsl-code/W18Instancing.glsl')
const W19Particles = createDemo('W19Particles')
const W19Code = createCodeLoader('glsl-code/W19Particles.glsl')
const W20Performance = createDemo('W20Performance')
const W20Code = createCodeLoader('glsl-code/W20Performance.glsl')

export const lessons: Lesson[] = [
  {
    id: 'W_1',
    title: 'WebGL 上下文与渲染管线',
    navTitle: '上下文管线',
    category: '基础入门',
    path: '/webgl/w-1/context-pipeline',
    summary: '从 Canvas 获取 WebGL 上下文，用最简单的单色三角形看清顶点处理与片段处理两段可编程管线。',
    demo: W01WebGLContext,
    code: W01Code,
    language: 'glsl',
    principle:
      'WebGL1 对应 OpenGL ES 2.0，通过 canvas.getContext("webgl") 得到 WebGLRenderingContext，它是上传缓冲、编译着色器、发起绘制等所有 GPU 操作的入口。可编程管线只有顶点着色器（逐顶点执行、必须写入 gl_Position）和片段着色器（逐像素输出 gl_FragColor）两段，二者之间的裁剪、图元装配、光栅化由硬件固定管线完成。本课用一个位置来自 attribute、颜色来自 uniform 的单色三角形演示这条最小流程。',
    flow: [
      '获取 Canvas，通过 getContext("webgl") 取得 WebGL 上下文。',
      '编写顶点着色器（把 aPosition 写入 gl_Position）与片段着色器（输出 uniform uColor）。',
      '编译两个着色器并链接为 Program，用 getAttribLocation / getUniformLocation 取各变量位置。',
      '上传顶点 Buffer，调用 drawArrays(TRIANGLES,0,3) 触发 GPU 执行管线。',
    ],
    notes: [
      '顶点数据必须先经 Buffer 上传到 GPU 显存，绘制前再用 enableVertexAttribArray + vertexAttribPointer 把它连到 attribute。',
      '着色器必须 compileShader 并 linkProgram，失败时用 getShaderInfoLog 读取诊断信息。',
      '上下文属性（antialias、alpha、preserveDrawingBuffer）只影响渲染行为，按需开启，不要一律设为 true。',
      '片段着色器须用 precision 声明浮点精度，mediump 与 highp 会换算取舍，影响精度与开销。',
    ],
    problem: '解决"WebGL 如何在浏览器中启动渲染，以及数据如何在 GPU 管线中流转"的入门问题。',
  },
  {
    id: 'W_2',
    title: 'GLSL 着色器编程基础',
    navTitle: '着色器基础',
    category: '基础入门',
    path: '/webgl/w-2/shaders',
    summary: '用一个旋转三角形展示顶点着色器与片段着色器的协作与数据传递。',
    demo: W02Shaders,
    code: W02Code,
    language: 'glsl',
    principle:
      'GLSL 是 OpenGL ES 的着色器语言，一份 Shader Program 由顶点着色器和片段着色器组成。顶点着色器对每个顶点执行一次，读取 attribute 输入、处理变换并写入 gl_Position；片段着色器对每个像素执行一次并写入 gl_FragColor。顶点着色器通过 varying 把数据交给片段着色器，varying 的值会在光栅化阶段于两个顶点之间自动线性插值。本课用一个随 uniform uRotation 旋转的三角形演示这套分工与 varying 插值。',
    flow: [
      '顶点着色器读取 attribute aPosition/aColor 与 uniform uRotation，用旋转公式算出新坐标写入 gl_Position。',
      '顶点着色器把 aColor 作为 varying vColor 输出。',
      '光栅化阶段在三个顶点之间对 vColor 自动线性插值。',
      '片段着色器读取插值后的 vColor 写入 gl_FragColor，得到带渐变的旋转三角形。',
    ],
    notes: [
      'attribute 只能在顶点着色器中声明，表示逐顶点输入（位置、法线、UV 等）。',
      'varying 需在顶点与片段着色器中同时声明且类型一致，片段端拿到的是插值后的值。',
      '对比平涂版（改用 uniform 单色、关闭插值）可以直观看出插值渐变，便于理解光栅化。',
      'uniform 是两个着色器通用的全局只读输入，单次 draw call 内所有顶点与像素共享，适合传时间、角度等。',
    ],
    problem: '解决"顶点着色器和片段着色器如何分工协作渲染一个图形"的问题。',
  },
  {
    id: 'W_3',
    title: '缓冲区对象与绘制调用',
    navTitle: '缓冲绘制',
    category: '基础入门',
    path: '/webgl/w-3/buffers-draw',
    summary: '用 VBO、VAO 和 drawArrays/drawElements 展示不同绘制模式。',
    demo: W03Buffers,
    code: W03Code,
    language: 'glsl',
    principle:
      '顶点数据通过缓冲区对象上传到 GPU 显存：顶点放 ARRAY_BUFFER，索引放元素缓冲区（ELEMENT_ARRAY_BUFFER）。drawArrays 按连续顶点顺序绘制，drawElements 则按索引复用顶点。顶点数组对象（VAO）把"数据缓冲 + 每个 attribute 的指针配置"打包成一份状态，切换网格时只需绑定对应 VAO。本课用顶点与索引分别上传的圆环，切换 POINTS/LINES/TRIANGLES 等图元，并对比 drawArrays 与 drawElements。',
    flow: [
      '创建 VBO 绑定到 ARRAY_BUFFER，用 bufferData 上传顶点数据。',
      '创建 EBO 绑定到 ELEMENT_ARRAY_BUFFER，用 bufferData 上传索引数据。',
      '用 vertexAttribPointer 配置属性指针，并挂到 VAO（WebGL1 经 OES_vertex_array_object 扩展）。',
      '按所选 mode 用 drawArrays 或 drawElements 发起绘制。',
    ],
    notes: [
      'drawArrays(mode, first, count) 与 drawElements(mode, count, type, offset) 的 mode 均可取 POINTS、LINES、LINE_STRIP、TRIANGLES、TRIANGLE_FAN。',
      'drawElements 必须绑定 ELEMENT_ARRAY_BUFFER，索引值不能越过顶点总数。',
      '复用顶点时 drawElements 比重复放顶点更省显存与带宽。',
      'VAO 只保存状态而非数据，绑定后无需重复执行 enableVertexAttribArray / vertexAttribPointer；WebGL1 用扩展、WebGL2 原生支持。',
    ],
    problem: '解决"顶点数据如何高效发送到 GPU，以及如何复用顶点减少传输"的问题。',
  },
  {
    id: 'W_4',
    title: 'attribute、uniform、varying 与数据传递',
    navTitle: '数据传递',
    category: '基础入门',
    path: '/webgl/w-4/attribute-uniform',
    summary: '用动态彩色方块展示三种着色器变量类型的不同使用场景。',
    demo: W04Attributes,
    code: W04Code,
    language: 'glsl',
    principle:
      '三类着色器变量对应不同的数据粒度：attribute 是逐顶点输入（位置 aPosition、颜色 aColor），由 CPU 端 buffer + vertexAttribPointer 提供；uniform 是单次 draw call 内所有顶点与像素共享的全局量（如时间 uTime、开关 uUseAttributeColor）；varying 是顶点着色器写给片段着色器的插值通道。顶点着色器按 uTime 与各顶点自身的 aPosition 计算波浪位移，片段着色器在属性色与动态色之间 mix，演示数据从 CPU 平滑流向 GPU 着色器。',
    flow: [
      'attribute aPosition/aColor 作为逐顶点输入，提供位置与基础色。',
      'uniform uTime 由 CPU 每帧更新，为该帧所有顶点共享。',
      '顶点着色器结合 uTime 与 aPosition 计算波浪位移并写入 gl_Position。',
      'varying vColor 把颜色传给片段着色器，片段端按 uUseAttributeColor 在属性色与动态色之间 mix。',
    ],
    notes: [
      'attribute 个数受 GL_MAX_VERTEX_ATTRIBS 限制（WebGL1 中通常至少 8 个）。',
      'uniform 可在每次 draw 前更新，适合传时间、矩阵、颜色等全局状态。',
      'varying 在光栅化阶段做透视校正插值，无需在着色器里手写插值。',
      'attribute/varying 是 WebGL1 的旧关键字，WebGL2 的 #version 300 es 改用 in/out；本课沿用 WebGL1 写法以便对照入门。',
    ],
    problem: '解决"WebGL 中不同粒度的数据如何在 CPU 与 GPU 之间正确传递"的问题。',
  },
  {
    id: 'W_5',
    title: '二维变换矩阵',
    navTitle: '2D矩阵',
    category: '空间变换',
    path: '/webgl/w-5/2d-transform',
    summary: '用矩阵库实现平移、旋转、缩放的组合变换。',
    demo: W05Matrices,
    code: W05Code,
    language: 'glsl',
    principle:
      '本课用 3x3 齐次矩阵在 2D 实现平移、旋转、缩放的组合，对应 GLSL 里的 mat3。齐次坐标给 (x, y) 补上第 3 个分量 1（vec3(aPosition, 1.0)），把平移也纳入线性矩阵乘法。多个变换按"从右往左"的顺序依次作用到向量，M = T * R * S 表示先缩放 S、再旋转 R、最后平移 T。顶点着色器执行 uMatrix * vec3(aPosition, 1.0) 并把结果作为位置输出。',
    flow: [
      '分别创建平移 createTranslationMatrix、旋转 createRotationMatrix、缩放 createScaleMatrix 三个 3x3 矩阵。',
      '按 T * R * S 依次相乘得到组合矩阵。',
      '把组合矩阵作为 uniform mat3 uMatrix 传入顶点着色器。',
      '顶点着色器计算 uMatrix * vec3(aPosition, 1.0)，取前两维写入 gl_Position。',
    ],
    notes: [
      '齐次坐标通过额外的 1 分量把平移纳入线性变换；做投影等操作时会用到其含义。',
      '矩阵乘法不满足交换律，交换因子顺序会得到不同结果，务必从右往左理解组合。',
      '本例直接手写 3x3 矩阵以便看清原理，工程中常用 gl-matrix 等库并统一为 4x4 以兼容 3D。',
      'GLSL 的 mat3/mat4 按列主序（column-major）存储，CPU 端数组需按其约定排布，与常见行主序不同。',
    ],
    problem: '解决"如何用数学矩阵组合表示物体的移动、旋转和缩放"的问题。',
  },
  {
    id: 'W_6',
    title: 'MVP 矩阵与 3D 空间',
    navTitle: 'MVP矩阵',
    category: '空间变换',
    path: '/webgl/w-6/mvp-matrix',
    summary: '用 3D 立方体展示模型、视图、投影三种矩阵的协作。',
    demo: W06MVP,
    code: W06Code,
    language: 'glsl',
    principle:
      'Model 矩阵把顶点的局部坐标变换到世界空间；View 矩阵把世界坐标变换到相机（观察）空间；Projection 矩阵把相机空间变换到裁剪空间。顶点着色器按 uProjection * uView * uModel * vec4(aPosition, 1.0) 依次作用，得到裁剪坐标，随后硬件再做透视除法得到 NDC、视口变换到屏幕像素。本课用 3D 立方体分别传三个矩阵，以便看清级联顺序。',
    flow: [
      'Model 矩阵：把顶点从局部空间变换到世界空间。',
      'View 矩阵：把世界空间变换到相机空间。',
      'Projection 矩阵（透视或正交）：把相机空间变换到裁剪空间。',
      '顶点着色器执行 gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0)。',
    ],
    notes: [
      '透视投影（fov、near、far）产生近大远小的真实感，正交投影保持平行关系，适合 2D 与工程制图。',
      '裁剪坐标除以 w（透视除法）后得到 NDC（归一化设备坐标），超出 [-1,1] 的顶点被裁剪掉。',
      '通常可把三段矩阵预合成 MVP 以减少 uniform 与运算，本课保留三矩阵以便看清级联顺序。',
      'Model→View→Projection 的顺序必须保持不变，调换会投影出错。',
    ],
    problem: '解决"3D 物体如何从自身坐标变换到屏幕像素坐标"的核心渲染问题。',
  },
  {
    id: 'W_7',
    title: '相机控制与视角',
    navTitle: '相机控制',
    category: '空间变换',
    path: '/webgl/w-7/camera-control',
    summary: '用轨道相机展示视角移动、缩放和旋转的交互控制。',
    demo: W07Camera,
    code: W07Code,
    language: 'glsl',
    principle:
      'View 矩阵的本质是把相机放置到原点、视线对齐轴，从而把世界坐标变换到相机空间。轨道相机用一组球坐标参数（半径 radius、方位角 theta、仰角 phi）描述相机相对目标点的位置：先由球坐标换算相机位置 eye，再用 lookAt(eye, target, up) 构造 View 矩阵，与投影矩阵合成 VP 传入着色器。本课通过滑杆/自动旋转改变球坐标，实现围绕目标点的旋转与缩放。',
    flow: [
      '维护半径 radius、方位角 theta、仰角 phi 与目标点 target。',
      '由球坐标换算相机位置：eye = target + r * (sin(phi)·cos(theta), cos(phi), sin(phi)·sin(theta))。',
      '用 lookAt(eye, target, up) 生成 View 矩阵。',
      '把 View 与 Projection 相乘得到 VP（本课再合并为 uMVP）传入顶点着色器。',
    ],
    notes: [
      'lookAt 用视线向量与 up 作叉积重建右、上、前三个正交基，组成旋转并配合平移形成 View。',
      '球坐标各参数独立可调：radius 控制缩放、theta/phi 控制绕目标旋转，适合查看单一物体。',
      '仰角 phi 须约束在 (0, π) 之间，否则越过天顶会出现翻转。',
      'View 矩阵只决定"从哪看"，不修改模型数据本身；第一人称相机通常直接累加 yaw/pitch 与位移。',
    ],
    problem: '解决"如何通过用户交互自然地控制 3D 视角"的问题。',
  },
  {
    id: 'W_8',
    title: '2D 纹理与 UV 坐标映射',
    navTitle: '纹理映射',
    category: '纹理贴图',
    path: '/webgl/w-8/textures',
    summary: '用纹理图片展示 UV 坐标到网格的映射过程。',
    demo: W08Textures,
    code: W08Code,
    language: 'glsl',
    principle:
      '纹理是上传到 GPU 显存的图像数据，通过 UV 坐标（0~1）贴到几何体表面。每个顶点除位置外还带一个 aUV 属性，作为 varying vUV 传给片段着色器并在光栅化时插值，最后用 texture2D(uTexture, uv) 采样得到颜色。本课把一张图片贴到四边形，用 tile/offset 滑杆演示对 UV 的缩放（平铺）与偏移定位，并叠加 UV 网格便于观察映射关系。',
    flow: [
      '创建纹理对象并绑定到 TEXTURE_2D，用 texImage2D 上传图片数据。',
      '设置纹理参数（wrap 环绕、filter 过滤），确保可完整采样。',
      '顶点带 aUV，顶点着色器作为 varying vUV 转发给片段着色器。',
      '片段着色器对 vUV 做平铺/偏移后调用 texture2D（uTexture, uv）采样输出。',
    ],
    notes: [
      'UV 是归一化二维坐标，(0,0) 在左下、U 向右、V 向上，对应纹理图像第一行位于顶部。',
      '采样越界的 UV 行为由 wrap 决定：CLAMP_TO_EDGE 夹紧、REPEAT 环绕做无缝平铺。',
      '纹理 y 轴与 WebGL 屏幕坐标方向相反，上传前通常需在 CPU 端把图片上下翻转。',
      '图片需异步加载，texImage2D 之前要确认 Image 已完成解码，否则上传的是空白数据。',
    ],
    problem: '解决"如何把一张图片贴到 3D 几何体表面"的问题。',
  },
  {
    id: 'W_9',
    title: '纹理过滤与 Mipmap',
    navTitle: '过滤Mipmap',
    category: '纹理贴图',
    path: '/webgl/w-9/texture-filter',
    summary: '对比不同过滤模式和 Mipmap 层级的渲染效果。',
    demo: W09TextureFilter,
    code: W09Code,
    language: 'glsl',
    principle:
      '纹理过滤决定采样取值方式：NEAREST 直接取最近的纹素、呈块状锯齿，LINEAR 取 2x2 邻近纹素做双线性插值、更平滑；放大（MAG_FILTER）与缩小（MIN_FILTER）可分别设置，缩小时可选 Mipmap 相关过滤。Mipmap 是一组逐级缩小的预生成纹理，让缩小时由硬件按屏幕覆盖面积自动选层、必要时跨层混合，以减轻摩尔纹与闪烁。本课手动按 2 的幂构建各 mip 层级，切换 NEAREST_MIPMAP_NEAREST 与 LINEAR_MIPMAP_LINEAR，并可单独查看某一层。',
    flow: [
      '按 2 的幂用 texImage2D 的 level 参数逐级生成并上传各 mip 层。',
      '设置 MIN_FILTER 为 NEAREST_MIPMAP_NEAREST 或 LINEAR_MIPMAP_LINEAR，MAG_FILTER 独立设置。',
      '通过 zoom 改变屏幕上纹素的覆盖比例，观察不同过滤下的清晰度差异。',
      '用 mip 层级滑杆单独查看某一层，直观对比各层清晰度。',
    ],
    notes: [
      'MIN_FILTER 决定缩小过滤（可为 NEAREST/LINEAR 或带 MIPMAP_*），MAG_FILTER 决定放大过滤（仅 NEAREST/LINEAR）。',
      'LINEAR_MIPMAP_LINEAR（三线性）在层内与跨层都做插值，质量最高但开销也最大。',
      'WebGL1 中完整 mip 链通常要求纹理尺寸为 2 的幂；WebGL2 / NPOT 扩展才允许非 2 次幂并带 mip。',
      '各向异性过滤（EXT_texture_filter_anisotropic）可改善斜视角纹理的模糊，属于进阶优化。',
    ],
    problem: '解决"纹理在缩小时如何减少摩尔纹和锯齿"的问题。',
  },
  {
    id: 'W_10',
    title: '多纹理与混合',
    navTitle: '多纹理混合',
    category: '纹理贴图',
    path: '/webgl/w-10/multi-texture',
    summary: '展示如何同时使用多张纹理并在着色器中混合。',
    demo: W10MultiTexture,
    code: W10Code,
    language: 'glsl',
    principle:
      '把多张纹理绑定到不同的纹理单元（TEXTURE0、TEXTURE1 等），在片段着色器里声明多个 uniform sampler2D 分别采样，再按权重或模式把颜色合并起来。纹理单元是 GPU 用于绑定"sampler↔纹理数据"的槽位，数量受硬件限制。本课用基础色与叠加色两张纹理，提供 mix（线性插值）、相加、相乘、alpha 覆盖等几种着色器内混合模式并配 uBlendFactor 调节。',
    flow: [
      '为每张纹理绑定一个纹理单元，用 uniform1i 把该单元号指派给对应 sampler。',
      '顶点带 aUV，作为 varying vUV 传给片段着色器。',
      '片段着色器分别用 texture2D 采样 uBaseTex 与 uOverlayTex 得到两色。',
      '按选中的 mix/add/multiply/alpha 模式与 uBlendFactor 合并后输出。',
    ],
    notes: [
      '可用纹理单元数由 GL_MAX_TEXTURE_IMAGE_UNITS 决定，WebGL1 通常至少 8 个；sampler 只是指向单元号的整数。',
      '本课的混色在片段着色器内部完成（纹素对纹素）；若要让片元再与帧缓冲已有内容合成（如透明物体），需启用 gl.BLEND 并配 blendFunc。',
      '一份网格配一套 attribute，通过多个 sampler 即可在单次 draw call 内组合多张纹理。',
      '同一 UV 下采样多张图再加权，是法线贴图、粗糙度贴图等 PBR 材质叠加的基础。',
    ],
    problem: '解决"如何在一个物体上叠加多种纹理效果（如颜色+法线+高光）"的问题。',
  },
  {
    id: 'W_11',
    title: '环境光与漫反射光照',
    navTitle: '基础光照',
    category: '光照模型',
    path: '/webgl/w-11/basic-lighting',
    summary: '展示环境光和 Lambert 漫反射光照模型的实现。',
    demo: W11Lighting,
    code: W11Code,
    language: 'glsl',
    principle:
      '本课演示最简单的一灯一材质照明：漫反射用 Lambert 定律，表面亮度正比于法线 N 与光源方向 L 的点积 max(dot(N, L), 0)；光源视为来自无穷远的平行光，L 用方向向量（uniform uLightDir）表示。环境光 Ambient 用与方向无关的常量（uAmbient）近似间接光，最终颜色 = 环境光 + 漫反射。本课把法线经法线矩阵变换到世界空间后传给片段着色器，逐像素计算 N·L。',
    flow: [
      '顶点着色器把模型法线经 uNormalMatrix 变换到世界空间，并随 varying 传给片段着色器。',
      '片段着色器对法线 N 与光源方向 L 归一化。',
      '计算 NdotL = max(dot(N, L), 0.0) 得到漫反射强度。',
      'ambient = uAmbient * 材质色，diffuse = 材质色 * NdotL，二者相加输出。',
    ],
    notes: [
      '平行光用方向向量表示、来自无穷远，场景各点光照方向一致，适合超大光源。',
      'N 与 L 都应归一化为单位向量，点积结果才落在 [0,1]，否则强度被放缩。',
      'NdotL 用 max 截负为 0，让背光面不再发光。',
      '法线矩阵取模型矩阵的逆转置，配合世界空间光照，是后面进阶光照的基础。',
    ],
    problem: '解决"如何让 3D 物体在光照下呈现明暗效果"的问题。',
  },
  {
    id: 'W_12',
    title: '镜面高光与 Phong 光照',
    navTitle: 'Phong光照',
    category: '光照模型',
    path: '/webgl/w-12/phong-lighting',
    summary: '展示环境光+漫反射+镜面高光的完整 Phong 光照模型。',
    demo: W12Phong,
    code: W12Code,
    language: 'glsl',
    principle:
      'Phong 在环境光 + 漫反射之上加入镜面高光：高光强度由反射向量 R = reflect(-L, N) 与视线向量 V 的接近程度决定，用 pow(max(dot(R, V), 0), shininess) 作为强度，shininess（镜面指数）越大高光越集中锐利。全球位置 uViewPos 传入后，V = normalize(uViewPos - vWorldPos)。本课在球体上并排对比 Lambert 与 Phong，可调 shininess 与高光强度。',
    flow: [
      '顶点着色器输出世界坐标 vWorldPos 与法线（法线矩阵变换并归一化）。',
      '片段中求视线 V = normalize(uViewPos - vWorldPos) 与反射向量 R = reflect(-L, N)。',
      '高光 specular = 强度 * pow(max(dot(R, V), 0), shininess)。',
      'ambient + diffuse + specular 三者相加输出。',
    ],
    notes: [
      'Phong 高光与视角相关：视线方向越接近反射方向，高光越亮。',
      'shininess 是镜面指数，常用范围 1~128，越大高光越小而集中。',
      'Blinn-Phong 改用半向量 H = normalize(L + V) 计算 N·H，速度更快且高光形状更柔和，是 Phong 的常用改进。',
      '本课镜面高光用固定强度与白色 specular，未乘光源/材质颜色，突出高光位置与形状即可。',
    ],
    problem: '解决"如何模拟光滑表面的镜面反射高光效果"的问题。',
  },
  {
    id: 'W_13',
    title: '法线计算与光照方向',
    navTitle: '法线光照',
    category: '光照模型',
    path: '/webgl/w-13/normals-lighting',
    summary: '展示顶点法线、法线矩阵与光照方向的正确变换。',
    demo: W13Normals,
    code: W13Code,
    language: 'glsl',
    principle:
      '法线描述表面朝向，光照强弱取决于法线与光源的夹角。模型经缩放等变换时，法线不能简单用模型矩阵变换——尤其非等比缩放会按轴不等地拉伸，导致法线不再垂直于表面；正确做法是用模型矩阵 3x3 部分的逆转置（即法线矩阵）来变换法线。本课用一个立方体，通过 scaleX/Y/Z 滑杆制造非等比缩放，配合法线可视化线段直观展示该差异。硬边物体每面用一个面法线即得平面着色（flat），曲面则可把顶点法线取相邻面法线平均做平滑着色（smooth）。',
    flow: [
      '为网格提供位置 + 法线两类 attribute（立方体每面一个面法线，保留硬边）。',
      '由模型矩阵左上 3x3 求逆转置得到 uNormalMatrix，顶点着色器用它变换法线并归一化。',
      '在片段着色器中结合法线、光源、视线计算光照，并把结果输出。',
      '叠加沿法线方向的短线段（法线可视化），直接检查各面法线朝向，并随非等比缩放观察其必要性。',
    ],
    notes: [
      '等比（均匀）缩放时法线矩阵退化为模型矩阵的旋转部分，直接用左上 3x3 即可；非等比缩放必须用逆转置。',
      '面法线逐面固定 → 硬边平面着色；取相邻面法线平均 → 平滑着色，适合球体、车体等曲面。',
      '法线矩阵只处理方向、与平移无关，因此取模型矩阵左上 3x3 的逆转置即可。',
      '变换后务必归一化，否则点积、反射等运算得到的强度会被额外放大或缩小。',
    ],
    problem: '解决"光照计算中法线方向如何随模型变换正确更新"的问题。',
  },
  {
    id: 'W_14',
    title: '帧缓冲与离屏渲染',
    navTitle: 'FBO离屏',
    category: '高级渲染',
    path: '/webgl/w-14/fbo-offscreen',
    summary: '用离屏渲染展示 FBO 的创建、绑定与纹理附件。',
    demo: W14FBO,
    code: W14Code,
    language: 'glsl',
    principle:
      '帧缓冲对象（Framebuffer Object, FBO）允许把渲染结果写入离屏目标，而不直接显示在屏幕上。FBO 本身不保存图像，须挂接附件才有意义：颜色附件常用一张 RGBA 纹理，让后续能把它当普通纹理采样复用。本课先把带光照的场景渲到 FBO 的纹理附件，再在全屏四边形（quad）上采样该纹理做第二遍绘制，并切换原样/反相/灰度/棕褐等处理来验证"渲染到纹理"的往返。',
    flow: [
      '创建 FBO 并绑定，创建颜色纹理作为 COLOR_ATTACHMENT0 附件。',
      '配齐深度/模板等必需附件后，检查 FBO 完整状态（Framebuffer is complete）。',
      '第一遍把场景渲染到 FBO 的颜色纹理。',
      '第二遍绑定默认帧缓冲，用全屏四边形采样该纹理显示（可加简单逐像素处理）。',
    ],
    notes: [
      'FBO 不存储图像本身，必须挂接纹理或渲染缓冲附件；用纹理作颜色附件便于后续采样复用。',
      '只需确认 FBO 完整（checkFramebufferStatus），附件格式不匹配或有遗漏会返回 incomplete。',
      '切回屏幕需 bindFramebuffer(null)；离屏纹理尺寸通常与屏幕分辨率一致，第 2 遍按比例映射。',
      '基于 FBO 的离屏渲染是后处理、阴影映射、G-Buffer、镜像水面等高级技术共用的一条基础通道，本课先掌握"渲到纹理再读回"。',
    ],
    problem: '解决"如何把渲染结果输出到纹理而非屏幕，以便二次利用"的问题。',
  },
  {
    id: 'W_15',
    title: '阴影映射',
    navTitle: '阴影映射',
    category: '高级渲染',
    path: '/webgl/w-15/shadow-mapping',
    summary: '展示 shadow map 的生成与 PCF 软阴影采样。',
    demo: W15Shadows,
    code: W15Code,
    language: 'glsl',
    principle:
      '阴影映射分两遍渲染：第 1 遍从光源视角看场景，把每个可见点的深度写入 shadow map（常为深度纹理）；第 2 遍从相机视角正常渲染，把每个像素变换到光空间，用其光空间深度与 shadow map 中所存光源可见深度比较，若更深说明该点被遮挡、落在阴影中。本课用平行光，第 1 遍把 gl_FragCoord.z 写入纹理，第 2 遍在片段着色器里用 3x3 PCF 对周围 9 个纹素平均以柔化阴影边缘，并配合 bias 与强度调节。',
    flow: [
      'Pass 1：用 uLightMVP 把网格变换到光空间，把 gl_FragCoord.z 写入深度纹理。',
      'Pass 2：正常渲染场景，顶点着色器同时计算顶点的光空间坐标 vLightSpacePos。',
      '片段中把光空间坐标做透视除法并映射到 [0,1]，用它采样 shadow map。',
      '比较当前深度（适当加 bias）与采样深度判断遮挡，3x3 PCF 平均得到软阴影，乘以强度后作用于漫反射与高光。',
    ],
    notes: [
      'shadow map 分辨率决定阴影边缘精度，越高越清晰但越耗显存、带宽与采样。',
      'bias 偏移用于抵消深度量化误差，防止表面自遮挡出现阴影粉刺（shadow acne）。',
      '3x3 PCF 在边缘采样 9 个纹素并平均，是简单有效的软阴影近似。',
      '平行光在光空间用一个正交投影构成 uLightMVP；点光源/聚光灯需六面或更深的方法，属进阶。',
    ],
    problem: '解决"如何在 WebGL 中实时计算动态阴影"的问题。',
  },
  {
    id: 'W_16',
    title: '后处理效果',
    navTitle: '后处理',
    category: '高级渲染',
    path: '/webgl/w-16/post-processing',
    summary: '用全屏四边形展示 Bloom、模糊、灰度等后处理效果。',
    demo: W16PostProcess,
    code: W16Code,
    language: 'glsl',
    principle:
      '后处理先把场景渲染到 FBO 纹理，再做第二遍用全屏四边形（Fullscreen Quad）覆盖屏幕，在片段着色器里对该纹理做逐像素或邻域采样运算，从而叠加各种特效。每个效果相当于一个 pass，把某 pass 的结果存回纹理即可继续串联下一个效果。本课用全屏四边形的片段着色器实现灰度化、3x3 高斯卷积模糊、简易泛光三种效果，并可用 intensity 调节强度、对模糊做二次处理。',
    flow: [
      '第一遍把场景渲染到 FBO 的纹理上。',
      '第二遍绘制覆盖全屏的四边形，绑定该纹理作为采样输入。',
      '片段着色器按效果分支选择灰度 / 3x3 卷积模糊 / 亮度阈值相加的泛光。',
      '把结果输出到屏幕；若要串联效果，把每 pass 结果存回纹理再喂给下一个 pass。',
    ],
    notes: [
      '全屏四边形通常直接在顶点着色器里输出 NDC 顶点（gl_Position = vec4(aPosition,0,1)），UV 由顶点的位置换算得到。',
      '高斯模糊是加权邻域卷积，可按"横向+纵向两次线性 pass + 降采样"比直接 3x3 一步更省，本课用 3x3 一步近似以便看清原理。',
      '成熟的泛光常先提取高亮、多次降采样并模糊后再叠加；本课用阈值判定加亮作为简化演示。',
      '后处理开销集中在片段着色器的纹理采样次数，采样越多越贵，是移动端的主要瓶颈。',
    ],
    problem: '解决"如何在渲染管线末端添加视觉特效"的问题。',
  },
  {
    id: 'W_17',
    title: 'WebGL2 新特性',
    navTitle: 'WebGL2',
    category: 'WebGL2',
    path: '/webgl/w-17/webgl2-features',
    summary: '展示 WebGL2 的 Uniform Buffer、Texture 3D、浮点纹理等新能力。',
    demo: W17WebGL2,
    code: W17Code,
    language: 'glsl',
    principle:
      'WebGL2 基于 OpenGL ES 3.0，GLSL 改用 #version 300 es：attribute→in、varying→in/out，片段输出用 out 变量，并支持 layout(location=N) 显式指定 attribute 位置、UBO、3D 纹理、原生 VAO、整数纹理、Transform Feedback、MRT 等。本课以 WebGL1/WebGL2 双实现对照，重点演示两点：一是 UBO（一个 std140 布局的 SharedData 块在顶点与片段着色器间共享 uniform，仅需一块缓冲），二是用 sampler3D 查 3D 查找表（LUT）做色彩分级。',
    flow: [
      '用 canvas.getContext("webgl2") 获取 WebGL2 上下文，检测是否支持。',
      '创建并填充 UBO，用 uniformBlockBinding 把该块绑定到统一的绑定点。',
      '着色器用 layout(std140) uniform 块声明 SharedData，顶点与片段共享同一块数据。',
      '渲染时用 sampler3D 对三维查找表采样做色彩分级，并与 WebGL1 版本效果对照。',
    ],
    notes: [
      'UBO 把多个 uniform 打包进一个缓冲区，可在多个着色器、多次 draw 之间共享，减少逐个设置 uniform 的 CPU→GPU 开销。',
      'std140 是 UBO 的布局标准，成员存在对齐规则（如 vec2 需 8 字节对齐、mat 按列分段），填数据时须按它排布。',
      'WebGL2 原生提供 gl.createVertexArray 等 VAO API，不再需要 OES 扩展。',
      '整数/浮点纹理渲染目标等需配合相应扩展（如 EXT_color_buffer_float）；Transform Feedback、MRT 亦为 WebGL2 增强能力。',
    ],
    problem: '解决"如何利用 WebGL2 的新特性获得更好的性能和能力"的问题。',
  },
  {
    id: 'W_18',
    title: 'Instanced Rendering 实例化渲染',
    navTitle: '实例化',
    category: 'WebGL2',
    path: '/webgl/w-18/instancing',
    summary: '用实例化渲染展示大量几何体的高效绘制。',
    demo: W18Instancing,
    code: W18Code,
    language: 'glsl',
    principle:
      '实例化渲染用一次 draw call 绘制大量相同的几何体，避免为每个物体各发一次 draw call。每个实例有一组额外的逐实例 attribute（如位置 a_instance_pos、转角 a_instance_rot），通过属性除数（divisor）设为 1 让其每画一个实例才推进一次，从而与逐顶点属性区分。本课在 WebGL1 里用 ANGLE_instanced_arrays 扩展（对应 API 带 ANGLE 后缀）在立方体阵列上对比实例化与逐个依次 draw，直观看到 draw call 减少。',
    flow: [
      '创建实例属性缓冲（每实例的位置、旋转），加载到 buffer。',
      '用 vertexAttribDivisor 把实例属性设为除数 1（每实例推进一次）。',
      '调用带实例数的绘制（WebGL1 扩展为 drawElementsInstancedANGLE）一次画完。',
      '顶点着色器用 gl_InstanceID 或逐实例 attribute 获得该实例的偏移与旋转。',
    ],
    notes: [
      'divisor=1 表示该属性每实例推进一次，divisor=0 表示逐顶点；由此把属性划分为逐顶点与逐实例两类。',
      '实例属性个数受 GL_MAX_VERTEX_ATTRIBS 约束（它们也是普通 attribute 槽位）。',
      'WebGL1 用 ANGLE_instanced_arrays 扩展（vertexAttribDivisorANGLE / drawArraysInstancedANGLE），WebGL2 原生同名 API 不需要扩展。',
      '适合草地、雨滴、粒子、网格阵列等大量相同几何体；相比逐个 draw 大幅减少 CPU→GPU 状态切换。',
    ],
    problem: '解决"如何高效绘制上千个相同几何体"的性能问题。',
  },
  {
    id: 'W_19',
    title: '粒子系统与 GPU 计算',
    navTitle: '粒子系统',
    category: '工程实践',
    path: '/webgl/w-19/particle-system',
    summary: '展示基于 GPU 的粒子系统，包括位置更新和渲染。',
    demo: W19Particles,
    code: W19Code,
    language: 'glsl',
    principle:
      '本课在 WebGL1 里用 GPGPU（把 GPU 当通用处理器）方式模拟数万粒子：粒子状态（位置 + 速度）打包进一张纹理，每帧先渲染一个全屏四边形，把旧纹理当作输入、在片段着色器里做物理更新（朝引力中心加速、阻尼衰减、边界折叠），把新状态写进另一张纹理，再经过 ping-pong 交换作为下一帧输入；渲染 pass 则按粒子索引读取纹理里的位置，用 gl.POINTS 点精灵绘制。',
    flow: [
      '把每个粒子的位置/速度编码进一张纹理（每纹素一个粒子）。',
      '每帧渲染全屏四边形：片段着色器采样旧状态纹理，更新后写入对偶纹理。',
      '交换两张纹理（ping-pong），新状态成为下一帧输入。',
      '渲染 pass 用点精灵（gl.POINTS + gl_PointSize）按纹理中的位置绘制粒子。',
    ],
    notes: [
      'GPGPU 用纹理当"数据显示"，片段着色器当"并行计算核"，适合位置、速度这类逐点数据。',
      'ping-pong 用两张纹理/两个 FBO 交替读写，避免在读写同一纹理时出错。',
      '点精灵的软边、渐变需用 gl_PointCoord 在片段中判断，例如 dist 淘汰并把 alpha 衰减。',
      '用着色器内存读写而非 CPU 逐粒子回算，粒子数量上可以做到好几万甚至更多。',
    ],
    problem: '解决"如何在浏览器中实现大量粒子的实时模拟"的性能问题。',
  },
  {
    id: 'W_20',
    title: '性能优化与调试',
    navTitle: '性能调试',
    category: '工程实践',
    path: '/webgl/w-20/performance',
    summary: '展示 WebGL 性能分析、常见瓶颈与优化手段。',
    demo: W20Performance,
    code: W20Code,
    language: 'glsl',
    principle:
      'WebGL 性能优化通常围绕三方面：减少 CPU→GPU 的数据与状态切换（draw call 数量、是否复用 VBO/VAO、是否避免每帧重建缓冲）、控制 GPU 显存/带宽占用（纹理压缩、Mipmap、过滤选择）、以及把低频工作交给 CPU 之前先想清楚。本课通过一个物体阵列演示实例化与合批（把多个分散网格合成一个大的 index buffer 一次性绘出）对 draw call 的削减，并用 FPS、draw call 数、显存占用的实时统计来量化优化效果。',
    flow: [
      '用 requestAnimationFrame 驱动渲染循环，内置 FPS 与帧耗时统计。',
      '对比实例化 vs 逐个绘制、以及合批前后 draw call 数量的变化。',
      '展示当前显存占用（缓冲 + 纹理估算）与三角形总数。',
      '总结常见调优点：避免每帧新建缓冲/纹理、控制采样成本、必要时使用压缩纹理。',
    ],
    notes: [
      'draw call 有固定 CPU 与驱动开销，reduce 数量是移动端 WebGL 最直接有效的优化之一，可用实例化、合批、图集达成。',
      '避免在渲染循环里反复 createBuffer/createTexture 并丢弃，优先复用并只在初始上传一次。',
      '纹理压缩（如对 WebGL1 的 S3TC、跨平台常用的 ETC2）能明显降低显存与带宽，配合 Mipmap 效果更佳。',
      '上下文属性 preserveDrawingBuffer 默认 false 反而利于性能，仅截图等场景需要时才开；开启会阻止驱动优化。',
    ],
    problem: '解决"WebGL 应用卡顿、掉帧时如何定位和优化"的工程问题。',
  },
]