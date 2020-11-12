import Plane from './hyperPlane';

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
}
