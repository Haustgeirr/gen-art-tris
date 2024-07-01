import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Triangulation } from '@/Objects/Triangulation';
import { Edge } from '@/Objects/Edge';

// TODO: create polygons from edges, so that we can fill them with color
// TODO: connect circumcenters with boundary edges
// FIX: direction bug

export class VoronoiDiagram {
  private points: Point[] = [];
  private triangulation: Triangulation;
  private edges: Edge[] = [];

  constructor(triangulation: Triangulation | Triangle[]) {
    if (triangulation instanceof Triangulation) {
      this.triangulation = triangulation;
    } else {
      this.triangulation = new Triangulation(triangulation);
    }
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
        // const distance = 1000; // hardcoded because it's cheap
        const distance = ccA.distance(ccB);
        // const dirToCenter = Point.normalize(triangle.getCircumcircle().center);

        // const isInside = triangle.isPointInside(ccA);
        // console.log(Point.dot(dirToCenter, direction));
        // if (isInside) {
        // if (isInside && Point.dot(dirToCenter, direction) < 0) {
        // direction = new Point(-direction.x, -direction.y);
        // }

        // if (!isInside) {
        //   direction = new Point(-direction.x, -direction.y);
        //   if (direction.x < 0 && direction.y > 0) {
        // console.log({ ccA, isInside, direction });
        //     // direction = new Point(0, -direction.y);
        //   }
        //
        // }

        this.edges.push(new Edge(ccA, new Point(ccA.x + direction.x * distance, ccA.y + direction.y * distance)));
      });
    });

    return { edges: this.edges, points: this.points };
  }
}
