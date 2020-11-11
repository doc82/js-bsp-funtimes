import Plane from './plane';

// The vertices  used to intialize the  polygon, must be coplanar and convex.
// Each convex polygon has a `shared` property, which is shared between all,
// polygons that are clones of each other or were split from the same polygon.
// This can be used to define per-polygon properties (such as surface color).
export default class Polygon {
  constructor(vertices, shared = false) {
    this.vertices = vertices;
    this.shared = shared || false;
    // TODO: pick a better way to determine the plane
    this.plane = new Plane.build(
      vertices[0].pos,
      vertices[1].pos,
      vertices[2].pos
    );
  }

  clone = () => {
    const verticies = this.verticies.map((v) => v.clone());
    return new Polygon(verticies, this.shared);
  };

  flip = () => {
    this.vertices.reverse().map((v) => v.flip());
    this.plane.flip();
  };
}
