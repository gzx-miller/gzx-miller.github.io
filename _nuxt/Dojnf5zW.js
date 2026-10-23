const o=`// ===== 深度渲染顶点着色器 Depth Vertex Shader（Pass 1 光源视角） =====
attribute vec3 aPosition;
uniform mat4 uLightMVP;
void main() {
  gl_Position = uLightMVP * vec4(aPosition, 1.0);
}

// ===== 深度渲染片段着色器 Depth Fragment Shader（Pass 1） =====
precision mediump float;
void main() {
  gl_FragColor = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1.0);
}

// ===== 场景顶点着色器 Scene Vertex Shader（Pass 2 相机视角） =====
attribute vec3 aPosition;
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
}

// ===== 场景片段着色器 Scene Fragment Shader（Pass 2 阴影计算） =====
precision mediump float;
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
}

// ===== Shadow Map 可视化顶点着色器 Shadow Map Visual Vertex Shader =====
attribute vec2 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  vUV = aUV;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}

// ===== Shadow Map 可视化片段着色器 Shadow Map Visual Fragment Shader =====
precision mediump float;
varying vec2 vUV;
uniform sampler2D uShadowMap;
void main() {
  float depth = texture2D(uShadowMap, vUV).r;
  float gray = depth;
  gl_FragColor = vec4(gray, gray, gray, 1.0);
}
`;export{o as default};
