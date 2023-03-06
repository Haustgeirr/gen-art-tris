import p5 from '../trigen';
import P5 from 'p5';

export default class Tri {
  _p5: P5;
  _position: P5.Vector;
  _size: number;
  _style: string;
  _dir: string | undefined;
  _colour: string;

  constructor(
    position: P5.Vector,
    size: number,
    style: string,
    dir?: string,
    colour?: string
  ) {
    this._position = position;
    this._size = size;
    this._style = style;
    this._dir = dir;
    this._colour = colour ?? 'white';

    this._p5 = p5;
  }

  drawTri() {
    const p5 = this._p5;
    const size = this._size;
    const centre = size / 2;

    switch (this._style) {
      case 'square':
        return p5.square(0, 0, this._size);
      case 'tri':
        switch (this._dir) {
          case 'left':
            return p5.triangle(0, 0, size, size, 0, size);
          case 'up':
            return p5.triangle(0, 0, size, 0, 0, size);
          case 'right':
            return p5.triangle(0, 0, size, 0, size, size);
          case 'down':
            return p5.triangle(size, 0, size, size, 0, size);
        }
      case 'half':
        switch (this._dir) {
          case 'left':
            return p5.triangle(0, 0, centre, centre, 0, size);
          case 'up':
            return p5.triangle(0, 0, size, 0, centre, centre);
          case 'right':
            return p5.triangle(size, 0, size, size, centre, centre);
          case 'down':
            return p5.triangle(size, size, 0, size, centre, centre);
        }
      default:
        return p5.triangle(0, 0, size, 0, size, size);
    }
  }

  draw() {
    const p5 = this._p5;

    p5.push();
    p5.translate(this._position);
    p5.noStroke();
    p5.fill('white');
    this.drawTri();
    p5.pop();
  }
}
