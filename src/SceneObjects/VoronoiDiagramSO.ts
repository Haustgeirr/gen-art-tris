import p5 from 'p5';

import { SceneObject } from './SceneObject';
import { VoronoiDiagram } from '@/Samplers/VoronoiDiagram';
import { Point } from '@/Objects/Point';
import { Triangle } from '@/Objects/Triangle';
import { Edge } from '@/Objects/Edge';

export class VoronoiDiagramSO extends SceneObject {
  private points: Point[] = [];
  private voronoiDiagram: VoronoiDiagram;
  private edges: Edge[] = [];

  constructor(triangulation: Triangle[]) {
    super();
    this.voronoiDiagram = new VoronoiDiagram(triangulation);
    const voronoiDiagram = this.voronoiDiagram.generate();

    this.points = voronoiDiagram.points;
    this.edges = voronoiDiagram.edges;
  }

  render(p5: p5): void {
    p5.fill(p5.color(255, 255, 255));
    p5.stroke(p5.color(255, 255, 255));
    p5.strokeWeight(2);

    this.points.forEach((point) => {
      p5.circle(point.x, point.y, 4);
    });

    this.edges.forEach((edge) => {
      p5.line(edge.vertexA.x, edge.vertexA.y, edge.vertexB.x, edge.vertexB.y);
    });
  }
}
