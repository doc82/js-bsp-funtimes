import BspNode from './bsp-node';

// TODO: bad memory management
export default class BspTree {
  constructor(polygons = []) {
    this.polygons = polygons || [];
  }

  getPolygons = () => {
    return this.polygons;
  };

  flipPolygons = () => {
    this.polygons.map((p) => {
      p.flip();
    });
  };

  inverse = () => {
    const clone = this.clone();
    clone.flipPolygons();
    return clone;
  };

  union = (bspInstance) => {
    // We need to remove everything in A inside B, and everything in B inside A
    // Then we combine polygons from a and B into a new tree
    const a = new BspNode(this.clone().getPolygons());
    const b = new BspNode(bspInstance.getPolygons());

    // We need to deal with overlapping coplanar polygons in both trees, so we clip the inverse of B against A
    //  Remove B from A, and A from B
    a.clipTo(b);
    b.clipTo(a);
    // Invert B, and clip A, then Invert that
    b.invert();
    b.clipTo(a);
    b.invert();
    // add the remaining polygons in B into A
    a.build(b.getPolygons());

    return new BspTree(a.getPolygons());
  };

  subtract = (bspInstance) => {
    const a = new BspNode(this.clone().getPolygons());
    const b = new BspNode(bspInstance.getPolygons());

    a.invert();
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.getPolygons());
    a.invert();
    return new BspTree(a.getPolygons());
  };

  intersect = (bspInstance) => {
    const a = new BspNode(this.clone().getPolygons());
    const b = new BspNode(bspInstance.getPolygons());

    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    a.clipTo(a);
    a.build(b.getPolygons());
    a.invert();
    return new BspTree(a.getPolygons());
  };
}
