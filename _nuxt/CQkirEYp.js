const p=`# 简单视频转 GIF（色彩效果差）
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
ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" -loop 0 output.gif`;export{p as default};
