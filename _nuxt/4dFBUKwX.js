import{d as Lo,k as wo,U as Fo,b as bo,e as r,M as oo,K as _,a2 as Po,v as No,f as U,L as D,r as x,g as Ro,aa as yo,o as Vo,I as _o}from"./DutfXOOr.js";const Uo={class:"demo-card"},Eo={class:"demo-layout"},Bo={class:"canvas-wrapper"},So={class:"control-panel"},Co={class:"control-group"},Do={class:"btn-group"},To={class:"control-group checkbox-group"},zo={class:"control-group"},Wo={class:"control-group"},Io={class:"control-group"},jo={class:"control-group"},Yo={class:"control-group"},ko={class:"info-section"},Ho={class:"info-text"},to=`attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
void main() {
  vec4 worldPos = uModel * vec4(aPosition, 1.0);
  vPositionWorld = worldPos.xyz;
  vNormalWorld = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjection * uView * worldPos;
}`,Go=`precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
uniform vec3 uMatColor;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vPositionWorld);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  vec3 ambient = uAmbient * uMatColor;
  vec3 diffuse = uMatColor * NdotL;
  vec3 specular = vec3(1.0) * pow(RdotV, 32.0) * 0.5;
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}`,Oo=`precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
uniform vec3 uMatColor;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vPositionWorld);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  vec3 ambient = uAmbient * uMatColor;
  vec3 diffuse = uMatColor * NdotL;
  vec3 specular = vec3(1.0) * pow(RdotV, 16.0) * 0.4;
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}`,$o=`attribute vec3 aPosition;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}`,Xo=`precision mediump float;
void main() {
  gl_FragColor = vec4(0.96, 0.76, 0.36, 1.0);
}`,Zo=Lo({__name:"W13Normals",setup(qo){const O=x(null),I=yo(null),j=x(!0),F=x("smooth"),T=x(45),z=x(45),E=x(1),B=x(1),S=x(1),Y=x(0),$=x(0);function eo(){const t=[],e=[],o=[],n=[{n:[0,0,1],verts:[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]},{n:[0,0,-1],verts:[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]]},{n:[1,0,0],verts:[[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]]},{n:[-1,0,0],verts:[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]},{n:[0,1,0],verts:[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]]},{n:[0,-1,0],verts:[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]}];let i=0;for(const u of n){for(const l of u.verts)t.push(l[0],l[1],l[2]),e.push(u.n[0],u.n[1],u.n[2]);o.push(i,i+1,i+2,i,i+2,i+3),i+=4}return{vertices:new Float32Array(t),normals:new Float32Array(e),indices:new Uint16Array(o)}}function so(){const t=[],e=[],o=[],n=[{n:[0,0,1],verts:[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]},{n:[0,0,-1],verts:[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]]},{n:[1,0,0],verts:[[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]]},{n:[-1,0,0],verts:[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]},{n:[0,1,0],verts:[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]]},{n:[0,-1,0],verts:[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]}];for(const i of n){for(let u=0;u<4;u++)t.push(i.verts[u][0],i.verts[u][1],i.verts[u][2]),e.push(i.n[0],i.n[1],i.n[2]);o.push(o.length,o.length+1,o.length+2,o.length,o.length+2,o.length+3)}return{vertices:new Float32Array(t),normals:new Float32Array(e),indices:new Uint16Array(o)}}function no(t,e,o){const a=[];for(let n=0;n<t.length;n+=3){const i=t[n],u=t[n+1],l=t[n+2],f=e[n],v=e[n+1],L=e[n+2];a.push(i,u,l),a.push(i+f*o,u+v*o,l+L*o)}return new Float32Array(a)}function ro(t,e,o,a){const n=1/Math.tan(t/2),i=1/(o-a);return new Float32Array([n/e,0,0,0,0,n,0,0,0,0,(a+o)*i,-1,0,0,2*a*o*i,0])}function ao(t,e,o){const[a,n,i]=t,[u,l,f]=e,[v,L,b]=o;let d=a-u,p=n-l,g=i-f,P=Math.hypot(d,p,g);d/=P,p/=P,g/=P;let h=L*g-b*p,A=b*d-v*g,M=v*p-L*d,m=Math.hypot(h,A,M);h/=m,A/=m,M/=m;const c=p*M-g*A,R=g*h-d*M,C=d*A-p*h;return new Float32Array([h,c,d,0,A,R,p,0,M,C,g,0,-(h*a+A*n+M*i),-(c*a+R*n+C*i),-(d*a+p*n+g*i),1])}function io(t){const e=Math.cos(t),o=Math.sin(t);return new Float32Array([e,0,-o,0,0,1,0,0,o,0,e,0,0,0,0,1])}function lo(t,e,o){return new Float32Array([t,0,0,0,0,e,0,0,0,0,o,0,0,0,0,1])}function uo(t,e){const o=new Float32Array(16);for(let a=0;a<4;a++)for(let n=0;n<4;n++)o[a*4+n]=t[a*4+0]*e[0+n]+t[a*4+1]*e[4+n]+t[a*4+2]*e[8+n]+t[a*4+3]*e[12+n];return o}function co(t){return new Float32Array([t[0],t[1],t[2],t[4],t[5],t[6],t[8],t[9],t[10]])}function fo(t){return new Float32Array([t[0],t[3],t[6],t[1],t[4],t[7],t[2],t[5],t[8]])}function vo(t){const e=t[0],o=t[1],a=t[2],n=t[3],i=t[4],u=t[5],l=t[6],f=t[7],v=t[8],L=i*v-u*f,b=-(n*v-u*l),d=n*f-i*l,p=-(o*v-a*f),g=e*v-a*l,P=-(e*f-o*l),h=o*u-a*i,A=-(e*u-a*n),M=e*i-o*n,m=e*L+o*b+a*d,c=m!==0?1/m:0;return new Float32Array([L*c,b*c,d*c,p*c,g*c,P*c,h*c,A*c,M*c])}function mo(){const t=O.value,e=t.getContext("webgl");if(!e){console.error("WebGL not supported");return}const o=e;I.value=o;const a=eo(),n=so(),i=no(a.vertices,a.normals,1.4);function u(s,N){const w=o.createShader(o.VERTEX_SHADER);o.shaderSource(w,s),o.compileShader(w);const y=o.createShader(o.FRAGMENT_SHADER);o.shaderSource(y,N),o.compileShader(y);const V=o.createProgram();return o.attachShader(V,w),o.attachShader(V,y),o.linkProgram(V),V}const l=u(to,Go),f=u(to,Oo),v=u($o,Xo),L=o.getAttribLocation(l,"aPosition"),b=o.getAttribLocation(l,"aNormal"),d=o.getAttribLocation(f,"aPosition"),p=o.getAttribLocation(f,"aNormal"),g=o.getAttribLocation(v,"aPosition"),P=o.createBuffer(),h=o.createBuffer(),A=o.createBuffer(),M=o.createBuffer(),m={uModel:o.getUniformLocation(l,"uModel"),uView:o.getUniformLocation(l,"uView"),uProj:o.getUniformLocation(l,"uProjection"),uNormMat:o.getUniformLocation(l,"uNormalMatrix"),uAmbient:o.getUniformLocation(l,"uAmbient"),uLightDir:o.getUniformLocation(l,"uLightDir"),uViewPos:o.getUniformLocation(l,"uViewPos"),uMatColor:o.getUniformLocation(l,"uMaterialColor")},c={uModel:o.getUniformLocation(f,"uModel"),uView:o.getUniformLocation(f,"uView"),uProj:o.getUniformLocation(f,"uProjection"),uNormMat:o.getUniformLocation(f,"uNormalMatrix"),uAmbient:o.getUniformLocation(f,"uAmbient"),uLightDir:o.getUniformLocation(f,"uLightDir"),uViewPos:o.getUniformLocation(f,"uViewPos"),uMatColor:o.getUniformLocation(f,"uMaterialColor")},R={uModel:o.getUniformLocation(v,"uModel"),uView:o.getUniformLocation(v,"uView"),uProj:o.getUniformLocation(v,"uProjection")};o.enable(o.DEPTH_TEST),o.clearColor(0,0,0,0);function C(s,N,w){return o.bindBuffer(o.ARRAY_BUFFER,P),o.bufferData(o.ARRAY_BUFFER,s.vertices,o.STATIC_DRAW),o.enableVertexAttribArray(N),o.vertexAttribPointer(N,3,o.FLOAT,!1,0,0),o.bindBuffer(o.ARRAY_BUFFER,h),o.bufferData(o.ARRAY_BUFFER,s.normals,o.STATIC_DRAW),o.enableVertexAttribArray(w),o.vertexAttribPointer(w,3,o.FLOAT,!1,0,0),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,A),o.bufferData(o.ELEMENT_ARRAY_BUFFER,s.indices,o.STATIC_DRAW),s.indices.length}function X(){if(!I.value)return;const s=I.value,N=window.devicePixelRatio||1,w=t.clientWidth*N,y=t.clientHeight*N;(t.width!==w||t.height!==y)&&(t.width=w,t.height=y),s.viewport(0,0,t.width,t.height),s.clear(s.COLOR_BUFFER_BIT|s.DEPTH_BUFFER_BIT);const V=t.width/t.height,k=ro(Math.PI/4,V,.1,100),H=ao([0,0,4],[0,0,0],[0,1,0]),Z=T.value*Math.PI/180,G=z.value*Math.PI/180,q=Math.sin(Z)*Math.cos(G),K=Math.sin(G),J=Math.cos(Z)*Math.cos(G),po=io($.value*.01),ho=lo(E.value,B.value,S.value),W=uo(po,ho),Q=vo(fo(co(W))),Ao=F.value==="smooth"?a:n,Mo=C(Ao,L,b);if(s.uniformMatrix4fv(m.uModel,!1,W),s.uniformMatrix4fv(m.uView,!1,H),s.uniformMatrix4fv(m.uProj,!1,k),s.uniformMatrix3fv(m.uNormMat,!1,Q),s.uniform3f(m.uAmbient,.25,.25,.25),s.uniform3f(m.uLightDir,q,K,J),s.uniform3f(m.uViewPos,0,0,4),s.uniform3f(m.uMatColor,.85,.52,.24),s.useProgram(F.value==="smooth"?l:f),F.value==="flat"){const xo=C(n,d,p);s.uniformMatrix4fv(c.uModel,!1,W),s.uniformMatrix4fv(c.uView,!1,H),s.uniformMatrix4fv(c.uProj,!1,k),s.uniformMatrix3fv(c.uNormMat,!1,Q),s.uniform3f(c.uAmbient,.25,.25,.25),s.uniform3f(c.uLightDir,q,K,J),s.uniform3f(c.uViewPos,0,0,4),s.uniform3f(c.uMatColor,.85,.52,.24),s.drawElements(s.TRIANGLES,xo,s.UNSIGNED_SHORT,0)}else s.drawElements(s.TRIANGLES,Mo,s.UNSIGNED_SHORT,0);j.value&&(s.useProgram(v),s.bindBuffer(s.ARRAY_BUFFER,M),s.bufferData(s.ARRAY_BUFFER,i,s.STATIC_DRAW),s.enableVertexAttribArray(g),s.vertexAttribPointer(g,3,s.FLOAT,!1,0,0),s.uniformMatrix4fv(R.uModel,!1,W),s.uniformMatrix4fv(R.uView,!1,H),s.uniformMatrix4fv(R.uProj,!1,k),s.drawArrays(s.LINES,0,i.length/3)),$.value+=.3,Y.value=requestAnimationFrame(X)}X()}wo(()=>{mo()}),Fo(()=>{Y.value&&cancelAnimationFrame(Y.value)});const go=Ro(()=>{const t=E.value,e=B.value,o=S.value,a=t!==e||e!==o;return`法线矩阵 = transpose(inverse(模型矩阵左上3×3))
当前缩放: (${t.toFixed(1)}, ${e.toFixed(1)}, ${o.toFixed(1)})
${a?"⚠️ 非等比缩放，法线矩阵 ≠ 模型矩阵旋转部分":"✓ 等比缩放，法线矩阵可简化"}
平滑着色: 顶点法线 = 相邻面法线的平均值
平面着色: 每个三角面使用相同的面法线`});return(t,e)=>(Vo(),bo("div",Uo,[e[13]||(e[13]=r("h3",null,"🌰 法线计算与光照方向",-1)),e[14]||(e[14]=r("p",{class:"summary"}," 展示顶点法线在光照计算中的作用。切换平滑/平面着色模式，观察法线插值如何影响光照效果，以及非等比缩放时法线矩阵的重要性。 ",-1)),r("div",Eo,[r("div",Bo,[r("canvas",{ref_key:"canvasRef",ref:O,class:"gl-canvas"},null,512),e[8]||(e[8]=r("div",{class:"glsl-snippet"},[r("strong",null,"法线矩阵关键代码："),r("pre",null,`normalMatrix = transpose(inverse(mat3(model)));
N_world = normalize(normalMatrix * N_local);
// 等比缩放时可简化为：
// N_world = normalize(mat3(model) * N_local);`)],-1))]),r("div",So,[r("div",Co,[e[9]||(e[9]=r("label",null,"着色模式:",-1)),r("div",Do,[r("button",{class:oo({active:F.value==="smooth"}),onClick:e[0]||(e[0]=o=>F.value="smooth")},"平滑着色",2),r("button",{class:oo({active:F.value==="flat"}),onClick:e[1]||(e[1]=o=>F.value="flat")},"平面着色",2)])]),r("div",To,[r("label",null,[_(r("input",{type:"checkbox","onUpdate:modelValue":e[2]||(e[2]=o=>j.value=o)},null,512),[[Po,j.value]]),e[10]||(e[10]=No(" 显示法线向量 ",-1))])]),r("div",zo,[r("label",null,"光源方位角: "+U(T.value)+"°",1),_(r("input",{type:"range",min:"0",max:"360",step:"1","onUpdate:modelValue":e[3]||(e[3]=o=>T.value=o)},null,512),[[D,T.value,void 0,{number:!0}]])]),r("div",Wo,[r("label",null,"光源仰角: "+U(z.value)+"°",1),_(r("input",{type:"range",min:"0",max:"90",step:"1","onUpdate:modelValue":e[4]||(e[4]=o=>z.value=o)},null,512),[[D,z.value,void 0,{number:!0}]])]),r("div",Io,[r("label",null,"X 缩放: "+U(E.value.toFixed(1)),1),_(r("input",{type:"range",min:"0.5",max:"2",step:"0.1","onUpdate:modelValue":e[5]||(e[5]=o=>E.value=o)},null,512),[[D,E.value,void 0,{number:!0}]])]),r("div",jo,[r("label",null,"Y 缩放: "+U(B.value.toFixed(1)),1),_(r("input",{type:"range",min:"0.5",max:"2",step:"0.1","onUpdate:modelValue":e[6]||(e[6]=o=>B.value=o)},null,512),[[D,B.value,void 0,{number:!0}]])]),r("div",Yo,[r("label",null,"Z 缩放: "+U(S.value.toFixed(1)),1),_(r("input",{type:"range",min:"0.5",max:"2",step:"0.1","onUpdate:modelValue":e[7]||(e[7]=o=>S.value=o)},null,512),[[D,S.value,void 0,{number:!0}]])])])]),r("div",ko,[e[11]||(e[11]=r("h4",null,"💡 法线矩阵与着色模式",-1)),r("pre",Ho,U(go.value),1),e[12]||(e[12]=r("p",{class:"info-note"}," 当模型存在非等比缩放时（X、Y、Z 缩放不同），简单用法线矩阵等于模型矩阵的旋转部分会导致法线方向错误。 正确做法是使用模型矩阵左上 3×3 子矩阵的逆转置矩阵。平滑着色通过法线插值实现渐变光照，平面着色每个三角面使用统一法线，产生硬边效果。 ",-1))])]))}}),Jo=_o(Zo,[["__scopeId","data-v-38d60491"]]);export{Jo as default};
