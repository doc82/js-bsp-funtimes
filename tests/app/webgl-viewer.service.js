export default class WebglViewerService {
  constructor(bspTreeInstance, width, height, depth) {
    this.depthBuffer = false;
  }
  // Replace, and Initialize Viewport
  init = (width, height) => {
    if (this.gl) {
      delete this.gl;
    }
    const gl = GL.create();
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
    this.gl = gl;
  };

  initView = () => {};

  onDraw = () => {};
}
