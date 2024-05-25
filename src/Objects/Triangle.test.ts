import { Point } from './Point';
import { Triangle } from './Triangle';

describe('Triangle', () => {
  it('should create a triangle', () => {
    const triangle = new Triangle(new Point(0, 0), new Point(4, 0), new Point(0, 3));

    expect(triangle.vertexA).toEqual(new Point(0, 0));
    expect(triangle.vertexB).toEqual(new Point(4, 0));
    expect(triangle.vertexC).toEqual(new Point(0, 3));
  });

  it('should check that two triangles are equal', () => {
    const triangle1 = new Triangle(new Point(0, 0), new Point(4, 0), new Point(0, 3));
    const triangle2 = new Triangle(new Point(0, 0), new Point(4, 0), new Point(0, 3));

    expect(triangle1.equals(triangle2)).toBe(true);
  });

  it('should check that two triangles are not equal', () => {
    const triangle1 = new Triangle(new Point(0, 0), new Point(4, 0), new Point(0, 3));
    const triangle2 = new Triangle(new Point(0, 0), new Point(4, 0), new Point(0, 4));

    expect(triangle1.equals(triangle2)).toBe(false);
  });

  it('should return the vertices of a triangle', () => {
    const triangle = new Triangle(new Point(0, 0), new Point(4, 0), new Point(0, 3));
    const vertices = triangle.getVertices();

    expect(vertices).toEqual([
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ]);
  });

  it('should calculate the circumcircle of a triangle', () => {
    const triangle = new Triangle(new Point(0, 0), new Point(4, 0), new Point(0, 3));
    const circumcircle = triangle.getCircumcircle();

    expect(circumcircle.center).toEqual({ x: 2, y: 1.5 });
    expect(circumcircle.radius).toBeCloseTo(2.5, 3);
  });

  it('should throw an error when calculating the circumcircle of a collinear triangle', () => {
    const triangle = new Triangle(new Point(0, 0), new Point(0, 1), new Point(0, 2));

    expect(() => triangle.getCircumcircle()).toThrow('Error calculating circumcenter: triangle sides are collinear.');
  });

  it('should construct a triangle from an incircle', () => {
    // Set up the incenter and radius of the incircle
    const incenter = new Point(2.5, 2.5);
    const radius = 2.5;

    // Construct the triangle
    const triangle = Triangle.constructFromIncircle(incenter, radius);

    // Calculate the expected vertices based on the formula for an equilateral triangle's incircle
    const sideLength = 2 * radius * Math.sqrt(3);

    const expectedVertexA = new Point(incenter.x - sideLength / 2, incenter.y - radius);
    const expectedVertexB = new Point(incenter.x + sideLength / 2, incenter.y - radius);
    const expectedVertexC = new Point(incenter.x, incenter.y + radius * 2);

    // Assert the triangle vertices match the expected values
    expect(triangle.vertexA.equals(expectedVertexA)).toBe(true);
    expect(triangle.vertexB.equals(expectedVertexB)).toBe(true);
    expect(triangle.vertexC.equals(expectedVertexC)).toBe(true);
  });

  it('should throw an error when constructing a triangle from an incircle with a negative radius', () => {
    expect(() => Triangle.constructFromIncircle(new Point(2, 1.5), -2.5)).toThrow(
      'Error constructing triangle: incircle radius must be positive.'
    );
  });

  it('should throw an error when constructing a triangle from an incircle with a radius of zero', () => {
    expect(() => Triangle.constructFromIncircle(new Point(2, 1.5), 0)).toThrow(
      'Error constructing triangle: incircle radius must be positive.'
    );
  });
});
