import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(() => loader())
}

const F01Basics = createDemo('F01Basics')
const F02FormatConversion = createDemo('F02FormatConversion')
const F03VideoInfo = createDemo('F03VideoInfo')
const F04Resolution = createDemo('F04Resolution')
const F05Bitrate = createDemo('F05Bitrate')
const F06Framerate = createDemo('F06Framerate')
const F07Crop = createDemo('F07Crop')
const F08Scale = createDemo('F08Scale')
const F09Pad = createDemo('F09Pad')
const F10Overlay = createDemo('F10Overlay')
const F11Audio = createDemo('F11Audio')
const F12Volume = createDemo('F12Volume')
const F13Subtitle = createDemo('F13Subtitle')
const F14Screenshot = createDemo('F14Screenshot')
const F15Thumbnail = createDemo('F15Thumbnail')
const F16Concat = createDemo('F16Concat')
const F17Streaming = createDemo('F17Streaming')
const F18HardwareAccel = createDemo('F18HardwareAccel')
const F19Drawtext = createDemo('F19Drawtext')
const F20Fade = createDemo('F20Fade')
const F21ColorSpace = createDemo('F21ColorSpace')
const F22Batch = createDemo('F22Batch')
const F23Gif = createDemo('F23Gif')
const F24Metadata = createDemo('F24Metadata')

