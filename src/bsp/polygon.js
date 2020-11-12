import Plane from './hyperPlane';

// The vertices  used to intialize the  polygon, must be coplanar and convex.
// polygons that are clones of each other or were split from the same polygon.
// Requires a minimum of 3 verticies
export default class Polygon {
  // TODO: Add additional properties that will assist the renderer (Textures, meshes, color, etc......)
  constructor(vertices, parent = null) {
    this.vertices = vertices;
    this.shared = false;

    if (!vertices.length || vertices.length < 3) {
      throw new Error('Cannot construct a polygon with less than 3 verticies');
    }

    // Construct a hyper-plane from the first 3 verticies
    this.hyperPlane = Plane.build(
      vertices[0].pos,
      vertices[1].pos,
      vertices[2].pos
    );

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
    this.hyperPlane.flip();
  };
}
