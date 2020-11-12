import Polygon from './polygon';

//  The standard  solution is to make the plane "thick" by use of an epsilon value.
const EPSILON = 1e-5;
const POLY_CLASSES = {
  COPLANAR: 0,
  FRONT: 1,
  BACK: 2,
  SPANNING: 3
};

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

  // Split a polygon by this plane, then place the organize by orientation to this plane
  // This handles the coplanar edge-case
  splitPolygon = (polygon, coplanarFront, coplanarBack, front, back) => {
    const { planeVector, w } = this;
    // The list of polygon-types we find from each of the verticies of this polygon
    const types = [];
    // Used for coplanar(eg, 'spanning) polygons
    const pFront = [];
    const pBack = [];
    // The Classification of this polygon
    let polygonType = 0;

    // Loop over the polygbon's verticies to determine if:
    // 1) Is the polygon in front of the plane?
    // 2) Is the polygon behind the plane?
    // 3) Edge-case: Is the polygon split into both front/back?
    for (let i = 0; i < polygon.vertices.length; i += 1) {
      const pos = polygon.vertices[i].pos;
      const side = planeVector.dot(pos) - w;
      const theType =
        side < EPSILON
          ? POLY_CLASSES.BACK
          : side > EPSILON
          ? POLY_CLASSES.FRONT
          : POLY_CLASSES.COPLANAR;

      polygonType |= theType;
      types.push(theType);
    }

    // Place polygon into the correct list, splitting if we have intersections
    switch (polygonType) {
      case POLY_CLASSES.COPLANAR:
        (planeVector.dot(polygon.plane.planeVector) > 0
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
          // TODO: Need to improve the way we identify coplanar polygons, this feels super janky
          const j = (i + 1) % polygon.vertices.length;
          // Grab this vertice's "class"
          const pointAClass = types[i];
          // Grab the opposite vertice
          const pointBClass = types[j];
          const pointA = polygon.vertices[i];
          const pointB = polygon.vertices[j];

          // Save the front-facing vertex
          if (pointAClass != POLY_CLASSES.BACK) {
            pFront.push(pointA);
          }
          if (pointAClass != POLY_CLASSES.FRONT) {
            pBack.push(
              pointAClass != POLY_CLASSES.BACK ? pointA.clone() : pointA
            );
          }

          // Check if the two verticies are spanning, and then split along the intersection
          if ((pointAClass | pointBClass) == POLY_CLASSES.SPANNING) {
            // Grab the intersection
            const t =
              (w - planeVector.dot(pointA.pos)) /
              planeVector.dot(pointB.pos.subtract(pointA.pos));
            // Generate new vertex for the split (this needs a front and a back)
            const v = pointA.interpolate(pointB, t);
            pFront.push(v);
            pBack.push(v.clone());
          }
        }

        // Clone the coplanar verticies, and keep a pointer back to the parent
        if (pFront.length >= 3) front.push(new Polygon(pFront, polygon));
        if (pBack.length >= 3) back.push(new Polygon(pBack, polygon));
        break;
      default:
        break;
    }
  };
}
