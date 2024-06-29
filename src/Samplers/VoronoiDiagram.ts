import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Triangulation } from '@/Objects/Triangulation';
import { Edge } from '@/Objects/Edge';

// TODO: create polygons from edges, so that we can fill them with color
// TODO: connect circumcenters with boundary edges
// TODO: if circumcenter is outside triangle, invert direction
// FIX: current dir calc is inverted

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
        // connect cirumcenters with edges
        const ccA = triangle.getCircumcircle().center;
        const ccB = neighbour.getCircumcircle().center;

        this.edges.push(new Edge(ccA, ccB));
      });

      unboundEdges.forEach((edge) => {
        // connect circumcenters with edges
        const ccA = triangle.getCircumcircle().center;
        const ccB = edge.getMidpoint();

        const direction = ccB.directionTo(ccA).normalize();
        const distance = ccA.distance(ccB);

        this.edges.push(
          new Edge(ccA, new Point(ccA.x + direction.x * distance * 2, ccA.y + direction.y * distance * 2))
        );
      });
    });

    return { edges: this.edges, points: this.points };
  }
}
