// ===== 顶点着色器 Vertex Shader =====
attribute vec3 aPosition;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}

// ===== 片段着色器 Fragment Shader =====
precision mediump float;
uniform vec3 uColor;
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}
