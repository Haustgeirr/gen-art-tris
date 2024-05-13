import { SceneRenderer } from '@/Renderers/SceneRenderer';
import { PoissonDiscSO } from '@/SceneObjects/PoissonDiscSO';
import { DelaunayTriangulationSO } from '@/SceneObjects/DelaunayTriangulationSO';

const renderer = new SceneRenderer(window.innerWidth, window.innerHeight);
const pdsObject = new PoissonDiscSO(window.innerWidth, window.innerHeight, 32);
const dtObject = new DelaunayTriangulationSO(pdsObject.getPoints());

renderer.addObject(pdsObject);
renderer.addObject(dtObject);
renderer.start();
