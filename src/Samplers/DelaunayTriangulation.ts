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
  private boundaryPolygon: Point[] = [];

  constructor(points: Point[]) {
    this.points = points;
    this.superTriangle = this.makeSuperTriangle();
  }

  // Bowyer-Watson algorithm
  public triangulate() {
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

    this.triangles.forEach((triangle) => {
      const externalPoints: Point[] = [];

      // check if any of the vertices are part of the super triangle
      // if so add the other vertex of the edge to the external points
      // and remove the triangle from the final list
      triangle.getVertices().forEach((vertex) => {
        if (this.superTriangle.includes(vertex)) {
          const [vertexA, vertexB] = triangle
            .getEdges()
            .find((edge) => !edge.includes(vertex))!
            .getVertices();
          externalPoints.push(vertexA, vertexB);
        }
      });

      this.boundaryPolygon.push(externalPoints.filter((point) => !externalPoints.includes(point))[0]);
    });

    this.triangles = this.triangles.filter(
      (triangle) => !triangle.getVertices().some((vertex) => this.superTriangle.includes(vertex))
    );

    this.triangles.forEach((triangle) => {
      this.edges.push(...triangle.getEdges());
    });

    return this.triangles;
  }

  public getEdges() {
    return this.edges;
  }

  public getBoundaryPolygon() {
    return this.boundaryPolygon;
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
