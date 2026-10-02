const n=`// ===== 顶点着色器 Vertex Shader =====
attribute vec3 aPosition;
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
}

// ===== 片段着色器 Fragment Shader（Lambert 漫反射版） =====
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

// ===== 片段着色器 Fragment Shader（Phong 高光版） =====
precision mediump float;
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
}
`;export{n as default};
