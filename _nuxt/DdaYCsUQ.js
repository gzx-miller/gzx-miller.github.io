const r=`# 查看完整媒体信息
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
ffprobe -v error -show_entries stream=index,codec_type,codec_name -of csv=p=0 input.mp4`;export{r as default};
