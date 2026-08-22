// ===== 顶点着色器 Vertex Shader =====
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform mat3 uMatrix;
void main() {
  vec3 transformed = uMatrix * vec3(aPosition, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
  vColor = aColor;
}

// ===== 片段着色器 Fragment Shader =====
precision mediump float;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
