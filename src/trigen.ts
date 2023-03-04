import p5 from 'p5';

import MyCircle from './component/MyCircle';

const gridSize = 32;
const cellsX = Math.floor(window.innerWidth / gridSize);
const cellsY = Math.floor(window.innerHeight / gridSize);

const sketch = (p5: p5) => {
  const myCircles: MyCircle[] = [];

  p5.setup = () => {
    p5.createCanvas(cellsX * gridSize, cellsY * gridSize).parent(
      p5
        .createDiv('')
        .addClass(
          'justify-center flex h-screen w-screen items-center bg-slate-900 m-0 p-0'
        )
    );

    for (let x = 0; x < cellsX; x++) {
      for (let y = 0; y < cellsY; y++) {
        // const circlePos = p5.createVector(x * gridSize, y * gridSize);
        // myCircles.push(new MyCircle(p5, circlePos, gridSize));
      }
    }
  };

  p5.draw = () => {
    myCircles.forEach((circle) => circle.draw());
  };
};

new p5(sketch);
