export default class SceneManagerService {
  constructor(canvasId, models, width, height, depth) {
    this.depthBuffer = false;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.models = models;
    this.canvas = document.querySelector(`#${canvasId}`);
    this.gl = this.createContext(width, height);
  }

  // Generate a fresh WebGl context
  createContext = (width, height) => {
    const { canvas } = this;
    const gl = canvas.getContext('webgl');
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
    return gl;
  };

  updateScene = (polgygons) => {
    this.models = polgygons;
  };

  onRender = () => {
    const { gl } = this;

    gl.ondraw();
  };

  // Set webGL viewport to canvas dimensions
  viewport = () => {
    const { gl } = this;
    const { canvas } = gl;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  // Clear the view
  clearView = (r, g, b, a) => {
    const { gl } = this;
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  // Helps make sure we render the proper triangles based on Z
  // This is disabled by default, and once enabled automatically stores Z-info into the depth buffer
  depthTest = (enable) => {
    const { gl } = this;
    if (enable) {
      gl.enable(gl.DEPTH_TEST);
    } else gl.disable(gl.DEPTH_TEST);
  };
}
