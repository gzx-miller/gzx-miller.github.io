// ===== 顶点着色器 Vertex Shader（实例化渲染版 Instanced） =====
attribute vec3 a_position;
attribute vec3 a_color;
attribute vec3 a_instance_pos;
attribute float a_instance_rot;
uniform mat4 u_proj;
uniform mat4 u_view;
varying vec3 v_color;
void main() {
  float c = cos(a_instance_rot);
  float s = sin(a_instance_rot);
  vec3 rotated = vec3(
    a_position.x * c - a_position.z * s,
    a_position.y,
    a_position.x * s + a_position.z * c
  );
  vec3 worldPos = rotated + a_instance_pos;
  v_color = a_color;
  gl_Position = u_proj * u_view * vec4(worldPos, 1.0);
}

// ===== 片段着色器 Fragment Shader =====
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}

// ===== 顶点着色器 Vertex Shader（非实例化渲染版 Non-Instanced） =====
attribute vec3 a_position;
attribute vec3 a_color;
uniform mat4 u_proj;
uniform mat4 u_view;
uniform vec3 u_offset;
uniform float u_rot;
varying vec3 v_color;
void main() {
  float c = cos(u_rot);
  float s = sin(u_rot);
  vec3 rotated = vec3(
    a_position.x * c - a_position.z * s,
    a_position.y,
    a_position.x * s + a_position.z * c
  );
  v_color = a_color;
  gl_Position = u_proj * u_view * vec4(rotated + u_offset, 1.0);
}
