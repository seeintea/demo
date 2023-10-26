import { init } from "../init";
import { initShader } from "../utils";

export function multiMatricesDemo() {
  const canvas = init();
  let ctx = canvas.getContext("webgl");
  if (!ctx) return;

  let vertexShader = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;

  void main() {
    v_color = a_color;
    gl_Position = vec4(a_position, 1.0);
    gl_PointSize = 10.0;
  }
  `;

  let fragmentShader = `
  precision mediump float;
  varying vec3 v_color;
  // gl_FragCoord: canvas 画布坐标（100， 100）

  void main() {
    // gl_FragColor = vec4(v_color, 1.0);
    gl_FragColor = vec4(gl_FragCoord.y / 400.0, 0.0, 0.0, 1.0);
  }
  `;

  const { program } = initShader(ctx, vertexShader, fragmentShader);


  function initVertexBuffer(gl: WebGLRenderingContext) {
    let vertices = new Float32Array([
      -0.5, 0.5, 0.0, 1.0, 0.0, 0.0,
      -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
      0.5, -0.5, 0.0, 0.0, 0.0, 1.0,
      0.5, 0.5, 0.0, 1.0, 1.0, 1.0,
    ]);
    // let colors = new Float32Array([
    //   1.0, 0.0, 0.0,
    //   0.0, 1.0, 0.0,
    //   0.0, 0.0, 1.0,
    //   1.0, 1.0, 1.0,
    // ])
    let F_SIZE = vertices.BYTES_PER_ELEMENT;

    let buffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_position = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 6 * F_SIZE, 0);
    gl.enableVertexAttribArray(a_position);

    let a_color = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 6 * F_SIZE, F_SIZE * 3);
    gl.enableVertexAttribArray(a_color);

    // let positionsBuffer = gl.createBuffer()!
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

    // let a_position = gl.getAttribLocation(program, "a_position");
    // gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 3 * F_SIZE, 0);
    // gl.enableVertexAttribArray(a_position);

    // let colorsBuffer = gl.createBuffer()!
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // let a_color = gl.getAttribLocation(program, "a_color");
    // gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 3 * F_SIZE, 0);
    // gl.enableVertexAttribArray(a_color);
  }

  initVertexBuffer(ctx);

  function draw(ctx: WebGLRenderingContext) {
    ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    ctx.drawArrays(ctx.TRIANGLE_FAN, 0, 4);
  }

  draw(ctx);
}
