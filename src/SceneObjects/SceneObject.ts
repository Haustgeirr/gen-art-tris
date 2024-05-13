import { Renderable } from '../Interfaces/IRenderable';
import p5 from 'p5';

export abstract class SceneObject implements Renderable {
  abstract render(p5: p5): void;
}
