import{d as Y,k as H,U as $,b as A,e as n,f as d,M as g,F as j,E as q,r as v,g as w,aa as K,o as E,I as J}from"./DutfXOOr.js";const Q={class:"demo-card"},Z={class:"demo-layout"},ee={class:"canvas-wrap"},te={class:"fps-badge"},re={class:"control-panel"},oe={class:"api-switch"},ae={class:"feature-list"},ne=["disabled","onClick"],ie={key:0,class:"feature-info"},se={key:1,class:"feature-info webgl1-hint"},le={class:"code-display"},ue=`#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec3 a_color;

layout(std140) uniform SharedData {
  float u_time;
  vec2 u_resolution;
  float u_intensity;
};

out vec3 v_color;
out float v_depth;

void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  v_depth = pos.y * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`,ce=`#version 300 es
precision highp float;
in vec3 v_color;
in float v_depth;

layout(std140) uniform SharedData {
  float u_time;
  vec2 u_resolution;
  float u_intensity;
};

out vec4 fragColor;

uniform sampler3D u_lut;

void main() {
  vec3 lutCoord = vec3(v_depth, 0.5, 0.5);
  vec3 lutColor = texture(u_lut, lutCoord).rgb;
  vec3 finalColor = mix(v_color, lutColor, u_intensity);
  fragColor = vec4(finalColor, 1.0);
}
`,fe=`
attribute vec2 a_position;
attribute vec3 a_color;
uniform float u_time;
uniform float u_intensity;
varying vec3 v_color;
varying float v_depth;
void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  v_depth = pos.y * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`,de=`
precision mediump float;
varying vec3 v_color;
varying float v_depth;
uniform float u_intensity;
void main() {
  vec3 finalColor = mix(v_color, vec3(v_depth, v_depth * 0.8, 1.0 - v_depth), u_intensity);
  gl_FragColor = vec4(finalColor, 1.0);
}
`,ve=Y({__name:"W17WebGL2",setup(_e){const x=v(null),_=K(null),f=v("webgl2"),b=v("ubo"),N=v(!0),h=v(0),m=[{id:"ubo",name:"UBO 统一缓冲区",desc:"Uniform Buffer Objects：多个着色器共享 uniform 数据，减少 CPU→GPU 更新开销。"},{id:"texture3d",name:"3D 纹理",desc:"3D Texture：创建 volume 纹理，可用于体积渲染、颜色查找表 (LUT) 等。"},{id:"vao",name:"原生 VAO",desc:"Vertex Array Object：WebGL2 原生支持，封装属性配置，减少 draw call 切换开销。"},{id:"integer",name:"整数纹理",desc:"Integer Texture：支持 R32I 等整数格式，可用于 G-Buffer、ID 渲染等。"},{id:"transform",name:"Transform Feedback",desc:"Transform Feedback：GPU 直接捕获顶点变换结果到缓冲区，无需 CPU 回读。"},{id:"multiTarget",name:"多目标渲染",desc:"Multi-Draw / MRT：一次 draw call 输出多个颜色附件，支持延迟渲染 (Deferred)。"}],M={};m.forEach(e=>{M[e.id]=e.name});function F(e,t,a){const o=e.createShader(t);return o?(e.shaderSource(o,a),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error(e.getShaderInfoLog(o)),e.deleteShader(o),null)):null}function W(e,t,a){const o=F(e,e.VERTEX_SHADER,t),s=F(e,e.FRAGMENT_SHADER,a);if(!o||!s)return null;const i=e.createProgram();return i?(e.attachShader(i,o),e.attachShader(i,s),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS)?i:(console.error(e.getProgramInfoLog(i)),null)):null}function k(e){const a=new Uint8Array(16384);for(let s=0;s<16;s++)for(let i=0;i<16;i++)for(let r=0;r<16;r++){const c=(s*16*16+i*16+r)*4,u=r/15;a[c]=Math.floor(180+u*60),a[c+1]=Math.floor(80+u*40),a[c+2]=Math.floor(30+(1-u)*50),a[c+3]=255}const o=e.createTexture();return e.bindTexture(e.TEXTURE_3D,o),e.texImage3D(e.TEXTURE_3D,0,e.RGBA,16,16,16,0,e.RGBA,e.UNSIGNED_BYTE,a),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_R,e.CLAMP_TO_EDGE),o}function V(e){const t=e.createBuffer();e.bindBuffer(e.UNIFORM_BUFFER,t);const a=new Float32Array([0,0,0,0,.6,0,0,0]);return e.bufferData(e.UNIFORM_BUFFER,a,e.DYNAMIC_DRAW),e.bindBuffer(e.UNIFORM_BUFFER,null),t}let U=0,R=0,T=0;function L(e){const t=_.value;if(!t)return;const a=e-U;U=e,R++,T+=a,T>=500&&(h.value=Math.round(R*1e3/T),R=0,T=0);const o=t.gl,s=t.canvas;o.viewport(0,0,s.width,s.height),o.clearColor(.09,.07,.05,1),o.clear(o.COLOR_BUFFER_BIT);const i=new Float32Array([-.5,-.5,.9,.4,.2,.5,-.5,.2,.8,.4,-.5,.5,.3,.6,.9,.5,.5,.9,.4,.2]);if(o.bindBuffer(o.ARRAY_BUFFER,t.vbo),o.bufferData(o.ARRAY_BUFFER,i,o.DYNAMIC_DRAW),o.useProgram(t.program),t.isWebGL2){const r=o;r.bindVertexArray(t.vao);const c=new Float32Array([e*.001,0,s.width,s.height,.6,0,0,0]);r.bindBuffer(r.UNIFORM_BUFFER,t.ubo),r.bufferSubData(r.UNIFORM_BUFFER,0,c),r.bindBufferBase(r.UNIFORM_BUFFER,0,t.ubo),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_3D,t.texture3D),r.uniform1i(r.getUniformLocation(t.program,"u_lut"),0),r.drawArrays(r.TRIANGLE_STRIP,0,4)}else{const r=o,c=r.getAttribLocation(t.program,"a_position"),u=r.getAttribLocation(t.program,"a_color");r.enableVertexAttribArray(c),r.vertexAttribPointer(c,2,r.FLOAT,!1,20,0),r.enableVertexAttribArray(u),r.vertexAttribPointer(u,3,r.FLOAT,!1,20,8),r.uniform1f(r.getUniformLocation(t.program,"u_time"),e*.001),r.uniform1f(r.getUniformLocation(t.program,"u_intensity"),.6),r.drawArrays(r.TRIANGLE_STRIP,0,4)}N.value&&(t.rafId=requestAnimationFrame(L))}function y(){const e=_.value;if(e){if(cancelAnimationFrame(e.rafId),e.gl.deleteProgram(e.program),e.gl.deleteBuffer(e.vbo),e.isWebGL2){const t=e.gl;e.vao&&t.deleteVertexArray(e.vao),e.ubo&&t.deleteBuffer(e.ubo),e.texture3D&&t.deleteTexture(e.texture3D)}e.gl.getExtension("WEBGL_lose_context")?.loseContext()}}function I(e){y();const t=x.value;if(!t)return;const a=e==="webgl2",o=a?t.getContext("webgl2",{antialias:!0}):t.getContext("webgl",{antialias:!0});if(!o){console.error(`Cannot get ${e} context`);return}const s=t.clientWidth||400,i=t.clientHeight||300;t.width=s,t.height=i;const u=W(o,a?ue:fe,a?ce:de);if(!u)return;const P=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,P);let p=null,S=null,C=null;if(a){const l=o;p=l.createVertexArray(),l.bindVertexArray(p);const O=0,G=1;l.enableVertexAttribArray(O),l.vertexAttribPointer(O,2,l.FLOAT,!1,20,0),l.enableVertexAttribArray(G),l.vertexAttribPointer(G,3,l.FLOAT,!1,20,8),S=V(l);const X=l.getUniformBlockIndex(u,"SharedData");l.uniformBlockBinding(u,X,0),C=k(l)}_.value={gl:o,canvas:t,isWebGL2:a,program:u,vao:p,vbo:P,ubo:S,texture3D:C,rafId:0},_.value.rafId=requestAnimationFrame(L)}H(()=>{I(f.value)}),$(()=>{y()});function D(e){f.value=e,I(e)}const B=w(()=>m.find(e=>e.id===b.value)||m[0]),z=w(()=>({ubo:`// WebGL2 UBO 声明与绑定
layout(std140) uniform SharedData {
  float u_time;
  vec2 u_resolution;
  float u_intensity;
};

// 绑定到 uniform 绑定点 0
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);
gl.uniformBlockBinding(program, blockIndex, 0);`,texture3d:`// 创建 3D 纹理 (体积纹理 / LUT)
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_3D, tex);
gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA,
  size, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

// 着色器中采样
vec3 lutColor = texture(u_lut, vec3(u, v, w)).rgb;`,vao:`// WebGL2 原生 VAO
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// 配置属性
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 20, 0);
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 20, 8);

// 一次绑定，切换时直接使用
gl.bindVertexArray(vao);`,integer:`// 整数纹理用于 ID 渲染 / G-Buffer
gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32I,
  width, height, 0, gl.RED_INTEGER, gl.INT, null);

// 着色器中读写
layout(binding = 0, r32i) uniform readonly highp isampler2D idTex;
int objectId = texture(idTex, uv).r;`,transform:`// Transform Feedback 捕获顶点输出
const tf = gl.createTransformFeedback();
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

// 将 varying 绑定到缓冲区
gl.transformFeedbackVaryings(program,
  ['v_position', 'v_velocity'], gl.INTERLEAVED_ATTRIBS);

gl.beginTransformFeedback(gl.POINTS);
gl.drawArrays(gl.POINTS, 0, count);
gl.endTransformFeedback();`,multiTarget:`// 多目标渲染 (MRT)
const attachments = [
  gl.COLOR_ATTACHMENT0, // 颜色
  gl.COLOR_ATTACHMENT1, // 法线
  gl.COLOR_ATTACHMENT2, // 深度
];
gl.drawBuffers(attachments);

// 一次 draw call 输出多个 G-Buffer
// 用于延迟渲染 (Deferred Shading)`}));return(e,t)=>(E(),A("div",Q,[t[6]||(t[6]=n("h3",null,"🌰 WebGL2 新特性",-1)),t[7]||(t[7]=n("p",{class:"summary"},"对比 WebGL1 与 WebGL2 的 API 差异，展示 UBO、3D 纹理、VAO 原生支持等核心新特性。",-1)),n("div",Z,[n("div",ee,[n("canvas",{ref_key:"canvasRef",ref:x},null,512),n("div",te,d(h.value)+" FPS",1),n("div",{class:g(["api-badge",f.value])},d(f.value==="webgl2"?"WebGL2":"WebGL1"),3)]),n("div",re,[t[4]||(t[4]=n("h4",null,"API 切换",-1)),n("div",oe,[n("button",{class:g({active:f.value==="webgl1"}),onClick:t[0]||(t[0]=a=>D("webgl1"))},"WebGL1",2),n("button",{class:g({active:f.value==="webgl2"}),onClick:t[1]||(t[1]=a=>D("webgl2"))},"WebGL2",2)]),t[5]||(t[5]=n("h4",null,"特性亮点",-1)),n("div",ae,[(E(),A(j,null,q(m,a=>n("button",{key:a.id,class:g(["feature-btn",{active:b.value===a.id,disabled:f.value==="webgl1"}]),disabled:f.value==="webgl1",onClick:o=>b.value=a.id},d(a.name),11,ne)),64))]),f.value==="webgl2"?(E(),A("div",ie,[n("h5",null,d(B.value.name),1),n("p",null,d(B.value.desc),1)])):(E(),A("div",se,[...t[2]||(t[2]=[n("h5",null,"💡 切换到 WebGL2 查看特性演示",-1),n("p",null,"选择 WebGL2 后可体验 UBO、3D 纹理、原生 VAO 等 ES3.0 新特性。",-1)])])),n("div",le,[t[3]||(t[3]=n("h5",null,"关键 GLSL / API 代码",-1)),n("pre",null,[n("code",null,d(z.value[b.value]),1)])])])])]))}}),me=J(ve,[["__scopeId","data-v-8347b857"]]);export{me as default};
