import{d as Fe,k as me,U as Ae,b as Te,e as a,K as ie,a2 as ue,v as le,M as Y,f as be,r as y,g as ge,aa as Ue,o as _e,I as Be}from"./DutfXOOr.js";const pe={class:"demo-card"},xe={class:"demo-layout"},Me={class:"canvas-wrapper"},Pe={class:"control-panel"},Le={class:"control-group checkbox-group"},De={class:"control-group checkbox-group"},he={class:"control-group"},Ne={class:"btn-group"},Se={class:"info-section"},ye={class:"info-text"},Oe=`attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
void main() {
  vec4 wp = uModel * vec4(aPosition, 1.0);
  vWorldPos = wp.xyz;
  vNormalWorld = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjection * uView * wp;
}`,we=`precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vWorldPos);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  vec3 baseColor = vec3(0.82, 0.54, 0.26);
  vec3 ambient = uAmbient * baseColor;
  vec3 diffuse = baseColor * NdotL;
  vec3 specular = vec3(1.0) * pow(RdotV, 24.0) * 0.5;
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}`,k=`attribute vec2 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  vUV = aUV;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Ve=`precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  gl_FragColor = texture2D(uScene, vUV);
}`,Ce=`precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  gl_FragColor = vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a);
}`,Ie=`precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(vec3(g), c.a);
}`,He=`precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  float r = dot(c.rgb, vec3(0.393, 0.769, 0.189));
  float g = dot(c.rgb, vec3(0.349, 0.686, 0.168));
  float b = dot(c.rgb, vec3(0.272, 0.534, 0.131));
  gl_FragColor = vec4(r, g, b, c.a);
}`,Ge=Fe({__name:"W14FBO",setup(We){const K=y(null),z=Ue(null),q=y(!0),v=y("invert"),j=y(!0),$=y(0),J=y(0);function ce(){const r=[-1,-1,-1,1,-1,-1,1,1,-1,-1,1,-1,-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,1,-1,1,1,-1,1,1,1,-1,1,1,-1,-1,-1,-1,-1,1,1,-1,1,1,-1,-1],e=[0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0],i=[0,1,2,0,2,3,4,6,5,4,7,6,8,9,10,8,10,11,12,14,13,12,15,14,16,17,18,16,18,19,20,21,22,20,22,23];return{vertices:new Float32Array(r),normals:new Float32Array(e),indices:new Uint16Array(i)}}function fe(o,r,e){const i=[],l=[],u=[];for(let s=0;s<=o;s++){const c=s*Math.PI/o,F=Math.sin(c),m=Math.cos(c);for(let g=0;g<=r;g++){const _=g*2*Math.PI/r,R=Math.sin(_),f=Math.cos(_)*F,B=m,A=R*F;l.push(f,B,A),i.push(e*f,e*B,e*A)}}for(let s=0;s<o;s++)for(let c=0;c<r;c++){const F=s*(r+1)+c,m=F+r+1;u.push(F,m,F+1,m,m+1,F+1)}return{vertices:new Float32Array(i),normals:new Float32Array(l),indices:new Uint16Array(u)}}function ve(o,r,e,i){const l=1/Math.tan(o/2),u=1/(e-i);return new Float32Array([l/r,0,0,0,0,l,0,0,0,0,(i+e)*u,-1,0,0,2*i*e*u,0])}function Re(o,r,e){const[i,l,u]=o,[s,c,F]=r,[m,g,_]=e;let R=i-s,n=l-c,f=u-F,B=Math.hypot(R,n,f);R/=B,n/=B,f/=B;let A=g*f-_*n,E=_*R-m*f,d=m*n-g*R,x=Math.hypot(A,E,d);A/=x,E/=x,d/=x;const w=n*d-f*E,V=f*A-R*d,C=R*E-n*A;return new Float32Array([A,w,R,0,E,V,n,0,d,C,f,0,-(A*i+E*l+d*u),-(w*i+V*l+C*u),-(R*i+n*l+f*u),1])}function Q(o){const r=Math.cos(o),e=Math.sin(o);return new Float32Array([r,0,-e,0,0,1,0,0,e,0,r,0,0,0,0,1])}function O(o){return new Float32Array([o[0],o[1],o[2],o[4],o[5],o[6],o[8],o[9],o[10]])}function Ee(){const o=K.value,r=o.getContext("webgl");if(!r){console.error("WebGL not supported");return}const e=r;z.value=e;const i=fe(30,30,.8),l=ce();function u(t,p){const T=e.createShader(e.VERTEX_SHADER);e.shaderSource(T,t),e.compileShader(T);const P=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(P,p),e.compileShader(P);const N=e.createProgram();return e.attachShader(N,T),e.attachShader(N,P),e.linkProgram(N),N}const s=u(Oe,we),c=u(k,Ve),F=u(k,Ce),m=u(k,Ie),g=u(k,He),_=e.getAttribLocation(s,"aPosition"),R=e.getAttribLocation(s,"aNormal"),n={uModel:e.getUniformLocation(s,"uModel"),uView:e.getUniformLocation(s,"uView"),uProj:e.getUniformLocation(s,"uProjection"),uNormMat:e.getUniformLocation(s,"uNormalMatrix"),uAmbient:e.getUniformLocation(s,"uAmbient"),uLightDir:e.getUniformLocation(s,"uLightDir"),uViewPos:e.getUniformLocation(s,"uViewPos")},f={none:c,invert:F,grayscale:m,sepia:g},B=new Float32Array([-1,-1,1,-1,1,1,-1,-1,1,1,-1,1]),A=new Float32Array([0,0,1,0,1,1,0,0,1,1,0,1]),E=e.getAttribLocation(c,"aPosition"),d=e.getAttribLocation(c,"aUV"),x={none:e.getUniformLocation(c,"uScene"),invert:e.getUniformLocation(F,"uScene"),grayscale:e.getUniformLocation(m,"uScene"),sepia:e.getUniformLocation(g,"uScene")},w=e.createBuffer(),V=e.createBuffer(),C=e.createBuffer(),I=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,I),e.bufferData(e.ARRAY_BUFFER,B,e.STATIC_DRAW);const H=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,H),e.bufferData(e.ARRAY_BUFFER,A,e.STATIC_DRAW);let M=null,U=null,h=null,Z=512,ee=512;function te(t,p){M&&(e.deleteFramebuffer(M),M=null),U&&(e.deleteTexture(U),U=null),h&&(e.deleteRenderbuffer(h),h=null),M=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,M),U=e.createTexture(),e.bindTexture(e.TEXTURE_2D,U),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,p,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,U,0),h=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,h),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,p),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,h);const T=e.checkFramebufferStatus(e.FRAMEBUFFER);T!==e.FRAMEBUFFER_COMPLETE&&console.warn("FBO incomplete:",T),e.bindFramebuffer(e.FRAMEBUFFER,null),Z=t,ee=p}e.enable(e.DEPTH_TEST),e.clearColor(0,0,0,0);function G(t){e.bindBuffer(e.ARRAY_BUFFER,w),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW),e.enableVertexAttribArray(_),e.vertexAttribPointer(_,3,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,V),e.bufferData(e.ARRAY_BUFFER,t.normals,e.STATIC_DRAW),e.enableVertexAttribArray(R),e.vertexAttribPointer(R,3,e.FLOAT,!1,0,0),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,C),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW)}function re(){if(!z.value)return;const t=z.value,p=window.devicePixelRatio||1,T=o.clientWidth*p,P=o.clientHeight*p;(o.width!==T||o.height!==P)&&(o.width=T,o.height=P,te(Math.min(T,1024),Math.min(P,1024)));const N=o.width/o.height,oe=ve(Math.PI/4,N,.1,100),ne=Re([0,.5,3.5],[0,0,0],[0,1,0]),ae=J.value*.008,W=Q(ae),X=(()=>{const b=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,1.5,0,0,1]),S=Q(-ae*1.5),se=new Float32Array(16);for(let L=0;L<4;L++)for(let D=0;D<4;D++)se[L*4+D]=S[L*4+0]*b[0+D]+S[L*4+1]*b[4+D]+S[L*4+2]*b[8+D]+S[L*4+3]*b[12+D];return se})();if(q.value&&M)if(t.bindFramebuffer(t.FRAMEBUFFER,M),t.viewport(0,0,Z,ee),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.useProgram(s),t.uniform3f(n.uAmbient,.25,.25,.25),t.uniform3f(n.uLightDir,.5,.7,.3),t.uniform3f(n.uViewPos,0,0,3.5),t.uniformMatrix4fv(n.uProj,!1,oe),t.uniformMatrix4fv(n.uView,!1,ne),G(i),t.uniformMatrix4fv(n.uModel,!1,W),t.uniformMatrix3fv(n.uNormMat,!1,O(W)),t.drawElements(t.TRIANGLES,i.indices.length,t.UNSIGNED_SHORT,0),G(l),t.uniformMatrix4fv(n.uModel,!1,X),t.uniformMatrix3fv(n.uNormMat,!1,O(X)),t.drawElements(t.TRIANGLES,l.indices.length,t.UNSIGNED_SHORT,0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,o.width,o.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),j.value){t.enable(t.SCISSOR_TEST);const b=o.width/2;t.scissor(0,0,b,o.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.useProgram(c),e.bindBuffer(e.ARRAY_BUFFER,I),e.enableVertexAttribArray(E),e.vertexAttribPointer(E,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,H),e.enableVertexAttribArray(d),e.vertexAttribPointer(d,2,e.FLOAT,!1,0,0),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,U),t.uniform1i(x.none,0),t.drawArrays(t.TRIANGLES,0,6),t.scissor(b,0,b,o.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);const S=f[v.value];t.useProgram(S),e.bindBuffer(e.ARRAY_BUFFER,I),t.enableVertexAttribArray(E),t.vertexAttribPointer(E,2,e.FLOAT,!1,0,0),t.bindBuffer(e.ARRAY_BUFFER,H),t.enableVertexAttribArray(d),t.vertexAttribPointer(d,2,e.FLOAT,!1,0,0),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,U),t.uniform1i(x[v.value],0),t.drawArrays(t.TRIANGLES,0,6),t.disable(t.SCISSOR_TEST)}else{const b=f[v.value];t.useProgram(b),e.bindBuffer(e.ARRAY_BUFFER,I),t.enableVertexAttribArray(E),t.vertexAttribPointer(E,2,e.FLOAT,!1,0,0),t.bindBuffer(e.ARRAY_BUFFER,H),t.enableVertexAttribArray(d),t.vertexAttribPointer(d,2,e.FLOAT,!1,0,0),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,U),t.uniform1i(x[v.value],0),t.drawArrays(t.TRIANGLES,0,6)}else t.viewport(0,0,o.width,o.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.useProgram(s),t.uniform3f(n.uAmbient,.25,.25,.25),t.uniform3f(n.uLightDir,.5,.7,.3),t.uniform3f(n.uViewPos,0,0,3.5),t.uniformMatrix4fv(n.uProj,!1,oe),t.uniformMatrix4fv(n.uView,!1,ne),G(i),t.uniformMatrix4fv(n.uModel,!1,W),t.uniformMatrix3fv(n.uNormMat,!1,O(W)),t.drawElements(t.TRIANGLES,i.indices.length,t.UNSIGNED_SHORT,0),G(l),t.uniformMatrix4fv(n.uModel,!1,X),t.uniformMatrix3fv(n.uNormMat,!1,O(X)),t.drawElements(t.TRIANGLES,l.indices.length,t.UNSIGNED_SHORT,0);J.value+=.3,$.value=requestAnimationFrame(re)}te(512,512),re()}me(()=>{Ee()}),Ae(()=>{$.value&&cancelAnimationFrame($.value)});const de=ge(()=>`FBO 配置：
  颜色附件: COLOR_ATTACHMENT0 (RGBA 纹理)
  深度附件: DEPTH_ATTACHMENT (RENDERBUFFER)
  尺寸: 512 × 512 px
  当前后处理: ${{none:"无后处理（原样显示）",invert:"颜色反相",grayscale:"灰度转换（Luminance）",sepia:"棕褐色调"}[v.value]}`);return(o,r)=>(_e(),Te("div",pe,[r[12]||(r[12]=a("h3",null,"🌰 帧缓冲与离屏渲染（FBO）",-1)),r[13]||(r[13]=a("p",{class:"summary"}," 演示帧缓冲对象（FBO）的使用：将场景渲染到离屏 FBO 纹理，再通过全屏四边形进行后处理。左侧为原始渲染，右侧为后处理效果。 ",-1)),a("div",xe,[a("div",Me,[a("canvas",{ref_key:"canvasRef",ref:K,class:"gl-canvas"},null,512),r[6]||(r[6]=a("div",{class:"glsl-snippet"},[a("strong",null,"FBO 创建与绑定："),a("pre",null,`gl.bindFramebuffer(FRAMEBUFFER, fbo);
