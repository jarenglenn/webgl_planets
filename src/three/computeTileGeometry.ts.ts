import { NoiseFunction3D } from "simplex-noise";
import { BufferGeometry, Float32BufferAttribute } from "three";

import Tile from "../hexaspherejs/tile";
import { sumOctave } from "../noise";
import { IPlanetArgs } from "../types";
import { repeatArray } from "../util";
import { getVertexColor } from "./tileUtils";

function computeVertices(tile: Tile) {
  tile.checkExists("depthRatio", "computeVertices");

  const insideVertices = tile.boundary.flatMap((point) => [point.x, point.y, point.z]);
  const outsideVertices = insideVertices.map((point) => point * tile.depthRatio!);

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

function computeDepthRatio(
  tile: Tile,
  planetArgs: IPlanetArgs,
  noise3D: NoiseFunction3D
) {
  const noiseAtRadius = 20; // radius from which to sample noise even if physical radius is different

  const { x, y, z } = tile.centerPoint;
  const noise = sumOctave(noise3D, {
    numIterations: 8,
    position: { x, y, z },
    persistence: 0.5,
    frequency: planetArgs.frequency * noiseAtRadius * (1 / planetArgs.radius),
  });

  return Math.max(noise, 0.2) + 1;
}

export default function computeTileGeometry(
  tile: Tile,
  planetArgs: IPlanetArgs,
  noise3D: NoiseFunction3D
) {
  const depthRatio = computeDepthRatio(tile, planetArgs, noise3D);
  const biomeColor = getVertexColor(depthRatio);

  tile.depthRatio = depthRatio;
  tile.biome = biomeColor;

  const vertices = computeVertices(tile);
  const colors = repeatArray(biomeColor, vertices.length / 3);
  const indices = computeIndices(vertices.length > 30);

  let geometry = new BufferGeometry();

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3, false));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3, false));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
