import webGlManagerService from '../services/webgl-manager.service';

export default class Texture {
  constructor() {
    this.texture = webGlManagerService.createTexture();
    this.loaded = false;
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
    this.loaded = true;
  };
}
