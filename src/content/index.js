import { buildFeatureCollection } from './locationAdapter';
import modules from './generated/locations';
import imageFiles from './generated/images';

export const data = buildFeatureCollection(modules);

export const getImageAsset = src => {
  if (!imageFiles[src]) throw new Error(`Image not found: ${src}`);
  return imageFiles[src];
};
