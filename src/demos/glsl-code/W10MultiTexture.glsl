// ===== 顶点着色器 Vertex Shader =====
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
uniform sampler2D uBaseTex;
uniform sampler2D uOverlayTex;
uniform float uBlendFactor;
uniform int uBlendMode;
void main() {
  vec4 baseColor = texture2D(uBaseTex, vUV);
  vec4 overlayColor = texture2D(uOverlayTex, vUV);

  if (uBlendMode == 0) {
    gl_FragColor = mix(baseColor, overlayColor, uBlendFactor);
  } else if (uBlendMode == 1) {
    gl_FragColor = baseColor + overlayColor * uBlendFactor;
  } else if (uBlendMode == 2) {
    gl_FragColor = baseColor * mix(1.0, overlayColor.rgb, uBlendFactor);
  } else {
    gl_FragColor = vec4(
      mix(baseColor.r, overlayColor.r, uBlendFactor * overlayColor.a),
      mix(baseColor.g, overlayColor.g, uBlendFactor * overlayColor.a),
      mix(baseColor.b, overlayColor.b, uBlendFactor * overlayColor.a),
      baseColor.a
    );
  }
}
