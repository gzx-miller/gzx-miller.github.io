const f=`# 批量转换当前目录所有 MP4 为 MKV
for f in *.mp4; do ffmpeg -i "$f" -c copy "\${f%.mp4}.mkv"; done

# 批量转码为 H.264 + AAC
for f in *.mp4; do ffmpeg -nostdin -i "$f" -c:v libx264 -crf 23 -c:a aac "\${f%.mp4}_converted.mp4"; done

# 批量压缩到 720p
for f in *.mp4; do ffmpeg -i "$f" -vf scale=-2:720 -c:v libx264 -crf 28 -c:a copy "\${f%.mp4}_720p.mp4"; done

# PowerShell 批量提取音频
Get-ChildItem *.mp4 | ForEach-Object { ffmpeg -i $_.Name -c:a copy -vn ($_.BaseName + ".aac") }

# GNU parallel 并行处理（4 个并行）
parallel -j 4 ffmpeg -i {} -c:v libx264 -crf 23 -c:a aac {.}_converted.mp4 ::: *.mp4

# 后台并行处理
for f in *.mp4; do (ffmpeg -i "$f" -c:v libx264 -crf 23 "\${f%.mp4}_converted.mp4" &) ; done; wait`;export{f as default};
