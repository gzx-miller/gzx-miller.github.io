const t=`# 查看字幕流
ffprobe -v error -select_streams s -show_streams input.mkv

# 添加外挂 SRT 字幕到 MP4（内嵌字幕流）
ffmpeg -i input.mp4 -i subtitle.srt -c copy -c:s mov_text output.mp4

# 将 SRT 字幕嵌入 MKV
ffmpeg -i input.mkv -i subtitle.srt -c copy -c:s srt output.mkv

# 烧录 SRT 字幕到画面（硬字幕）
ffmpeg -i input.mp4 -vf subtitles=subtitle.srt output.mp4

# 烧录 ASS 字幕（保留样式）
ffmpeg -i input.mp4 -vf subtitles=subtitle.ass output.mp4

# 指定字幕编码（中文 SRT 用 UTF-8）
ffmpeg -i input.mp4 -vf "subtitles=filename=subtitle.srt:charenc=UTF-8" output.mp4

# 烧录内嵌字幕流（第 0 个字幕流）
ffmpeg -i input.mkv -vf subtitles=input.mkv output.mp4`;export{t as default};
