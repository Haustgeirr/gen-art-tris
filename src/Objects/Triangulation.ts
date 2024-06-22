import { Triangle } from '@/Objects/Triangle';

export class Triangulation {
  private triangles: Triangle[] = [];

  constructor(triangles: Triangle[]) {
    this.triangles = triangles;
  }

  public getNeighbouringTriangles(triangle: Triangle) {
    return this.triangles.filter((otherTriangle) => {
      if (triangle.equals(otherTriangle)) {
        return false;
      }

      return triangle.hasCommonEdge(otherTriangle);
    });
  }

  public getTriangles() {
    return this.triangles;
  }
}
