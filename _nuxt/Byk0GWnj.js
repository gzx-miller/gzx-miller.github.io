import{d as b,b as r,e,M as d,f as n,F as l,E as m,A as p,v as c,r as v,o as a,I as h}from"./DutfXOOr.js";const y={class:"demo-card"},w={style:{display:"flex",gap:"8px","margin-bottom":"16px","flex-wrap":"wrap"}},g={key:0,class:"ffprobe-section"},k={class:"cmd"},x={key:1,class:"format-section"},C={key:2,class:"streams-section"},F={style:{"margin-top":"20px"}},I=`# 查看媒体文件完整信息
ffprobe -v error -show_format -show_streams input.mp4

# 只显示容器信息
ffprobe -v error -show_format input.mp4

# 只显示第一个视频流信息
ffprobe -v error -select_streams v:0 -show_streams input.mp4

# JSON 格式输出（适合程序解析）
ffprobe -v error -show_format -show_streams -print_format json input.mp4

# 显示所有帧信息（输出量巨大，慎用）
ffprobe -v error -show_frames input.mp4

# 显示数据包信息
ffprobe -v error -show_packets input.mp4`,B=`{
  "format": {
    "filename": "input.mp4",
    "nb_streams": 2,
    "duration": "180.5",
    "size": "135000000",
    "bit_rate": "6000000",
    "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
    "tags": {
      "major_brand": "isom",
      "minor_version": "512",
      "compatible_brands": "isomiso2avc1mp41"
    }
  },
  "streams": [
    {
      "index": 0,
      "codec_name": "h264",
      "codec_type": "video",
      "width": 1920,
      "height": 1080,
      "r_frame_rate": "30/1",
      "bit_rate": "5500000",
      "pix_fmt": "yuv420p"
    },
    {
      "index": 1,
      "codec_name": "aac",
      "codec_type": "audio",
      "sample_rate": "48000",
      "channels": 2,
      "bit_rate": "128000"
    }
  ]
}`,S=b({__name:"F03VideoInfo",setup(j){const o=v("ffprobe"),i={title:"容器信息（-show_format）",fields:[{name:"format_name",desc:"容器格式（如 mov,mp4,m4a,3gp,3g2,mj2）"},{name:"duration",desc:"总时长（秒）"},{name:"size",desc:"文件大小（字节）"},{name:"bit_rate",desc:"总码率（bps）"},{name:"nb_streams",desc:"流的数量"},{name:"tags.title",desc:"标题元数据"},{name:"tags.artist",desc:"艺术家元数据"},{name:"tags.encoder",desc:"编码软件信息"}]},u={title:"视频流信息",fields:[{name:"codec_name",desc:"编码格式（h264, hevc, vp9 等）"},{name:"width / height",desc:"分辨率"},{name:"r_frame_rate",desc:"帧率（如 30/1 表示 30 FPS）"},{name:"bit_rate",desc:"视频码率（bps）"},{name:"pix_fmt",desc:"像素格式（yuv420p, yuv422p 等）"},{name:"color_space",desc:"色彩空间（bt709, bt2020nc 等）"},{name:"color_transfer",desc:"传输函数（bt709, smpte2084 等）"},{name:"has_b_frames",desc:"是否有 B 帧"},{name:"profile",desc:"编码档次（High, Main, Baseline 等）"},{name:"level",desc:"编码级别"}]},f={title:"音频流信息",fields:[{name:"codec_name",desc:"编码格式（aac, mp3, opus 等）"},{name:"sample_rate",desc:"采样率（Hz）"},{name:"channels",desc:"声道数"},{name:"channel_layout",desc:"声道布局（stereo, 5.1 等）"},{name:"bit_rate",desc:"音频码率（bps）"},{name:"sample_fmt",desc:"采样格式（fltp, s16p 等）"}]},_=[{desc:"获取视频时长（秒）",cmd:"ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4"},{desc:"获取视频分辨率",cmd:"ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 input.mp4"},{desc:"获取视频帧率",cmd:"ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4"},{desc:"获取音频采样率",cmd:"ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of default=noprint_wrappers=1:nokey=1 input.mp4"},{desc:"列出所有流",cmd:"ffprobe -v error -show_entries stream=index,codec_type,codec_name -of csv=p=0 input.mp4"}];return(N,t)=>(a(),r("div",y,[t[11]||(t[11]=e("h3",null,"🌰 媒体信息分析与 ffprobe",-1)),t[12]||(t[12]=e("p",{class:"summary"},"使用 ffprobe 和 FFmpeg 内置分析选项，获取视频/音频的详细信息。",-1)),e("div",w,[e("button",{class:d(["tab-btn",{active:o.value==="ffprobe"}]),onClick:t[0]||(t[0]=s=>o.value="ffprobe")},"ffprobe 基础",2),e("button",{class:d(["tab-btn",{active:o.value==="format"}]),onClick:t[1]||(t[1]=s=>o.value="format")},"容器信息",2),e("button",{class:d(["tab-btn",{active:o.value==="streams"}]),onClick:t[2]||(t[2]=s=>o.value="streams")},"流信息",2)]),o.value==="ffprobe"?(a(),r("div",g,[t[4]||(t[4]=e("h4",null,"ffprobe 常用命令",-1)),e("pre",null,[e("code",null,n(I))]),t[5]||(t[5]=e("h4",{style:{"margin-top":"20px"}},"实用单行命令",-1)),e("table",null,[t[3]||(t[3]=e("thead",null,[e("tr",null,[e("th",null,"用途"),e("th",null,"命令")])],-1)),e("tbody",null,[(a(),r(l,null,m(_,s=>e("tr",{key:s.desc},[e("td",null,n(s.desc),1),e("td",null,[e("code",k,n(s.cmd),1)])])),64))])])])):p("",!0),o.value==="format"?(a(),r("div",x,[e("h4",null,n(i.title),1),t[8]||(t[8]=e("p",null,[c("使用 "),e("code",null,"-show_format"),c(" 获取容器层面的信息：")],-1)),e("table",null,[t[6]||(t[6]=e("thead",null,[e("tr",null,[e("th",null,"字段"),e("th",null,"说明")])],-1)),e("tbody",null,[(a(!0),r(l,null,m(i.fields,s=>(a(),r("tr",{key:s.name},[e("td",null,[e("code",null,n(s.name),1)]),e("td",null,n(s.desc),1)]))),128))])]),e("div",{class:"json-preview",style:{"margin-top":"16px"}},[t[7]||(t[7]=e("h4",null,"JSON 输出示例（格式信息部分）",-1)),e("pre",null,[e("code",null,n(B))])])])):p("",!0),o.value==="streams"?(a(),r("div",C,[e("h4",null,n(u.title),1),e("table",null,[t[9]||(t[9]=e("thead",null,[e("tr",null,[e("th",null,"字段"),e("th",null,"说明")])],-1)),e("tbody",null,[(a(!0),r(l,null,m(u.fields,s=>(a(),r("tr",{key:s.name},[e("td",null,[e("code",null,n(s.name),1)]),e("td",null,n(s.desc),1)]))),128))])]),e("h4",F,n(f.title),1),e("table",null,[t[10]||(t[10]=e("thead",null,[e("tr",null,[e("th",null,"字段"),e("th",null,"说明")])],-1)),e("tbody",null,[(a(!0),r(l,null,m(f.fields,s=>(a(),r("tr",{key:s.name},[e("td",null,[e("code",null,n(s.name),1)]),e("td",null,n(s.desc),1)]))),128))])])])):p("",!0)]))}}),z=h(S,[["__scopeId","data-v-1eeef875"]]);export{z as default};
