const t=`# 查看所有元数据
ffprobe -v error -show_format -show_streams -show_chapters input.mkv

# 查看元数据标签
ffprobe -v error -show_entries format_tags input.mp4

# 添加标题元数据
ffmpeg -i input.mp4 -metadata title="My Video" -c copy output.mp4

# 添加多个元数据
ffmpeg -i input.mp4 -metadata title="My Video" -metadata artist="Director" -metadata year="2024" -c copy output.mp4

# 去除所有元数据（匿名化）
ffmpeg -i input.mp4 -map_metadata -1 -c copy output.mp4

# 修改音频流语言标签
ffmpeg -i input.mp4 -metadata:s:a:0 language=chi -c copy output.mp4

# 从其他文件导入章节
ffmpeg -i input.mp4 -i chapters.txt -map_chapters 1 -c copy output.mkv`;export{t as default};
