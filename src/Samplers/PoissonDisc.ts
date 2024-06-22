// import { Point } from '@/Utils/Types';
import { Point } from '@/Objects/Point';
import { INoiseGenerator } from '@/Interfaces/INoiseGenerator';

// TODO: seed random number generator

const MAX_DURATION_MS = 15;
const SAMPLES_BEFORE_REJECTION = 10;
const MAX_POINTS = 500;

export class PoissonDisc implements INoiseGenerator {
  windowWidth: number;
  windowHeight: number;
  cellSize: number;
  gridWidth: number;
  gridHeight: number;

  constructor(width: number, height: number, cellSize: number) {
    this.windowWidth = width;
    this.windowHeight = height;
    this.cellSize = cellSize;
    this.gridWidth = Math.floor(width / cellSize) + 1;
    this.gridHeight = Math.floor(height / cellSize) + 1;
  }

  generate(): Point[] {
    const candidatePoints: Point[] = [];
    const points: Point[] = [];
    const grid: Point[][] = [];
    let finished = false;
    const start = Date.now();

    candidatePoints.push(new Point(this.windowWidth / 2, this.windowHeight / 2));

    while (!finished && Date.now() - start < MAX_DURATION_MS) {
      const index = (Math.random() * (candidatePoints.length - 1)) | 0;
      let newPointIsValid = false;

      for (let k = 0; k < SAMPLES_BEFORE_REJECTION; k++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 2 * this.cellSize + this.cellSize;

        const newPoint = new Point(
          candidatePoints[index].x + r * Math.cos(a),
          candidatePoints[index].y + r * Math.sin(a)
        );

        if (this.isValidPoint(newPoint, grid)) {
          points.push(newPoint);
          candidatePoints.push(newPoint);
          const gridIndex = this.getGridIndex(newPoint);

          if (!grid[gridIndex]) {
            grid[gridIndex] = [];
          }

          grid[gridIndex].push(newPoint);
          newPointIsValid = true;

          break;
        }
      }

      if (!newPointIsValid) {
        candidatePoints.splice(index, 1);
      }

      if (candidatePoints.length <= 0 || (MAX_POINTS > 0 && points.length >= MAX_POINTS)) {
        finished = true;
      }
    }

    return points;
  }

  // Fast Poisson Disk Sampling in Arbitrary Dimensions by Robert Bridson
  // https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
  private isValidPoint(newPoint: Point, grid: Point[][]) {
    const gridX = (newPoint.x / this.cellSize) | 0;
    const gridY = (newPoint.y / this.cellSize) | 0;
    const searchStartX = Math.max(0, gridX - 2);
    const searchStartY = Math.max(0, gridY - 2);
    const searchEndX = Math.min(gridX + 2 + 1, this.gridWidth);
    const searchEndY = Math.min(gridY + 2 + 1, this.gridHeight);

    if (newPoint.x < 0 || newPoint.x >= this.windowWidth || newPoint.y < 0 || newPoint.y >= this.windowHeight) {
      return false;
    }

    for (let y = searchStartY; y < searchEndY; y++) {
      for (let x = searchStartX; x < searchEndX; x++) {
        const gridCell = grid[y * this.gridWidth + x];

        for (let i = 0; i < gridCell?.length; i++) {
          if (gridCell[i] && this.sqrDistance(newPoint, gridCell[i]) <= this.cellSize * this.cellSize * 1.414) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private sqrDistance(pointA: Point, pointB: Point) {
    return Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2);
  }

  private getGridIndex(point: Point) {
    return this.gridWidth * ((point.y / this.cellSize) | 0) + ((point.x / this.cellSize) | 0);
  }
}
