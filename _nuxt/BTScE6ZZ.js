import{d as x,r as d,b as a,e,M as r,f as o,F as m,E as v,A as g,o as s,I as M}from"./DutfXOOr.js";const I={class:"demo-card"},P={class:"tabs"},A={key:0,class:"tab-content"},$={class:"main-content"},L={class:"image-panel"},R={class:"image-display"},T={class:"image-icon"},U={key:0},z={key:1},O={key:2},B={class:"image-name"},E={class:"image-list"},F=["onClick"],H={class:"thumb-icon"},V={key:0},q={key:1},G={key:2},N={class:"thumb-name"},S={class:"control-panel"},j={class:"mode-selector"},D={class:"mode-buttons"},Q=["onClick"],J=["disabled"],K={key:0,class:"results-section"},W={class:"result-header"},X={class:"result-label"},Y={class:"result-confidence"},Z={class:"result-content",style:{"white-space":"pre-wrap"}},ee={key:1,class:"tab-content"},te={key:2,class:"tab-content"},ne={class:"knowledge-grid"},ae={style:{"white-space":"pre-wrap"}},se=`// LangChain.js 多模态模型调用
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

const model = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0.2
})

// 1. 基础图像理解
const response = await model.invoke([
  new HumanMessage({
    content: [
      { type: 'text', text: '请描述这张图片' },
      {
        type: 'image_url',
        image_url: { url: 'data:image/png;base64,...' }
      }
    ]
  })
])

// 2. 多图对比分析
const multiImageResponse = await model.invoke([
  new HumanMessage({
    content: [
      { type: 'text', text: '比较这两张图片的异同' },
      { type: 'image_url', image_url: { url: image1Url } },
      { type: 'image_url', image_url: { url: image2Url } }
    ]
  })
])

// 3. 使用提示模板
import { ChatPromptTemplate } from '@langchain/core/prompts'

const visionPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一位专业的图像分析专家。'],
  ['human', [
    { type: 'text', text: '{question}' },
    { type: 'image_url', image_url: { url: '{imageUrl}' } }
  ]]
])

const chain = visionPrompt.pipe(model)
const result = await chain.invoke({
  question: '分析这张图片的构图和色彩',
  imageUrl: imageUrl
})`,oe=x({__name:"L20MultiModal",setup(le){const y=d([{id:1,name:"秋日林间小径",description:"铺满落叶的森林小路，阳光透过树叶洒下金色光斑",tags:["森林","小径","秋季","阳光"],scene:"forest"},{id:2,name:"枫叶特写",description:"红色枫叶的微距拍摄，展现叶片纹理和秋季色彩",tags:["枫叶","特写","红色","纹理"],scene:"leaf"},{id:3,name:"山间湖泊秋色",description:"群山环抱的湖泊，岸边树木倒映在平静的湖面上",tags:["湖泊","山峦","倒影","秋景"],scene:"lake"}]),c=d(y.value[0]),f=d("caption"),u=d(!1),p=d([]),l=d("demo"),b={forest_caption:[{type:"caption",label:"图像描述",content:"这是一幅秋日森林的景象，一条蜿蜒的小径穿过树林，地上铺满了金黄和橙红色的落叶。阳光从高大树木的枝叶间穿透下来，在地面上形成斑驳的光影。整个画面充满了温暖的秋日氛围。",confidence:.95}],forest_tags:[{type:"tag",label:"场景识别",content:"森林、小径、秋季、落叶、阳光、树木、自然景观",confidence:.92},{type:"tag",label:"主色调",content:"金黄色、橙红色、棕色、深绿色",confidence:.88}],forest_detail:[{type:"detail",label:"场景元素",content:`• 前景：铺满落叶的小径，落叶颜色从金黄到橙红渐变
• 中景：两侧高大的落叶乔木，树枝交错
• 背景：森林深处，光线逐渐变暗
• 光影：丁达尔效应，阳光穿透树叶形成光束`,confidence:.94},{type:"detail",label:"氛围分析",content:"宁静、温暖、诗意、自然、治愈系",confidence:.9}],forest_ocr:[{type:"ocr",label:"文字检测",content:"未检测到明显文字内容",confidence:.99}],leaf_caption:[{type:"caption",label:"图像描述",content:"这是一张枫叶的微距特写照片。叶片呈现出鲜艳的深红色，边缘带有锯齿状。叶脉清晰可见，从叶柄向四周辐射开来。叶片表面有自然的光泽，背景虚化突出了主体。",confidence:.96}],leaf_tags:[{type:"tag",label:"物体识别",content:"枫叶、叶片、植物、自然",confidence:.97},{type:"tag",label:"视觉特征",content:"红色、特写、微距、纹理、叶脉",confidence:.93}],leaf_detail:[{type:"detail",label:"叶片分析",content:`• 种类：掌状枫叶，5个裂片
• 颜色：深红色，带有少量橙色渐变
• 边缘：锯齿状叶缘
• 叶脉：网状脉序，主脉清晰
• 状态：成熟秋季叶片`,confidence:.95},{type:"detail",label:"摄影分析",content:"微距拍摄、浅景深、逆光或侧光、主体突出、背景虚化（bokeh效果）",confidence:.89}],leaf_ocr:[{type:"ocr",label:"文字检测",content:"未检测到文字内容",confidence:.98}],lake_caption:[{type:"caption",label:"图像描述",content:"一幅壮丽的山间湖泊秋景图。平静的湖水如镜面般倒映着周围的山峦和树木。岸边的树木呈现出丰富的秋季色彩，有金黄、橙红、深绿等多种颜色。远处的山峰层峦叠嶂，天空晴朗。",confidence:.94}],lake_tags:[{type:"tag",label:"场景识别",content:"湖泊、山脉、秋季、自然风光、倒影、树林",confidence:.93},{type:"tag",label:"构图特点",content:"对称构图、水平线、层次感、广角视野",confidence:.87}],lake_detail:[{type:"detail",label:"景观层次",content:`• 前景：湖边的芦苇和灌木，呈现金黄色
• 中景：平静的湖面，清晰倒映着岸边景色
• 背景：连绵的山峦，山坡上五彩斑斓的树林
• 天空：晴朗的蓝天，少量白云`,confidence:.92},{type:"detail",label:"季节特征",content:"典型的秋季景观，树叶变色丰富，湖水清澈，天气晴朗，是秋季摄影的黄金时节。",confidence:.91}],lake_ocr:[{type:"ocr",label:"文字检测",content:"未检测到文字内容",confidence:.97}]},h=[{title:"什么是多模态模型",content:"多模态模型是指能够同时处理和理解多种类型数据（如文本、图像、音频、视频等）的人工智能模型，它能将不同模态的信息进行关联和融合。"},{title:"视觉理解能力",content:`• 图像描述与字幕生成
• 物体检测与识别
• 场景理解与分类
• 光学字符识别（OCR）
• 图像问答（VQA）
• 视觉推理与分析`},{title:"典型应用场景",content:`1. 智能相册：自动标签、人脸识别、场景分类
2. 医疗影像：辅助诊断、病灶检测
3. 自动驾驶：环境感知、障碍物识别
4. 电商平台：商品搜索、以图搜图
5. 教育领域：作业批改、图表理解`},{title:"LangChain 视觉支持",content:`• 支持 GPT-4o、Claude 3 等多模态模型
• 可传入 base64 图片或图片 URL
• 支持多图输入和对比分析
• 可与 RAG、Agent 等模式结合
• 支持结构化输出解析`}],k=[{value:"caption",label:"图像描述"},{value:"tags",label:"标签识别"},{value:"detail",label:"详细分析"},{value:"ocr",label:"文字检测"}];async function w(){if(u.value)return;u.value=!0,p.value=[],await new Promise(t=>setTimeout(t,1200));const _=`${c.value.scene}_${f.value}`,n=b[_]||[];for(let t=0;t<n.length;t++)await new Promise(i=>setTimeout(i,500)),p.value.push(n[t]);u.value=!1}function C(_){c.value=_,p.value=[]}return(_,n)=>(s(),a("div",I,[n[5]||(n[5]=e("h3",null,"多模态视觉理解",-1)),n[6]||(n[6]=e("p",{class:"subtitle"},"基于秋日森林主题的图像智能分析演示",-1)),e("div",P,[e("button",{class:r({active:l.value==="demo"}),onClick:n[0]||(n[0]=t=>l.value="demo")},"交互演示",2),e("button",{class:r({active:l.value==="code"}),onClick:n[1]||(n[1]=t=>l.value="code")},"代码示例",2),e("button",{class:r({active:l.value==="knowledge"}),onClick:n[2]||(n[2]=t=>l.value="knowledge")},"知识点",2)]),l.value==="demo"?(s(),a("div",A,[e("div",$,[e("div",L,[e("div",R,[e("div",{class:r(["image-placeholder",c.value.scene])},[e("div",T,[c.value.scene==="forest"?(s(),a("span",U,"🌲🍂🌳")):c.value.scene==="leaf"?(s(),a("span",z,"🍁")):(s(),a("span",O,"🏞️"))]),e("p",B,o(c.value.name),1)],2)]),e("div",E,[(s(!0),a(m,null,v(y.value,t=>(s(),a("div",{key:t.id,class:r(["image-thumb",{active:c.value.id===t.id}]),onClick:i=>C(t)},[e("span",H,[t.scene==="forest"?(s(),a("span",V,"🌲")):t.scene==="leaf"?(s(),a("span",q,"🍁")):(s(),a("span",G,"🏞️"))]),e("span",N,o(t.name),1)],10,F))),128))])]),e("div",S,[e("div",j,[n[3]||(n[3]=e("h4",null,"分析模式",-1)),e("div",D,[(s(),a(m,null,v(k,t=>e("button",{key:t.value,class:r({active:f.value===t.value}),onClick:i=>f.value=t.value},o(t.label),11,Q)),64))])]),e("button",{class:"analyze-btn",disabled:u.value,onClick:w},o(u.value?"分析中...":"开始分析"),9,J),p.value.length>0?(s(),a("div",K,[n[4]||(n[4]=e("h4",null,"分析结果",-1)),(s(!0),a(m,null,v(p.value,(t,i)=>(s(),a("div",{key:i,class:"result-card"},[e("div",W,[e("span",X,o(t.label),1),e("span",Y,"置信度 "+o((t.confidence*100).toFixed(0))+"%",1)]),e("p",Z,o(t.content),1)]))),128))])):g("",!0)])])])):g("",!0),l.value==="code"?(s(),a("div",ee,[e("div",{class:"code-example"},[e("pre",null,o(se))])])):g("",!0),l.value==="knowledge"?(s(),a("div",te,[e("div",ne,[(s(),a(m,null,v(h,(t,i)=>e("div",{key:i,class:"knowledge-card"},[e("h5",null,o(t.title),1),e("p",ae,o(t.content),1)])),64))])])):g("",!0)]))}}),ie=M(oe,[["__scopeId","data-v-1d009342"]]);export{ie as default};
