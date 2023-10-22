import { init } from "../init";
import { initShader } from "../utils";
import { mat4 } from "gl-matrix";
import {
  positions as originPosition,
  colors as originColor,
} from "../shaders/3d.data";

export function create3dDemo() {
  const canvas = init();

  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  let vertexSource = `
attribute vec3 a_position;
uniform mat4 u_rotateMatrix;
uniform mat4 u_translateMatrix;
uniform mat4 u_scaleMatrix;
attribute vec3 a_color;
varying vec3 v_color;

void main() {
  mat4 modelMatrix = u_rotateMatrix * u_scaleMatrix * u_translateMatrix;
  v_color = a_color;
  gl_Position = modelMatrix * vec4(a_position, 1.0);
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

  let positions = new Float32Array(originPosition);
  let colors = new Float32Array(originColor);

  const bitSize = positions.BYTES_PER_ELEMENT;

  let positionsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, bitSize * 3, 0);
  gl.enableVertexAttribArray(a_position);

  let colorsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  let a_color = gl.getAttribLocation(program, "a_color");
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, bitSize * 3, 0);
  gl.enableVertexAttribArray(a_color);

  function draw(gl: WebGLRenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 24);
    for (let i = 0; i < 24; i += 4) {
      gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
    }
  }

  let deg = 45;
  let rotateMatrix = mat4.create();
  mat4.fromRotation(rotateMatrix, (deg / 180) * Math.PI, [1, 1, 0]);
  let u_rotateMatrix = gl.getUniformLocation(program, "u_rotateMatrix");
  gl.uniformMatrix4fv(u_rotateMatrix, false, rotateMatrix);

  let translateMatrix = mat4.create();
  mat4.fromTranslation(translateMatrix, [1, 0, 0]);
  let u_translateMatrix = gl.getUniformLocation(program, "u_translateMatrix");
  gl.uniformMatrix4fv(u_translateMatrix, false, translateMatrix);

  let scaleMatrix = mat4.create();
  mat4.fromScaling(scaleMatrix, [0.5, 0.5, 0.5]);
  let u_scaleMatrix = gl.getUniformLocation(program, "u_scaleMatrix");
  gl.uniformMatrix4fv(u_scaleMatrix, false, scaleMatrix);

  draw(gl);

  // let time = Date.now();
  // function tick() {
  //   let newTime = Date.now();
  //   let deltaTime = newTime - time;
  //   time = newTime;
  //   deg += deltaTime / 16;
  //   mat4.fromRotation(rotateMatrix, (deg / 180) * Math.PI, [1, 1, 0]);
  //   gl.uniformMatrix4fv(u_rotateMatrix, false, rotateMatrix);
  //   draw(gl);
  //   requestIdleCallback(tick);
  // }
  // tick();
}
