import Plane from './plane';

// The vertices  used to intialize the  polygon, must be coplanar and convex.
// polygons that are clones of each other or were split from the same polygon.
// This can be used to define per-polygon properties (such as surface color).
export default class Polygon {
  constructor(vertices, parent = null) {
    this.vertices = vertices;
    this.shared = false;
    this.plane = Plane.build(vertices[0].pos, vertices[1].pos, vertices[2].pos);

    // Is this polygon shared in multiple nodes in the tree? (if it is, then this is a polygon that has been split along a hyperplane intersection!)
    if (parent && parent != undefined) {
      this.parent = parent;
      this.shared = true;
    }
  }

  clone = () => {
    const verticies = this.verticies.map((v) => v.clone());
    return new Polygon(verticies, this.parent);
  };

  // Flip the verticies
  flip = () => {
    this.vertices.reverse().map((v) => v.flip());
    this.plane.flip();
  };
}
