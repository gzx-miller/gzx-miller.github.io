// ===== 顶点着色器 Vertex Shader =====
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}

// ===== 片段着色器 Fragment Shader =====
precision mediump float;
uniform vec4 uColor;
void main() {
  gl_FragColor = uColor;
}
