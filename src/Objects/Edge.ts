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
}
