import{d as Ce,k as ze,U as Oe,b as Ge,e as l,f as z,K as O,L as H,a2 as We,v as Ye,r as M,g as He,aa as Xe,o as je,I as ke}from"./DutfXOOr.js";const $e={class:"demo-card"},qe={class:"demo-layout"},Ze={class:"canvas-wrapper"},Ke={class:"control-panel"},Je={class:"control-group"},Qe={class:"control-group"},et={class:"control-group"},tt={class:"control-group"},ot={class:"control-group checkbox-group"},nt={class:"info-section"},rt={class:"info-text"},at=`attribute vec3 aPosition;
uniform mat4 uLightMVP;
void main() {
  gl_Position = uLightMVP * vec4(aPosition, 1.0);
}`,it=`precision mediump float;
void main() {
  gl_FragColor = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1.0);
}`,st=`attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uLightMVP;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
varying vec4 vLightSpacePos;
void main() {
  vec4 wp = uModel * vec4(aPosition, 1.0);
  vWorldPos = wp.xyz;
  vNormalWorld = normalize(mat3(uModel) * aNormal);
  vLightSpacePos = uLightMVP * wp;
  gl_Position = uProjection * uView * wp;
}`,ut=`precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
varying vec4 vLightSpacePos;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
uniform vec3 uMatColor;
uniform sampler2D uShadowMap;
uniform float uShadowBias;
uniform float uShadowIntensity;

float calcShadow(vec4 lightSpacePos) {
  vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w;
  projCoords = projCoords * 0.5 + 0.5;
  if (projCoords.z > 1.0) return 0.0;
  float currentDepth = projCoords.z;
  vec2 texelSize = 1.0 / vec2(textureSize(uShadowMap, 0));
  float shadow = 0.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      float pcfDepth = texture2D(uShadowMap, projCoords.xy + vec2(x, y) * texelSize).r;
      shadow += currentDepth - uShadowBias > pcfDepth ? 1.0 : 0.0;
    }
  }
  return shadow / 9.0;
}

void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vWorldPos);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  float shadow = calcShadow(vLightSpacePos);
  shadow = shadow * uShadowIntensity;
  vec3 ambient = uAmbient * uMatColor;
  vec3 diffuse = uMatColor * NdotL * (1.0 - shadow);
  vec3 specular = vec3(1.0) * pow(RdotV, 24.0) * 0.4 * (1.0 - shadow);
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}`,lt=`attribute vec2 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  vUV = aUV;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,ct=`precision mediump float;
varying vec2 vUV;
uniform sampler2D uShadowMap;
void main() {
  float depth = texture2D(uShadowMap, vUV).r;
  float gray = depth;
  gl_FragColor = vec4(gray, gray, gray, 1.0);
}`,ft=Ce({__name:"W15Shadows",setup(dt){const te=M(null),X=Xe(null),B=M(.005),x=M(45),U=M(60),j=M(!1),D=M(.7),k=M(0),$=M(0);function de(r,o,e){const s=[],u=[],f=[],a=r/2,i=o/2,n=e/2,v=[{n:[0,0,1],verts:[[-a,-i,n],[a,-i,n],[a,i,n],[-a,i,n]]},{n:[0,0,-1],verts:[[a,-i,-n],[-a,-i,-n],[-a,i,-n],[a,i,-n]]},{n:[1,0,0],verts:[[a,-i,n],[a,-i,-n],[a,i,-n],[a,i,n]]},{n:[-1,0,0],verts:[[-a,-i,-n],[-a,-i,n],[-a,i,n],[-a,i,-n]]},{n:[0,1,0],verts:[[-a,i,n],[a,i,n],[a,i,-n],[-a,i,-n]]},{n:[0,-1,0],verts:[[-a,-i,-n],[a,-i,-n],[a,-i,n],[-a,-i,n]]}];for(const m of v){for(const d of m.verts)s.push(d[0],d[1],d[2]),u.push(m.n[0],m.n[1],m.n[2]);const h=s.length/3-4;f.push(h,h+1,h+2,h,h+2,h+3)}return{vertices:new Float32Array(s),normals:new Float32Array(u),indices:new Uint16Array(f)}}function he(r,o,e){const s=[],u=[],f=[];for(let a=0;a<=r;a++){const i=a*Math.PI/r,n=Math.sin(i),v=Math.cos(i);for(let m=0;m<=o;m++){const h=m*2*Math.PI/o,d=Math.sin(h),p=Math.cos(h)*n,E=v,c=d*n;u.push(p,E,c),s.push(e*p,e*E,e*c)}}for(let a=0;a<r;a++)for(let i=0;i<o;i++){const n=a*(o+1)+i,v=n+o+1;f.push(n,v,n+1,v,v+1,n+1)}return{vertices:new Float32Array(s),normals:new Float32Array(u),indices:new Uint16Array(f)}}function ve(){const o=new Float32Array([-5,0,-5,5,0,-5,5,0,5,-5,0,-5,5,0,5,-5,0,5]),e=new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0]),s=new Uint16Array([0,1,2,0,2,3]);return{vertices:o,normals:e,indices:s}}function me(r,o,e,s){const u=1/Math.tan(r/2),f=1/(e-s);return new Float32Array([u/o,0,0,0,0,u,0,0,0,0,(s+e)*f,-1,0,0,2*s*e*f,0])}function pe(r,o,e,s,u,f){const a=1/(r-o),i=1/(e-s),n=1/(u-f);return new Float32Array([-2*a,0,0,0,0,2*i,0,0,0,0,n,0,(r+o)*a,(s+e)*i,(f+u)*n,1])}function oe(r,o,e){const[s,u,f]=r,[a,i,n]=o,[v,m,h]=e;let d=s-a,R=u-i,p=f-n,E=Math.hypot(d,R,p);d/=E,R/=E,p/=E;let c=m*p-h*R,F=h*d-v*p,T=v*R-m*d,N=Math.hypot(c,F,T);c/=N,F/=N,T/=N;const P=R*T-p*F,G=p*c-d*T,I=d*F-R*c;return new Float32Array([c,P,d,0,F,G,R,0,T,I,p,0,-(c*s+F*u+T*f),-(P*s+G*u+I*f),-(d*s+R*u+p*f),1])}function _(r,o){const e=new Float32Array(16);for(let s=0;s<4;s++)for(let u=0;u<4;u++)e[s*4+u]=r[s*4+0]*o[0+u]+r[s*4+1]*o[4+u]+r[s*4+2]*o[8+u]+r[s*4+3]*o[12+u];return e}function ne(r,o,e){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,r,o,e,1])}function re(r){const o=Math.cos(r),e=Math.sin(r);return new Float32Array([o,0,-e,0,0,1,0,0,e,0,o,0,0,0,0,1])}function Re(){const r=te.value,o=r.getContext("webgl");if(!o){console.error("WebGL not supported");return}const e=o;X.value=e;const s=he(30,30,.4),u=de(.8,.8,.8),f=ve();function a(t,b){const A=e.createShader(e.VERTEX_SHADER);e.shaderSource(A,t),e.compileShader(A);const y=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(y,b),e.compileShader(y);const S=e.createProgram();return e.attachShader(S,A),e.attachShader(S,y),e.linkProgram(S),S}const i=a(at,it),n=a(st,ut),v=a(lt,ct),m=e.getAttribLocation(i,"aPosition"),h=e.getAttribLocation(n,"aPosition"),d=e.getAttribLocation(n,"aNormal"),R=e.getAttribLocation(v,"aPosition"),p=e.getAttribLocation(v,"aUV"),E=e.getUniformLocation(i,"uLightMVP"),c={uModel:e.getUniformLocation(n,"uModel"),uView:e.getUniformLocation(n,"uView"),uProj:e.getUniformLocation(n,"uProjection"),uLightMVP:e.getUniformLocation(n,"uLightMVP"),uAmbient:e.getUniformLocation(n,"uAmbient"),uLightDir:e.getUniformLocation(n,"uLightDir"),uViewPos:e.getUniformLocation(n,"uViewPos"),uMatColor:e.getUniformLocation(n,"uMatColor"),uShadowMap:e.getUniformLocation(n,"uShadowMap"),uShadowBias:e.getUniformLocation(n,"uShadowBias"),uShadowIntensity:e.getUniformLocation(n,"uShadowIntensity")},F=e.getUniformLocation(v,"uShadowMap"),T=e.createBuffer(),N=e.createBuffer(),P=e.createBuffer(),G=e.createBuffer(),I=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,I),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,-1,1,1,-1,1]),e.STATIC_DRAW);const ae=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,ae),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,1,1,0,0,1,1,0,1]),e.STATIC_DRAW);const L=1024;let V=null,w=null;function Ae(){V&&e.deleteFramebuffer(V),w&&e.deleteTexture(w),V=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,V),w=e.createTexture(),e.bindTexture(e.TEXTURE_2D,w),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,L,L,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,w,0);const t=e.createRenderbuffer();e.bindRenderbuffer(e.RENDERBUFFER,t),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,L,L),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,t),e.bindFramebuffer(e.FRAMEBUFFER,null)}e.enable(e.DEPTH_TEST),e.clearColor(0,0,0,0);function q(t,b,A){return e.bindBuffer(e.ARRAY_BUFFER,T),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW),e.enableVertexAttribArray(b),e.vertexAttribPointer(b,3,e.FLOAT,!1,0,0),A!==null&&(e.bindBuffer(e.ARRAY_BUFFER,N),e.bufferData(e.ARRAY_BUFFER,t.normals,e.STATIC_DRAW),e.enableVertexAttribArray(A),e.vertexAttribPointer(A,3,e.FLOAT,!1,0,0)),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,P),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t.indices,e.STATIC_DRAW),t.indices.length}function Z(t){e.bindBuffer(e.ARRAY_BUFFER,G),e.bufferData(e.ARRAY_BUFFER,t.vertices,e.STATIC_DRAW),e.enableVertexAttribArray(m),e.vertexAttribPointer(m,3,e.FLOAT,!1,0,0)}function ie(){if(!X.value)return;const t=X.value,b=window.devicePixelRatio||1,A=r.clientWidth*b,y=r.clientHeight*b;(r.width!==A||r.height!==y)&&(r.width=A,r.height=y);const S=x.value*Math.PI/180,K=U.value*Math.PI/180,J=6,ge=Math.sin(S)*Math.cos(K)*J,Fe=Math.sin(K)*J,Te=Math.cos(S)*Math.cos(K)*J,g=[-ge,-Fe,-Te],Q=Math.hypot(g[0],g[1],g[2]);g[0]/=Q,g[1]/=Q,g[2]/=Q;const se=x.value*Math.PI/180,ee=U.value*Math.PI/180,we=[Math.sin(se)*Math.cos(ee)*8,Math.sin(ee)*8+2,Math.cos(se)*Math.cos(ee)*8],Me=oe(we,[0,0,0],[0,1,0]),_e=pe(-6,6,-6,6,.5,30),W=_(_e,_(Me,ue()));function ue(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}const le=_(ne(-.8,.4,0),re($.value*.01)),ce=_(ne(.8,.4,0),re(-$.value*.008)),fe=ue();t.bindFramebuffer(t.FRAMEBUFFER,V),t.viewport(0,0,L,L),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.useProgram(i);const Pe={vertices:s.vertices},be={vertices:u.vertices},Se={vertices:f.vertices};Z(Pe);const xe=_(W,le);t.uniformMatrix4fv(E,!1,xe),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,P),t.bufferData(t.ELEMENT_ARRAY_BUFFER,s.indices,e.STATIC_DRAW),t.drawElements(t.TRIANGLES,s.indices.length,e.UNSIGNED_SHORT,0),Z(be);const Ue=_(W,ce);t.uniformMatrix4fv(E,!1,Ue),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,P),t.bufferData(t.ELEMENT_ARRAY_BUFFER,u.indices,e.STATIC_DRAW),t.drawElements(t.TRIANGLES,u.indices.length,e.UNSIGNED_SHORT,0),Z(Se);const Le=_(W,fe);t.uniformMatrix4fv(E,!1,Le),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,P),t.bufferData(t.ELEMENT_ARRAY_BUFFER,f.indices,e.STATIC_DRAW),t.drawElements(t.TRIANGLES,f.indices.length,e.UNSIGNED_SHORT,0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,r.width,r.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);const ye=r.width/r.height,Be=me(Math.PI/4,ye,.1,100),De=oe([0,2.5,5],[0,0,0],[0,1,0]),Ne=W;t.useProgram(n),t.uniform3f(c.uAmbient,.3,.3,.3),t.uniform3f(c.uLightDir,g[0],g[1],g[2]),t.uniform3f(c.uViewPos,0,2.5,5),t.uniform3f(c.uMatColor,.82,.54,.26),t.uniformMatrix4fv(c.uProj,!1,Be),t.uniformMatrix4fv(c.uView,!1,De),t.uniformMatrix4fv(c.uLightMVP,!1,Ne),t.uniform1f(c.uShadowBias,B.value),t.uniform1f(c.uShadowIntensity,D.value),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,w),t.uniform1i(c.uShadowMap,0);let C=q(s,h,d);if(t.uniformMatrix4fv(c.uModel,!1,le),t.drawElements(t.TRIANGLES,C,t.UNSIGNED_SHORT,0),C=q(u,h,d),t.uniformMatrix4fv(c.uModel,!1,ce),t.drawElements(t.TRIANGLES,C,t.UNSIGNED_SHORT,0),C=q(f,h,d),t.uniformMatrix4fv(c.uModel,!1,fe),t.drawElements(t.TRIANGLES,C,t.UNSIGNED_SHORT,0),j.value&&w){t.useProgram(v),t.bindBuffer(t.ARRAY_BUFFER,I),t.enableVertexAttribArray(R),t.vertexAttribPointer(R,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,ae),t.enableVertexAttribArray(p),t.vertexAttribPointer(p,2,t.FLOAT,!1,0,0),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,w),t.uniform1i(F,0);const Y=Math.min(r.width,r.height)*.25,Ie=r.width-Y-10,Ve=r.height-Y-10;t.viewport(Ie,Ve,Y,Y),t.drawArrays(t.TRIANGLES,0,6),t.viewport(0,0,r.width,r.height)}$.value+=.3,k.value=requestAnimationFrame(ie)}Ae(),ie()}ze(()=>{Re()}),Oe(()=>{k.value&&cancelAnimationFrame(k.value)});const Ee=He(()=>`Pass 1 - 深度渲染:
  从光源视角 (${x.value}°, ${U.value}°) 渲染场景
  输出: 1024×1024 深度纹理

