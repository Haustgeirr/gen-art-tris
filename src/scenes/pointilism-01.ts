import p5 from 'p5';

const gridSize = 32;
const cellsX = Math.floor(window.innerWidth / gridSize) + 1;
const cellsY = Math.floor(window.innerHeight / gridSize) + 1;

interface Point {
  x: number;
  y: number;
}

class PoissonDiscSampling {
  windowWidth: number;
  windowHeight: number;
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
  radius: number;

  constructor(width: number, height: number, cellSize: number, radius: number) {
    this.windowWidth = width;
    this.windowHeight = height;
    this.gridWidth = Math.ceil(width / cellSize);
    this.gridHeight = Math.ceil(height / cellSize);
    this.cellSize = cellSize;
    this.radius = radius;
  }

  generate(): Point[] {
    const candidatePoints: Point[] = [];
    const points: Point[] = [];
    const grid: Point[] = [];
    let finished = false;
    const samplesBeforeRejection = 100;

    candidatePoints.push({ x: this.windowWidth / 2, y: this.windowHeight / 2 });

    const start = Date.now();

    while (!finished && Date.now() - start < 15) {
      const index = (Math.random() * (candidatePoints.length - 1)) | 0;
      let newPointIsValid = false;

      for (let k = 0; k < samplesBeforeRejection; k++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 2 * this.radius + this.radius;

        const newPoint = {
          x: candidatePoints[index].x + r * Math.cos(a),
          y: candidatePoints[index].y + r * Math.sin(a),
        };

        if (this.isValidPoint(newPoint, grid)) {
          points.push(newPoint);
          candidatePoints.push(newPoint);
          const gridIndex = this.gridWidth * ((newPoint.y / this.cellSize) | 0) + ((newPoint.x / this.cellSize) | 0);

          grid[gridIndex] = newPoint;
          newPointIsValid = true;

          break;
        }
      }

      if (!newPointIsValid) {
        candidatePoints.splice(index, 1);
      }

      if (candidatePoints.length <= 0) finished = true;
    }

    return points;
  }

  // Fast Poisson Disk Sampling in Arbitrary Dimensions by Robert Bridson
  // https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
  private isValidPoint(newPoint: Point, grid: Point[]) {
    const gridX = (newPoint.x / this.cellSize) | 0;
    const gridY = (newPoint.y / this.cellSize) | 0;
    const searchStartX = Math.max(0, gridX - 2);
    const searchStartY = Math.max(0, gridY - 2);
    const searchEndX = Math.min(gridX + 2 + 1, this.gridWidth);
    const searchEndY = Math.min(gridY + 2 + 1, this.gridHeight);

    for (let y = searchStartY; y < searchEndY; y++) {
      const gridRow = y * this.gridWidth;
      for (let x = searchStartX; x < searchEndX; x++) {
        const gridIndex = gridRow + x;
        const gridCell = grid[gridIndex];

        if (gridCell) {
          console.log(newPoint, gridCell, this.sqrDistance(newPoint, gridCell), this.radius * this.radius);
        }

        if (gridCell && this.sqrDistance(newPoint, gridCell) <= this.radius * this.radius) {
          console.log('reject point');
          return false;
        }
      }
    }

    return true;
  }

  private sqrDistance(pointA: Point, pointB: Point) {
    return Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2);
  }
}

function scene(p5: p5) {
  const pds = new PoissonDiscSampling(window.innerWidth, window.innerHeight, 32, 32);
  const points = pds.generate();
  console.log('🚀 ~ scene ~ points:', points);

  p5.setup = () => {
    p5.frameRate(60);
    p5.createCanvas(cellsX * gridSize, cellsY * gridSize).parent(
      p5.createDiv('').addClass('justify-center flex h-screen w-screen items-center bg-slate-900 m-0 p-0')
    );

    p5.background(p5.color(0, 0, 0));
  };

  p5.draw = () => {
    p5.stroke(p5.color(255, 255, 255));
    p5.strokeWeight(1);

    points.forEach((point) => {
      p5.circle(point.x, point.y, 4);
    });
    // for (let x = 0; x < cellsX; x++) {
    //   for (let y = 0; y < cellsY; y++) {
    //     // p5.noFill();
    //     p5.circle(x * gridSize, y * gridSize, 4);
    //     // p5.rect(x * gridSize, y * gridSize, gridSize, gridSize);
    //   }
    // }
  };
}

const P5 = new p5(scene);
export default P5;
