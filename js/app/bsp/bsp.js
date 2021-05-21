// import BspNode from './bsp-node';

// TODO: bad memory management
export default class Bsp {
  constructor(polygons = []) {
    this.polygons = polygons || [];
  }

  getModels = () => {
    return this.polygons;
  };
}
