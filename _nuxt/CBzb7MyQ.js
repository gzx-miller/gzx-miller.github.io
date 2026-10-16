const t=`# 添加静态文字
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
ffmpeg -i input.mp4 -vf "drawtext=text='Title':x=10:y=10:fontsize=32:fontcolor=white:alpha='if(lt(t,3),t/3,1)'" output.mp4`;export{t as default};
