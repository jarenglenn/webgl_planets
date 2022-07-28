import { BufferGeometry, Float32BufferAttribute } from "three";

import Tile from "../hexaspherejs/tile";
import { IHexasphereArgs } from "../types";

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

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

export function computeTileGeometry(tile: Tile, hexasphereArgs: IHexasphereArgs) {
  const depthRatio = getRandomArbitrary(1, hexasphereArgs.maxTileRatio);

  const vertices = computeVertices(tile, depthRatio);
  const indices = computeIndices(vertices.length > 30);
  const colors: number[] = Array(vertices.length).fill(1);

  const geometry = new BufferGeometry();

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3, false));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3, false));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
