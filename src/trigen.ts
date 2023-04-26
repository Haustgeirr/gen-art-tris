import p5 from 'p5';

import Tri from './component/Tri';

// make a 'flip' method that that calls the 'out' method on the current tri and then calls the 'in' method on the new tri
// fix the duplicate tri in cell bug
// maybe try gpt4 on this
// start working on the input pattern
// this might want too be an array of objects that define what each cell should be
// maybe make a grid class that handles the grid and the cells
// maybe make a cell class that handles the cell and the tris

interface Cell {
  option: number;
  static: boolean;
}

interface Grid {
  cells: Cell[];
}

const gridSize = 32;
const cellsX = Math.floor(window.innerWidth / gridSize);
const cellsY = Math.floor(window.innerHeight / gridSize);
const tileChance = 1;

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
    if (Math.random() <= tileChance) {
      cellGrid[i] = Math.floor(Math.random() * triOptions.length);
    }
  }

  return cellGrid;
}

function sketch(p5: p5) {
  let tri: Tri | null = null;
  let frameTris: (Tri | null)[] | null = null;

  function drawTri(position: p5.Vector, size: number, triIndex: number) {
    return new Tri(position, size, triOptions[triIndex].style, triOptions[triIndex].dir, 1000);
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
      p5.createDiv('').addClass('justify-center flex h-screen w-screen items-center bg-slate-900 m-0 p-0')
    );

    // frameTris = drawTris(generateCellGrid());
    frameTris = drawTris(new Array(cellsX * cellsY).fill(null));
  };

  function drawTriInCell(cell: number) {
    function emptyCell(cell: number) {
      frameTris[cell] = null;
    }

    if (frameTris[cell]) {
      frameTris[cell]?.out(() => {
        return emptyCell(cell);
      });
      return;
    }

    if (Math.random() > tileChance) {
      return;
    }

    // for each cell, choose a random tri
    const randomTri = Math.floor(Math.random() * triOptions.length);
    const positionX = cell % cellsX;
    const positionY = Math.floor(cell / cellsX);

    //change the tri
    frameTris[cell] = drawTri(p5.createVector(positionX * gridSize, positionY * gridSize), gridSize, randomTri);
  }

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
      p5.rect(Math.floor(cellsX / 2) * gridSize, Math.floor(cellsY / 2) * gridSize, gridSize, gridSize);
    }

    //if debug draw a single tri in the centre
    if (debug) {
      const centreCell = Math.floor(cellsX / 2) + Math.floor(cellsY / 2) * cellsX;
      if (!frameTris[centreCell]) {
        const positionX = centreCell % cellsX;
        const positionY = Math.floor(centreCell / cellsX);

        tri = drawTri(p5.createVector(positionX * gridSize, positionY * gridSize), gridSize, 0);
      }

      if (frameTris[centreCell]) {
        frameTris[centreCell].draw();
      }

      if (p5.frameCount % 30 === 0) {
        drawTriInCell(centreCell);
      }

      return;
    }

    if (!frameTris) {
      return;
    }

    //choose a random number of frames
    const randomFrames = Math.floor(Math.random() * 2);

    if (p5.frameCount % randomFrames === 0) {
      //choose a random number of cells
      const randomCellsCount = 1;

      // create an array with randomCellsCount elements
      const randomCells = new Array(randomCellsCount).fill(0).map(() => {
        // for each element, choose a random cell
        const randomCell = Math.floor(Math.random() * frameTris.length);
        return randomCell;
      });

      randomCells.forEach((cell) => drawTriInCell(cell));
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
