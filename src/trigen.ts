import p5 from 'p5';

import Tri from './component/Tri';

const gridSize = 32;
const cellsX = Math.floor(window.innerWidth / gridSize);
const cellsY = Math.floor(window.innerHeight / gridSize);

type TriType = {
  style: string;
  dir?: string;
};

const triOptions: TriType[] = [
  {
    style: 'square',
  },
  {
    style: 'tri',
    dir: 'left',
  },
  {
    style: 'tri',
    dir: 'up',
  },
  {
    style: 'tri',
    dir: 'right',
  },
  {
    style: 'tri',
    dir: 'down',
  },
  {
    style: 'half',
    dir: 'left',
  },
  {
    style: 'half',
    dir: 'up',
  },
  {
    style: 'half',
    dir: 'right',
  },
  {
    style: 'half',
    dir: 'down',
  },
];

const sketch = (p5: p5) => {
  const tris: Tri[] = [];

  const drawTri = (position: p5.Vector, size: number, triIndex: number) => {
    return new Tri(
      position,
      size,
      triOptions[triIndex].style,
      triOptions[triIndex].dir
    );
  };

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
        const pos = p5.createVector(x * gridSize, y * gridSize);
        const triIndex = Math.floor(Math.random() * triOptions.length);
        tris.push(drawTri(pos, gridSize, triIndex));
      }
    }
  };

  p5.draw = () => {
    tris.forEach((circle) => circle.draw());
  };
};

const P5 = new p5(sketch);
export default P5;
