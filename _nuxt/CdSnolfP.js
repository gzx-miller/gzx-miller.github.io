import{d as C,k as w,U as M,b as N,e as r,f as A,K as x,a1 as O,L as G,a2 as V,r as f,aa as X,g as H,o as k,I as W}from"./DutfXOOr.js";const q={class:"demo-card"},Y={class:"demo-layout"},z={class:"canvas-wrap"},K={class:"fps-badge"},Q={class:"control-panel"},j={class:"control-item"},J={class:"control-item"},Z={class:"control-item checkbox"},$={class:"code-display"},ee=`
precision mediump float;
uniform sampler2D u_scene;
uniform int u_effect;
uniform float u_intensity;
uniform float u_time;
varying vec2 v_uv;

void main() {
  vec4 color = texture2D(u_scene, v_uv);

  if (u_effect == 0) {
    vec3 gray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));
    gl_FragColor = vec4(mix(color.rgb, gray, u_intensity), 1.0);
  } else if (u_effect == 1) {
    vec3 bloomSum = vec3(0.0);
    float threshold = 0.8;
    if (length(color.rgb) > threshold) {
      bloomSum = color.rgb * u_intensity;
    }
    float s = sin(u_time) * 0.1 + 1.0;
    gl_FragColor = vec4(color.rgb + bloomSum * s, 1.0);
  } else if (u_effect == 2) {
    vec3 sum = vec3(0.0);
    float step = 0.004 * u_intensity;
    sum += texture2D(u_scene, v_uv + vec2(-step, -step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(-step, 0.0)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(-step, step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(0.0, -step)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv).rgb * 0.38774;
    sum += texture2D(u_scene, v_uv + vec2(0.0, step)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(step, -step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(step, 0.0)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(step, step)).rgb * 0.06136;
    gl_FragColor = vec4(sum, 1.0);
  } else {
    gl_FragColor = color;
  }
}
`,te=`
attribute vec2 a_position;
attribute vec3 a_color;
uniform float u_time;
varying vec3 v_color;
varying vec2 v_uv;

void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  gl_Position = vec4(pos, 0.0, 1.0);
  v_uv = a_position * 0.5 + 0.5;
}
`,oe=`
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`,re=`
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`,ne=C({__name:"W16PostProcess",setup(ae){const b=f(null),p=X(null),v=f("bloom"),m=f(.6),F=f(!0),h=f(0);function B(e,o,n){const t=e.createShader(o);return t?(e.shaderSource(t,n),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS)?t:(console.error(e.getShaderInfoLog(t)),e.deleteShader(t),null)):null}function D(e,o,n){const t=B(e,e.VERTEX_SHADER,o),s=B(e,e.FRAGMENT_SHADER,n);if(!t||!s)return null;const a=e.createProgram();return a?(e.attachShader(a,t),e.attachShader(a,s),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(console.error(e.getProgramInfoLog(a)),null)):null}function L(e){const o=D(e,te,oe);if(!o)return null;const n=new Float32Array([-.5,-.5,1,.3,.2,.5,-.5,.2,.8,.4,-.5,.5,.3,.6,.9,.5,.5,.9,.4,.2]),t=new Float32Array([-.8,-.2,.9,.7,.3,-.3,.3,.2,.9,.6,-.8,.3,.5,.3,.8]),s=new Float32Array([.2,-.3,.4,.2,.7,.8,-.1,.8,.6,.2,.5,.4,.3,.8,.5]),a=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,a);const u=n.length+t.length+s.length,l=new Float32Array(u);return l.set(n,0),l.set(t,n.length),l.set(s,n.length+t.length),e.bufferData(e.ARRAY_BUFFER,l,e.STATIC_DRAW),{program:o,buffer:a,count:9,stride:5}}function U(e,o,n){const t=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,t);const s=e.createTexture();e.bindTexture(e.TEXTURE_2D,s),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,o,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,s,0);const a=e.createRenderbuffer();return e.bindRenderbuffer(e.RENDERBUFFER,a),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,o,n),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,a),e.bindFramebuffer(e.FRAMEBUFFER,null),{fbo:t,texture:s,rbo:a}}let y=0,E=0,_=0;function S(e){const o=p.value;if(!o)return;const n=e-y;y=e,E++,_+=n,_>=500&&(h.value=Math.round(E*1e3/_),E=0,_=0);const t=o.gl,s=o.canvas.width,a=o.canvas.height;t.bindFramebuffer(t.FRAMEBUFFER,o.fbo),t.viewport(0,0,s,a),t.clearColor(.09,.07,.05,1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.enable(t.DEPTH_TEST);const u=o.sceneInfo;t.useProgram(u.program),t.bindBuffer(t.ARRAY_BUFFER,u.buffer);const l=t.getAttribLocation(u.program,"a_position"),c=t.getAttribLocation(u.program,"a_color");t.enableVertexAttribArray(l),t.vertexAttribPointer(l,2,t.FLOAT,!1,20,0),t.enableVertexAttribArray(c),t.vertexAttribPointer(c,3,t.FLOAT,!1,20,8),t.uniform1f(t.getUniformLocation(u.program,"u_time"),e*.001),t.drawArrays(t.TRIANGLES,0,u.count),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,s,a),t.clearColor(.09,.07,.05,1),t.clear(t.COLOR_BUFFER_BIT),t.disable(t.DEPTH_TEST);const i=o.fboProgram;t.useProgram(i);const R=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,R),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);const d=t.getAttribLocation(i,"a_position");t.enableVertexAttribArray(d),t.vertexAttribPointer(d,2,t.FLOAT,!1,0,0),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,o.fboTexture),t.uniform1i(t.getUniformLocation(i,"u_scene"),0);const g={bloom:1,blur:2,grayscale:0,none:-1};t.uniform1i(t.getUniformLocation(i,"u_effect"),g[v.value]),t.uniform1f(t.getUniformLocation(i,"u_intensity"),m.value),t.uniform1f(t.getUniformLocation(i,"u_time"),e*.001),t.drawArrays(t.TRIANGLES,0,6),t.deleteBuffer(R),F.value&&(o.rafId=requestAnimationFrame(S))}function P(){const e=b.value;if(!e)return;const o=e.parentElement,n=Math.min(o.clientWidth,480);e.width=n,e.height=n}w(()=>{const e=b.value;if(!e)return;const o=e.getContext("webgl",{antialias:!0,preserveDrawingBuffer:!1});if(!o){console.error("WebGL not supported");return}P();const n=e.width,t=e.height,s=L(o);if(!s)return;const a=D(o,re,ee);if(!a)return;const{fbo:u,texture:l,rbo:c}=U(o,n,t),i={gl:o,canvas:e,program:s.program,fboProgram:a,fbo:u,fboTexture:l,rbo:c,rafId:0,sceneInfo:s};p.value=i,new ResizeObserver(()=>{P();const d=e.width,g=e.height;o.bindFramebuffer(o.FRAMEBUFFER,u),o.deleteTexture(l),o.deleteFramebuffer(u),o.deleteRenderbuffer(c);const T=U(o,d,g);i.fbo=T.fbo,i.fboTexture=T.texture,i.rbo=T.rbo,o.bindFramebuffer(o.FRAMEBUFFER,null)}).observe(e.parentElement),i.rafId=requestAnimationFrame(S)}),M(()=>{const e=p.value;e&&(cancelAnimationFrame(e.rafId),e.gl.deleteProgram(e.program),e.gl.deleteProgram(e.fboProgram),e.gl.deleteFramebuffer(e.fbo),e.gl.deleteTexture(e.fboTexture),e.gl.deleteRenderbuffer(e.rbo),e.gl.getExtension("WEBGL_lose_context")?.loseContext())});const I=H(()=>({bloom:`// Bloom 提取高亮 + 叠加
if (u_effect == 1) {
  vec3 bloomSum = vec3(0.0);
  float threshold = 0.8;
  if (length(color.rgb) > threshold) {
    bloomSum = color.rgb * u_intensity;
  }
  gl_FragColor = vec4(color.rgb + bloomSum, 1.0);
}`,blur:`// Gaussian 3x3 采样
vec3 sum = vec3(0.0);
float step = 0.004 * u_intensity;
sum += texture2D(u_scene, v_uv + vec2(-step, -step)).rgb * 0.06136;
sum += texture2D(u_scene, v_uv + vec2(0.0, -step)).rgb * 0.24477;
// ... 9 tap Gaussian
gl_FragColor = vec4(sum, 1.0);`,grayscale:`// 亮度加权灰度化
vec3 gray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));
gl_FragColor = vec4(mix(color.rgb, gray, u_intensity), 1.0);`,none:`// 直接输出场景颜色
gl_FragColor = color;`}));return(e,o)=>(k(),N("div",q,[o[9]||(o[9]=r("h3",null,"🌰 后处理效果",-1)),o[10]||(o[10]=r("p",{class:"summary"},"场景渲染到 FBO 后，通过全屏四边形在片段着色器中实现 Bloom / 高斯模糊 / 灰度化。",-1)),r("div",Y,[r("div",z,[r("canvas",{ref_key:"canvasRef",ref:b},null,512),r("div",K,A(h.value)+" FPS",1)]),r("div",Q,[o[7]||(o[7]=r("h4",null,"效果控制",-1)),r("label",j,[o[4]||(o[4]=r("span",null,"后处理效果",-1)),x(r("select",{"onUpdate:modelValue":o[0]||(o[0]=n=>v.value=n)},[...o[3]||(o[3]=[r("option",{value:"none"},"原始渲染",-1),r("option",{value:"bloom"},"Bloom 泛光",-1),r("option",{value:"blur"},"高斯模糊",-1),r("option",{value:"grayscale"},"灰度化",-1)])],512),[[O,v.value]])]),r("label",J,[r("span",null,"强度："+A((m.value*100).toFixed(0))+"%",1),x(r("input",{type:"range",min:"0",max:"1",step:"0.01","onUpdate:modelValue":o[1]||(o[1]=n=>m.value=n)},null,512),[[G,m.value,void 0,{number:!0}]])]),r("label",Z,[x(r("input",{type:"checkbox","onUpdate:modelValue":o[2]||(o[2]=n=>F.value=n)},null,512),[[V,F.value]]),o[5]||(o[5]=r("span",null,"播放动画",-1))]),r("div",$,[o[6]||(o[6]=r("h5",null,"片段着色器关键代码",-1)),r("pre",null,[r("code",null,A(I.value[v.value]),1)])]),o[8]||(o[8]=r("div",{class:"info-section"},[r("h5",null,"📚 全屏四边形技术"),r("ul",null,[r("li",null,"场景渲染到 FBO 纹理"),r("li",null,"创建覆盖全屏的四边形 (Fullscreen Quad)"),r("li",null,"片段着色器对纹理采样实现效果"),r("li",null,"多个 Pass 串联为后处理管线")])],-1))])])]))}}),ue=W(ne,[["__scopeId","data-v-a09a6303"]]);export{ue as default};
