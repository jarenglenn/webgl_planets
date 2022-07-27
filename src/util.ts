import Point from "./hexaspherejs/point";
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

export function downloadFile(blob: any, filename: string): void {
  const objectUrl: string = URL.createObjectURL(blob);
  const a: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;

  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export const findCentroid = (triangle: Point[]) => {
  let x = (triangle[0].x + triangle[1].x + triangle[2].x) / 3;
  let y = (triangle[0].y + triangle[1].y + triangle[2].y) / 3;
  let z = (triangle[0].z + triangle[1].z + triangle[2].z) / 3;

  return new Point(x, y, z);
};
