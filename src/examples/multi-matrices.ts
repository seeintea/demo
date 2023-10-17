import { init } from "../init";
import { initShader } from "../utils";
import { mat4, glMatrix } from "gl-matrix";

export function multiMatricesDemo() {
  const canvas = init();
  let ctx = canvas.getContext("webgl");
  if (!ctx) return;

  let vertexShader = `
  attribute vec3 a_position;
  uniform mat4 u_t_matrix;
  uniform mat4 u_s_matrix;
  uniform mat4 u_r_matrix;

  void main() {
    // mat4 modelMatrix = u_t_matrix;
    mat4 modelMatrix = u_t_matrix * u_s_matrix * u_r_matrix;
    gl_Position = modelMatrix * vec4(a_position, 1.0);
  }
  `;

  let fragmentShader = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  `;

  const { program } = initShader(ctx, vertexShader, fragmentShader);

  let vertices = new Float32Array([
    -0.2, -0.2, 0.0, 0.2, -0.2, 0.0, 0.0, 0.2, 0.0,
  ]);

  let F_SIZE = vertices.BYTES_PER_ELEMENT;

  let buffer = ctx.createBuffer()!;
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);

  let a_position = ctx.getAttribLocation(program, "a_position");
  ctx.vertexAttribPointer(a_position, 3, ctx.FLOAT, false, 3 * F_SIZE, 0);
  ctx.enableVertexAttribArray(a_position);

  let tMatrix = mat4.create();
  let sMatrix = mat4.create();
  let rMatrix = mat4.create();

  mat4.fromTranslation(tMatrix, [0.5, 0.0, 0.0]);
  mat4.fromScaling(sMatrix, [2, 1, 1]);
  mat4.fromRotation(rMatrix, glMatrix.toRadian(10), [0, 0, 1]);

  let u_tMatrix = ctx.getUniformLocation(program, "u_t_matrix");
  ctx.uniformMatrix4fv(u_tMatrix, false, tMatrix);

  let u_sMatrix = ctx.getUniformLocation(program, "u_s_matrix");
  ctx.uniformMatrix4fv(u_sMatrix, false, sMatrix);

  let u_rMatrix = ctx.getUniformLocation(program, "u_r_matrix");
  ctx.uniformMatrix4fv(u_rMatrix, false, rMatrix);

  function draw(ctx: WebGLRenderingContext) {
    ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    ctx.drawArrays(ctx.TRIANGLES, 0, 3);
  }

  draw(ctx);
}
