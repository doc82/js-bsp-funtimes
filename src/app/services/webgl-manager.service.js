import { vec3, mat4 } from 'gl-matrix';
import { toRadians } from '../utils/math';

class WeblglManagerService {
  constructor() {}
  toRadians = (deg) => deg * (Math.PI / 180);

  createTransformationMatrix = (x, y, z, rx, ry, rz, scale) => {
    const matrix = [];
    mat4.identity(matrix);
    mat4.translate(matrix, matrix, vec3.fromValues(x, y, z));
    mat4.rotateX(matrix, matrix, toRadians(rx));
    mat4.rotateY(matrix, matrix, toRadians(ry));
    mat4.rotateZ(matrix, matrix, toRadians(rz));
    mat4.scale(matrix, matrix, vec3.fromValues(scale, scale, scale));
    return matrix;
  };

  init = (gl) => {
    this.gl = gl;
  };

  // Buffer fun!
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
  // TODO: WebGL2 allows streams!
  createBuffer = () => {
    const { gl } = this;
    const buff = gl.createBuffer();
    return buff;
  };

  // INT Buffers - for use with indices (the labels assigned to vertices for WebGL)
  bindIntBuffer = (buffer) => {
    const { gl } = this;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  };
  unbindIntBuffer = () => {
    const { gl } = this;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  };
  addElementIntBuffer = (indices) => {
    const { gl } = this;
    // STATIC_DRAW = The indices are intended to be specified once by the application, and used many times as the source for WebGL drawing and image specification commands.
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
  };

  // Float Buffers - for use with Vertices
  bindFloatBuffer = (buffer) => {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  };
  unbindFloatBuffer = () => {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  };
  addElementFloatBuffer = (vertices) => {
    const { gl } = this;
    // STATIC_DRAW = The indices are intended to be specified once by the application, and used many times as the source for WebGL drawing and image specification commands.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  };

  // Shader fun
  createFragmentShader = () => {
    const { gl } = this;
    return gl.createShader(gl.FRAGMENT_SHADER);
  };
  createVertexShader = () => {
    const { gl } = this;
    return gl.createShader(gl.VERTEX_SHADER);
  };
  attachShaderSource = (shader, source) => {
    const { gl } = this;
    return gl.shaderSource(shader, source);
  };
  compileShader = (shaderSrc) => {
    const { gl } = this;
    return gl.compileShader(shaderSrc);
  };
  createShaderProg = () => {
    const { gl } = this;
    return gl.createProgram();
  };
  attachShaderToProg = (prog, shader) => {
    const { gl } = this;
    gl.attachShader(prog, shader);
  };
  linkProg = (prog) => {
    const { gl } = this;
    gl.linkProgram(prog);
  };
  useProg = (prog) => {
    const { gl } = this;
    gl.useProgram(prog);
  };
  getProgAttrbLocation = (prog, attrb) => {
    const { gl } = this;
    return gl.getAttribLocation(prog, attrb);
  };

  // attrb should be the index to the attribute in the array
  enableVertexAttrb = (attrb) => {
    const { gl } = this;
    return gl.enableVertexAttribArray(attrb);
  };

  /**
   *  Instructs WebGL how to interrpret the data of the current buffer
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
   * @param {*} index - specifying the index of the vertex attribute that is to be modified.
   * @param {*} size - specifying the number of components per vertex attribute. Must be 1, 2, 3, or 4.
   */
  configVertexAttrb = (index, size) => {
    const { gl } = this;
    gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);
  };

  // Draw fun!
  drawTrinagles = (indicesLength) => {
    const { gl } = this;
    return gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);
  };

  /**
   *
   * @param {*} location - Location of a uniform-variabble from a WebGL program (getUniformLocation() is used for this)
   * @param {*} matrix - Matrix 4fv to upload
   * @param {*} transpose - Defaults to false
   */
  uploadMatrix4fv = (location, matrix, transpose = false) => {
    const { gl } = this;
    return gl.uniformMatrix4fv(location, transpose, matrix);
  };

  /**
   * Returns a specific uniform-variable from the part of a WebGL program
   * @param {*} prog - WebGL Program (see useProgram,linkProgram as reference)
   * @param {*} uniform -
   */
  getUniformLocation = (prog, uniform) => {
    const { gl } = this;
    return gl.getUniformLocation(prog, uniform);
  };
  uploadVec3f = (prog, uniform) => {
    const { gl } = this;
    return gl.getUniformLocation(prog, uniform);
  };
  uploadFloat = (prog, uniform) => {
    const { gl } = this;
    return gl.getUniformLocation(prog, uniform);
  };
  uploadInt = (prog, uniform) => {
    const { gl } = this;
    return gl.getUniformLocation(prog, uniform);
  };
  uploadBool = (prog, uniform) => {
    const { gl } = this;
    return gl.getUniformLocation(prog, uniform);
  };

  createTexture = () => {
    const { gl } = this;
    return gl.getUniformLocation();
  };

  bindTexture = (texture) => {
    const { gl } = this;
    return gl.bindTexture(gl.TEXTURE0, texture);
  };

  activeTexture = (texture) => {
    const { gl } = this;
    return gl.activeTexture(gl.TEXTURE0 + texture);
  };

  defineTexture = (img) => {
    const { gl } = this;
    return gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      img
    );
  };

  textureMipmap2d = () => {
    const { gl } = this;
    return gl.generateMipmap(gl.TEXTURE_2D);
  };
}

const webGlManagerService = new WeblglManagerService();
export default webGlManagerService;
