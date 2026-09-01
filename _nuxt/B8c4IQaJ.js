const n=`// ===== 更新顶点着色器 Update Vertex Shader（GPGPU 全屏四边形） =====
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}

// ===== 更新片段着色器 Update Fragment Shader（粒子物理更新，写入 Ping-Pong 纹理） =====
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_posTex;
uniform float u_time;
uniform float u_force;
uniform vec2 u_forceCenter;
void main() {
  vec4 posData = texture2D(u_posTex, v_uv);
  vec2 pos = posData.xy;
  vec2 vel = posData.zw;

  vec2 toCenter = u_forceCenter - pos;
  float dist = length(toCenter);
  float force = u_force * 0.5;
  if (dist > 0.01) {
    vel += normalize(toCenter) * force / max(dist, 0.1) * 0.02;
  }

  vel *= 0.98;
  pos += vel * 0.01;

  pos = fract(pos + 1.0);

  gl_FragColor = vec4(pos, vel);
}

// ===== 渲染顶点着色器 Render Vertex Shader（读取纹理位置绘制点精灵） =====
attribute float a_index;
uniform sampler2D u_posTex;
uniform float u_texSize;
uniform float u_particleSize;
void main() {
  float x = mod(a_index, u_texSize) / u_texSize;
  float y = floor(a_index / u_texSize) / u_texSize;
  vec2 uv = vec2(x, y);
  vec4 posData = texture2D(u_posTex, uv);
  vec2 pos = posData.xy * 2.0 - 1.0;
  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = u_particleSize * (1.0 + 0.5 * sin(a_index * 0.1));
}

// ===== 渲染片段着色器 Render Fragment Shader（点精灵着色） =====
precision mediump float;
uniform float u_time;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float alpha = 1.0 - d * 2.0;
  float hue = 0.08 + 0.06 * sin(u_time + gl_FragCoord.x * 0.01);
  vec3 col = mix(vec3(0.95, 0.55, 0.2), vec3(0.6, 0.85, 0.35), hue);
  gl_FragColor = vec4(col, alpha);
}
`;export{n as default};
