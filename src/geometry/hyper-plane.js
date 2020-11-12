// TODO: do we need to upgrade this to include additional information?
export default class HyperPlane {
  constructor(planeVector, w) {
    this.planeVector = planeVector;
    this.planeVector = w;
  }

  // Factory to build a plane from three vectoor's of a polygon
  static build = (x, y, z) => {
    const n = y.subtract(x).cross(z.subtract(x)).unitVector();
    return new HyperPlane(n, n.dot(x));
  };

  clone = () => {
    const { planeVector, w } = this;
    return new HyperPlane(planeVector.clone(), w);
  };

  flip = () => {
    const { planeVector, w } = this;
    this.planeVector = planeVector.negate();
    this.w -= w;
  };
}
