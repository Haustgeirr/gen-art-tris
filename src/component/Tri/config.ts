import { Config } from './Tri';
import { easeInExpo, easeOutExpo } from '@utils/Easing';

const config: Config = {
  tri: {
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    animations: {
      in: {
        duration: 15,
        easing: easeOutExpo,

        startFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 0.5, y: 0.5 },
        ],
        endFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
      },
      out: {
        duration: 15,
        easing: easeInExpo,

        startFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
        endFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 0.5, y: 0.5 },
        ],
      },
    },
  },
  half: {
    shape: [
      { x: 0, y: 0 },
      { x: 0.5, y: 0.5 },
      { x: 0, y: 1 },
    ],
    animations: {
      in: {
        duration: 15,
        easing: easeOutExpo,

        startFrame: [
          { x: 0, y: 0 },
          { x: 0, y: 0.5 },
          { x: 0, y: 1 },
        ],
        endFrame: [
          { x: 0, y: 0 },
          { x: 0.5, y: 0.5 },
          { x: 0, y: 1 },
        ],
      },
      out: {
        duration: 15,
        easing: easeInExpo,

        startFrame: [
          { x: 0, y: 0 },
          { x: 0.5, y: 0.5 },
          { x: 0, y: 1 },
        ],
        endFrame: [
          { x: 0, y: 0 },
          { x: 0, y: 0.5 },
          { x: 0, y: 1 },
        ],
      },
    },
  },
  // .vertex(0, 0)
  // .vertex(size, 0)
  // .vertex(size, size)
  // .vertex(0, size)
  // .vertex(centre, centre)
  // .vertex(0, 0)
  inverted: {
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0.5, y: 0.5 },
      { x: 0, y: 0 },
    ],
    animations: {
      in: {
        duration: 15,
        easing: easeOutExpo,
        startFrame: [
          { x: 0, y: 0.5 },
          { x: 1, y: 0.5 },
          { x: 1, y: 0.5 },
          { x: 0, y: 0.5 },
          { x: 0.5, y: 0.5 },
          { x: 0, y: 0.5 },
        ],
        endFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
          { x: 0.5, y: 0.5 },
          { x: 0, y: 0 },
        ],
      },
      out: {
        duration: 15,
        easing: easeInExpo,
        startFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
          { x: 0.5, y: 0.5 },
          { x: 0, y: 0 },
        ],
        endFrame: [
          { x: 0, y: 0.5 },
          { x: 1, y: 0.5 },
          { x: 1, y: 0.5 },
          { x: 0, y: 0.5 },
          { x: 0.5, y: 0.5 },
          { x: 0, y: 0.5 },
        ],
      },
    },
  },
  square: {
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    animations: {
      in: {
        duration: 15,
        easing: easeOutExpo,

        startFrame: [
          { x: 0.5, y: 0 },
          { x: 0.5, y: 0 },
          { x: 0.5, y: 1 },
          { x: 0.5, y: 1 },
        ],
        endFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
      },
      out: {
        duration: 15,
        easing: easeInExpo,

        startFrame: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
        endFrame: [
          { x: 0.5, y: 0 },
          { x: 0.5, y: 0 },
          { x: 0.5, y: 1 },
          { x: 0.5, y: 1 },
        ],
      },
    },
  },
};

export default config;
