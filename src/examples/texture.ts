import { init } from "../init";
import { initShader } from "../utils";

export function textureDemo() {
  const canvas = init();
  let gl = canvas.getContext("webgl");
  if (!gl) return;

  let vertexShader = `
  attribute vec3 a_position;
  attribute vec2 a_uv;
  varying vec2 v_uv;

  void main() {
    v_uv = a_uv;
    gl_Position = vec4(a_position, 1.0);
  }
  `;

  let fragmentShader = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_sampler;
  uniform sampler2D u_sampler1;

  void main() {
    vec4 color = texture2D(u_sampler, v_uv);
    vec4 color1 = texture2D(u_sampler1, v_uv);
    // gl_FragColor = color * color1;
    // gl_FragColor = color * (vec4(1.0, 1.0, 1.0, 2.0) - color1);
    gl_FragColor = color * color1;
  }
  `;

  const { program } = initShader(gl, vertexShader, fragmentShader);

  let positions = new Float32Array([
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
    -0.5, 0.5, 0
  ])

  // 贴图的坐标
  let uvs = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
  ])

  const FSIZE = positions.BYTES_PER_ELEMENT;

  let positionsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  let a_position = gl.getAttribLocation(program, 'a_position')
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 3* FSIZE, 0)
  gl.enableVertexAttribArray(a_position);

  let uvsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)
  let a_uv = gl.getAttribLocation(program, 'a_uv')
  gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 2 * FSIZE, 0)
  gl.enableVertexAttribArray(a_uv);

  function initTextures(gl: WebGLRenderingContext) {
    let texture = gl.createTexture();
    let texture1 = gl.createTexture();

    let u_sampler = gl.getUniformLocation(program, 'u_sampler');
    let u_sampler1 = gl.getUniformLocation(program, 'u_sampler1');

    let image = new Image()
    image.src = 'cat_512x512.jpg'
    // image.src = 'cat_400x400.jpg'

    let u1 = false, u2 = false;

    image.onload = function () {
      // 翻转图片的 Y 轴
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.activeTexture(gl.TEXTURE0); // 激活贴图，放置第 0 个单元上（最少支持8个）
      gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定贴图(哪种/哪个)
      // 贴图参数设置(贴图种类，参数的名称, 具体值)
      // 大图贴在小形状上
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      // 小图片贴的大形状上
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
      // 贴图使用哪张图片
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(u_sampler, 0); // 放到对应的单元
      u1 = true
      if(u1 && u2) draw(gl);
    }

    let image1 = new Image()
    image1.src = 'mask_512x512.jpg'
    image1.onload = function () {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
      gl.uniform1i(u_sampler1, 1);
      u2 = true
      if(u1 && u2) draw(gl);
    }
  }

  initTextures(gl);

  function draw(gl: WebGLRenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}