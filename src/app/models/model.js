import webGlManagerService from '../services/webgl-manager.service';
// import HyperPlane from './hyper-plane';
import Material from './material';

// const DFLT_WEBGL_MESH_CONFIG = {
//   normals: true,
//   colors: true,
//   defaultColor: [1, 1, 1]
// };
const DFLT_TEXTURE_URL = '../assets/images/goat.jpg';
//  The standard  solution is to make the plane "thick" by use of an epsilon value.
// const EPSILON = 1e-5;
// const POLY_CLASSES = {
//   COPLANAR: 0,
//   FRONT: 1,
//   BACK: 2,
//   SPANNING: 3
// };

// Contains all the meta-information needed for rendering, 1 model can be shared amongst many model-instances
export default class Model {
  /**
   *
   * @param {*} vertices - Contain a list of Vertices that posess position and normals to create the model's polygon
   * @param {*} indices
   * @param {*} normals
   * @param {*} textureCoords - Texture coordinates to be place the material
   * @param {*} textureUrl - URL to the texture for this model (currently only supports 1 texture)
   * @param {*} parent - If this model has been split into two via a hyperPlane, this linker lets us know who the parent is
   * @param {*} mesh - This is generated at creation time and is experimental for use in shader-drawn meshes. unless it is a clone/split then we will happily use the pre-cached information
   */
  constructor(indices, normals, textureCoords, textureUrl, vertices) {
    this.indices = indices;
    this.normals = normals;
    this.textureCoords = textureCoords || null;
    this.vertices = vertices;
    this.material = new Material(textureUrl || DFLT_TEXTURE_URL);

    if (!vertices.length || vertices.length < 3) {
      throw new Error('Cannot construct a polygon with less than 3 vertices');
    }
    // Initalize the buffers for this model-class!
    this.init();
  }

  init = () => {
    this.generateTextureBuffer();
    this.generateNormalBuffer();
    this.generateVertexBuffer();
    this.generateIndexBuffer();
  };

  generateTextureBuffer = () => {
    const { textureCoords } = this;
    this.textureBuffer = webGlManagerService.createBuffer();
    webGlManagerService.bindFloatBuffer(this.textureBuffer);
    webGlManagerService.addFloatBuffer(textureCoords);
    webGlManagerService.unbindFloatBuffer();
  };

  generateNormalBuffer = () => {
    const { normals } = this;
    this.normalsBuffer = webGlManagerService.createBuffer();
    webGlManagerService.bindFloatBuffer(this.normalsBuffer);
    webGlManagerService.addFloatBuffer(normals);
    webGlManagerService.unbindFloatBuffer();
  };

  generateVertexBuffer = () => {
    const { vertices } = this;
    this.vertexBuffer = webGlManagerService.createBuffer();
    webGlManagerService.bindFloatBuffer(this.vertexBuffer);
    webGlManagerService.addFloatBuffer(vertices);
    webGlManagerService.unbindFloatBuffer();
  };

  generateIndexBuffer = () => {
    const { indices } = this;
    this.indexBuffer = webGlManagerService.createBuffer();
    webGlManagerService.bindElementBuffer(this.indexBuffer);
    webGlManagerService.addElementBuffer(indices);
    webGlManagerService.unbindElementBuffer();
  };

  applyShader = (shader) => {
    const {
      vertexBuffer,
      textureBuffer,
      material,
      normalsBuffer,
      indexBuffer
    } = this;
    webGlManagerService.bindFloatBuffer(vertexBuffer);
    shader.applyPosition();
    webGlManagerService.bindFloatBuffer(textureBuffer);
    shader.applyTextureCoords();
    webGlManagerService.bindFloatBuffer(normalsBuffer);
    shader.applyNormals();
    webGlManagerService.bindElementBuffer(indexBuffer);
    material.applyShader(shader);
  };
}