gl.framebufferTexture2D(
  FRAMEBUFFER, COLOR_ATTACHMENT0,
  TEXTURE_2D, colorTexture, 0
);
gl.framebufferRenderbuffer(
  FRAMEBUFFER, DEPTH_ATTACHMENT,
  RENDERBUFFER, depthRB
);`)],-1))]),a("div",Pe,[a("div",Le,[a("label",null,[ie(a("input",{type:"checkbox","onUpdate:modelValue":r[0]||(r[0]=e=>q.value=e)},null,512),[[ue,q.value]]),r[7]||(r[7]=le(" 启用 FBO 离屏渲染 ",-1))])]),a("div",De,[a("label",null,[ie(a("input",{type:"checkbox","onUpdate:modelValue":r[1]||(r[1]=e=>j.value=e)},null,512),[[ue,j.value]]),r[8]||(r[8]=le(" 分屏对比（前/后处理） ",-1))])]),a("div",he,[r[9]||(r[9]=a("label",null,"后处理效果:",-1)),a("div",Ne,[a("button",{class:Y({active:v.value==="none"}),onClick:r[2]||(r[2]=e=>v.value="none")},"原样",2),a("button",{class:Y({active:v.value==="invert"}),onClick:r[3]||(r[3]=e=>v.value="invert")},"反相",2),a("button",{class:Y({active:v.value==="grayscale"}),onClick:r[4]||(r[4]=e=>v.value="grayscale")},"灰度",2),a("button",{class:Y({active:v.value==="sepia"}),onClick:r[5]||(r[5]=e=>v.value="sepia")},"复古",2)])])])]),a("div",Se,[r[10]||(r[10]=a("h4",null,"💡 FBO 附件配置",-1)),a("pre",ye,be(de.value),1),r[11]||(r[11]=a("p",{class:"info-note"}," FBO（Framebuffer Object）允许渲染到离屏目标而非屏幕。核心流程：1) 创建 FBO 并绑定； 2) 附加颜色纹理（COLOR_ATTACHMENT0）和深度缓冲（DEPTH_ATTACHMENT）； 3) 检查 FBO 完整性；4) 在 FBO 中执行渲染；5) 绑定默认帧缓冲并使用 FBO 纹理进行二次渲染。 ",-1))])]))}}),Ye=Be(Ge,[["__scopeId","data-v-bf23a354"]]);export{Ye as default};
