import { EPSILON } from '@/Utils/Values';

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public equals(p: Point): boolean {
    return Math.abs(this.x - p.x) < EPSILON && Math.abs(this.y - p.y) < EPSILON;
  }

  public toObject(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  public static convertToPoint(input: Point | { x: number; y: number }): Point {
    if (input instanceof Point) {
      return input;
    }

    return new Point(input.x, input.y);
  }

  public distance(p: Point): number {
    return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2));
  }

  public directionTo(p: Point): Point {
    return new Point(p.x - this.x, p.y - this.y);
  }

  public normalize(): Point {
    const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Point(this.x / magnitude, this.y / magnitude);
  }
}
