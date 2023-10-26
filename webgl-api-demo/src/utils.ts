export function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  // compile shader status
  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    // delete error shader
    gl.deleteShader(shader);
    throw new Error(`[error: shader]: ${source} compiled error!`);
  }
  return shader;
}

export function createProgram(
  gl: WebGLRenderingContext,
  shaders: WebGLShader[]
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) {
    throw new Error(`[error: program]: create program error!`);
  }
  shaders.forEach((shader) => {
    gl.attachShader(program, shader);
  });
  gl.linkProgram(program);
  // link program result
  let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    let error = gl.getProgramInfoLog(program);
    // delete error program and shader
    gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
    throw new Error(`[error: program]: linked program error!
    detail: ${error}`);
  }
  gl.useProgram(program);
  return program;
}

export function initShader(
  gl: WebGLRenderingContext,
  vertex: string,
  fragment: string
): {
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
} {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
  const program = createProgram(gl, [vertexShader, fragmentShader]);
  return { vertexShader, fragmentShader, program };
}
