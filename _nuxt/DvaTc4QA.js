const o=`// ===== 顶点着色器 Vertex Shader =====
attribute vec3 aPosition;
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
}

// ===== 片段着色器 Fragment Shader（平滑着色版 Smooth） =====
precision mediump float;
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
}

// ===== 片段着色器 Fragment Shader（平面着色版 Flat） =====
precision mediump float;
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
}

// ===== 顶点着色器 Vertex Shader（法线可视化辅助） =====
attribute vec3 aPosition;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}

// ===== 片段着色器 Fragment Shader（法线可视化辅助） =====
precision mediump float;
void main() {
  gl_FragColor = vec4(0.96, 0.76, 0.36, 1.0);
}
`;export{o as default};
