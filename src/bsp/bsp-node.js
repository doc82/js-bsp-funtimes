// Holds a node in a BSP tree. A BSP tree is built from a collection of polygons
// by picking a polygon to split along. That polygon (and all other coplanar
// polygons) are added directly to that node and the other polygons are added to
// the front and/or back subtrees. This is not a leafy BSP tree since there is
// no distinction between internal and leaf nodes.
export default class BspNode {
  constructor(polygons = []) {
    this.plane = null;
    this.front = null;
    this.back = null;
    this.polygons = polygons || [];
  }

  clone = () => {
    const { plane, front, back, polygons } = this;
    const node = new BspNode(polygons.map((p) => p.clone()));
    if (plane) node.plane = plane.clone();
    if (front) node.front = front.clone();
    if (back) node.back = back.clone();
    return node;
  };

  //    Convert solid space to empty, and empty to solid
  invert = () => {
    const { polygons, plane, front, back } = this;
    for (let i = 0; i < polygons.length; i += 1) {
      polygons[i].flip();
    }

    plane.flip();
    if (front) front.invert();
    if (back) back.invert();
    const temp = this.front;
    this.front = this.back;
    this.back = temp;
  };

  //  Recursively remove lal polygons that are inside this bsp tree
  clipPolygons = () => {
    const { plane, polygons, front, back } = this;
    if (!plane) return polygons.slice();
    let nFront = [];
    let nBack = [];

    for (let i = 0; i < polygons.length; i += 1) {
      plane.splitPolygon(polygons[i], nFront, nBack, nFront, nBack);
    }

    if (front) nFront = front.clipPolygons(nFront);
    if (back) nBack = back.clipPolygons(nBack);
    else nBack = [];

    return nFront.concat(nBack);
  };

  clipTo = (bspInstance) => {
    this.polygons = bspInstance.clipPolygons(this.polygons);
    if (this.front) this.front.clipTo(bspInstance);
    if (this.back) this.back.clipTo(bspInstance);
  };

  getPolygons = () => {
    const { front, back } = this;
    let polygons = this.polygons.slice();
    if (front) polygons = polygons.concat(front.getPolygons());
    if (back) polygons = polygons.concat(back.getPolygons());

    return polygons;
  };

  // Constract a tree for this node from all polygons
  // New polygons are fitlered down to the bottom of the tree and become new nodes
  // Each set of polygons is partitioned using the first polygon
  // TODO: look into heuristics so we can pick a better split
  build = (polygons) => {
    if (!polygons.length) return;
    const front = [];
    const back = [];

    if (!this.plane) this.plane = polygons[0].plane.clone();

    for (let i = 0; i < polygons.length; i += 1) {
      this.plane.splitPolygon(
        polygons[i],
        this.polygons,
        this.polygons,
        front,
        back
      );
    }

    if (front.length) {
      if (!this.front) this.front = new BspNode();
      this.front.build(front);
    }
    if (back.length) {
      if (!this.back) this.back = new BspNode();
      this.back.build(back);
    }
  };
}
