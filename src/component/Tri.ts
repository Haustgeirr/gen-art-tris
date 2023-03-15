import p5 from '../trigen';
import P5 from 'p5';

interface StaticPoint {
  x: number;
  y: number;
}

interface AnimatedPoint {
  animation: {
    startPoint: StaticPoint;
    endPoint: StaticPoint;
  };
}

type Point = StaticPoint | AnimatedPoint;

function isAnimatedPoint(point: Point): point is AnimatedPoint {
  return (point as AnimatedPoint).animation !== undefined;
}

export default class Tri {
  _p5: P5;
  _position: P5.Vector;
  _size: number;
  _style: string;
  _dir: string | undefined;
  _colour: string;
  frame: number;

  constructor(
    position: P5.Vector,
    size: number,
    style: string,
    dir?: string,
    colour?: string
  ) {
    this._p5 = p5;

    this._position = position;
    this._size = size;
    this._style = style;
    this._dir = dir;
    this._colour = colour ?? 'white';
    this.frame = p5.frameCount;
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

  drawStaticShape(points: Point[]) {
    const p5 = this._p5;

    p5.beginShape();

    points.forEach((point) => {
      if (isAnimatedPoint(point)) {
        const { endPoint } = point.animation;
        this._p5.vertex(endPoint.x, endPoint.y);
      } else {
        this._p5.vertex(point.x, point.y);
      }
    });

    return p5.endShape();
  }

  animateTri() {
    const animateDuration = 15;
    const p5 = this._p5;
    const size = this._size;
    const centre = size / 2;
    const frame = p5.frameCount - this.frame;

    const points: Point[] = [
      { x: 0, y: 0 },
      { x: size, y: size },
      {
        animation: {
          startPoint: { x: centre, y: centre },
          endPoint: { x: 0, y: size },
        },
      },
    ];

    const animatedPoint = points.find((point) => isAnimatedPoint(point)) as
      | AnimatedPoint
      | undefined;

    if (!animatedPoint || frame > animateDuration) {
      return this.drawStaticShape(points);
    }

    const { startPoint, endPoint } = animatedPoint.animation;
    const end = p5.createVector(endPoint.x, endPoint.y);
    const start = p5.createVector(startPoint.x, startPoint.y);

    const direction = end.sub(start).normalize();
    const dist = end.dist(start);
    const speed = dist / animateDuration;
    const currentPoint = start.add(direction.mult(speed * frame));

    p5.beginShape();

    points.forEach((point) => {
      if (isAnimatedPoint(point)) {
        p5.vertex(currentPoint.x, currentPoint.y);
      } else {
        p5.vertex(point.x, point.y);
      }
    });

    return p5.endShape();
  }

  draw() {
    const p5 = this._p5;

    p5.push();
    p5.noStroke();
    p5.translate(this._position);
    p5.fill(this._colour);
    this.animateTri();
    p5.pop();
  }
}
