import ModelInstance from './models/model-instance';
import Camera from './services/camera.service';
import Light from './services/light.service';
import Shader from './shaders/shader.service';
import modelRegistry from './models/model.registry.js';
import mouseService from './services/mouse-listener.service';
import WebGlManagerService from './services/webgl-manager.service';

export default class SceneManagerService {
  constructor(canvasId, models, width, height, depth) {
    this.depthBuffer = false;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.models = models;
    this.canvas = document.getElementById(canvasId);
    this.gl = this.createContext(width, height);

    WebGlManagerService.init(this.gl);

    this.shader = new Shader();
    this.camera = new Camera();
    this.lightSource = new Light(110, 120, -100, 1.0, 1.0, 1.0, 0.4);
    this.models = [];
    mouseService.attachEvents(this.canvas);
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

  addModelInstance = (
    modelId,
    xyz = { x: 0, y: 0, z: 0 },
    rxyz = { rx: 0, ry: 0, rz: 0 },
    scale = 1
  ) => {
    if (!modelRegistry.registry[modelId]) {
      throw new Error('Invalid model class defined: ' + modelId);
    }
    const modelInstance = new ModelInstance(
      modelRegistry.registry[modelId],
      xyz,
      rxyz,
      scale
    );
    this.models.push(modelInstance);
    return modelInstance;
  };

  // TODO: FIX ME
  onRender = () => {
    const { camera, lightSource, shader, models } = this;

    this.clearView(1.0, 1.0, 1.0, 1.0);
    this.viewport();
    this.depthTest(true);
    shader.applyShader();
    shader.applyLight(lightSource);
    camera.apply(shader);
    for (let i = 0; i < models.length; i += 1) {
      const model = models[i];
      const { modelClass } = model;
      // This gets the model info (textures/poly info) and passes it into the shader context thingy mabob
      // TODO: what is a shader-context thingy mabob?
      modelClass.applyShader(shader);
      shader.applyTransformationMatrix(model.getMatrix());

      // Woooooo, all this work for this one call to rule them all
      WebGlManagerService.drawElements(modelClass.indices.length);
    }
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
