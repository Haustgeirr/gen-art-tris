import P5 from 'p5';
import { Vector } from 'p5';

import p5 from '../../trigen';
import config from './config';

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

interface ShapeConfig {
  shape: Point[];
  animations: {
    in: Animation;
    out: Animation;
  };
}

export interface Config {
  [key: string]: ShapeConfig;
}

export default class Tri {
  _p5: P5;
  _position: P5.Vector;
  _size: number;
  _style: string;
  _dir: string | undefined;
  _colour: string;
  _initialFrame: number;
  _life: number | undefined;
  _animation: Animation | undefined;
  _rotation: number;

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
    this._initialFrame = p5.frameCount;
    this._life = life;

    function setRotation() {
      switch (dir) {
        case 'left':
          return 0;
        case 'up':
          return p5.HALF_PI;
        case 'right':
          return p5.PI;
        case 'down':
          return p5.HALF_PI * 3;
        default:
          return 0;
      }
    }

    this._rotation = setRotation();

    this.in();
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

    const frame = p5.frameCount - this._initialFrame;

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
    this.startAnimating(this.getAnimation().in);
  }

  out() {
    this.startAnimating(this.getAnimation().out, () => {
      this._life = 0;
    });
  }

  startAnimating(animation: Animation, onEndCallback?: () => void) {
    this._initialFrame = this._p5.frameCount;

    this._animation = {
      ...animation,
      onEnd: () => {
        this._animation = undefined;
        onEndCallback?.();
      },
    };
  }

  getAnimation() {
    return config[this._style].animations;
  }

  getShape() {
    return config[this._style].shape;
  }

  rotate() {
    const p5 = this._p5;
    p5.rotate(this._rotation);

    switch (this._dir) {
      case 'left':
        p5.translate(0, 0);
        break;
      case 'up':
        p5.translate(0, -this._size);
        break;
      case 'right':
        p5.translate(-this._size, -this._size);
        break;
      case 'down':
        p5.translate(-this._size, 0);
        break;
    }
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

    if (this._rotation !== 0) {
      this.rotate();
    }

    if (this._life !== undefined) {
      this._life--;
    }

    if (this._life === 0) {
      this.out();
    }

    if (this._animation) {
      this.animate(this._animation);
    } else {
      this.drawShape(this.getShape());
    }

    p5.pop();
  }
}
