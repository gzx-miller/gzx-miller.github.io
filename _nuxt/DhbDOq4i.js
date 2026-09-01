import{d as H,k as j,U as q,b as K,e,f as x,M as N,K as B,L as S,r as E,aa as $,o as X,I as J}from"./DutfXOOr.js";const Q={class:"demo-card"},Z={class:"demo-layout"},tt={class:"canvas-wrap"},nt={class:"fps-badge"},ot={class:"drawcalls-badge"},et={class:"control-panel"},st={class:"mode-switch"},at={class:"control-item"},rt={class:"control-item"},it={class:"control-item"},lt={class:"perf-stats"},ct={class:"stat-row"},ut={class:"stat-row"},dt={class:"info-section"},ft={class:"comparison"},vt={class:"comp-item"},_t=`
attribute vec3 a_position;
attribute vec3 a_color;
attribute vec3 a_instance_pos;
attribute float a_instance_rot;
uniform mat4 u_proj;
uniform mat4 u_view;
varying vec3 v_color;
void main() {
  float c = cos(a_instance_rot);
  float s = sin(a_instance_rot);
  vec3 rotated = vec3(
    a_position.x * c - a_position.z * s,
    a_position.y,
    a_position.x * s + a_position.z * c
  );
  vec3 worldPos = rotated + a_instance_pos;
  v_color = a_color;
  gl_Position = u_proj * u_view * vec4(worldPos, 1.0);
}
`,G=`
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`,pt=`
attribute vec3 a_position;
attribute vec3 a_color;
uniform mat4 u_proj;
uniform mat4 u_view;
uniform vec3 u_offset;
uniform float u_rot;
varying vec3 v_color;
void main() {
  float c = cos(u_rot);
  float s = sin(u_rot);
  vec3 rotated = vec3(
    a_position.x * c - a_position.z * s,
    a_position.y,
    a_position.x * s + a_position.z * c
  );
  v_color = a_color;
  gl_Position = u_proj * u_view * vec4(rotated + u_offset, 1.0);
}
`,mt=H({__name:"W18Instancing",setup(At){const w=E(null),y=$(null),L=E(200),h=E(1),T=E(1),I=E(!0),C=E(0),F=E(0);function P(o,t,s){const n=o.createShader(t);return n?(o.shaderSource(n,s),o.compileShader(n),o.getShaderParameter(n,o.COMPILE_STATUS)?n:(console.error(o.getShaderInfoLog(n)),o.deleteShader(n),null)):null}function M(o,t,s){const n=P(o,o.VERTEX_SHADER,t),a=P(o,o.FRAGMENT_SHADER,s);if(!n||!a)return null;const i=o.createProgram();return i?(o.attachShader(i,n),o.attachShader(i,a),o.linkProgram(i),o.getProgramParameter(i,o.LINK_STATUS)?i:(console.error(o.getProgramInfoLog(i)),null)):null}function V(){const o=[],t=[],s=[];return[{n:[0,0,1],v:[[-.3,-.3,.3],[.3,-.3,.3],[.3,.3,.3],[-.3,.3,.3]],c:[.9,.5,.3]},{n:[0,0,-1],v:[[.3,-.3,-.3],[-.3,-.3,-.3],[-.3,.3,-.3],[.3,.3,-.3]],c:[.8,.4,.6]},{n:[1,0,0],v:[[.3,-.3,.3],[.3,-.3,-.3],[.3,.3,-.3],[.3,.3,.3]],c:[.7,.6,.2]},{n:[-1,0,0],v:[[-.3,-.3,-.3],[-.3,-.3,.3],[-.3,.3,.3],[-.3,.3,-.3]],c:[.5,.7,.3]},{n:[0,1,0],v:[[-.3,.3,.3],[.3,.3,.3],[.3,.3,-.3],[-.3,.3,-.3]],c:[.6,.3,.7]},{n:[0,-1,0],v:[[-.3,-.3,-.3],[.3,-.3,-.3],[.3,-.3,.3],[-.3,-.3,.3]],c:[.9,.7,.4]}].forEach(a=>{const i=o.length/3;a.v.forEach((l,A)=>{o.push(l[0],l[1],l[2]);const v=A%2===0?1:.85;t.push(a.c[0]*v,a.c[1]*v,a.c[2]*v)}),s.push(i,i+1,i+2,i,i+2,i+3)}),{positions:new Float32Array(o),colors:new Float32Array(t),indices:new Uint16Array(s),vertexCount:o.length/3,indexCount:s.length}}function U(o,t){const s=new Float32Array(o*16);for(let n=0;n<o;n++){const a=Math.floor(n/10),l=(n%10-5)*t+(Math.random()-.5)*.2,A=(a-Math.floor(o/10)/2)*t+(Math.random()-.5)*.2,v=(Math.random()-.5)*.5;s[n*16+0]=l,s[n*16+1]=v,s[n*16+2]=A,s[n*16+3]=Math.random()*Math.PI*2,s[n*16+4]=.6+Math.random()*.4,s[n*16+5]=.4+Math.random()*.4,s[n*16+6]=.3+Math.random()*.3}return s}function O(o,t,s,n){const a=1/Math.tan(o/2),i=1/(s-n);return new Float32Array([a/t,0,0,0,0,a,0,0,0,0,(n+s)*i,-1,0,0,2*n*s*i,0])}function z(o,t,s){const[n,a,i]=o,[l,A,v]=t;let u=n-l,_=a-A,p=i-v,b=Math.sqrt(u*u+_*_+p*p);u/=b,_/=b,p/=b;let c=s[1]*p-s[2]*_,r=s[2]*u-s[0]*p,d=s[0]*_-s[1]*u,m=Math.sqrt(c*c+r*r+d*d);m>0&&(c/=m,r/=m,d/=m);const f=_*d-p*r,R=p*c-u*d,g=u*r-_*c;return new Float32Array([c,f,u,0,r,R,_,0,d,g,p,0,-(c*n+r*a+d*i),-(f*n+R*a+g*i),-(u*n+_*a+p*i),1])}function D(o){const t=y.value;if(!t)return;const s=o-t.lastTime;t.lastTime=o,t.frameCount++,t.fpsTime+=s,t.fpsTime>=500&&(t.fps=Math.round(t.frameCount*1e3/t.fpsTime),t.frameCount=0,t.fpsTime=0,C.value=t.fps);const n=t.gl,a=w.value;n.viewport(0,0,a.width,a.height),n.clearColor(.09,.07,.05,1),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),n.enable(n.DEPTH_TEST);const i=a.width/a.height,l=O(Math.PI/4,i,.1,100),A=z([0,3,6],[0,0,0],[0,1,0]),v=t.geom,u=L.value,_=h.value,p=T.value,b=I.value;if(F.value=0,b){n.useProgram(t.progInst),n.bindBuffer(n.ARRAY_BUFFER,t.cubeVBO);const c=24,r=n.getAttribLocation(t.progInst,"a_position"),d=n.getAttribLocation(t.progInst,"a_color");n.enableVertexAttribArray(r),n.vertexAttribPointer(r,3,n.FLOAT,!1,c,0),n.enableVertexAttribArray(d),n.vertexAttribPointer(d,3,n.FLOAT,!1,c,12),n.bindBuffer(n.ARRAY_BUFFER,t.instVBO);const m=n.getAttribLocation(t.progInst,"a_instance_pos"),f=n.getAttribLocation(t.progInst,"a_instance_rot");if(m>=0){n.enableVertexAttribArray(m),n.vertexAttribPointer(m,3,n.FLOAT,!1,64,0);const g=n.getExtension("ANGLE_instanced_arrays");g&&g.vertexAttribDivisorANGLE(m,1)}if(f>=0){n.enableVertexAttribArray(f),n.vertexAttribPointer(f,1,n.FLOAT,!1,64,12);const g=n.getExtension("ANGLE_instanced_arrays");g&&g.vertexAttribDivisorANGLE(f,1)}n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.cubeIndex),n.uniformMatrix4fv(n.getUniformLocation(t.progInst,"u_proj"),!1,l),n.uniformMatrix4fv(n.getUniformLocation(t.progInst,"u_view"),!1,A);const R=n.getExtension("ANGLE_instanced_arrays");R?(R.drawElementsInstancedANGLE(n.TRIANGLES,v.indexCount,n.UNSIGNED_SHORT,0,u),F.value=1):(n.drawElements(n.TRIANGLES,v.indexCount,n.UNSIGNED_SHORT,0),F.value=1)}else{n.useProgram(t.progNonInst),n.bindBuffer(n.ARRAY_BUFFER,t.cubeVBO);const c=n.getAttribLocation(t.progNonInst,"a_position"),r=n.getAttribLocation(t.progNonInst,"a_color");n.enableVertexAttribArray(c),n.vertexAttribPointer(c,3,n.FLOAT,!1,24,0),n.enableVertexAttribArray(r),n.vertexAttribPointer(r,3,n.FLOAT,!1,24,12),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.cubeIndex),n.uniformMatrix4fv(n.getUniformLocation(t.progNonInst,"u_proj"),!1,l),n.uniformMatrix4fv(n.getUniformLocation(t.progNonInst,"u_view"),!1,A);const d=U(u,_),m=o*.001*p;for(let f=0;f<u;f++){const R=d[f*16+0],g=d[f*16+1]+Math.sin(m+f*.1)*.15,W=d[f*16+2],k=m+d[f*16+3];n.uniform3f(n.getUniformLocation(t.progNonInst,"u_offset"),R,g,W),n.uniform1f(n.getUniformLocation(t.progNonInst,"u_rot"),k),n.drawElements(n.TRIANGLES,v.indexCount,n.UNSIGNED_SHORT,0),F.value++}}Y.value&&(t.rafId=requestAnimationFrame(D))}const Y=E(!0);return j(()=>{const o=w.value;if(!o)return;const t=o.getContext("webgl",{antialias:!0});if(!t){console.error("WebGL not supported");return}t.getExtension("ANGLE_instanced_arrays")||console.warn("ANGLE_instanced_arrays not supported");const n=o.parentElement;o.width=Math.min(n.clientWidth,480),o.height=Math.min(n.clientWidth,480);const a=V(),i=24,l=new Float32Array(a.vertexCount*i/4);for(let r=0;r<a.vertexCount;r++)l[r*6+0]=a.positions[r*3+0],l[r*6+1]=a.positions[r*3+1],l[r*6+2]=a.positions[r*3+2],l[r*6+3]=a.colors[r*3+0],l[r*6+4]=a.colors[r*3+1],l[r*6+5]=a.colors[r*3+2];const A=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,A),t.bufferData(t.ARRAY_BUFFER,l,t.STATIC_DRAW);const v=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,v),t.bufferData(t.ELEMENT_ARRAY_BUFFER,a.indices,t.STATIC_DRAW);const u=U(L.value,h.value),_=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,_),t.bufferData(t.ARRAY_BUFFER,u,t.DYNAMIC_DRAW);const p=M(t,_t,G),b=M(t,pt,G);if(!p||!b)return;const c={gl:t,progInst:p,progNonInst:b,cubeVBO:A,cubeIndex:v,instVBO:_,rafId:0,lastTime:performance.now(),frameCount:0,fpsTime:0,fps:0,geom:a};y.value=c,c.rafId=requestAnimationFrame(D)}),q(()=>{const o=y.value;o&&(cancelAnimationFrame(o.rafId),o.gl.deleteProgram(o.progInst),o.gl.deleteProgram(o.progNonInst),o.gl.deleteBuffer(o.cubeVBO),o.gl.deleteBuffer(o.cubeIndex),o.gl.deleteBuffer(o.instVBO),o.gl.getExtension("WEBGL_lose_context")?.loseContext())}),(o,t)=>(X(),K("div",Q,[t[14]||(t[14]=e("h3",null,"🌰 实例化渲染 (Instanced Rendering)",-1)),t[15]||(t[15]=e("p",{class:"summary"},"数百个小立方体通过 Instancing 一次 draw call 绘制完成。对比传统逐个绘制方式的性能差距。",-1)),e("div",Z,[e("div",tt,[e("canvas",{ref_key:"canvasRef",ref:w},null,512),e("div",nt,x(C.value)+" FPS",1),e("div",ot,"Draw Calls: "+x(F.value),1)]),e("div",et,[t[12]||(t[12]=e("h4",null,"渲染模式",-1)),e("div",st,[e("button",{class:N({active:I.value}),onClick:t[0]||(t[0]=s=>I.value=!0)}," ✨ 实例化渲染 ",2),e("button",{class:N({active:!I.value}),onClick:t[1]||(t[1]=s=>I.value=!1)}," 🔄 逐个绘制 ",2)]),e("label",at,[e("span",null,"实例数量："+x(L.value),1),B(e("input",{type:"range",min:"10",max:"500",step:"10","onUpdate:modelValue":t[2]||(t[2]=s=>L.value=s)},null,512),[[S,L.value,void 0,{number:!0}]])]),e("label",rt,[e("span",null,"间距："+x(h.value.toFixed(1)),1),B(e("input",{type:"range",min:"0.3",max:"3.0",step:"0.1","onUpdate:modelValue":t[3]||(t[3]=s=>h.value=s)},null,512),[[S,h.value,void 0,{number:!0}]])]),e("label",it,[e("span",null,"旋转速度："+x(T.value.toFixed(1))+"x",1),B(e("input",{type:"range",min:"0",max:"3.0",step:"0.1","onUpdate:modelValue":t[4]||(t[4]=s=>T.value=s)},null,512),[[S,T.value,void 0,{number:!0}]])]),e("div",lt,[e("div",ct,[t[5]||(t[5]=e("span",null,"Draw Calls",-1)),e("strong",{class:N({highlight:I.value})},x(F.value),3)]),e("div",ut,[t[6]||(t[6]=e("span",null,"渲染模式",-1)),e("strong",null,x(I.value?"Instanced":"Non-Instanced"),1)])]),t[13]||(t[13]=e("div",{class:"code-display"},[e("h5",null,"Instancing 关键代码"),e("pre",null,[e("code",null,`// 实例属性设置
gl.vertexAttribPointer(
  instPosLoc, 3, gl.FLOAT,
  false, 64, 0
);
ext.vertexAttribDivisorANGLE(instPosLoc, 1);

// 一次绘制所有实例
ext.drawElementsInstancedANGLE(
  gl.TRIANGLES, indexCount,
  gl.UNSIGNED_SHORT, 0, count
);`)])],-1)),e("div",dt,[t[10]||(t[10]=e("h5",null,"📚 性能对比",-1)),e("div",ft,[t[8]||(t[8]=e("div",{class:"comp-item"},[e("strong",null,"实例化"),e("span",null,"1 次 Draw Call")],-1)),t[9]||(t[9]=e("div",{class:"vs"},"VS",-1)),e("div",vt,[t[7]||(t[7]=e("strong",null,"逐个绘制",-1)),e("span",null,x(L.value)+" 次 Draw Call",1)])]),t[11]||(t[11]=e("p",{class:"tip"},"切换渲染模式观察 FPS 和 Draw Call 的显著差异。",-1))])])])]))}}),bt=J(mt,[["__scopeId","data-v-81c2a45c"]]);export{bt as default};
