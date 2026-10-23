const p=`# 裁剪指定区域 crop=w:h:x:y
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
ffmpeg -i input.mp4 -vf "crop=1920:800:0:140,scale=1280:720" output.mp4`;export{p as default};
