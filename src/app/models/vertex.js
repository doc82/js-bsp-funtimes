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

  // Create a new vertex between this vertex and `another` by linearly interpolating all properties
  // TODO: as we add additional properties to the Vertex class, we need to improve this function to pass in those values
  interpolate = (other, t) => {
    const { pos, normal } = this;
    return new Vertex(pos.lerp(other.pos, t), normal.lerp(other.normal, t));
  };

  // Invert all orientations. This is called when a polygon is flipped
  flip = () => {
    this.normal = this.normal.negate();
  };
}
