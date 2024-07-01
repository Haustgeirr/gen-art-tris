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

  public distance(p: Point): number {
    return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2));
  }

  public directionTo(p: Point): Point {
    return Point.normalize(new Point(p.x - this.x, p.y - this.y));
  }

  public static convertToPoint(input: Point | { x: number; y: number }): Point {
    if (input instanceof Point) {
      return input;
    }

    return new Point(input.x, input.y);
  }

  public static dot(p1: Point, p2: Point): number {
    console.log(p1, p2);
    return p1.x * p2.x + p1.y * p2.y;
  }

  public static normalize(p: Point): Point {
    const magnitude = Math.sqrt(p.x * p.x + p.y * p.y);
    return new Point(p.x / magnitude, p.y / magnitude);
  }

  public static pointIsInPolygon(p: Point, polygon: Point[]): boolean {
    let isInside = false;

    let minX = polygon[0].x,
      maxX = polygon[0].x;
    let minY = polygon[0].y,
      maxY = polygon[0].y;

    for (let n = 1; n < polygon.length; n++) {
      const q = polygon[n];
      minX = Math.min(q.x, minX);
      maxX = Math.max(q.x, maxX);
      minY = Math.min(q.y, minY);
      maxY = Math.max(q.y, maxY);
    }

    if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
      return false;
    }

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (
        polygon[i].y > p.y != polygon[j].y > p.y &&
        p.x < ((polygon[j].x - polygon[i].x) * (p.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) + polygon[i].x
      ) {
        isInside = !isInside;
      }
    }

    return isInside;
  }
}
