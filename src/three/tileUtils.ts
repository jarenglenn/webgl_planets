import { BufferAttribute, BufferGeometry, Euler, Quaternion } from "three";

import Tile from "../hexaspherejs/tile";
import { Point } from "../types";
import { hexToRGBFloatArray, randomBetween, repeatArray } from "../util";

export class Biome {
  static Ocean = hexToRGBFloatArray("#4287f5");
  static Sand = hexToRGBFloatArray("#feffae");
  static Grass = hexToRGBFloatArray("#31703a");
  static Stone = hexToRGBFloatArray("#83819c");
  static Snow = hexToRGBFloatArray("#ffffff");
}

export function getVertexColor(depthRatio: number) {
  const color = (() => {
    if (depthRatio <= 1.2) return Biome.Ocean;
    else if (depthRatio < 1.25) return Biome.Sand;
    else if (depthRatio < 1.3) return Biome.Grass;
    else if (depthRatio < 1.35) return Biome.Stone;
    else return Biome.Snow;
  })();

  return color;
}

export function scaledPoint(point: Point, depthRatio: number) {
  return {
    x: point.x * depthRatio,
    y: point.y * depthRatio,
    z: point.z * depthRatio,
  };
}

export function outerCircumradius(tile: Tile) {
  tile.checkExists("depthRatio", "outerCircumradius");
  const centerPoint = scaledPoint(tile.centerPoint, tile.depthRatio!);
  const boundaryPoint = scaledPoint(tile.boundary[0], tile.depthRatio!);

  return Math.sqrt(
    (centerPoint.x - boundaryPoint.x) ** 2 +
      (centerPoint.y - boundaryPoint.y) ** 2 +
      (centerPoint.z - boundaryPoint.z) ** 2
  );
}

export function colorGeometry(geometry: BufferGeometry, color: string) {
  const colors = repeatArray(
    hexToRGBFloatArray(color),
    geometry.attributes.position.count
  );
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
}

export function randomRotate(geometry: BufferGeometry) {
  const eulerRotation = new Euler(
    randomBetween(0, 2 * Math.PI),
    randomBetween(0, 2 * Math.PI),
    randomBetween(0, 2 * Math.PI)
  );

  const quaternion = new Quaternion().setFromEuler(eulerRotation);
  geometry.applyQuaternion(quaternion);
}
