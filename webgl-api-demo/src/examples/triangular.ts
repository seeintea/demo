import { init } from "../init";
import { initShader } from "../utils";

export function createTriangularDemo() {
  const canvas = init();

  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  // shader source
  let vertexSource = `
attribute vec2 a_position;
attribute vec3 a_color;
varying vec3 v_color;
void main() {
  v_color = a_color;
  gl_Position = vec4(a_position, 0.0, 1.0);
  gl_PointSize = 5.0;
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

  // clear canvas
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // const vertices = [
  //   // x y r g b
  //   -0.5, 0.5, 1.0, 0.0, 0.0,
  //   -0.5, -0.5, 0.0, 1.0, 0.0,
  //   0.5, -0.5, 0.0, 0.0, 1.0,
  //   0.5, 0.5, 1.0, 1.0, 1.0,
  // ];

  let n = 60;

  let vertices: number[] = [];
  let rr = 0.8
  for(let i=0; i<n; i+=1) {
    let deg = 2*Math.PI / n * i;
    let x = Math.cos(deg) * rr
    let y = Math.sin(deg) * rr
    let r = (Math.random() - 0.5) * 2;
    let g = (Math.random() - 0.5) * 2;
    let b = (Math.random() - 0.5) * 2;
    vertices.push(x, y, r, g, b);
  }

  // for (let i = 0; i < n; i += 1) {
  //   let x = (Math.random() - 0.5) * 2;
  //   let y = (Math.random() - 0.5) * 2;
  //   let r = (Math.random() - 0.5) * 2;
  //   let g = (Math.random() - 0.5) * 2;
  //   let b = (Math.random() - 0.5) * 2;
  //   vertices.push(x, y, r, g, b);
  // }

  const verticesF32 = new Float32Array(vertices);

  // single element size
  const FLOAT_SIZE = verticesF32.BYTES_PER_ELEMENT;

  // buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesF32, gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(program, "a_position");
  let a_color = gl.getAttribLocation(program, "a_color");
  gl.vertexAttribPointer(
    a_position, // vertex shader attribute location
    2, // attribute's length (vec2)
    gl.FLOAT, // buffer data type
    false, // normalized to [0, 1] or [-1, 1]
    5 * FLOAT_SIZE, // group data size
    0 // index in group
  );
  gl.vertexAttribPointer(
    a_color,
    3,
    gl.FLOAT,
    false,
    5 * FLOAT_SIZE,
    2 * FLOAT_SIZE
  );
  gl.enableVertexAttribArray(a_position);
  gl.enableVertexAttribArray(a_color);

  gl.drawArrays(gl.POINTS, 0, n);
  // gl.drawArrays(gl.LINES, 0, n)
  // gl.drawArrays(gl.LINE_STRIP, 0, n)
  // gl.drawArrays(gl.LINE_LOOP, 0, n)
  // gl.drawArrays(gl.TRIANGLES, 0, n);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}
