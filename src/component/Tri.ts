import p5 from '../trigen';
import P5 from 'p5';
import { Vector } from 'p5';

interface Point {
  x: number;
  y: number;
}

interface Animation {
  duration: number;
  startFrame: Point[];
  endFrame: Point[];
  easing?: (x: number) => number;
  onStart?: () => void;
  onEnd?: () => void;
}

function easeInExpo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

const config = {
  tri: {
    duration: 15,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    animations: {
      in: {
        duration: 15,
        easing: easeOutExpo,
        startFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 0.5, y: 0.5 },
        ],
        endFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
      },
      out: {
        duration: 15,
        easing: easeInExpo,
        startFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
        endFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 0.5, y: 0.5 },
        ],
      },
    },
  },
};

export default class Tri {
  _p5: P5;
  _position: P5.Vector;
  _size: number;
  _style: string;
  _dir: string | undefined;
  _colour: string;
  startFrame: number;
  _life: number | undefined;
  _animation: Animation | undefined;

  constructor(
    position: P5.Vector,
    size: number,
    style: string,
    dir?: string,
    life?: number,
    colour?: string
  ) {
    this._p5 = p5;

    this._position = position;
    this._size = size;
    this._style = style;
    this._dir = dir;
    this._colour = colour ?? 'white';
    this.startFrame = p5.frameCount;
    this._life = life;

    this.in();
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
            // return p5.triangle(0, 0, size, size, 0, size);
            return p5
              .beginShape()
              .vertex(0, 0)
              .vertex(size, size)
              .vertex(0, size)
              .endShape();
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
      case 'inverted':
        switch (this._dir) {
          case 'left':
            return p5
              .beginShape()
              .vertex(0, 0)
              .vertex(size, 0)
              .vertex(size, size)
              .vertex(0, size)
              .vertex(centre, centre)
              .vertex(0, 0)
              .endShape();
          case 'up':
            return p5
              .beginShape()
              .vertex(0, 0)
              .vertex(centre, centre)
              .vertex(size, 0)
              .vertex(size, size)
              .vertex(0, size)
              .vertex(0, 0)
              .endShape();
          case 'right':
            return p5
              .beginShape()
              .vertex(0, 0)
              .vertex(size, 0)
              .vertex(centre, centre)
              .vertex(size, size)
              .vertex(0, size)
              .vertex(0, 0)
              .endShape();
          case 'down':
            return p5
              .beginShape()
              .vertex(0, 0)
              .vertex(size, 0)
              .vertex(size, size)
              .vertex(centre, centre)
              .vertex(0, size)
              .vertex(0, 0)
              .endShape();
        }
      default:
        return p5.triangle(0, 0, size, 0, size, size);
    }
  }

  drawShape(shape: Point[]) {
    const p5 = this._p5;

    p5.beginShape();

    shape.forEach((point) => {
      p5.vertex(point.x * this._size, point.y * this._size);
    });

    return p5.endShape();
  }

  interpolate(
    startPoint: Point,
    endPoint: Point,
    duration: number,
    frame: number,
    easing?: (t: number) => number
  ) {
    const p5 = this._p5;

    const start = p5.createVector(startPoint.x, startPoint.y).mult(this._size);
    const end = p5.createVector(endPoint.x, endPoint.y).mult(this._size);

    let speed = frame / duration;

    if (easing) {
      speed = easing(speed);
    }

    const currentPoint = Vector.lerp(start, end, speed);

    return currentPoint;
  }

  animate(animation: Animation) {
    const { duration, startFrame, endFrame, easing } = animation;
    const p5 = this._p5;
    const frame = p5.frameCount - this.startFrame;

    p5.beginShape();

    startFrame.forEach((point, index) => {
      const currentPoint = this.interpolate(
        point,
        endFrame[index],
        duration,
        frame,
        easing
      );
      p5.vertex(currentPoint.x, currentPoint.y);
    });

    p5.endShape();

    if (frame >= duration) {
      animation.onEnd?.();
    }
  }

  in() {
    this.startAnimating(config.tri.animations.in);
  }

  out() {
    this.startAnimating(config.tri.animations.out, () => {
      this._life = 0;
    });
  }

  startAnimating(animation: Animation, onEndCallback?: () => void) {
    this.startFrame = this._p5.frameCount;

    this._animation = {
      ...animation,
      onEnd: () => {
        this._animation = undefined;
        onEndCallback?.();
      },
    };
  }

  draw() {
    if (this._life === 0 && this._animation === undefined) {
      return;
    }

    const p5 = this._p5;
    p5.push();
    p5.noStroke();
    p5.translate(this._position);
    p5.fill(this._colour);

    if (this._life !== undefined) {
      this._life--;
    }

    if (this._life === 0) {
      this.out();
    }

    if (this._animation) {
      this.animate(this._animation);
    } else {
      this.drawShape(config.tri.shape);
    }

    p5.pop();
  }
}
