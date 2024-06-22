import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Triangulation } from '@/Objects/Triangulation';

// TODO: create Triangulation class
// TODO: add getNeighbouroingTriangles method
// TODO: then get neihbour triangles from this, and join their circumcentres with edges
// TODO: if an edge has no neighbour, then it is a boundary edge
// TODO: for boundary edges draw boundary lines
// TODO: boundary lines are a perpendicular bisector of the edge to canvas boundary;

export class VoronoiDiagram {
  private points: Point[] = [];
  private triangulation: Triangulation;

  constructor(triangulation: Triangulation | Triangle[]) {
    if (triangulation instanceof Triangulation) {
      this.triangulation = triangulation;
    } else {
      this.triangulation = new Triangulation(triangulation);
    }
  }

  generate(): Point[] {
    this.triangulation.getTriangles().forEach((triangle) => {
      const { center } = triangle.getCircumcircle();

      this.points.push(center);
    });

    return this.points;
  }
}
