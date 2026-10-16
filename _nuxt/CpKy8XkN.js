const n=`// ===== 顶点着色器 Vertex Shader（WebGL 2 版，使用 UBO + layout location） =====
#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec3 a_color;

layout(std140) uniform SharedData {
  float u_time;
  vec2 u_resolution;
  float u_intensity;
};

out vec3 v_color;
out float v_depth;

void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  v_depth = pos.y * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}

// ===== 片段着色器 Fragment Shader（WebGL 2 版，使用 UBO + sampler3D） =====
#version 300 es
precision highp float;
in vec3 v_color;
in float v_depth;

layout(std140) uniform SharedData {
  float u_time;
  vec2 u_resolution;
  float u_intensity;
};

out vec4 fragColor;

uniform sampler3D u_lut;

void main() {
  vec3 lutCoord = vec3(v_depth, 0.5, 0.5);
  vec3 lutColor = texture(u_lut, lutCoord).rgb;
  vec3 finalColor = mix(v_color, lutColor, u_intensity);
  fragColor = vec4(finalColor, 1.0);
}

// ===== 顶点着色器 Vertex Shader（WebGL 1 对比版） =====
attribute vec2 a_position;
attribute vec3 a_color;
uniform float u_time;
uniform float u_intensity;
varying vec3 v_color;
varying float v_depth;
void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  v_depth = pos.y * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}

// ===== 片段着色器 Fragment Shader（WebGL 1 对比版） =====
precision mediump float;
varying vec3 v_color;
varying float v_depth;
uniform float u_intensity;
void main() {
  vec3 finalColor = mix(v_color, vec3(v_depth, v_depth * 0.8, 1.0 - v_depth), u_intensity);
  gl_FragColor = vec4(finalColor, 1.0);
}
`;export{n as default};
