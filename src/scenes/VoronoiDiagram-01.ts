import { SceneRenderer } from '@/Renderers/SceneRenderer';
import { PoissonDiscSO } from '@/SceneObjects/PoissonDiscSO';
import { DelaunayTriangulationSO } from '@/SceneObjects/DelaunayTriangulationSO';
import { VoronoiDiagramSO } from '@/SceneObjects/VoronoiDiagramSO';

const renderer = new SceneRenderer(window.innerWidth, window.innerHeight);
const pdsObject = new PoissonDiscSO(window.innerWidth, window.innerHeight, 32);
const dtObject = new DelaunayTriangulationSO(pdsObject.getPoints());
const vdObject = new VoronoiDiagramSO(dtObject.getTriangulation());

// renderer.addObject(dtObject);
renderer.addObject(pdsObject);
renderer.addObject(vdObject);
renderer.start();
