const t=`# 视频淡入（前 2 秒）
ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=2" -c:a copy output.mp4

# 视频淡出（最后 2 秒，假设总时长 60 秒）
ffmpeg -i input.mp4 -vf "fade=t=out:st=58:d=2" -c:a copy output.mp4

# 视频淡入 + 淡出
ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=2,fade=t=out:st=58:d=2" -c:a copy output.mp4

# 音频淡入（前 3 秒）
ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=3" -c:v copy output.mp4

# 音频淡入 + 淡出
ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=3,afade=t=out:st=57:d=3" -c:v copy output.mp4

# xfade 转场（两视频之间淡入淡出）
ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]xfade=transition=fade:duration=1:offset=5[v]" -map "[v]" output.mp4`;export{t as default};
