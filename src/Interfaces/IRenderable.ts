import p5 from 'p5';

export interface Renderable {
  render(p5: p5): void;
}
