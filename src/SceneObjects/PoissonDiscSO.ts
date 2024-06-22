import p5 from 'p5';

import { SceneObject } from './SceneObject';
import { PoissonDisc } from '@/Samplers/PoissonDisc';
import { Point } from '@/Objects/Point';

export class PoissonDiscSO extends SceneObject {
  private pds: PoissonDisc;
  private points: Point[] = [];

  private colourArray: [number, number, number][] = [
    [53, 93, 104],
    [148, 197, 172],
    [255, 235, 153],
    [255, 194, 122],
    [236, 154, 109],
    [217, 98, 107],
    [194, 75, 110],
    [167, 49, 105],
  ];

  constructor(windowWidth: number, windowHeight: number, cellSize: number) {
    super();
    this.pds = new PoissonDisc(windowWidth, windowHeight, cellSize);
    this.points = this.pds.generate();
  }

  render(p5: p5): void {
    p5.fill(p5.color(255, 255, 255));
    p5.stroke(p5.color(255, 255, 255));

    this.points.forEach((point, index) => {
      // p5.fill(p5.color(...this.colourArray[index % this.colourArray.length]));
      // p5.stroke(p5.color(...this.colourArray[index % this.colourArray.length]));
      p5.circle(point.x, point.y, 4);
    });
  }

  getPoints(): Point[] {
    return this.points;
  }
}
