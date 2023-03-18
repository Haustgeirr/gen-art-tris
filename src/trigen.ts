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
  {
    style: 'inverted',
    dir: 'left',
  },
  {
    style: 'inverted',
    dir: 'up',
  },
  {
    style: 'inverted',
    dir: 'right',
  },
  {
    style: 'inverted',
    dir: 'down',
  },
];

function generateCellGrid(): (number | null)[] {
  const cellGrid = new Array(cellsX * cellsY).fill(-1);

  for (let i = 0; i < cellGrid.length; i++) {
    const option = Math.floor(Math.random() * triOptions.length + 1);
    // const option = 1;
    cellGrid[i] = option >= triOptions.length ? null : option;
  }

  return cellGrid;
}

function sketch(p5: p5) {
  // let tris: Tri[] = [];
  let tri: Tri | null = null;
  let frameTris: Tri[] | null = null;

  function drawTri(position: p5.Vector, size: number, triIndex: number) {
    return new Tri(
      position,
      size,
      triOptions[triIndex].style,
      triOptions[triIndex].dir
    );
  }

  function drawTris(cellGrid: (number | null)[]) {
    const tris = [];
    for (let x = 0; x < cellsX; x++) {
      for (let y = 0; y < cellsY; y++) {
        const pos = p5.createVector(x * gridSize, y * gridSize);
        const triIndex = cellGrid[x + y * cellsX];
        if (triIndex === null) {
          continue;
        }
        tris.push(drawTri(pos, gridSize, triIndex));
      }
    }

    return tris;
  }

  p5.setup = () => {
    p5.createCanvas(cellsX * gridSize, cellsY * gridSize).parent(
      p5
        .createDiv('')
        .addClass(
          'justify-center flex h-screen w-screen items-center bg-slate-900 m-0 p-0'
        )
    );

    // tri = drawTri(
    //   p5.createVector(
    //     window.innerWidth / 2 - gridSize / 2,
    //     window.innerHeight / 2 - gridSize / 2
    //   ),
    //   gridSize,
    //   1
    // );
    frameTris = drawTris(generateCellGrid());
  };

  p5.draw = () => {
    // if (tri) {
    //   tri.draw();
    // }

    if (!frameTris) {
      return;
    }

    // let frameTris = drawTris(generateCellGrid());

    // refresh every 1 second
    if (p5.frameCount % 60 === 0) {
      p5.background(p5.color(15, 23, 42));
      // frameTris = drawTris(generateCellGrid());
      // console.log('🚀 ~ file: trigen.ts:139 ~ sketch ~ frameTris:', frameTris);
    }

    frameTris.forEach((tri) => tri.draw());
  };
}

const P5 = new p5(sketch);
export default P5;
