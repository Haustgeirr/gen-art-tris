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

  public static distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
}
