const p=`# 基础画中画（右上角）
ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=W-w-20:H-h-20" output.mp4

# 带透明度的画中画（0.5 = 50% 透明）
ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180,format=rgba,colorchannelmixer=aa=0.5[pipsmall];[0:v][pipsmall]overlay" output.mp4

# 画中画指定时间段显示
ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pipsmall];[0:v][pipsmall]overlay=W-w-20:H-h-20:enable='between(t,10,20)'" output.mp4

# 添加图片水印（右上角）
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=W-w-20:20" output.mp4

# 滚动水印（从右向左）
ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=x=W-t*50:y=H-h-20" output.mp4`;export{p as default};
