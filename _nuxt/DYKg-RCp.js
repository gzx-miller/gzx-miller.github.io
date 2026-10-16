const n=`// ===== 顶点着色器 Vertex Shader（实例化 + 属性颜色） =====
attribute vec3 a_position;
attribute vec3 a_color;
attribute vec3 a_instance_offset;
uniform mat4 u_proj;
uniform mat4 u_view;
varying vec3 v_color;
void main() {
  vec3 pos = a_position + a_instance_offset;
  v_color = a_color;
  gl_Position = u_proj * u_view * vec4(pos, 1.0);
}

// ===== 片段着色器 Fragment Shader =====
precision mediump float;
varying vec3 v_color;
void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`;export{n as default};
