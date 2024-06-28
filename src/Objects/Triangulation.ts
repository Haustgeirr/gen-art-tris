import { Triangle } from '@/Objects/Triangle';
import { Edge } from '@/Objects/Edge';

export class Triangulation {
  private triangles: Triangle[] = [];

  constructor(triangles: Triangle[]) {
    this.triangles = triangles;
  }

  public getNeighbouringTriangles(triangle: Triangle) {
    const neighbours: Triangle[] = [];
    const commonEdges: Edge[] = [];

    this.triangles.forEach((otherTriangle) => {
      if (triangle.equals(otherTriangle)) {
        return false;
      }

      const commonEdge = triangle.getCommonEdge(otherTriangle);

      if (commonEdge) {
        neighbours.push(otherTriangle);
        commonEdges.push(commonEdge);
      }

      return commonEdge !== undefined;
    });

    return { neighbours, commonEdges };
  }

  public getTriangles() {
    return this.triangles;
  }
}
