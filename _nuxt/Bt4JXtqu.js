const p=`# 使用 lanczos 算法缩放（放大首选）
ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=lanczos" output.mp4

# 使用 bicubic 算法（质量与速度平衡）
ffmpeg -i input.mp4 -vf "scale=1280:720:flags=bicubic" output.mp4

# 10-bit 内容缩放（保持位深）
ffmpeg -i input.mkv -vf scale=1920:1080 -pix_fmt yuv420p10le output.mkv

# HDR 内容缩放（指定色彩空间）
ffmpeg -i input_hdr.mp4 -vf "scale=1920:1080:flags=lanczos:out_color_matrix=bt2020nc:out_range=tv" -pix_fmt yuv420p10le output_hdr.mp4

# 使用 zscale 滤镜（专业级色彩处理）
ffmpeg -i input_hdr.mp4 -vf "zscale=w=1920:h=1080:f=lanczos:m=bt2020:p=bt2020:r=tv,format=yuv420p10le" output.mp4`;export{p as default};
