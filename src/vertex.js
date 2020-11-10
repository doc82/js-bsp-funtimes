import Vector from './vector';

// Represents a Vertex of a polygon, and can be overriden to provide additional information
export default class Vertex {
  constructor(pos, normal) {
    this.pos = new Vector(pos);
    this.normal = new Vector(normal);
  }

  clone = () => {
    const { pos, normal } = this;
    return new Vertex(pos.clone(), normal.clone());
  };

  // Invert all orientations. This is called when a polygon is flipped
  flip = () => {
    this.normal = this.normal.negate();
  };

  // Create a new vertex between this vertex and `other` by linearly  interpolating all properties
  // Subclasses should override this to interpolate additional properties.
  interpolate = (other, t) => {
    const { pos, normal } = this;
    return new Vertex(pos.lerp(other.pos, t), normal.lerp(other.normal, t));
  };
}
