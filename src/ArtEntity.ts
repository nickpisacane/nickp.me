import Vec2 from './Vec2';
import * as math from './math';

export class ArtEntity {
  public color: string;

  constructor(color: string) {
    this.color = color;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    center: Vec2,
    bounds: Vec2,
  ): void {
    // Override
  }
}

export class CircleEntity extends ArtEntity {
  public radius: number;
  public position: Vec2;

  constructor(color: string, radius: number, position: Vec2) {
    super(color);
    this.radius = radius;
    this.position = position;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    center: Vec2,
    bounds: Vec2,
  ): void {
    const {x, y} = math.normalizePosition(this.position, center);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

export class SquareEntity extends ArtEntity {
  public size: number;
  public position: Vec2;

  constructor(color: string, size: number, position: Vec2) {
    super(color);
    this.size = size;
    this.position = position;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    center: Vec2,
    bounds: Vec2,
  ): void {
    const {x, y} = math
      .normalizePosition(this.position, center)
      .subScalar(this.size / 2);

    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.size, this.size);
  }
}

export class TriangleEntity extends ArtEntity {
  public size: number;
  public position: Vec2;

  constructor(color: string, size: number, position: Vec2) {
    super(color);
    this.size = size;
    this.position = position;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    center: Vec2,
    bounds: Vec2,
  ): void {
    const {x, y} = math
      .normalizePosition(this.position, center)
      .addScalar(this.size / 2);

    ctx.fillStyle = this.color;
    ctx.moveTo(x, y);
    // move to bottom left angle
    ctx.lineTo(x - this.size, y);
    // move to top angle
    ctx.lineTo(x - this.size / 2, y - this.size);
    // Close the loop
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
  }
}

export class PathEntity extends ArtEntity {
  public width: number;
  public begin: Vec2;
  public end: Vec2;

  constructor(color: string, width: number, begin: Vec2, end: Vec2) {
    super(color);
    this.width = width;
    this.begin = begin;
    this.end = end;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    center: Vec2,
    bounds: Vec2,
  ): void {
    const begin = math.normalizePosition(this.begin, center);
    const end = math.normalizePosition(this.end, center);

    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }
}
