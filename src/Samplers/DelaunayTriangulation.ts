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
        const newTriangle = new Triangle(vertexA, vertexB, point);
        const edges = this.getSortedEdges(newTriangle);

        edges.forEach((edge) => {
          const edgeKey = this.hashFloats(edge[0].x, edge[0].y, edge[1].x, edge[1].y);

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

    const edges: Edge[] = [
      [v0, v1],
      [v1, v2],
      [v2, v0],
    ];

    return edges;
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

  private hashFloats(f1: number, f2: number, f3: number, f4: number): number {
    const buffer = new ArrayBuffer(32); // 4 floats * 8 bytes each (Float64)
    const view = new DataView(buffer);

    // Store the float numbers into the buffer
    view.setFloat64(0, f1);
    view.setFloat64(8, f2);
    view.setFloat64(16, f3);
    view.setFloat64(24, f4);

    // Basic hash function (djb2)
    let hash = 5381;
    for (let i = 0; i < buffer.byteLength; i++) {
      hash = (hash * 33) ^ view.getUint8(i);
    }

    // Ensure the hash as an unsigned 32-bit integer
    return hash >>> 0;
  }
}
