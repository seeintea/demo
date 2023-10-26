import { init } from "../init";
import { initShader } from "../utils";

export function createVariableDemo() {
  const canvas = init();

  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  // shader source

  // attribute only in vertex shader
  // uniform in vertex/fragment
  // varying from vertex to fragment
  let vertexSource = `
attribute vec2 a_position;
uniform float u_size;
varying vec2 v_position;
void main() {
  v_position = a_position;
  gl_Position = vec4(a_position, 0.0, 1.0);
  gl_PointSize = u_size;
}
`;

  let fragmentSource = `
precision mediump float;

uniform vec3 u_color;
varying vec2 v_position;
void main() {
  gl_FragColor = vec4(v_position, 0.0, 1.0);
}
`;

  const { program } = initShader(gl, vertexSource, fragmentSource);

  // clear canvas
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // data from js to vertexShader
  let a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttrib2f(a_position, 0.5, 0.6);

  // data from js to vertexShader/fragmentShader
  let u_size = gl.getUniformLocation(program, "u_size");
  gl.uniform1f(u_size, 20.0);

  let u_color = gl.getUniformLocation(program, "u_color");
  gl.uniform3f(u_color, 1.0, 0.0, 0.0);

  gl.drawArrays(gl.POINTS, 0, 1);
}
