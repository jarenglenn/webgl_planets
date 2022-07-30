import { Float32BufferAttribute, SphereGeometry, Vector3 } from "three";
import Tile from "../hexaspherejs/tile";
import { Point } from "../types";
import { repeatArray } from "../util";
import { Biome, getVertexColor, scaledPoint } from "./tileUtils";

const createStoneGeometry = (position: Point) => {
  const geometry = new SphereGeometry(Math.random() * 0.3 + 0.1, 5, 7);

  const numVertices = geometry.attributes.position.count;
  const colors = repeatArray(Biome.Stone, numVertices / 3);

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3, false));
  geometry.deleteAttribute("uv");

  return geometry;
};

export function createTileDetails(tile: Tile, depthRatio: number) {
  const biome = getVertexColor(depthRatio);

  if (biome === Biome.Sand && Math.random() < 0.05) {
    const stone = createStoneGeometry({
      x: tile.centerPoint.x,
      y: tile.centerPoint.y,
      z: tile.centerPoint.z,
    });

    // translate to tile center
    const { x, y, z } = scaledPoint(tile.centerPoint, depthRatio);
    stone.lookAt(new Vector3(x, y, z));
    stone.translate(x, y, z);
  }
}
