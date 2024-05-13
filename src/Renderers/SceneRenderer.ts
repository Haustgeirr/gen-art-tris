import p5 from 'p5';

import { Renderable } from '@/Interfaces/IRenderable';

export class SceneRenderer {
  private width: number = 1024;
  private height: number = 1024;
  private objects: Renderable[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  addObject(object: Renderable): void {
    this.objects.push(object);
  }

  start(): void {
    new p5((p5: p5) => {
      p5.setup = () => this.setup(p5);
      p5.draw = () => this.draw(p5);
    });
  }

  private setup(p5: p5): void {
    p5.frameRate(60);
    p5.createCanvas(this.width, this.height).parent(
      p5.createDiv('').addClass('justify-center flex h-screen w-screen items-center bg-slate-900 m-0 p-0')
    );

    p5.background(p5.color(0, 0, 0));
  }

  private draw(p5: p5): void {
    p5.background(p5.color(0, 0, 0));

    this.objects.forEach((obj) => obj.render(p5));
  }
}
