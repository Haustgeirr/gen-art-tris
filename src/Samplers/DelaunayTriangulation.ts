import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Edge } from '@/Objects/Edge';

// TODO: remove edgeToTrianglesMap
// TODO: return edges as well as triangles
// TODO: return Triangulation object

export type Circle = {
  center: Point;
  radius: number;
};

export class DelaunayTriangulation {
  private points: Point[] = [];
  private triangulation: Triangle[] = [];
  private superTriangle: Triangle;
  private edgeToTrianglesMap: Map<number, number[]>;
  private edges: Edge[] = [];

  constructor(points: Point[]) {
    this.points = points;
    this.superTriangle = this.makeSuperTriangle();
    this.edgeToTrianglesMap = new Map();
  }

  // Bowyer-Watson algorithm
  triangulate() {
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

        this.triangulation.push(newTriangle);
      });
    });

    this.triangulation = this.triangulation.filter(
      (triangle) => !triangle.getVertices().some((vertex) => this.superTriangle.includes(vertex))
    );

    this.makeEdgesToTriangleMap();

    return this.triangulation;
  }

  private makeEdgesToTriangleMap() {
    this.triangulation.forEach((triangle, index) => {
      const edges = this.getSortedEdges(triangle);

      edges.forEach((edge) => {
        let edgeIndex = this.edges.findIndex((e) => e.equals(edge));

        if (edgeIndex === -1) {
          this.edges.push(edge);
          this.edgeToTrianglesMap.set(this.edges.length - 1, []);
          edgeIndex = this.edges.length - 1;
        }

        this.edgeToTrianglesMap.get(edgeIndex)!.push(index);
      });
    });
  }

  getEdgeToTrianglesMap() {
    return this.edgeToTrianglesMap;
  }

  getEdges() {
    return this.edges;
  }

  private getSortedEdges(triangle: Triangle) {
    const [v0, v1, v2] = triangle.getVertices().sort((a, b) => a.x - b.x);

    const edges = [new Edge(v0, v1), new Edge(v1, v2), new Edge(v2, v0)];

    return edges;
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
