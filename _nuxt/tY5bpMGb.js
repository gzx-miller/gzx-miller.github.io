const t=`# concat 协议拼接（要求编码参数完全一致）
ffmpeg -i "concat:input1.ts|input2.ts" -c copy output.ts

# concat 分离器拼接（推荐，先创建 list.txt）
# list.txt 内容：
#   file 'input1.mp4'
#   file 'input2.mp4'
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4

# concat 滤镜拼接（不同编码参数，需重编码）
ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" output.mp4

# 拼接 3 个视频（n=3）
ffmpeg -i input1.mp4 -i input2.mp4 -i input3.mp4 -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" -map "[v]" -map "[a]" output.mp4

# 只拼接视频流（无音频）
ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" -map "[v]" output.mp4`;export{t as default};
