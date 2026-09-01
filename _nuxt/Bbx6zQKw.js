import{d as Y,i as q,k as H,U as K,b as C,e as a,v as d,f as L,K as I,L as y,M as P,a2 as $,F as Q,E as j,r as R,aa as w,g as J,o as g,z as ee,I as te}from"./DutfXOOr.js";const ae={class:"demo-card"},re={class:"layout"},ne={class:"canvas-wrap"},oe={class:"controls"},le={class:"btn-group"},ie={class:"toggle"},ue={class:"info-section"},se={class:"info-block"},Ee={class:"mini-code"},de={class:"info-block"},Te={class:"mipmap-chain"},ve=`
attribute vec3 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUV = aUV;
}`,ce=`
precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;
uniform float uZoom;
uniform int uMipLevel;
uniform int uShowChain;
void main() {
  vec2 centered = (vUV - 0.5) / uZoom + 0.5;
  vec2 clamped = clamp(centered, 0.0, 1.0);
  if (uShowChain > 0 && uZoom > 1.2) {
    float mipFloat = float(uMipLevel);
    vec2 mipUV = vec2(clamped.x, clamped.y);
    gl_FragColor = texture2D(uTexture, mipUV);
    float levelIntensity = 0.15 + 0.05 * mipFloat;
    gl_FragColor.rgb += vec3(levelIntensity, levelIntensity * 0.5, 0.0);
  } else {
    gl_FragColor = texture2D(uTexture, clamped);
  }
}`,me=Y({__name:"W09TextureFilter",setup(Re){const u=R(null),V=w(null),f=w(0),p=R(1.5),s=R("NEAREST"),T=R(0),U=R(!0),B=J(()=>`// 过滤模式对比
// NEAREST: 取最近像素，像素质感
// gl_FragColor = texelFetch(sampler, ivec2(uv * size), 0);

// LINEAR: 双线性插值，平滑
gl_FragColor = texture2D(sampler, uv);

// Mipmap 自动选层 (GPU 根据屏幕纹理尺寸)`);function G(){return new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,-1,0,0,0,1,1,0,1,1,-1,1,0,0,1])}function k(t,r){const n=t.createTexture();if(!n)return null;t.bindTexture(t.TEXTURE_2D,n);const l=Math.log2(r)+1;for(let c=0;c<l;c++){const i=r/Math.pow(2,c),m=new Uint8Array(i*i*4);for(let A=0;A<i;A++)for(let _=0;_<i;_++){const x=(A*i+_)*4,W=_/i,Z=A/i;m[x]=Math.floor(255*W),m[x+1]=Math.floor(255*Z),m[x+2]=Math.floor(180+75*Math.sin(c*.7)),m[x+3]=255}t.texImage2D(t.TEXTURE_2D,c,t.RGBA,i,i,0,t.RGBA,t.UNSIGNED_BYTE,m)}return t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),s.value==="NEAREST"?(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST_MIPMAP_NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST)):(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR)),n}function N(t,r,n){const l=t.createShader(r);return l?(t.shaderSource(l,n),t.compileShader(l),t.getShaderParameter(l,t.COMPILE_STATUS)?l:(console.error("Shader error:",t.getShaderInfoLog(l)),t.deleteShader(l),null)):null}let e=null,o=null,S=-1,M=-1,F=null,h=null,b=null,D=null,v=null,E=null;function O(){!e||!E||(e.bindTexture(e.TEXTURE_2D,E),s.value==="NEAREST"?(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST_MIPMAP_NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST)):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR)))}q(s,()=>O());function X(){!e||!o||(e.viewport(0,0,e.canvas.width,e.canvas.height),e.clearColor(.12,.09,.06,1),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(o),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,E),e.uniform1i(F,0),e.uniform1f(h,p.value),e.uniform1i(b,T.value),e.uniform1i(D,U.value?1:0),e.bindBuffer(e.ARRAY_BUFFER,v),e.enableVertexAttribArray(S),e.vertexAttribPointer(S,3,e.FLOAT,!1,20,0),e.enableVertexAttribArray(M),e.vertexAttribPointer(M,2,e.FLOAT,!1,20,12),e.drawArrays(e.TRIANGLES,0,6),f.value=requestAnimationFrame(X))}function z(){if(!u.value||!e)return;const t=u.value.getBoundingClientRect(),r=window.devicePixelRatio||1;u.value.width=t.width*r,u.value.height=t.height*r}return H(()=>{if(!u.value)return;if(e=u.value.getContext("webgl"),V.value=e,!e){console.error("WebGL not supported");return}const t=N(e,e.VERTEX_SHADER,ve),r=N(e,e.FRAGMENT_SHADER,ce);!t||!r||(o=e.createProgram(),o&&(e.attachShader(o,t),e.attachShader(o,r),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)&&(S=e.getAttribLocation(o,"aPosition"),M=e.getAttribLocation(o,"aUV"),F=e.getUniformLocation(o,"uTexture"),h=e.getUniformLocation(o,"uZoom"),b=e.getUniformLocation(o,"uMipLevel"),D=e.getUniformLocation(o,"uShowChain"),v=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,G(),e.STATIC_DRAW),E=k(e,256),z(),f.value=requestAnimationFrame(X))))}),K(()=>{f.value&&cancelAnimationFrame(f.value),e&&o&&e.deleteProgram(o),e&&v&&e.deleteBuffer(v),e&&E&&e.deleteTexture(E)}),(t,r)=>(g(),C("div",ae,[r[12]||(r[12]=a("h3",null,"纹理过滤与 Mipmap",-1)),a("div",re,[a("div",ne,[a("canvas",{ref_key:"canvasRef",ref:u,class:"gl-canvas"},null,512)]),a("div",oe,[a("fieldset",null,[r[5]||(r[5]=a("legend",null,"缩放控制",-1)),a("label",null,[d("缩放："+L(p.value.toFixed(2))+"x ",1),I(a("input",{type:"range",min:"0.5",max:"6",step:"0.05","onUpdate:modelValue":r[0]||(r[0]=n=>p.value=n)},null,512),[[y,p.value,void 0,{number:!0}]])]),r[6]||(r[6]=a("p",{class:"hint"},"放大查看像素级过滤差异",-1))]),a("fieldset",null,[r[7]||(r[7]=a("legend",null,"过滤模式",-1)),a("div",le,[a("button",{class:P({active:s.value==="NEAREST"}),onClick:r[1]||(r[1]=n=>s.value="NEAREST")},"NEAREST",2),a("button",{class:P({active:s.value==="LINEAR"}),onClick:r[2]||(r[2]=n=>s.value="LINEAR")},"LINEAR",2)])]),a("fieldset",null,[r[9]||(r[9]=a("legend",null,"Mipmap",-1)),a("label",null,[d("手动层级："+L(T.value)+" ",1),I(a("input",{type:"range",min:"0",max:"8",step:"1","onUpdate:modelValue":r[3]||(r[3]=n=>T.value=n)},null,512),[[y,T.value,void 0,{number:!0}]])]),a("label",ie,[I(a("input",{type:"checkbox","onUpdate:modelValue":r[4]||(r[4]=n=>U.value=n)},null,512),[[$,U.value]]),r[8]||(r[8]=d(" 高亮 Mipmap 链 ",-1))])])])]),a("div",ue,[a("div",se,[r[10]||(r[10]=a("h4",null,"🎓 GLSL 核心代码",-1)),a("pre",Ee,L(B.value),1)]),a("div",de,[r[11]||(r[11]=a("h4",null,"📊 Mipmap 链",-1)),a("div",Te,[(g(),C(Q,null,j(6,n=>a("div",{key:n,class:P(["mip-level",{active:T.value>=n-1}]),style:ee({width:100-(n-1)*16+"%"})},[a("span",null,"Level "+L(n-1),1)],6)),64))])])]),r[13]||(r[13]=a("div",{class:"tips-box"},[a("p",null,[a("strong",null,"💡 核心概念：")]),a("ul",null,[a("li",null,[a("code",null,"NEAREST"),d("：取最近像素，像素质感，性能高")]),a("li",null,[a("code",null,"LINEAR"),d("：双线性插值，边缘平滑")]),a("li",null,"Mipmap 是预计算的缩小版本，纹理缩小时自动选用"),a("li",null,[a("code",null,"LINEAR_MIPMAP_LINEAR"),d("：三线性过滤，质量最佳")])])],-1))]))}}),pe=te(me,[["__scopeId","data-v-8dd5a399"]]);export{pe as default};
