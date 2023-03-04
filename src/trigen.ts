import p5 from 'p5';

import MyCircle from './component/MyCircle';

export interface P5Window extends Window {
  p5: p5;
}

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const sketch = (p5: p5) => {
  const myCircles: MyCircle[] = [];

  p5.setup = () => {
    p5.createCanvas(400, 400).parent(
      p5
        .createDiv('')
        .addClass(
          'justify-center flex h-screen w-screen items-center bg-slate-600 m-0 p-0'
        )
    );
    p5.background(220, 0, 0);

    for (let i = 1; i < 4; i++) {
      const p = p5.width / 4;
      const circlePos = p5.createVector(p * i, p5.height / 2);
      const size = i % 2 !== 0 ? 24 : 32;
      myCircles.push(new MyCircle(p5, circlePos, size));
    }
  };

  p5.draw = () => {
    myCircles.forEach((circle) => circle.draw());
  };
};

new p5(sketch);
