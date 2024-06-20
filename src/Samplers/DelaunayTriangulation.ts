import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Edge } from '@/Objects/Edge';

export type Circle = {
  center: Point;
  radius: number;
};

export class DelaunayTriangulation {
  private points: Point[] = [];
  private triangulation: Triangle[] = [];
  private superTriangle: Triangle;
  private edgeToTrianglesMap: Map<number, Triangle[]>;

  constructor(points: Point[]) {
    this.points = points;
    this.superTriangle = this.makeSuperTriangle();
    this.edgeToTrianglesMap = new Map();
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
            otherTriangle.getEdges().some((otherEdge) => badEdge.equals(otherEdge))
          );

          if (!isShared) {
            polygon.push(badEdge);
          }
        });
      });

      badTriangles.forEach((triangle) => {
        this.triangulation = this.triangulation.filter((otherTriangle) => !triangle.equals(otherTriangle));
      });

      polygon.forEach((poly) => {
        const [vertexA, vertexB] = poly.getVertices();

        const newTriangle = new Triangle(vertexA, vertexB, point);
        const edges = this.getSortedEdges(newTriangle);

        edges.forEach((edge) => {
          const edgeKey = 0;

          if (!this.edgeToTrianglesMap.has(edgeKey)) {
            this.edgeToTrianglesMap.set(edgeKey, []);
          }
          this.edgeToTrianglesMap.get(edgeKey)!.push(newTriangle); // Push the index of the current triangle
        });

        this.triangulation.push(newTriangle);
      });
    });

    this.triangulation = this.triangulation.filter(
      (triangle) => !triangle.getVertices().some((vertex) => this.superTriangle.includes(vertex))
    );

    return this.triangulation;
  }

  getEdgeToTrianglesMap(): Map<number, Triangle[]> {
    return this.edgeToTrianglesMap;
  }

  private getSortedEdges(triangle: Triangle): Edge[] {
    const [v0, v1, v2] = triangle.getVertices().sort((a, b) => a.x - b.x);

    const edges = [new Edge(v0, v1), new Edge(v1, v2), new Edge(v2, v0)];

    return edges;
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
