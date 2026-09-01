import{d as ho,k as po,U as go,b as Z,e as i,A as ao,f as S,K as y,L as U,a2 as Mo,v as bo,r as b,g as Lo,aa as Po,o as oo,I as Ro}from"./DutfXOOr.js";const Ao={class:"demo-card"},xo={class:"demo-layout"},_o={class:"canvas-wrapper"},yo={class:"canvas-labels"},Fo={key:0,class:"label-left"},No={key:1,class:"label-right"},wo={class:"control-panel"},Eo={class:"control-group"},So={class:"control-group"},Uo={class:"control-group"},To={class:"control-group"},Io={class:"control-group"},Vo={class:"control-group"},Bo={class:"control-group checkbox-group"},Co={class:"info-section"},Do={class:"info-text"},so=`attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
varying vec3 vWorldPos;
varying vec3 vNormalWorld;
void main() {
  vec4 worldPos = uModel * vec4(aPosition, 1.0);
  vWorldPos = worldPos.xyz;
  vNormalWorld = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjection * uView * worldPos;
}`,zo=`precision mediump float;
varying vec3 vNormalWorld;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uMaterialColor;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  float NdotL = max(dot(N, L), 0.0);
  vec3 ambient = uAmbient * uMaterialColor;
  vec3 diffuse = uMaterialColor * NdotL;
  gl_FragColor = vec4(ambient + diffuse, 1.0);
}`,Wo=`precision mediump float;
varying vec3 vNormalWorld;
varying vec3 vWorldPos;
uniform vec3 uAmbient;
uniform vec3 uLightDir;
uniform vec3 uViewPos;
uniform vec3 uMaterialColor;
uniform float uShininess;
uniform float uSpecIntensity;
void main() {
  vec3 N = normalize(vNormalWorld);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uViewPos - vWorldPos);
  vec3 R = reflect(-L, N);
  float NdotL = max(dot(N, L), 0.0);
  float RdotV = max(dot(R, V), 0.0);
  vec3 ambient = uAmbient * uMaterialColor;
  vec3 diffuse = uMaterialColor * NdotL;
  vec3 specular = vec3(1.0, 1.0, 1.0) * uSpecIntensity * pow(RdotV, uShininess);
  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}`,Oo=ho({__name:"W12Phong",setup(ko){const to=b(null),O=Po(null),F=b(32),N=b(.8),C=b(0),D=b(45),z=b(45),k=b("#d94b26"),T=b(!0),H=b(0),eo=b(0);function lo(n,e,o){const u=[],f=[],s=[];for(let a=0;a<=n;a++){const g=a*Math.PI/n,d=Math.sin(g),h=Math.cos(g);for(let L=0;L<=e;L++){const _=L*2*Math.PI/e,m=Math.sin(_),l=Math.cos(_)*d,r=h,p=m*d;f.push(l,r,p),u.push(o*l,o*r,o*p)}}for(let a=0;a<n;a++)for(let g=0;g<e;g++){const d=a*(e+1)+g,h=d+e+1;s.push(d,h,d+1),s.push(h,h+1,d+1)}return{vertices:new Float32Array(u),normals:new Float32Array(f),indices:new Uint16Array(s)}}function uo(n,e,o,u){const f=1/Math.tan(n/2),s=1/(o-u);return new Float32Array([f/e,0,0,0,0,f,0,0,0,0,(u+o)*s,-1,0,0,2*u*o*s,0])}function j(n,e,o){const[u,f,s]=n,[a,g,d]=e,[h,L,_]=o;let m=u-a,v=f-g,l=s-d,r=Math.hypot(m,v,l);m/=r,v/=r,l/=r;let p=L*l-_*v,M=_*m-h*l,P=h*v-L*m,t=Math.hypot(p,M,P);p/=t,M/=t,P/=t;const c=v*P-l*M,R=l*p-m*P,A=m*M-v*p;return new Float32Array([p,c,m,0,M,R,v,0,P,A,l,0,-(p*u+M*f+P*s),-(c*u+R*f+A*s),-(m*u+v*f+l*s),1])}function Y(n){const e=Math.cos(n),o=Math.sin(n);return new Float32Array([e,0,-o,0,0,1,0,0,o,0,e,0,0,0,0,1])}function G(n){return new Float32Array([n[0],n[1],n[2],n[4],n[5],n[6],n[8],n[9],n[10]])}function co(){const n=to.value,e=n.getContext("webgl");if(!e){console.error("WebGL not supported");return}const o=e;O.value=o;const u=lo(40,40,1);function f(t,c){const R=o.createShader(o.VERTEX_SHADER);o.shaderSource(R,t),o.compileShader(R);const A=o.createShader(o.FRAGMENT_SHADER);o.shaderSource(A,c),o.compileShader(A);const w=o.createProgram();return o.attachShader(w,R),o.attachShader(w,A),o.linkProgram(w),w}const s=f(so,zo),a=f(so,Wo),g=o.getAttribLocation(s,"aPosition"),d=o.getAttribLocation(s,"aNormal"),h=o.getAttribLocation(a,"aPosition"),L=o.getAttribLocation(a,"aNormal"),_=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,_),o.bufferData(o.ARRAY_BUFFER,u.vertices,o.STATIC_DRAW);const m=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,m),o.bufferData(o.ARRAY_BUFFER,u.normals,o.STATIC_DRAW);const v=o.createBuffer();o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,v),o.bufferData(o.ELEMENT_ARRAY_BUFFER,u.indices,o.STATIC_DRAW);const l={uModel:o.getUniformLocation(s,"uModel"),uView:o.getUniformLocation(s,"uView"),uProj:o.getUniformLocation(s,"uProjection"),uNormMat:o.getUniformLocation(s,"uNormalMatrix"),uAmbient:o.getUniformLocation(s,"uAmbient"),uLightDir:o.getUniformLocation(s,"uLightDir"),uMatColor:o.getUniformLocation(s,"uMaterialColor")},r={uModel:o.getUniformLocation(a,"uModel"),uView:o.getUniformLocation(a,"uView"),uProj:o.getUniformLocation(a,"uProjection"),uNormMat:o.getUniformLocation(a,"uNormalMatrix"),uAmbient:o.getUniformLocation(a,"uAmbient"),uLightDir:o.getUniformLocation(a,"uLightDir"),uViewPos:o.getUniformLocation(a,"uViewPos"),uMatColor:o.getUniformLocation(a,"uMaterialColor"),uShininess:o.getUniformLocation(a,"uShininess"),uSpecIntensity:o.getUniformLocation(a,"uSpecIntensity")};o.enable(o.DEPTH_TEST),o.clearColor(0,0,0,0);const p=t=>{const c=t.replace("#","");return[parseInt(c.slice(0,2),16)/255,parseInt(c.slice(2,4),16)/255,parseInt(c.slice(4,6),16)/255]};function M(t,c){o.bindBuffer(o.ARRAY_BUFFER,_),o.enableVertexAttribArray(t),o.vertexAttribPointer(t,3,o.FLOAT,!1,0,0),o.bindBuffer(o.ARRAY_BUFFER,m),o.enableVertexAttribArray(c),o.vertexAttribPointer(c,3,o.FLOAT,!1,0,0),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,v)}function P(){if(!O.value)return;const t=O.value,c=window.devicePixelRatio||1,R=n.clientWidth*c,A=n.clientHeight*c;(n.width!==R||n.height!==A)&&(n.width=R,n.height=A),t.viewport(0,0,n.width,n.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);const w=n.width/n.height,$=uo(Math.PI/4,w,.1,100),no=D.value*Math.PI/180,q=z.value*Math.PI/180,K=Math.sin(no)*Math.cos(q),X=Math.sin(q),J=Math.cos(no)*Math.cos(q),io=C.value*Math.PI/180,I=Math.sin(io)*3,V=0,B=Math.cos(io)*3,x=p(k.value),Q=eo.value*.008;if(T.value){t.enable(t.SCISSOR_TEST);const E=n.width/2;t.scissor(0,0,E,n.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.useProgram(s),M(g,d);const W=Y(Q),mo=G(W);t.uniformMatrix4fv(l.uModel,!1,W),t.uniformMatrix4fv(l.uView,!1,j([I,V,B],[0,0,0],[0,1,0])),t.uniformMatrix4fv(l.uProj,!1,$),t.uniformMatrix3fv(l.uNormMat,!1,mo),t.uniform3f(l.uAmbient,.2,.2,.2),t.uniform3f(l.uLightDir,K,X,J),t.uniform3f(l.uMatColor,x[0],x[1],x[2]),t.drawElements(t.TRIANGLES,u.indices.length,t.UNSIGNED_SHORT,0),t.scissor(E,0,E,n.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.useProgram(a),M(h,L);const ro=Y(Q),vo=G(ro);t.uniformMatrix4fv(r.uModel,!1,ro),t.uniformMatrix4fv(r.uView,!1,j([I,V,B],[0,0,0],[0,1,0])),t.uniformMatrix4fv(r.uProj,!1,$),t.uniformMatrix3fv(r.uNormMat,!1,vo),t.uniform3f(r.uAmbient,.2,.2,.2),t.uniform3f(r.uLightDir,K,X,J),t.uniform3f(r.uViewPos,I,V,B),t.uniform3f(r.uMatColor,x[0],x[1],x[2]),t.uniform1f(r.uShininess,F.value),t.uniform1f(r.uSpecIntensity,N.value),t.drawElements(t.TRIANGLES,u.indices.length,t.UNSIGNED_SHORT,0),t.disable(t.SCISSOR_TEST)}else{t.useProgram(a),M(h,L);const E=Y(Q),W=G(E);t.uniformMatrix4fv(r.uModel,!1,E),t.uniformMatrix4fv(r.uView,!1,j([I,V,B],[0,0,0],[0,1,0])),t.uniformMatrix4fv(r.uProj,!1,$),t.uniformMatrix3fv(r.uNormMat,!1,W),t.uniform3f(r.uAmbient,.2,.2,.2),t.uniform3f(r.uLightDir,K,X,J),t.uniform3f(r.uViewPos,I,V,B),t.uniform3f(r.uMatColor,x[0],x[1],x[2]),t.uniform1f(r.uShininess,F.value),t.uniform1f(r.uSpecIntensity,N.value),t.drawElements(t.TRIANGLES,u.indices.length,t.UNSIGNED_SHORT,0)}eo.value+=.5,H.value=requestAnimationFrame(P)}P()}po(()=>{co()}),go(()=>{H.value&&cancelAnimationFrame(H.value)});const fo=Lo(()=>`反射向量 R = reflect(-L, N)
高光强度 = pow(max(R·V, 0), shininess)
最终颜色 = ambient + diffuse + specular
shininess = ${F.value}  (值越大高光越集中)
specIntensity = ${N.value.toFixed(2)}`);return(n,e)=>(oo(),Z("div",Ao,[e[12]||(e[12]=i("h3",null,"🌰 镜面高光与 Phong 光照",-1)),e[13]||(e[13]=i("p",{class:"summary"}," 展示环境光 + 漫反射 + 镜面高光的完整 Phong 光照模型。左侧为 Lambert 模型（仅环境光+漫反射），右侧为 Phong 模型（多了镜面高光）。 ",-1)),i("div",xo,[i("div",_o,[i("canvas",{ref_key:"canvasRef",ref:to,class:"gl-canvas"},null,512),i("div",yo,[T.value?(oo(),Z("span",Fo,"Lambert")):ao("",!0),T.value?(oo(),Z("span",No,"Phong")):ao("",!0)]),e[7]||(e[7]=i("div",{class:"glsl-snippet"},[i("strong",null,"Phong 关键代码："),i("pre",null,`R = reflect(-L, N);
spec = pow(max(dot(R, V), 0), shininess);
color = ambient + diffuse + spec * specIntensity;`)],-1))]),i("div",wo,[i("div",Eo,[i("label",null,"高光范围 (shininess): "+S(F.value),1),y(i("input",{type:"range",min:"1",max:"128",step:"1","onUpdate:modelValue":e[0]||(e[0]=o=>F.value=o)},null,512),[[U,F.value,void 0,{number:!0}]])]),i("div",So,[i("label",null,"高光强度: "+S(N.value.toFixed(2)),1),y(i("input",{type:"range",min:"0",max:"2",step:"0.01","onUpdate:modelValue":e[1]||(e[1]=o=>N.value=o)},null,512),[[U,N.value,void 0,{number:!0}]])]),i("div",Uo,[i("label",null,"光源方位角: "+S(D.value)+"°",1),y(i("input",{type:"range",min:"0",max:"360",step:"1","onUpdate:modelValue":e[2]||(e[2]=o=>D.value=o)},null,512),[[U,D.value,void 0,{number:!0}]])]),i("div",To,[i("label",null,"光源仰角: "+S(z.value)+"°",1),y(i("input",{type:"range",min:"0",max:"90",step:"1","onUpdate:modelValue":e[3]||(e[3]=o=>z.value=o)},null,512),[[U,z.value,void 0,{number:!0}]])]),i("div",Io,[i("label",null,"观察方向: "+S(C.value)+"°",1),y(i("input",{type:"range",min:"-60",max:"60",step:"1","onUpdate:modelValue":e[4]||(e[4]=o=>C.value=o)},null,512),[[U,C.value,void 0,{number:!0}]])]),i("div",Vo,[e[8]||(e[8]=i("label",null,"材质颜色:",-1)),y(i("input",{type:"color","onUpdate:modelValue":e[5]||(e[5]=o=>k.value=o)},null,512),[[U,k.value]])]),i("div",Bo,[i("label",null,[y(i("input",{type:"checkbox","onUpdate:modelValue":e[6]||(e[6]=o=>T.value=o)},null,512),[[Mo,T.value]]),e[9]||(e[9]=bo(" 左右对比（Lambert vs Phong） ",-1))])])])]),i("div",Co,[e[10]||(e[10]=i("h4",null,"💡 Phong 公式分析",-1)),i("pre",Do,S(fo.value),1),e[11]||(e[11]=i("p",{class:"info-note"}," Phong 模型通过计算反射向量 R 与视线 V 的点积来模拟镜面高光。shininess 值越大，高光越集中在镜面反射方向附近； 值越小高光越分散。实际工程中常用 Blinn-Phong 模型（使用半向量 H = L + V），性能更好且效果相近。 ",-1))])]))}}),jo=Ro(Oo,[["__scopeId","data-v-eb8c4386"]]);export{jo as default};
