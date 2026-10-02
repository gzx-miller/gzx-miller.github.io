const p=`# 转封装：MP4 → MKV（不重新编码，速度极快）
ffmpeg -i input.mp4 -c copy output.mkv

# 转码为 H.264 + AAC（兼容性最好）
ffmpeg -i input.mkv -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4

# MOV → MP4（视频不重编码，音频转 AAC）
ffmpeg -i input.mov -c:v copy -c:a aac output.mp4

# WebM → MP4（VP8/VP9 转 H.264）
ffmpeg -i input.webm -c:v libx264 -c:a aac output.mp4

# TS 片段转单文件
ffmpeg -i input.ts -c copy output.mp4

# 批量转封装当前目录所有 MP4 为 MKV
for f in *.mp4; do ffmpeg -i "$f" -c copy "\${f%.mp4}.mkv"; done`;export{p as default};
