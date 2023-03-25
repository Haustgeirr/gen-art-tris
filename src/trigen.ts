import p5 from 'p5';

import Tri from './component/Tri';

const gridSize = 32;
const cellsX = Math.floor(window.innerWidth / gridSize);
const cellsY = Math.floor(window.innerHeight / gridSize);
const tileChance = 0.5;

type TriType = {
  style: string;
  dir?: string;
};

const triOptions: TriType[] = [
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
  {
    style: 'square',
  },
];

function generateCellGrid(): (number | null)[] {
  const cellGrid = new Array(cellsX * cellsY).fill(-1);

  for (let i = 0; i < cellGrid.length; i++) {
    cellGrid[i] = null;
    if (Math.random() >= tileChance) {
      cellGrid[i] = Math.floor(Math.random() * triOptions.length);
    }
  }

  return cellGrid;
}

function sketch(p5: p5) {
  let tri: Tri | null = null;
  let frameTris: (Tri | null)[] | null = null;

  function drawTri(position: p5.Vector, size: number, triIndex: number) {
    return new Tri(
      position,
      size,
      triOptions[triIndex].style,
      triOptions[triIndex].dir,
      45
    );
  }

  function drawTris(cellGrid: (number | null)[]) {
    const tris = [];
    for (let x = 0; x < cellsX; x++) {
      for (let y = 0; y < cellsY; y++) {
        const pos = p5.createVector(x * gridSize, y * gridSize);
        const triIndex = cellGrid[x + y * cellsX];
        if (triIndex === null) {
          tris.push(null);
          continue;
        }
        tris.push(drawTri(pos, gridSize, triIndex));
      }
    }

    return tris;
  }

  p5.setup = () => {
    p5.frameRate(60);
    p5.createCanvas(cellsX * gridSize, cellsY * gridSize).parent(
      p5
        .createDiv('')
        .addClass(
          'justify-center flex h-screen w-screen items-center bg-slate-900 m-0 p-0'
        )
    );

    // frameTris = drawTris(generateCellGrid());
    frameTris = drawTris(new Array(cellsX * cellsY).fill(null));
  };

  p5.draw = () => {
    const drawGrid = true;
    const debug = false;
    p5.background(p5.color(15, 23, 42));

    if (drawGrid) {
      p5.stroke(p5.color(30, 46, 84));
      p5.strokeWeight(1);
      for (let x = 0; x < cellsX; x++) {
        for (let y = 0; y < cellsY; y++) {
          p5.noFill();
          p5.rect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
      }

      p5.noStroke();
      p5.fill(p5.color(30, 46, 84));
      p5.rect(
        Math.floor(cellsX / 2) * gridSize,
        Math.floor(cellsY / 2) * gridSize,
        gridSize,
        gridSize
      );
    }

    //if debug draw a single tri in the centre
    if (debug) {
      if (!tri) {
        tri = drawTri(
          p5.createVector(
            Math.floor(cellsX / 2) * gridSize,
            Math.floor(cellsY / 2) * gridSize
          ),
          gridSize,
          0
        );
      }

      tri.draw();
      return;
    }

    if (!frameTris) {
      return;
    }

    //choose a random number of frames
    const randomFrames = Math.floor(Math.random() * 15);

    if (p5.frameCount % randomFrames === 0) {
      //choose a random number of cells
      const randomCellsCount = 1;

      // create an array with randomCellsCount elements
      const randomCells = new Array(randomCellsCount).fill(0).map(() => {
        // for each element, choose a random cell
        const randomCell = Math.floor(Math.random() * frameTris.length);
        return randomCell;
      });

      randomCells.forEach((cell) => {
        if (Math.random() < tileChance) {
          frameTris[cell] = null;
          return;
        }

        // for each cell, choose a random tri
        const randomTri = Math.floor(Math.random() * triOptions.length);

        const positionX = cell % cellsX;
        const positionY = Math.floor(cell / cellsX);

        //change the tri
        frameTris[cell] = drawTri(
          p5.createVector(positionX * gridSize, positionY * gridSize),
          gridSize,
          randomTri
        );
      });
    }

    frameTris.forEach((tri) => {
      if (tri) {
        tri.draw();
      }
    });
  };
}

const P5 = new p5(sketch);
export default P5;
