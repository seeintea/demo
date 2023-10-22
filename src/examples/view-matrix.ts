import { mat4 } from "gl-matrix";
import { init } from "../init";
import { initShader } from "../utils";

export function createViewMatrixDemo() {
  const canvas = init();

  const gl = canvas.getContext("webgl") as WebGLRenderingContext;

  let vertexSource = `
attribute vec3 a_position;
attribute vec3 a_color;
varying vec3 v_color;

uniform mat4 u_viewMatrix;

void main() {
  v_color = a_color;
  gl_Position = u_viewMatrix * vec4(a_position, 1.0);
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
    -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 0.0, 0.5,
    0.0, 0.0, 0.0, 1.0,
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

  let u_viewMatrix = gl.getUniformLocation(program, "u_viewMatrix");
  let viewMatrix = mat4.create();
  gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);

  let eye = [0.0, 0.0, 0.1];
  let center = [0, 0, 0];
  let up = [0, 1, 0];
  window.onkeydown = function (e) {
    let step = 0.01;
    if (e.code === "ArrowLeft") {
      eye[0] -= step;
    } else if (e.code === "ArrowRight") {
      eye[0] += step;
    }else if (e.code === "ArrowUp") {
      eye[1] += step;
    }else if (e.code === "ArrowDown") {
      eye[1] -= step;
    }
    // @ts-ignore
    mat4.lookAt(viewMatrix, eye, center, up);
    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
    draw(gl);
  };

  function draw(gl: WebGLRenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  draw(gl);
}
