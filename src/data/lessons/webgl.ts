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
    summary: '从 Canvas 获取 WebGL 上下文，理解图形管线的顶点处理与片段处理流程。',
    demo: W01WebGLContext,
    code: W01Code,
    language: 'glsl',
    principle:
      'WebGL 基于 OpenGL ES，通过 canvas.getContext("webgl") 获取上下文。渲染管线分为 CPU 端的顶点准备与 GPU 端的顶点着色→图元装配→光栅化→片段着色四个阶段。开发者通过编写 GLSL 着色器来控制 GPU 行为。',
    flow: [
      '获取 Canvas 元素并通过 getContext 获取 WebGL 上下文。',
      '创建顶点着色器和片段着色器源码。',
      '编译着色器并链接成 Program 对象。',
      '通过 drawArrays 发起绘制调用，GPU 执行管线。',
    ],
    notes: [
      'WebGL 运行在浏览器中，需要通过 Canvas 作为渲染目标。',
      '上下文创建失败时要检查 alpha、antialias、preserveDrawingBuffer 等选项。',
      'WebGL1 基于 OpenGL ES 2.0，WebGL2 基于 OpenGL ES 3.0。',
      '着色器源码中的 precision 声明影响计算精度与性能。',
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
      '顶点着色器处理每个顶点的位置变换，必须输出 gl_Position。片段着色器处理每个像素的颜色，必须输出 gl_FragColor。两者通过 varying 变量传递数据，顶点着色器输出、片段着色器读取。',
    flow: [
      '顶点着色器接收 attribute a_position，经变换后写入 gl_Position。',
      '顶点着色器把颜色通过 varying v_color 传递给片段着色器。',
      '片段着色器读取 v_color 并写入 gl_FragColor 作为像素颜色。',
      'drawArrays 触发 GPU 对每个顶点和像素执行着色器。',
    ],
    notes: [
      'attribute 只能在顶点着色器中使用，表示逐顶点输入。',
      'varying 在顶点和片段着色器间传递数据，需双端声明一致。',
      'uniform 在两个着色器中均可使用，表示全局只读输入。',
      'GLSL 中没有默认构造函数，需显式使用构造器如 vec3(1.0)。',
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
      '缓冲区对象 (Buffer) 将顶点数据上传到 GPU 显存。顶点数组对象 (VAO) 保存属性指针配置。drawArrays 按连续顶点绘制，drawElements 使用索引缓冲区 (EBO) 复用顶点。',
    flow: [
      '创建 Buffer 并绑定到 ARRAY_BUFFER。',
      '通过 bufferData 把顶点数据上传到 GPU。',
      '配置顶点属性指针 (vertexAttribPointer)。',
      '使用 drawArrays 或 drawElements 发起绘制。',
    ],
    notes: [
      'drawArrays(mode, first, count) 中 mode 可以是 POINTS、LINES、TRIANGLES 等。',
      'drawElements 使用 EBO (ELEMENT_ARRAY_BUFFER) 中的索引数据。',
      '复用顶点时使用 drawElements 比 drawArrays 节省显存和带宽。',
      'WebGL2 中推荐使用 VAO 封装属性配置。',
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
      'attribute 是逐顶点输入（位置、法线等），由 CPU 在绘制前指定；uniform 是全局变量（时间、矩阵等），在单次 draw call 中对所有顶点/片段共享；varying 是顶点到片段的插值传递。',
    flow: [
      'attribute a_position 作为顶点位置输入，每个顶点不同。',
      'uniform u_time 作为时间参数，整个 draw call 中不变。',
      'varying v_color 在顶点着色器计算后，由硬件自动插值传给片段着色器。',
      '片段着色器根据插值颜色输出最终像素。',
    ],
    notes: [
      'attribute 数量受硬件限制，通常最多 8-16 个。',
      'uniform 可在每次 draw call 前更新，适合传递全局状态。',
      'varying 的插值是线性的，透视校正由 gl_FragCoord 自动处理。',
      'WebGL2 中 varying 被 in/out 关键字替代，但向后兼容。',
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
      '变换矩阵把顶点坐标从局部空间映射到裁剪空间。平移用 4x4 矩阵的 translation 分量，旋转用三角函数矩阵，缩放用对角矩阵。矩阵乘法从右到左，通常顺序是缩放→旋转→平移。',
    flow: [
      '创建 mat4 单位矩阵。',
      '依次乘以 translate、rotate、scale 矩阵。',
      '将最终矩阵作为 uniform 传入顶点着色器。',
      '顶点着色器将矩阵乘以顶点位置，完成变换。',
    ],
    notes: [
      '矩阵乘法顺序影响结果：M = T * R * S 表示先缩放、再旋转、再平移。',
      'WebGL 使用列主序矩阵，数组存储按列排列。',
      'gl-matrix 是常用的矩阵运算库。',
      '2D 变换可以用 3x3 矩阵，但为了统一通常使用 4x4。',
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
      'Model 矩阵把顶点从局部空间变到世界空间；View 矩阵把世界空间变到相机空间；Projection 矩阵把相机空间变到裁剪空间。三者相乘 MVP 是顶点着色器的核心运算。',
    flow: [
      'Model 矩阵：物体变换到世界坐标。',
      'View 矩阵：世界坐标变换到相机坐标。',
      'Projection 矩阵（透视或正交）：相机坐标变换到裁剪坐标。',
      '顶点着色器执行 gl_Position = u_mvp * a_position。',
    ],
    notes: [
      '透视投影矩阵使用近大远小的效果，符合人眼视觉。',
      '正交投影矩阵保持平行线不相交，适合 2D 视图。',
      '矩阵按 Model→View→Projection 顺序相乘。',
      '裁剪空间坐标经过透视除法后成为 NDC（归一化设备坐标）。',
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
      '相机控制通过维护相机位置、观察点和上方向向量来构建 View 矩阵。轨道相机允许围绕目标点旋转，通过球坐标 (球面坐标) 计算相机位置。',
    flow: [
      '用户交互更新球坐标参数 (半径、方位角、仰角)。',
      '从球坐标换算相机位置向量。',
      '调用 lookAt 构建 View 矩阵。',
      'View 矩阵与 Projection 矩阵组合成 VP 矩阵传入着色器。',
    ],
    notes: [
      '相机位置 = 目标点 + 距离 * 球面坐标转直角坐标。',
      'lookAt(eye, center, up) 创建视图矩阵。',
      '轨道相机的方位角限制在 [-π/2, π/2] 避免翻转。',
      '第一人称相机需要处理 yaw 和 pitch 角。',
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
      '纹理是一张图片数据，通过 UV 坐标 (0,0)~(1,1) 映射到几何体表面。顶点存储 UV 坐标，顶点着色器传递给片段着色器，片段着色器用 texture2D 采样颜色。',
    flow: [
      '创建纹理对象并绑定到 TEXTURE_2D。',
      '设置纹理参数（包装模式、过滤模式）。',
      '通过 texImage2D 上传图片数据。',
      '在片段着色器中使用 texture2D(sampler, uv) 采样。',
    ],
    notes: [
      'UV 坐标原点在左下角 (0,0)，U 向右，V 向上。',
      'WebGL 中 Y 轴向上，与屏幕坐标 (Y 向下) 相反。',
      '纹理需要至少设置 wrap 和 filter 参数才能使用。',
      '图片加载需要异步处理，建议使用 Image 对象或纹理加载器。',
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
      '纹理过滤决定像素采样方式：NEAREST 取最近像素，LINEAR 取邻近 4 像素平均。Mipmap 是预计算的缩小版本，当纹理在屏幕上变小时使用，减少锯齿和闪烁。',
    flow: [
      '生成 Mipmap 链 (generateMipmap)。',
      '设置缩小过滤为 TRILINEAR 或 NEAREST_MIPMAP_NEAREST。',
      '设置放大过滤为 LINEAR 或 NEAREST。',
      '片段着色器中 texture2D 自动选择合适的 Mipmap 层级。',
    ],
    notes: [
      'Mipmap 只能用于 power-of-2 尺寸的纹理。',
      'LINEAR_MIPMAP_LINEAR 质量最好，性能开销也最大。',
      'Mipmap 切换由 GPU 根据屏幕纹理尺寸自动完成。',
      '各向异性过滤 (EXT_texture_filter_anisotropic) 进一步提升斜视角纹理质量。',
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
      '多个纹理通过不同的 sampler 绑定到不同纹理单元 (TEXTURE0, TEXTURE1, ...)。片段着色器中对多张纹理的颜色进行加权混合。混合 (Blending) 控制源和目标颜色的合成方式。',
    flow: [
      '创建多张纹理并分别绑定到不同纹理单元。',
      '在着色器中声明多个 uniform sampler2D。',
      '在片段着色器中分别采样各纹理。',
      '根据权重或条件混合颜色输出。',
    ],
    notes: [
      '可用纹理单元数量受 GL_MAX_TEXTURE_IMAGE_UNITS 限制。',
      '混合需要启用 gl.blendFunc 设置源/目标因子。',
      'alpha 混合常用于透明物体渲染。',
      '法线贴图、粗糙度贴图等都通过多纹理实现。',
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
      '环境光 (Ambient) 模拟物体受到的整体环境照射，与方向无关。漫反射 (Diffuse) 基于 Lambert 定律：表面越正对光源越亮，使用 N·L 点积计算。最终颜色 = ambient + diffuse。',
    flow: [
      '在顶点着色器中计算世界空间法线。',
      '把法线和光源方向传给片段着色器。',
      '片段着色器计算 N·L 得到漫反射强度。',
      '加上环境光常量得到最终颜色。',
    ],
    notes: [
      '法线需要归一化，且在世界空间计算（考虑模型矩阵的法线变换）。',
      '法线矩阵 = 模型矩阵的逆转置矩阵。',
      '漫反射需要光源方向和法线方向都是单位向量。',
      'N·L 为负时应截断为 0，表示背光面。',
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
      'Phong 模型在漫反射基础上增加镜面高光 (Specular)。计算反射向量 R 与视线向量 V 的点积，高光强度 = (R·V)^shininess。shininess 控制高光范围，值越大高光越集中。',
    flow: [
      '计算反射向量 R = reflect(-L, N)。',
      '计算 R 与视线方向 V 的点积。',
      '高光强度 pow(max(R·V, 0), shininess)。',
      '最终颜色 = ambient + diffuse + specular。',
    ],
    notes: [
      'Phong 计算在片段着色器中进行，每像素精度较高。',
      'Blinn-Phong 使用半向量 H = L+V，性能更好且广泛使用。',
      'shininess 值通常在 1~128 之间。',
      'Cook-Torrance 是更物理的光照模型，但计算量更大。',
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
      '法线是描述表面朝向的向量，用于光照计算。法线需要用模型矩阵的逆转置矩阵变换到世界空间，以正确应对非等比缩放。光照方向应与法线在同一空间中计算。',
    flow: [
      '为每个顶点指定法线属性。',
      '计算法线矩阵 (模型矩阵的逆转置)。',
      '在顶点着色器中用法线矩阵变换法线到世界空间。',
      '在世界空间或切线空间中进行光照计算。',
    ],
    notes: [
      '等比缩放时法线矩阵等于模型矩阵的旋转部分。',
      '法线贴图存储的是切线空间法线，需要 TBN 矩阵变换。',
      '顶点法线由相邻面法线平均得到，平滑着色。',
      '平面着色按面法线计算，硬边效果。',
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
      '帧缓冲对象 (FBO) 允许渲染到离屏目标而非屏幕。FBO 绑定颜色附件 (纹理) 作为输出，可用于后处理、G-Buffer 等技术。渲染后可把 FBO 纹理作为输入进行二次渲染。',
    flow: [
      '创建 FBO 并绑定。',
      '创建颜色纹理并作为 COLOR_ATTACHMENT0 附件。',
      '创建深度渲染缓冲并作为 DEPTH_ATTACHMENT 附件。',
      '在 FBO 中执行第一遍渲染。',
      '把 FBO 纹理作为输入在屏幕上进行第二遍渲染。',
    ],
    notes: [
      'FBO 状态包含颜色/深度/模板附件的配置。',
      'incomplete FBO 检查需要所有附件格式兼容。',
      'WebGL2 支持 gl.invalidateFramebuffer 优化 Tile GPU。',
      'Ping-pong 技术使用两个 FBO 交替渲染。',
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
      '阴影映射分两步：1) 从光源视角渲染场景深度到深度纹理；2) 从相机视角渲染场景，将各像素的光空间坐标与深度纹理对比判断是否在阴影中。PCF 过滤减少阴影边缘锯齿。',
    flow: [
      '第一遍：从光源视角渲染深度到 Shadow FBO。',
      '第二遍：正常渲染场景，计算每个像素在光空间的坐标。',
      '使用坐标在深度纹理中采样，比较深度判断遮挡。',
      '遮挡区域乘以阴影因子 (0~1)。',
    ],
    notes: [
      'Shadow map 分辨率影响阴影精度，需平衡性能与质量。',
      'PCF 3x3 或 5x5 采样实现软阴影。',
      '偏移 (bias) 避免阴影粉刺 (shadow acne)。',
      ' Cascaded Shadow Maps 处理大场景远距离阴影。',
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
      '后处理将场景渲染到 FBO 纹理，再用全屏四边形 (Fullscreen Quad) 覆盖屏幕，在片段着色器中对纹理进行卷积或采样运算实现各种效果。每个效果是一个 pass，可链式组合。',
    flow: [
      '场景渲染到 FBO。',
      '创建全屏四边形覆盖屏幕。',
      '在片段着色器中对 FBO 纹理进行处理。',
      '多个 pass 串联形成后处理管线。',
    ],
    notes: [
      '全屏四边形的顶点可以使用顶点生成 (in vertex shader)。',
      '高斯模糊需要水平+垂直两个 pass。',
      'Bloom 通过提取亮度→模糊→叠加实现。',
      '后处理性能瓶颈在 fragment shader，需减少采样次数。',
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
      'WebGL2 基于 OpenGL ES 3.0，新增 Uniform Buffer Objects (UBO)、纹理数组、3D 纹理、浮点渲染 (if supported)、Transform Feedback、多目标渲染等特性，显著提升性能和能力。',
    flow: [
      '获取 WebGL2 上下文 (canvas.getContext("webgl2"))。',
      '创建 UBO 并绑定到统一绑定点。',
      '在着色器中使用 uniform block 声明。',
      '利用 3D 纹理或纹理数组实现高级效果。',
    ],
    notes: [
      'UBO 允许在多个着色器间共享 uniform 数据，减少更新次数。',
      'WebGL2 原生支持 VAO，不再需要手动管理。',
      '浮点纹理需要检查 EXT_color_buffer_float 扩展。',
      'WebGL2 在移动设备上兼容性更好。',
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
      '实例化渲染通过一次 draw call 绘制多个相同几何体。每个实例通过 gl_InstanceID 获取索引，从实例缓冲区读取位置/颜色等属性。相比逐个 draw call，大幅减少 CPU→GPU 开销。',
    flow: [
      '创建实例属性缓冲区 (如每个实例的位置)。',
      '使用 gl.vertexAttribDivisor 设置实例属性的更新频率。',
      '使用 drawArraysInstanced 或 drawElementsInstanced 发起绘制。',
      '着色器中用 gl_InstanceID 索引实例属性。',
    ],
    notes: [
      'vertexAttribDivisor(1) 表示每个实例更新一次属性。',
      '最多支持 gl.getParameter(MAX_INSTANCED_ARRAYS) 个实例属性。',
      'WebGL1 中可通过 ANGLE_instanced_arrays 扩展实现。',
      '适合草地、雨滴、粒子等大量相同几何体。',
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
      '粒子系统将粒子位置存储在纹理或 VBO 中，每帧通过 ping-pong FBO 在 GPU 端更新位置 (碰撞、力场等)，然后渲染为点精灵。WebGL2 可用 Transform Feedback 直接在 GPU 更新缓冲区。',
    flow: [
      '初始化粒子位置到纹理 (gl.texImage2D)。',
      '每帧在 FBO 中渲染粒子更新 pass。',
      '片段着色器计算新位置并输出到目标纹理。',
      '交换纹理 (ping-pong) 并渲染粒子。',
    ],
    notes: [
      'GPGPU 技术用 GPU 做通用计算 (物理、流体等)。',
      'Transform Feedback (WebGL2) 可直接捕获顶点变换结果。',
      '点精灵 (gl.POINTS) 用 gl_PointSize 控制大小。',
      '大量粒子 (10万+) 建议使用 GPU 计算。',
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
      'WebGL 性能优化从 CPU→GPU 数据流、draw call 数量、GPU 显存使用三方面入手。使用 RAF 驱动、Instancing 减少 draw call、VAO 状态缓存、纹理压缩 (ETC2/S3TC)、避免每帧重建缓冲区。',
    flow: [
      '使用 requestAnimationFrame 驱动渲染循环。',
      '合并小 draw call 为 Instanced 或合批渲染。',
      '纹理使用压缩格式减少显存占用。',
      '使用 WebGL Inspector 或 Chrome DevTools 分析性能。',
    ],
    notes: [
      'Chrome://inspect/#devices 检查 WebGL 面板。',
      'WEBGL_debug_renderer_info 查看 GPU 型号。',
      '避免在渲染循环中频繁创建/删除对象。',
      '移动端注意低性能 GPU，降低分辨率和复杂度。',
      'preserveDrawingBuffer: true 便于截图，但影响性能。',
    ],
    problem: '解决"WebGL 应用卡顿、掉帧时如何定位和优化"的工程问题。',
  },
]