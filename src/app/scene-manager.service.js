export default class SceneManagerService {
  constructor(canvasId, polygons, width, height, depth) {
    this.depthBuffer = false;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.polygons = polygons;
    this.canvas = document.querySelector(`#${canvasId}`);
    this.gl = this.generateContext(width, height);
  }

  // Generate a fresh WebGl context
  generateContext = (width, height) => {
    const { canvas } = this;
    const gl = canvas.getContext('webgl');
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
    return gl;
  };

  updateScene = (polgygons) => {
    this.polygons = polgygons;
  };

  onRender = () => {
    const { gl } = this;

    gl.ondraw();
  };
}
