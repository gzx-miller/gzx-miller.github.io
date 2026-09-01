const n=`// ===== 顶点着色器 Vertex Shader =====
attribute vec3 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
uniform mat4 uMVP;
void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);
  vUV = aUV;
}

// ===== 片段着色器 Fragment Shader =====
precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;
uniform float uTileU;
uniform float uTileV;
uniform float uOffsetU;
uniform float uOffsetV;
uniform float uShowOverlay;
void main() {
  vec2 uv = vec2(vUV.x * uTileU + uOffsetU, vUV.y * uTileV + uOffsetV);
  vec4 texColor = texture2D(uTexture, uv);
  if (uShowOverlay > 0.5) {
    float gridU = abs(fract(vUV.x * 4.0) - 0.5);
    float gridV = abs(fract(vUV.y * 4.0) - 0.5);
    float grid = step(0.45, max(gridU, gridV));
    texColor.rgb = mix(texColor.rgb, vec3(1.0, 0.85, 0.3), grid * 0.5);
  }
  gl_FragColor = texColor;
}
`;export{n as default};
