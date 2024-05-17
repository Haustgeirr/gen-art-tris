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
    p5.stroke(p5.color(125, 125, 125));

    this.triangulation.forEach(([vertexA, vertexB, vertexC]) => {
      p5.triangle(vertexA.x, vertexA.y, vertexB.x, vertexB.y, vertexC.x, vertexC.y);
    });
  }
}
