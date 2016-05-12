import {CIRCLE_RADIUS} from './utils';

/*
  base element of our Application
  use for all calculations
 */
export class Vector {
  static subtract(vec1, vec2) {
    return new Vector(
      vec1.x - vec2.x,
      vec1.y - vec2.y
    );
  }

  static angleBetween(vec1, vec2) {
    return vec1.angleTo(vec2);
  }

  static add(vec1, vec2) {
    return new Vector(
      vec1.x + vec2.x,
      vec1.y + vec2.y
    );
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  subtract(vec) {
    this.x = this.x - vec.x;
    this.y = this.y - vec.y;
    return this;
  }

  negative() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  angleTo(vec) {
    return Math.acos(this.dot(vec) / (this.length() * vec.length()));
  }

  divide(num) {
    this.x = this.x / num;
    this.y = this.y / num;
    return this;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
}

// A - D = C - B => -D = C - B - A
export const findVertices = ([a, b, c]) => {
  const variants = [
    [a, b, c],
    [a, c, b],
    [b, c, a]
  ];

  return variants.map(([_a, _b, _c]) => {
    return [
      _a, _c, _b,
      Vector.subtract(_c, _b).subtract(_a).negative()
    ];
  });
};

// ABCD; S = AB * AD + sinA
export const calculateAreaOfParallelogram = ([a, b,, d]) => {
  const ab = Vector.subtract(b, a);
  const ad = Vector.subtract(d, a);

  const sin = Math.sin(Vector.angleBetween(ab, ad));

  return ab.length() * ad.length() * sin;
};

// S = PI * r² => r = sqrt(S / PI)
export const calculateCircleRadius = area => Math.sqrt(area / Math.PI);

// ABCD; c = (AC / 2 | BD / 2)
export const findCenterOfParallelogram = ([a,, c]) => {
  return Vector.add(a, c).divide(2);
};

export const findMovingCircle = (vertices, point) => {
  return vertices.find(vertex => {
    return (
      Vector.subtract(vertex, point).length() < CIRCLE_RADIUS
    );
  });
};
