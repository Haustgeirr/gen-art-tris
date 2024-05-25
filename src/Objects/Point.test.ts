import { Point } from './Point';

describe('Point', () => {
  it('should create a point with the given x and y values', () => {
    const point = new Point(1, 2);

    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
  });

  it('should return true if two points are coincident', () => {
    const p1 = new Point(1, 2);
    const p2 = new Point(1, 2);

    expect(p1.equals(p2)).toBe(true);
  });

  it('should return false if two points are not coincident', () => {
    const p1 = new Point(1, 2);
    const p2 = new Point(2, 3);

    expect(p1.equals(p2)).toBe(false);
  });
});
