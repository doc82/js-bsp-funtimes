import webglMgrSvc from '../services/webgl-manager.service';
const { createTransformationMatrix } = webglMgrSvc;

export default class ModelInstance {
  /**
   * Represents the 3D coordinates, rotation, and scale of a specific 3D model
   * @param {*} modelClass = a "model.js" instance that contains all the meta-information for this model
   * @param {*} xyz - Object containing x,y,z information as properties
   * @param {*} rxyz - Object containg rotational data for x,y,z properties
   * @param {*} scale - Scale value
   */
  constructor(modelClass, xyz = {}, rxyz = {}, scale = 0.9) {
    const { x = 0, y = 0, z = 0 } = xyz;
    const { rx = 0, ry = 0, rz = 0 } = rxyz;

    this.modelClass = modelClass;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;

    this.setMatrix();
  }

  /**
   * Rotate the model
   * @param {*} rx
   * @param {*} ry
   * @param {*} rz
   */
  rotate = (rx, ry, rz) => {
    this.rx += rx;
    this.ry += ry;
    this.rz += rz;
    this.setMatrix();
  };

  /**
   * Matrix get/setter based on current x,y,z, rotation on xyz, and scale
   */
  getMatrix = () => {
    return this.tMatrix;
  };
  setMatrix = () => {
    const { x, y, z, rx, ry, rz, scale } = this;
    this.tMatrix = createTransformationMatrix(x, y, z, rx, ry, rz, scale);
  };
}
