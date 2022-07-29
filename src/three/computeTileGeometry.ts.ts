import { NoiseFunction3D } from "simplex-noise";
import { BufferGeometry, Float32BufferAttribute } from "three";

import Tile from "../hexaspherejs/tile";
import { IHexasphereArgs } from "../types";
import { hexToRGBFloatArray, repeatArray } from "../util";

function computeVertices(tile: Tile, depthRatio: number) {
  const insideVertices = tile.boundary.flatMap((point) => [point.x, point.y, point.z]);
  const outsideVertices = insideVertices.map((point) => point * depthRatio);

  return [...insideVertices, ...outsideVertices];
}

function computeIndices(isHexagon: boolean) {
  const indices = [];

  // Inside triangles
  // prettier-ignore
  indices.push(
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
  );

  let i = 5; // first index of outside triangle

  if (isHexagon) {
    indices.push(0, 4, 5);
    i++;
  }

  // Outside triangles
  // prettier-ignore
  indices.push(
    i, i + 1, i + 2,
    i, i + 2, i + 3,
    i, i + 3, i + 4,
  );

  if (isHexagon) {
    indices.push(6, 10, 11);
  }

  // Side triangles
  // prettier-ignore
  indices.push(
    0, i + 1, i,
    0, 1, i + 1,
    1, i + 2, i + 1,
    1, 2, i + 2,
    2, i + 3, i + 2,
    2, 3, i + 3,
    3, i + 4, i + 3,
    3, 4, i + 4,
  );

  if (isHexagon) {
    // prettier-ignore
    indices.push(
      5, 11, 10,
      5, 6, 11,
      4, 5, 10,
      5, 0, 6
    );
  } else {
    // prettier-ignore
    indices.push(
      4, 0, 9,
      0, 5, 9
    );
  }

  return indices;
}

interface SumOctaveOptions {
  numIterations: number;
  position: { x: number; y: number; z: number };
  persistence: number;
  frequency: number;
}

function sumOctave(noise3D: NoiseFunction3D, options: SumOctaveOptions) {
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

function computeDepthRatio(
  tile: Tile,
  hexasphereArgs: IHexasphereArgs,
  noise3D: NoiseFunction3D
) {
  const { x, y, z } = tile.centerPoint;
  const noise = sumOctave(noise3D, {
    numIterations: 8,
    position: { x, y, z },
    persistence: 0.5,
    frequency: hexasphereArgs.frequency,
  });

  return Math.max(noise, 0.2) + 1;
}

class Biome {
  static Ocean = hexToRGBFloatArray("#4287f5");
  static Sand = hexToRGBFloatArray("#feffae");
  static Grass = hexToRGBFloatArray("#31703a");
  static Stone = hexToRGBFloatArray("#83819c");
  static Snow = hexToRGBFloatArray("#eeeeee");
}

function getVertexColors(vertices: number[], depthRatio: number) {
  const color = (() => {
    if (depthRatio <= 1.2) return Biome.Ocean;
    else if (depthRatio < 1.25) return Biome.Sand;
    else if (depthRatio < 1.3) return Biome.Grass;
    else if (depthRatio < 1.35) return Biome.Stone;
    else return Biome.Snow;
  })();

  return repeatArray(color, vertices.length / 3);
}

export default function computeTileGeometry(
  tile: Tile,
  hexasphereArgs: IHexasphereArgs,
  noise3D: NoiseFunction3D
) {
  const depthRatio = computeDepthRatio(tile, hexasphereArgs, noise3D);

  const vertices = computeVertices(tile, depthRatio);
  const vertexColors = getVertexColors(vertices, depthRatio);
  const indices = computeIndices(vertices.length > 30);

  const geometry = new BufferGeometry();

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3, false));
  geometry.setAttribute("color", new Float32BufferAttribute(vertexColors, 3, false));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
