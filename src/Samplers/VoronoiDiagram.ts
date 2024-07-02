import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Triangulation } from '@/Objects/Triangulation';
import { Edge } from '@/Objects/Edge';

export class VoronoiDiagram {
  private points: Point[] = [];
  private triangulation: Triangulation;
  private edges: Edge[] = [];
  private boundaryPolygon: Point[] = [];

  constructor(triangulation: Triangulation | Triangle[], boundaryPolygon: Point[] = []) {
    if (triangulation instanceof Triangulation) {
      this.triangulation = triangulation;
    } else {
      this.triangulation = new Triangulation(triangulation);
    }

    this.boundaryPolygon = boundaryPolygon;
  }

  generate() {
    this.triangulation.getTriangles().forEach((triangle) => {
      const { center } = triangle.getCircumcircle();
      this.points.push(center);

      const { neighbours, commonEdges } = this.triangulation.getNeighbouringTriangles(triangle);
      let unboundEdges = triangle
        .getEdges()
        .filter((edge) => !commonEdges.some((commonEdge) => commonEdge.equals(edge)));

      neighbours.forEach((neighbour) => {
        const ccA = triangle.getCircumcircle().center;
        const ccB = neighbour.getCircumcircle().center;

        this.edges.push(new Edge(ccA, ccB));
      });

      unboundEdges.forEach((edge) => {
        const ccA = triangle.getCircumcircle().center;
        const ccB = edge.getMidpoint();

        let direction = ccA.directionTo(ccB);
        const distance = 1000; // hardcoded because it's cheap

        if (!this.isPointInPolygon(ccA, this.boundaryPolygon)) {
          direction = new Point(-direction.x, -direction.y);
        }

        this.edges.push(new Edge(ccA, new Point(ccA.x + direction.x * distance, ccA.y + direction.y * distance)));
      });
    });

    return { edges: this.edges, points: this.points };
  }

  private isPointInPolygon(point: Point, polygon: Point[]): boolean {
    let isInside = false;
    let minX = polygon[0].x,
      maxX = polygon[0].x;
    let minY = polygon[0].y,
      maxY = polygon[0].y;

    // Find the bounding box for the polygon
    for (let i = 1; i < polygon.length; i++) {
      const p = polygon[i];
      minX = Math.min(p.x, minX);
      maxX = Math.max(p.x, maxX);
      minY = Math.min(p.y, minY);
      maxY = Math.max(p.y, maxY);
    }

    if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
      return false;
    }

    // Ray-casting algorithm to determine if point is in polygon
    let j = polygon.length - 1;
    for (let i = 0; i < polygon.length; j = i++) {
      if (
        polygon[i].y > point.y !== polygon[j].y > point.y &&
        point.x <
          ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) + polygon[i].x
      ) {
        isInside = !isInside;
      }
    }

    return isInside;
  }
}
