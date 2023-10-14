import { init } from "../init";
import { initShader } from "../utils";

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  const vertices = [-0.5, -0.5, 0.5, -0.5, 0.0, 0.5];
  const verticesF32 = new Float32Array(vertices);
  // single element size
  const FLOAT_SIZE = verticesF32.BYTES_PER_ELEMENT;
  // buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesF32, gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(
    a_position, // vertex shader attribute location
    2, // attribute's length (vec2)
    gl.FLOAT, // buffer data type
    false, // normalized to [0, 1] or [-1, 1]
    2 * FLOAT_SIZE, // group data size
    0 // index in group
  );
  gl.enableVertexAttribArray(a_position);
}

export function createAnimationMatricesOwnerDemo() {
  const canvas = init();

  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  // shader source
  let vertexSource = `
attribute vec2 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
  gl_PointSize = 10.0;
}
`;
  let fragmentSource = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`;

  const { program } = initShader(gl, vertexSource, fragmentSource);
  initVertexBuffers(gl, program);

  function draw(gl: WebGLRenderingContext) {
    // clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let n = 3;
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  /**
   * translate
   * [
   *  1, 0, 0, Tx,
   *  0, 1, 0, Ty,
   *  0, 0, 1, Tz,
   *  0, 0, 0, 1
   * ]
   */

  /**
   * rotate
   * [
   *  cosB, -sinB, 0, 0,
   *  sinB, cosB, 0, 0,
   *  0, 0, 1, 0,
   *  0, 0, 0, 1
   * ]
   */

  /**
   * scale
   * [
   *  Sx, 0, 0, 0,
   *  0, Sy, 0, 0,
   *  0, 0, Sz, 0,
   *  0, 0, 0, 1
   * ]
   */

  let sx = 1,
    sy = 1,
    sz = 1;
  let scale_matrix = [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];

  let tx = 0.5,
    ty = 0,
    tz = 0;
  let translate_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];

  let deg = 0;

  function tick() {
    deg += 3;
    let cosB = Math.cos((deg / 180) * Math.PI),
      sinB = Math.sin((deg / 180) * Math.PI);
    let rotate_matrix = [
      cosB,
      sinB,
      0,
      0,
      -sinB,
      cosB,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ];
    let u_matrix = gl.getUniformLocation(program, "u_matrix");
    // webgl matrix need transpose
    gl.uniformMatrix4fv(u_matrix, false, new Float32Array(rotate_matrix));
    draw(gl);
    requestAnimationFrame(tick);
  }

  tick();
}