Pass 2 - 阴影计算:
  每个像素: 投影到光空间 → 采样深度纹理 → 比较
  偏移 (bias): ${B.value}
  阴影强度: ${D.value}`);return(r,o)=>(je(),Ge("div",$e,[o[9]||(o[9]=l("h3",null,"🌰 阴影映射（Shadow Mapping）",-1)),o[10]||(o[10]=l("p",{class:"summary"}," 实时阴影映射演示。第一遍从光源视角渲染深度到 Shadow FBO，第二遍将像素投影到光空间与深度纹理对比，使用 3×3 PCF 采样实现软阴影。 ",-1)),l("div",qe,[l("div",Ze,[l("canvas",{ref_key:"canvasRef",ref:te,class:"gl-canvas"},null,512),o[5]||(o[5]=l("div",{class:"glsl-snippet"},[l("strong",null,"阴影计算核心代码："),l("pre",null,`projCoords = lightSpacePos.xyz / w * 0.5 + 0.5;
currentDepth = projCoords.z;
for (x=-1..1, y=-1..1) {
  pcfDepth = texture(shadowMap, uv+offset).r;
  shadow += currentDepth - bias > pcfDepth ? 1 : 0;
}
shadow /= 9.0; // PCF 3×3 平均`)],-1))]),l("div",Ke,[l("div",Je,[l("label",null,"阴影偏移 (bias): "+z(B.value.toFixed(3)),1),O(l("input",{type:"range",min:"0.001",max:"0.05",step:"0.001","onUpdate:modelValue":o[0]||(o[0]=e=>B.value=e)},null,512),[[H,B.value,void 0,{number:!0}]])]),l("div",Qe,[l("label",null,"阴影强度: "+z(D.value.toFixed(2)),1),O(l("input",{type:"range",min:"0",max:"1",step:"0.01","onUpdate:modelValue":o[1]||(o[1]=e=>D.value=e)},null,512),[[H,D.value,void 0,{number:!0}]])]),l("div",et,[l("label",null,"光源方位角: "+z(x.value)+"°",1),O(l("input",{type:"range",min:"0",max:"360",step:"1","onUpdate:modelValue":o[2]||(o[2]=e=>x.value=e)},null,512),[[H,x.value,void 0,{number:!0}]])]),l("div",tt,[l("label",null,"光源仰角: "+z(U.value)+"°",1),O(l("input",{type:"range",min:"10",max:"89",step:"1","onUpdate:modelValue":o[3]||(o[3]=e=>U.value=e)},null,512),[[H,U.value,void 0,{number:!0}]])]),l("div",ot,[l("label",null,[O(l("input",{type:"checkbox","onUpdate:modelValue":o[4]||(o[4]=e=>j.value=e)},null,512),[[We,j.value]]),o[6]||(o[6]=Ye(" 显示 Shadow Map（右下角） ",-1))])])])]),l("div",nt,[o[7]||(o[7]=l("h4",null,"💡 两遍渲染流程",-1)),l("pre",rt,z(Ee.value),1),o[8]||(o[8]=l("p",{class:"info-note"}," 阴影映射分两步：1) 从光源视角渲染场景深度到 Shadow Map 纹理；2) 从相机视角正常渲染场景，将每个像素的光空间坐标与深度纹理进行 PCF 3×3 采样对比。 偏移 (bias) 用于消除阴影粉刺（shadow acne），过大会导致阴影悬浮（peter-panning）。 ",-1))])]))}}),vt=ke(ft,[["__scopeId","data-v-1b688f70"]]);export{vt as default};
