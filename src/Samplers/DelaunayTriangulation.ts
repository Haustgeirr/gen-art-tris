import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Edge } from '@/Objects/Edge';

export type Circle = {
  center: Point;
  radius: number;
};

export class DelaunayTriangulation {
  private points: Point[] = [];
  private triangles: Triangle[] = [];
  private superTriangle: Triangle;
  private edges: Edge[] = [];

  constructor(points: Point[]) {
    this.points = points;
    this.superTriangle = this.makeSuperTriangle();
  }

  // Bowyer-Watson algorithm
  triangulate() {
    this.triangles.push(this.superTriangle);

    this.points.forEach((point) => {
      const badTriangles: Triangle[] = [];

      this.triangles.forEach((triangle) => {
        const { center, radius } = triangle.getCircumcircle();

        if (center.distance(point) < radius) {
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
            otherTriangle.getEdges().some((otherEdge) => badEdge.equals(otherEdge))
          );

          if (!isShared) {
            polygon.push(badEdge);
          }
        });
      });

      badTriangles.forEach((triangle) => {
        this.triangles = this.triangles.filter((otherTriangle) => !triangle.equals(otherTriangle));
      });

      polygon.forEach((poly) => {
        const [vertexA, vertexB] = poly.getVertices();
        const newTriangle = new Triangle(vertexA, vertexB, point);

        this.triangles.push(newTriangle);
      });
    });

    this.triangles = this.triangles.filter(
      (triangle) => !triangle.getVertices().some((vertex) => this.superTriangle.includes(vertex))
    );

    this.triangles.forEach((triangle) => {
      this.edges.push(...triangle.getEdges());
    });

    return this.triangles;
  }

  getEdges() {
    return this.edges;
  }

  private makeSuperTriangle() {
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
