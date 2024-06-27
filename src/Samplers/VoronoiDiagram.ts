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

      let unboundEdges = triangle.getEdges();

      this.points.push(center);
      const neighbours = this.triangulation.getNeighbouringTriangles(triangle);

      neighbours.forEach((neighbour) => {
        // connect cirumcenters with edges
        const ccA = triangle.getCircumcircle().center;
        const ccB = neighbour.getCircumcircle().center;

        this.edges.push(new Edge(ccA, ccB));

        if (neighbours.length < 3) {
          unboundEdges = unboundEdges.filter((edge) => !triangle.getSharedEdge(neighbour)!.equals(edge));
        }
      });
    });

    return { edges: this.edges, points: this.points };
  }
}
