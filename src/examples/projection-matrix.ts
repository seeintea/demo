import { mat4 } from "gl-matrix";
import { init } from "../init";
import { initShader } from "../utils";

export function createProjectionMatrixDemo() {
  const canvas = init();

  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  let vertexSource = `
attribute vec3 a_position;
attribute vec3 a_color;
varying vec3 v_color;

uniform mat4 u_viewMatrix;
uniform mat4 u_projMatrix;

void main() {
  v_color = a_color;
  // gl_Position = u_projMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
  gl_Position = u_projMatrix * u_viewMatrix * vec4(a_position, 1.0);
}
`;
  let fragmentSource = `
precision mediump float;
varying vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`;

  const { program } = initShader(gl, vertexSource, fragmentSource);

  let vertices = new Float32Array([
    -0.8, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 0.8, -0.5, 1.0, 0.0, 0.0, 0.8, -0.5,
    -0.5, 1.0, 0.0, 0.0, -0.8, 0.5, 0.5, 0.0, 0.0, 1.0, 0.0, -0.8, 0.5, 0.0,
    0.0, 1.0, 0.8, 0.5, 0.5, 0.0, 0.0, 1.0,
  ]);

  const bitSize = vertices.BYTES_PER_ELEMENT;

  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  let a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, bitSize * 6, 0);
  gl.enableVertexAttribArray(a_position);

  let a_color = gl.getAttribLocation(program, "a_color");
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, bitSize * 6, bitSize * 3);
  gl.enableVertexAttribArray(a_color);

  // 视图矩阵
  let viewMatrix = mat4.create();
  let eye = [0, 0, 10];
  // @ts-ignore
  mat4.lookAt(viewMatrix, eye, [0, 0, 0], [0, 1, 0]);
  let u_viewMatrix = gl.getUniformLocation(program, "u_viewMatrix");
  gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);

  // 投影矩阵
  // let orthoMatrix = mat4.create();
  // left right bottom top near far
  // mat4.ortho(orthoMatrix, -1, 1, -1, 1, 0, 5);
  // let u_projMatrix = gl.getUniformLocation(program, "u_projMatrix");
  // gl.uniformMatrix4fv(u_projMatrix, false, orthoMatrix);

  // 透视投影
  let perspectiveMatrix = mat4.create();
  mat4.perspective(perspectiveMatrix, (160 / 180) * Math.PI, 1, 0.1, 5);
  let u_projMatrix = gl.getUniformLocation(program, "u_projMatrix");
  gl.uniformMatrix4fv(u_projMatrix, false, perspectiveMatrix);

  function draw(gl: WebGLRenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  gl.enable(gl.DEPTH_TEST);

  function tick() {
    let time = Date.now() * 0.001;
    eye[0] = Math.sin(time);
    // eye[1]
    eye[2] = Math.cos(time);
    // @ts-ignore
    mat4.lookAt(viewMatrix, eye, [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
    draw(gl);
    requestAnimationFrame(tick);
  }

  tick();
}
