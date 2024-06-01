import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';

export class VoronoiDiagram {
  private points: Point[] = [];
  private triangulation: Triangle[] = [];

  constructor(triangulation: Triangle[]) {
    this.triangulation = triangulation;
  }

  generate(): Point[] {
    this.triangulation.forEach((triangle) => {
      const { center } = triangle.getCircumcircle();

      this.points.push(center);
    });

    return this.points;
  }
}
