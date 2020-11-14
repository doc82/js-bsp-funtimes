import { Bsp, BspNode } from '../bsp';

const csgUtilityService = {
  flipModels: (polygons) => {
    return polygons.map((p) => {
      p.flip();
    });
  },
  inverseModels: () => {
    const clone = this.clone();
    clone.flipModels();
    return clone;
  },

  unionTree: (bspInstanceA, bspInstanceB) => {
    // We need to remove everything in A inside B, and everything in B inside A
    // Then we combine polygons from a and B into a new tree
    const a = new BspNode(bspInstanceB.clone().getModels());
    const b = new BspNode(bspInstanceA.getModels());

    // We need to deal with overlapping coplanar polygons in both trees, so we clip the inverse of B against A
    //  Remove B from A, and A from B
    a.clipTo(b);
    b.clipTo(a);
    // Invert B, and clip A, then Invert that
    b.invert();
    b.clipTo(a);
    b.invert();
    // add the remaining polygons in B into A
    a.build(b.getModels());

    return new Bsp(a.getModels());
  },

  subtractTree: (bspInstanceA, bspInstanceB) => {
    const a = new BspNode(bspInstanceB.clone().getModels());
    const b = new BspNode(bspInstanceA.getModels());

    a.invert();
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.getModels());
    a.invert();
    return new Bsp(a.getModels());
  },

  intersectTree: (bspInstanceA, bspInstanceB) => {
    const a = new BspNode(bspInstanceB.clone().getModels());
    const b = new BspNode(bspInstanceA.getModels());

    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    a.clipTo(a);
    a.build(b.getModels());
    a.invert();
    return new Bsp(a.getModels());
  }
};

export default csgUtilityService;
