// ===== 场景顶点着色器 Scene Vertex Shader =====
attribute vec2 a_position;
attribute vec3 a_color;
uniform float u_time;
varying vec3 v_color;
varying vec2 v_uv;

void main() {
  v_color = a_color;
  vec2 pos = a_position;
  float s = sin(u_time + pos.x * 3.0) * 0.15;
  float c = cos(u_time * 0.7 + pos.y * 2.0) * 0.1;
  pos += vec2(s, c);
  gl_Position = vec4(pos, 0.0, 1.0);
  v_uv = a_position * 0.5 + 0.5;
}

// ===== 场景片段着色器 Scene Fragment Shader =====
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}

// ===== 全屏后处理顶点着色器 Post Vertex Shader =====
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}

// ===== 全屏后处理片段着色器 Post Fragment Shader（Bloom / Blur / Grayscale） =====
precision mediump float;
uniform sampler2D u_scene;
uniform int u_effect;
uniform float u_intensity;
uniform float u_time;
varying vec2 v_uv;

void main() {
  vec4 color = texture2D(u_scene, v_uv);

  if (u_effect == 0) {
    vec3 gray = vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114)));
    gl_FragColor = vec4(mix(color.rgb, gray, u_intensity), 1.0);
  } else if (u_effect == 1) {
    vec3 bloomSum = vec3(0.0);
    float threshold = 0.8;
    if (length(color.rgb) > threshold) {
      bloomSum = color.rgb * u_intensity;
    }
    float s = sin(u_time) * 0.1 + 1.0;
    gl_FragColor = vec4(color.rgb + bloomSum * s, 1.0);
  } else if (u_effect == 2) {
    vec3 sum = vec3(0.0);
    float step = 0.004 * u_intensity;
    sum += texture2D(u_scene, v_uv + vec2(-step, -step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(-step, 0.0)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(-step, step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(0.0, -step)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv).rgb * 0.38774;
    sum += texture2D(u_scene, v_uv + vec2(0.0, step)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(step, -step)).rgb * 0.06136;
    sum += texture2D(u_scene, v_uv + vec2(step, 0.0)).rgb * 0.24477;
    sum += texture2D(u_scene, v_uv + vec2(step, step)).rgb * 0.06136;
    gl_FragColor = vec4(sum, 1.0);
  } else {
    gl_FragColor = color;
  }
}
