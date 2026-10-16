const p=`# 快速截取第 10 秒画面（-ss 在 -i 前，依赖关键帧）
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
ffmpeg -i input.mp4 -vf fps=1/10 -q:v 2 thumbnail_%04d.jpg`;export{p as default};
