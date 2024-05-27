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

  constructor(points: Point[]) {
    this.points = points;
  }

  triangulate(): Triangle[] {
    // Bowyer-Watson algorithm
    // pointList is a set of coordinates defining the points to be triangulated
    // triangulation := empty triangle mesh data structure
    // add super-triangle to triangulation // must be large enough to completely contain all the points in pointList

    // for each point in pointList do // add all the points one at a time to the triangulation
    //     badTriangles := empty set

    //     for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
    //         if point is inside circumcircle of triangle
    //             add triangle to badTriangles
    //     polygon := empty set

    //     for each triangle in badTriangles do // find the boundary of the polygonal hole
    //         for each edge in triangle do
    //             if edge is not shared by any other triangles in badTriangles
    //                 add edge to polygon

    // --- we are here
    //     for each triangle in badTriangles do // remove them from the data structure
    //         remove triangle from triangulation

    //     for each edge in polygon do // re-triangulate the polygonal hole
    //         newTri := form a triangle from edge to point
    //         add newTri to triangulation

    // for each triangle in triangulation // done inserting points, now clean up
    //     if triangle contains a vertex from original super-triangle
    //         remove triangle from triangulation
    // return triangulation

    this.triangulation.push(this.makeSuperTriangle());

    this.points.forEach((point) => {
      const badTriangles: Triangle[] = [];

      this.triangulation.forEach((triangle) => {
        // const [vertexA, vertexB, vertexC] = triangle.getVertices();
        const { center, radius } = triangle.getCircumcircle();

        if (Point.distance(center, point) < radius) {
          badTriangles.push(triangle);
        }
      });

      console.log('🚀 ~ DelaunayTriangulation ~ this.points.splice ~ point:', point);
      console.log('🚀 ~ DelaunayTriangulation ~ triangulate ~ this.triangulation:', this.triangulation);
      console.log('🚀 ~ DelaunayTriangulation ~ this.points.forEach ~ badTriangles:', badTriangles);

      const polygon: Edge[] = [];

      badTriangles.forEach((triangle) => {
        const [vertexA, vertexB, vertexC] = triangle.getVertices();

        // check if any edges are not shared by any other triangles in badTriangles
        if (
          badTriangles.every(
            (badTriangle) =>
              badTriangle.equals(triangle) ||
              ![[vertexA, vertexB] as Edge, [vertexB, vertexC] as Edge, [vertexC, vertexA] as Edge].some((edge) =>
                [
                  [badTriangle.vertexA, badTriangle.vertexB] as Edge,
                  [badTriangle.vertexB, badTriangle.vertexC] as Edge,
                  [badTriangle.vertexC, badTriangle.vertexA] as Edge,
                ].some((otherEdge) => this.checkEdgesAreEqual(edge, otherEdge))
              )
          )
        ) {
          polygon.push([vertexA, vertexB]);
          polygon.push([vertexB, vertexC]);
          polygon.push([vertexC, vertexA]);
        }
      });

      badTriangles.forEach((triangle) => {
        // this.triangulation = this.triangulation.filter((otherTriangle) => !triangle.equals(otherTriangle));
      });

      polygon.forEach(([vertexA, vertexB]) => {
        this.triangulation.push(new Triangle(vertexA, vertexB, point));
      });
    });

    // this.triangulation = this.triangulation.filter(
    //   // ([vertexA, vertexB, vertexC]) =>
    //   //   !this.triangulation[0].some((vertex) => [vertexA, vertexB, vertexC].includes(vertex))
    //   ([vertexA, vertexB, vertexC]) =>
    //     !this.triangulation[0].some((vertex) => vertexA === vertex || vertexB === vertex || vertexC === vertex)
    // );

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
