export default class Vector {
  constructor(x, y, z) {
    // we can accept an array of coordinates
    if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    } else {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  clone = () => {
    const { x, y, z } = this;
    return new Vector(x, y, z);
  };

  negate = () => {
    const { x, y, z } = this;
    return new Vector(-x, -y, -z);
  };

  multiply = (value) => {
    const { x, y, z } = this;
    return new Vector(x * value, y * value, z * value);
  };

  divedBy = (value) => {
    const { x, y, z } = this;
    return new Vector(x / value, y / value, z / value);
  };

  add = (vector) => {
    const { x, y, z } = this;
    return new Vector(x + vector.x, y + vector.y, z + vector.z);
  };

  subtract = (vector) => {
    const { x, y, z } = this;
    return new Vector(x - vector.x, y - vector.y, z - vector.z);
  };

  //   Get dot-product of two vectors
  dot = (vector) => {
    const { x, y, z } = this;
    return new Vector(x * vector.x, y * vector.y, z * vector.z);
  };

  lerp = (a, t) => {
    return this.plus(a.subtract(this).multiply(t));
  };

  // The magnitude of a vector is the distance between the initial point and the end point
  // This can be discovered by square-root the dot-product of itself
  magnitude = () => {
    return Math.sqrt(this.dot(this));
  };

  // Find a unit vector with the same direction as the vector
  unitVector = () => {
    return this.divedBy(this.magnitude());
  };

  //   TODO: found this on the internet, wtf is it doing
  cross = (vector) => {
    const { x, y, z } = this;

    return new Vector(
      y * vector.z - z * vector.y,
      z * vector.x - x * vector.z,
      x * vector.y - y * vector.x
    );
  };
}
