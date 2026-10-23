const e=`// ===== 顶点着色器 Vertex Shader =====
attribute vec3 aPosition;
attribute vec2 aUV;
varying vec2 vUV;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUV = aUV;
}

// ===== 片段着色器 Fragment Shader =====
precision mediump float;
varying vec2 vUV;
uniform sampler2D uTexture;
uniform float uZoom;
uniform int uMipLevel;
uniform int uShowChain;
void main() {
  vec2 centered = (vUV - 0.5) / uZoom + 0.5;
  vec2 clamped = clamp(centered, 0.0, 1.0);
  if (uShowChain > 0 && uZoom > 1.2) {
    float mipFloat = float(uMipLevel);
    vec2 mipUV = vec2(clamped.x, clamped.y);
    gl_FragColor = texture2D(uTexture, mipUV);
    float levelIntensity = 0.15 + 0.05 * mipFloat;
    gl_FragColor.rgb += vec3(levelIntensity, levelIntensity * 0.5, 0.0);
  } else {
    gl_FragColor = texture2D(uTexture, clamped);
  }
}
`;export{e as default};
