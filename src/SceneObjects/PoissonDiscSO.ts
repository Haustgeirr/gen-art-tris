import p5 from 'p5';

import { SceneObject } from './SceneObject';
import { PoissonDisc } from '@/Samplers/PoissonDisc';
import { Point } from '@/Utils/Types';

export class PoissonDiscSO extends SceneObject {
  private pds: PoissonDisc;
  private points: Point[] = [];

  constructor(windowWidth: number, windowHeight: number, cellSize: number) {
    super();
    this.pds = new PoissonDisc(windowWidth, windowHeight, cellSize);
    this.points = this.pds.generate();
  }

  render(p5: p5): void {
    p5.fill(p5.color(255, 255, 255));
    p5.stroke(p5.color(255, 255, 255));

    this.points.forEach((point) => {
      p5.circle(point.x, point.y, 4);
    });
  }
}
