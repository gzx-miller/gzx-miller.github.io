const o=`// ===== 顶点着色器 Vertex Shader =====
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform float uTime;
void main() {
  vec2 pos = aPosition;
  pos.x += sin(uTime + aPosition.y * 3.0) * 0.05;
  pos.y += cos(uTime + aPosition.x * 3.0) * 0.05;
  gl_Position = vec4(pos, 0.0, 1.0);
  vColor = aColor;
}

// ===== 片段着色器 Fragment Shader =====
precision mediump float;
varying vec3 vColor;
uniform float uTime;
uniform float uUseAttributeColor;
void main() {
  vec3 attrColor = vColor;
  vec3 dynamicColor = vec3(
    0.5 + 0.5 * sin(uTime * 0.7 + vColor.r * 6.28),
    0.5 + 0.5 * sin(uTime * 0.5 + vColor.g * 6.28 + 2.09),
    0.5 + 0.5 * sin(uTime * 0.3 + vColor.b * 6.28 + 4.18)
  );
  vec3 finalColor = mix(dynamicColor, attrColor, uUseAttributeColor);
  gl_FragColor = vec4(finalColor, 1.0);
}
`;export{o as default};
