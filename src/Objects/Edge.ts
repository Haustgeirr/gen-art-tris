import { Point } from '@/Objects/Point';

export class Edge {
  vertexA: Point;
  vertexB: Point;

  constructor(p1: Point, p2: Point) {
    [this.vertexA, this.vertexB] = [p1, p2].sort((a, b) => a.x - b.x);
  }

  public getVertices(): Point[] {
    return [this.vertexA, this.vertexB];
  }

  public equals(edgeB: Edge): boolean {
    return this.vertexA.equals(edgeB.vertexA) && this.vertexB.equals(edgeB.vertexB);
  }

  public getMidpoint(): Point {
    return new Point((this.vertexA.x + this.vertexB.x) / 2, (this.vertexA.y + this.vertexB.y) / 2);
  }

  public includes(p: Point): boolean {
    return this.vertexA.equals(p) || this.vertexB.equals(p);
  }
}
