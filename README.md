# Gen Art

## About

This project is a collection of generative art algorithms and experiments using TypeScript and p5.js. The goal is to explore the possibilities of generative art and to create a collection of beautiful and interesting pieces.

I also wanted to try using Vite and pnpm.

## Installation

1. Clone the repository
1. Run `pnpm install`
1. Run `pnpm run dev`

## Usage

There's no interface for selecting the piece yet, so update `index.html` with the name of a scene.

## Scenes

### 2d Voronoi

These are experiements to build a voronoi diagram in 2d space, from a point set. The goal is do utilise different samplers for the generation of the point set.

1. Poisson Disc
1. Delaunay Triangulation
1. Voronoi Diagram

# Thoughts

I had originally tried to build this in an object oriented way, but over time I ran up against some challenges when splitting out the renderer and generation logic. This then required a SceneObject class which ultimately felt like it was adding unnecessary complexity. Especially when having to pass different elements through. In particular when calculating the boundaryPolygon for inverting the boundary edges in the voronoi diagram.

Additionally I ended up writing some tests as creating the Delaunay triangulation was very difficult to debug, and I lacked confidence in the generation steps.

## Next Steps

- [ ] Add a scene selector
- [ ] Refactor the overall architecture to base renderers on the object classes e.g. EdgeRenderer, PointRenderer
- [ ] Improve performance of the Delaunay triangulation, and Voronoi diagram generations
- [ ] Update the tri piece to the new format and include it in the scene selector
- [ ] Add more scenes
