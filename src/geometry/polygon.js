import HyperPlane from './hyper-plane';

const DFLT_WEBGL_MESH_CONFIG = {
  normals: true,
  colors: true,
  defaultColor: [1, 1, 1]
};

// The vertices  used to intialize the  polygon, must be coplanar and convex.
// polygons that are clones of each other or were split from the same polygon.
// Requires a minimum of 3 verticies
export default class Polygon {
  // TODO: Add additional properties that will assist the renderer (Textures, meshes, color, etc......)
  constructor(vertices, parent = null, mesh = null, color = null) {
    this.vertices = vertices;
    this.color = color || null;
    this.mesh = null;

    if (!vertices.length || vertices.length < 3) {
      throw new Error('Cannot construct a polygon with less than 3 verticies');
    }

    // Construct a hyper-plane from the first 3 verticies
    this.hyperPlane = HyperPlane.build(
      vertices[0].pos,
      vertices[1].pos,
      vertices[2].pos
    );

    // Is this polygon shared in multiple nodes in the tree? (if it is, then this is a polygon that has been split along a hyperplane intersection!)
    if (parent && parent != undefined) {
      this.parent = parent;
      this.shared = true;
    }
    this.mesh = mesh;
    if (!mesh) {
      this.mesh = this.generateMesh();
    }
  }

  generateMesh = () => {
    const { vertices, color } = this;
    const { normals, colors } = DFLT_WEBGL_MESH_CONFIG;

    // TODO: allow overrides for textures in the future
    const mesh = new GL.Mesh({ normals, colors });
    const glIndexer = new GL.Indexer();

    var indices = vertices.map((vertex) => {
      vertex.color = color || DFLT_WEBGL_MESH_CONFIG.defaultColor;
      return glIndexer.add(vertex);
    });

    // generate triangle from vertex indices
    for (var i = 2; i < indices.length; i++) {
      mesh.triangles.push[(indices[0], indices[i - 1], indices[i])];
    }

    // get verticy x/y/z coords
    mesh.verticies = glIndexer.unique.map((v) => {
      const { pos } = v;
      return [pos.x, pos.y, pos.z];
    });
    // get our vectors
    mesh.normals = glIndexer.unique.map((v) => {
      const { normal } = v;
      return [normal.x, normal.y, normal.z];
    });
    // and finally colors
    mesh.colors = glIndexer.unique.map((v) => {
      return v.color;
    });

    // calculate wireframe indexer stream for this mesh
    mesh.computeWireframe();

    return mesh;
  };

  clone = () => {
    const verticies = this.verticies.map((v) => v.clone());
    return new Polygon(verticies, this.parent);
  };

  // Flip the verticies
  flip = () => {
    this.vertices.reverse().map((v) => v.flip());
    this.hyperPlane.flip();
  };

  // Split a polygon by a plane, then organize these split-fragments by orientation to the plane
  // This handles the coplanar edge-case by splitting the polygon,
  //  linking-them and re-inserting into coPlaner front/back array
  splitPolygon = (plane, coplanarFront, coplanarBack, front, back) => {
    const { vertices } = this;
    const { planeVector, w } = plane;
    // The list of polygon-types we find from each of the verticies of this polygon
    const types = [];
    // The Classification of this polygon
    let polygonType = 0;

    // Loop over the polygbon's verticies to determine if:
    // 1) Is the polygon in front of the plane?
    // 2) Is the polygon behind the plane?
    // 3) Edge-case: Is the polygon split into both front/back?
    for (let i = 0; i < vertices.length; i += 1) {
      const pos = vertices[i].pos;
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
        (planeVector.dot(plane.planeVector) > 0
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
        for (let i = 0; i < vertices.length; i += 1) {
          // TODO: Need to improve the way we identify coplanar polygons, this feels super janky
          const j = (i + 1) % vertices.length;
          // Grab this vertice's "class"
          const pointAClass = types[i];
          // Grab the opposite vertice
          const pointBClass = types[j];
          const pointA = vertices[i];
          const pointB = vertices[j];

          // Save the front-facing vertex
          if (pointAClass != POLY_CLASSES.BACK) {
            front.push(pointA);
          }
          if (pointAClass != POLY_CLASSES.FRONT) {
            back.push(
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
            front.push(v);
            back.push(v.clone());
          }
        }

        // Clone the coplanar verticies, and keep a pointer back to the parent
        if (front.length >= 3) front.push(new Polygon(front, this));
        if (back.length >= 3) back.push(new Polygon(back, this));
        break;
      default:
        break;
    }
  };
}
