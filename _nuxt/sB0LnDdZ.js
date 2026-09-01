import{d as V,k as X,U as z,b as O,e as n,f as u,K as F,L as P,a2 as N,F as W,E as k,r as l,aa as Y,g as q,o as w,v as H,I as K}from"./DutfXOOr.js";const j={class:"demo-card"},J={class:"demo-layout"},Q={class:"canvas-wrap"},Z={class:"fps-badge"},$={class:"count-badge"},ee={class:"control-panel"},te={class:"control-item"},oe={class:"control-item"},re={class:"control-item"},ne={class:"control-item checkbox"},ae={class:"info-section"},ie=`
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`,se=`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_posTex;
uniform float u_time;
uniform float u_force;
uniform vec2 u_forceCenter;
void main() {
  vec4 posData = texture2D(u_posTex, v_uv);
  vec2 pos = posData.xy;
  vec2 vel = posData.zw;

  vec2 toCenter = u_forceCenter - pos;
  float dist = length(toCenter);
  float force = u_force * 0.5;
  if (dist > 0.01) {
    vel += normalize(toCenter) * force / max(dist, 0.1) * 0.02;
  }

  vel *= 0.98;
  pos += vel * 0.01;

  pos = fract(pos + 1.0);

  gl_FragColor = vec4(pos, vel);
}
`,ue=`
attribute float a_index;
uniform sampler2D u_posTex;
uniform float u_texSize;
uniform float u_particleSize;
void main() {
  float x = mod(a_index, u_texSize) / u_texSize;
  float y = floor(a_index / u_texSize) / u_texSize;
  vec2 uv = vec2(x, y);
  vec4 posData = texture2D(u_posTex, uv);
  vec2 pos = posData.xy * 2.0 - 1.0;
  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = u_particleSize * (1.0 + 0.5 * sin(a_index * 0.1));
}
`,le=`
precision mediump float;
uniform float u_time;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float alpha = 1.0 - d * 2.0;
  float hue = 0.08 + 0.06 * sin(u_time + gl_FragCoord.x * 0.01);
  vec3 col = mix(vec3(0.95, 0.55, 0.2), vec3(0.6, 0.85, 0.35), hue);
  gl_FragColor = vec4(col, alpha);
}
`,ce=V({__name:"W19Particles",setup(fe){const R=l(null),d=Y(null),s=l(4096),p=l(4),m=l(1),y=l(!0),g=l(0),v=l(!1),b=q(()=>{const t=s.value;return Math.ceil(Math.sqrt(t))});function B(t,e,r){const o=t.createShader(e);return o?(t.shaderSource(o,r),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)?o:(console.error(t.getShaderInfoLog(o)),t.deleteShader(o),null)):null}function U(t,e,r){const o=B(t,t.VERTEX_SHADER,e),i=B(t,t.FRAGMENT_SHADER,r);if(!o||!i)return null;const a=t.createProgram();return a?(t.attachShader(a,o),t.attachShader(a,i),t.linkProgram(a),t.getProgramParameter(a,t.LINK_STATUS)?a:(console.error(t.getProgramInfoLog(a)),null)):null}function S(t,e,r,o){const i=t.createTexture();return t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,e,0,t.RGBA,o,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),i}function h(t,e){const r=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0),t.bindFramebuffer(t.FRAMEBUFFER,null),r}function M(t,e){const r=new Float32Array(e*e*4),o=Math.min(t,e*e);for(let i=0;i<o;i++){const a=i*4;r[a+0]=Math.random(),r[a+1]=Math.random(),r[a+2]=(Math.random()-.5)*.02,r[a+3]=(Math.random()-.5)*.02}return r}function D(t){const e=d.value;if(!e)return;const r=t-e.lastTime;e.lastTime=t,e.frameCount++,e.fpsTime+=r,e.fpsTime>=500&&(e.fps=Math.round(e.frameCount*1e3/e.fpsTime),e.frameCount=0,e.fpsTime=0,g.value=e.fps);const o=e.gl,i=R.value,a=b.value;o.bindFramebuffer(o.FRAMEBUFFER,e.writeFBO),o.viewport(0,0,a,a),o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.useProgram(e.updateProg),o.bindBuffer(o.ARRAY_BUFFER,e.quadVBO);const _=o.getAttribLocation(e.updateProg,"a_position");o.enableVertexAttribArray(_),o.vertexAttribPointer(_,2,o.FLOAT,!1,0,0),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,e.readTex),o.uniform1i(o.getUniformLocation(e.updateProg,"u_posTex"),0),o.uniform1f(o.getUniformLocation(e.updateProg,"u_time"),t*.001),o.uniform1f(o.getUniformLocation(e.updateProg,"u_force"),m.value);const c=v.value?Math.sin(t*5e-4)*.3+.5:.5,T=v.value?Math.cos(t*7e-4)*.3+.5:.5;o.uniform2f(o.getUniformLocation(e.updateProg,"u_forceCenter"),c,T),o.drawArrays(o.TRIANGLES,0,6);const A=e.readTex,x=e.writeFBO;e.readTex=e.writeFBO===e.fboA?e.texB:e.texA,e.writeFBO=e.writeFBO===e.fboA?e.fboB:e.fboA,e._tempTex=A,e._tempFBO=x,o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,i.width,i.height),o.clearColor(.09,.07,.05,1),o.clear(o.COLOR_BUFFER_BIT),o.useProgram(e.renderProg),o.bindBuffer(o.ARRAY_BUFFER,e.particleVBO);const f=o.getAttribLocation(e.renderProg,"a_index");o.enableVertexAttribArray(f),o.vertexAttribPointer(f,1,o.FLOAT,!1,0,0),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,e.readTex),o.uniform1i(o.getUniformLocation(e.renderProg,"u_posTex"),0),o.uniform1f(o.getUniformLocation(e.renderProg,"u_texSize"),a),o.uniform1f(o.getUniformLocation(e.renderProg,"u_particleSize"),p.value),o.uniform1f(o.getUniformLocation(e.renderProg,"u_time"),t*.001);const E=Math.min(s.value,a*a);o.drawArrays(o.POINTS,0,E),y.value&&(e.rafId=requestAnimationFrame(D))}function I(t){const e=new Float32Array(t);for(let r=0;r<t;r++)e[r]=r;return e}X(()=>{const t=R.value;if(!t)return;const e=t.getContext("webgl",{antialias:!0,preserveDrawingBuffer:!1});if(!e){console.error("WebGL not supported");return}const o=e.getExtension("OES_texture_float")?e.FLOAT:e.UNSIGNED_BYTE,i=t.parentElement;t.width=Math.min(i.clientWidth,480),t.height=Math.min(i.clientWidth,480);const a=b.value,_=M(s.value,a),c=S(e,a,_,o),T=S(e,a,null,o),A=h(e,c),x=h(e,T),f=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,f),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const E=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,E),e.bufferData(e.ARRAY_BUFFER,I(s.value),e.STATIC_DRAW);const C=U(e,ie,se),L=U(e,ue,le);!C||!L||(d.value={gl:e,updateProg:C,renderProg:L,quadVBO:f,particleVBO:E,fboA:A,fboB:x,texA:c,texB:T,rafId:0,readTex:c,writeFBO:x,fps:0,frameCount:0,fpsTime:0,lastTime:performance.now()},d.value.rafId=requestAnimationFrame(D))}),z(()=>{const t=d.value;t&&(cancelAnimationFrame(t.rafId),t.gl.deleteProgram(t.updateProg),t.gl.deleteProgram(t.renderProg),t.gl.deleteBuffer(t.quadVBO),t.gl.deleteBuffer(t.particleVBO),t.gl.deleteFramebuffer(t.fboA),t.gl.deleteFramebuffer(t.fboB),t.gl.deleteTexture(t.texA),t.gl.deleteTexture(t.texB),t.gl.getExtension("WEBGL_lose_context")?.loseContext())});const G=[{step:"1",desc:"初始化粒子位置到浮点纹理 (RGBA: xy=位置, zw=速度)"},{step:"2",desc:"每帧在 FBO 中执行 Update Pass（全屏四边形）"},{step:"3",desc:"片段着色器采样位置纹理，计算力场/阻尼，写入新纹理"},{step:"4",desc:"Ping-pong 交换：读/写纹理互换"},{step:"5",desc:"Render Pass：用 gl.POINTS 绘制所有粒子"}];return(t,e)=>(w(),O("div",j,[e[9]||(e[9]=n("h3",null,"🌰 粒子系统与 GPU 计算 (GPGPU)",-1)),e[10]||(e[10]=n("p",{class:"summary"},"粒子位置存储在浮点纹理中，每帧通过 Ping-Pong FBO 在 GPU 端完成位置更新，无需 CPU 回读。",-1)),n("div",J,[n("div",Q,[n("canvas",{ref_key:"canvasRef",ref:R},null,512),n("div",Z,u(g.value)+" FPS",1),n("div",$,u(s.value)+" 粒子",1)]),n("div",ee,[e[6]||(e[6]=n("h4",null,"粒子控制",-1)),n("label",te,[n("span",null,"粒子数量："+u(s.value),1),F(n("input",{type:"range",min:"256",max:"16384",step:"256","onUpdate:modelValue":e[0]||(e[0]=r=>s.value=r)},null,512),[[P,s.value,void 0,{number:!0}]])]),n("label",oe,[n("span",null,"粒子大小："+u(p.value.toFixed(1)),1),F(n("input",{type:"range",min:"1",max:"12",step:"0.5","onUpdate:modelValue":e[1]||(e[1]=r=>p.value=r)},null,512),[[P,p.value,void 0,{number:!0}]])]),n("label",re,[n("span",null,"力场强度："+u(m.value.toFixed(1)),1),F(n("input",{type:"range",min:"0",max:"5.0",step:"0.1","onUpdate:modelValue":e[2]||(e[2]=r=>m.value=r)},null,512),[[P,m.value,void 0,{number:!0}]])]),n("label",ne,[F(n("input",{type:"checkbox","onUpdate:modelValue":e[3]||(e[3]=r=>v.value=r)},null,512),[[N,v.value]]),e[4]||(e[4]=n("span",null,"显示移动力场中心",-1))]),e[7]||(e[7]=n("div",{class:"code-display"},[n("h5",null,"GPGPU 核心: Ping-Pong 技术"),n("pre",null,[n("code",null,`// Update Pass: 写入新位置
gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO);
gl.drawArrays(gl.TRIANGLES, 0, 6);

// 交换读写纹理
const tmp = readTex;
readTex = writeTex;
writeTex = tmp;`)])],-1)),n("div",ae,[e[5]||(e[5]=n("h5",null,"📚 GPGPU 流程",-1)),n("ol",null,[(w(),O(W,null,k(G,r=>n("li",{key:r.step},[n("strong",null,u(r.step)+".",1),H(" "+u(r.desc),1)])),64))])]),e[8]||(e[8]=n("div",{class:"code-display"},[n("h5",null,"更新着色器 (GLSL)"),n("pre",null,[n("code",null,`// 位置 + 速度编码在 RGBA 中
vec4 posData = texture2D(u_posTex, uv);
vec2 pos = posData.xy;
vec2 vel = posData.zw;

// 力场吸引
vel += normalize(toCenter) * force / dist * 0.02;
vel *= 0.98; // 阻尼
pos += vel * 0.01;

gl_FragColor = vec4(pos, vel);`)])],-1))])])]))}}),pe=K(ce,[["__scopeId","data-v-60ee6ec7"]]);export{pe as default};
