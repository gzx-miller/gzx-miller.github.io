const p=`# 修改采样率为 44100 Hz
ffmpeg -i input.mp4 -ar 44100 -c:v copy output.mp4

# 转为单声道
ffmpeg -i input.mp4 -ac 1 -c:v copy output.mp4

# 设置音频码率 128 Kbps
ffmpeg -i input.mp4 -b:a 128k -c:v copy output.mp4

# 转换为 AAC 编码
ffmpeg -i input.mp4 -c:a aac -b:a 128k -c:v copy output.mp4

# 提取音频为 MP3
ffmpeg -i input.mp4 -c:a libmp3lame -b:a 192k -vn output.mp3

# 提取音频保留原编码
ffmpeg -i input.mp4 -c:a copy -vn output.aac

# 转 Opus 编码（低码率优选）
ffmpeg -i input.mp4 -c:a libopus -b:a 96k -c:v copy output.mkv`;export{p as default};
