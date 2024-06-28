import { Point } from './Point';
import { Edge } from '@/Objects/Edge';

export class Triangle {
  vertexA: Point;
  vertexB: Point;
  vertexC: Point;

  constructor(vertexA: Point, vertexB: Point, vertexC: Point) {
    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.vertexC = vertexC;
  }

  public getVertices(): Point[] {
    return [this.vertexA, this.vertexB, this.vertexC];
  }

  public v1(): Point {
    return this.vertexA;
  }

  public v2(): Point {
    return this.vertexB;
  }

  public v3(): Point {
    return this.vertexC;
  }

  public getEdges(): Edge[] {
    return [
      new Edge(this.vertexA, this.vertexB),
      new Edge(this.vertexB, this.vertexC),
      new Edge(this.vertexC, this.vertexA),
    ];
  }

  public includes(point: Point): boolean {
    const [A, B, C] = this.getVertices();

    if (A.equals(point) || B.equals(point) || C.equals(point)) {
      return true;
    }
    return false;
  }

  public hasCommonEdge(triangleB: Triangle): boolean {
    return this.getEdges().some((edgeA) => triangleB.getEdges().some((edgeB) => edgeA.equals(edgeB)));
  }

  public getCommonEdge(triangleB: Triangle): Edge | undefined {
    return this.getEdges().find((edgeA) => triangleB.getEdges().some((edgeB) => edgeA.equals(edgeB)));
  }

  public getSharedEdge(triangleB: Triangle): Edge | undefined {
    return this.getEdges().find((edgeA) => triangleB.getEdges().some((edgeB) => edgeA.equals(edgeB)));
  }

  public getCircumcircle(): { center: Point; radius: number } {
    const [A, B, C] = this.getVertices();

    const determinant = A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y);

    if (determinant === 0) {
      throw new Error('Error calculating circumcenter: triangle sides are collinear.');
    }

    // Calculate the midpoints of AB and AC
    const midAB = new Point((A.x + B.x) / 2, (A.y + B.y) / 2);
    const midAC = new Point((A.x + C.x) / 2, (A.y + C.y) / 2);

    // Calculate the slopes of AB and AC
    const slopeAB = (B.y - A.y) / (B.x - A.x);
    const slopeAC = (C.y - A.y) / (C.x - A.x);

    // Calculate the slopes of the perpendicular bisectors
    const perpSlopeAB = -1 / slopeAB;
    const perpSlopeAC = -1 / slopeAC;

    // Handle the cases where slopes are infinite (vertical lines)
    let circumcenterX, circumcenterY;

    if (!isFinite(perpSlopeAB)) {
      // AB is a horizontal line
      circumcenterX = midAB.x;
      circumcenterY = perpSlopeAC * (circumcenterX - midAC.x) + midAC.y;
    } else if (!isFinite(perpSlopeAC)) {
      // AC is a horizontal line
      circumcenterX = midAC.x;
      circumcenterY = perpSlopeAB * (circumcenterX - midAB.x) + midAB.y;
    } else {
      // Solve for the intersection of the two perpendicular bisectors
      const interceptAB = midAB.y - perpSlopeAB * midAB.x;
      const interceptAC = midAC.y - perpSlopeAC * midAC.x;

      circumcenterX = (interceptAC - interceptAB) / (perpSlopeAB - perpSlopeAC);
      circumcenterY = perpSlopeAB * circumcenterX + interceptAB;
    }

    const circumcenter = new Point(circumcenterX, circumcenterY);
    const circumradius = Math.sqrt(Math.pow(circumcenter.x - A.x, 2) + Math.pow(circumcenter.y - A.y, 2));

    return {
      center: circumcenter,
      radius: circumradius,
    };
  }

  public static constructFromIncircle(incenter: Point, inradius: number): Triangle {
    const radius = inradius > 0 ? inradius : 200;
    const sideLength = 2 * radius * Math.sqrt(3);
    const height = 3 * radius;

    const vertexA = new Point(incenter.x - sideLength / 2, incenter.y - radius);
    const vertexB = new Point(incenter.x + sideLength / 2, incenter.y - radius);
    const vertexC = new Point(incenter.x, incenter.y - radius + height);

    return new Triangle(vertexA, vertexB, vertexC);
  }

  public equals(triangleB: Triangle): boolean {
    const verticesA = [this.vertexA, this.vertexB, this.vertexC].sort((a, b) => a.x - b.x);
    const verticesB = [triangleB.vertexA, triangleB.vertexB, triangleB.vertexC].sort((a, b) => a.x - b.x);

    return verticesA.every((vertex, index) => vertex.equals(verticesB[index]));
  }

  public sharesEdge(triangleB: Triangle): boolean {
    return this.getEdges().some((edgeA) => triangleB.getEdges().some((edgeB) => edgeA.equals(edgeB)));
  }
}
