import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';

export type Circle = {
  center: Point;
  radius: number;
};

type Edge = [Point, Point];

export class DelaunayTriangulation {
  private points: Point[] = [];
  private triangulation: Triangle[] = [];
  private superTriangle: Triangle;

  constructor(points: Point[]) {
    this.points = points;
    this.superTriangle = this.makeSuperTriangle();
  }

  // Bowyer-Watson algorithm
  triangulate(): Triangle[] {
    this.triangulation.push(this.superTriangle);

    this.points.forEach((point) => {
      const badTriangles: Triangle[] = [];

      this.triangulation.forEach((triangle) => {
        const { center, radius } = triangle.getCircumcircle();

        if (Point.distance(center, point) < radius) {
          badTriangles.push(triangle);
        }
      });

      const polygon: Edge[] = [];

      badTriangles.forEach((badTriangle, index) => {
        // check if any edges are not shared by any other triangles in badTriangles
        const badEdges = badTriangle.getEdges();
        const otherTriangles = [...badTriangles];
        otherTriangles.splice(index, 1);

        badEdges.forEach((badEdge) => {
          const isShared = otherTriangles.some((otherTriangle) =>
            otherTriangle.getEdges().some((otherEdge) => this.checkEdgesAreEqual(badEdge, otherEdge))
          );

          if (!isShared) {
            polygon.push(badEdge);
          }
        });
      });

      badTriangles.forEach((triangle) => {
        this.triangulation = this.triangulation.filter((otherTriangle) => !triangle.equals(otherTriangle));
      });

      polygon.forEach(([vertexA, vertexB]) => {
        this.triangulation.push(new Triangle(vertexA, vertexB, point));
      });
    });

    this.triangulation = this.triangulation.filter(
      (triangle) => !triangle.getVertices().some((vertex) => this.superTriangle.includes(vertex))
    );

    return this.triangulation;
  }

  private checkEdgesAreEqual(edgeA: Edge, edgeB: Edge): boolean {
    const [A1, B1] = edgeA;
    const [A2, B2] = edgeB;

    return (A1.equals(A2) && B1.equals(B2)) || (A1.equals(B2) && B1.equals(A2));
  }

  private makeSuperTriangle(): Triangle {
    const minX = Math.min(...this.points.map((point) => point.x));
    const minY = Math.min(...this.points.map((point) => point.y));
    const maxX = Math.max(...this.points.map((point) => point.x));
    const maxY = Math.max(...this.points.map((point) => point.y));

    const dx = maxX - minX;
    const dy = maxY - minY;
    const deltaMax = Math.max(dx, dy);
    const midx = (minX + maxX) / 2;
    const midy = (minY + maxY) / 2;

    return Triangle.constructFromIncircle(new Point(midx, midy), deltaMax);
  }
}
