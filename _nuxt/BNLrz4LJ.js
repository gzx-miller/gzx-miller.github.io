const p=`# 16:9 → 4:3 添加左右黑边（pillarbox）
ffmpeg -i input_16x9.mp4 -vf "pad=1920:1440:(ow-iw)/2:(oh-ih)/2" output.mp4

# 竖屏视频适配横屏（加黑边）
ffmpeg -i input_vertical.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black" output.mp4

# 添加白边
ffmpeg -i input.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:white" output.mp4

# 确保输出尺寸为偶数
ffmpeg -i input.mp4 -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" output.mp4

# 竖屏 9:16 → 横屏 16:9（缩放后填充居中）
ffmpeg -i input.mp4 -vf "scale=1920:-2,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" output.mp4`;export{p as default};
