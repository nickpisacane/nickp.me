export default class Vec2 {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public addTo(vec: Vec2) {
    this.x += vec.x;
    this.y += vec.y;
  }

  public subFrom(vec: Vec2) {
    this.x -= vec.x;
    this.y -= vec.y;
  }

  public add(vec: Vec2): Vec2 {
    return new Vec2(this.x + vec.x, this.y + vec.y);
  }

  public sub(vec: Vec2): Vec2 {
    return new Vec2(this.x - vec.x, this.y - vec.y);
  }

  public addScalarTo(scalar: number) {
    this.x += scalar;
    this.y += scalar;
  }

  public subScalarFrom(scalar: number) {
    this.addScalarTo(-scalar);
  }

  public addScalar(scalar: number): Vec2 {
    return new Vec2(this.x + scalar, this.y + scalar);
  }

  public subScalar(scalar: number) {
    return this.addScalar(-scalar);
  }

  public scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  public mul(scalar: number) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  public dot(vec: Vec2): number {
    return this.x * vec.x + this.y * vec.y;
  }

  public mag(): number {
    return Math.sqrt(this.dot(this));
  }
}
