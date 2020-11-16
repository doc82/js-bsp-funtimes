import Texture from './texture';
import webMgrSvc from '../services/webgl-manager.service';

export default class Material {
  /**
   * Material represents a texture instance with capability to apply shader
   * @param {*} textureUrl - Relative path to the texture asset
   */
  constructor(textureUrl) {
    this.texture = new Texture(textureUrl);
    this.texture.loadTexture(textureUrl);
  }

  /**
   *
   * @param {*} shader
   */
  applyShader = (shader) => {
    const { texture } = this;
    // TODO: Do we need to re-bind the texture into the GPU on every frame, or only on load in the constructor?
    webMgrSvc.activeTexture(texture);
    webMgrSvc.uploadInt(shader.diffuseTexture, 0);
    webMgrSvc.uploadBool(shader.hasDiffuseTexture, !!texture.loaded);
  };
}
