import p5 from 'p5';

import { SceneObject } from './SceneObject';
import { VoronoiDiagram } from '@/Samplers/VoronoiDiagram';
import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';

export class VoronoiDiagramSO extends SceneObject {
  private points: Point[] = [];
  private voronoiDiagram: VoronoiDiagram;

  constructor(triangulation: Triangle[]) {
    super();
    this.voronoiDiagram = new VoronoiDiagram(triangulation);
    this.points = this.voronoiDiagram.generate();
  }

  render(p5: p5): void {
    p5.fill(p5.color(255, 255, 255));
    p5.stroke(p5.color(255, 255, 255));

    this.points.forEach((point) => {
      p5.circle(point.x, point.y, 4);
    });
  }
}
