// ===== 顶点着色器 Vertex Shader =====
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
varying vec3 vNormalWorld;
void main() {
  vec4 worldPos = uModel * vec4(aPosition, 1.0);
  vNormalWorld = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjection * uView * worldPos;
}

// ===== 片段着色器 Fragment Shader（环境光 + 漫反射 Lambert） =====
precision mediump float;
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
}
