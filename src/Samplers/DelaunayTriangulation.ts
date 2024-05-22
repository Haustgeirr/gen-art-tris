import { Point } from '@/Utils/Types';

export type Triangulation = [Point, Point, Point];

type Circle = {
  center: Point;
  radius: number;
};

export class DelaunayTriangulation {
  private points: Point[] = [];
  private triangulation: Triangulation[] = [];

  constructor(points: Point[]) {
    this.points = points;
  }

  triangulate(): Triangulation[] {
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
      const badTriangles: Triangulation[] = [];

      this.triangulation.forEach((triangle) => {
        const [vertexA, vertexB, vertexC] = triangle;
        const { center, radius } = this.calculateCircumcircle(vertexA, vertexB, vertexC);

        if (Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2)) < radius) {
          badTriangles.push(triangle);
        }
      });

      console.log('🚀 ~ DelaunayTriangulation ~ this.points.splice ~ point:', point);
      console.log('🚀 ~ DelaunayTriangulation ~ triangulate ~ this.triangulation:', this.triangulation);
      console.log('🚀 ~ DelaunayTriangulation ~ this.points.forEach ~ badTriangles:', badTriangles);

      const polygon: [Point, Point][] = [];

      badTriangles.forEach((triangle) => {
        const [vertexA, vertexB, vertexC] = triangle;

        if (
          !badTriangles.some(
            (otherTriangle) =>
              otherTriangle !== triangle && [vertexA, vertexB, vertexC].some((vertex) => otherTriangle.includes(vertex))
          )
        ) {
          polygon.push([vertexA, vertexB]);
          polygon.push([vertexB, vertexC]);
          polygon.push([vertexC, vertexA]);
        }
      });

      console.log('🚀 ~ DelaunayTriangulation ~ this.points.splice ~ polygon:', polygon);

      // badTriangles.forEach((triangle) => {
      //   this.triangulation = this.triangulation.filter((otherTriangle) => otherTriangle !== triangle);
      // });

      polygon.forEach(([vertexA, vertexB]) => {
        this.triangulation.push([vertexA, vertexB, point]);
      });
    });

    // this.triangulation = this.triangulation.filter(
    //   ([vertexA, vertexB, vertexC]) =>
    //     !this.triangulation[0].some((vertex) => [vertexA, vertexB, vertexC].includes(vertex))
    // );

    return this.triangulation;
  }

  private calculateCircumcircle(A: Point, B: Point, C: Point): Circle {
    // Calculate the midpoints of AB and AC
    const midAB: Point = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
    const midAC: Point = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };

    // Calculate the slopes of AB and AC
    const slopeAB = (B.y - A.y) / (B.x - A.x);
    const slopeAC = (C.y - A.y) / (C.x - A.x);

    // Calculate the slopes of the perpendicular bisectors
    const perpSlopeAB = -1 / slopeAB;
    const perpSlopeAC = -1 / slopeAC;

    // Handle the cases where slopes are infinite (vertical lines)
    let circumcenterX, circumcenterY;

    if (slopeAB === 0) {
      // AB is a horizontal line
      circumcenterX = midAB.x;
      circumcenterY = perpSlopeAC * (circumcenterX - midAC.x) + midAC.y;
    } else if (slopeAC === 0) {
      // AC is a horizontal line
      circumcenterX = midAC.x;
      circumcenterY = perpSlopeAB * (circumcenterX - midAB.x) + midAB.y;
    } else if (isFinite(perpSlopeAB) && isFinite(perpSlopeAC)) {
      // Solve for the intersection of the two perpendicular bisectors
      const interceptAB = midAB.y - perpSlopeAB * midAB.x;
      const interceptAC = midAC.y - perpSlopeAC * midAC.x;

      circumcenterX = (interceptAC - interceptAB) / (perpSlopeAB - perpSlopeAC);
      circumcenterY = perpSlopeAB * circumcenterX + interceptAB;
    } else {
      throw new Error('Error calculating circumcenter: triangle sides are collinear.');
    }

    const circumcenter: Point = { x: circumcenterX, y: circumcenterY };
    const circumradius = Math.sqrt(Math.pow(circumcenter.x - A.x, 2) + Math.pow(circumcenter.y - A.y, 2));

    return {
      center: circumcenter,
      radius: circumradius,
    };
  }

  private constructTriangleFromIncircle(incenter: Point, inradius: number): Triangulation {
    const angleA = (3 * Math.PI) / 2;
    const angleB = Math.PI / 6;
    const angleC = (5 * Math.PI) / 6;

    const radius = inradius > 0 ? inradius : 100;

    const tangentPointA = this.getTangentPoint(incenter, radius, angleA);
    const tangentPointB = this.getTangentPoint(incenter, radius, angleB);
    const tangentPointC = this.getTangentPoint(incenter, radius, angleC);

    const tangentGradientA = (tangentPointA.y - incenter.y) / (tangentPointA.x - incenter.x);
    const tangentGradientB = (tangentPointB.y - incenter.y) / (tangentPointB.x - incenter.x);
    const tangentGradientC = (tangentPointC.y - incenter.y) / (tangentPointC.x - incenter.x);

    const tangentNormalA = -1 / tangentGradientA;
    const tangentNormalB = -1 / tangentGradientB;
    const tangentNormalC = -1 / tangentGradientC;

    const lineA: [number, number, number] = [tangentNormalA, -1, tangentPointA.y - tangentNormalA * tangentPointA.x];
    const lineB: [number, number, number] = [tangentNormalB, -1, tangentPointB.y - tangentNormalB * tangentPointB.x];
    const lineC: [number, number, number] = [tangentNormalC, -1, tangentPointC.y - tangentNormalC * tangentPointC.x];

    const vertexA = this.findIntersectionPoint(lineB, lineC);
    const vertexB = this.findIntersectionPoint(lineA, lineC);
    const vertexC = this.findIntersectionPoint(lineA, lineB);

    return [vertexA, vertexB, vertexC];
  }

  private makeSuperTriangle(): Triangulation {
    const minX = Math.min(...this.points.map((point) => point.x));
    const minY = Math.min(...this.points.map((point) => point.y));
    const maxX = Math.max(...this.points.map((point) => point.x));
    const maxY = Math.max(...this.points.map((point) => point.y));

    const dx = maxX - minX;
    const dy = maxY - minY;
    const deltaMax = Math.max(dx, dy);
    const midx = (minX + maxX) / 2;
    const midy = (minY + maxY) / 2;

    return this.constructTriangleFromIncircle({ x: midx, y: midy }, deltaMax);
  }

  private findIntersectionPoint(line1: [number, number, number], line2: [number, number, number]): Point {
    const [a1, b1, c1] = line1;
    const [a2, b2, c2] = line2;
    const determinant = a1 * b2 - a2 * b1;

    if (determinant === 0) throw new Error('Lines do not intersect');

    const x = -(b2 * c1 - b1 * c2) / determinant;
    const y = -(a1 * c2 - a2 * c1) / determinant;

    return { x, y };
  }

  private getTangentPoint(center: Point, radius: number, angle: number): Point {
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y - radius * Math.sin(angle),
    };
  }
}
