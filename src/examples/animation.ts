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

export function createAnimationDemo() {
  const canvas = init();

  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  // shader source
  let vertexSource = `
attribute vec2 a_position;
uniform vec4 u_translate;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0) + u_translate;
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

  let tx = 0;
  let ty = 0;
  let speed_x = 0.01;
  let speed_y = 0.02;

  function tick() {
    tx += speed_x;
    ty += speed_y;
    if (tx > 0.5 || tx < -0.5) {
      speed_x *= -1;
    }
    if (ty > 0.5 || ty < -0.5) {
      speed_y *= -1;
    }
    const u_translate = gl.getUniformLocation(program, "u_translate");
    gl.uniform4f(u_translate, tx, ty, 0.0, 0.0);
    draw(gl);
    requestAnimationFrame(tick);
  }

  tick();
}
