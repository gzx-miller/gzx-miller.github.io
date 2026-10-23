const p=`# 查看可用的硬件加速器
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
ffmpeg -hwaccel qsv -c:v h264_qsv -i input.mp4 -c:v h264_qsv output.mp4`;export{p as default};
