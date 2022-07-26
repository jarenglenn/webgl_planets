import Tile from "./hexaspherejs/tile";

// https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal
export function calculateTileSurfaceNormal(tile: Tile) {
  const normal = {
    x: 0,
    y: 0,
    z: 0,
  };

  for (let i = 0; i < tile.boundary.length; i++) {
    const current = tile.boundary[i];
    const next = tile.boundary[(i + 1) % tile.boundary.length];

    normal.x += (current.y - next.y) * (current.z + next.z);
    normal.y += (current.z - next.z) * (current.x + next.x);
    normal.z += (current.x - next.x) * (current.y + next.y);
  }

  return normal;
}

export const repeatArray = (arr: any[], repeats: number) =>
  Array.from({ length: repeats }, () => arr).flat();
