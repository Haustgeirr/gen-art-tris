import p5 from 'p5';

import { SceneObject } from './SceneObject';
import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { DelaunayTriangulation } from '@/Samplers/DelaunayTriangulation';

export class DelaunayTriangulationSO extends SceneObject {
  private triangulation: Triangle[] = [];
  private boundaryPolygon: Point[] = [];

  // #355d68
  // #6aaf9d
  // #94c5ac
  // #ffeb99
  // #ffc27a
  // #ec9a6d
  // #d9626b
  // #c24b6e
  // #a73169
  private colourArray: [number, number, number][] = [
    [125, 125, 125],
    [53, 93, 104],
    [148, 197, 172],
    [255, 235, 153],
    [255, 194, 122],
    [236, 154, 109],
    [217, 98, 107],
    [194, 75, 110],
    [167, 49, 105],
  ];

  constructor(points: Point[]) {
    super();
    const delaunayTriangulation = new DelaunayTriangulation(points);
    this.triangulation = delaunayTriangulation.triangulate();
    this.boundaryPolygon = delaunayTriangulation.getBoundaryPolygon();
  }

  render(p5: p5): void {
    p5.noFill();
    p5.stroke(p5.color(125, 125, 125));
    p5.strokeWeight(1);

    this.triangulation.forEach((triangle, index) => {
      const [vertexA, vertexB, vertexC] = triangle.getVertices();

      p5.stroke(p5.color(...this.colourArray[index % this.colourArray.length]));
      p5.triangle(vertexA.x, vertexA.y, vertexB.x, vertexB.y, vertexC.x, vertexC.y);
    });

    p5.strokeWeight(2);
    p5.stroke(p5.color(255, 0, 0));

    this.boundaryPolygon.forEach((point, index) => {
      const nextPoint = this.boundaryPolygon[(index + 1) % this.boundaryPolygon.length];
      p5.line(point.x, point.y, nextPoint.x, nextPoint.y);
      p5.circle(point.x, point.y, 5);
    });
  }

  getTriangulation(): Triangle[] {
    return this.triangulation;
  }

  getBoundaryPolygon(): Point[] {
    return this.boundaryPolygon;
  }
}
