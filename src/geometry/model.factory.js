import Polygon from './polygon';
import Vector from './vector';
import Vertex from './vertex';
import { Bsp } from '../bsp';

const CUBE_DEFAULTS = [
  [
    [0, 4, 6, 2],
    [-1, 0, 0]
  ],
  [
    [1, 3, 7, 5],
    [+1, 0, 0]
  ],
  [
    [0, 1, 5, 4],
    [0, -1, 0]
  ],
  [
    [2, 6, 7, 3],
    [0, +1, 0]
  ],
  [
    [0, 2, 3, 1],
    [0, 0, -1]
  ],
  [
    [4, 5, 7, 6],
    [0, 0, +1]
  ]
];

class Cube {
  constructor(options = {}) {
    const center = new Vector(options.center || [0, 0, 0]);
    const radius = !options.radius
      ? [1, 1, 1]
      : options.radius.length
      ? options.radius
      : [options.radius, options.radius, options.radius];

    this.cube = new BspTree(
      CUBE_DEFAULTS.map((info) => {
        // Create vertices
        const dd = info[0].map((i) => {
          const pos = new Vector(
            center.x + radius[0] * (2 * !!(i & 1) - 1),
            center.y + radius[1] * (2 * !!(i & 2) - 1),
            center.z + radius[2] * (2 * !!(i & 4) - 1)
          );
          return new Vertex(pos, new Vector(info[1]));
        });

        return new Polygon(dd);
      })
    );
  }
}

class Cylinder {
  constructor(options = {}) {
    var s = new Vector(options.start || [0, -1, 0]);
    var e = new Vector(options.end || [0, 1, 0]);
    var ray = e.subtract(s);
    var radius = options.radius || 1;
    var slices = options.slices || 16;
    var axisZ = ray.unitVector(),
      isY = Math.abs(axisZ.y) > 0.5;
    var axisX = new Vector(isY, !isY, 0).cross(axisZ).unitVector();
    var axisY = axisX.cross(axisZ).unitVector();
    var start = new Vertex(s, axisZ.negated());
    var end = new Vertex(e, axisZ.unitVector());
    var polygons = [];

    for (var i = 0; i < slices; i++) {
      var t0 = i / slices,
        t1 = (i + 1) / slices;
      polygons.push(
        new Polygon([
          start,
          this.point(0, t0, -1, axisX, axisY, axisZ, s, radius, ray),
          this.point(0, t1, -1, axisX, axisY, axisZ, s, radius, ray)
        ])
      );
      polygons.push(
        new Polygon([
          this.point(0, t1, 0, axisX, axisY, axisZ, s, radius, ray),
          this.point(0, t0, 0, axisX, axisY, axisZ, s, radius, ray),
          this.point(1, t0, 0, axisX, axisY, axisZ, s, radius, ray),
          this.point(1, t1, 0, axisX, axisY, axisZ, s, radius, ray)
        ])
      );
      polygons.push(
        new Polygon([
          end,
          this.point(1, t1, 1, axisX, axisY, axisZ, s, radius, ray),
          this.point(1, t0, 1, axisX, axisY, axisZ, s, radius, ray)
        ])
      );
    }

    return new BspTree(polygons);
  }

  points = (
    stack,
    slice,
    normalBlend,
    axisX,
    axisY,
    axisZ,
    start,
    radius,
    ray
  ) => {
    var angle = slice * Math.PI * 2;
    var out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)));
    var pos = start.plus(ray.times(stack)).plus(out.times(radius));
    var normal = out
      .times(1 - Math.abs(normalBlend))
      .plus(axisZ.times(normalBlend));
    return new Vertex(pos, normal);
  };
}

class Sphere {
  constructor(options) {
    this.options = options || {};
    const center = new Vector(options.center || [0, 0, 0]);
    const radius = options.radius || 1;
    const slices = options.slices || 16;
    const stacks = options.stacks || 8;
    const { verticies, polygons } = this.build(slices, stacks, center, radius);
    this.verticies = verticies;
    this.polygons = polygons;
    this.tree = new BspTree(polygons);
  }

  vertex = (theta, phi, center, radius) => {
    theta *= Math.PI * 2;
    phi *= Math.PI;

    const dir = new Vector(
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi)
    );
    return new Vertex(center.plus(dir.multiply(radius), dir));
  };

  build = (slices, stacks, center, radius) => {
    const { vertex } = this;
    const polygons = [];
    let vertices = [];

    for (var i = 0; i < slices; i++) {
      for (var j = 0; j < stacks; j++) {
        vertices = [];
        vertices.push(vertex(i / slices, j / stacks, center, radius));
        if (j > 0)
          vertices.push(vertex((i + 1) / slices, j / stacks, center, radius));
        if (j < stacks - 1)
          vertices.push(
            vertex((i + 1) / slices, (j + 1) / stacks, center, radius)
          );

        vertices.push(vertex(i / slices, (j + 1) / stacks, center, radius));
        polygons.push(new Polygon(vertices));
      }
    }

    return { polygons, vertices };
  };
}

export default { Cube, Cylinder, Sphere };
