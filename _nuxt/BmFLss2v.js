const e=`# RTMP 推流（从文件，按原始帧率 -re）
ffmpeg -re -i input.mp4 -c copy -f flv rtmp://server/live/stream

# RTMP 推流（重新编码，超低延迟预设）
ffmpeg -re -i input.mp4 -c:v libx264 -preset ultrafast -c:a aac -f flv rtmp://server/live/stream

# HLS 切片（10 秒片段，点播）
ffmpeg -i input.mp4 -c copy -hls_time 10 -hls_list_size 0 -f hls output.m3u8

# HLS 直播流（保留最近 6 个片段）
ffmpeg -re -i input.mp4 -c copy -hls_time 6 -hls_list_size 6 -hls_flags delete_segments -f hls live.m3u8

# DASH 切片
ffmpeg -i input.mp4 -c copy -f dash output.mpd

# 推流到 YouTube Live
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -b:v 3000k -c:a aac -b:a 128k -f flv rtmp://a.rtmp.youtube.com/live2/STREAM_KEY`;export{e as default};
