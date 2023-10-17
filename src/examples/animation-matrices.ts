import { init } from "../init";
import { initShader } from "../utils";
import { mat4 } from "gl-matrix";

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

export function createAnimationMatricesDemo() {
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

  // let scale_matrix = mat4.create();
  // mat4.fromScaling(scale_matrix, [0.5, 1, 1]);

  // let translate_matrix = mat4.create()
  // mat4.fromTranslation(translate_matrix, [1,0,0])

  let rotate_matrix = mat4.create();
  // mat4.fromRotation(rotate_matrix, (10 / 180) * Math.PI, [0, 0, 1]);
  mat4.rotate(rotate_matrix, rotate_matrix, (10 / 180) * Math.PI, [0, 0, 1]);

  let deg = 0;

  function tick() {
    deg += 1
    mat4.fromZRotation(rotate_matrix, (deg / 180) * Math.PI);
    let u_matrix = gl.getUniformLocation(program, "u_matrix");
    gl.uniformMatrix4fv(u_matrix, false, rotate_matrix);
    draw(gl);
    requestAnimationFrame(tick);
  }

  tick();
}
