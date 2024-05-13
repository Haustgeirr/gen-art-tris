import { SceneRenderer } from '@/Renderers/SceneRenderer';
import { PoissonDiscSO } from '@/SceneObjects/PoissonDiscSO';

const renderer = new SceneRenderer(window.innerWidth, window.innerHeight);
const pdsObject = new PoissonDiscSO(window.innerWidth, window.innerHeight, 32);

renderer.addObject(pdsObject);
renderer.start();
