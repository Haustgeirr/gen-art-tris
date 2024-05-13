import { Point } from '@/Utils/Types';

export interface INoiseGenerator {
  generate(): Point[];
}
