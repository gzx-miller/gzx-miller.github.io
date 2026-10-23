const p=`# 查看当前帧率
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
ffmpeg -i input.mp4 -vf "select=eq(pict_type\\,I)" -vsync vfr output_keyframes.mp4`;export{p as default};
