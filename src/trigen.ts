import p5 from 'p5';

export interface P5Window extends Window {
  p5: p5;
}

const sketch = (p5: p5) => {
  p5.setup = () => {
    p5.createCanvas(400, 400);
  };

  p5.draw = () => {
    p5.background(220);
  };
};

new p5(sketch);
