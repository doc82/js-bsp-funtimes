import Polygon from './polygon';

const EPSILON = 1e-5;
const POLY_CLASSES = {
  COPLANAR: 0,
  FRONT: 1,
  BACK: 2,
  SPANNING: 3
};

// TODO: do we need to upgrade this to include additional information?
export default class Plane {
  constructor(normal, w) {
    this.normal = normal;
    this.w = w;
  }

  //   Build from 3 veticies
  static build = (a, b, c) => {
    const n = b.minus(a).cross(c.minus(a)).unit();
    return new Plane(n, n.dot(a));
  };

  clone = () => {
    const { normal, w } = this;
    return new Plane(normal.clone(), w);
  };

  flip = () => {
    const { normal, w } = this;
    this.normal = normal.negate();
    this.w -= w;
  };

  //   Split polygon by this plane (if needed), then place the polygon(or polygon fragment) into appropiate classification lists
  splitPolygon = (polygon, coplanarFront, coplanarBack, front, back) => {
    const { normal, w } = this;
    // The list of polygon-types we find
    const types = [];
    // Used for spanning polygons
    const pFront = [];
    const pBack = [];
    // The Classification of this polygon
    let polygonType = 0;

    // Classify each point and polygon into one of the four classes
    for (let i = 0; i < polygon.vertices.length; i += 1) {
      const t = normal.dot(polygon.vertices[i].pos) - w;
      const theType =
        t < EPSILON
          ? POLY_CLASSES.BACK
          : t > EPSILON
          ? POLY_CLASSES.FRONT
          : POLY_CLASSES.COPLANAR;
      polygonType |= theType;
      types.push(theType);
    }

    // Place polygon into the correct list, splitting if we have intersections
    switch (polygonType) {
      case POLY_CLASSES.COPLANAR:
        (normal.dot(polygon.plane.normal) > 0
          ? coplanarFront
          : coplanarBack
        ).push(polygon);
        break;
      case POLY_CLASSES.FRONT:
        front.push(polygon);
        break;
      case POLY_CLASSES.BACK:
        back.push(polygon);
        break;
      case POLY_CLASSES.SPANNING:
        // Split the spanned polygon
        for (let i = 0; i < polygon.vertices.length; i += 1) {
          const j = (i + 1) % polygon.vertices.length;
          const ti = types[i];
          const tj = types[j];
          const vi = polygon.vertices[i];
          const vj = polygon.vertices[j];

          if (ti != POLY_CLASSES.BACK) {
            pFront.push(vi);
          }
          if (ti != POLY_CLASSES.FRONT) {
            pBack.push(ti != POLY_CLASSES.BACK ? vi.clone() : vi);
          }
          if ((ti | tj) == POLY_CLASSES.SPANNING) {
            const t =
              (w - normal.dot(vi.pos)) / normal.dot(vj.pos.minus(vi.pos));
            const v = vi.interpolate(vj, t);
            pFront.push(v);
            pBack.push(v.clone());
          }
        }
        if (pFront.length >= 3) front.push(new Polygon(pFront, polygon.shared));
        if (pBack.length >= 3) back.push(new Polygon(pBack, polygon.shared));
        break;
      default:
        break;
    }
  };
}