export const lessons: Lesson[] = [
  {
    id: 'F_01', title: 'FFmpeg 基础概念与安装', navTitle: '基础概念',
    category: 'ffmpeg',
    path: '/ffmpeg/f-1/basics', summary: '理解容器、编解码器、流、帧、码率等核心概念，掌握 FFmpeg 的安装与基本命令结构。',
    demo: F01Basics, code: () => Promise.resolve(`# 查看 FFmpeg 版本
ffmpeg -version

# 查看媒体文件信息
ffprobe -v error -show_format -show_streams input.mp4

# 最简单的格式转换（重新编码）
ffmpeg -i input.mp4 output.avi

# 快速转封装（不重新编码）
ffmpeg -i input.mp4 -c copy output.mkv

# 查看支持的编码器
ffmpeg -encoders | grep 264

# 查看支持的滤镜
ffmpeg -filters | grep scale`), language: 'bash',
    principle: 'FFmpeg 由三个核心概念组成：容器（Container，如 MP4、MKV）负责封装，编解码器（Codec，如 H.264、H.265）负责压缩与解压，流（Stream）是容器内的音视频轨道。FFmpeg 命令行的基本结构是 ffmpeg [全局选项] [输入选项] -i 输入 [输出选项] 输出。',
    flow: ['理解容器与编解码器的关系。', '掌握 FFmpeg 命令行的基本结构。', '学习安装 FFmpeg（Windows/macOS/Linux）。'],
    notes: ['容器格式不等于编码格式，MP4 容器可以装 H.264 也可以装 H.265。', 'ffprobe 是 FFmpeg 套件中的媒体信息分析工具。', '使用 -hide_banner 可以隐藏编译信息，让输出更整洁。'],
    problem: '解决"如何理解音视频文件的结构，以及 FFmpeg 命令的基本组成"的问题。',
    officialUrl: 'https://ffmpeg.org/download.html',
  },
  {
    id: 'F_02', title: '格式转换与转封装', navTitle: '格式转换',
    category: 'ffmpeg',
    path: '/ffmpeg/f-2/format-conversion', summary: '掌握不同容器格式之间的转换，理解转封装（不重新编码）与转码（重新编码）的区别。',
    demo: F02FormatConversion, code: () => Promise.resolve(`# 转封装：MP4 → MKV（不重新编码，速度极快）
ffmpeg -i input.mp4 -c copy output.mkv

# 转码为 H.264 + AAC（兼容性最好）
ffmpeg -i input.mkv -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4

# MOV → MP4（视频不重编码，音频转 AAC）
ffmpeg -i input.mov -c:v copy -c:a aac output.mp4

# WebM → MP4（VP8/VP9 转 H.264）
ffmpeg -i input.webm -c:v libx264 -c:a aac output.mp4

# TS 片段转单文件
ffmpeg -i input.ts -c copy output.mp4

# 批量转封装当前目录所有 MP4 为 MKV
for f in *.mp4; do ffmpeg -i "$f" -c copy "\${f%.mp4}.mkv"; done`), language: 'bash',
    principle: '格式转换有两种方式：转封装（Copy Mode，-c copy）只修改容器格式不重新编码，速度极快但受限于目标容器对编码格式的兼容性；转码（Transcoding）会重新编码，可以更换编解码器但耗时较长。',
    flow: ['使用 -c copy 进行快速转封装。', '使用指定编码器进行格式转换。', '理解不同容器对编码格式的兼容性。'],
    notes: ['MP4 不支持 FLAC 音频，需要转码或换用 MKV 容器。', '转封装时如果时间戳不连续可能会导致播放问题。', '-ss 和 -t 参数可以在转封装时精确裁剪。'],
    problem: '解决"如何快速转换视频格式，以及何时需要重新编码"的问题。',
  },
  {
    id: 'F_03', title: '媒体信息分析与 ffprobe', navTitle: '媒体信息',
    category: 'ffmpeg',
    path: '/ffmpeg/f-3/video-info', summary: '使用 ffprobe 和 FFmpeg 内置分析选项，获取视频/音频的详细信息，包括编码格式、分辨率、码率、时长等。',
    demo: F03VideoInfo, code: () => Promise.resolve(`# 查看完整媒体信息
ffprobe -v error -show_format -show_streams input.mp4

# JSON 格式输出（适合程序解析）
ffprobe -v error -show_format -show_streams -print_format json input.mp4

# 获取视频时长（秒）
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4

# 获取视频分辨率
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 input.mp4

# 获取视频帧率
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4

# 列出所有流
ffprobe -v error -show_entries stream=index,codec_type,codec_name -of csv=p=0 input.mp4`), language: 'bash',
    principle: 'ffprobe 是 FFmpeg 套件中专用于媒体分析的命令行工具，支持多种输出格式（JSON、XML、Flat 等），可以精确获取容器中每个流的编码参数、时长、码率、帧率等信息，是自动化媒体处理流程的第一步。',
    flow: ['使用 ffprobe -show_format 获取容器信息。', '使用 ffprobe -show_streams 获取每个流的详细信息。', '使用 -print_format json 输出结构化数据供程序解析。'],
    notes: ['ffprobe -v error 可以只输出媒体信息不输出日志。', '使用 -show_frames 可以获取每一帧的详细信息（输出量巨大）。', 'JSON 输出格式非常适合与 Python/Node.js 等脚本语言集成。'],
    problem: '解决"如何获取视频文件的详细信息，以及如何为批量处理收集媒体元数据"的问题。',
  },
  {
    id: 'F_04', title: '分辨率调整与缩放滤镜', navTitle: '分辨率调整',
    category: 'ffmpeg',
    path: '/ffmpeg/f-4/resolution', summary: '使用 scale 滤镜调整视频分辨率，掌握等比缩放、指定缩放、填充与裁剪等常见场景。',
    demo: F04Resolution, code: () => Promise.resolve(`# 缩放到 720p（保持宽高比，-2 确保偶数）
ffmpeg -i input.mp4 -vf scale=-2:720 output.mp4

# 指定宽度，高度自动
ffmpeg -i input.mp4 -vf scale=1280:-2 output.mp4

# 强制指定分辨率（可能变形）
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4

# 适配目标尺寸并添加黑边（不裁剪不变形）
ffmpeg -i input.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" output.mp4

# 使用 lanczos 算法缩放（放大时质量更好）
ffmpeg -i input.mp4 -vf scale=1920:1080:flags=lanczos output.mp4`), language: 'bash',
    principle: 'scale 滤镜是 FFmpeg 中最常用的视频滤镜之一，通过指定宽度和高度参数可以调整视频分辨率。使用 -1 可以保持宽高比自动计算对应维度，使用 force_original_aspect_ratio 可以在指定目标尺寸内保持原始比例并添加黑边或裁剪。',
    flow: ['使用 scale=width:height 指定目标分辨率。', '使用 scale=-1:720 保持宽高比只指定高度。', '使用 force_original_aspect_ratio 在目标矩形内适配。'],
    notes: ['缩放时建议使用 -2 而不是 -1，确保尺寸是偶数（兼容编码器要求）。', '上采样（小分辨率放大）会导致画质损失，应尽量避免。', '使用 lanczos 缩放算法可以获得比默认 bilinear 更好的画质。'],
    problem: '解决"如何调整视频分辨率以适应不同播放设备，以及如何保持正确的宽高比"的问题。',
  },
  {
    id: 'F_05', title: '码率控制与视频质量', navTitle: '码率控制',
    category: 'ffmpeg',
    path: '/ffmpeg/f-5/bitrate', summary: '理解码率（Bitrate）对视频质量和文件大小的影响，掌握 CBR、CRF、VBR 等码率控制模式。',
    demo: F05Bitrate, code: () => Promise.resolve(`# CRF 模式：高质量（接近视觉无损）
ffmpeg -i input.mp4 -c:v libx264 -crf 18 output.mp4

# CRF 默认质量（23 为默认值）
ffmpeg -i input.mp4 -c:v libx264 -crf 23 output.mp4

# H.265 编码（同等画质文件更小）
ffmpeg -i input.mp4 -c:v libx265 -crf 28 output.mp4

# CRF + 限制最大码率（防止峰值）
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -maxrate 3M -bufsize 6M output.mp4

# CBR 恒定码率（适合流媒体）
ffmpeg -i input.mp4 -c:v libx264 -b:v 3M -maxrate 3M -minrate 3M -bufsize 6M output.mp4

# VBR 可变码率
ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -maxrate 3M -bufsize 4M output.mp4`), language: 'bash',
    principle: '码率控制决定视频每秒使用多少比特存储数据。CBR（恒定码率）适合流媒体，CRF（恒定速率因子）适合归档和高质量存储，VBR（可变码率）在质量和文件大小间取得平衡。x264/x265 的 CRF 取值范围是 0-51，默认 23，值越小质量越高文件越大。',
    flow: ['理解码率与质量、文件大小的关系。', '掌握 CRF 模式的使用（推荐用于大多数场景）。', '学习 CBR 和 VBR 模式的配置。'],
    notes: ['CRF 18-28 是常用范围，18 接近视觉无损。', '使用 -maxrate 和 -bufsize 可以限制 VBR 的码率峰值。', '动画内容通常比实拍视频需要更低的码率。'],
    problem: '解决"如何在有限的存储空间或带宽下保持可接受的视频质量"的问题。',
  },
  {
    id: 'F_06', title: '帧率修改与抽帧补帧', navTitle: '帧率修改',
    category: 'ffmpeg',
    path: '/ffmpeg/f-6/framerate', summary: '理解帧率（FPS）的概念，掌握修改帧率、抽帧、补帧（插值）的操作方法。',
    demo: F06Framerate, code: () => Promise.resolve(`# 查看当前帧率
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4

# 使用 fps 滤镜修改输出帧率为 30 FPS（推荐）
ffmpeg -i input.mp4 -vf fps=30 output.mp4

# 转为电影帧率 24 FPS
ffmpeg -i input.mp4 -vf fps=24 output.mp4

# 60 FPS 转 30 FPS（抽帧）
ffmpeg -i input_60fps.mp4 -vf fps=30 output_30fps.mp4

# 使用 minterpolate 插值补帧（24→60 FPS）
ffmpeg -i input_24fps.mp4 -vf minterpolate=fps=60 output_60fps.mp4

# 提取关键帧（只保留 I-frame）
ffmpeg -i input.mp4 -vf "select=eq(pict_type\\,I)" -vsync vfr output_keyframes.mp4`), language: 'bash',
    principle: '帧率决定视频每秒显示多少帧画面。修改帧率有两种方式：直接修改容器层帧率标签（不重新编码，用 -r 输入选项）和重新编码时指定输出帧率。fps 滤镜可以在重新编码时精确控制输出帧率，minterpolate 滤镜可以通过运动插值生成新帧。',
    flow: ['理解帧率对视频流畅度和文件大小的影响。', '使用 -r 指定输出帧率。', '使用 fps 滤镜精确控制帧率转换。'],
    notes: ['将高帧率视频转为低帧率会丢弃帧，无法恢复。', '使用 minterpolate 补帧效果有限，可能产生伪影。', 'NTSC 标准是 23.976/29.97 FPS，PAL 是 25/50 FPS。'],
    problem: '解决"如何统一不同来源视频的帧率，以及如何处理帧率不匹配导致的播放问题"的问题。',
  },
  {
    id: 'F_07', title: '视频裁剪（Crop）', navTitle: '视频裁剪',
    category: 'ffmpeg',
    path: '/ffmpeg/f-7/crop', summary: '使用 crop 滤镜裁剪视频画面，去除黑边、聚焦特定区域或调整为不同宽高比。',
    demo: F07Crop, code: () => Promise.resolve(`# 裁剪指定区域 crop=w:h:x:y
ffmpeg -i input.mp4 -vf crop=1280:720:0:0 output.mp4

# 自动居中裁剪 9:16 竖屏画面
ffmpeg -i input.mp4 -vf crop=ih*9/16:ih:(in_w-ih*9/16)/2:0 output.mp4

# 裁剪掉上下各 60 像素黑边
ffmpeg -i input.mp4 -vf crop=iw:ih-120:0:60 output.mp4

# 自动检测黑边参数
ffmpeg -i input.mp4 -vf cropdetect -f null -

# 使用检测到的参数裁剪
ffmpeg -i input.mp4 -vf crop=1920:960:0:60 output.mp4

# 裁剪 + 缩放组合
ffmpeg -i input.mp4 -vf "crop=1920:800:0:140,scale=1280:720" output.mp4`), language: 'bash',
    principle: 'crop 滤镜通过指定输出宽度、高度和起始坐标（相对于原始画面）来裁剪视频。语法为 crop=w:h:x:y，其中 x 和 y 可以使用 in_w 和 in_h 变量表达式自动计算居中位置，如 crop=ih*9/16:ih:(in_w-ih*9/16)/2:0 可以裁剪出居中的 9:16 竖屏画面。',
    flow: ['使用 crop=width:height:x:y 指定裁剪区域。', '使用表达式自动计算居中裁剪。', '结合 ffprobe 获取原始分辨率以确定裁剪参数。'],
    notes: ['cropdetect 滤镜可以自动检测黑边并返回建议的裁剪参数。', '裁剪后的分辨率建议为偶数以避免编码器兼容性问题。', '使用 -vf crop 而不是 -af crop（后者用于音频）。'],
    problem: '解决"如何去除视频黑边、提取特定区域画面，以及将横屏视频转为竖屏"的问题。',
  },
  {
    id: 'F_08', title: '高级缩放与宽高比处理', navTitle: '高级缩放',
    category: 'ffmpeg',
    path: '/ffmpeg/f-8/scale', summary: '掌握缩放算法选择、色彩空间感知缩放、HDR 内容缩放等高级缩放技术。',
    demo: F08Scale, code: () => Promise.resolve(`# 使用 lanczos 算法缩放（放大首选）
ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=lanczos" output.mp4

# 使用 bicubic 算法（质量与速度平衡）
ffmpeg -i input.mp4 -vf "scale=1280:720:flags=bicubic" output.mp4

# 10-bit 内容缩放（保持位深）
ffmpeg -i input.mkv -vf scale=1920:1080 -pix_fmt yuv420p10le output.mkv

# HDR 内容缩放（指定色彩空间）
ffmpeg -i input_hdr.mp4 -vf "scale=1920:1080:flags=lanczos:out_color_matrix=bt2020nc:out_range=tv" -pix_fmt yuv420p10le output_hdr.mp4

# 使用 zscale 滤镜（专业级色彩处理）
ffmpeg -i input_hdr.mp4 -vf "zscale=w=1920:h=1080:f=lanczos:m=bt2020:p=bt2020:r=tv,format=yuv420p10le" output.mp4`), language: 'bash',
    principle: 'FFmpeg 的 scale 滤镜支持多种缩放算法（bilinear、bicubic、lanczos、spline 等），不同算法在速度和质量间有不同取舍。处理 HDR 内容时需要指定正确的色彩空间参数（scale=w:h:flags=lanczos:out_color_matrix=bt2020nc），否则可能导致色偏。',
    flow: ['对比不同缩放算法的效果和速度。', '掌握 HDR 内容的缩放注意事项。', '学习使用 zscale 滤镜进行专业级色彩空间转换。'],
    notes: ['lanczos 算法在缩放质量上通常优于默认的 bilinear。', '处理 10-bit 内容时需要保持高位深，使用 out_color_matrix 和 out_range 参数。', 'zscale 滤镜基于 zimg 库，提供更专业的色彩空间转换能力。'],
    problem: '解决"如何在上采样/下采样时保持最佳画质，以及处理 HDR 内容时的色彩准确性"的问题。',
  },
  {
    id: 'F_09', title: '画面填充（Pad）与宽高比转换', navTitle: '画面填充',
    category: 'ffmpeg',
    path: '/ffmpeg/f-9/pad', summary: '使用 pad 滤镜为视频添加黑边或自定义颜色边距，将视频适配到不同宽高比的播放区域。',
    demo: F09Pad, code: () => Promise.resolve(`# 16:9 → 4:3 添加左右黑边（pillarbox）
ffmpeg -i input_16x9.mp4 -vf "pad=1920:1440:(ow-iw)/2:(oh-ih)/2" output.mp4

# 竖屏视频适配横屏（加黑边）
ffmpeg -i input_vertical.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black" output.mp4

# 添加白边
ffmpeg -i input.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:white" output.mp4

# 确保输出尺寸为偶数
ffmpeg -i input.mp4 -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" output.mp4

# 竖屏 9:16 → 横屏 16:9（缩放后填充居中）
ffmpeg -i input.mp4 -vf "scale=1920:-2,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" output.mp4`), language: 'bash',
    principle: 'pad 滤镜通过在视频画面周围添加填充区域来实现宽高比转换，而不裁剪或拉伸原始内容。语法为 pad=w:h:x:y:color，其中 w 和 h 是输出尺寸，x 和 y 是原始画面在新画布上的位置。常用 (ow-iw)/2:(oh-ih)/2 让原始画面居中。',
    flow: ['使用 pad 滤镜添加黑边适配 16:9 或 4:3 显示区域。', '掌握使用表达式自动计算居中位置。', '学习为竖屏视频添加左右黑边以适配横屏播放器。'],
    notes: ['pad 滤镜的 color 参数支持颜色名称、十六进制值和表达式。', '使用 pad=ceil(iw/2)*2:ceil(ih/2)*2 可以确保输出尺寸为偶数。', '与 scale+crop 组合可以实现「填充模式」的宽高比转换（类似于 CSS 的 object-fit: cover）。'],
    problem: '解决"如何在不裁剪或拉伸的情况下将视频适配到不同宽高比的播放区域"的问题。',
  },
  {
    id: 'F_10', title: '画面叠加与画中画（Overlay）', navTitle: '画面叠加',
    category: 'ffmpeg',
    path: '/ffmpeg/f-10/overlay', summary: '使用 overlay 滤镜实现画中画、水印添加、多画面拼接等叠加效果。',
    demo: F10Overlay, code: () => Promise.resolve(`# 基础画中画（右上角）
ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=W-w-20:H-h-20" output.mp4

# 带透明度的画中画（0.5 = 50% 透明）
ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180,format=rgba,colorchannelmixer=aa=0.5[pipsmall];[0:v][pipsmall]overlay" output.mp4

# 画中画指定时间段显示
ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=W-w-20:H-h-20:enable='between(t,10,20)'" output.mp4

# 添加图片水印（右上角）
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=W-w-20:20" output.mp4

# 滚动水印（从右向左）
ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=x=W-t*50:y=H-h-20" output.mp4`), language: 'bash',
    principle: 'overlay 滤镜需要配合复杂的滤镜图（Filter Complex，-filter_complex）使用，通过将两个视频流叠加来实现画中画效果。基本语法为 [背景][前景]overlay=x:y。可以使用 enable 选项控制叠加的时间区间，实现动态显示/隐藏。',
    flow: ['理解滤镜图（Filtergraph）的基本概念。', '使用 overlay 实现画中画效果。', '掌握添加 Logo 水印和动态水印的方法。'],
    notes: ['overlay 的坐标 (0,0) 是左上角。', '使用 shortest=1 可以让输出在较短的输入结束时停止。', '添加透明 PNG 水印时需要确保编译时启用了 libpng 支持。'],
    problem: '解决"如何在视频上添加水印、实现画中画效果，以及制作多画面拼接视频"的问题。',
  },
  {
    id: 'F_11', title: '音频处理基础', navTitle: '音频处理',
    category: 'ffmpeg',
    path: '/ffmpeg/f-11/audio', summary: '掌握音频采样率、声道数、编码格式、码率等核心参数的调整方法。',
    demo: F11Audio, code: () => Promise.resolve(`# 修改采样率为 44100 Hz
ffmpeg -i input.mp4 -ar 44100 -c:v copy output.mp4

# 转为单声道
ffmpeg -i input.mp4 -ac 1 -c:v copy output.mp4

# 设置音频码率 128 Kbps
ffmpeg -i input.mp4 -b:a 128k -c:v copy output.mp4

# 转换为 AAC 编码
ffmpeg -i input.mp4 -c:a aac -b:a 128k -c:v copy output.mp4

# 提取音频为 MP3
ffmpeg -i input.mp4 -c:a libmp3lame -b:a 192k -vn output.mp3

# 提取音频保留原编码
ffmpeg -i input.mp4 -c:a copy -vn output.aac

# 转 Opus 编码（低码率优选）
ffmpeg -i input.mp4 -c:a libopus -b:a 96k -c:v copy output.mkv`), language: 'bash',
    principle: '音频处理的核心参数包括：采样率（Sample Rate，常用 44100Hz 或 48000Hz）、声道数（单声道/立体声/5.1 环绕声）、编码格式（AAC、MP3、Opus 等）、码率（决定音质和文件大小）。FFmpeg 使用 -ar 设置采样率，-ac 设置声道数，-b:a 设置音频码率。',
    flow: ['理解音频采样率、声道数、位深度的基本概念。', '掌握使用 -ar、-ac、-b:a 调整音频参数。', '学习不同音频编码格式的适用场景。'],
    notes: ['AAC 是目前最广泛支持的音频编码格式，推荐用于大多数场景。', 'Opus 编码在低码率下音质优于 AAC，适合 WebRTC 和语音通话。', '将多声道音频降级为立体声时使用 -ac 2，注意可能需要使用 pan 或 aresample 滤镜获得更好的混音效果。'],
    problem: '解决"如何统一音频参数以满足播放设备要求，以及在有限带宽下保持可接受音质"的问题。',
  },
  {
    id: 'F_12', title: '音量调整与音频滤镜', navTitle: '音量调整',
    category: 'ffmpeg',
    path: '/ffmpeg/f-12/volume', summary: '使用 volume 滤镜调整音量，掌握标准化、动态范围压缩、静音检测等音频处理技术。',
    demo: F12Volume, code: () => Promise.resolve(`# 调整音量（减半）
ffmpeg -i input.mp4 -af "volume=0.5" -c:v copy output.mp4

# 调整音量（+3 dB）
ffmpeg -i input.mp4 -af "volume=3dB" -c:v copy output.mp4

# EBU R128 响度标准化（网络视频 -16 LUFS）
ffmpeg -i input.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:v copy output.mp4

# 广播响度标准（-24 LUFS）
ffmpeg -i input.mp4 -af "loudnorm=I=-24:TP=-2:LRA=7" -c:v copy output_broadcast.mp4

# 静音检测
ffmpeg -i input.mp4 -af silencedetect=noise=-30dB:d=0.5 -f null -

# 检测音频峰值（防止削波）
ffprobe -f lavfi -i "amovie=input.mp4,volumedetect" -f null -`), language: 'bash',
    principle: 'volume 滤镜通过调整音频采样值来改变音量，可以使用分贝（dB）或倍数作为参数。loudnorm 滤镜可以实现 EBU R128 标准的响度标准化，使不同视频的音量保持一致。silencedetect 滤镜可以检测音频中的静音片段，常用于自动剪辑和章节分割。',
    flow: ['使用 volume 滤镜调整绝对音量。', '使用 loudnorm 实现响度标准化。', '使用 silencedetect 检测并处理静音片段。'],
    notes: ['volume=0.5 是将音量减半，volume=-3dB 是将音量降低 3 分贝。', '响度标准化目标值通常为 -16LUFS（网络视频）或 -24LUFS（广播）。', '过大的音量增益会导致削波失真（Clipping），应配合 limiter 滤镜使用。'],
    problem: '解决"如何统一不同视频的音量、增强过小的音频，以及自动去除静音片段"的问题。',
  },
  {
    id: 'F_13', title: '字幕处理与烧录', navTitle: '字幕处理',
    category: 'ffmpeg',
    path: '/ffmpeg/f-13/subtitle', summary: '掌握外挂字幕、内嵌字幕和烧录字幕（Hardsub）三种字幕处理方式。',
    demo: F13Subtitle, code: () => Promise.resolve(`# 查看字幕流
ffprobe -v error -select_streams s -show_streams input.mkv

# 添加外挂 SRT 字幕到 MP4（内嵌字幕流）
ffmpeg -i input.mp4 -i subtitle.srt -c copy -c:s mov_text output.mp4

# 将 SRT 字幕嵌入 MKV
ffmpeg -i input.mkv -i subtitle.srt -c copy -c:s srt output.mkv

# 烧录 SRT 字幕到画面（硬字幕）
ffmpeg -i input.mp4 -vf subtitles=subtitle.srt output.mp4

# 烧录 ASS 字幕（保留样式）
ffmpeg -i input.mp4 -vf subtitles=subtitle.ass output.mp4

# 指定字幕编码（中文 SRT 用 UTF-8）
ffmpeg -i input.mp4 -vf "subtitles=filename=subtitle.srt:charenc=UTF-8" output.mp4

# 烧录内嵌字幕流（第 0 个字幕流）
ffmpeg -i input.mkv -vf subtitles=input.mkv output.mp4`), language: 'bash',
    principle: '字幕处理有三种方式：外挂字幕（独立的 SRT/ASS 文件，播放时加载）、内嵌字幕（将字幕流封装进容器，可开关）和烧录字幕（将字幕渲染到视频画面上，无法关闭）。烧录字幕使用 subtitles 滤镜，需要编译时启用了 libass 支持。',
    flow: ['理解外挂、内嵌、烧录三种字幕方式的区别。', '使用 subtitles 滤镜烧录 ASS/SRT 字幕。', '学习将外挂字幕封装为内嵌字幕流。'],
    notes: ['烧录字幕会增加编码工作量，且字幕一旦烧录无法移除。', 'ASS 格式支持丰富的样式和定位，SRT 格式简单但样式有限。', '使用中文字幕时需注意编码问题，建议使用 UTF-8 编码的 SRT 文件。'],
    problem: '解决"如何为视频添加多语言字幕、制作硬字幕视频，以及处理字幕编码和样式"的问题。',
  },
  {
    id: 'F_14', title: '视频截图与单帧导出', navTitle: '视频截图',
    category: 'ffmpeg',
    path: '/ffmpeg/f-14/screenshot', summary: '从视频中提取指定时间点的画面，掌握精确截图、批量截图和高质量静态图像导出。',
    demo: F14Screenshot, code: () => Promise.resolve(`# 快速截取第 10 秒画面（-ss 在 -i 前，依赖关键帧）
ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 output.jpg

# 精确截取第 10 秒画面（-ss 在 -i 后，需解码到指定位置）
ffmpeg -i input.mp4 -ss 00:00:10 -vframes 1 output.jpg

# 截取 PNG 无损画面
ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 -q:v 2 output.png

# 截取 WebP 格式（兼顾质量和大小）
ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 output.webp

# 每隔 10 秒截一张图
ffmpeg -i input.mp4 -vf fps=1/10 thumbnail_%04d.jpg

# 高质量 JPEG 批量截图
ffmpeg -i input.mp4 -vf fps=1/10 -q:v 2 thumbnail_%04d.jpg`), language: 'bash',
    principle: '使用 -ss 参数指定截图时间位置，配合 -vframes 1 只输出一帧画面。-ss 放在 -i 之前是输入选项（定位速度快但可能不精确），放在 -i 之后是输出选项（精确定位但需解码到指定位置）。输出图像格式由文件扩展名决定（.jpg、.png、.webp 等）。',
    flow: ['使用 -ss 和 -vframes 1 截取指定时间点的画面。', '理解输入选项和输出选项的 -ss 在精度上的差异。', '掌握批量截图（使用 select 滤镜或 fps 滤镜）。'],
    notes: ['PNG 格式无损但文件大，JPEG 有损压缩但文件小，WebP 在质量和大小间取得良好平衡。', '使用 -q:v 2 可以设置 JPEG 输出质量（1-31，值越小质量越高）。', '批量截图时建议使用 printf 风格的输出文件名（如 thumbnail_%04d.jpg）。'],
    problem: '解决"如何从视频中提取封面图、生成视频预览图，以及批量截取关键帧"的问题。',
  },
  {
    id: 'F_15', title: '缩略图与预览图生成', navTitle: '缩略图',
    category: 'ffmpeg',
    path: '/ffmpeg/f-15/thumbnail', summary: '生成视频缩略图网格（Contact Sheet）和 HLS 风格预览图，提升视频管理和用户体验。',
    demo: F15Thumbnail, code: () => Promise.resolve(`# 每隔 60 秒截一张缩略图
ffmpeg -i input.mp4 -vf fps=1/60 thumbnail_%04d.jpg

# 缩小尺寸的批量缩略图
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1" thumbnail_%04d.jpg

# 生成 5x4 缩略图网格（20 张，一图预览）
ffmpeg -i input.mp4 -vf "fps=1/60,scale=320:-1,tile=5x4" -vframes 1 thumbnail_sheet.jpg

# 缩略图网格 + 时间戳标注
ffmpeg -i input.mp4 -vf "fps=1/60,scale=320:-1,drawtext=text='%{pts\\:hms}':x=10:y=H-30:fontsize=16:fontcolor=white,tile=5x4" -vframes 1 sheet.jpg

# 高质量 JPEG 输出
ffmpeg -i input.mp4 -vf fps=1/10 -q:v 2 thumbnail_%04d.jpg`), language: 'bash',
    principle: '缩略图网格（Contact Sheet）是将多个时间点的截图排列在一张图片上，方便快速浏览视频内容。可以使用 select 滤镜定期提取帧，然后使用 tile 滤镜将多帧排列为网格。HLS 协议的预览图（VTT + 缩略图雪碧图）则需要将缩略图合并为一张大图并生成 WebVTT 索引文件。',
    flow: ['使用 select 和 tile 滤镜生成缩略图网格。', '掌握缩略图排列布局和标注时间戳。', '了解 HLS 预览图（雪碧图）的生成方法。'],
    notes: ['tile=5x4 表示生成 5 列 4 行的缩略图网格，共 20 张。', '使用 drawtext 滤镜可以在每个缩略图下方添加时间戳。', '缩略图网格适合快速预览，但不适合精确定位（不如逐帧浏览）。'],
    problem: '解决"如何为长视频生成预览图、制作视频目录页，以及实现类似 YouTube 的悬停预览"的问题。',
  },
  {
    id: 'F_16', title: '视频合并与拼接', navTitle: '视频拼接',
    category: 'ffmpeg',
    path: '/ffmpeg/f-16/concat', summary: '掌握三种视频拼接方法：concat 协议（无损）、concat 滤镜（需重编码）和 concat 分离器（需编码格式一致）。',
    demo: F16Concat, code: () => Promise.resolve(`# concat 协议拼接（要求编码参数完全一致）
ffmpeg -i "concat:input1.ts|input2.ts" -c copy output.ts

# concat 分离器拼接（推荐，先创建 list.txt）
# list.txt 内容：
#   file 'input1.mp4'
#   file 'input2.mp4'
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4

# concat 滤镜拼接（不同编码参数，需重编码）
ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" output.mp4

# 拼接 3 个视频（n=3）
ffmpeg -i input1.mp4 -i input2.mp4 -i input3.mp4 -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" output.mp4

# 只拼接视频流（无音频）
ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" -map "[v]" output.mp4`), language: 'bash',
    principle: '视频拼接有三种方法：1) concat 协议（file1.ts|file2.ts，要求编码参数完全一致，无损但局限性大）；2) concat 分离器（-f concat -i list.txt，要求编码参数一致但可以不同的文件容器）；3) concat 滤镜（filter_complex concat，可以拼接不同编码的视频但需重新编码）。选择哪种方法取决于源视频的编码参数是否一致以及是否允许重新编码。',
    flow: ['对比三种拼接方法的适用场景。', '使用 concat 分离器拼接编码参数一致的视频。', '使用 concat 滤镜拼接不同编码参数的视频。'],
    notes: ['使用 concat 协议或分离器时，所有输入文件必须有相同的编码参数（分辨率、帧率、编码格式等）。', '拼接不同帧率的视频时需要先使用 fps 滤镜统一帧率。', '在拼接列表中可以使用 inpoint 和 outpoint 参数指定每个文件的入点和出点。'],
    problem: '解决"如何将多个视频片段合并为一个完整视频，以及处理不同来源视频的拼接兼容性"的问题。',
  },
  {
    id: 'F_17', title: '流媒体与 RTMP 推流', navTitle: '流媒体',
    category: 'ffmpeg',
    path: '/ffmpeg/f-17/streaming', summary: '使用 FFmpeg 进行 RTMP 推流、HLS 切片和 DASH 流式传输，掌握直播和点播的流媒体技术。',
    demo: F17Streaming, code: () => Promise.resolve(`# RTMP 推流（从文件，按原始帧率 -re）
ffmpeg -re -i input.mp4 -c copy -f flv rtmp://server/live/stream

# RTMP 推流（重新编码，超低延迟预设）
ffmpeg -re -i input.mp4 -c:v libx264 -preset ultrafast -c:a aac -f flv rtmp://server/live/stream

# HLS 切片（10 秒片段，点播）
ffmpeg -i input.mp4 -c copy -hls_time 10 -hls_list_size 0 -f hls output.m3u8

# HLS 直播流（保留最近 6 个片段）
ffmpeg -re -i input.mp4 -c copy -hls_time 6 -hls_list_size 6 -hls_flags delete_segments -f hls live.m3u8

# DASH 切片
ffmpeg -i input.mp4 -c copy -f dash output.mpd

# 推流到 YouTube Live
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -b:v 3000k -c:a aac -b:a 128k -f flv rtmp://a.rtmp.youtube.com/live2/STREAM_KEY`), language: 'bash',
    principle: 'FFmpeg 可以作为流媒体生产工具，将本地视频或实时采集的画面推送到 RTMP 服务器（如 Nginx-RTMP、SRS）。HLS（HTTP Live Streaming）通过将视频切片为小 TS 片段并生成 M3U8 播放列表，实现自适应码率流式传输。DASH 是类似的开放标准，使用 MP4 片段和 MPD 描述文件。',
    flow: ['配置 RTMP 推流（输出格式为 flv，推送到 rtmp:// 地址）。', '生成 HLS 切片（使用 -hls_time 指定片段时长）。', '了解 DASH 流式传输的配置方法。'],
    notes: ['推流时使用 -re 参数可以按原始帧率读取输入，避免推送速度过快。', 'HLS 的 #EXT-X-ENDLIST 标签表示直播结束（点播），没有此标签表示直播流。', '使用多个 -b:v 参数可以生成多码率 HLS 流，播放器根据网络状况自动切换。'],
    problem: '解决"如何实现直播推流、搭建点播流媒体服务，以及生成自适应码率播放列表"的问题。',
  },
  {
    id: 'F_18', title: '硬件加速编码与解码', navTitle: '硬件加速',
    category: 'ffmpeg',
    path: '/ffmpeg/f-18/hardware-accel', summary: '掌握使用 GPU 进行视频编码和解码的硬件加速技术，包括 NVIDIA NVENC、Intel QSV、AMD VCE 和 Apple VideoToolbox。',
    demo: F18HardwareAccel, code: () => Promise.resolve(`# 查看可用的硬件加速器
ffmpeg -hwaccels

# 查看硬件编码器
ffmpeg -encoders | grep -E "nvenc|qsv|amf|videotoolbox"

# NVIDIA NVENC H.264 编码
ffmpeg -i input.mp4 -c:v h264_nvenc -preset p4 output.mp4

# NVIDIA NVENC HEVC 编码（更小文件）
ffmpeg -i input.mp4 -c:v hevc_nvenc -preset p4 output.mp4

# Intel QSV 编码
ffmpeg -i input.mp4 -c:v h264_qsv -preset veryslow output.mp4

# macOS VideoToolbox 编码
ffmpeg -i input.mp4 -c:v h264_videotoolbox -b:v 3M output.mp4

# 完整硬件加速（硬解 + 硬编）
ffmpeg -hwaccel qsv -c:v h264_qsv -i input.mp4 -c:v h264_qsv output.mp4`), language: 'bash',
    principle: '硬件加速通过 GPU 专用的编码/解码电路来处理视频，速度远超 CPU 软编码，但画质通常略逊于同等码率下的 CPU 编码。NVIDIA GPU 使用 h264_nvenc/hevc_nvenc 编码器，Intel 集成显卡使用 h264_qsv/hevc_qsv，Apple 设备使用 h264_videotoolbox/hevc_videotoolbox，AMD GPU 使用 h264_amf/hevc_amf。',
    flow: ['检测系统可用的硬件加速编码器（ffmpeg -encoders | findstr nvenc）。', '使用硬件编码器加速编码过程。', '掌握硬件解码器（cuda、qsv、videotoolbox）的使用。'],
    notes: ['使用硬件编码器时需要指定 -gpu 参数选择 GPU 设备（多 GPU 系统）。', '硬件编码器的 CRF 参数名称可能不同（如 NVENC 使用 -cq 而不是 -crf）。', '不是所有 FFmpeg 编译版本都启用了硬件加速支持，可以通过 ffmpeg -hwaccels 查看。'],
    problem: '解决"如何大幅提升视频编码速度、降低 CPU 占用，以及在实时转码场景中保持低延迟"的问题。',
  },
  {
    id: 'F_19', title: '文字叠加与动态字幕（Drawtext）', navTitle: '文字叠加',
    category: 'ffmpeg',
    path: '/ffmpeg/f-19/drawtext', summary: '使用 drawtext 滤镜在视频上添加动态文字，实现标题、台标、跑马灯、时间码显示等效果。',
    demo: F19Drawtext, code: () => Promise.resolve(`# 添加静态文字
ffmpeg -i input.mp4 -vf "drawtext=text='Hello World':x=10:y=10:fontsize=24:fontcolor=white" output.mp4

# 指定中文字体（Windows）
ffmpeg -i input.mp4 -vf "drawtext=fontfile=/Windows/Fonts/msyh.ttc:text='你好':x=10:y=10:fontsize=24:fontcolor=white" output.mp4

# 右下角水印 + 边框
ffmpeg -i input.mp4 -vf "drawtext=text='Watermark':x=w-tw-10:y=h-th-10:fontsize=20:fontcolor=white:bordercolor=black:borderw=2" output.mp4

# 显示时间码（HH:MM:SS）
ffmpeg -i input.mp4 -vf "drawtext=text='%{pts\\:hms}':x=10:y=10:fontsize=20:fontcolor=white" output.mp4

# 跑马灯（从右向左滚动）
ffmpeg -i input.mp4 -vf "drawtext=text='Breaking News':x=w-t*20:y=H/2:fontsize=32:fontcolor=white" output.mp4

# 文字淡入（前 3 秒）
ffmpeg -i input.mp4 -vf "drawtext=text='Title':x=10:y=10:fontsize=32:fontcolor=white:alpha='if(lt(t,3),t/3,1)'" output.mp4`), language: 'bash',
    principle: 'drawtext 滤镜可以在视频画面的指定位置渲染文字，支持自定义字体、大小、颜色、边框、阴影等样式。通过使用表达式和 ffmpeg 内置的时间变量（如 t 表示当前时间秒数），可以实现动态更新的文字效果，如实时时间码、滚动新闻条等。',
    flow: ['使用 drawtext 添加静态标题文字。', '掌握字体、大小、颜色、位置等样式参数。', '使用表达式实现动态文字（时间码、跑马灯）。'],
    notes: ['使用 drawtext 需要 FFmpeg 编译时启用了 libfreetype 支持。', 'fontfile 参数指定字体文件路径，Windows 可以使用 C:/Windows/Fonts/ 下的字体。', '使用 x 和 y 参数的表达式可以实现文字动画（如从右向左滚动的跑马灯效果）。'],
    problem: '解决"如何在视频上添加标题、台标、时间码显示，以及实现滚动文字和动态信息叠加"的问题。',
  },
  {
    id: 'F_20', title: '淡入淡出与转场效果', navTitle: '淡入淡出',
    category: 'ffmpeg',
    path: '/ffmpeg/f-20/fade', summary: '使用 fade 滤镜实现视频和音频的淡入淡出效果，掌握基础转场和多轨道淡入淡出协调。',
    demo: F20Fade, code: () => Promise.resolve(`# 视频淡入（前 2 秒）
ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=2" -c:a copy output.mp4

# 视频淡出（最后 2 秒，假设总时长 60 秒）
ffmpeg -i input.mp4 -vf "fade=t=out:st=58:d=2" -c:a copy output.mp4

# 视频淡入 + 淡出
ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=2,fade=t=out:st=58:d=2" -c:a copy output.mp4

# 音频淡入（前 3 秒）
ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=3" -c:v copy output.mp4

# 音频淡入 + 淡出
ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=3,afade=t=out:st=57:d=3" -c:v copy output.mp4

# xfade 转场（两视频之间淡入淡出）
ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]xfade=transition=fade:duration=1:offset=5[v]" -map "[v]" output.mp4`), language: 'bash',
    principle: 'fade 滤镜可以对视频画面应用淡入（从黑场渐显）和淡出（渐隐到黑场）效果，也可以对音频应用淡入淡出。视频淡入淡出是通过在时间轴上调整画面亮度实现的，音频淡入淡出是通过调整音量包络实现的。对于更复杂的转场效果，可以使用 xfade 和 acrossfade 滤镜（需要较新版本的 FFmpeg）。',
    flow: ['使用 fade=t=in:st=0:d=2 实现前 2 秒淡入。', '使用 fade=t=out:st=58:d=2 实现结束前 2 秒淡出。', '同时处理视频和音频的淡入淡出效果。'],
    notes: ['fade 滤镜的 st 参数是起始时间（秒），d 参数是持续时间（秒）。', 'xfade 滤镜支持多种转场效果（fade、wipeleft、circleopen 等），但需要输入视频有相同的编码参数。', '音频淡入淡出使用 aevalsrc 或 volume 滤镜配合 enable 选项实现更精细的控制。'],
    problem: '解决"如何让视频开头和结尾过渡更自然、制作简单的视频转场效果，以及避免音频突然切断"的问题。',
  },
  {
    id: 'F_21', title: '色彩空间与 HDR 处理', navTitle: '色彩空间',
    category: 'ffmpeg',
    path: '/ffmpeg/f-21/color-space', summary: '理解色彩空间（BT.601、BT.709、BT.2020）和色深（8-bit、10-bit）的概念，掌握 SDR 与 HDR 内容的处理和转换。',
    demo: F21ColorSpace, code: () => Promise.resolve(`# 查看视频色彩空间信息
ffprobe -v error -select_streams v:0 -show_entries stream=color_space,color_transfer,color_primaries -of default=noprint_wrappers=1 input.mp4

# 编码 10-bit HDR10 视频
ffmpeg -i input.mp4 -c:v libx265 -crf 22 -pix_fmt yuv420p10le -color_primaries bt2020 -color_trc smpte2084 -colorspace 9 output_hdr.mp4

# 标记 BT.709 颜色元数据
ffmpeg -i input.mp4 -color_primaries bt709 -color_trc bt709 -colorspace 1 -c:v libx264 output.mp4

# BT.709 → BT.2020 色彩空间转换
ffmpeg -i input_709.mp4 -vf "colorspace=all=bt2020:range=tv:ispace=bt709:irange=tv" -c:v libx265 -pix_fmt yuv420p10le output_2020.mp4

# HDR → SDR 转换（色调映射）
ffmpeg -i input_hdr.mp4 -vf "zscale=t=linear:npl=203,zscale=p=bt709:tonemap=clip,zscale=m=bt709:r=tv,format=yuv420p" -c:v libx264 -crf 23 output_sdr.mp4`), language: 'bash',
    principle: '色彩空间定义了视频中颜色的表示方式。BT.601 用于标清（SD），BT.709 用于高清（HD），BT.2020 用于超高清（UHD）和 HDR。色深决定每个颜色通道的精度，10-bit 比 8-bit 能表现更细腻的色彩渐变，减少色带（Banding）。HDR 内容还需要处理传输函数（PQ/HLG）和亮度元数据（MaxCLL、MaxFALL）。',
    flow: ['理解 BT.601/BT.709/BT.2020 色彩空间的区别。', '掌握 8-bit 和 10-bit 色深的编码参数。', '学习 SDR 与 HDR 内容之间的转换注意事项。'],
    notes: ['将 HDR 内容转为 SDR 时需要进行色调映射（Tone Mapping），直接使用 zscale 或 colorspace 滤镜可能导致色偏。', '使用 -pix_fmt yuv420p10le 可以编码 10-bit 视频（需要编码器支持）。', 'HDR10 使用静态元数据，HDR10+ 和 Dolby Vision 使用动态元数据（需要额外处理）。'],
    problem: '解决"如何处理不同色彩空间的视频、编码 10-bit HDR 内容，以及避免色彩失真和色带"的问题。',
  },
  {
    id: 'F_22', title: '批量处理与 Shell 脚本', navTitle: '批量处理',
    category: 'ffmpeg',
    path: '/ffmpeg/f-22/batch', summary: '编写 Shell/PowerShell 脚本批量处理视频文件，掌握遍历、并行处理、错误处理和进度监控。',
    demo: F22Batch, code: () => Promise.resolve(`# 批量转换当前目录所有 MP4 为 MKV
for f in *.mp4; do ffmpeg -i "$f" -c copy "\${f%.mp4}.mkv"; done

# 批量转码为 H.264 + AAC
for f in *.mp4; do ffmpeg -nostdin -i "$f" -c:v libx264 -crf 23 -c:a aac "\${f%.mp4}_converted.mp4"; done

# 批量压缩到 720p
for f in *.mp4; do ffmpeg -i "$f" -vf scale=-2:720 -c:v libx264 -crf 28 -c:a copy "\${f%.mp4}_720p.mp4"; done

# PowerShell 批量提取音频
Get-ChildItem *.mp4 | ForEach-Object { ffmpeg -i $_.Name -c:a copy -vn ($_.BaseName + ".aac") }

# GNU parallel 并行处理（4 个并行）
parallel -j 4 ffmpeg -i {} -c:v libx264 -crf 23 -c:a aac {.}_converted.mp4 ::: *.mp4

# 后台并行处理
for f in *.mp4; do (ffmpeg -i "$f" -c:v libx264 -crf 23 "\${f%.mp4}_converted.mp4" &) ; done; wait`), language: 'bash',
    principle: '批量视频处理通常涉及遍历文件、构造 FFmpeg 命令、处理输出路径和错误捕获。Bash 脚本可以使用 for 循环和 glob 模式遍历文件，PowerShell 可以使用 Get-ChildItem 和 ForEach-Object。并行处理可以通过 GNU parallel、xargs -P 或直接在脚本中后台运行多个 FFmpeg 进程实现。',
    flow: ['编写遍历视频文件的 Shell/PowerShell 脚本。', '掌握输出文件路径的自动生成和目录结构保持。', '学习并行处理和进度监控方法。'],
    notes: ['批量处理时注意磁盘 I/O 瓶颈，并行数不宜过高。', '使用 -nostdin 参数可以防止 FFmpeg 从标准输入读取导致脚本卡住。', '建议先对小批量文件测试命令正确性，再执行全量处理。'],
    problem: '解决"如何处理大量视频文件、统一应用相同的转码参数，以及在多核系统上加速批量处理"的问题。',
  },
  {
    id: 'F_23', title: 'GIF 动图生成与优化', navTitle: 'GIF 生成',
    category: 'ffmpeg',
    path: '/ffmpeg/f-23/gif', summary: '从视频生成高质量 GIF 动图，掌握调色板生成、尺寸优化和播放控制。',
    demo: F23Gif, code: () => Promise.resolve(`# 简单视频转 GIF（色彩效果差）
ffmpeg -i input.mp4 output.gif

# 指定尺寸和帧率
ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" output.gif

# 第一步：生成调色板（关键，避免色偏）
ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos,palettegen" palette.png

# 第二步：使用调色板生成高质量 GIF
ffmpeg -i input.mp4 -i palette.png -lavfi "[0:v]fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" output.gif

# 从指定时间开始，持续 5 秒
ffmpeg -ss 00:00:10 -t 5 -i input.mp4 -vf "fps=10,scale=320:-1" output.gif

# 循环播放 GIF（0 = 无限循环）
ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" -loop 0 output.gif`), language: 'bash',
    principle: 'GIF 格式只支持 256 色，直接从视频生成 GIF 会导致严重色偏。正确方法是先生成调色板（palettegen 滤镜），然后使用调色板进行二次编码（paletteuse 滤镜）。通过指定较小的尺寸和减少颜色数可以大幅减小 GIF 文件大小。',
    flow: ['使用 palettegen 滤镜生成最优调色板。', '使用 paletteuse 滤镜配合调色板生成高质量 GIF。', '掌握尺寸、帧率、颜色数对 GIF 文件大小的影响。'],
    notes: ['GIF 的帧率通常设为 10-15 FPS 即可，过高的帧率会大幅增加文件大小。', '使用 -loop 0 可以让 GIF 循环播放，去掉此参数则播放一次后停止。', '考虑使用 WebP 动画或 MP4 短视频替代 GIF，在同等质量下文件更小。'],
    problem: '解决"如何从视频片段生成高质量 GIF 动图、控制 GIF 文件大小，以及优化色彩表现"的问题。',
  },
  {
    id: 'F_24', title: '元数据编辑与章节标记', navTitle: '元数据',
    category: 'ffmpeg',
    path: '/ffmpeg/f-24/metadata', summary: '查看和编辑媒体文件的元数据（标题、作者、版权等），以及添加章节标记实现快速导航。',
    demo: F24Metadata, code: () => Promise.resolve(`# 查看所有元数据
ffprobe -v error -show_format -show_streams -show_chapters input.mkv

# 查看元数据标签
ffprobe -v error -show_entries format_tags input.mp4

# 添加标题元数据
ffmpeg -i input.mp4 -metadata title="My Video" -c copy output.mp4

# 添加多个元数据
ffmpeg -i input.mp4 -metadata title="My Video" -metadata artist="Director" -metadata year="2024" -c copy output.mp4

# 去除所有元数据（匿名化）
ffmpeg -i input.mp4 -map_metadata -1 -c copy output.mp4

# 修改音频流语言标签
ffmpeg -i input.mp4 -metadata:s:a:0 language=chi -c copy output.mp4

# 从其他文件导入章节
ffmpeg -i input.mp4 -i chapters.txt -map_chapters 1 -c copy output.mkv`), language: 'bash',
    principle: '媒体文件的元数据存储在容器层的元数据包中，可以使用 -metadata 参数在转码时添加或修改。MP4 容器使用 moov atom 存储元数据，MKV 使用 Tags 元素。章节标记（Chapters）可以嵌入到 MKV 和 MP4 文件中，播放器可以显示章节列表并支持跳转。',
    flow: ['使用 -metadata 参数添加标题、作者等元数据。', '使用 -map_metadata 控制元数据的复制行为。', '学习为 MKV/MP4 文件添加章节标记。'],
    notes: ['使用 -map_metadata -1 可以去除所有元数据（用于匿名化）。', 'MKV 的章节标记可以使用 mkvmerge --chapters 或 FFmpeg 的 -metadata:chapter 添加。', '某些播放器可能不显示嵌入的章节信息，需要测试目标播放器的兼容性。'],
    problem: '解决"如何为视频添加标题和版权信息、去除敏感元数据，以及为教学视频添加章节导航"的问题。',
  },
]

export default lessons
