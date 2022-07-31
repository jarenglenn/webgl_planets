import { NoiseFunction3D } from "simplex-noise";

interface SumOctaveOptions {
  numIterations: number;
  position: { x: number; y: number; z: number };
  persistence: number;
  frequency: number;
}

// https://cmaher.github.io/posts/working-with-simplex-noise/
export function sumOctave(noise3D: NoiseFunction3D, options: SumOctaveOptions) {
  let { numIterations, position: positionVector, persistence, frequency } = options;
  let { x, y, z } = positionVector;

  let maxAmplitude = 0;
  let amplitude = 1;
  let noise = 0;

  // add successively smaller, higher-frequency terms
  for (let i = 0; i < numIterations; ++i) {
    noise += noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  noise = noise / maxAmplitude; // take average value of iterations
  noise = (noise * (1 - 0)) / 2 + (1 + 0) / 2; // normalize to 0-1

  return (noise /= 2);
}
