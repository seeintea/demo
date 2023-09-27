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
uniform float cosB;
uniform float sinB;

void main() {
  float x1 = a_position.x;
  float y1 = a_position.y;
  float z1 = 0.0;

  float x2 = x1*cosB - y1*sinB;
  float y2 = x1*sinB + y1*cosB;
  float z2 = z1;

  gl_Position = vec4(x2, y2, z2, 1.0);
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

  let deg = 0

  function tick() {

    deg += 0.5

    const sinB = gl.getUniformLocation(program, "sinB");
    const cosB = gl.getUniformLocation(program, "cosB");
    gl.uniform1f(sinB, Math.sin(deg / 180 * Math.PI))
    gl.uniform1f(cosB, Math.cos(deg / 180 * Math.PI))

    draw(gl);
    requestAnimationFrame(tick)
  }

  tick()
}
