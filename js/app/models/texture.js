import webGlManagerService from '../services/webgl-manager.service';

export default class Texture {
  constructor() {
    this.texture = webGlManagerService.createTexture();
    this.loaded = false;
    // This places a temporary texture into the webGL context for immediate use while we wait for async load to occur
    this.bindTexture();
    webGlManagerService.definePlaceHolderTexture();
  }

  loadTexture = (url) => {
    const { handleLoad } = this;
    const img = new Image();
    img.setAttribute('crossOrigin', '');
    img.onload = () => {
      handleLoad(img);
    };
    // This kicks off the async loading process!
    img.src = url;
  };

  handleLoad = (img) => {
    webGlManagerService.bindTexture(this.texture);
    webGlManagerService.defineTexture(img);
    if (this.isPowerOf2(img.width) && this.isPowerOf2(img.height)) {
      webGlManagerService.textureMipmap2d();
    } else {
      webGlManagerService.textureNoPowerOfTwo();
    }
    this.loaded = true;
  };

  isPowerOf2 = (side) => (side & (side - 1)) === 0;

  bindTexture = () => {
    webGlManagerService.bindTexture(this.texture);
  };
}
