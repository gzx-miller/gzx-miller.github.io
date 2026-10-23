const n=`// ===== 场景顶点着色器 Scene Vertex Shader =====
attribute vec3 aPosition;
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
}

// ===== 场景片段着色器 Scene Fragment Shader =====
precision mediump float;
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
}

// ===== 全屏四边形顶点着色器 Quad Vertex Shader =====
attribute vec2 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  vUV = aUV;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}

// ===== 全屏四边形片段着色器 Quad Fragment Shader（原样 Base） =====
precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  gl_FragColor = texture2D(uScene, vUV);
}

// ===== 全屏四边形片段着色器 Quad Fragment Shader（反相 Invert） =====
precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  gl_FragColor = vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a);
}

// ===== 全屏四边形片段着色器 Quad Fragment Shader（灰度 Grayscale） =====
precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(vec3(g), c.a);
}

// ===== 全屏四边形片段着色器 Quad Fragment Shader（棕褐 Sepia） =====
precision mediump float;
varying vec2 vUV;
uniform sampler2D uScene;
void main() {
  vec4 c = texture2D(uScene, vUV);
  float r = dot(c.rgb, vec3(0.393, 0.769, 0.189));
  float g = dot(c.rgb, vec3(0.349, 0.686, 0.168));
  float b = dot(c.rgb, vec3(0.272, 0.534, 0.131));
  gl_FragColor = vec4(r, g, b, c.a);
}
`;export{n as default};
