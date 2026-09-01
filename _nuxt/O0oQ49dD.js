const o=`// ===== 顶点着色器 Vertex Shader =====
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform float uRotation;
void main() {
  float c = cos(uRotation);
  float s = sin(uRotation);
  vec2 rotated = vec2(
    aPosition.x * c - aPosition.y * s,
    aPosition.x * s + aPosition.y * c
  );
  gl_Position = vec4(rotated, 0.0, 1.0);
  vColor = aColor;
}

// ===== 片段着色器 Fragment Shader（插值版 Interpolated） =====
precision mediump float;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}

// ===== 片段着色器 Fragment Shader（平面版 Flat） =====
precision mediump float;
uniform vec3 uFlatColor;
void main() {
  gl_FragColor = vec4(uFlatColor, 1.0);
}
`;export{o as default};
