import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Triangulation } from '@/Objects/Triangulation';
import { Edge } from '@/Objects/Edge';

// TODO: if an edge has no neighbour, then it is a boundary edge
// TODO: for boundary edges draw boundary lines
// TODO: boundary lines are a perpendicular bisector of the edge to canvas boundary;
// TODO: create polygons from edges, so that we can fill them with color

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
      this.triangulation.getNeighbouringTriangles(triangle).forEach((neighbour) => {
        // connect cirumcenters with edges
        const ccA = triangle.getCircumcircle().center;
        const ccB = neighbour.getCircumcircle().center;

        this.edges.push(new Edge(ccA, ccB));
      });
    });

    return { edges: this.edges, points: this.points };
  }
}
