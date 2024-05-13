import p5 from 'p5';

import { SceneObject } from './SceneObject';
import { Point } from '@/Utils/Types';
import { Triangulation, DelaunayTriangulation } from '@/Samplers/DelaunayTriangulation';

export class DelaunayTriangulationSO extends SceneObject {
  private triangulation: Triangulation[] = [];

  constructor(points: Point[]) {
    super();
    const delaunayTriangulation = new DelaunayTriangulation(points);
    this.triangulation = delaunayTriangulation.triangulate();
  }

  render(p5: p5): void {
    p5.noFill();
    p5.stroke(p5.color(255, 0, 0));

    this.triangulation.forEach((triangle) => {
      p5.triangle(triangle[0].x, triangle[0].y, triangle[1].x, triangle[1].y, triangle[2].x, triangle[2].y);
    });
  }
}
